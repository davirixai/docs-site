---
title: Tayyorlik darajalari A0–A4
description: Ekosistemangizning har bir domeni qaysi darajada — va agent nima qila oladi.
sidebar:
  order: 3
holat: ishlaydi
holatIzoh: "Darajalar ISHLAYDI: `davirix app check` ularni manifestdan hisoblaydi (SDK `davirix` — PyPI)."
---

Har **domen** alohida darajalanadi. Daraja so'ralmaydi — u **bajarilgan bandlardan**
kelib chiqadi.

## Darajalar

| | Nima bor | Agent nima qila oladi |
|---|---|---|
| **A0** | Kontraktlar bor, lekin AI metadata yo'q | ⛔ **hech narsa** |
| **A1** | 4 tur query · `_label` · typed xatolar | 👁 **o'qiydi** — savolga javob beradi |
| **A2** | + Command'lar · `idempotency: required` · permission | ✍️ **yozadi** — natija `ACKNOWLEDGED` |
| **A3** | + **`verification`** har command'ga | ✅ **«bajarildi»** deya oladi |
| **A4** | + Evaluation baseline · degenerativ rejim | 🚀 **avtonom** ishlay oladi |

---

## Har daraja nimani ochadi

### A1 — o'qiydi

Agent mijoz savoliga javob bera oladi: *«Bugun nechta buyurtma bo'ldi?»*,
*«Qaysi mahsulot tugayapti?»*

⛔ Hech narsa **o'zgartira olmaydi**.

### A2 — yozadi

Agent buyurtma yaratadi, stol band qiladi. Lekin natija
`ACKNOWLEDGED` — *«ilova javob berdi»*, `VERIFIED` **emas**.

⚠ Mijozga *«bajarildi»* deb ayta olmaydi. Faqat *«yubordim»*.

### A3 — tasdiqlaydi

⚡ **Asosiy chegara.** Har command'ning read-back juftligi bor va
predikat e'lon qilingan. Endi agent *«buyurtma qabul qilindi»* deyishga
**haqli** — chunki manba tasdiqladi.

### A4 — avtonom

Evaluation baseline bor: agent qanchalik to'g'ri ishlashi **o'lchangan**.
Va har capability **degenerativ rejimda** ishlaydi (1 filial, 1 odam,
tasdiqlovchi yo'q).

---

## ⚠ A2 → A3 — eng ko'p yiqiladigan joy

```
verification bor  →  A3 mumkin
verification yo'q →  A2 da QOLADI
```

Bu **texnik qiyinchilik emas** — bu **unutilgan qaror**:

> *«Bu amal bajarilganini nima isbotlaydi?»*

Har command uchun shu savolga javob bo'lishi kerak. Javob yo'q bo'lsa —
amal hech qachon tasdiqlanmaydi.

:::tip[Uch qator]
```yaml
verification:
  operation: inventory.stock.get
  business_key: id
  expect: { field: resource.state, equals: open }
```
Domen yozilayotganda — **uch qator**. Keyin qo'shilsa — barcha
kontraktlarni qayta ko'rish.
:::

---

## Tekshirish

```bash
$ davirix app check

A1 ✅   A2 ✅   A3 ⛔   A4 ⛔

Yetishmayapti (A3):
  inventory.stock.receive   — `verification` bloki yo'q
  inventory.stock.write_off  — `verification` bloki yo'q

  ⚠ Bu ikki amal HECH QACHON VERIFIED bo'lmaydi.

Yetishmayapti (A4):
  evaluation baseline yo'q
  inventory.stock.receive — degenerativ rejim sinalmagan
```

---

## Degenerativ rejim — A4 ning sharti

Har domen **yakka tadbirkorda** ham ishlashi kerak: 1 filial, 1 odam,
tasdiqlovchi yo'q.

| ⛔ Buzadi | ✅ To'g'ri |
|---|---|
| «Filial tanlang» — majburiy | Bitta filial bo'lsa avtomatik |
| «Menejer tasdiqlasin» — majburiy | Tasdiqlovchi yo'q bo'lsa o'tadi |
| Bo'lim tuzilmasi talab qilinadi | Ixtiyoriy |

⚠ Va o'sganda — **migratsiya bo'lmasin**. 2-filial qo'shilganda ayni
capability ishlashda davom etsin.

:::caution[Nega bu daraja sharti]
«Biznes o'ssa platforma ham o'sadi» va'dasi faqat shu bilan haqiqiy.
Migratsiya talab qiladigan domen bu va'dani **buzadi**.
:::

---

## Sertifikat

A3 va undan yuqorisi **sertifikatlanadi** — konnektorlar kabi:

```json
{
  "domain_id": "inventory",
  "version": "2.1.0",
  "contracts_digest": "sha256:...",
  "level": "A3",
  "issued_at": "...",
  "expires_at": "..."
}
```

⚡ Bu uchinchi tomon domenlari uchun muhim: **boshqa dasturchi yozgan
ombor yoki HR domeni A3 chiqsa — uni tekshirmasdan ishonish mumkin.**

## Keyingi qadam

- [Domen shartnomasi](/ilova/shartnoma/) — sakkiz band
- [Sertifikatsiya](/konnektor/sertifikatsiya/) — ayni mexanizm konnektorlarda
