---
title: Eng muhim qoida
description: "`status: completed` — «bajarildi» degani EMAS. Bu farqni tushunmasdan qilingan integratsiya jim buziladi."
sidebar:
  order: 3
  badge:
    text: Avval o'qing
    variant: caution
holat: ishlaydi
---

:::danger[Bitta gap]
### `status: completed` — «bajarildi» degani **EMAS**.

U **model javob berdi** degani. Amal (SMS ketdimi, bitim yaratildimi)
bajarildimi — bu **boshqa maydonda**.
:::

## Nega ikkita maydon

Bitta ijro ikkita mustaqil narsani o'z ichiga oladi:

| Savol | Maydon |
|---|---|
| Agent o'z ishini tugatdimi? | `status` |
| Tashqi dunyoda **effekt** bo'ldimi? | `operations[].status` |

Ular **bog'liq emas**. Agent muvaffaqiyatli javob berishi, lekin SMS
ketmasligi mumkin — va bu normal holat, xato emas.

```json
{
  "status": "completed",
  "operations": [
    { "capability_id": "notification.send_sms", "status": "UNKNOWN" }
  ]
}
```

> Yuqoridagi javobda: **agent javob berdi, SMS yetganmi — noma'lum.**

### Bu qanday yuz beradi

Konnektor timeout bersa, xato modelga qaytariladi. Model esa javobini
baribir yozadi — chunki u foydalanuvchiga nimadir aytishi kerak. Amal
Ledger'da `UNKNOWN` bo'lib qoladi va reconciliation uni keyin aniqlaydi.

## Amal holatlari

| Holat | Ma'nosi | Sizga nima qilish kerak |
|---|---|---|
| **`VERIFIED`** | ✅ **Manbadan tasdiqlandi.** Yagona «bajarildi» ma'nosi | Davom eting |
| `ACKNOWLEDGED` | Konnektor javob berdi — **transport**, natija emas | Kuting |
| **`UNKNOWN`** | ⚠ **Natija noma'lum** | ⛔ Qayta yubormang. Kuting |
| `MANUAL_REVIEW` | Mas'ul ko'rigida | Konsolda hal qilinadi |
| `FAILED` | Aniq rad javobi — effekt bo'lishi **mumkin emas** | Xavfsiz qayta urinish mumkin |

:::caution[`UNKNOWN` da qayta yuborish TAQIQ]
Ikkinchi SMS ketishi mumkin. Ikkinchi to'lov o'tishi mumkin.

«Javob kelmadi» va «bajarilmadi» — **bir xil emas**. Reconciliation
yakuniy holatni topadi; sizning vazifangiz — kutish.
:::

## To'g'ri va noto'g'ri kod

Noto'g'ri — eng ko'p uchraydigan xato:

```python
n = dx.run(...)
if n.status == "completed":
    print("SMS yuborildi!")        # ⛔ YOLG'ON bo'lishi mumkin
```

To'g'ri:

```python
n = dx.run(...)

if n.verified:
    print("SMS yetkazildi")        # ✅ manbadan tasdiqlangan
elif n.unknown:
    print("Natija noma'lum — kuting, qayta yubormang")
else:
    print("Bajarilmadi")
```

:::tip[SDK buni majburlaydi]
Python SDK `UNKNOWN` ni **istisno qilib tashlamaydi** — u holat sifatida
qaytadi va siz uni ochiq ko'rib chiqishingiz kerak. Chunki jim yutilgan
`UNKNOWN` — aynan dublikat effekt manbai.
:::

## Nega bunday qilingan

Ko'p platformalar HTTP 200 ni «bajarildi» deb hisoblaydi. Bu xato:

- konnektor **so'rovni qabul qildi** — bu transport;
- provayder uni **qayta ishladi** — bu boshqa narsa;
- effekt **haqiqatan bo'ldi** — bu uchinchi narsa.

Davirix faqat uchinchisini `VERIFIED` deb belgilaydi va buni **manbadan
qayta o'qib** isbotlaydi. Read-back bo'lmasa — `ACKNOWLEDGED` da qoladi
va bu **halol javob**.

## Keyingi qadam

- [Holatlar jadvali](/malumotnoma/holatlar-jadvali/) — 12 ta ijro holati va 7 ta amal holati
- [Idempotentlik](/integrator/idempotentlik/) — dublikatdan qanday himoyalanish
- [5 daqiqada birinchi ijro](/boshlash/besh-daqiqa/)
