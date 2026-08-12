---
title: Konnektor nima
description: Tashqi tizimni AI'ga ulash — deklarativ manifest, yangi platforma kodi emas.
sidebar:
  order: 1
holat: ishlaydi
---

Konnektor — Davirix'ni **tashqi tizimga** ulaydigan qatlam: CRM, SMS
provayderi, to'lov tizimi, sizning ERP'ingiz.

## Ikki qismdan iborat

| Qism | Nima | Kim yozadi |
|---|---|---|
| **Manifest** (`.json`) | Deklarativ: qanday amallar bor, kirish/chiqish shakli, tasdiq qoidasi | Siz |
| **Adapter** (kod) | HTTP chaqiruvi, javobni normallashtirish | Siz |

:::tip[Platforma kodiga tegilmaydi]
Yangi konnektor qo'shish uchun Davirix'ning ichki kodini o'zgartirish
**kerak emas**. Manifest + adapter — bu ikkisi.
:::

## Manifest nimani e'lon qiladi

```json
{
  "id": "bitrix24",
  "version": "2.1.0",
  "category": "crm",
  "scope": "global",
  "auth":   { "type": "api_key", "credential_ref": "vault:connectors/bitrix24" },
  "config_schema": { },
  "operations": [ ]
}
```

⚠ **Sir hech qachon manifestda bo'lmaydi** — faqat `vault:` havolasi.
Inline sir sxema darajasida **rad etiladi**.

## Amal (operation)

```json
{
  "name": "crm.create_deal",
  "direction": "write",
  "risk_level": "L2",
  "idempotent": false,
  "timeout_ms": 20000,
  "input_schema":  { },
  "output_schema": { },
  "verification":  { }
}
```

| Maydon | Majburiy |
|---|---|
| `name` · `direction` · `risk_level` | ✅ |
| `input_schema` · `output_schema` | ✅ |
| `idempotent` · `timeout_ms` | ✅ |
| `verification` | yozuv amali uchun — ⚡ [eng muhim](/konnektor/verification/) |

`direction`: `read` · `write` · `stream`
`risk_level`: `L0` … `L4` — **faqat ma'lumot**; qaror platformada.

## Yo'l xaritasi

```
1. Manifest yozasiz
2. Adapter yozasiz
3. Lokalda tekshirasiz         ← davirix connector verify
4. Topshirasiz
5. Tizim qayta tekshiradi      ← muvofiqlik to'plami C1–C12
6. Sertifikat olasiz           ← daraja L0–L4
```

## Uchta qoida — boshidan biling

:::caution[1. «Topilmadi» ≠ «xato»]
Noma'lum id uchun `not_found` qaytaring, `upstream_error` emas.

Aralashtirilsa indeks kechikishi `FAILED` ga aylanadi va amal noto'g'ri
yopiladi.
:::

:::caution[2. Identifikator — SATR]
Raqamli id `float64` ga aylantirilsa 2⁵³ dan katta qiymat **buziladi**.
Buzilgan id bilan read-back **boshqa** yozuvni o'qiydi.

Har doim satr sifatida qaytaring.
:::

:::caution[3. Timeout — `UNKNOWN`, `FAILED` emas]
«Javob kelmadi» va «bajarilmadi» bir xil emas.
:::

## Keyingi qadam

- [Manifest](/konnektor/manifest/) — to'liq maydonlar
- [verification bloki](/konnektor/verification/) — ⚡ eng muhim sahifa
- [Sertifikatsiya](/konnektor/sertifikatsiya/) — darajalar va nima kerak
