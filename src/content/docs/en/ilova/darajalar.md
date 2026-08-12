---
title: Readiness levels A0–A4
description: Which level each domain of your ecosystem is at — and what the agent can do.
sidebar:
  order: 3
holat: ishlaydi
holatIzoh: "The levels WORK: `davirix app check` computes them from the manifest (SDK 0.2.0)."
---

Each **domain** is graded separately. The level is not requested — it
follows from **which items are done**.

## Levels

| | What exists | What the agent can do |
|---|---|---|
| **A0** | Contracts exist, no AI metadata | ⛔ **nothing** |
| **A1** | 4 query types · `_label` · typed errors | 👁 **reads** — answers questions |
| **A2** | + Commands · `idempotency: required` · permissions | ✍️ **writes** — result is `ACKNOWLEDGED` |
| **A3** | + **`verification`** on every command | ✅ can say **"done"** |
| **A4** | + Evaluation baseline · degenerate mode | 🚀 can run **autonomously** |

---

## What each level unlocks

### A1 — reads

The agent can answer questions: *"How many receipts today?"*, *"What is
running low?"*

⛔ It can change **nothing**.

### A2 — writes

The agent records receipts and movements. But the result is
`ACKNOWLEDGED` — *"the domain replied"*, **not** `VERIFIED`.

⚠ It cannot tell the user *"done"*. Only *"sent"*.

### A3 — confirms

⚡ **The critical threshold.** Every command has a read-back partner and a
declared predicate. Now the agent is **entitled** to say *"receipt
recorded"* — because the source confirmed it.

### A4 — autonomous

An evaluation baseline exists: how correctly the agent behaves is
**measured**. And every capability works in **degenerate mode** (one
branch, one person, no approver).

---

## ⚠ A2 → A3 — where most domains stop

```
verification present → A3 possible
verification absent  → STAYS at A2
```

This is **not a technical difficulty** — it is a **forgotten decision**:

> *"What proves this operation actually happened?"*

Every command needs an answer. No answer means the operation is never
confirmed.

:::tip[Three lines]
```yaml
verification:
  operation: inventory.stock.get
  business_key: id
  expect: { field: resource.state, equals: open }
```
While writing the domain — **three lines**. Added later — a review of
every contract.
:::

---

## Checking

```bash
$ davirix app check

A1 ✅   A2 ✅   A3 ⛔   A4 ⛔

Missing (A3):
  inventory.stock.receive    — no `verification` block
  inventory.stock.write_off  — no `verification` block

  ⚠ These two operations will NEVER be VERIFIED.

Missing (A4):
  no evaluation baseline
  inventory.stock.receive — degenerate mode untested
```

---

## Degenerate mode — the A4 precondition

Every domain must also work for a **sole trader**: one branch, one person,
no approver.

| ⛔ Breaks it | ✅ Correct |
|---|---|
| "Select a branch" — mandatory | With one branch, chosen automatically |
| "Manager must approve" — mandatory | With no approver, it passes |
| Department structure required | Optional |

⚠ And when they grow — **no migration**. Adding a second branch must not
break the same capability.

:::caution[Why this gates the level]
The promise *"when the business grows, the platform grows"* is only true
with this. A domain that demands migration **breaks** that promise.
:::

---

## Certificate

A3 and above are **certified**, like connectors:

```json
{
  "domain_id": "inventory",
  "version": "2.1.0",
  "contracts_digest": "sha256:...",
  "level": "A3",
  "issued_at": "...",
  "expires_at": "..."
}
```

⚡ This matters for third-party domains: **an inventory or HR domain
written by another developer that reaches A3 can be trusted without our
review.**

## Next

- [Domain contract](/en/ilova/shartnoma/) — the eight items
- [Certification](/en/konnektor/sertifikatsiya/) — the same mechanism for connectors
