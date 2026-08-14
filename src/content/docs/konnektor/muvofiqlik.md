---
title: Muvofiqlik to'plami
description: C1–C12 — konnektor o'tishi kerak bo'lgan testlar va har birining sababi.
sidebar:
  order: 5
holat: qisman
holatIzoh: "To'plam RO'YXATI va daraja hisobi ijroda (`integration-hub/internal/conformance`): statik uchtasi (C1·C9·C12) yuradi. To'qqiz LIVE testi sandbox harness'ini kutadi — ular `skipped` va daraja hisobida O'TGAN deb hisoblanmaydi."
---

Har bir test **haqiqiy nosozlikdan** kelib chiqqan. Ro'yxat o'sadi: yangi
nosozlik topilganda unga test qo'shiladi va barcha konnektorlar qayta
sertifikatlanadi.

## Testlar

| ID | Nimani tekshiradi | Nega | Daraja |
|---|---|---|---|
| **C1** | Manifest sxemaga mos; inline sir yo'q | Sir manifestda bo'lsa u repoga, logga va xato matniga tushadi | L0 |
| **C2** | `probe` kredensialni tekshiradi va **hech narsa yaratmaydi** | Probe iz qoldirsa har ulanish testi manbada axlat yaratadi | L1 |
| **C3** | Noma'lum id → `not_found`, `upstream_error` **emas** | Aralashtirilsa indeks kechikishi `FAILED` ga aylanadi | L1 |
| **C4** | Javob e'lon qilingan `output_schema` ga mos | Sxema yolg'on bo'lsa predikat maydonini topa olmaydi | L1 |
| **C5** | 2⁵³+1 identifikator buzilmaydi | `float64` aniqligi — buzilgan id **boshqa** yozuvni o'qiydi | L1 |
| **C6** | Ayni kalit ikki marta → **bitta** effekt | Retry'da ikkinchi SMS / ikkinchi to'lov | L2 |
| **C7** | N ta **parallel** bir xil niyat → aynan 1 effekt | Ketma-ket idempotentlik parallelda buziladi | L2 |
| **C8** | Timeout → `UNKNOWN`, `FAILED` **emas** | «Javob kelmadi» ≠ «bajarilmadi» | L2 |
| **C9** | Har `write` uchun `verification` bor va uning `operation`'i mavjud `read` amali | Bloksiz yozuv «verified write» emas | **L3** |
| **C10** | Yozgandan keyin read-back predikatni **topadi** | Zanjir uzilgan bo'lsa ham testlar yashil qolishi mumkin | **L3** |
| **C11** | Predikat **tushmagan** holatda `VERIFIED` **bermaydi** | ⚡ Eng muhim — pastga qarang | **L3** |
| **C12** | Kredensial xato matnida, logda va javobda yo'q | Xato matni ko'pincha **model kontekstiga** tushadi | L4 |

## ⚡ C11 — to'plamning yuragi

Boshqa testlar «**ishlayaptimi**» deb so'raydi. C11 «**yolg'on gapira
oladimi**» deb so'raydi.

:::danger[Nega bu hal qiluvchi]
Har doim `{"status":"OK"}` qaytaradigan konnektor **C1–C10 ni to'liq
o'tadi**. Faqat C11 uni ushlaydi.

Biz ataylab manbani muvaffaqiyatsiz holatga keltiramiz va konnektor
`VERIFIED` **bermasligini** tekshiramiz.
:::

## Lokalda yurgizish

```bash
davirix connector verify
```

⚠ Lokal va markaziy to'plam — **bitta kod**. Ikki xil bo'lsa «menda
ishlaydi» muammosi qaytadi.

## Nima qilsangiz yiqilasiz

| Xatti-harakat | Qaysi test ushlaydi |
|---|---|
| Id'ni raqam qilib qaytarish | C5 |
| Noma'lum id uchun 500 berish | C3 |
| Predikat maydonini shartli qo'yish | C10 |
| Konstanta `status: OK` qaytarish | **C11** |
| Timeout'ni `FAILED` qilish | C8 |
| Xato matniga URL qo'shish | C12 |
| `idempotent: true` deb yolg'on yozish | C6 · C7 |

## Keyingi qadam

- [Sertifikatsiya darajalari](/konnektor/sertifikatsiya/)
- [verification bloki](/konnektor/verification/)
