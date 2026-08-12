---
title: Connector types
description: Which external systems to connect to, which not to — and why.
sidebar:
  order: 2
holat: ishlaydi
---

Davirix sells **the system**, not an add-on to someone else's. That
completely determines the connector strategy.

## Three types — entirely different things

| Type | Example | Role | Lifespan |
|---|---|---|---|
| **Counterparty** | SMS · payments · bank · marketplace · tax authority | Dealing with an external **party** | ♾️ **permanent** |
| **Import** | legacy CRM · legacy inventory system | **Migrating** the customer | ⏳ **sunsets** |
| ~~Acting in an external system~~ | ~~creating a deal in someone else's CRM~~ | ⛔ **not needed** | — |

---

## 1. Counterparty — permanent

These are external **parties**, not systems. You can never absorb them
into your own platform:

| What | Why permanent |
|---|---|
| **SMS operator** | The message leaves via the operator's network |
| **Payment provider** | Money moves through bank infrastructure |
| **Bank** | The account is at the bank |
| **Marketplace** | The buyer is there |
| **Tax authority** | The state |

⚡ These demand the **highest quality** and must be **ours**. Without them
the system does not work — a business does not run without payments and
messages.

### Current state

| Counterparty | State |
|---|---|
| `eskiz-sms` | ✅ **3 operations** · read-back present |
| `payme` | ⛔ **0 operations** |
| `click` | ⛔ **0 operations** |
| `uzum` | ⛔ **0 operations** |
| bank · tax | ⛔ no manifest either |

---

## 2. Import — sunsets

The customer's legacy system. Its job is to **get the data out** and to
run **in shadow mode** alongside.

```
1. Import       — we read from the legacy system
2. Shadow       — Davirix runs alongside, produces DRAFTs
3. Comparison   — the customer sees the difference
4. Migration    — WHEN the customer wants it
5. Connector    — switched off
```

⛔ An import connector **has no write operations** — and this is no
longer a convention, it is an **enforced rule**.

The manifest declares `connector_class: import`, and then:

| Gate | Where | What happens |
|---|---|---|
| Contract schema | `contracts/integration/v1` | `import` + `direction: write` → manifest **invalid** |
| Hub startup | `Manifest.Validate()` | the hub **refuses to start** on a violating manifest |
| Tool registry | tool-executor test | adding a Bitrix write tool turns CI **red** |
| Instance setup | `console.supports_write: false` | an instance cannot be created with `read_write` scope |

Only these are needed:

| Needed | Why |
|---|---|
| List (paginated) | Bulk import |
| Delta (changes) | Keeping shadow mode current |
| Single record detail | Comparison |

---

## 3. ⛔ Acting in an external system — not needed

:::danger[Strategic decision]
We do **not** create deals in someone else's CRM. We work in our own
system.

If we operate inside the customer's Bitrix, we become an **add-on to
Bitrix** — and the day Bitrix ships its own AI, we are **redundant**.
:::

⚡ On 2026-08-12 three write operations (`crm.create_lead`,
`crm.create_deal`, `crm.add_activity`) were **removed** from `bitrix24`
together with 143 lines of adapter code. They had been written before
this law existed and were violating it.

The removal is guarded four ways (see the table above), so they cannot
return quietly.

---

## How this is said to the customer

⚠ *"Throw away your Bitrix"* creates resistance and stalls the sale.

The correct sequence:

| # | What the customer hears |
|---|---|
| 1 | "Change nothing — we will run **alongside** and show you" |
| 2 | "Here is a month of **difference**" |
| 3 | "Migrate if you want" — **your decision** |
| 4 | "When you grow, the system grows — **no migration**" |

Losing the dependency is a **result**, not a promise.

## Next

- [Manifest](/en/konnektor/manifest/)
- [The verification block](/en/konnektor/verification/)
