---
title: verification bloki
description: Yozuv amalini «bajarildi» deb aytishga haqli qiladigan yagona narsa.
sidebar:
  order: 3
  badge:
    text: Eng muhim
    variant: danger
holat: ishlaydi
---

:::danger[Bitta gap]
### `verification` bloki **yo'q** amal — «verified write» **EMAS**.

Uning natijasi hech qachon `VERIFIED` deb belgilanmaydi. Tizim u haqda
«bajarildi» deya **olmaydi**.
:::

## Nima qiladi

Yozgandan keyin platforma **manbadan qayta o'qiydi** va e'lon qilingan
predikatni qo'llaydi:

```
yozuv → javob (id) → read-back(id) → predikat → VERIFIED | FAILED | UNKNOWN
```

## Shakli

```json
{
  "name": "crm.create_deal",
  "direction": "write",
  "verification": {
    "operation":    "crm.get_deal",
    "business_key": "id",
    "expect":       { "field": "closed", "equals": "N" },
    "max_wait_ms":  15000,
    "on_missing":   "UNKNOWN",
    "version_field": "resource_version"
  }
}
```

| Maydon | Majburiy | Ma'nosi |
|---|---|---|
| `operation` | ✅ | Read-back amali nomi — u **mavjud** va `direction: read` bo'lishi shart |
| `expect` | ✅ | Muvaffaqiyat predikati — deklarativ, erkin matn emas |
| `business_key` | — | Read-back'ga uzatiladigan kalit nomi |
| `max_wait_ms` | — | Manba yozuvi ko'rinishini kutish (max 10 daqiqa) |
| `on_missing` | — | Topilmaganda: `UNKNOWN` (standart) yoki `FAILED` |
| `version_field` | — | Berilsa eski replikadan o'qish aniqlanadi |

## ⚠ `business_key` — ikki vazifa bajaradi

Bu eng ko'p xato qilinadigan joy:

| | |
|---|---|
| 1️⃣ | **Yozuv javobidagi** maydon nomi — resurs id'si shundan olinadi |
| 2️⃣ | **Read-back argumenti** nomi — o'sha qiymat shu nom bilan uzatiladi |

Ya'ni ikkalasi **bir xil** bo'lishi shart:

```json
// crm.create_deal javobi:   {"id": "10001", "created": true}
// crm.get_deal kirishi:     {"id": "10001"}
"business_key": "id"          // ✅ ikkalasiga mos
```

:::caution[Nega bu muhim]
Yaratish amalida resurs id'si **faqat javobda** bo'ladi — so'rovda u
hali yo'q. Nomlar mos kelmasa kalit **bo'sh** ketadi, read-back yozuvni
topa olmaydi va natija **abadiy `UNKNOWN`** bo'lib qoladi.
:::

## `expect` — predikat

Aynan **bittasi**: `in` yoki `equals`.

```json
"expect": { "field": "status", "in": ["DELIVERED", "delivered"] }
"expect": { "field": "closed", "equals": "N" }
```

:::danger[Ikkalasi ham bo'lmasa]
Predikat «har qanday javob yaraydi» bo'lardi — bu tekshiruv **emas**,
bu soxta `VERIFIED` manbai. Sxema buni **rad etadi**.
:::

⚠ Provayder taksonomiyasi **manifestda**, kodda emas. Provayder holat
nomlarini o'zgartirsa — manifest qatori o'zgaradi, kod emas.

## `on_missing` — nega standart `UNKNOWN`

```
manbada yozuv topilmadi  ≠  amal bajarilmadi
```

Indeks kechikishi yoki eventual consistency yozuvni **vaqtincha**
yashirishi mumkin. `FAILED` ni standart qilish amalni noto'g'ri yopardi.

`FAILED` ni faqat manba **darhol-izchil** (read-after-write) bo'lsa
tanlang.

## Predikat maydonini **har doim** qaytaring

Read-back javobida predikat maydoni **bo'lmasa** verifier `field_missing`
bilan `UNKNOWN` beradi — ya'ni tasdiq **jim ishlamaydi**.

```go
// ✅ To'g'ri: maydon har doim bor, qiymati bo'sh bo'lsa ham
out["closed"] = closed        // "" bo'lishi mumkin

// ⛔ Noto'g'ri: bo'sh bo'lsa maydon umuman qo'yilmaydi
if closed != "" { out["closed"] = closed }
```

## Read-back **yo'q** bo'lsa nima bo'ladi

Bu normal holat — provayderning API'si shunday. Unda:

- amal `ACKNOWLEDGED` da qoladi;
- konnektor **L2** darajada qoladi ([sertifikatsiya](/konnektor/sertifikatsiya/));
- bu **kamchilik emas, halol javob**.

:::tip
Soxta yashildan ko'ra tasdiqsizlik yaxshiroq. Manba isbot bera olmasa —
tizim ham «bajarildi» demaydi.
:::

## Keyingi qadam

- [Sertifikatsiya darajalari](/konnektor/sertifikatsiya/)
- [Muvofiqlik to'plami](/konnektor/muvofiqlik/) — C9–C11 aynan shu blokni sinaydi
