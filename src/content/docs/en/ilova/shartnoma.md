---
title: Domain contract — 8 items
description: What an ecosystem domain must declare for its agent to be generated.
sidebar:
  order: 2
holat: ishlaydi
holatIzoh: "The contract schema and `davirix app check` WORK (SDK `davirix` — PyPI). The generator is not built yet."
---

Eight items. Declare them all and the agent is generated.

---

## 1. Commands — what I can do

Every **state-changing** operation must be a typed contract.

```yaml
id: inventory.stock.receive
operation_type: COMMAND
risk_level: R2
idempotency: required          # ⚠ MANDATORY
concurrency: optimistic
input:  { type: object, ... }
output: { type: object, ... }
```

| Field | Why |
|---|---|
| `idempotency: required` | ⛔ Without it, a retry creates a **duplicate** |
| `risk_level` | The approval flow derives from it |
| `concurrency` | So the agent does not write over stale data |

:::danger[Direct UPDATEs are forbidden]
A raw database write inside a handler means there is **no contract** for
the agent. Every change must be a named command.
:::

---

## 2. Queries — what I can see

**Four types are mandatory.** Missing one and the agent cannot work.

| Type | Example | What the agent uses it for |
|---|---|---|
| **Summary** | `inventory.daily_summary` | "What's the overall state?" |
| **Anomaly** | `inventory.low_stock` | "What's wrong?" |
| **Search** | `inventory.item.search` | Finding a specific record |
| **Detail** | `inventory.stock.get` | One record in full |

:::caution[Why CRUD alone is not enough]
```
❌ GET /stock?page=1&limit=100
   → 100 raw rows, 40 KB
   → half the agent's context is gone
   → the agent aggregates it itself and gets it WRONG

✅ GET /stock/summary?period=7d&group_by=warehouse
   → 5 rows, 800 bytes
   → a ready conclusion
```
About 80% of an agent's time is spent reading. A poor read interface makes
a poor agent.
:::

---

## 3. ⚡ Verification — the right to say "done"

**The most important item.** Every `COMMAND` declares which query proves it.

```yaml
id: inventory.stock.receive
verification:
  operation:    inventory.stock.get
  business_key: id
  expect:       { field: resource.state, equals: open }
```

:::danger[Without it]
The operation stays at `ACKNOWLEDGED` and **never** becomes `VERIFIED`.
The system **cannot** say "done" about it.

That is not a defect — it is an honest answer. But for your domain it
means the agent can confirm nothing there.
:::

⚠ Adding this item **after** the domain is built means reviewing every
contract. Written **upfront** it is **three lines** per command.

---

## 4. Permissions — what I may not do

```yaml
permissions:
  required: [inventory.stock.receive]
```

Cannot be empty. Permissions are enforced **on the server, not in the UI** —
otherwise the agent walks around the rule.

---

## 5. `summary_for_ai` — so it can plan

```yaml
summary_for_ai: >
  Records a stock receipt. FIRST use `inventory.item.search` to confirm the
  item card exists. An `ITEM_NOT_FOUND` error means the item is not in the
  catalogue — create it first.
```

Three things: **what it does** · **what to call first** · **what the main
error means**.

⚠ This is not a prompt — it is **API documentation for the agent**. Without
it the agent calls operations in the wrong order.

---

## 6. Canonical resource and state

Every resource your domain returns is mapped to the canonical shape:

```json
{
  "resource": {
    "id":           "mov_01hq...",
    "type":         "stock_movement",
    "state":        "open",
    "source_state": "AWAITING_CHECK",
    "updated_at":   "...",
    "version":      "3"
  },
  "attributes": { "warehouse_code": "WH-1", "qty": "12" }
}
```

| Canonical `state` | Meaning |
|---|---|
| `open` | exists and active |
| `closed` | completed |
| `cancelled` | cancelled |
| `pending` | being processed |
| `failed` | failed |
| **`unknown`** | ⚠ could not be mapped |

:::danger[`unknown` is the safety key]
If you cannot map the state, return `unknown`. The predicate will **not**
match and the result will not be `VERIFIED`.

⛔ Writing "it's probably `open`" is a source of false confirmation.
:::

⚠ **Hard rule:** a Domain Pack may only depend on `resource.*`.
`attributes.*` is specific to your domain and agent semantics never bind
to it.

---

## 7. Typed errors

```yaml
errors:
  - ITEM_NOT_FOUND
  - STOCK_INSUFFICIENT
  - PERIOD_CLOSED
  - VALIDATION_FAILED
```

⛔ A free-text error is one the agent **cannot understand**, so it cannot
choose the next step. Every error must be a **code** and must be
**declared** in the contract.

⚠ An error a handler returns but the contract does not declare fails CI.

---

## 8. A `_label` beside every ID

```json
{
  "warehouse_id":    "wh_01hq...",
  "warehouse_label": "Central warehouse",
  "item_id":         "itm_01hq...",
  "item_label":      "Canon EOS R6 (body)",
  "actor_id":        "actor_01hq...",
  "actor_label":     "Aziz Karimov"
}
```

| Missing | Consequence |
|---|---|
| No `_label` | The agent **invents** the ID on the next call |
| No ID | The agent gives the user an unusable answer |

**Both are required.**

---

## Checking

```bash
pip install davirix
davirix app check app-manifest.json
```

An app declares itself with an **App Manifest** — a single JSON file.

:::tip[Why not a directory layout]
The checker does **not know the app's internal layout**. One app keeps
commands in YAML files, another in code decorators.

If the checker depended on a directory shape, the **first app's shape
would become the standard** and a second domain (restaurant, clinic)
would not fit it.
:::

The output names each gap together with **the level it blocks**:

```
Daraja: A2 — Commands with idempotency, the agent WRITES

  A3 ga chiqish uchun:
    - [command.verification.missing] `inventory.stock.receive`:
      no `verification`. A connector's reply is NOT a business outcome.
```

### CI gate

```bash
davirix app check app-manifest.json --min-level A3
```

⚠ The default `--min-level` is **A1**, not A3. An app that saw a red CI
on day one would simply **switch the checker off**.

### ⛔ The level is never declared

There is no `level` field in the manifest and there never will be — it
is **computed**. An app cannot **call itself** A4.

## Next

- [Readiness levels](/en/ilova/darajalar/)
- [The verification block](/en/konnektor/verification/) — in depth
