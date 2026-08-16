#!/usr/bin/env node
/**
 * `public/og.png` — ijtimoiy tarmoq uchun oldindan ko'rish rasmi.
 *
 * ═══ NEGA QO'LDA YURGIZILADI, BUILD'DA EMAS ═══
 *
 * SVG matnini rasterlash SHRIFTGA bog'liq. Vercel build muhitida
 * qaysi shriftlar borligini biz bilmaymiz — bo'lmasa matn JIMGINA
 * bo'sh chiqardi va buni hech kim sezmasdi (og:image faqat havola
 * ulashilganda ko'rinadi).
 *
 * Shuning uchun rasm bir marta shu yerda generatsiya qilinadi, KO'Z
 * BILAN tekshiriladi va commit qilinadi. Build hech qanday shriftga
 * tayanmaydi.
 *
 *   Qayta yurgizish:  node scripts/gen-og-image.mjs
 *
 * ═══ DIZAYN ═══
 *
 * Konsol login sahifasi bilan BIR XIL identifikatsiya: o'sha belgi
 * (uzuq halqa + tasdiq), o'sha zamin (#0a0a0c) va o'sha urg'u
 * (#4f46e5). Ikki sirt bir mahsulotdek ko'rinishi kerak.
 *
 * ⚠ Shrift — Liberation Sans (Helvetica metrikasi). Sayt o'zi tizim
 * shriftida ishlaydi, ya'ni moslashadigan «brend shrifti» yo'q; bu
 * rasm typografikani biz to'liq boshqaradigan yagona joy.
 */

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const HERE = dirname(fileURLToPath(import.meta.url));
const CHIQISH = resolve(HERE, "../public/og.png");

const W = 1200;
const H = 630;

const ZAMIN = "#0a0a0c";
const URGU = "#4f46e5";
const MATN = "#fafafa";
const SUST = "#a1a1aa";
const JIM = "#71717a";

// ⚠ Belgi `web-console/app/(auth)/brand-mark.tsx` dan AYNAN ko'chirildi:
// 32×32 koordinata tizimi, shu sabab `translate` + `scale` bilan
// joylashtiriladi. Halqa ATAYLAB uzuq — ijro zanjiri har doim yopilmaydi.
const BELGI = `
  <g transform="translate(96 146) scale(2.75)">
    <circle cx="16" cy="16" r="13" fill="none" stroke="${URGU}" stroke-width="2"
            stroke-linecap="round" stroke-dasharray="61 20" stroke-dashoffset="-10"
            opacity="0.45"/>
    <path d="M10.5 16.4l4 4 7.5-8.8" fill="none" stroke="${URGU}" stroke-width="2.4"
          stroke-linecap="round" stroke-linejoin="round"/>
  </g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="nur" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${URGU}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${URGU}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${ZAMIN}"/>
  <circle cx="210" cy="200" r="480" fill="url(#nur)"/>

  ${BELGI}

  <text x="96" y="378" font-family="Liberation Sans, DejaVu Sans, sans-serif"
        font-size="104" font-weight="700" fill="${MATN}" letter-spacing="-3">Davirix</text>

  <text x="96" y="438" font-family="Liberation Sans, DejaVu Sans, sans-serif"
        font-size="36" fill="${SUST}">Dasturchi hujjatlari</text>

  <!-- ⚠ Mahsulotning HAQIQIY va'dasi, umumiy shior emas. -->
  <text x="96" y="492" font-family="Liberation Sans, DejaVu Sans, sans-serif"
        font-size="27" fill="${JIM}">Agent «bajarildi» deganda buni manbadan isbotlaydi</text>

  <rect x="96" y="536" width="64" height="3" fill="${URGU}" opacity="0.85"/>

  <text x="96" y="580" font-family="Liberation Mono, DejaVu Sans Mono, monospace"
        font-size="25" fill="${JIM}">docs.davirix.com</text>
</svg>`;

mkdirSync(dirname(CHIQISH), { recursive: true });
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(CHIQISH);
console.log(`  ✅ ${CHIQISH}  (${W}×${H})`);
