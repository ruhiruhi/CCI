/**
 * Converts Day1image JPG/HEIC sources to optimized WebP in public/images/day1.
 * Run: node scripts/ingest-day1-images.mjs
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";
import convert from "heic-convert";

const srcDir = path.resolve("Day1image/Day 1");
const outDir = path.resolve("public/images/day1");

fs.mkdirSync(outDir, { recursive: true });

const files = fs
  .readdirSync(srcDir)
  .filter((f) => /\.(jpe?g|heic)$/i.test(f))
  .sort();

for (const file of files) {
  const base = file.replace(/\.[^.]+$/, "").toLowerCase();
  const output = path.join(outDir, `${base}.webp`);
  let pipeline;
  if (/\.heic$/i.test(file)) {
    const jpegBuffer = await convert({
      buffer: fs.readFileSync(path.join(srcDir, file)),
      format: "JPEG",
      quality: 0.92,
    });
    pipeline = sharp(jpegBuffer);
  } else {
    pipeline = sharp(path.join(srcDir, file));
  }
  await pipeline
    .rotate()
    .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toFile(output);
  console.log("wrote", path.relative(process.cwd(), output));
}

console.log(`Done — ${files.length} images in public/images/day1/`);
