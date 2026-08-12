---
title: Limitations
description: What works today, what is partial and what does not exist yet — measured, not planned.
sidebar:
  order: 3
  badge:
    text: Measured
    variant: tip
holat: ishlaydi
---

This page states **measured** reality, not the roadmap. Date:
**2026-08-12**.

## ✅ Works — with proof

| What | Proof |
|---|---|
| One intent — one effect | 10,000 parallel → **exactly 1** (live PostgreSQL) |
| No false "done" | HTTP 200 = `ACKNOWLEDGED`, not `VERIFIED` |
| Timeout → `UNKNOWN` | Blind retry **forbidden** |
| Post-approval mutation blocked | **100/100** |
| Conflicting knowledge → no auto-write | Routed to a human queue |
| Domain Pack contract | **8 rules** survive mutation testing · 9 invalid fixtures rejected |
| Pack loader | **14 tests** · an invalid pack stops startup |
| Python SDK | Linux · macOS · Windows · Python 3.10–3.13 |

## ⚠ Partial

| What | Limitation |
|---|---|
| **Verification chain** | **2 open defects** — see below |
| **Read-back operations** | Only on `bitrix24` (`crm.get_deal`, `crm.get_lead`) |
| **Auth** | **Three** schemes (ADR-035 tracks unification) |
| **`input` shape** | MVP accepts `message` only; typed schema ⏳ |
| **Domain Pack** | Contract and loader ✅ · packs installed live: **0** |

### Two open defects in the verification chain

:::danger[Until these land, most operations will not reach `VERIFIED`]
1. **CRM operations are not registered as tools.** The connector exists in
   the hub, but the agent cannot call it.
2. **The verification request passes the tool name to the hub** instead of
   the connector id — so the request never reaches its target.

Both are being fixed in phase F0.
:::

## ⛔ Not yet

| What | State |
|---|---|
| **Payment connector** | `payme` and `click` manifests declare **0 operations** |
| **Connectors** | **4 of 21** implemented: `eskiz` · `bitrix24` · `aisha` · `uzbekvoice` |
| **1C · Click · Payme · Telegram** | absent |
| **Certification** | Design complete · implementation F1–F3 |
| **SDK: TypeScript · Go** | ⏳ Python first |
| **MCP** | ⏳ planned |
| **Outbound webhooks** | ⏳ use SSE or polling |
| **Installing packs from the console** | ⏳ use `DOMAIN_PACKS_DIR` |

## ⛔ Never

`gRPC` · client-facing `WebSocket` (internal channel and voice layer only)

## Zero-retention mode

With `data_retention: zero` the following **do not work**:

- server-side multi-turn conversation
- memory
- handover to a human operator
- approval flows
- reading an execution result later
- call recording

## Idempotency window

A connector result is held in the transport layer for at most **60
minutes**, then discarded. The semantic protection (Ledger) has **no
expiry**.

## Why this page exists

Documenting something as working when it isn't costs hours of integration
time and burns trust. This page is updated every release.
