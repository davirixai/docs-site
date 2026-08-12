---
title: Sertifikatsiya
description: L0–L4 darajalari, sertifikat nima va u ijro paytida qanday majburlanadi.
sidebar:
  order: 4
holat: rejada
holatIzoh: "Dizayn tayyor. Ijro F1–F3 bosqichlarida — hozircha sertifikat berilmaydi."
---

Konnektor **darajalanadi**: qanday kafolat bera olishi sinovdan
o'tkaziladi va sertifikatga yoziladi.

:::note[Daraja so'ralmaydi — hisoblanadi]
Siz «menga L3 bering» deb ayta olmaysiz. Daraja **o'tgan testlardan**
kelib chiqadi.
:::

## Darajalar

| | Nima beradi | Darvoza |
|---|---|---|
| **L0** Katalog | Katalogda ko'rinadi. **Chaqirib bo'lmaydi** | Sxema · inline sir yo'q · `scope` to'g'ri |
| **L1** O'qish | O'qish ishlaydi. Yozuv **bloklangan** | `probe` iz qoldirmaydi · javob sxemaga mos · noma'lum id → `not_found` |
| **L2** Yozuv | Yozuv ishlaydi. Natija `ACKNOWLEDGED` | Idempotentlik · dublikat bo'roni → 1 effekt · timeout → `UNKNOWN` |
| **L3** Tasdiqlangan yozuv | Natija **`VERIFIED`** bo'la oladi | Har yozuvda read-back · predikat ham muvaffaqiyatni, ham **muvaffaqiyatsizlikni** ajratadi |
| **L4** Ishonchli | Yuqori xavfli tenantlar uchun | Jonli stend · nosozlik in'ektsiyasi · sir gigiyenasi |

## ⚠ L2 → L3 tabiiy o'tish emas

Bu **provayderga** bog'liq, sizga emas:

```
read-back API bor      →  L3 mumkin
read-back API yo'q     →  L2 da QOLADI
```

:::tip[Bu kamchilik emas]
Read-back'siz konnektorning amallari hech qachon «bajarildi» deb
belgilanmaydi. Bu **halol javob** — soxta yashildan yaxshiroq.
:::

## Sertifikat nima

Nishon emas — **imzolangan da'vo**. U versiyaga emas, **digest**ga
bog'lanadi:

```json
{
  "connector_id":    "bitrix24",
  "version":         "2.1.0",
  "manifest_digest": "sha256:4f1c…",
  "adapter_digest":  "sha256:9ab7…",
  "level":           "L3",
  "suite_version":   "conformance@1.0.0",
  "evidence_ref":    "run:cert-2026-08-12-0117",
  "sandbox":         "live",
  "issued_at":       "…",
  "expires_at":      "…",
  "signature":       "…"
}
```

| | Nega shunday |
|---|---|
| **Digest** | Versiya raqami — *da'vo*, digest — *fakt*. Bir bayt o'zgarsa sertifikat kuchini yo'qotadi |
| **Muddat** | Provayder API'si ogohlantirmasdan o'zgaradi. Muddatsiz sertifikat abadiy da'vo bo'lardi |
| **Dalil havolasi** | «O'tdi» yetarli emas: qaysi yurgizish, qaysi javoblar, qaysi predikat |

## Ijro paytida majburlash

| Holat | Hub nima qiladi |
|---|---|
| Sertifikat yo'q | ⛔ **yuklamaydi** |
| Digest mos emas | ⛔ **yuklamaydi** — kod almashtirilgan |
| Muddat tugagan | ⚠ **faqat o'qish** |
| Daraja talabdan past | ⚠ amal **bloklanadi** |
| Bekor qilingan | ⛔ **darhol to'xtaydi** |

⚠ Domain Pack har konnektor uchun **minimal daraja** talab qiladi
(`min_level`). L2 konnektor bilan L3 talab qiladigan paket
**o'rnatilmaydi** — ijro paytida kutilmagan `UNKNOWN` chiqargandan ko'ra,
o'rnatishda rad etilgani aniqroq.

## Sandbox — jonli yoki kasseta

| | Yetadi | Izoh |
|---|---|---|
| **Jonli sandbox** | L0 → **L4** | Chegaralangan, bekor qilinadigan kredensial |
| **Kasseta** (yozib olingan javoblar) | L0 → **L2** | Arzon, lekin kasseta o'zi yolg'on bo'lishi mumkin |

:::caution[Kasseta bilan L3 berilmaydi]
«Soxta yashil» testi (C11) yozib olingan javoblarda **ma'nosiz** —
kassetani predikatga moslab yozish mumkin. Tasdiq da'vosi faqat jonli
manba bilan isbotlanadi.
:::

## Keyingi qadam

- [Muvofiqlik to'plami](/konnektor/muvofiqlik/) — C1–C12
- [verification bloki](/konnektor/verification/) — L3 ning sharti
