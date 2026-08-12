---
title: What Davirix is
description: An AI workforce platform — what it does, what it refuses to do, and who needs it.
sidebar:
  order: 1
holat: ishlaydi
---

Davirix is a platform where AI **takes action**. Its value is not the
model — everyone has models. The value is deciding whether the AI's
"done" can be **trusted**.

## What it does

```
Your application  →  Davirix  →  Agent  →  Action  →  External system
                                             ↓
                                    confirm against SOURCE
```

1. You send an **intent** — "reply to this customer", "create an order".
2. The agent plans and invokes the required operations.
3. Every **write operation** is recorded in the Operation Ledger.
4. After execution, the result is **read back from the source**.
5. You get `VERIFIED` — or an honest `UNKNOWN`.

## What it refuses to do

| ⛔ | Why |
|---|---|
| Treat the model's reply as "done" | The model writes; the system verifies |
| Retry on an uncertain outcome | Risk of a second SMS / second payment |
| Auto-write on conflicting knowledge | Goes to a human queue instead |
| Mutate an action after approval | Approval is bound to `action_hash` |

## Who needs it

:::tip[You need this if]
- Money moves · messages go out · stock changes
- The action **cannot be undone**
- Multiple businesses / branches
- A regulator is involved (banking, healthcare, telecom)
:::

:::note[You do NOT need this if]
- The AI only **drafts**, never acts
- One business, one branch
- The owner reads every output

In that case a plain pipeline is cheaper and faster. We won't hide that.
:::

## Core concepts

| Term | Meaning |
|---|---|
| **Execution** | One intent — one agent run |
| **Capability** | A business operation (`sales.order.create`), not a tool name |
| **Tool** | The implementation of a capability — a concrete connector operation |
| **Connector** | A binding to an external system (Bitrix24, Eskiz…) |
| **Domain Pack** | Packages a vertical: capabilities + verification + connectors |
| **Ledger** | The record of every write operation — duplicate protection lives here |
| **Read-back** | Re-reading the result from the source — the precondition for `VERIFIED` |

:::caution[Capability vs tool matters]
The semantic key is built from the **capability**, not the tool name. So
when the connector changes (Bitrix24 → 1C) idempotency **survives**: the
intent is the same.
:::

## Next

- [First execution in 5 minutes](/en/boshlash/besh-daqiqa/)
- [The one rule that matters](/en/boshlash/eng-muhim-qoida/) — do not integrate without reading it
- [Authentication](/en/boshlash/auth/)
