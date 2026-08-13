---
title: Jim nosozliklar
description: Servis ishlayotgandek ko'rinadi, lekin qismi ishlamaydi — alomat, haqiqiy sabab va tekshiruv buyrug'i.
sidebar:
  order: 4
holat: ishlaydi
---

Bu sahifa «qanday tuzatish» haqida emas — **«qanday PAYQASH»** haqida.

Quyidagi to'qqiz holatning **birortasi** ham xato sahifasi bermagan.
Hammasi `200` qaytargan. Ular 2026-08-13 stendida haqiqatan yuz bergan.

## 1. Konsolda begona tashkilot nomi

**Alomat:** sarlavhada boshqa kompaniya nomi turadi, yonida `DEV`
belgisi. Ma'lumot esa to'g'ri.

**Sabab:** konsol qobig'i **build paytida statik prerender** bo'lgan.
Qaysi shox tanlanishi `process.env` ga bog'liq, build paytida esa
sozlamalar hali yo'q — Next dev shoxini prerender qilib abadiy
tarqatadi.

⛔ Bu eng xavfli soxtalashtiriladigan maydon: operator o'zini **boshqa
mijoz hisobida** deb o'ylab amal qilishi mumkin.

**Tekshiruv:**

```bash
curl -sD- -o /dev/null -b cookie.txt https://<konsol>/operations \
  | grep -i x-nextjs-prerender
```

Sarlavha chiqsa — qobiq statik. Chiqmasa — dinamik (to'g'ri).

## 2. Amallar / Ledger bo'limlari doim bo'sh

**Alomat:** Amallar sahifasi ochiladi, lekin hech qachon ma'lumot
ko'rsatmaydi. Tool chaqiruvlari esa bajarilyapti.

**Ikki xil sabab bor va ikkalasi ham jim:**

| Jurnaldagi xabar | Ma'nosi |
|---|---|
| `relation "ledger.operations" does not exist` | migratsiya yurgizilmagan |
| `ledger: tranzaksiya ochilmadi: closed pool` | pul servis ishlay boshlashidan **oldin** yopilgan |

⚠ Yozish yo'li xatoni yutadi — shu bois tool ijrosi **ishlayotgandek**
tuyuladi va faqat O'QISH yo'li yiqiladi.

**Tekshiruv:**

```bash
docker compose logs tool-executor | grep -i ledger
docker compose logs tool-executor-migrate | tail -5
```

## 3. Agent «permission denied» oladi

**Alomat:** konsolda agent to'g'ri sozlangan, tool ro'yxatida bor,
lekin chaqiruv rad etiladi.

**Uch xil sabab:**

| Jurnaldagi `agent_id` | Ma'nosi |
|---|---|
| haqiqiy agent nomi | ruxsat sinxroni o'chiq yoki kalit yo'q |
| `tool_agent` | ⛔ so'rovda `agent_id` uzatilmagan — ruxsat **mavjud bo'lmagan** agent bo'yicha tekshirilgan |

Uchinchi holat: sinxron `200` qaytaradi, lekin **bo'sh ro'yxat** bilan —
`PLATFORM_CORE_SERVICE_KEY` bootstrap kaliti bo'lsa, u o'z tenantiga
tegishli va u yerda agent yo'q.

**Tekshiruv:**

```bash
docker compose logs tool-executor | grep "permission denied"
```

`agent_id` maydoniga qarang — u kutilgan agent nomimi?

## 4. Konnektor `egress_denied` beradi

**Alomat:**

```
egress blocked: <host> private/ichki IP'ga resolve bo'ldi
```

**Sabab:** tool-executor egress darvozasi private IP'ni to'sadi. Bu
**to'g'ri** — SSRF himoyasi va u bo'shashtirilmaydi.

Lekin mijozning o'z ilovasi aynan ichki tarmoqda bo'ladi. Yechim —
himoyani o'chirish emas, **marshrutni o'zgartirish**:

```
CONNECTOR_REST_VIA_HUB=1        # tool-executor: hub orqali
REST_ALLOWED_HOSTS=<host>       # hub: operator yozgan oq ro'yxat
```

