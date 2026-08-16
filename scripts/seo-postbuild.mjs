#!/usr/bin/env node
/**
 * Build'dan KEYINGI SEO qadami: `/sitemap.xml` nusxasi + izchillik isboti.
 *
 * ═══ 1. `/sitemap.xml` ═══
 *
 * Astro sitemap'ni `sitemap-index.xml` deb yozadi — spetsifikatsiya
 * bo'yicha to'g'ri, lekin odam ham, ko'p krauler ham birinchi navbatda
 * `/sitemap.xml` ni so'raydi va 404 oladi. Search Console'ga manzilni
 * qo'lda berish mumkin, taxmin qiluvchi botlarga esa yo'q.
 *
 * ⛔ Nusxa, YO'NALTIRISH emas: Astro statik build'da `redirects` HTML
 * meta-refresh sahifasini yozadi. Krauler XML o'rniga HTML olardi va
 * sitemap'ni yaroqsiz deb hisoblardi — 404 dan ham yomon.
 *
 * ═══ 2. ⚡ IZCHILLIK ISBOTI ═══
 *
 * `noindex` va sitemap IKKI BOSHQA manbadan hisoblanadi:
 *
 *   noindex        → Starlight'ning `isFallback` hisobi (route data)
 *   sitemap filtri → fayl tizimi skani (`fallback-routes.mjs`)
 *
 * Ular bir haqiqatni ifodalaydi, lekin AJRALIB KETISHI mumkin —
 * masalan sahifa maxsus `slug:` frontmatter olsa. Ajralganda Google
 * qarama-qarshi signal oladi: sitemap «bu sahifani indeksla» deydi,
 * sahifaning o'zi «indekslama» deydi.
 *
 * Bu qadam ikkalasini QURILGAN chiqishda solishtiradi. Mos kelmasa
 * build to'xtaydi — jimgina noto'g'ri ishlashdan ko'ra yaxshiroq.
 *
 * ═══ ⛔ NEGA `build` DA ═══
 *
 * `.github/workflows/docs.yml` ogohlantiradi: Vercel FAQAT
 * `npm run build` ni yurgizadi — `verify` ni ham, CI darvozalarini ham
 * bilmaydi. `verify` ga qo'yilsa lokalda ishlardi va PRODDA YO'Q
 * bo'lardi.
 */

import { copyFileSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(HERE, "../dist");

/** Sitemapda bo'lishi shart BO'LMAGAN sahifalar. */
const ISTISNO = new Set(["/404.html"]);

// ── 1. /sitemap.xml ──────────────────────────────────────────────────

const MANBA = join(DIST, "sitemap-index.xml");
if (!existsSync(MANBA)) {
  // ⛔ Jimgina o'tib ketmaymiz: manba yo'qligi sitemap UMUMAN
  // generatsiya bo'lmaganini bildiradi (`site` olib tashlangan yoki
  // integratsiya o'chgan). Bu jiddiy SEO regressiyasi.
  console.error(
    "⛔ dist/sitemap-index.xml topilmadi.\n" +
      "   `astro.config.mjs` dagi `site` sozlamasini tekshiring —\n" +
      "   usiz Astro sitemap yozmaydi.",
  );
  process.exit(1);
}
copyFileSync(MANBA, join(DIST, "sitemap.xml"));

// ── 2. Izchillik ─────────────────────────────────────────────────────

/** `dist` ichidagi barcha HTML fayllar → sayt yo'li. */
function htmlSahifalar(dir = DIST) {
  const natija = [];
  for (const kirish of readdirSync(dir, { withFileTypes: true })) {
    const toliq = join(dir, kirish.name);
    if (kirish.isDirectory()) {
      // ⚠ Astro ichki kataloglari — chiqish emas, o'tkazib yuboriladi.
      if (kirish.name === "_astro" || kirish.name === "pagefind") continue;
      if (kirish.name.startsWith(".")) continue;
      natija.push(...htmlSahifalar(toliq));
    } else if (kirish.name.endsWith(".html")) {
      const nisbiy = relative(DIST, toliq).split(sep).join("/");
      natija.push({
        yol: nisbiy === "index.html" ? "/" : `/${nisbiy.replace(/index\.html$/, "")}`,
        fayl: toliq,
      });
    }
  }
  return natija;
}

const sahifalar = htmlSahifalar().filter((s) => !ISTISNO.has(s.yol));

const noindex = new Set(
  sahifalar
    .filter((s) => /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(readFileSync(s.fayl, "utf8")))
    .map((s) => s.yol),
);

const sitemapXml = readFileSync(join(DIST, "sitemap-0.xml"), "utf8");
const sitemapYollar = new Set(
  [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname),
);

const xatolar = [];

// A. Sitemapdagi sahifa `noindex` bo'lmasin — eng zararli ziddiyat.
for (const yol of sitemapYollar) {
  if (noindex.has(yol)) {
    xatolar.push(`  ${yol}\n      sitemapda BOR, lekin sahifada noindex`);
  }
}

// B. Indekslanadigan har sahifa sitemapda bo'lsin — tushib qolishni ushlaydi.
for (const { yol } of sahifalar) {
  if (!noindex.has(yol) && !sitemapYollar.has(yol)) {
    xatolar.push(`  ${yol}\n      indekslanadi, lekin sitemapda YO'Q`);
  }
}

if (xatolar.length > 0) {
  console.error(
    "⛔ SEO signallari ZIDDIYATLI (noindex ↔ sitemap):\n" +
      xatolar.join("\n") +
      "\n\n   Ikki manba ajralgan: `src/components/Head.astro` Starlight'ning\n" +
      "   `isFallback` hisobidan, sitemap filtri esa\n" +
      "   `scripts/fallback-routes.mjs` fayl skanidan foydalanadi.\n" +
      "   Ehtimoliy sabab: sahifa maxsus `slug:` frontmatter olgan.",
  );
  process.exit(1);
}

console.log(
  `  ✅ SEO: sitemap.xml yozildi · ${sitemapYollar.size} indekslanadigan · ` +
    `${noindex.size} noindex (tarjimasiz) — ziddiyat yo'q`,
);
