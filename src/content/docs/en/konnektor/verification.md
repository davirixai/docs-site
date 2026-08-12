---
title: The verification block
description: The only thing that entitles a write operation to be called "done".
sidebar:
  order: 3
  badge:
    text: Most important
    variant: danger
holat: ishlaydi
---

:::danger[One sentence]
### An operation with **no** `verification` block is **NOT** a verified write.

Its result is never marked `VERIFIED`. The system **cannot** say "done"
about it.
:::

## What it does

After the write, the platform **reads back from the source** and applies
the declared predicate:

```
write → response (id) → read-back(id) → predicate → VERIFIED | FAILED | UNKNOWN
```

## Shape

```json
{
  "name": "crm.create_deal",
  "direction": "write",
  "verification": {
    "operation":    "crm.get_deal",
    "business_key": "id",
    "expect":       { "field": "closed", "equals": "N" },
    "max_wait_ms":  15000,
    "on_missing":   "UNKNOWN",
    "version_field": "resource_version"
  }
}
```

| Field | Required | Meaning |
|---|---|---|
| `operation` | ✅ | Read-back operation — it must **exist** and be `direction: read` |
| `expect` | ✅ | Success predicate — declarative, not free text |
| `business_key` | — | Name of the key passed to the read-back |
| `max_wait_ms` | — | How long to wait for the record to appear (max 10 min) |
| `on_missing` | — | When not found: `UNKNOWN` (default) or `FAILED` |
| `version_field` | — | If set, reads from a stale replica are detected |

## ⚠ `business_key` does two jobs

This is where mistakes happen most:

| | |
|---|---|
| 1️⃣ | The field name **in the write response** — the resource id is taken from it |
| 2️⃣ | The **read-back argument** name — that value is passed under this name |

So the two must be **identical**:

```json
// crm.create_deal response:   {"id": "10001", "created": true}
// crm.get_deal input:         {"id": "10001"}
"business_key": "id"          // ✅ matches both
```

:::caution[Why this matters]
On a create, the resource id exists **only in the response** — it is not
in the request yet. If the names do not match, the key resolves to
**empty**, the read-back finds nothing, and the result stays
**`UNKNOWN` forever**.
:::

## `expect` — the predicate

Exactly **one** of `in` or `equals`.

```json
"expect": { "field": "status", "in": ["DELIVERED", "delivered"] }
"expect": { "field": "closed", "equals": "N" }
```

:::danger[If neither is present]
The predicate would mean "any response will do" — that is **not** a check,
it is a source of false `VERIFIED`. The schema **rejects** it.
:::

⚠ The provider's taxonomy lives **in the manifest**, not in code. When the
provider renames its states, a manifest line changes — not code.

## `on_missing` — why the default is `UNKNOWN`

```
record not found in source  ≠  the action did not happen
```

Index lag or eventual consistency can hide the record **temporarily**.
Defaulting to `FAILED` would close the operation incorrectly.

Choose `FAILED` only when the source is **read-after-write consistent**.

## **Always** return the predicate field

If the predicate field is **absent** from the read-back response, the
verifier returns `UNKNOWN` with `field_missing` — verification silently
does nothing.

```go
// ✅ Right: the field is always present, even when empty
out["closed"] = closed        // may be ""

// ⛔ Wrong: field omitted entirely when empty
if closed != "" { out["closed"] = closed }
```

## What if there is **no** read-back

That is a normal situation — the provider's API is what it is. Then:

- the operation stays at `ACKNOWLEDGED`;
- the connector stays at **L2** ([certification](/en/konnektor/sertifikatsiya/));
- this is **not a defect — it is an honest answer**.

:::tip
Better unverified than falsely green. If the source cannot prove it, the
system does not claim it.
:::

## Next

- [Certification levels](/en/konnektor/sertifikatsiya/)
- [Conformance suite](/en/konnektor/muvofiqlik/) — C9–C11 test exactly this block
