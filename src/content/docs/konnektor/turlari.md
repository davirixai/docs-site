---
title: Konnektor turlari
description: Qaysi tashqi tizimga ulanish kerak, qaysiga kerak emas — va nega.
sidebar:
  order: 2
holat: ishlaydi
---

Davirix **tizim sotadi**, boshqa tizimga qo'shimcha emas. Bu konnektor
strategiyasini butunlay belgilaydi.

## Uch tur — butunlay boshqa narsalar

| Tur | Misol | Rol | Umri |
|---|---|---|---|
| **Kontragent** | SMS · to'lov · bank · marketpleys · soliq | Tashqi **tomon** bilan ishlash | ♾️ **abadiy** |
| **Import** | eski CRM · eski ombor tizimi | Mijozni **ko'chirish** | ⏳ **so'nadi** |
| ~~Tashqi tizimda ishlash~~ | ~~begona CRM'da bitim yaratish~~ | ⛔ **kerak emas** | — |

---

## 1. Kontragent — abadiy

Bular **tashqi tomonlar**, tizimlar emas. Ularni hech qachon o'z
platformangizga so'ra olmaysiz:

| Nima | Nega abadiy |
|---|---|
| **SMS operatori** | Xabar operator tarmog'idan ketadi |
| **To'lov tizimi** | Pul bank infratuzilmasidan o'tadi |
| **Bank** | Hisob bankda |
| **Marketpleys** | Xaridor u yerda |
| **Soliq organi** | Davlat |

⚡ Bular **eng yuqori sifat** talab qiladi va **bizda** bo'lishi kerak.
Ularsiz tizim ishlamaydi — biznes to'lovsiz va xabarsiz yurmaydi.

### Bugungi holat

| Kontragent | Holat |
|---|---|
| `eskiz-sms` | ✅ **3 amal** · read-back bor |
| `payme` | ✅ **3 amal** · ⚠ jonli chaqiruvsiz |
| `aisha` · `uzbekvoice` | ✅ nutq xizmati · **2 amal**dan |
| `click` | ⛔ **0 amal** |
| `uzum` | ⛔ **0 amal** |
| bank · soliq | ⛔ manifest ham yo'q |

⚠ `payme` kasseta bilan sinalgan, **jonli provayderga hech qachon
chiqmagan**. Uchta noaniqlik ochiq qolgan («chek topilmadi» kodi,
endpoint, holat `5` ma'nosi) — ular birinchi sandbox chaqiruvida yopiladi.

---

## 2. Import — so'nadigan

Mijozning eski tizimi. Vazifasi — **ma'lumotni olib chiqish** va
**soya rejimida** parallel ishlash.

```
1. Import        — eski tizimdan o'qiymiz
2. Soya          — Davirix yonma-yon ishlaydi, DRAFT chiqaradi
3. Solishtirish  — mijoz farqni ko'radi
4. Ko'chish      — mijoz XOHLAGANDA
5. Konnektor     — o'chadi
```

⛔ Import konnektorida **yozish amali BO'LMAYDI** — va bu endi
xohish emas, **majburlanadigan qoida**.

Manifestda `connector_class: import` deb belgilanadi, keyin:

| Darvoza | Qayerda | Nima bo'ladi |
|---|---|---|
| Kontrakt sxemasi | `contracts/integration/v1` | `import` + `direction: write` → manifest **yaroqsiz** |
| Hub ko'tarilishi | `Manifest.Validate()` | buzuq manifest bilan hub **ishga tushmaydi** |
| Tool registri | tool-executor testi | bitrix yozuv tool'i qo'shilsa CI **qizaradi** |
| Instans sozlamasi | `console.supports_write: false` | `read_write` scope bilan instans **yaratilmaydi** |

⚡ 2026-08-12 da `bitrix24` dan uchta yozuv amali (`crm.create_lead`,
`crm.create_deal`, `crm.add_activity`) **olib tashlandi** — ular
qonundan oldin yozilgan va uni buzib turgan edi.

Faqat quyidagilar kerak:

| Kerak | Nega |
|---|---|
| Ro'yxat (sahifalab) | Ommaviy import |
| Delta (o'zgarishlar) | Soya rejimini yangilab turish |
| Bitta yozuv detali | Solishtirish |

---

## 3. ⛔ Tashqi tizimda ishlash — kerak emas

:::danger[Strategik qaror]
Biz **begona CRM'da bitim yaratmaymiz**. Biz o'z tizimimizda ishlaymiz.

Agar biz mijozning Bitrix'ida ishlasak — biz Bitrix'ning qo'shimchasiga
aylanamiz, va Bitrix ertaga o'z AI'ni chiqarsa biz **keraksiz** bo'lamiz.
:::

Shuning uchun `crm.create_deal` kabi amallar — strategik jihatdan
**ortiqcha**. Ular tarixiy sabab bilan mavjud va yangi konnektorlarda
takrorlanmaydi.

---

## Mijozga qanday aytiladi

⚠ *«Bitrix'ingizni tashlang»* — bu qarshilik tug'diradi va sotuvni
to'xtatadi.

To'g'ri ketma-ketlik:

| # | Mijoz eshitadi |
|---|---|
| 1 | «Hech narsani o'zgartirmang — biz **yonma-yon** ko'rsatamiz» |
| 2 | «Mana bir oylik **farq**» |
| 3 | «Xohlasangiz ko'chiramiz» — **qaror sizda** |
| 4 | «O'ssangiz tizim ham o'sadi — **migratsiya yo'q**» |

Bog'liqlikning yo'qolishi — **natija**, va'da emas.

## Keyingi qadam

- [Manifest](/konnektor/manifest/)
- [verification bloki](/konnektor/verification/)
