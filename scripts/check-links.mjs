#!/usr/bin/env node
/**
 * Ichki havolalar tekshiruvi — QURILGAN chiqish (`dist/`) ustida.
 *
 * ⚠ NEGA MANBA EMAS, `dist/`: manba markdown'ida havola to'g'ri
 * ko'rinishi mumkin, lekin marshrut i18n prefiksi, `trailingSlash`
 * yoki sahifa nomi tufayli boshqa joyga tushadi. Faqat qurilgan
 * chiqish HAQIQATNI biladi.
 *
 * Buzilgan havola — hujjatdagi eng ko'p uchraydigan nosozlik va u
 * dasturchini aynan kerakli paytda to'xtatadi.
 *
 * Oldindan `astro build` bajarilgan bo'lishi shart.
 * Exit: 0 — hammasi joyida; 1 — buzilgan havola bor.
 */
import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIST = fileURLToPath(new URL("../dist/", import.meta.url));

if (!existsSync(DIST)) {
  console.error("[links] `dist/` yo'q — avval `npm run build` bajaring.");
  process.exit(1);
}

async function* html(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* html(full);
    else if (e.name.endsWith(".html")) yield full;
  }
}

// Marshrut mavjudmi: `/a/b/` → `dist/a/b/index.html`
function mavjud(route) {
  const clean = route.split("#")[0].split("?")[0];
  const rel = clean.replace(/^\//, "");
  return (
    existsSync(path.join(DIST, rel, "index.html")) ||
    existsSync(path.join(DIST, rel)) ||
    existsSync(path.join(DIST, rel.replace(/\/$/, "") + ".html"))
  );
}

const buzuq = [];
let jami = 0;
let sahifalar = 0;

for await (const file of html(DIST)) {
  sahifalar++;
  const raw = await readFile(file, "utf8");
  const manba = path.relative(DIST, file);

  for (const m of raw.matchAll(/href="(\/[^"#][^"]*)"/g)) {
    const href = m[1];
    // Tashqi, aktiv va statik resurslar e'tiborsiz.
    if (/^\/(_astro|pagefind|favicon|sitemap|assets)/.test(href)) continue;
    if (/\.(css|js|png|jpe?g|svg|webp|woff2?|xml|txt|ico|json)$/.test(href)) continue;
    jami++;
    if (!mavjud(href)) buzuq.push(`${manba} → ${href}`);
  }
}

if (buzuq.length) {
  const noyob = [...new Set(buzuq)];
  console.error(`[links] ${noyob.length} buzuq havola:\n`);
  for (const b of noyob) console.error("  " + b);
  process.exit(1);
}
console.log(`[links] ${sahifalar} sahifa · ${jami} ichki havola — hammasi joyida.`);
