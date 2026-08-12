---
title: HTTP API
description: Working without the SDK — creating executions, tracking them, and SSE streaming.
sidebar:
  order: 2
holat: ishlaydi
---

The SDK is Python-only. If you work in another language, go straight to
HTTP.

:::caution[You now own the rules the SDK enforced]
`completed` ≠ "done" · no retry on `UNKNOWN` · idempotency key · retry
only when `retryable`. Missing any one of them means a duplicate effect.
[The four rules](/en/integrator/python-sdk/#why-use-the-sdk).
:::

## Create an execution

```http
POST /v1/executions
Authorization: Bearer <service-JWT>
Content-Type: application/json

{
  "tenant_id": "acme-bank",
  "actor":     { "type": "user", "id": "u-42" },
  "input":     { "text": "Block the card ending 7731" },
  "agent_id":  "acme-support",
  "idempotency_key": "order-2026-08-12-0001"
}
```

Required: `tenant_id` · `actor` · `input`.

### Response

```json
{
  "execution_id": "exe_0123…",
  "status": "created",
  "thread_id": "thr_0f3c9d"
}
```

## Fetch state

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

⚡ `status` and `operations[].status` are **separate** answers.
[Why](/en/boshlash/eng-muhim-qoida/).

## Streaming (SSE)

```http
GET /v1/executions/{execution_id}/stream
Accept: text/event-stream
```

An event arrives on every state change. If the connection drops, fetch
the current state with `GET` and reconnect.

## Idempotency

| Case | Result |
|---|---|
| Same key + **same** body | The existing execution is returned (`200`) |
| Same key + **different** body | **`409`** — no silent overwrite |

⚠ Send a stable key per **logical action**.
[Details](/en/integrator/idempotentlik/).

## Error envelope

```json
{
  "error": {
    "code": "rate_limited",
    "message": "…",
    "retryable": false
  }
}
```

The field is **`code`**, not `type`. Internal details (host, URL, secrets,
stack traces) are never exposed.

## What is **not** available

| ⛔ | Note |
|---|---|
| `gRPC` | Not planned |
| Client-facing `WebSocket` | Internal channel and voice layer only |
| Outbound webhooks | ⏳ not yet — use SSE or polling |

## Next

- [Statuses](/en/integrator/holatlar/)
- [Error codes](/en/malumotnoma/xato-kodlari/)
