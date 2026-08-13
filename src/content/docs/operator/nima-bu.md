---
title: Operator uchun
description: Platformani serverga qo'yadigan va ishlatib turadigan kishi uchun — stek xaritasi, sozlamalar, nosozliklarni payqash.
sidebar:
  order: 1
holat: ishlaydi
---

Bu bo'lim **platformani ishlatib turadigan** kishi uchun. Boshqa
bo'limlardan farqi: u platformaga *ulanish* haqida emas, uni *tirik
saqlash* haqida.

| Bo'lim | Kim uchun |
|---|---|
| Integrator | platformani **ishlatadi** (API, SDK) |
| Konnektor dasturchisi | platformaga **konnektor qo'shadi** |
| Domen quruvchi | platformaga **ilova ulaydi** |
| **Operator** | platformani **serverda saqlaydi** |

## Eng muhim qoida

> ⛔ **Bu platformaning nosozliklari ODATDA XATO SAHIFASI BERMAYDI.**

Servis ko'tariladi, sog'liq tekshiruvi yashil bo'ladi, sahifa 200
qaytaradi — va shu payt uning bir qismi ishlamayotgan bo'ladi.

Sabab arxitekturaviy: platforma **fail-closed** qurilgan. Sozlama
yetishmasa, komponent o'zini o'chiradi va **jurnalga yozadi** —
chunki jimgina yarim ishlash yolg'on ma'lumot berardi.

⚠ Ya'ni: **jurnal — asosiy asbob, xato sahifasi emas.**

Haqiqiy misol (2026-08-13 stendida o'lchangan): ikkita servis sarf
hisobotini yubora olmadi va **39 marta** 401 oldi. Konsol ishlayotgandek
ko'rinardi, konnektor chaqiruvlari bajarilardi — faqat ularning
**xarajati hech qayerda qayd etilmasdi**. Buni faqat jurnal aytdi.

## Shu bois o'qish tartibi

1. [Stek xaritasi](/operator/stek/) — nima nimaga bog'liq
2. [Sozlamalar](/operator/sozlamalar/) — nima yetishmasa nima o'chadi
3. ⚡ [Jim nosozliklar](/operator/jim-nosozliklar/) — **eng muhim sahifa**
4. [Birinchi ishga tushirish](/operator/birinchi-ishga-tushirish/)
5. [Sirlar](/operator/sirlar/)
6. [Zaxira](/operator/zaxira/)
7. [Prod darvozalari](/operator/prod-darvozalari/)

## Bu hujjatda sirlar YO'Q

Barcha kalitlar **shablon** ko'rinishida: `<...>`. Hech bir haqiqiy
qiymat bu yerga yozilmaydi — hujjat nusxalanadi, sir esa nusxalanmasligi
kerak.
