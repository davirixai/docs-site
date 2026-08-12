---
title: Domen shartnomasi — 8 band
description: Agent generatsiya qilinishi uchun ekosistema domeni nimani e'lon qilishi kerak.
sidebar:
  order: 2
holat: ishlaydi
holatIzoh: "Kontrakt sxemasi va `davirix app check` ISHLAYDI (SDK 0.2.0). Generator hali yo'q."
---

Sakkiz band. Hammasi bo'lsa — agent generatsiya qilinadi.

---

## 1. Command'lar — nima qila olaman

Har **holat o'zgartiruvchi** amal typed kontrakt bo'lishi shart.

```yaml
id: inventory.stock.receive
operation_type: COMMAND
risk_level: R2
idempotency: required          # ⚠ MAJBURIY
concurrency: optimistic
input:  { type: object, ... }
output: { type: object, ... }
```

| Maydon | Nega |
|---|---|
| `idempotency: required` | ⛔ Busiz agent retry'da **dublikat** yaratadi |
| `risk_level` | Approval oqimi shundan chiqadi |
| `concurrency` | Agent eski ma'lumot bilan yozmasligi uchun |

:::danger[To'g'ridan-to'g'ri UPDATE taqiq]
Handler ichida to'g'ridan-to'g'ri baza yozuvi — agent uchun **kontrakt
yo'q** degani. Har o'zgarish nomlangan command bo'lishi shart.
:::

---

## 2. Query'lar — nima ko'ra olaman

**To'rt tur majburiy.** Bittasi yetishmasa agent ishlay olmaydi.

| Tur | Misol | Agent nima uchun ishlatadi |
|---|---|---|
| **Summary** | `inventory.daily_summary` | «Umumiy holat qanday?» |
| **Anomaly** | `inventory.low_stock` | «Nima muammo?» |
| **Search** | `inventory.item.search` | Aniq yozuvni topish |
| **Detail** | `inventory.stock.get` | Bitta yozuv tafsiloti |

:::caution[Nega faqat CRUD yetarli emas]
```
❌ GET /stock?page=1&limit=100
   → 100 xom qator, 40 KB
   → agent kontekstining yarmi ketadi
   → agent o'zi agregatsiya qilib XATO qiladi

✅ GET /stock/summary?period=7d&group_by=warehouse
   → 5 qator, 800 bayt
   → tayyor xulosa
```
Agent vaqtining ~80% o'qishga ketadi. Yomon o'qish interfeysi — yomon agent.
:::

---

## 3. ⚡ Verification — «bajarildi» deyish huquqi

**Eng muhim band.** Har `COMMAND` qaysi query bilan tasdiqlanishini
e'lon qiladi.

```yaml
id: inventory.stock.receive
verification:
  operation:    inventory.stock.get
  business_key: id
  expect:       { field: resource.state, equals: open }
```

