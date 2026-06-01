// One-off image optimizer for chaletdutornet.com — run with `node tools/gen-images.mjs`.
// Produces responsive width variants for the gallery <picture> set, shrinks oversized
// in-place JPGs (feature cards, plats, social, domaine), the logo, and favicons.
import sharp from 'sharp';
import { existsSync, statSync, copyFileSync } from 'node:fs';

sharp.cache(false);
const KB = (p) => existsSync(p) ? (statSync(p).size / 1024).toFixed(0) + 'KB' : '—';
const firstExisting = (cands) => cands.find(existsSync);
let saved = 0;
const before = {};
const snap = (p) => { if (existsSync(p)) before[p] = statSync(p).size; };

// ---- A. Gallery: responsive variants (480/800/1200/1600) in AVIF + WebP -------------
const galleryBases = [
  'feat-table-fleurs', 'feat-terrasse-lac', 'feat-aire-jeux', 'feat-interieur',
  'feat-terrasse-entree', 'feat-entree', 'feat-table-lac', 'feat-salle-etage',
];
const widths = [480, 800, 1200, 1600];

async function gallery() {
  for (const base of galleryBases) {
    const src = firstExisting([
      `${base}.jpg`, `${base}-1600.jpg`, `${base}-1600.webp`, `${base}-1600.avif`,
    ]);
    if (!src) { console.log(`! no source for ${base}`); continue; }
    const srcBuf = await sharp(src).rotate().toBuffer(); // decode once; avoid same-file in/out
    for (const w of widths) {
      const suffix = w === 1600 ? '-1600' : `-${w}`;
      const avif = `${base}${suffix}.avif`;
      const webp = `${base}${suffix}.webp`;
      snap(avif); snap(webp);
      const pipe = sharp(srcBuf).resize({ width: w, withoutEnlargement: true });
      await pipe.clone().avif({ quality: 50, effort: 4 }).toFile(avif);
      await pipe.clone().webp({ quality: 74 }).toFile(webp);
    }
    console.log(`gallery ${base.padEnd(22)} src=${src} -> 480/800/1200/1600 avif+webp`);
  }
}

// ---- B. In-place JPG shrink (no markup change) --------------------------------------
async function shrinkJpg(file, maxW, q = 74) {
  if (!existsSync(file)) return;
  snap(file);
  const buf = await sharp(file).rotate().resize({ width: maxW, withoutEnlargement: true })
    .jpeg({ quality: q, mozjpeg: true }).toBuffer();
  const { writeFileSync } = await import('node:fs');
  writeFileSync(file, buf);
}

const featureCards = [
  'feat-lac', 'feat-pumptrack', 'feat-workout', 'feat-fitness', 'feat-aire-jeux',
  'feat-petanque', 'feat-ponton', 'feat-jardins', 'feat-camping-car', 'feat-velos',
  'feat-parking', 'feat-pique-nique',
].map((b) => `${b}.jpg`);
const plats = [
  'plat-burger', 'plat-boucher', 'plat-boucher-1', 'plat-boucher-2', 'plat-stjacques',
  'plat-planche', 'plat-terrine', 'plat-creme-lard',
].map((b) => `${b}.jpg`);

async function inPlace() {
  for (const f of featureCards) await shrinkJpg(f, 1100, 72);
  for (const f of plats) await shrinkJpg(f, 900, 74);
  await shrinkJpg('domaine-cerisiers.jpg', 1600, 74);
  await shrinkJpg('og-image.jpg', 1200, 80);
  console.log('in-place JPGs shrunk (feature cards, plats, domaine, og-image)');
}

// ---- C. Logo (512 -> 192) -----------------------------------------------------------
async function logo() {
  if (!existsSync('logo.png')) return;
  snap('logo.png');
  const buf = await sharp('logo.png').resize(192, 192, { fit: 'cover' }).png({ compressionLevel: 9 }).toBuffer();
  const { writeFileSync } = await import('node:fs');
  writeFileSync('logo.png', buf);
  await sharp(buf).webp({ quality: 82 }).toFile('logo.webp');
  console.log('logo.png -> 192x192, logo.webp regenerated');
}

// ---- D. Favicons (fix 404s referenced in <head>) ------------------------------------
async function favicons() {
  const src = firstExisting(['icon-512.png', 'logo.png']);
  if (src) {
    await sharp(src).resize(32, 32).png().toFile('favicon-32.png');
    await sharp(src).resize(16, 16).png().toFile('favicon-16.png');
    console.log('favicon-16.png / favicon-32.png generated from', src);
  }
  // sharp can't write .ico; reuse an existing valid icon so /favicon.ico resolves.
  const ico = firstExisting(['favicon-1.ico', 'favicon-2.ico']);
  if (ico && !existsSync('favicon.ico')) { copyFileSync(ico, 'favicon.ico'); console.log('favicon.ico <-', ico); }
}

await gallery();
await inPlace();
await logo();
await favicons();

for (const p of Object.keys(before)) {
  const now = existsSync(p) ? statSync(p).size : 0;
  saved += before[p] - now;
}
console.log(`\nApprox bytes saved on touched-in-place files: ${(saved / 1024).toFixed(0)} KB`);
console.log('Done.');
