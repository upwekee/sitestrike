/**
 * Image optimization script for STRIKE website
 * - Resizes to max 1920px wide (preserving aspect ratio)
 * - Converts JPEG/PNG to high-quality compressed JPEG (photos keep .jpg, renders to .webp)
 * - Original files are KEPT in public/ but optimized versions go to public/ (overwrite)
 * - Skips already-small files (< 150 KB)
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', 'public');

// Config per folder type
const RULES = [
  {
    dir: path.join(BASE, 'photos'),
    maxWidth: 1920,
    maxHeight: 1280,
    format: 'jpeg',
    quality: 82,
    skipIfSmaller: 150 * 1024,  // skip if < 150 KB
  },
  {
    dir: path.join(BASE, 'media', 'akcii'),
    maxWidth: 1400,
    maxHeight: 1000,
    format: 'jpeg',
    quality: 80,
    skipIfSmaller: 100 * 1024,
  },
  {
    dir: path.join(BASE, 'media', 'food'),
    maxWidth: 800,
    maxHeight: 800,
    format: 'jpeg',
    quality: 78,
    skipIfSmaller: 80 * 1024,
  },
  {
    dir: path.join(BASE, 'media', 'hardware'),
    maxWidth: 1400,
    maxHeight: 1000,
    format: 'jpeg',
    quality: 80,
    skipIfSmaller: 100 * 1024,
  },
  {
    dir: path.join(BASE, 'renders'),
    maxWidth: 1200,
    maxHeight: 1200,
    format: 'webp',
    quality: 85,
    skipIfSmaller: 60 * 1024,
  },
];

async function getAllImages(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const result = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      result.push(...await getAllImages(full));
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(e.name)) {
      result.push(full);
    }
  }
  return result;
}

async function optimizeFile(filePath, rule) {
  const stat = fs.statSync(filePath);

  // Skip tiny files — already small enough
  if (stat.size < rule.skipIfSmaller) {
    return { skipped: true, reason: 'already small', savedBytes: 0 };
  }

  const originalSize = stat.size;
  const ext = path.extname(filePath).toLowerCase();

  // Determine output path
  // For renders: change extension to .webp if converting
  let outPath = filePath;
  if (rule.format === 'webp' && ext !== '.webp') {
    outPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }

  // Write to temp first, then replace
  const tmpPath = filePath + '.tmp';

  try {
    let pipeline = sharp(filePath).resize({
      width: rule.maxWidth,
      height: rule.maxHeight,
      fit: 'inside',       // never upscale, just fit within bounds
      withoutEnlargement: true,
    });

    if (rule.format === 'jpeg') {
      pipeline = pipeline.jpeg({ quality: rule.quality, progressive: true, mozjpeg: true });
    } else if (rule.format === 'webp') {
      pipeline = pipeline.webp({ quality: rule.quality });
    }

    await pipeline.toFile(tmpPath);

    const newSize = fs.statSync(tmpPath).size;

    // Only replace if optimized version is smaller
    if (newSize < originalSize) {
      fs.renameSync(tmpPath, outPath);
      // If output path changed (jpg→webp), remove original
      if (outPath !== filePath) {
        fs.unlinkSync(filePath);
      }
      return { skipped: false, originalSize, newSize, savedBytes: originalSize - newSize };
    } else {
      // Optimization made it bigger (rare), keep original
      fs.unlinkSync(tmpPath);
      return { skipped: true, reason: 'no gain', savedBytes: 0 };
    }
  } catch (err) {
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    return { skipped: true, reason: err.message, savedBytes: 0 };
  }
}

async function main() {
  let totalSaved = 0;
  let totalProcessed = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const rule of RULES) {
    console.log(`\n📁 Processing: ${path.relative(BASE, rule.dir)}`);
    const files = await getAllImages(rule.dir);
    console.log(`   Found ${files.length} images`);

    for (const file of files) {
      const rel = path.relative(BASE, file);
      const result = await optimizeFile(file, rule);

      if (result.skipped) {
        totalSkipped++;
        process.stdout.write('·');
      } else {
        totalProcessed++;
        totalSaved += result.savedBytes;
        const pct = Math.round((1 - result.newSize / result.originalSize) * 100);
        const fromKB = Math.round(result.originalSize / 1024);
        const toKB = Math.round(result.newSize / 1024);
        process.stdout.write(`\n   ✓ ${path.basename(rel)}: ${fromKB} KB → ${toKB} KB (-${pct}%)`);
      }
    }
  }

  console.log('\n\n════════════════════════════════════════');
  console.log(`✅ DONE`);
  console.log(`   Processed: ${totalProcessed} files`);
  console.log(`   Skipped:   ${totalSkipped} files (already small or no gain)`);
  console.log(`   Saved:     ${Math.round(totalSaved / 1024 / 1024 * 10) / 10} MB`);
  console.log('════════════════════════════════════════\n');
}

main().catch(console.error);
