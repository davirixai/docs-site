---
title: Agent domendan chiqadi
description: Ekosistemaga yangi domen qo'shganingizda agent yozilmaydi — u kontraktlaringizdan generatsiya qilinadi.
sidebar:
  order: 1
  badge:
    text: Yangi
    variant: tip
holat: qisman
holatIzoh: "`davirix app check` ISHLAYDI — PyPI'da `davirix` paketi (A0–A4 darajalari). Agent GENERATORI hali yo'q: hozir agent qo'lda sozlanadi."
---

Siz biznes boshqaruv ekosistemasi quryapsiz. Unda **domenlar** bor:

```
Ekosistema
├── ombor          ← qoldiq, qabul, chiqim, inventarizatsiya
├── savdo          ← buyurtma, mijoz, chegirma
├── moliya         ← to'lov, hisob-faktura, qarz
├── HR             ← xodim, davomat, ish haqi
└── loyiha         ← vazifa, muddat, resurs
```

Savol: har bir domenga AI agentni **qanday qo'shasiz**?

:::tip[Javob: yozmaysiz]
### Agent **yozilmaydi** — u **domen standartidan** keladi.

Domen sakkizta narsani e'lon qilsa, agent va uning butun ishonch qatlami —
tool katalogi, ledger, tasdiq, approval, audit — **avtomatik** keladi.
:::

## ⚡ Eng muhim: paket — **standart**, ilova — **bajaruvchi**

Ko'p odam buni teskari tushunadi. To'g'ri yo'nalish:

```
Domain Pack  =  STANDART      (ombor domeni nima qilishi kerak)
      ↑
   ilovalar uni BAJARADI
      │
  ┌───┴────┬─────────────┬──────────────┐
bizning   sizning      hamkorniki      uchinchi
  ERP     yangi app                     tomon
```

| | |
|---|---|
| `inventory` paketi | **bitta** — standart |
| Uni bajaradigan ilova | **necha bo'lsa ham** |
| Har biri uchun agent | **ayni** paket ishlaydi |

⚡ Ya'ni ertaga boshqa ilova yozsangiz va u `inventory` standartini **A3
darajada** bajarsa — **ayni agent** hech qanday o'zgarishsiz ishlaydi.

⛔ Teskarisi bo'lsa (har ilova o'z paketini yaratsa) ular bir-biriga mos
kelmaydi va har ilova uchun agent qaytadan yoziladi.

## Nega bu ekosistema uchun hal qiluvchi

Bitta domenga agent yozish — bir necha hafta. **Besh domenga** — bir necha
oy, va ularning har biri **boshqacha** ishlaydi: kimdir tasdiqlaydi, kimdir
yo'q; kimdir dublikatdan himoyalangan, kimdir yo'q.

⚡ Generatsiya bilan: **har domen bir xil ishonch qatlamini oladi**, chunki
u qo'lda yozilmaydi.

| | Qo'lda | Generatsiya |
|---|---|---|
| Yangi domen qo'shish | haftalar | **kontrakt yozish vaqti** |
| Ishonch qatlami | har safar qaytadan | **bir xil, platformada** |
| Sifat | dasturchiga bog'liq | **daraja bilan o'lchanadi** |

## Nima bepul keladi

| ✅ Avtomatik | Kim yozadi |
|---|---|
| Tool katalogi | **hech kim** — kontraktdan chiqadi |
| Ledger va idempotentlik | platforma |
| Tasdiq zanjiri → `VERIFIED` | platforma |
| Risk → approval oqimi | platforma |
| Audit izi | platforma |
| Permission majburlash | platforma |

## ⚠ Nima bepul **emas**

Bu halol chegara — uni yashirish keyin ishonchni buzadi.

| Qoladi | Taxminan |
|---|---|
| Prompt va ohang — agent **nima deydi** | ~15% |
| Kontraktda yozilmagan biznes qoidalari | ~5% |
| **Evaluation** — agent yaxshi ishlayaptimi | doimiy ish |

Ya'ni **~80% bepul**. 100% emas, va biz buni va'da qilmaymiz.

## Ombor domeni misolida

### Siz yozasiz — kontrakt fayllari

```yaml
inventory.stock.receive      COMMAND  R2  idempotent
  verification: inventory.stock.get → state = open

inventory.stock.write_off    COMMAND  R3   # yo'qotish — yuqori risk
inventory.daily_summary      QUERY    summary
inventory.low_stock          QUERY    anomaly
inventory.item.search        QUERY    search
inventory.stock.get          QUERY    detail
```

### Agent shundan quriladi

Endi agent qoldiqni tekshiradi, qabulni yozadi, tugayotgan mahsulot haqida
ogohlantiradi — **siz agent kodini yozmagansiz**.

Va u *«qabul yozildi»* deyishga **haqli**, chunki `inventory.stock.get`
uni tasdiqlaydi.

⚠ `write_off` esa `R3` — u **approval** talab qiladi. Bu ham
kontraktdan chiqadi, agent kodidan emas.

## Domenlar birga ishlaganda

Ekosistemaning kuchi shu yerda: agent **domenlar orasida** ishlay oladi.

```
«Bu buyurtmani bajara olamizmi?»
   ├── savdo.buyurtma.get       → nima so'ralgan
   ├── ombor.qoldiq.get         → bormi
   └── moliya.mijoz.qarz        → qarzi bormi
```

⚡ Har domen o'z kontraktini e'lon qilgan bo'lsa, bu **avtomatik** ishlaydi:
agent qaysi domendan nima olishni katalogdan ko'radi.

:::caution[Shart: bir xil kanonik til]
Domenlar bir-birini tushunishi uchun ular **kanonik resurs** shaklida
gaplashishi kerak. Har domen o'z shaklini qaytarsa — agent ularni
bog'lay olmaydi.
:::

## Nega bu shunday ishlaydi

Agent uchun domen — bu **nima qila olishi** va **nima ko'ra olishi**
ro'yxati. Agar bu ro'yxat kod ichida yashiringan bo'lsa, uni odam qo'lda
ko'chirib yozadi va u **darhol eskiradi**.

Kontraktda bo'lsa — u **yagona haqiqat manbai** va agent har relizda o'zi
yangilanadi.

:::caution[Eng ko'p uchraydigan xato]
Domenni yozib bo'lib, keyin *«endi AI qo'shamiz»* deyish.

Unda `verification` yo'q, `_label` yo'q, xatolar erkin matn, query'lar
faqat CRUD — va agent uchun **hamma narsa qaytadan yoziladi**.

Sakkiz band **oldindan** bajarilsa — bu ish **umuman bo'lmaydi**.
:::

## Keyingi qadam

- [Domen shartnomasi](/ilova/shartnoma/) — sakkiz bandning har biri
- [Tayyorlik darajalari](/ilova/darajalar/) — A0 dan A4 gacha
- [Domain Pack](/paket/nima-bu/) — domen AI semantikasi qanday qadoqlanadi
