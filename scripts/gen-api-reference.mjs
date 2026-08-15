#!/usr/bin/env node
/**
 * API ma'lumotnomasini OpenAPI spetsifikatsiyalaridan GENERATSIYA qiladi.
 *
 * ═══ NEGA GENERATSIYA, QO'LDA EMAS ═══
 *
 * platform-core'da 211 yo'l bor. Qo'lda yozilgan ro'yxat birinchi
 * relizdayoq eskirardi va integrator mavjud bo'lmagan endpointni
 * chaqirib, sababni O'Z kodida izlardi.
 *
 * ⚡ Manba — repodagi `docs/api/*.openapi.json` fayllari. Ular CI
 * tomonidan servis kodidan yangilanadi (`test_api_docs_gate`).
 *
 * ═══ ⛔ NIMA GENERATSIYA QILINMAYDI ═══
 *
 * Har endpointning to'liq sxemasi EMAS. Sabab: 211 yo'l uchun to'liq
 * sxema o'qib bo'lmas devor bo'lardi va u OpenAPI faylining o'zidan
 * yomonroq bo'lardi. Bu yerda YO'NALTIRUVCHI ro'yxat: qaysi sirt bor,
 * qaysi metod, nima uchun. Tafsilot — spetsifikatsiyada.
 *
 * Ishlatish:  node scripts/gen-api-reference.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
const OUT = resolve(HERE, "../src/content/docs/malumotnoma/api.md");

/** Servislar — nom, spetsifikatsiya yo'li, bir qatorli izoh. */
const SERVICES = [
  {
    name: "platform-core",
    spec: "agent-os/docs/api/platform-core.openapi.json",
    note: "Boshqaruv sirti: agentlar, konnektorlar, kalitlar, bilim, audit.",
  },
  {
    name: "agent-runtime",
    spec: "agent-os/docs/api/agent-runtime.openapi.json",
    note: "Ijro sirti: suhbat, ijro, interrupt.",
  },
  {
    name: "integration-hub",
    spec: "integration-hub/docs/api/integration-hub.openapi.json",
    note: "Konnektor ijrosi — odatda bevosita chaqirilmaydi.",
  },
  {
    name: "knowledge-runtime",
    spec: "knowledge-runtime/docs/api/knowledge-runtime.openapi.json",
    note: "Bilim ijrosi — platform-core proksisi orqali ishlatiladi.",
  },
];

/**
 * Guruh nomi — yo'lning MA'NOLI segmenti.
 *
 * ⚠ `/api/admin/agents/{id}/versions` → `agents`. Guruhlash bo'lmasa
 * ro'yxat 211 qatorli tekis devor bo'lardi.
 */
function groupOf(path) {
  const parts = path.split("/").filter(Boolean);
  if (parts[0] === "api" && (parts[1] === "admin" || parts[1] === "internal")) {
    return parts[2] ?? parts[1];
  }
  if (parts[0] === "v1") return parts[1] ?? "v1";
  return parts[0] ?? "/";
}

const METHODS = ["get", "post", "put", "patch", "delete"];

function collect(specPath) {
  const raw = JSON.parse(readFileSync(resolve(ROOT, specPath), "utf8"));
  const groups = new Map();
  let total = 0;
  for (const [path, item] of Object.entries(raw.paths ?? {})) {
    const methods = METHODS.filter((m) => m in item).map((m) => m.toUpperCase());
    if (methods.length === 0) continue;
    total += methods.length;
    const key = groupOf(path);
    if (!groups.has(key)) groups.set(key, []);
    // Qisqacha izoh: `summary` bo'lsa u, aks holda birinchi metodning
    // `summary`/`description` birinchi jumlasi.
    const first = item[METHODS.find((m) => m in item)];
    const summary = (first?.summary ?? "").split("\n")[0].trim();
    groups.get(key).push({ path, methods, summary });
  }
  for (const rows of groups.values()) rows.sort((a, b) => a.path.localeCompare(b.path));
  return { groups: new Map([...groups].sort()), total };
}

const parts = [];
parts.push(`---
title: API ma'lumotnomasi
description: Barcha HTTP sirtlari — servis, yo'l, metod. Spetsifikatsiyalardan generatsiya qilinadi.
sidebar:
  order: 4
holat: ishlaydi
holatIzoh: Ro'yxat OpenAPI spetsifikatsiyalaridan generatsiya qilinadi — qo'lda tahrirlanmaydi.
---

:::caution[Bu sahifa QO'LDA tahrirlanmaydi]
U \`docs-site/scripts/gen-api-reference.mjs\` bilan repodagi OpenAPI
spetsifikatsiyalaridan generatsiya qilinadi. Qo'lda yozilgan ro'yxat
birinchi relizdayoq eskirardi va integrator mavjud bo'lmagan
endpointni chaqirib, sababni o'z kodida izlardi.
:::

Ulanishning **amaliy** yo'li — [O'z platformangizni ulash](/integrator/platformani-ulash/).
Bu sahifa esa to'liq ro'yxat: qaysi sirt bor va u qayerda.

## Auth — qisqacha

| Sirt | Auth |
|---|---|
| platform-core \`/api/admin/*\` | \`X-API-Key\` (qamrov bilan) yoki inson sessiyasi |
| platform-core \`/api/internal/*\` | servis kaliti — ⛔ tashqi mijoz uchun emas |
| agent-runtime \`/v1/*\` | \`Authorization: Bearer\` (chat tokeni) |
| integration-hub | \`X-Service-Key\` — ⛔ ichki |
| knowledge-runtime | \`X-Service-Key\` — platform-core proksisi orqali |

⛔ \`/api/internal/*\` yo'llari servislararo. Ular ro'yxatda **ko'rinadi**,
lekin tashqi integratsiya uchun mo'ljallanmagan.
`);

for (const svc of SERVICES) {
  let data;
  try {
    data = collect(svc.spec);
  } catch (err) {
    // ⛔ JIM o'tkazib yubormaymiz: yo'q spetsifikatsiya — bu sahifaning
    // TO'LIQ EMASLIGI demak va o'quvchi buni bilishi kerak.
    parts.push(`\n## ${svc.name}\n\n⚠ Spetsifikatsiya o'qilmadi: \`${svc.spec}\`\n`);
    continue;
  }
  parts.push(`\n## ${svc.name}\n\n${svc.note}\n\n**${data.total} amal.**\n`);
  for (const [group, rows] of data.groups) {
    parts.push(`\n### \`${group}\`\n\n| Metod | Yo'l | |\n|---|---|---|`);
    for (const r of rows) {
      const s = r.summary ? r.summary.replace(/\|/g, "\\|").slice(0, 90) : "";
      parts.push(`| ${r.methods.join(" ")} | \`${r.path}\` | ${s} |`);
    }
    parts.push("");
  }
}

parts.push(`
## To'liq sxema

Har endpointning so'rov/javob sxemasi repodagi spetsifikatsiyalarda:

\`\`\`
agent-os/docs/api/platform-core.openapi.json
agent-os/docs/api/agent-runtime.openapi.json
integration-hub/docs/api/integration-hub.openapi.json
knowledge-runtime/docs/api/knowledge-runtime.openapi.json
\`\`\`

⚠ Serverdagi \`/openapi.json\` va \`/docs\` **ataylab yopiq**: FastAPI
ularni marshrut qo'riqchilaridan OLDIN beradi, ya'ni ular
autentifikatsiyasiz ochiq bo'lardi.
`);

writeFileSync(OUT, parts.join("\n"), "utf8");
console.log(`  ✅ ${OUT}`);
