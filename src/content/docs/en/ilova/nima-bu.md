---
title: The agent comes from the domain
description: When you add a domain to your ecosystem you don't write an agent — it is generated from your contracts.
sidebar:
  order: 1
  badge:
    text: New
    variant: tip
holat: qisman
holatIzoh: "`davirix app check` WORKS — the `davirix` package on PyPI (levels A0–A4). The agent GENERATOR is not built yet: agents are configured by hand today."
---

You are building a business operations ecosystem. It has **domains**:

```
Ecosystem
├── inventory   ← stock, receipts, write-offs, counts
├── sales       ← orders, customers, discounts
├── finance     ← payments, invoices, debt
├── hr          ← employees, attendance, payroll
└── projects    ← tasks, deadlines, resources
```

The question: how do you add an AI agent to each domain?

:::tip[Answer: you don't]
### The agent is not **written** — it comes from the **domain standard**.

Declare eight things and the agent, along with its entire trust layer —
tool catalogue, ledger, verification, approval, audit — arrives
**automatically**.
:::

## ⚡ Key idea: the pack is the **standard**, the app is the **implementor**

Most people get this backwards. The correct direction:

```
Domain Pack  =  STANDARD      (what an inventory domain must do)
      ↑
   apps IMPLEMENT it
      │
  ┌───┴────┬─────────────┬──────────────┐
  our     your new      a partner's    third
  ERP        app                       party
```

| | |
|---|---|
| The `inventory` pack | **one** — the standard |
| Apps implementing it | **as many as you like** |
| The agent for each | the **same** pack works |

⚡ Write a different app tomorrow and have it reach **A3** on the
`inventory` standard — the **same agent** works, unchanged.

⛔ Backwards (each app inventing its own pack) they never line up, and the
agent is rewritten for every app.

## Why this is decisive for an ecosystem

Writing an agent for one domain takes weeks. For **five domains** it takes
months — and each one behaves **differently**: one asks for approval, one
doesn't; one is protected against duplicates, one isn't.

⚡ With generation, **every domain gets the same trust layer**, because
nobody writes it by hand.

| | By hand | Generated |
|---|---|---|
| Adding a domain | weeks | **the time to write contracts** |
| Trust layer | rebuilt each time | **identical, in the platform** |
| Quality | depends on the developer | **measured by a level** |

## What comes free

| ✅ Automatic | Who writes it |
|---|---|
| Tool catalogue | **nobody** — derived from contracts |
| Ledger and idempotency | the platform |
| Verification chain → `VERIFIED` | the platform |
| Risk → approval flow | the platform |
| Audit trail | the platform |
| Permission enforcement | the platform |

## ⚠ What is **not** free

This is an honest boundary — hiding it destroys trust later.

| Remains | Roughly |
|---|---|
| Prompts and tone — what the agent **says** | ~15% |
| Business rules not expressed in contracts | ~5% |
| **Evaluation** — is the agent actually good | ongoing |

So **~80% free**. Not 100%, and we do not promise it.

## Inventory domain example

### You write — contract files

```yaml
inventory.stock.receive      COMMAND  R2  idempotent
  verification: inventory.stock.get → state = open

inventory.stock.write_off    COMMAND  R3   # loss — higher risk
inventory.daily_summary      QUERY    summary
inventory.low_stock          QUERY    anomaly
inventory.item.search        QUERY    search
inventory.stock.get          QUERY    detail
```

### The agent is built from that

It now checks stock, records receipts and warns about items running low —
and **you wrote no agent code**.

It is **entitled** to say *"receipt recorded"*, because
`inventory.stock.get` confirms it.

⚠ `write_off` is `R3` — it requires **approval**. That also comes from the
contract, not from agent code.

## When domains work together

This is where an ecosystem earns its name: the agent can reason **across**
domains.

```
"Can we fulfil this order?"
   ├── sales.order.get         → what was asked
   ├── inventory.stock.get     → do we have it
   └── finance.customer.debt   → is there outstanding debt
```

⚡ If each domain declares its contract, this works **automatically** — the
agent sees from the catalogue which domain provides what.

:::caution[Precondition: one canonical language]
For domains to understand each other they must speak in **canonical
resources**. If each returns its own shape, the agent cannot connect them.
:::

## Why it works this way

To an agent, a domain is a list of **what it can do** and **what it can
see**. If that list lives inside code, a human copies it by hand — and it
goes **stale immediately**.

In a contract it is the **single source of truth**, and the agent updates
itself every release.

:::caution[The most common mistake]
Finishing the domain and then saying *"now let's add AI"*.

At that point there is no `verification`, no `_label`, errors are free
text and queries are CRUD-only — and **everything is rewritten** for the
agent.

Do the eight items **upfront** and that work **never happens**.
:::

## Next

- [Domain contract](/en/ilova/shartnoma/) — each of the eight items
- [Readiness levels](/en/ilova/darajalar/) — A0 to A4
- [Domain Pack](/en/paket/nima-bu/) — how domain AI semantics are packaged
