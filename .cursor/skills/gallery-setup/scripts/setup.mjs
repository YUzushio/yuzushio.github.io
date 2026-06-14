#!/usr/bin/env node
/**
 * First-time setup for Gallery fork (fork → GitHub Pages deploy prep).
 *
 * Usage:
 *   node .cursor/skills/gallery-setup/scripts/setup.mjs
 *   node .cursor/skills/gallery-setup/scripts/setup.mjs --non-interactive \
 *     --user you --title "Your Gallery" --author "Your Name" \
 *     --description "..." --pages user
 */
import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GALLERY_ROOT = path.resolve(__dirname, "../../../..");
const GALLERY_JSON = path.join(GALLERY_ROOT, "public/data/gallery.json");
const VITE_CONFIG = path.join(GALLERY_ROOT, "vite.config.ts");

function parseArgs(argv) {
  const opts = { nonInteractive: false, force: false, skipNpm: false, pages: "user" };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--non-interactive") opts.nonInteractive = true;
    else if (arg === "--force") opts.force = true;
    else if (arg === "--skip-npm") opts.skipNpm = true;
    else if (arg === "--user" && argv[i + 1]) opts.githubUser = argv[++i];
    else if (arg === "--title" && argv[i + 1]) opts.title = argv[++i];
    else if (arg === "--author" && argv[i + 1]) opts.author = argv[++i];
    else if (arg === "--description" && argv[i + 1]) opts.description = argv[++i];
    else if (arg === "--pages" && argv[i + 1]) opts.pages = argv[++i];
    else if (arg === "--repo-name" && argv[i + 1]) opts.repoName = argv[++i];
    else if (arg === "--remote" && argv[i + 1]) opts.gitRemote = argv[++i];
  }
  return opts;
}

