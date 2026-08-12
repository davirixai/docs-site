---
title: Xato kodlari
description: To'liq ro'yxat — kod, HTTP, `retryable` va nima qilish kerak.
sidebar:
  order: 2
holat: ishlaydi
---

Konvert:

```json
{ "error": { "code": "…", "message": "…", "retryable": false } }
```

Maydon nomi **`code`**, `type` emas.

## Ijro (agent-runtime)

| Kod | HTTP | `retryable` | Nima qilish |
|---|---|---|---|
| `invalid_request` | 400 | ❌ | So'rov shakli noto'g'ri |
| `unauthorized` | 401 | ❌ | Kalitni tekshiring |
| `forbidden` | 403 | ❌ | Ruxsat yo'q — konsolda bering |
| `not_found` | 404 | ❌ | Identifikatorni tekshiring |
| `duplicate_intent` | 409 | ❌ | ⚠ **Himoya** — kuting |
| `duplicate_intent_verified` | 409 | ❌ | ✅ Allaqachon bajarilgan |
| `knowledge_conflict_hold` | 409 | ❌ | Mas'ul ko'rigiga tushdi |
| `rate_limited` | 429 | ⚠ | `Retry-After` ni hurmat qiling |
| `internal_error` | 500 | ⚠ | Qayta urinish mumkin |
| `ledger_unavailable` | 503 | ✅ | Amal **bajarilmadi** — xavfsiz |
| `timeout` | 504 | ⛔ | ⚠ Natija **noma'lum** — qayta yubormang |

## Konnektor (integration-hub)

| Kod | Ma'nosi | Effekt bo'lganmi |
|---|---|---|
| `invalid_request` | Argument noto'g'ri | ⛔ yo'q |
| `unauthorized` | Kredensial yaroqsiz | ⛔ yo'q |
| `forbidden` | Ruxsat yo'q | ⛔ yo'q |
| `not_found` | Yozuv topilmadi | ⛔ yo'q |
| `credential_error` | Kredensial sozlanmagan/xato | ⛔ yo'q |
| `payment_required` | Provayder balansi | ⛔ yo'q |
| `rate_limited` | Provayder cheki | ⛔ yo'q |
| `upstream_error` | Provayder xatosi | ⚠ **noma'lum** |
| `timeout` | Javob kelmadi | ⚠ **noma'lum** |
| `internal` | Ichki xato | ⚠ **noma'lum** |
| `not_implemented` | Amal qo'llab-quvvatlanmaydi | ⛔ yo'q |

:::caution[«Effekt bo'lganmi» ustuni eng muhim]
`⛔ yo'q` — qayta urinish **xavfsiz**.

`⚠ noma'lum` — amal bajarilgan **bo'lishi mumkin**. Bu holatlarda
operatsiya `UNKNOWN` ga tushadi va qayta yuborish **taqiqlanadi**.
:::

## Nima **hech qachon** chiqmaydi

| ⛔ | Nega |
|---|---|
| Host, URL | SSRF va sir sizishi |
| Token, kredensial | Xato matni **model kontekstiga** tushadi |
| Stack trace | Ichki tuzilmani oshkor qiladi |
| Provayderning xom xato matni | Tekshirilmagan matn = in'eksiya yo'li |

## `request_id`

Har javobda `request_id` bo'ladi. Yordam so'raganda **`execution_id`** va
**`request_id`** ni yuboring — ular bilan butun zanjir tiklanadi.
