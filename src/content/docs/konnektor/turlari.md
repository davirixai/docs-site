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
| `payme` | ⛔ **0 amal** |
| `click` | ⛔ **0 amal** |
| `uzum` | ⛔ **0 amal** |
| bank · soliq | ⛔ manifest ham yo'q |

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

⚠ Import konnektoriga **yozish amali kerak emas**. Faqat:

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
