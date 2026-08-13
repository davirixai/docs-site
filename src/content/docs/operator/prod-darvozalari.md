---
title: Prod darvozalari
description: Demo bilan prod orasidagi farq — qaysi darvozalar yoqilishi shart va platforma qaysilarini o'zi majburlaydi.
sidebar:
  order: 8
holat: ishlaydi
---

Ba'zi darvozalarni platforma **o'zi majburlaydi** — ular yoqilmasa
servis ko'tarilmaydi. Boshqalari **sizning qaroringiz** va ular
yoqilmasa hech kim aytmaydi.

## Platforma o'zi majburlaydi

| Darvoza | Nima bo'ladi |
|---|---|
| `APP_ENV=production` + kasseta | ⛔ hub **ko'tarilmaydi** — yozib olingan javob bilan hech narsa tasdiqlangan hisoblanmaydi |
| Gateway sirsiz | ⛔ **ko'tarilmaydi** — ochiq darvoza begona hisobiga model chaqirish imkonini berardi |
| `SERVICE_JWT_SECRET` < 32 bayt | ⛔ ko'tarilmaydi (RFC 7518 §3.2) |
| `REST_ALLOWED_HOSTS` bo'sh | konnektor **katalogga kirmaydi** |
| Ruxsat sinxroni yoqilgan, kalit yo'q | ⛔ tool-executor ko'tarilmaydi |

⚡ Bu ro'yxat qisqa bo'lgani yaxshi emas — u **uzunroq** bo'lishi
kerak edi. Quyidagilar hozircha faqat ogohlantirish beradi.

## Sizning qaroringiz — hech kim majburlamaydi

⛔ Bularning har biri yoqilmasa platforma ishlashda **davom etadi**.

| Darvoza | Yoqilmasa |
|---|---|
| `PLATFORM_ENCRYPTION_REQUIRED=true` | telefon raqamlari shifrlanmasdan saqlanishi mumkin |
| `CHECKPOINT_ENCRYPTION_REQUIRED=true` | suhbat mazmuni ochiq matnda |
| `REGISTRY_JWT_SECRET` | registrga kim murojaat qilayotgani tasdiqlanmaydi |
| `EMBEDDING_MODE=server` | ⛔ qidiruv **soxta** natija beradi |
| `VAULT_ADDR` | kredensiallar konteyner muhitida |
| `BILLING_ENFORCE` | balans tugagan tenant ishlashda davom etadi |

## Demo bilan prod farqi

| | Demo | Prod |
|---|---|---|
| Konnektor javoblari | kasseta (fayl) | jonli provayder |
| Kredensiallar | `vault:env/` | `vault:kv/` |
| `APP_ENV` | `demo` | `production` |
| Embedding | server (jonli) | server (jonli) |
| Shifrlash | kalit bor, majburiy emas | ⛔ `REQUIRED=true` |
| Konsol porti | to'g'ridan-to'g'ri | teskari proksi + TLS ortida |

## Prod'ga o'tishdan oldin

1. Kassetalarni **olib tashlang** (`CONNECTOR_CASSETTE_DIR` bo'sh)
2. `APP_ENV=production` qo'ying — hub kasseta qolgan bo'lsa aytadi
3. Haqiqiy kredensiallarni vault'ga yozing
4. `*_REQUIRED=true` bayroqlarini yoqing
5. Jurnalni o'qing — ⚠ har «yoqilgan, lekin kalit yo'q» xabari
   funksiya **jim ishlamayotganini** bildiradi
6. `./tekshir.sh` bilan isbotlang

## Hali yopiq qolgan yuzalar

Konsolda ba'zi bo'limlar ataylab `501` qaytaradi — ular backend
ulanmagan va **namuna ma'lumot bilan ko'rsatilmaydi**. Bu nuqson emas:
jonli API'siz yuza ko'rsatish birinchi mijozni oxirgisi qiladi.

⚠ Ular navigatsiyada ham ko'rinmaydi. Agar konsolda `501` ko'rsangiz —
bu halol javob, buzilgan sahifa emas.
