---
title: Idempotentlik
description: Bir niyat — bir effekt. Kalitni qanday tanlash va nega u sizning asosiy himoyangiz.
sidebar:
  order: 4
holat: ishlaydi
---

Tarmoq ishonchsiz. So'rov ketadi, javob yo'qoladi, kod qayta urinadi —
va mijoz **ikkita** SMS oladi. Idempotentlik aynan shuni to'sadi.

## Ikki qatlam

Himoya ikki joyda ishlaydi va ular boshqa-boshqa:

| Qatlam | Nima qiladi | Nima bilan |
|---|---|---|
| **Transport** | Ayni so'rovni takrorlamaydi | `idempotency_key` |
| **Semantik** | Ayni **niyatni** takrorlamaydi | Operation Ledger |

:::tip[Asosiy himoya — ikkinchisi]
Transport kaliti bir xil so'rovni ushlaydi. Lekin agent har safar
biroz boshqacha so'rov yuborishi mumkin — matn o'zgaradi, tartib
o'zgaradi. Semantik kalit **biznes niyatini** oladi va shuning uchun
haqiqiy himoya u.
:::

## Semantik kalit nimadan tuziladi

```
tenant_id → business_id → actor_ref → capability_id
          → resource_ref → business_window
```

⚡ **`capability_id`**, tool nomi **emas**. Shuning uchun konnektor
almashsa (Bitrix24 → 1C) idempotentlik **buzilmaydi**: niyat o'sha-o'sha.

Bazada bu `UNIQUE (tenant_id, semantic_key)` — yagona haqiqiy himoya.

:::note[O'lchangan natija]
**10 000 parallel** bir xil niyat → jonli PostgreSQL'da **aynan 1** effekt.
:::

## Kalitni qanday tanlash

### ✅ To'g'ri

```python
# Biznes hodisasiga bog'langan — barqaror
idempotency_key = f"buyurtma-{order_id}-tasdiq"
```

Ayni buyurtma uchun qayta chaqirsangiz — ikkinchi effekt yo'q.

### ⛔ Noto'g'ri

```python
idempotency_key = str(uuid4())          # har safar yangi → himoya YO'Q
idempotency_key = str(time.time())      # ayni sabab
```

Tasodifiy kalit — himoyani **o'chirish** bilan barobar.

### Takrorlanadigan amal

Kunlik hisobot kabi amal **har kuni** takrorlanishi kerak:

```python
idempotency_key = f"kunlik-hisobot-{date.today()}"
```

Bu `business_window` tushunchasi: sana kalitning bir qismi bo'ladi,
shuning uchun ertaga ayni amal **bloklanmaydi**.

## Kalit to'qnashuvi

| Holat | HTTP | Ma'nosi |
|---|---|---|
| Ayni kalit + **ayni** tana | `200` | Mavjud ijro qaytadi |
| Ayni kalit + **boshqa** tana | **`409`** | Jim ustiga yozish yo'q |

⚠ `409` — bu xato emas, **himoya**. U «siz ayni kalitni boshqa niyat
uchun ishlatyapsiz» degani.

## Takrorlangan niyat

Amal allaqachon boshlangan bo'lsa konnektorga **borilmaydi**:

| Mavjud holat | Javob |
|---|---|
| `VERIFIED` | `409 duplicate_intent_verified` — allaqachon bajarilgan |
| Boshqasi | `409 duplicate_intent` — boshlangan, holati noaniq |

Farq ataylab: birinchisi **muvaffaqiyat** (yangi effekt kerak emas),
ikkinchisi esa «kuting».

## Cheklov

:::caution[Transport oynasi — 60 daqiqa]
Konnektor natijasi eng ko'pi bilan **60 daqiqa** transport qatlamida
turadi, so'ng o'chiriladi. Semantik himoya (Ledger) esa **muddatsiz**.
:::

## Keyingi qadam

- [Holatlar](/integrator/holatlar/) — `UNKNOWN` va nega retry taqiq
- [Xatolar](/integrator/xatolar/)
