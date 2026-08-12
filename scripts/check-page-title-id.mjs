#!/usr/bin/env node
/**
 * Drift qo'riqchisi: `PageTitle.astro` dagi qotirilgan `_top` qiymati
 * Starlight'ning haqiqiy `PAGE_TITLE_ID` si bilan mos kelyaptimi.
 *
 * ⚠ NEGA QOTIRILGAN: `@astrojs/starlight/constants` PUBLIC eksport emas —
 * uni import qilish build'ni yiqitadi (sinovdan o'tgan). Nusxa olish
 * yagona yo'l, lekin nusxa JIM eskirishi mumkin.
 *
 * Nima buziladi, agar mos kelmasa: sarlavha `id` si o'zgaradi, ya'ni
 * "Skip to content" havolasi va sahifa ichidagi `#_top` yakori ishlamay
 * qoladi — klaviatura bilan ishlaydigan foydalanuvchi uchun regressiya.
 */
import { readFile } from "node:fs/promises";

// ⚠ To'g'ridan-to'g'ri YO'L bilan: `require.resolve` ishlamaydi, chunki
// Starlight `./package.json` ni ham eksport qilmaydi (sinovdan o'tgan).
const upstream = await readFile(
  new URL("../node_modules/@astrojs/starlight/constants.ts", import.meta.url),
  "utf8",
);
const m = upstream.match(/PAGE_TITLE_ID\s*=\s*['"]([^'"]+)['"]/);
if (!m) {
  console.error("[check] Starlight `constants.ts` da PAGE_TITLE_ID topilmadi — tuzilma o'zgargan?");
  process.exit(1);
}

const ours = await readFile(new URL("../src/components/PageTitle.astro", import.meta.url), "utf8");
const n = ours.match(/const PAGE_TITLE_ID\s*=\s*['"]([^'"]+)['"]/);
if (!n) {
  console.error("[check] PageTitle.astro da qotirilgan PAGE_TITLE_ID topilmadi.");
  process.exit(1);
}

if (m[1] !== n[1]) {
  console.error(
    `[check] MOS EMAS: Starlight "${m[1]}", bizda "${n[1]}".\n` +
      `  Tuzatish: src/components/PageTitle.astro da qiymatni "${m[1]}" ga o'zgartiring.`,
  );
  process.exit(1);
}

console.log(`[check] PAGE_TITLE_ID mos: "${m[1]}"`);
