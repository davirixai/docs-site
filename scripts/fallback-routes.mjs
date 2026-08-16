/**
 * TARJIMA QILINMAGAN marshrutlar ro'yxati.
 *
 * Inglizcha tarjimasi yo'q har sahifa Starlight tomonidan baribir
 * `/en/...` da chiqariladi — kontenti o'zbekcha qolgan holda. Bunday
 * sahifa indeksga TUSHMASLIGI kerak (sabab: `src/components/Head.astro`).
 *
 * ⚠ Bu modul `astro.config.mjs` dan chaqiriladi (sitemap filtri uchun),
 * ya'ni build BOSHLANISHIDAN oldin ishlaydi va Astro kolleksiyasiga
 * kira olmaydi. Shuning uchun manba — FAYL TIZIMI.
 *
 * ⛔ Maxsus `slug:` frontmatter ishlatilsa bu hisob NOTO'G'RI bo'ladi
 * (fayl nomi bilan marshrut ajralib ketadi). Bugun bunday sahifa yo'q;
 * paydo bo'lsa `scripts/seo-postbuild.mjs` dagi solishtiruv yiqiladi —
 * jimgina noto'g'ri ishlamaydi.
 */

import { readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DOCS = resolve(HERE, "../src/content/docs");

/** Katalogdagi barcha `.md`/`.mdx` fayllarni kengaytmasiz slug sifatida. */
function sluglar(root) {
  const natija = new Set();
  const yur = (dir, prefiks) => {
    for (const kirish of readdirSync(dir, { withFileTypes: true })) {
      const nom = kirish.name;
      if (kirish.isDirectory()) {
        yur(resolve(dir, nom), prefiks ? `${prefiks}/${nom}` : nom);
      } else if (/\.mdx?$/.test(nom)) {
        const asos = nom.replace(/\.mdx?$/, "");
        natija.add(prefiks ? `${prefiks}/${asos}` : asos);
      }
    }
  };
  yur(root, "");
  return natija;
}

/**
 * @returns {Set<string>} `/en/...` shaklidagi marshrutlar (oxirida `/`).
 */
export function fallbackRoutes() {
  const hammasi = sluglar(DOCS);
  const inglizcha = sluglar(resolve(DOCS, "en"));

  const natija = new Set();
  for (const slug of hammasi) {
    // `en/` ostidagilar — manbaning O'ZI, ular fallback emas.
    if (slug === "en" || slug.startsWith("en/")) continue;
    if (inglizcha.has(slug)) continue;
    // `index` → `/en/`, aks holda `/en/<slug>/`.
    natija.add(slug === "index" ? "/en/" : `/en/${slug}/`);
  }
  return natija;
}
