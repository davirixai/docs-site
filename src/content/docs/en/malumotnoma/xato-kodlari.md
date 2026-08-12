---
title: Error codes
description: Full list — code, HTTP status, `retryable`, and what to do.
sidebar:
  order: 2
holat: ishlaydi
---

Envelope:

```json
{ "error": { "code": "…", "message": "…", "retryable": false } }
```

The field is **`code`**, not `type`.

## Execution (agent-runtime)

| Code | HTTP | `retryable` | What to do |
|---|---|---|---|
| `invalid_request` | 400 | ❌ | Malformed request |
| `unauthorized` | 401 | ❌ | Check your key |
| `forbidden` | 403 | ❌ | No permission — grant it in the console |
| `not_found` | 404 | ❌ | Check the identifier |
| `duplicate_intent` | 409 | ❌ | ⚠ This is **protection** — wait |
| `duplicate_intent_verified` | 409 | ❌ | ✅ Already done |
| `knowledge_conflict_hold` | 409 | ❌ | Held for human review |
| `rate_limited` | 429 | ⚠ | Respect `Retry-After` |
| `internal_error` | 500 | ⚠ | Retry is possible |
| `ledger_unavailable` | 503 | ✅ | The action **did not run** — safe |
| `timeout` | 504 | ⛔ | ⚠ Outcome **unknown** — do not resend |

## Connector (integration-hub)

| Code | Meaning | Could an effect have occurred |
|---|---|---|
| `invalid_request` | Bad argument | ⛔ no |
| `unauthorized` | Invalid credentials | ⛔ no |
| `forbidden` | No permission | ⛔ no |
| `not_found` | Record not found | ⛔ no |
| `credential_error` | Credential missing or wrong | ⛔ no |
| `payment_required` | Provider balance | ⛔ no |
| `rate_limited` | Provider limit | ⛔ no |
| `upstream_error` | Provider error | ⚠ **unknown** |
| `timeout` | No response | ⚠ **unknown** |
| `internal` | Internal error | ⚠ **unknown** |
| `not_implemented` | Operation unsupported | ⛔ no |

:::caution[The "could an effect have occurred" column is the important one]
`⛔ no` — retrying is **safe**.

`⚠ unknown` — the action **may** have happened. These cases land in
`UNKNOWN` and resending is **forbidden**.
:::

## What **never** appears

| ⛔ | Why |
|---|---|
| Host, URL | SSRF and secret leakage |
| Token, credential | Error text reaches the **model's context** |
| Stack trace | Exposes internal structure |
| The provider's raw error text | Unvetted text is an injection vector |

## `request_id`

Every response carries a `request_id`. When asking for help, send the
**`execution_id`** and **`request_id`** — together they reconstruct the
whole chain.
