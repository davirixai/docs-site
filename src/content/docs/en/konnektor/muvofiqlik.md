---
title: Conformance suite
description: C1–C12 — the tests a connector must pass, and the failure each one came from.
sidebar:
  order: 5
holat: rejada
holatIzoh: "The test list is final; implementing it as code is phase F1."
---

Every test came from a **real failure**. The list grows: when a new
failure is found, a test is added and every connector is re-certified.

## The tests

| ID | What it checks | Why — which failure | Level |
|---|---|---|---|
| **C1** | Manifest matches schema; no inline secrets | A secret in the manifest reaches the repo, the logs and error text | L0 |
| **C2** | `probe` checks credentials and **creates nothing** | If probe leaves a trace, every connection test litters the source | L1 |
| **C3** | Unknown id → `not_found`, **not** `upstream_error` | Conflating them turns index lag into `FAILED` | L1 |
| **C4** | Responses match the declared `output_schema` | A lying schema means the predicate field cannot be found | L1 |
| **C5** | 2⁵³+1 identifiers survive | `float64` precision — a corrupted id reads a **different** record | L1 |
| **C6** | Same key twice → **one** effect | A retry sends a second SMS / second payment | L2 |
| **C7** | N **parallel** identical intents → exactly 1 effect | Sequential idempotency breaks under concurrency | L2 |
| **C8** | Timeout → `UNKNOWN`, **not** `FAILED` | "No response" ≠ "did not happen" | L2 |
| **C9** | Every `write` has `verification` whose `operation` is a real `read` | A write without the block is not a verified write | **L3** |
| **C10** | After a write, the read-back **finds** the predicate | A broken chain can still leave tests green | **L3** |
| **C11** | When the predicate does **not** hold, `VERIFIED` is **not** returned | ⚡ The critical one — see below | **L3** |
| **C12** | Credentials never appear in errors, logs or responses | Error text often reaches the **model's context** | L4 |

## ⚡ C11 — the heart of the suite

The other tests ask "**does it work?**". C11 asks "**can it lie?**".

:::danger[Why this is decisive]
A connector that always returns `{"status":"OK"}` **passes C1–C10
completely**. Only C11 catches it.

We deliberately force the source into a failure state and check that the
connector does **not** report `VERIFIED`.
:::

## Running locally

```bash
davirix connector verify
```

⚠ The local and central suites are the **same code**. If they diverge,
the "works on my machine" problem comes back.

## What will fail you

| Behaviour | Test that catches it |
|---|---|
| Returning ids as numbers | C5 |
| Returning 500 for an unknown id | C3 |
| Setting the predicate field conditionally | C10 |
| Returning a constant `status: OK` | **C11** |
| Turning a timeout into `FAILED` | C8 |
| Putting a URL in an error message | C12 |
| Claiming `idempotent: true` falsely | C6 · C7 |

## Next

- [Certification levels](/en/konnektor/sertifikatsiya/)
- [The verification block](/en/konnektor/verification/)
