---
title: Certification
description: Levels L0–L4, what a certificate is, and how it is enforced at runtime.
sidebar:
  order: 4
holat: qisman
holatIzoh: "The contract, signature verification and the RUNTIME GATE work (in `enforce`, an uncertified connector cannot write). Certificate ISSUANCE does not exist yet — it awaits the live part of the conformance suite."
---

Connectors are **graded**: what guarantees they can offer is tested and
recorded in a certificate.

:::note[The level is computed, not requested]
You cannot ask for L3. The level follows from **which tests passed**.
:::

## Levels

| | What it grants | Gate |
|---|---|---|
| **L0** Catalogue | Visible in the catalogue. **Not callable** | Schema · no inline secrets · valid `scope` |
| **L1** Read | Reads work. Writes **blocked** | `probe` leaves no trace · responses match schema · unknown id → `not_found` |
| **L2** Write | Writes work. Result is `ACKNOWLEDGED` | Idempotency · duplicate storm → 1 effect · timeout → `UNKNOWN` |
| **L3** Verified write | Result can be **`VERIFIED`** | Read-back on every write · the predicate separates success **and failure** |
| **L4** Trusted | For high-risk tenants | Live sandbox · fault injection · secret hygiene |

## ⚠ L2 → L3 is not a natural step

It depends on the **provider**, not on you:

```
read-back API exists      →  L3 possible
no read-back API          →  STAYS at L2
```

:::tip[This is not a defect]
Without read-back, the connector's operations are never marked "done".
That is an **honest answer** — better than falsely green.
:::

## What a certificate is

Not a badge — a **signed claim**. It binds to a **digest**, not a version:

```json
{
  "connector_id":    "bitrix24",
  "version":         "2.1.0",
  "manifest_digest": "sha256:4f1c…",
  "adapter_digest":  "sha256:9ab7…",
  "level":           "L3",
  "suite_version":   "conformance@1.0.0",
  "evidence_ref":    "run:cert-2026-08-12-0117",
  "sandbox":         "live",
  "issued_at":       "…",
  "expires_at":      "…",
  "signature":       "…"
}
```

| | Why |
|---|---|
| **Digest** | A version number is a *claim*; a digest is a *fact*. One changed byte voids the certificate |
| **Expiry** | Provider APIs change without warning. A certificate without expiry is a permanent claim about a one-off test |
| **Evidence ref** | "Passed" is not enough: which run, which responses, which predicate |

## Runtime enforcement

| Condition | What the hub does |
|---|---|
| No certificate | ⛔ **refuses to load** |
| Digest mismatch | ⛔ **refuses to load** — code was swapped |
| Expired | ⚠ **read-only** |
| Level below requirement | ⚠ operation **blocked** |
| Revoked | ⛔ **stops immediately** |

⚠ A Domain Pack declares a **minimum level** per connector (`min_level`).
A pack requiring L3 **will not install** against an L2 connector — being
rejected at install time is clearer than an unexpected `UNKNOWN` at
runtime.

## Sandbox — live or cassette

| | Reaches | Note |
|---|---|---|
| **Live sandbox** | L0 → **L4** | Scoped, revocable credentials |
| **Cassette** (recorded responses) | L0 → **L2** | Cheap, but the cassette itself can lie |

:::caution[Cassettes cannot reach L3]
The "false green" test (C11) is **meaningless** against recorded
responses — the cassette can be written to match the predicate. A
verification claim is only provable against a live source.
:::

## Next

- [Conformance suite](/en/konnektor/muvofiqlik/) — C1–C12
- [The verification block](/en/konnektor/verification/) — the precondition for L3