⚡ Himoya yo'qolmaydi, **joyi o'zgaradi**: IP darajasidagi taqiq
o'rniga operator oshkora yozgan host oq ro'yxati.

## 5. Sarf hisobi haqiqatdan kam ko'rsatadi

**Alomat:** Sarf va Qoldiq bo'limlari ishlaydi, raqamlar chiqadi —
lekin ular haqiqiy sarfdan kam.

**Sabab:** servisga platform-core **manzili** berilgan, **kaliti**
yo'q. Internal sirt `X-API-Key` talab qiladi; service-JWT esa uning
o'rnini bosmaydi.

**Tekshiruv:**

```bash
docker compose logs | grep -iE "usage_report.*(rejected|401)"
```

Bitta ham chiqmasligi kerak. Chiqsa — o'sha servisga
`PLATFORM_CORE_SERVICE_KEY` (yoki `PLATFORM_CORE_API_KEY`) bering.

## 6. Konsolning to'rt bo'limi 503

**Alomat:** Modellar · Endpointlar · Provayderlar · Sarf — hammasi
«registr sozlanmagan» deydi.

**Sabab:** registry servisi **stekka umuman qo'shilmagan**. Xato halol
edi, lekin sabab ko'rinmasdi — servis ro'yxatda yo'q.

**Tekshiruv:**

```bash
docker compose ps | grep registry
```

## 7. Qidiruv natija beradi, lekin ular ma'nosiz

**Alomat:** bilim qidiruvi ishlaydi, natijalar chiqadi — lekin ular
so'rovga aloqador emas.

**Sabab:** `EMBEDDING_MODE=hash` (standart qiymat). Hash embedder
determinstik vektor beradi, lekin u **semantik emas**.

⛔ Bu eng yomon shakl: natija haqiqiy ko'rinadi va yolg'onni ajratib
bo'lmaydi.

**Tekshiruv:** javobdagi `embedding_model_version` maydoniga qarang —
`mock-embedding` bo'lsa qidiruv soxta.

## 8. Tool bor, lekin model uni hech qachon chaqirmaydi

**Alomat:** tool tool-executor katalogida, ruxsat berilgan, lekin agent
uni ishlatmaydi.

**Ikki sabab:**

1. Tool `TOOLS_ENABLED` ro'yxatida yo'q — **model uni ko'rmaydi**.
2. Tool nomida **nuqta** bor. Kanonik model so'rovi
   `^[a-zA-Z0-9_-]{1,128}$` talab qiladi (provayderlar funksiya nomida
   nuqtaga ruxsat bermaydi) — nuqtali nom modelga berilmaydi.

**Tekshiruv:** agent javobida `tool_calls_made.count` `0` bo'lsa va
model «men API bilan bog'lana olmayman» desa — birinchi sabab.

## 9. Kasseta bilan yashil — provayder bilan mos degani EMAS

**Alomat:** demo stendida hammasi ishlaydi, prod'da birinchi chaqiruv
yiqiladi.

**Sabab:** `CONNECTOR_CASSETTE_DIR` yoqilgan bo'lsa konnektor javoblari
**fayldan** o'qiladi. Bu faqat BIZNING kodimiz kutilgan shaklni to'g'ri
o'qiyotganini ko'rsatadi — provayder haqiqatan shunday javob beradimi,
birinchi **jonli** chaqiruvgacha bu **taxmin**.

⚡ Platforma buni o'zi qo'riqlaydi: `APP_ENV=production` bo'lsa hub
kasseta bilan **umuman ko'tarilmaydi**.

## Umumiy tekshiruv

Har ishga tushirishdan keyin:

```bash
docker compose logs --since 10m \
  | grep -iE '"level":"(ERROR|WARN)"|WARNING|CRITICAL|Traceback'
```

⚠ Ba'zi ogohlantirishlar **ataylab** va ular yo'qolmaydi — masalan
`retention.not_enforcing`: u nol-saqlash rejimi sozlanmaganini aytadi
va operator buni **ko'rishi shart**. Ularni jim qilish emas, **bilish**
kerak.