:::danger[Busiz nima bo'ladi]
Amal `ACKNOWLEDGED` da qoladi va **hech qachon** `VERIFIED` bo'lmaydi.
Tizim u haqda «bajarildi» **deya olmaydi**.

Bu nosozlik emas — halol javob. Lekin domeningiz uchun bu degani:
agent u yerda hech narsani tasdiqlay olmaydi.
:::

⚠ Domen yozib bo'lingandan **keyin** bu bandni qo'shish — barcha
kontraktlarni qayta ko'rish. **Oldindan** yozilsa — har command'ga
**uch qator**.

---

## 4. Permission — nima qila olmayman

```yaml
permissions:
  required: [inventory.stock.receive]
```

Bo'sh bo'lishi mumkin emas. Agent ruxsatni **UI'da emas, serverda**
tekshiriladi — aks holda u qoidani chetlab o'tadi.

---

## 5. `summary_for_ai` — reja qurish uchun

```yaml
summary_for_ai: >
  Omborga qabulni yozadi. OLDIN `inventory.item.search` bilan mahsulot
  kartochkasi borligini tekshiring. `ITEM_NOT_FOUND` xatosi — mahsulot
  katalogda yo'q, avval uni yarating.
```

Uch narsa: **nima qiladi** · **oldin nima chaqiriladi** · **asosiy xato
nimani anglatadi**.

⚠ Bu prompt emas — bu **API hujjati agent uchun**. U bo'lmasa agent
amallarni noto'g'ri tartibda chaqiradi.

---

## 6. Kanonik resurs va holat

Domeningiz qaytaradigan har resurs kanonik shaklga tushadi:

```json
{
  "resource": {
    "id":           "mov_01hq...",
    "type":         "stock_movement",
    "state":        "open",
    "source_state": "AWAITING_CHECK",
    "updated_at":   "...",
    "version":      "3"
  },
  "attributes": { "warehouse_code": "WH-1", "qty": "12" }
}
```

| Kanonik `state` | Ma'nosi |
|---|---|
| `open` | mavjud va faol |
| `closed` | yakunlangan |
| `cancelled` | bekor qilingan |
| `pending` | qayta ishlanmoqda |
| `failed` | muvaffaqiyatsiz |
| **`unknown`** | ⚠ xaritalab bo'lmadi |

:::danger[`unknown` — xavfsizlik kaliti]
Holatni xaritalay olmasangiz `unknown` qaytaring. Predikat **tushmaydi**
va natija `VERIFIED` bo'lmaydi.

⛔ «Taxminan `open` bo'lsa kerak» deb yozish — soxta tasdiq manbai.
:::

⚠ **Qat'iy qoida:** Domain Pack faqat `resource.*` ga tayanadi.
`attributes.*` — domeningizga xos, agent semantikasi unga bog'lanmaydi.

---

## 7. Typed xatolar

```yaml
errors:
  - ITEM_NOT_FOUND
  - STOCK_INSUFFICIENT
  - PERIOD_CLOSED
  - VALIDATION_FAILED
```

⛔ Erkin matnli xato — agent uni **tushunmaydi** va keyingi qadamni
tanlay olmaydi. Har xato **kod** bo'lishi va kontraktda **e'lon
qilinishi** shart.

⚠ Handler qaytaradigan, lekin kontraktda yo'q xato — CI'da yiqiladi.

---

## 8. Har ID yonida `_label`

```json
{
  "warehouse_id":    "wh_01hq...",
  "warehouse_label": "Markaziy ombor",
  "item_id":         "itm_01hq...",
  "item_label":      "Canon EOS R6 (korpus)",
  "actor_id":        "actor_01hq...",
  "actor_label":     "Aziz Karimov"
}
```

| Yo'q bo'lsa | Nima bo'ladi |
|---|---|
| `_label` yo'q | Agent keyingi chaqiruvda ID'ni **o'ylab topadi** |
| ID yo'q | Agent foydalanuvchiga tushunarsiz javob beradi |

**Ikkalasi ham bo'lishi shart.**

---

## Tekshirish

```bash
pip install davirix
davirix app check app-manifest.json
```

Ilova o'zini **App Manifest** bilan e'lon qiladi — bitta JSON fayl.

:::tip[Nega katalog tuzilmasi emas]
Tekshiruvchi ilovaning **ichki tartibini bilmaydi**. Bir ilova
command'larni YAML fayllarda, boshqasi kodda dekoratorlarda saqlaydi.

Agar tekshiruvchi katalog shakliga tayansa, **birinchi ilovaning
shakli standart** bo'lib qolardi va ikkinchi domen (restoran, klinika)
unga sig'masdi.
:::

Chiqish yetishmagan bandni **qaysi darajani to'sishi** bilan ko'rsatadi:

```
Daraja: A2 — Command'lar idempotentlik bilan, agent YOZADI

  A3 ga chiqish uchun:
    - [command.verification.missing] `inventory.stock.receive`:
      `verification` yo'q. Konnektorning javobi biznes natijasi EMAS.
```

### CI darvozasi

```bash
davirix app check app-manifest.json --min-level A3
```

⚠ Standart `--min-level` — **A1**, A3 emas. Endi boshlagan ilova
birinchi kunidan qizil CI ko'rsa, tekshiruvchini **o'chirib qo'yardi**.

### ⛔ Daraja e'lon qilinmaydi

Manifestda `level` maydoni **yo'q** va bo'lmaydi — u **hisoblanadi**.
Ilova o'zini A4 deb **atay olmaydi**.

## Keyingi qadam

- [Tayyorlik darajalari](/ilova/darajalar/)
- [verification bloki](/konnektor/verification/) — chuqurroq
