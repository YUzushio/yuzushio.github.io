#!/usr/bin/env node
/**
 * Resolve SNS profile / channel avatars and SoundCloud track metadata (thumbnail, publishedAt).
 * Run before build: node scripts/resolve-sns-avatars.mjs [--force]
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const jsonPath = join(root, 'public', 'data', 'gallery.json')
const outDir = join(root, 'public', 'assets', 'thumbnails', 'sns')
const soundcloudOutDir = join(root, 'public', 'assets', 'thumbnails', 'soundcloud')
const force = process.argv.includes('--force')

const SOUNDCLOUD_PLACEHOLDER_RE = /fb_placeholder/i

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

const YOUTUBE_CHANNEL_RE = /youtube\.com\/(?:@|channel\/)/i
const X_PROFILE_RE = /^https?:\/\/(?:x\.com|twitter\.com)\/[^/?#]+/i
const PIXIV_USER_RE = /^https?:\/\/(?:www\.)?pixiv\.net\/users\/\d+/i
const NOTE_PROFILE_RE = /^https?:\/\/note\.com\/[^/?#]+/i
const VROID_USER_RE = /^https?:\/\/hub\.vroid\.com\/users\/\d+/i

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function imageExtension(url) {
  const path = url.split('?')[0].toLowerCase()
  if (path.endsWith('.png')) return 'png'
  if (path.endsWith('.webp')) return 'webp'
  if (path.endsWith('.gif')) return 'gif'
  return 'jpg'
}

function isSoundCloudProfileUrl(url) {
  try {
    const { hostname, pathname } = new URL(url)
    if (hostname !== 'soundcloud.com') return false
    const parts = pathname.split('/').filter(Boolean)
    return parts.length === 1
  } catch {
    return false
  }
}

function isSoundCloudTrackUrl(url) {
  try {
    const { hostname, pathname } = new URL(url)
    if (hostname !== 'soundcloud.com') return false
    const parts = pathname.split('/').filter(Boolean)
    return parts.length === 2
  } catch {
    return false
  }
}

function isQiitaProfileUrl(url) {
  try {
    const { hostname, pathname } = new URL(url)
    if (!/(?:^|\.)qiita\.com$/i.test(hostname)) return false
    const parts = pathname.split('/').filter(Boolean)
    return parts.length === 1
  } catch {
    return false
  }
}

function isZennProfileUrl(url) {
  try {
    const { hostname, pathname } = new URL(url)
    if (hostname !== 'zenn.dev') return false
    const parts = pathname.split('/').filter(Boolean)
    return parts.length === 1
  } catch {
    return false
  }
}

function findParentThumbnail(gallery, item) {
  if (!item.parentId) return null
  const parent = gallery.items.find((entry) => entry.id === item.parentId)
  if (!parent) return null
  if (parent.thumbnail) return parent.thumbnail
  return findParentThumbnail(gallery, parent)
}

async function fetchHtml(url, extraHeaders = {}) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
      ...extraHeaders,
    },
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`Fetch failed (${res.status})`)
  return res.text()
}

async function fetchOgImage(url, extraHeaders = {}) {
  const html = await fetchHtml(url, extraHeaders)
  const ogMatch = html.match(/property="og:image"\s+content="([^"]+)"/)
  if (ogMatch?.[1]) return decodeHtml(ogMatch[1])

  const twitterMatch = html.match(/name="twitter:image"\s+content="([^"]+)"/)
  if (twitterMatch?.[1]) return decodeHtml(twitterMatch[1])

  throw new Error('og:image not found')
}

async function fetchSoundCloudAvatar(url) {
  const res = await fetch(
    `https://soundcloud.com/oembed?url=${encodeURIComponent(url)}&format=json`,
  )
  if (!res.ok) throw new Error(`SoundCloud oEmbed failed (${res.status})`)
  const data = await res.json()
  if (!data.thumbnail_url) throw new Error('SoundCloud oEmbed missing thumbnail_url')
  return data.thumbnail_url
}

function parseSoundCloudTrackDate(html) {
  const created =
    html.match(/"created_at":"([^"]+)"/)?.[1] ??
    html.match(/"display_date":"([^"]+)"/)?.[1]
  if (!created) return null

  const date = new Date(created)
  if (Number.isNaN(date.getTime())) return null

  return {
    publishedAt: created.slice(0, 10),
    year: date.getUTCFullYear(),
  }
}

async function resolveSoundCloudTrack(item, gallery, { resolveThumbnail, resolveDate }) {
  const url = item.url
  let html = null

  if (resolveDate) {
    html = await fetchHtml(url)
    const dates = parseSoundCloudTrackDate(html)
    if (!dates) {
      throw new Error('SoundCloud track created_at not found')
    }
    item.publishedAt = dates.publishedAt
    item.year = dates.year
    console.log(`[date] ${item.id} -> ${item.publishedAt}`)
  }

  if (!resolveThumbnail) return

  const thumbnailUrl = await fetchSoundCloudAvatar(url)

  if (SOUNDCLOUD_PLACEHOLDER_RE.test(thumbnailUrl)) {
    const parentThumbnail = findParentThumbnail(gallery, item)
    if (!parentThumbnail) {
      throw new Error('SoundCloud track has no artwork and parent thumbnail is missing')
    }
    item.thumbnail = parentThumbnail
    console.log(`[ok] ${item.id} -> ${item.thumbnail} (channel fallback)`)
    return
  }

  mkdirSync(soundcloudOutDir, { recursive: true })
  const ext = imageExtension(thumbnailUrl)
  const fileName = `${item.slug}.${ext}`
  const destPath = join(soundcloudOutDir, fileName)
  await downloadImage(thumbnailUrl, destPath)
  item.thumbnail = `/assets/thumbnails/soundcloud/${fileName}`
  console.log(`[ok] ${item.id} -> ${item.thumbnail}`)
}

async function fetchYouTubeChannelAvatar(url) {
  const html = await fetchHtml(url, {
    Accept: 'text/html,application/xhtml+xml',
  })

  const avatarMatch = html.match(
    /"avatar"\s*:\s*\{[^}]*"thumbnails"\s*:\s*\[\s*\{\s*"url"\s*:\s*"([^"]+)"/,
  )
  if (avatarMatch?.[1]) {
    return decodeHtml(avatarMatch[1])
  }

  return fetchOgImage(url)
}

async function fetchVroidHubAvatar(url) {
  try {
    return await fetchOgImage(url, {
      Accept: 'text/html,application/xhtml+xml',
      Referer: 'https://hub.vroid.com/',
    })
  } catch {
    const userId = url.match(/\/users\/(\d+)/)?.[1]
    if (!userId) throw new Error('VRoid user id not found')
    return fetchOgImage(`https://www.pixiv.net/users/${userId}`)
  }
}

async function resolveAvatarUrl(url) {
  if (YOUTUBE_CHANNEL_RE.test(url)) {
    return fetchYouTubeChannelAvatar(url)
  }
  if (isSoundCloudProfileUrl(url)) {
    return fetchSoundCloudAvatar(url)
  }
  if (X_PROFILE_RE.test(url)) {
    return fetchOgImage(url)
  }
  if (PIXIV_USER_RE.test(url)) {
    return fetchOgImage(url)
  }
  if (NOTE_PROFILE_RE.test(url)) {
    return fetchOgImage(url)
  }
  if (isQiitaProfileUrl(url)) {
    return fetchOgImage(url)
  }
  if (isZennProfileUrl(url)) {
    return fetchOgImage(url)
  }
  if (VROID_USER_RE.test(url)) {
    return fetchVroidHubAvatar(url)
  }
  return null
}

async function downloadImage(url, destPath) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Referer: url },
  })
  if (!res.ok) throw new Error(`Image download failed (${res.status})`)
  const buffer = Buffer.from(await res.arrayBuffer())
  writeFileSync(destPath, buffer)
}

const gallery = JSON.parse(readFileSync(jsonPath, 'utf8'))
mkdirSync(outDir, { recursive: true })

let updated = 0

for (const item of gallery.items) {
  const url = item.url
  if (!url) continue

  try {
    if (isSoundCloudTrackUrl(url)) {
      const resolveThumbnail = !item.thumbnail || force
      const resolveDate = !item.publishedAt || force
      if (!resolveThumbnail && !resolveDate) continue

      await resolveSoundCloudTrack(item, gallery, {
        resolveThumbnail,
        resolveDate,
      })
      updated += 1
      continue
    }

    if (item.thumbnail && !force) continue

    const avatarUrl = await resolveAvatarUrl(url)
    if (!avatarUrl) continue

    const ext = imageExtension(avatarUrl)
    const fileName = `${item.slug}.${ext}`
    const destPath = join(outDir, fileName)

    await downloadImage(avatarUrl, destPath)
    item.thumbnail = `/assets/thumbnails/sns/${fileName}`
    updated += 1
    console.log(`[ok] ${item.id} -> ${item.thumbnail}`)
  } catch (error) {
    console.warn(`[skip] ${item.id}: ${error instanceof Error ? error.message : error}`)
  }
}

writeFileSync(jsonPath, `${JSON.stringify(gallery, null, 2)}\n`)
console.log(`Updated ${updated} SoundCloud / SNS item(s).`)
