#!/usr/bin/env node
/**
 * HALOLLIK DARVOZASI.
 *
 * Bu hujjatlarning yagona va'dasi — ular bugungi HAQIQATNI aytadi.
 * Va'dani odam emas, CI saqlaydi:
 *
 *   1. Har sahifada `holat` bo'lishi SHART.
 *      Belgisiz sahifa o'quvchiga «hammasi ishlaydi» deb tuyuladi.
 *
 *   2. `qisman` va `hali-yoq` uchun `holatIzoh` MAJBURIY.
 *      «Qisman» so'zining o'zi hech narsa aytmaydi — dasturchi NIMA
 *      ishlamasligini bilishi kerak, aks holda u baribir sinab ko'radi
 *      va vaqt yo'qotadi.
 *
 * ⚠ OLIB TASHLANGAN QOIDA (tarix uchun): dastlab uchinchi qoida bor edi —
 * «`holat: ishlaydi` sahifasida "hali yo'q" / "⏳" iboralari bo'lmasin».
 * U NOTO'G'RI loyihalangan edi va uchta sahifada YOLG'ON ogohlantirish
 * berdi. Sabab: ishlaydigan sahifaning O'ZI nima yo'qligini sanashi —
 * bu aynan biz XOHLAGAN xatti-harakat («Nima yo'q» bo'limi, cheklovlar
 * sahifasi). Kalit so'z qidiruvi «bu funksiya yo'q» (halol) va «bu
 * sahifa mavjud bo'lmagan narsani tasvirlaydi» (yomon) ni ajrata
 * OLMAYDI. Yolg'on ogohlantirish beradigan qoida yomonroq: odamlar
 * unga chetlab o'tish bayrog'i qo'shishni o'rganadi va darvoza
 * butunlay ishonchini yo'qotadi.
 *
 * Uning o'rniga — HOLAT TAQSIMOTI chiqariladi: inson ko'rib chiqishida
 * «nega bu sahifa ishlaydi deb belgilangan» savoli ko'rinadi.
 *
 * Foydalanish: node scripts/check-status.mjs
 * Exit: 0 — toza; 1 — kamida bitta muammo.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const DOCS = new URL("../src/content/docs/", import.meta.url);
const IZOH_TALAB = new Set(["qisman", "hali-yoq"]);
const BARCHA = ["ishlaydi", "qisman", "hali-yoq", "rejada"];

async function* sahifalar(dir, prefix = "") {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const rel = path.posix.join(prefix, e.name);
    if (e.isDirectory()) {
      yield* sahifalar(new URL(e.name + "/", dir), rel);
    } else if (/\.mdx?$/.test(e.name)) {
      yield { rel, url: new URL(e.name, dir) };
    }
  }
}

function frontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const out = {};
  for (const line of m[1].split(/\r?\n/)) {
    // Faqat yuqori darajadagi `kalit: qiymat` (ichki bloklar e'tiborsiz).
    const mm = line.match(/^([a-zA-Z_][\w]*):\s*(.*)$/);
    if (mm) out[mm[1]] = mm[2].trim().replace(/^["']|["']$/g, "");
  }
  return { data: out, body: raw.slice(m[0].length) };
}

const muammolar = [];
const taqsimot = Object.fromEntries(BARCHA.map((h) => [h, []]));
let tekshirildi = 0;

for await (const { rel, url } of sahifalar(DOCS)) {
  const raw = await readFile(url, "utf8");
  const fm = frontmatter(raw);
  if (!fm) {
    muammolar.push(`${rel}: frontmatter yo'q`);
    continue;
  }
  // Bosh sahifa (`template: splash`) — u marshrut emas, kirish nuqtasi.
  if (fm.data.template === "splash") continue;

  tekshirildi++;
  const { holat, holatIzoh } = fm.data;

  if (!holat) {
    muammolar.push(
      `${rel}: \`holat\` yo'q — o'quvchi buni «ishlaydi» deb o'qiydi. ` +
        `Qo'shing: ishlaydi | qisman | hali-yoq | rejada`,
    );
    continue;
  }
  if (!BARCHA.includes(holat)) {
    muammolar.push(`${rel}: noma'lum holat «${holat}» — ruxsat: ${BARCHA.join(" | ")}`);
    continue;
  }
  if (IZOH_TALAB.has(holat) && !holatIzoh) {
    muammolar.push(
      `${rel}: \`holat: ${holat}\` uchun \`holatIzoh\` MAJBURIY — ` +
        `aynan NIMA ishlamasligini yozing`,
    );
  }
  taqsimot[holat].push(rel);
}

if (muammolar.length) {
  console.error(`[status] ${muammolar.length} muammo:\n`);
  for (const m of muammolar) console.error("  " + m);
  process.exit(1);
}

console.log(`[status] ${tekshirildi} sahifa — hammasida holat belgisi bor.\n`);
for (const h of BARCHA) {
  const list = taqsimot[h];
  if (!list.length) continue;
  console.log(`  ${h.padEnd(9)} ${String(list.length).padStart(2)}  ${list.join(", ")}`);
}
// ⚠ Bu ro'yxat inson ko'rigi uchun: «nega bu sahifa ishlaydi deb
// belgilangan?» savolini har PR'da ko'rinadigan qiladi.
