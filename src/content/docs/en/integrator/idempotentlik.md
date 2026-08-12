---
title: Idempotency
description: One intent — one effect. How to choose a key and why it is your primary protection.
sidebar:
  order: 4
holat: ishlaydi
---

Networks are unreliable. The request goes out, the response is lost, your
code retries — and the customer gets **two** messages. Idempotency is what
blocks that.

## Two layers

Protection works in two places, and they are different:

| Layer | What it does | Mechanism |
|---|---|---|
| **Transport** | Does not repeat the same request | `idempotency_key` |
| **Semantic** | Does not repeat the same **intent** | Operation Ledger |

:::tip[The real protection is the second one]
The transport key catches an identical request. But the agent may send a
slightly different request each time — wording changes, ordering changes.
The semantic key captures the **business intent**, which is why it is the
one that holds.
:::

## What the semantic key is built from

```
tenant_id → business_id → actor_ref → capability_id
          → resource_ref → business_window
```

⚡ It uses the **`capability_id`**, not the tool name. So when the
connector changes (Bitrix24 → 1C) idempotency **survives**: the intent is
unchanged.

In the database this is `UNIQUE (tenant_id, semantic_key)` — the only real
guarantee.

:::note[Measured]
**10,000 parallel** identical intents → **exactly 1** effect against live
PostgreSQL.
:::

## Choosing a key

### ✅ Right

```python
# Tied to a business event — stable
idempotency_key = f"order-{order_id}-confirm"
```

Call it again for the same order and no second effect occurs.

### ⛔ Wrong

```python
idempotency_key = str(uuid4())          # new every time → NO protection
idempotency_key = str(time.time())      # same problem
```

A random key is equivalent to **turning the protection off**.

### Recurring actions

Something like a daily report **must** repeat every day:

```python
idempotency_key = f"daily-report-{date.today()}"
```

This is the `business_window` concept: the date becomes part of the key,
so tomorrow's run is **not** blocked.

## Key conflicts

| Case | HTTP | Meaning |
|---|---|---|
| Same key + **same** body | `200` | The existing execution is returned |
| Same key + **different** body | **`409`** | No silent overwrite |

⚠ `409` is not an error — it is **protection**. It means you reused a key
for a different intent.

## Duplicate intent

If the operation already started, the connector is **not** called:

| Existing state | Response |
|---|---|
| `VERIFIED` | `409 duplicate_intent_verified` — already done |
| Anything else | `409 duplicate_intent` — started, outcome unclear |

The distinction is deliberate: the first is **success** (no new effect
needed), the second means "wait".

## Limitation

:::caution[Transport window — 60 minutes]
A connector result is held in the transport layer for at most **60
minutes**, then discarded. The semantic protection (Ledger) has **no
expiry**.
:::

## Next

- [Statuses](/en/integrator/holatlar/) — `UNKNOWN` and why retry is forbidden
- [Errors](/en/integrator/xatolar/)
