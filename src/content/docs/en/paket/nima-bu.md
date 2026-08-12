---
title: What a Domain Pack is
description: Packaging a vertical — business operations, verification rules and connector requirements in one file.
sidebar:
  order: 1
holat: qisman
holatIzoh: "The contract and loader work, with tests. No pack has been installed live yet."
---

A Domain Pack adapts the base platform to **one vertical**: a repair shop,
a clinic, a retail store.

## Why it exists

The platform has the machinery: ledger, verification, idempotency. But
nobody buys "there is a ledger" — they buy **"it works for my business
out of the box"**.

The Domain Pack is that "out of the box".

## What it contains

```json
{
  "id": "texnik-servis",
  "version": "1.0.0",
  "display_name": "Technical service — intake, sales and payment",
  "domain": "texnik-servis",
  "connectors":   [ { "id": "bitrix24", "min_version": "2.1.0" } ],
  "capabilities": [ ],
  "read_tools":   [ ]
}
```

| Section | What |
|---|---|
| `connectors` | Connectors the pack **requires**, with minimum versions |
| `capabilities` | Business **write** operations plus verification rules |
| `read_tools` | **Read** tools the agent may call |

## ⚠ Capabilities are writes only

```
capabilities  →  write operations (REVERSIBLE | IRREVERSIBLE)
read_tools    →  read operations
```

A read needs no ledger entry and would only bloat the catalogue. That is
why `side_effect: NONE` **does not exist** in the pack schema.

:::caution[`read_tools` is also a privacy boundary]
This list reveals what data the pack can **see**.
:::

## A capability entry

```json
{
  "id": "service.order.create",
  "tools": ["connector.bitrix24.crm.create_lead"],
  "side_effect": "REVERSIBLE",
  "resource_param": "external_id",
  "verification": {
    "operation": "crm.get_lead",
    "business_key": "id",
    "expect": { "field": "status_id", "in": ["NEW", "IN_PROCESS"] },
    "max_wait_ms": 15000,
    "on_missing": "UNKNOWN"
  }
}
```

## Three hard rules

:::danger[1. An irreversible operation cannot be unverified]
`side_effect: IRREVERSIBLE` with no `verification` → the pack is
**rejected**.

Why: an unverified operation never becomes `VERIFIED`. For a reversible
operation you can live with that; for an irreversible one — money left,
the SMS went out — the uncertainty is **permanent**.
:::

:::danger[2. One tool, one capability]
Two business meanings **cannot** share a tool: the system could not tell
them apart and the ledger would attribute the effect to the wrong
operation.

That is why `service.order.create` (lead) and `sales.order.create` (deal)
use **separate** tools.
:::

:::danger[3. A pack cannot redefine a base capability]
A platform-owned operation (SMS, for example) cannot be overridden by a
pack. Otherwise a pack could loosen the verification rule and manufacture
a false `VERIFIED`.
:::

## Capability IDs are forever

⚡ The `capability_id` feeds the **semantic key**. Changing it breaks
idempotency: old records point at the old id, a new request arrives under
the new id and creates a **duplicate effect**.

| Change | Version |
|---|---|
| Adding a capability | MINOR |
| **Removing** or **renaming** one | **MAJOR** |

## Next

- [Writing a pack](/en/paket/yozish/) — step by step
- [The verification block](/en/konnektor/verification/)
