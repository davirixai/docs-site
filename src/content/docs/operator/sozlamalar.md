---
title: Sozlamalar
description: Har env o'zgaruvchisi — kimga kerak, yo'q bo'lsa nima o'chadi va buni qanday payqash.
sidebar:
  order: 3
holat: ishlaydi
---

Bu jadvalning **uchinchi ustuni** eng muhimi. Platforma fail-closed:
sozlama yetishmasa komponent o'zini o'chiradi va jurnalga yozadi —
lekin **butun servis ishlashda davom etadi**.

## Platforma-keng

| O'zgaruvchi | Kim o'qiydi | Yo'q bo'lsa |
|---|---|---|
| `SERVICE_JWT_SECRET` | **8 servis** | servislararo auth o'chadi; gateway esa UMUMAN ko'tarilmaydi |
| `POSTGRES_PASSWORD` | postgres | stek ko'tarilmaydi |
| `CONSOLE_PORT` | web-console | konsolga kirib bo'lmaydi |

⚠ `SERVICE_JWT_SECRET` **kamida 32 bayt** (RFC 7518 §3.2). Qisqa sir
bilan servislar ataylab ko'tarilmaydi.

## Platform-core

| O'zgaruvchi | Yo'q bo'lsa |
|---|---|
| `PLATFORM_BOOTSTRAP_API_KEY` | birinchi admin yaratib bo'lmaydi |
| `REGISTRY_URL` + `REGISTRY_SERVICE_KEY` | Modellar · Endpointlar · Provayderlar · Sarf bo'limlari **503** |
| `KNOWLEDGE_RUNTIME_URL` + `KNOWLEDGE_SERVICE_KEY` | Qidiruv · Xotira **503** |
| `PLATFORM_ENCRYPTION_KEYRING` + `..._ACTIVE_KEY_ID` | ⛔ Ovozli kanal moduli **503** — u telefon raqami saqlaydi va ochiq matnda saqlash varianti YO'Q |

## Tool-executor

| O'zgaruvchi | Yo'q bo'lsa |
|---|---|
| `LEDGER_DSN` | Operation Ledger **o'chiq** (`/v1/operations` → 503) |
| `PLATFORM_CORE_SERVICE_KEY` | ⛔ servis **ko'tarilmaydi** (fail-fast) |
| `AGENT_PERMISSIONS_SYNC_ENABLED` | konsolda yaratilgan agent **hech qanday tool chaqira olmaydi** |
| `INTEGRATION_HUB_URL` + `_SERVICE_KEY` | nutq konnektorlari to'g'ridan-to'g'ri yo'lda qoladi |
| `CONNECTOR_REST_VIA_HUB` | rest chaqiruvlari **egress darvozasi** orqali ketadi (private IP TAQIQ) |

⚠ `PLATFORM_CORE_SERVICE_KEY` **tenantga bog'langan** kalit bo'lishi
kerak, bootstrap kaliti emas. Bootstrap kaliti o'z tenantiga tegishli
va u yerda agent yo'q — sinxron `200` qaytaradi, lekin **bo'sh ro'yxat
bilan**. Natija: agent «permission denied» oladi va sabab ko'rinmaydi.

## Integration-hub

| O'zgaruvchi | Yo'q bo'lsa |
|---|---|
| `INTEGRATION_HUB_SHARED_SECRET` | servis ko'tarilmaydi |
| `PLATFORM_CORE_SERVICE_KEY` | ⚠ **sarf hisoboti 401** — konnektor xarajati qayd etilmaydi |
| `VAULT_ADDR` + `VAULT_TOKEN` | konnektorlar `credential_error` beradi |
| `REST_ALLOWED_HOSTS` | ⛔ umumiy REST konnektori **katalogga umuman kirmaydi** |
| `REST_ALLOW_PLAIN_HTTP` | `http://` manzillar rad etiladi (faqat `https`) |

⚠ `REST_ALLOWED_HOSTS` — **domenlar**, port EMAS: `kamera-shop:8000`
uchun `kamera-shop` yoziladi. URL yozilsa servis ko'tarilmaydi.

## Agent-runtime

| O'zgaruvchi | Yo'q bo'lsa |
|---|---|
| `PLATFORM_CORE_SERVICE_API_KEY` | ⚠ **uchta** yoqilgan funksiya jim ishlamaydi: tasdiqlarni qayd etish · ijro tarixi · saqlash hisoboti |
| `CHECKPOINT_ENCRYPTION_KEY` | ⛔ suhbat mazmuni (ism, telefon, buyurtma) bazada **ochiq matnda** |
| `TOOLS_ENABLED` | model faqat `current_time` va `calculator` ni ko'radi |
| `INFERENCE_GATEWAY_URL` | model chaqiruvi yo'q |

⛔ `TOOLS_ENABLED` — **kengaytirish emas, toraytirish** vositasi. Bu
ro'yxatda yo'q tool'ni holat orqali qo'shib bo'lmaydi. Konnektor tooli
bu yerga qo'shilmasa, u tool-executor'da bajarilsa ham **model uni
ko'rmaydi** va hech qachon chaqirmaydi.

## Knowledge-runtime

| O'zgaruvchi | Yo'q bo'lsa |
|---|---|
| `KNOWLEDGE_SHARED_SECRET` | kiruvchi auth o'chadi |
| `QDRANT_URL` | qidiruv ishlamaydi |
| `EMBEDDING_MODE` | ⛔ standart `hash` — **semantik EMAS** |
| `EMBEDDING_SERVER_URL` + `EMBEDDING_DIM` | server rejimi ishlamaydi |
| `PLATFORM_CORE_API_KEY` | ⚠ **sarf hisoboti 401** |

⛔ `EMBEDDING_MODE=hash` eng xavfli standart: u determinstik vektor
beradi va qidiruv **ishlayotgandek** ko'rinadi, lekin natijalar
ma'nosiz. Prod'da `server` bo'lishi shart.

⚠ `EMBEDDING_DIM` **modelga bog'langan** (`text-embedding-3-small` =
1536). Nomos qiymat vektor bazasida fail-fast xato beradi — bu yaxshi,
jim noto'g'ri indeksdan ko'ra.

## Registry

| O'zgaruvchi | Yo'q bo'lsa |
|---|---|
| `REGISTRY_SHARED_SECRET` | servis ko'tarilmaydi |
| `REGISTRY_JWT_SECRET` | ⚠ service-JWT tekshiruvi **O'CHIQ** (DEV rejim) — chaqiruvchining kimligi tasdiqlanmaydi |

## Inference-gateway

| O'zgaruvchi | Yo'q bo'lsa |
|---|---|
| `SERVICE_JWT_SECRET` | ⛔ **ko'tarilmaydi** — ochiq darvoza begona hisobiga model chaqirish imkoni bo'lardi |
| `MODEL_ENDPOINTS_FILE` | yo'naltirish yo'q |
| `EMBEDDINGS_UPSTREAM_URL` | `/v1/embeddings` **503** → bilim indeksi qurilmaydi |

## Qanday tekshirish

Har servis o'z yetishmovchiligini **startupda** yozadi:

```bash
docker compose logs <servis> | grep -iE "WARN|ERROR"
```

Tipik xabar shakli:

```
<FUNKSIYA> yoqilgan, lekin <O'ZGARUVCHI> yo'q
```

⚡ Bu xabar **bir marta** chiqadi va keyin jim qoladi. Shuning uchun
birinchi ishga tushirishda jurnal **albatta** o'qilishi kerak.
