---
title: Holatlar jadvali
description: Ijro 12 holati va amal 9 holati — to'liq ma'lumotnoma.
sidebar:
  order: 1
holat: ishlaydi
---

## Ijro holatlari (`status`)

Agentning **o'z ishi** qay bosqichda.

| Holat | Yakuniymi | Ma'nosi |
|---|---|---|
| `created` | — | Qabul qilindi, navbatda |
| `validating` | — | Kirish tekshirilmoqda |
| `resolving_context` | — | Bilim va kontekst yig'ilmoqda |
| `planning` | — | Model rejalashtirmoqda |
| `running` | — | Bajarilmoqda |
| `waiting_for_tool` | — | Tashqi tizim javobi kutilmoqda |
| `waiting_for_approval` | — | **Inson tasdig'i** kutilmoqda |
| `validating_output` | — | Chiqish tekshirilmoqda |
| `completed` | ✅ | Agent ishini tugatdi |
| `failed` | ✅ | Agent ishini tugata olmadi |
| `cancelled` | ✅ | Bekor qilindi |
| `expired` | ✅ | Muddati tugadi |

⚠ `completed` — **agent** tugatdi degani, amal bajarildi degani **emas**.

## Amal holatlari (`operations[].status`)

Tashqi dunyoda **effekt** bo'ldimi.

| Holat | Yakuniymi | Qayta yuborish | Ma'nosi |
|---|---|---|---|
| `PREPARED` | — | — | Niyat yozildi, yuborilmadi |
| `SENT` | — | ⛔ | Konnektorga yuborildi |
| `ACKNOWLEDGED` | — | ⛔ | Konnektor javob berdi — **transport** |
| **`VERIFIED`** | ✅ | kerak emas | **Manbadan tasdiqlandi** |
| **`UNKNOWN`** | — | ⛔ **TAQIQ** | Natija noma'lum |
| `RECONCILING` | — | ⛔ | Yakuniy holat aniqlanmoqda |
| `FAILED` | ✅ | ✅ xavfsiz | Aniq rad — effekt bo'lishi mumkin emas |
| `MANUAL_REVIEW` | — | konsolda | Mas'ul ko'rigida |
| `CANCELLED` | ✅ | ✅ xavfsiz | Bekor qilindi |

## O'tishlar

```
PREPARED ──► SENT ──► ACKNOWLEDGED ──► VERIFIED
    │          │            │
    │          │            └──► UNKNOWN ──► RECONCILING ──► VERIFIED | FAILED
    │          └──► UNKNOWN
    │          └──► FAILED          (konnektor ANIQ rad javobi)
    └──► MANUAL_REVIEW              (bilim zidligi + qaytarilmaydigan)
    └──► CANCELLED
```

:::caution[Ikki qattiq qoida]
1. `SENT` bo'lmagan amal `VERIFIED` bo'la **olmaydi** — urinilmagan
   amalni tasdiqlab bo'lmaydi.
2. Timeout hech qachon `FAILED` emas — u `UNKNOWN`.
:::

## `terminal_reason` qiymatlari

| Qiymat | Qachon |
|---|---|
| `CONNECTOR_ERROR` | Konnektor xatosi — natija noaniq |
| `CONNECTOR_REJECTED` | Konnektor **aniq** rad etdi |
| `KNOWLEDGE_CONFLICT` | Bilimda yechilmagan zidlik |
| `STALE_REPLICA` | Eski replikadan o'qildi |
| `FIELD_MISSING` | Predikat maydoni javobda yo'q |
| `SOURCE_UNREACHABLE` | Manbaga yetib bo'lmadi |

## `verification_method`

| Qiymat | Ma'nosi |
|---|---|
| `read_after_write` | Yozgandan keyin manbadan qayta o'qildi |
| *(bo'sh)* | Tasdiq qoidasi yo'q — `VERIFIED` bo'lmaydi |
