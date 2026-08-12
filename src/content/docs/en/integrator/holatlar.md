---
title: Statuses
description: 12 execution states and 9 operation states — why they are separate and which one means "done".
sidebar:
  order: 3
holat: ishlaydi
---

There are two kinds of status and they must **not** be conflated.

## 1. Execution status (`status`)

Where the agent's own work stands.

```
created → validating → resolving_context → planning → running
   → waiting_for_tool → waiting_for_approval → validating_output
   → completed | failed | cancelled | expired
```

| Status | Meaning |
|---|---|
| `created` | Accepted, queued |
| `validating` | Input being checked |
| `resolving_context` | Gathering knowledge and context |
| `planning` | Model is planning |
| `running` | Executing |
| `waiting_for_tool` | Waiting on an external system |
| `waiting_for_approval` | Waiting for a **human** |
| `validating_output` | Output being checked |
| `completed` | The agent finished its work |
| `failed` | The agent could not finish |
| `cancelled` | Cancelled |
| `expired` | Timed out |

:::caution
`completed` means the **agent** finished. Whether the action happened is
in the table below.
:::

## 2. Operation status (`operations[].status`)

Whether an **effect** occurred in the outside world.

| Status | Meaning | Retry |
|---|---|---|
| `PREPARED` | Intent recorded, not sent yet | — |
| `SENT` | Sent to the connector | ⛔ wait |
| `ACKNOWLEDGED` | The connector replied — **transport** | ⛔ wait |
| **`VERIFIED`** | ✅ **Confirmed against the source** | not needed |
| **`UNKNOWN`** | ⚠ Outcome unknown | ⛔ **FORBIDDEN** |
| `FAILED` | Explicit rejection — an effect is impossible | ✅ safe |
| `MANUAL_REVIEW` | Held for a human | in the console |
| `RECONCILING` | Final state being determined | ⛔ wait |
| `CANCELLED` | Cancelled | ✅ safe |

## Why `ACKNOWLEDGED` ≠ `VERIFIED`

Three distinct things happen in sequence:

| | What happened |
|---|---|
| **Transport** | The connector accepted the request (HTTP 200) |
| **Processing** | The provider processed it |
| **Effect** | The result **actually exists** in the source |

`ACKNOWLEDGED` is the first. `VERIFIED` is the third — and it is proven by
**reading back from the source**.

:::note[When there is no read-back]
If the connector has no read-back operation, the operation **stays**
`ACKNOWLEDGED` and never becomes `VERIFIED`. That is not a defect — it is
an **honest answer**.

Which connectors have read-back: see [limitations](/en/malumotnoma/cheklovlar/).
:::

## Why a timeout is not `FAILED`

```
sent to connector → no response (timeout)
                  → UNKNOWN,  not FAILED
```

"No response" and "did not happen" are **not the same**. The request may
have arrived and the action may have been performed — only the response
was lost.

⛔ That is why blind retry on `UNKNOWN` is forbidden: a second SMS, a
second payment.

Reconciliation later determines the final state from the source.

## Tracking

```python
n = dx.get(execution_id)
n.status
```

Or in real time over **SSE**:

```http
GET /v1/executions/{id}/stream
Accept: text/event-stream
```

## Next

- [Full status reference](/en/malumotnoma/holatlar-jadvali/)
- [Idempotency](/en/integrator/idempotentlik/)
