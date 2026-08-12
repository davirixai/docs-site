---
title: Errors
description: The error envelope, `retryable` semantics, and what to do for each case.
sidebar:
  order: 5
holat: ishlaydi
---

## Envelope

```json
{
  "error": {
    "code": "rate_limited",
    "message": "request limit exceeded",
    "retryable": false
  }
}
```

The field is **`code`**, not `type`.

:::note[Internal details never leak]
Host, URL, secrets, stack traces are never in an error message. Reason:
error text often ends up in the **model's context** — it becomes part of
the prompt.
:::

## `retryable` is the only correct signal

```python
except APIError as e:
    if e.retryable:
        ...   # retrying is SAFE
    else:
        ...   # retrying will NOT fix it
```

⛔ Do not decide from the HTTP status. A `503` is sometimes retryable and
sometimes not — that depends on **connector** semantics, which only the
platform knows.

## Main codes

| Code | HTTP | `retryable` | What to do |
|---|---|---|---|
| `unauthorized` | 401 | ❌ | Check your key |
| `forbidden` | 403 | ❌ | No permission — grant it in the console |
| `not_found` | 404 | ❌ | Check the identifier |
| `invalid_request` | 400 | ❌ | Malformed request |
| `duplicate_intent` | 409 | ❌ | ⚠ This is **protection** — wait |
| `duplicate_intent_verified` | 409 | ❌ | ✅ Already done |
| `knowledge_conflict_hold` | 409 | ❌ | Held for human review |
| `rate_limited` | 429 | ⚠ | Respect `Retry-After` |
| `ledger_unavailable` | 503 | ✅ | The ledger did not respond — the action **did not run** |
| `timeout` | 504 | ⛔ | ⚠ Outcome **unknown** — see below |

Full list: [error codes](/en/malumotnoma/xato-kodlari/).

## ⚠ Timeout is a special case

```
timeout  →  the action MAY have happened
```

Here the `retryable` question is the wrong question. The correct
behaviour:

1. **Do not resend.**
2. Fetch the execution — the operation will be `UNKNOWN`.
3. Wait for reconciliation to determine the final state.

:::danger
Resending on `timeout` is the **single most common cause** of duplicate
effects. A second SMS, a second payment.
:::

## Why `ledger_unavailable` is safe

`503 ledger_unavailable` means the operation ledger did not respond. In
that case the action **was never performed**: the platform refuses to run
a write without duplicate protection (fail-closed).

That is why this error is `retryable: true` — retrying is safe.

## Asking for help

Include the **`execution_id`** and **`request_id`**:

```python
except APIError as e:
    log.error("davirix", request_id=e.request_id, code=e.code)
```

⛔ Do not send conversation text — we do not need it, and under
zero-retention it is not stored anyway.

## Next

- [Statuses](/en/integrator/holatlar/)
- [Limitations](/en/malumotnoma/cheklovlar/)
