---
title: Status reference
description: 12 execution states and 9 operation states — full reference.
sidebar:
  order: 1
holat: ishlaydi
---

## Execution states (`status`)

Where the agent's **own work** stands.

| State | Terminal | Meaning |
|---|---|---|
| `created` | — | Accepted, queued |
| `validating` | — | Input being checked |
| `resolving_context` | — | Gathering knowledge and context |
| `planning` | — | Model is planning |
| `running` | — | Executing |
| `waiting_for_tool` | — | Waiting on an external system |
| `waiting_for_approval` | — | Waiting for a **human** |
| `validating_output` | — | Output being checked |
| `completed` | ✅ | The agent finished its work |
| `failed` | ✅ | The agent could not finish |
| `cancelled` | ✅ | Cancelled |
| `expired` | ✅ | Timed out |

⚠ `completed` means the **agent** finished — **not** that the action
happened.

## Operation states (`operations[].status`)

Whether an **effect** occurred in the outside world.

| State | Terminal | Retry | Meaning |
|---|---|---|---|
| `PREPARED` | — | — | Intent recorded, not sent |
| `SENT` | — | ⛔ | Sent to the connector |
| `ACKNOWLEDGED` | — | ⛔ | The connector replied — **transport** |
| **`VERIFIED`** | ✅ | not needed | **Confirmed against the source** |
| **`UNKNOWN`** | — | ⛔ **FORBIDDEN** | Outcome unknown |
| `RECONCILING` | — | ⛔ | Final state being determined |
| `FAILED` | ✅ | ✅ safe | Explicit rejection — an effect is impossible |
| `MANUAL_REVIEW` | — | in console | Held for a human |
| `CANCELLED` | ✅ | ✅ safe | Cancelled |

## Transitions

```
PREPARED ──► SENT ──► ACKNOWLEDGED ──► VERIFIED
    │          │            │
    │          │            └──► UNKNOWN ──► RECONCILING ──► VERIFIED | FAILED
    │          └──► UNKNOWN
    │          └──► FAILED          (connector gave an EXPLICIT rejection)
    └──► MANUAL_REVIEW              (knowledge conflict + irreversible)
    └──► CANCELLED
```

:::caution[Two hard rules]
1. An operation that was never `SENT` **cannot** become `VERIFIED` — you
   cannot confirm something that was never attempted.
2. A timeout is never `FAILED` — it is `UNKNOWN`.
:::

## `terminal_reason` values

| Value | When |
|---|---|
| `CONNECTOR_ERROR` | Connector error — outcome uncertain |
| `CONNECTOR_REJECTED` | The connector **explicitly** rejected it |
| `KNOWLEDGE_CONFLICT` | Unresolved conflict in knowledge |
| `STALE_REPLICA` | Read from a stale replica |
| `FIELD_MISSING` | The predicate field was absent from the response |
| `SOURCE_UNREACHABLE` | The source could not be reached |

## `verification_method`

| Value | Meaning |
|---|---|
| `read_after_write` | Read back from the source after writing |
| *(empty)* | No verification rule — `VERIFIED` is unreachable |
