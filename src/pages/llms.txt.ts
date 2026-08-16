/**
 * `/llms.txt` — hujjatlarning AI uchun XARITASI.
 *
 * ═══ NEGA KERAK ═══
 *
 * AI yordamchi saytga kirganda 68 ta HTML sahifani ko'radi: navigatsiya,
 * qidiruv vidjeti, footer — kontent shu shovqin ichida. `llms.txt` esa
 * bitta tekis ro'yxat: qaysi sahifa nima haqida va manzili qayerda.
 *
 * ═══ ⚡ ENG MUHIMI: `holat` MAYDONI ═══
 *
 * Har satrda sahifaning O'Z holati bor (`ishlaydi` / `qisman` /
 * `hali-yoq` / `rejada`). Bu shu faylning butun qiymati.
 *
 * Sababi: platformada mexanizm ko'p, lekin hammasi ham tugallanmagan.
 * AI holatni ko'rmasa, u `rejada` turgan imkoniyatni ishonch bilan
 * tavsiya qiladi — dasturchi mavjud bo'lmagan endpointni chaqiradi va
 * sababni O'Z kodida soatlab izlaydi.
 *
 * ⚠ Bu aynan `check-status.mjs` CI darvozasi ichkarida majburlaydigan
 * halollik. Shu yerda u TASHQARIGA, AI iste'molchisiga uzatiladi.
 *
 * ═══ ⛔ DRIFT QO'RIQCHISI ═══
 *
 * Bo'limlar tartibi qo'lda (`SECTIONS`), chunki u SAYOHAT tartibi —
 * alfavitdan kelib chiqmaydi. Lekin qo'lda ro'yxat eskiradi: yangi
 * bo'lim qo'shilsa u jimgina TUSHIB QOLARDI.
 *
 * Shuning uchun noma'lum bo'lim BUILDNI YIQITADI. Jimgina o'tkazib
 * yuborishdan ko'ra qurilish to'xtagani yaxshi.
 */

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

/** Sayohat tartibi — `astro.config.mjs` sidebar'idagi ayni ketma-ketlik. */
const SECTIONS: ReadonlyArray<readonly [string, string]> = [
  ["boshlash", "Boshlash"],
  ["integrator", "Integrator — o'z tizimini ulash"],
  ["ilova", "Domen quruvchi — biznes mantiqi"],
  ["konnektor", "Konnektor dasturchisi — tashqi tizimlar"],
  ["paket", "Paket muallifi"],
  ["operator", "Operator — platformani saqlash"],
  ["malumotnoma", "Ma'lumotnoma"],
];

/** `holat` → AI uchun bir og'iz tushuntirish. */
const HOLAT_IZOH: Record<string, string> = {
  ishlaydi: "ishlaydi",
  qisman: "qisman ishlaydi",
  "hali-yoq": "HALI YO'Q — kontrakt tayyor, ijro yo'q",
  rejada: "REJADA — hali qurilmagan",
};

type Entry = {
  readonly id: string;
  readonly data: {
    readonly title: string;
    readonly description?: string;
    readonly holat?: string;
    readonly holatIzoh?: string;
    readonly sidebar?: { readonly order?: number };
  };
};

/** Kolleksiya id'sidan sayt manzili. `index` → ildiz. */
function href(id: string, site: string): string {
  const yol = id === "index" ? "" : `${id}/`;
  return new URL(`/${yol}`, site).href;
}

/** Bo'lim nomi: id'ning birinchi bo'lagi (`en/` prefiksisiz). */
function sectionOf(id: string): string {
  const parts = id.split("/");
  return parts[0] === "en" ? (parts[1] ?? "index") : (parts[0] ?? "index");
}

function line(entry: Entry, site: string): string {
  const holat = entry.data.holat;
  // ⚠ `holatIzoh` FAQAT `qisman`/`hali-yoq` da bo'ladi va aynan u
  // aytadi NIMA ishlamasligini — holat so'zining o'zi yetarli emas.
  const belgi = holat
    ? ` [${HOLAT_IZOH[holat] ?? holat}${entry.data.holatIzoh ? `: ${entry.data.holatIzoh}` : ""}]`
    : "";
  const izoh = entry.data.description ? `: ${entry.data.description}` : "";
  return `- [${entry.data.title}](${href(entry.id, site)})${izoh}${belgi}`;
}

