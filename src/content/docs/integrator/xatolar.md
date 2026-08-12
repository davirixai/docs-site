---
title: Xatolar
description: Xato konverti, `retryable` semantikasi va qaysi xatoda nima qilish kerak.
sidebar:
  order: 5
holat: ishlaydi
---

## Konvert

```json
{
  "error": {
    "code": "rate_limited",
    "message": "so'rovlar chegarasi oshdi",
    "retryable": false
  }
}
```

Maydon nomi **`code`**, `type` **emas**.

:::note[Ichki detallar chiqmaydi]
Host, URL, sir, stack trace — hech qachon xato matnida bo'lmaydi.
Sabab: xato matni ko'pincha **model kontekstiga** tushadi, ya'ni u
promptning bir qismiga aylanadi.
:::

## `retryable` — yagona to'g'ri signal

```python
except APIError as e:
    if e.retryable:
        ...   # qayta urinish XAVFSIZ
    else:
        ...   # qayta urinish muammoni TUZATMAYDI
```

⛔ HTTP kodiga qarab retry qilmang. `503` ba'zan qayta urinsa bo'ladi,
ba'zan yo'q — bu **konnektor** semantikasiga bog'liq va uni faqat
platforma biladi.

## Asosiy kodlar

| Kod | HTTP | `retryable` | Nima qilish |
|---|---|---|---|
| `unauthorized` | 401 | ❌ | Kalitni tekshiring |
| `forbidden` | 403 | ❌ | Ruxsat yo'q — konsolda bering |
| `not_found` | 404 | ❌ | Identifikatorni tekshiring |
| `invalid_request` | 400 | ❌ | So'rov shakli noto'g'ri |
| `duplicate_intent` | 409 | ❌ | ⚠ Bu **himoya** — kuting |
| `duplicate_intent_verified` | 409 | ❌ | ✅ Allaqachon bajarilgan |
| `knowledge_conflict_hold` | 409 | ❌ | Mas'ul ko'rigiga tushdi |
| `rate_limited` | 429 | ⚠ | `Retry-After` ni hurmat qiling |
| `ledger_unavailable` | 503 | ✅ | Hisob javob bermadi — amal **bajarilmadi** |
| `timeout` | 504 | ⛔ | ⚠ Natija **noma'lum** — pastga qarang |

To'liq ro'yxat: [xato kodlari](/malumotnoma/xato-kodlari/).

## ⚠ Timeout — alohida holat

```
timeout  →  amal bajarilgan BO'LISHI MUMKIN
```

Bu `retryable` savolining o'zi noto'g'ri qo'yilgan holat. To'g'ri
xatti-harakat:

1. **Qayta yubormang.**
2. Ijro holatini oling — amal `UNKNOWN` da bo'ladi.
3. Reconciliation yakuniy holatni aniqlashini kuting.

:::danger
`timeout` da qayta yuborish — dublikat effektning **eng ko'p uchraydigan
sababi**. Ikkinchi SMS, ikkinchi to'lov.
:::

## `ledger_unavailable` nega xavfsiz

`503 ledger_unavailable` — operatsiya hisobi javob bermadi. Bu holatda
amal **umuman bajarilmagan**: platforma dublikat himoyasisiz yozuv
amalini bajarmaydi (fail-closed).

Shuning uchun bu xato `retryable: true` — qayta urinish xavfsiz.

## Yordam so'rash

Xabar berganda **`execution_id`** va **`request_id`** ni yuboring:

```python
except APIError as e:
    log.error("davirix", request_id=e.request_id, code=e.code)
```

⛔ Suhbat matnini yubormang — u bizga kerak emas va nol-saqlash
rejimida saqlanmaydi ham.

## Keyingi qadam

- [Holatlar](/integrator/holatlar/)
- [Cheklovlar](/malumotnoma/cheklovlar/)