function ask(rl, question, defaultValue = "") {
  const suffix = defaultValue ? ` [${defaultValue}]` : "";
  return new Promise((resolve) => {
    rl.question(`${question}${suffix}: `, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

function askYesNo(rl, question, defaultYes = false) {
  const hint = defaultYes ? " [Y/n]" : " [y/N]";
  return new Promise((resolve) => {
    rl.question(`${question}${hint}: `, (answer) => {
      const a = answer.trim().toLowerCase();
      if (!a) return resolve(defaultYes);
      resolve(a === "y" || a === "yes");
    });
  });
}

function getGitRemote() {
  try {
    return execFileSync("git", ["remote", "get-url", "origin"], {
      cwd: GALLERY_ROOT,
      encoding: "utf8",
    }).trim();
  } catch {
    return "";
  }
}

function parseGithubRepo(remote) {
  if (!remote) return null;
  const m = remote.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
  if (!m) return null;
  return { owner: m[1], repo: m[2].replace(/\.git$/, "") };
}

function siteUrlFor(pagesMode, githubUser, repoName) {
  if (pagesMode === "project") {
    const repo = repoName || "gallery";
    return `https://${githubUser}.github.io/${repo}/`;
  }
  return `https://${githubUser}.github.io/`;
}

function viteBaseFor(pagesMode, repoName) {
  if (pagesMode === "project") {
    const repo = repoName || "gallery";
    return `/${repo}/`;
  }
  return "/";
}

function isTemplateMeta(meta) {
  return meta?.author === "YUzushio" && meta?.title === "YUzushio Gallery";
}

async function promptConfig(opts) {
  const data = JSON.parse(fs.readFileSync(GALLERY_JSON, "utf8"));
  const meta = data.meta || {};
  const remote = opts.gitRemote || getGitRemote();
  const parsed = parseGithubRepo(remote);
  const defaultUser = opts.githubUser || parsed?.owner || "your-github-user";
  const defaultRepo = opts.repoName || parsed?.repo || "your-github-user.github.io";

  if (opts.nonInteractive) {
    if (!opts.githubUser || !opts.title || !opts.author) {
      throw new Error("Non-interactive mode requires --user, --title, and --author");
    }
    const pagesMode = opts.pages === "project" ? "project" : "user";
    const repoName = pagesMode === "project" ? opts.repoName || parsed?.repo || "gallery" : defaultRepo;
    return {
      githubUser: opts.githubUser,
      title: opts.title,
      author: opts.author,
      description: opts.description || meta.description || "Personal portfolio gallery",
      pagesMode,
      repoName,
      gitRemote: remote,
      runInstall: !opts.skipNpm,
      runBuild: !opts.skipNpm,
    };
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log("\n--- Gallery fork セットアップ ---");
  console.log("User Pages: 公開 URL https://{user}.github.io/ · リポ名 {user}.github.io が必要\n");

  const githubUser = await ask(rl, "GitHub ユーザー名", defaultUser);
  const pagesAnswer = await ask(rl, "Pages 方式 (user / project)", "user");
  const pagesMode = pagesAnswer.toLowerCase().startsWith("p") ? "project" : "user";
  let repoName = defaultRepo;
  if (pagesMode === "project") {
    repoName = await ask(rl, "Project Pages のリポジトリ名", parsed?.repo || "gallery");
  }

  const title = await ask(rl, "Gallery タイトル", opts.title || `${githubUser} Gallery`);
  const author = await ask(rl, "作者名", opts.author || githubUser);
  const description = await ask(
    rl,
    "サイト説明（1行）",
    meta.description?.slice(0, 80) || "Personal portfolio gallery"
  );

  const runInstall = await askYesNo(rl, "npm install を実行しますか？", true);
  const runBuild = runInstall && (await askYesNo(rl, "npm run build でビルド確認しますか？", true));

  rl.close();

  return {
    githubUser,
    title,
    author,
    description,
    pagesMode,
    repoName,
    gitRemote: remote,
    runInstall,
    runBuild,
  };
}

function updateGalleryMeta(config) {
  const data = JSON.parse(fs.readFileSync(GALLERY_JSON, "utf8"));
  data.meta = {
    ...data.meta,
    title: config.title,
    author: config.author,
    description: config.description,
    siteUrl: siteUrlFor(config.pagesMode, config.githubUser, config.repoName),
  };
  fs.writeFileSync(GALLERY_JSON, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function updateViteBase(base) {
  let content = fs.readFileSync(VITE_CONFIG, "utf8");
  const next = content.replace(/base:\s*['"][^'"]*['"]/, `base: '${base}'`);
  if (next === content) {
    throw new Error("Could not update base in vite.config.ts");
  }
  fs.writeFileSync(VITE_CONFIG, next, "utf8");
}

function warnRepoName(config) {
  const parsed = parseGithubRepo(config.gitRemote);
  if (!parsed) {
    console.warn("\n⚠ git remote origin が未設定、または GitHub URL ではありません。");
    console.warn("  clone 後: git remote add origin https://github.com/<user>/<repo>.git");
    return;
  }

  if (config.pagesMode === "user") {
    const expected = `${config.githubUser}.github.io`;
    if (parsed.repo !== expected) {
      console.warn(`\n⚠ User Pages: リポ名は \`${expected}\` である必要があります（現在: \`${parsed.repo}\`）`);
      console.warn(`  GitHub → Settings → General → Repository name でリネームしてください。`);
      console.warn(`  https://github.com/${parsed.owner}/${parsed.repo}/settings`);
    } else {
      console.log(`\n✓ リポ名 OK: ${parsed.repo}`);
    }
  } else {
    console.log(`\nProject Pages: ${parsed.owner}/${parsed.repo} → base /${config.repoName}/`);
    if (parsed.repo !== config.repoName) {
      console.warn(`  注意: ローカル remote のリポ名 (${parsed.repo}) と入力 repo-name (${config.repoName}) が異なります。`);
    }
  }
}

function printDeployChecklist(config) {
  const url = siteUrlFor(config.pagesMode, config.githubUser, config.repoName);
  console.log("\n--- デプロイまでの残り作業 ---");
  if (config.pagesMode === "user") {
    console.log(`1. GitHub でリポ名が ${config.githubUser}.github.io であることを確認`);
  }
  console.log("2. Settings → Pages → Build and deployment → GitHub Actions");
  console.log("3. 変更を commit · push:");
  console.log("     git add public/data/gallery.json vite.config.ts");
  console.log("     git commit -m \"chore: customize gallery meta for GitHub Pages\"");
  console.log("     git push -u origin main");
  console.log("4. Actions タブで Deploy Gallery to GitHub Pages が成功するまで待つ");
  console.log(`5. 公開確認: ${url}`);
  console.log("\nコンテンツ編集: @gallery-content");
  console.log("Wiki 連携: my-atelier-vault @gallery-vault-sender → @gallery-vault-receiver");
}

async function main() {
  if (!fs.existsSync(GALLERY_JSON)) {
    throw new Error(`gallery.json not found: ${GALLERY_JSON}`);
  }

  const opts = parseArgs(process.argv);
  const data = JSON.parse(fs.readFileSync(GALLERY_JSON, "utf8"));

  if (!opts.force && !isTemplateMeta(data.meta) && !opts.nonInteractive) {
    console.log("gallery.json meta はすでにカスタマイズ済みのようです。");
    console.log(`  title: ${data.meta?.title}`);
    console.log("  上書きする場合: --force");
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const cont = await askYesNo(rl, "続行しますか？", false);
    rl.close();
    if (!cont) process.exit(0);
  }

  const config = await promptConfig(opts);
  const base = viteBaseFor(config.pagesMode, config.repoName);

  updateGalleryMeta(config);
  console.log(`\nUpdated ${GALLERY_JSON}`);
  console.log(`  siteUrl: ${siteUrlFor(config.pagesMode, config.githubUser, config.repoName)}`);

  if (config.pagesMode === "project" || base !== "/") {
    updateViteBase(base);
    console.log(`Updated ${VITE_CONFIG} → base: '${base}'`);
  } else if (fs.readFileSync(VITE_CONFIG, "utf8").includes("base: '/'")) {
    console.log("vite.config.ts base: '/' （User Pages · 変更不要）");
  }

  warnRepoName(config);

  if (config.runInstall) {
    console.log("\nRunning npm install...");
    execFileSync("npm", ["install"], { cwd: GALLERY_ROOT, stdio: "inherit" });
  }

  if (config.runBuild) {
    console.log("\nRunning npm run build...");
    execFileSync("npm", ["run", "build"], { cwd: GALLERY_ROOT, stdio: "inherit" });
    console.log("✓ Build OK");
  }

  printDeployChecklist(config);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