/** Bo'lim ichida: `sidebar.order`, keyin id — sidebar bilan bir xil. */
function tartibla(a: Entry, b: Entry): number {
  const oa = a.data.sidebar?.order ?? Number.MAX_SAFE_INTEGER;
  const ob = b.data.sidebar?.order ?? Number.MAX_SAFE_INTEGER;
  return oa !== ob ? oa - ob : a.id.localeCompare(b.id);
}

export const GET: APIRoute = async () => {
  const site = import.meta.env.SITE;
  const hammasi = (await getCollection("docs")) as unknown as Entry[];

  // ⚠ QUIRK: lokal ildizning id'si `en/index` EMAS, shunchaki `en`.
  // Astro `index` faylini katalog id'siga siqadi. Shu sabab ikkala
  // ochilish sahifasi (`/` va `/en/`) aniq nom bilan chiqariladi —
  // ular yuqoridagi sarlavhada allaqachon tasvirlangan.
  const OCHILISH = new Set(["index", "en"]);
  const kontent = hammasi.filter((e) => !OCHILISH.has(e.id));

  const uz = kontent.filter((e) => !e.id.startsWith("en/"));
  const en = kontent.filter((e) => e.id.startsWith("en/"));

  // ⛔ Drift qo'riqchisi — yuqoridagi izohga qarang.
  const malum = new Set(SECTIONS.map(([kalit]) => kalit));
  // ⚠ Xato AYBDORNI nomlaydi: faqat bo'lim nomi berilsa, dasturchi uni
  // qaysi fayl keltirganini o'zi qidirishga majbur bo'lardi.
  const notanish = [...uz, ...en].filter((e) => !malum.has(sectionOf(e.id)));
  if (notanish.length > 0) {
    throw new Error(
      "llms.txt: SECTIONS bilmaydigan sahifa(lar):\n" +
        notanish.map((e) => `  ${e.id}  →  bo'lim "${sectionOf(e.id)}"`).join("\n") +
        "\nSayohat tartibini bilmaydigan holda ro'yxatga qo'sha olmaymiz — " +
        "src/pages/llms.txt.ts ichidagi SECTIONS ga qo'shing.",
    );
  }

  const qismlar: string[] = [
    "# Davirix",
    "",
    "> Biznesni yurituvchi AI xodim platformasi. Agent «bajarildi» deganda",
    "> buni manbadan isbotlaydi — har ijro tasdiqlangan holatga ega.",
    "",
    "Bu fayl — dasturchi hujjatlarining xaritasi (`docs.davirix.com`).",
    "",
    "⚠ HAR SATRDAGI KVADRAT QAVS — sahifaning HOLATI. Platformada",
    "mexanizm ko'p, lekin hammasi tugallanmagan. `REJADA` yoki",
    "`HALI YO'Q` deb belgilangan imkoniyatni ISHLAYDI deb tavsiya",
    "qilmang: u bugun chaqirilsa ishlamaydi.",
    "",
    "Hujjat ikki tilda: o'zbekcha (prefikssiz) va inglizcha (`/en/`).",
    "Inglizcha tarjima to'liq emas — quyida faqat mavjudlari.",
  ];

  for (const [kalit, nom] of SECTIONS) {
    const sahifalar = uz.filter((e) => sectionOf(e.id) === kalit).sort(tartibla);
    if (sahifalar.length === 0) continue;
    qismlar.push("", `## ${nom}`, "");
    for (const s of sahifalar) qismlar.push(line(s, site));
  }

  // ⚠ Inglizcha «Optional» sifatida oxirida: llms.txt spetsifikatsiyasida
  // bu «kerak bo'lsa o'qi» degani. Asosiy manba — o'zbekcha daraxt, u
  // TO'LIQ (masalan, `operator` bo'limi faqat unda bor).
  if (en.length > 0) {
    qismlar.push("", "## Optional — English translation", "");
    for (const s of en.sort((a, b) => a.id.localeCompare(b.id))) {
      qismlar.push(line(s, site));
    }
  }

  return new Response(`${qismlar.join("\n")}\n`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};
