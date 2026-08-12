---
title: HTTP API
description: SDK'siz ishlash — ijro yaratish, kuzatish va SSE oqimi.
sidebar:
  order: 2
holat: ishlaydi
---

SDK Python uchun. Boshqa tilda ishlayotgan bo'lsangiz — to'g'ridan-to'g'ri
HTTP.

:::caution[SDK majburlaydigan qoidalarni endi SIZ yozasiz]
`completed` ≠ «bajarildi» · `UNKNOWN` da retry taqiq · idempotentlik
kaliti · retry faqat `retryable` da. Bularning birortasini unutish —
dublikat effekt. [To'rt qoida](/integrator/python-sdk/#sdk-nima-uchun-kerak).
:::

## Ijro yaratish

```http
POST /v1/executions
Authorization: Bearer <service-JWT>
Content-Type: application/json

{
  "tenant_id": "acme-bank",
  "actor":     { "type": "user", "id": "u-42" },
  "input":     { "text": "Kartani bloklang, oxirgi 4 raqam 7731" },
  "agent_id":  "acme-support",
  "idempotency_key": "buyurtma-2026-08-12-0001"
}
```

Majburiy: `tenant_id` · `actor` · `input`.

### Javob

```json
{
  "execution_id": "exe_0123…",
  "status": "created",
  "thread_id": "thr_0f3c9d"
}
```

## Holatni olish

```http
GET /v1/executions/{execution_id}
Authorization: Bearer <service-JWT>
```

```json
{
  "execution_id": "exe_0123…",
  "status": "completed",
  "operations": [
    {
      "operation_id": "op_77…",
      "capability_id": "sales.order.create",
      "status": "VERIFIED",
      "resource_ref": "deal:10001",
      "verification_method": "read_after_write",
      "verification_evidence": "closed=N"
    }
  ]
}
```

⚡ `status` va `operations[].status` — **ayrim** javoblar.
[Nega](/boshlash/eng-muhim-qoida/).

## Oqim (SSE)

```http
GET /v1/executions/{execution_id}/stream
Accept: text/event-stream
```

Har holat o'zgarishida hodisa keladi. Ulanish uzilsa — `GET` bilan
joriy holatni oling va qaytadan ulanning.

## Idempotentlik

| Holat | Natija |
|---|---|
| Ayni kalit + **ayni** tana | Mavjud ijro qaytadi (`200`) — yangi effekt yo'q |
| Ayni kalit + **boshqa** tana | **`409`** — jim ustiga yozish yo'q |

⚠ Har **mantiqiy amal** uchun barqaror kalit yuboring.
[Batafsil](/integrator/idempotentlik/).

## Xato konverti

```json
{
  "error": {
    "code": "rate_limited",
    "message": "…",
    "retryable": false
  }
}
```

Maydon nomi **`code`**, `type` emas. Ichki detallar (host, URL, sir,
stack) hech qachon chiqmaydi.

## Nima **yo'q**

| ⛔ | Izoh |
|---|---|
| `gRPC` | Rejada yo'q |
| Mijozga `WebSocket` | Faqat ichki kanal va ovoz qatlamida |
| Webhook (chiqish) | ⏳ hali yo'q — hozircha SSE yoki polling |

## Keyingi qadam

- [Holatlar](/integrator/holatlar/)
- [Xato kodlari](/malumotnoma/xato-kodlari/)
