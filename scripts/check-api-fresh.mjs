#!/usr/bin/env node
/**
 * API ma'lumotnomasi ESKIRMAGANINI tekshiradi.
 *
 * ⛔ NEGA KERAK: `api.md` generatsiya qilinadi, lekin GENERATSIYA
 * qadamini yurgizishni unutish oson. Unutilsa sahifa jimgina eskiradi
 * va integrator mavjud bo'lmagan endpointni chaqirib, sababni O'Z
 * kodida izlaydi — hujjatga ishonch shu yerda yo'qoladi.
 *
 * Tekshiruv: skriptni QAYTA yurgizib, natija diskdagi fayl bilan
 * bayt-baytda solishtiriladi.
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PAGE = resolve(HERE, "../src/content/docs/malumotnoma/api.md");

const oldal = readFileSync(PAGE, "utf8");
execFileSync("node", [resolve(HERE, "gen-api-reference.mjs")], { stdio: "pipe" });
const yangi = readFileSync(PAGE, "utf8");

if (oldal !== yangi) {
  // Faylni QAYTA YOZIB qo'ymaymiz-da chiqmaymiz: generatsiya
  // allaqachon yozdi, ya'ni dasturchi faqat commit qilishi kerak.
  console.error(
    "⛔ API ma'lumotnomasi ESKIRGAN.\n" +
      "   `node scripts/gen-api-reference.mjs` yurgizildi va fayl yangilandi.\n" +
      "   O'zgarishni commit qiling.",
  );
  process.exit(1);
}
console.log("  ✅ API ma'lumotnomasi spetsifikatsiyalar bilan mos");
