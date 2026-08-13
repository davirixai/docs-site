// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

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
    starlight({
      title: "Davirix",
      description:
        "AI xodim platformasi — dasturchi hujjatlari: ijro API'si, konnektor yozish va domain pack.",
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
            { slug: "malumotnoma/cheklovlar" },
          ],
        },
      ],
    }),
  ],
});
