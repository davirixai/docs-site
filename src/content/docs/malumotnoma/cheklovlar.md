---
title: Cheklovlar
description: Bugun nima ishlaydi, nima qisman va nima hali yo'q — o'lchangan holat.
sidebar:
  order: 3
  badge:
    text: O'lchangan
    variant: tip
holat: ishlaydi
---

Bu sahifa **o'lchangan** holatni aytadi, rejani emas. Sana: **2026-08-12**.

## ✅ Ishlaydi — isbot bilan

| Nima | Isbot |
|---|---|
| Bir niyat — bir effekt | 10 000 parallel → **aynan 1** (jonli PostgreSQL) |
| Soxta «bajarildi» yo'q | HTTP 200 = `ACKNOWLEDGED`, `VERIFIED` emas |
| Timeout → `UNKNOWN` | Ko'r-ko'rona retry **taqiq** |
| Tasdiqdan keyingi mutatsiya bloklanadi | **100/100** |
| Zid bilim → avto-yozuv yo'q | Mas'ul navbatiga |
| Domain Pack kontrakti | **8 qoida** mutatsiya sinovidan o'tdi · 9 buzuq fixture rad etiladi |
| Paket yuklovchi | **14 test** · yaroqsiz paket → xizmat ishga tushmaydi |
| Python SDK | Linux · macOS · Windows · Python 3.10–3.13 |

## ⚠ Qisman

| Nima | Cheklov |
|---|---|
| **Tasdiq zanjiri** | Zanjirda **2 ta ochiq nosozlik** — pastga qarang |
| **Read-back amallari** | Faqat `bitrix24` da (`crm.get_deal`, `crm.get_lead`) |
| **Auth** | **Uch xil** sxema (ADR-035 birlashtirishni talab qiladi) |
| **`input` shakli** | MVP'da faqat `message`; typed sxema ⏳ |
| **Domain Pack** | Kontrakt va yuklovchi ✅ · jonli o'rnatilgan paket **0** |

### Tasdiq zanjiridagi ikki ochiq nosozlik

:::danger[Bu ikkisi tuzatilmaguncha ko'p amal `VERIFIED` bo'lmaydi]
1. **CRM amallari tool sifatida ro'yxatda yo'q.** Konnektor hub'da bor,
   lekin agent uni chaqira olmaydi.
2. **Tasdiq so'rovi hub'ga tool nomini uzatadi**, konnektor id'sini emas —
   so'rov manzilga yetmaydi.

Ular F0 bosqichida tuzatilmoqda.
:::

## ⛔ Hali yo'q

| Nima | Holat |
|---|---|
| **To'lov konnektori** | `payme` va `click` manifestlarida **0 amal** |
| **Konnektorlar** | **4/21** ijroda: `eskiz` · `bitrix24` · `aisha` · `uzbekvoice` |
| **1C · Click · Payme · Telegram** | yo'q |
| **Sertifikatsiya** | Dizayn tayyor · ijro F1–F3 |
| **SDK: TypeScript · Go** | ⏳ Python birinchi |
| **MCP** | ⏳ rejada |
| **Chiquvchi webhook** | ⏳ hozircha SSE yoki polling |
| **Konsoldan paket o'rnatish** | ⏳ hozircha `DOMAIN_PACKS_DIR` |

## ⛔ Bo'lmaydi

`gRPC` · mijozga `WebSocket` (u faqat ichki kanal va ovoz qatlamida)

## Nol-saqlash rejimi

`data_retention: zero` yoqilgan tenantda quyidagilar **ishlamaydi**:

- server tomonda ko'p navbatli suhbat
- xotira
- operatorga uzatish
- tasdiq oqimi
- ijro javobini keyin o'qish
- qo'ng'iroq yozuvi

## Idempotentlik oynasi

Konnektor natijasi eng ko'pi bilan **60 daqiqa** transport qatlamida
turadi, so'ng o'chiriladi. Semantik himoya (Ledger) esa **muddatsiz**.

## Nega bu sahifa bor

Ishlamaydigan narsani ishlaydi deb yozish integratsiyani **soatlarga**
uzaytiradi va ishonchni buzadi. Bu sahifa har relizda yangilanadi.
