// Generates scraper-safe 1200x630 cover.jpg next to every cover.webp.
// WhatsApp/Messenger/Facebook/LinkedIn do not reliably render WebP as an OG
// image, so social previews need a JPG/PNG. Idempotent: only (re)builds a
// cover.jpg when it is missing or older than its cover.webp.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ARTICLES_DIR = path.join(__dirname, '..', 'public', 'images', 'articles')

const OG_WIDTH = 1200
const OG_HEIGHT = 630
const JPEG_QUALITY = 82

/** Recursively collect every cover.webp under ARTICLES_DIR. */
function findCoverWebps(dir) {
  const out = []
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...findCoverWebps(full))
    } else if (entry.name === 'cover.webp') {
      out.push(full)
    }
  }
  return out
}

/** True when jpg is missing or older than the source webp. */
function needsRebuild(webpPath, jpgPath) {
  if (!fs.existsSync(jpgPath)) return true
  return fs.statSync(jpgPath).mtimeMs < fs.statSync(webpPath).mtimeMs
}

async function main() {
  const webps = findCoverWebps(ARTICLES_DIR)
  let generated = 0
  let skipped = 0

  for (const webpPath of webps) {
    const jpgPath = path.join(path.dirname(webpPath), 'cover.jpg')
    if (!needsRebuild(webpPath, jpgPath)) {
      skipped++
      continue
    }
    await sharp(webpPath)
      .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: JPEG_QUALITY })
      .toFile(jpgPath)
    generated++
  }

  console.log(
    `[og-covers] ${webps.length} covers found — ${generated} generated, ${skipped} up to date.`
  )
}

main().catch((err) => {
  console.error('[og-covers] failed:', err)
  process.exit(1)
})
