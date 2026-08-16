// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";

import { fallbackRoutes } from "./scripts/fallback-routes.mjs";

// ⛔ Tarjima qilinmagan sahifalar sitemapdan CHIQARILADI: ular
// `noindex` (sabab — `src/components/Head.astro`), sitemap esa faqat
// indekslanadigan manzillarni ko'rsatishi kerak. Ikkisi ziddiyatli
// bo'lsa Google qarama-qarshi signal oladi.
const FALLBACK = fallbackRoutes();

// docs.davirix.com — dasturchi hujjatlari.
//
// ⚠ IKKI TIL, BITTA DARAXT: o'zbek `root` locale (URL prefikssiz), ingliz
// `/en/` ostida. Sabab — asosiy auditoriya mahalliy, lekin `pip install
// davirix` GLOBAL: PyPI sahifasidan kelgan dasturchi ingliz kutadi.
//
// ⚠ SIDEBAR QO'LDA yozilgan, avtomatik generatsiya EMAS. Sabab: hujjatlar
// UCHTA AJRALGAN sayohatga bo'lingan (integrator · konnektor dasturchisi ·
// paket muallifi) va bu tartib fayl tizimidan kelib chiqmaydi. Avtomatik
// tartib alfavit bo'yicha chiqib, o'qish ketma-ketligini BUZARDI.
export default defineConfig({
  site: "https://docs.davirix.com",
  integrations: [
    // ⚠ Sitemap ATAYLAB shu yerda: Starlight uni o'zi qo'shadi, LEKIN
    // faqat ro'yxatda topilmasa (`starlight/index.ts:107`). Filtr kerak
    // bo'lgani uchun o'zimiz qo'shamiz — shu bilan Starlight o'zinikini
    // qo'shmaydi va ikkita sitemap chiqmaydi.
    //
    // ⛔ `i18n` bloki Starlight'dan AYNAN ko'chirildi
    // (`integrations/sitemap.ts`). Usiz sitemapdagi hreflang
    // annotatsiyalari yo'qolardi — ya'ni filtr qo'shish jimgina
    // ko'p tilli SEO'ni buzardi.
    sitemap({
      i18n: { defaultLocale: "root", locales: { root: "uz", en: "en" } },
      filter: (sahifa) => !FALLBACK.has(new URL(sahifa).pathname),
    }),
    starlight({
      title: "Davirix",
      description:
        "AI xodim platformasi — dasturchi hujjatlari: ijro API'si, konnektor yozish va domain pack.",
      // ⚠ Starlight `twitter:card: summary_large_image` ni O'ZI yozadi,
      // lekin rasmni yozmaydi — ya'ni e'lon bor, orqasida hech narsa
      // yo'q va havola quruq matn bo'lib chiqadi. Shu bo'shliq to'ldiriladi.
      //
      // ⛔ Manzil MUTLAQ bo'lishi shart: OG kraulerlari nisbiy yo'lni
      // hal qila olmaydi. Rasm `public/og.png` da va u
      // `scripts/gen-og-image.mjs` bilan QO'LDA generatsiya qilingan
      // (sabab — o'sha skript izohida: build muhitidagi shriftlarga
      // tayanib bo'lmaydi).
      head: [
        {
          tag: "meta",
          attrs: { property: "og:image", content: "https://docs.davirix.com/og.png" },
        },
        { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
        { tag: "meta", attrs: { property: "og:image:height", content: "630" } },
        {
          tag: "meta",
          attrs: {
            property: "og:image:alt",
            content: "Davirix — dasturchi hujjatlari, docs.davirix.com",
          },
        },
        {
          tag: "meta",
          attrs: { name: "twitter:image", content: "https://docs.davirix.com/og.png" },
        },
      ],
      defaultLocale: "root",
      locales: {
        root: { label: "O'zbekcha", lang: "uz" },
        en: { label: "English", lang: "en" },
      },
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/davirixai" },
      ],
      editLink: {
        baseUrl: "https://github.com/davirixai/agent-os/edit/main/docs-site/",
      },
      lastUpdated: true,
      customCss: ["./src/styles/davirix.css"],
      components: {
        // Har sahifa tepasida HOLAT belgisi ko'rsatiladi (ishlaydi /
        // qisman / hali yo'q). Standart komponent uni bilmaydi.
        PageTitle: "./src/components/PageTitle.astro",
        // Tarjima qilinmagan sahifaga `noindex` qo'yadi.
        Head: "./src/components/Head.astro",
      },
      sidebar: [
        {
          label: "Boshlash",
          translations: { en: "Get started" },
          items: [
            { slug: "boshlash/nima-bu", translations: { en: "What is Davirix" } },
            { slug: "boshlash/besh-daqiqa" },
            { slug: "boshlash/eng-muhim-qoida" },
            { slug: "boshlash/auth" },
          ],
        },
        {
          label: "Integrator",
          translations: { en: "Integrator" },
          badge: { text: "SDK", variant: "note" },
          items: [
            // ⚡ Birinchi o'rinda: integrator BIRINCHI shu savolga
            // javob izlaydi — «o'z tizimimni qanday ulayman».
            { slug: "integrator/platformani-ulash" },
            { slug: "integrator/python-sdk" },
            { slug: "integrator/http-api" },
            { slug: "integrator/holatlar" },
            { slug: "integrator/idempotentlik" },
            { slug: "integrator/xatolar" },
          ],
        },
        {
          label: "Domen quruvchi",
          translations: { en: "Domain builder" },
          badge: { text: "Yangi", variant: "tip" },
          items: [
            { slug: "ilova/nima-bu" },
            { slug: "ilova/shartnoma" },
            { slug: "ilova/darajalar" },
          ],
        },
        {
          label: "Konnektor dasturchisi",
          translations: { en: "Connector developer" },
          items: [
            { slug: "konnektor/nima-bu" },
            { slug: "konnektor/turlari" },
            { slug: "konnektor/manifest" },
            { slug: "konnektor/verification" },
            { slug: "konnektor/sertifikatsiya" },
            { slug: "konnektor/muvofiqlik" },
          ],
        },
        {
          label: "Paket muallifi",
          translations: { en: "Pack author" },
          items: [
            { slug: "paket/nima-bu" },
            { slug: "paket/yozish" },
          ],
        },
        {
          // ⚡ Beshinchi auditoriya: platformani SERVERDA saqlaydigan
          // kishi. Boshqa bo'limlar platformaga ULANISH haqida, bu esa
          // uni TIRIK SAQLASH haqida.
          label: "Operator",
          translations: { en: "Operator" },
          items: [
            { slug: "operator/nima-bu" },
            { slug: "operator/stek" },
            { slug: "operator/sozlamalar" },
            { slug: "operator/jim-nosozliklar" },
            { slug: "operator/birinchi-ishga-tushirish" },
            { slug: "operator/sirlar" },
            { slug: "operator/zaxira" },
            { slug: "operator/prod-darvozalari" },
          ],
        },
        {
          label: "Ma'lumotnoma",
          translations: { en: "Reference" },
          items: [
            { slug: "malumotnoma/holatlar-jadvali" },
            { slug: "malumotnoma/xato-kodlari" },
            { slug: "malumotnoma/api" },
            { slug: "malumotnoma/cheklovlar" },
          ],
        },
      ],
    }),
  ],
});
