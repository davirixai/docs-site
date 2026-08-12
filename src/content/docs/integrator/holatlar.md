---
title: Holatlar
description: Ijro 12 holati va amal 7 holati — ular nima uchun ayrim va qaysi biri «bajarildi» degani.
sidebar:
  order: 3
holat: ishlaydi
---

Ikki xil holat bor va ularni **aralashtirmaslik** kerak.

## 1. Ijro holati (`status`)

Agentning o'z ishi qay bosqichda.

```
created → validating → resolving_context → planning → running
   → waiting_for_tool → waiting_for_approval → validating_output
   → completed | failed | cancelled | expired
```

| Holat | Ma'nosi |
|---|---|
| `created` | Qabul qilindi, navbatda |
| `validating` | Kirish tekshirilmoqda |
| `resolving_context` | Bilim va kontekst yig'ilmoqda |
| `planning` | Model rejalashtirmoqda |
| `running` | Bajarilmoqda |
| `waiting_for_tool` | Tashqi tizim javobi kutilmoqda |
| `waiting_for_approval` | **Inson tasdig'i** kutilmoqda |
| `validating_output` | Chiqish tekshirilmoqda |
| `completed` | Agent ishini tugatdi |
| `failed` | Agent ishini tugata olmadi |
| `cancelled` | Bekor qilindi |
| `expired` | Muddati tugadi |

:::caution
`completed` — **agent** tugatdi degani. Amal bajarildimi — pastdagi
jadvalda.
:::

## 2. Amal holati (`operations[].status`)

Tashqi dunyoda **effekt** bo'ldimi.

| Holat | Ma'nosi | Qayta yuborish |
|---|---|---|
| `PREPARED` | Niyat yozildi, hali yuborilmadi | — |
| `SENT` | Konnektorga yuborildi | ⛔ kuting |
| `ACKNOWLEDGED` | Konnektor javob berdi — **transport** | ⛔ kuting |
| **`VERIFIED`** | ✅ **Manbadan tasdiqlandi** | kerak emas |
| **`UNKNOWN`** | ⚠ Natija noma'lum | ⛔ **TAQIQ** |
| `FAILED` | Aniq rad — effekt bo'lishi mumkin emas | ✅ xavfsiz |
| `MANUAL_REVIEW` | Mas'ul ko'rigida | konsolda |
| `RECONCILING` | Yakuniy holat aniqlanmoqda | ⛔ kuting |
| `CANCELLED` | Bekor qilindi | ✅ xavfsiz |

## Nima uchun `ACKNOWLEDGED` ≠ `VERIFIED`

Uch xil narsa bor va ular ketma-ket:

| | Nima bo'ldi |
|---|---|
| **Transport** | Konnektor so'rovni qabul qildi (HTTP 200) |
| **Qayta ishlash** | Provayder uni ishladi |
| **Effekt** | Natija manbada **haqiqatan** bor |

`ACKNOWLEDGED` — birinchisi. `VERIFIED` — uchinchisi, va u **manbadan
qayta o'qib** isbotlanadi.

:::note[Read-back bo'lmasa]
Konnektorda read-back amali bo'lmasa amal `ACKNOWLEDGED` da **qoladi** va
hech qachon `VERIFIED` bo'lmaydi. Bu nosozlik emas — **halol javob**.

Qaysi konnektorda read-back borligini [cheklovlar](/malumotnoma/cheklovlar/)
sahifasi ko'rsatadi.
:::

## Timeout nega `FAILED` emas

```
Konnektorga yuborildi → javob kelmadi (timeout)
                      → UNKNOWN,  FAILED emas
```

«Javob kelmadi» va «bajarilmadi» — **bir xil emas**. So'rov yetib borgan
va amal bajarilgan bo'lishi mumkin; faqat javob yo'qolgan.

⛔ Shuning uchun `UNKNOWN` da ko'r-ko'rona qayta yuborish taqiqlanadi:
ikkinchi SMS, ikkinchi to'lov.

Reconciliation jarayoni keyinroq manbadan yakuniy holatni aniqlaydi.

## Kuzatish

```python
n = dx.get(execution_id)
n.status
```

Yoki **SSE** oqimi bilan real vaqtda:

```http
GET /v1/executions/{id}/stream
Accept: text/event-stream
```

## Keyingi qadam

- [To'liq holatlar jadvali](/malumotnoma/holatlar-jadvali/)
- [Idempotentlik](/integrator/idempotentlik/)
