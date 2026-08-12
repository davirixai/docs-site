---
title: Davirix nima
description: AI xodim platformasi — u nima qiladi, nima qilmaydi va kimga kerak.
sidebar:
  order: 1
holat: ishlaydi
---

Davirix — AI **harakat qiladigan** platforma. Uning asosiy qiymati modelda
emas: model har kimda bor. Qiymat — AI aytgan «bajarildi» so'ziga
**ishonish mumkinmi**, shuni hal qilishda.

## Nima qiladi

```
Sizning ilovangiz  →  Davirix  →  Agent  →  Amal  →  Tashqi tizim
                                              ↓
                                      MANBADAN tasdiqlash
```

1. Siz **niyat** yuborasiz — «bu mijozga javob ber», «buyurtma yarat».
2. Agent rejalashtiradi va kerakli amallarni chaqiradi.
3. Har **yozuv amali** hisobga (Operation Ledger) yoziladi.
4. Amal bajarilgach, natija **manbadan qayta o'qib** tasdiqlanadi.
5. Siz `VERIFIED` olasiz — yoki halol `UNKNOWN`.

## Nima **qilmaydi**

| ⛔ | Nega |
|---|---|
| Model javobini «bajarildi» deb hisoblamaydi | Model yozadi, tizim tekshiradi |
| Noaniq natijada qayta yubormaydi | Ikkinchi SMS / ikkinchi to'lov xavfi |
| Zid bilim ustida avto-yozuv qilmaydi | Mas'ul navbatiga tushadi |
| Tasdiqdan keyin amalni o'zgartirmaydi | Tasdiq `action_hash` ga bog'langan |

## Kimga kerak

:::tip[Sizga kerak, agar]
- Pul ko'chadi · xabar ketadi · qoldiq o'zgaradi
- Amal **qaytarib bo'lmaydi**
- Ko'p biznes / ko'p filial
- Regulyator bor (bank, tibbiyot, telekom)
:::

:::note[Sizga kerak EMAS, agar]
- AI faqat **qoralama** yozadi, o'zi harakat qilmaydi
- Bitta biznes, bitta filial
- Egasi har chiqishni o'zi o'qiydi

Bunday holatda oddiy pipeline arzonroq va tezroq. Buni yashirmaymiz.
:::

## Asosiy tushunchalar

| Atama | Ma'nosi |
|---|---|
| **Ijro** (execution) | Bitta niyat — agentning bitta ishga tushishi |
| **Capability** | Biznes amali (`sales.order.create`), tool nomi emas |
| **Tool** | Capability'ning ijrosi — konnektordagi aniq amal |
| **Konnektor** | Tashqi tizimga ulanish (Bitrix24, Eskiz…) |
| **Domain Pack** | Vertikalni qadoqlaydigan paket: capability + tasdiq + konnektor |
| **Ledger** | Har yozuv amalining hisobi — dublikat himoyasi shu yerda |
| **Read-back** | Natijani manbadan qayta o'qish — `VERIFIED` ning sharti |

:::caution[Capability va tool farqi muhim]
Semantik kalitga **capability** tushadi, tool nomi emas. Shuning uchun
konnektor almashsa (Bitrix24 → 1C) idempotentlik **buzilmaydi**: niyat
o'sha-o'sha.
:::

## Keyingi qadam

- [5 daqiqada birinchi ijro](/boshlash/besh-daqiqa/)
- [Eng muhim qoida](/boshlash/eng-muhim-qoida/) — buni o'qimasdan integratsiya qilmang
- [Autentifikatsiya](/boshlash/auth/)
