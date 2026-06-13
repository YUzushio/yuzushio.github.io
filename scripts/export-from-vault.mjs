#!/usr/bin/env node
/**
 * Optional local tool: reads Atelier-Vault Backroom frontmatter and prints
 * a draft gallery.json to stdout. Run from gallery repo root:
 *
 *   node scripts/export-from-vault.mjs > public/data/gallery.draft.json
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const vaultRoot = join(__dirname, '..', '..', 'Atelier-Vault', 'Backroom')

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}

  const data = {}
  for (const line of match[1].split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const colon = trimmed.indexOf(':')
    if (colon === -1) continue

    const key = trimmed.slice(0, colon).trim()
    let value = trimmed.slice(colon + 1).trim()

    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((part) => part.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
    } else {
      value = value.replace(/^['"]|['"]$/g, '')
    }

    data[key] = value
  }

  return data
}

function walkIndexFiles(dir, results = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    const stats = statSync(fullPath)

    if (stats.isDirectory()) {
      walkIndexFiles(fullPath, results)
      continue
    }

    if (entry === '_index.md') {
      results.push(fullPath)
    }
  }

  return results
}

const files = walkIndexFiles(vaultRoot)
const galleryItems = []

for (const file of files) {
  const content = readFileSync(file, 'utf8')
  const fm = parseFrontmatter(content)

  if (fm.gallery !== true && fm.gallery !== 'true') continue

  const slug = file.split(/[/\\]/).slice(-2, -1)[0]
  galleryItems.push({
    slug,
    project: fm.project,
    year: fm.year ? Number(fm.year) : undefined,
    tags: fm.tags,
    platform: fm.platform,
    github: fm.github,
    site: fm.site,
    youtube: fm.youtube,
    url: fm.url,
  })
}

console.log(
  JSON.stringify(
    {
      note: 'Draft export — merge manually into public/data/gallery.json',
      exportedAt: new Date().toISOString(),
      items: galleryItems,
    },
    null,
    2,
  ),
)
