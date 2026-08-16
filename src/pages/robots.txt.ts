/**
 * `/robots.txt` — indekslash siyosati.
 *
 * ⛔ NEGA ENDPOINT, oddiy `public/robots.txt` EMAS: fayl ichida sayt
 * manzili bor. Statik yozilsa `site` o'zgargan kunda robots.txt
 * jimgina ESKI domenga ishora qilardi va hech qanday test buni
 * ushlamasdi. `import.meta.env.SITE` — `astro.config.mjs` dagi ayni
 * qiymat, ya'ni yagona manba.
 *
 * ═══ ⚡ AI BOTLAR ATAYLAB KIRITILGAN ═══
 *
 * Ko'p loyihalar GPTBot/ClaudeBot'ni bloklaydi. Biz TESKARISINI
 * qilamiz va bu ongli qaror: hujjatlar mahsulotning kirish eshigi.
 * Dasturchi «Davirix'ga qanday ulanaman» deb Claude yoki ChatGPT'dan
 * so'raydi — agar bot hujjatni o'qiy olmasa, javob TAXMIN bo'ladi va
 * dasturchi mavjud bo'lmagan endpointni chaqiradi. Bloklash bizni
 * himoya qilmaydi, faqat noto'g'ri javob ishlab chiqaradi.
 *
 * ═══ ⛔ NEGA BITTA GURUH ═══
 *
 * robots.txt qoidasi: bot O'Z NOMINI topsa, `User-agent: *` guruhini
 * BUTUNLAY e'tiborsiz qoldiradi. Ya'ni GPTBot uchun alohida guruh
 * yozilsa, keyinchalik `*` ga qo'shilgan har qanday `Disallow` unga
 * YETMAYDI — ikki manba jimgina ajralib ketardi.
 *
 * Standart xulq baribir «ruxsat», shuning uchun nomlab chiqishning
 * texnik foydasi yo'q. Nomlar quyida IZOH sifatida qoldirildi: niyat
 * hujjatlashadi, xulq esa bitta joydan boshqariladi.
 *
 *   Google-Extended · GPTBot · OAI-SearchBot · ChatGPT-User
 *   ClaudeBot · Claude-User · Claude-SearchBot · anthropic-ai
 *   PerplexityBot · Perplexity-User · Bingbot · Applebot-Extended
 *   CCBot · Meta-ExternalAgent · Bytespider · Amazonbot
 */

import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  // ⚠ `SITE` oxirida `/` bo'lishi mumkin ham, bo'lmasligi ham —
  // `URL` bilan normallashtiramiz, aks holda `//sitemap.xml` chiqardi.
  const sitemap = new URL("/sitemap.xml", import.meta.env.SITE).href;

  const body = `# docs.davirix.com
#
# Hamma botga ruxsat — AI botlar HAM. Bu ongli qaror: hujjat
# o'qilmasa, u haqidagi javob taxminga aylanadi.
#
# ⚠ Bu yerga bot nomi bilan alohida guruh QO'SHMANG: o'z nomini
# topgan bot quyidagi umumiy guruhni butunlay e'tiborsiz qoldiradi
# va siyosat ikkiga bo'linadi.

User-agent: *
Allow: /

# ⛔ Faqat qidiruv indeksining IKKILIK bo'laklari yopiladi. Ular
# 1 MB dan ortiq va indekslashga hech narsa bermaydi — crawl budjeti
# shu yerda behuda sarflanardi.
#
# ⚠ \`/pagefind/\` BUTUNLAY yopilmaydi: undagi CSS va JS sahifa
# renderiga kiradi va Google render uchun kerak resursni bloklashni
# ochiq ogohlantiradi.
Disallow: /pagefind/fragment/
Disallow: /pagefind/index/

Sitemap: ${sitemap}
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};
