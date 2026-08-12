---
title: What a connector is
description: Plugging an external system into the AI — a declarative manifest, not new platform code.
sidebar:
  order: 1
holat: ishlaydi
---

A connector binds Davirix to an **external system**: a CRM, an SMS
provider, a payment gateway, your own ERP.

## Two parts

| Part | What | Who writes it |
|---|---|---|
| **Manifest** (`.json`) | Declarative: which operations exist, input/output shape, verification rule | You |
| **Adapter** (code) | The HTTP call and response normalisation | You |

:::tip[Platform code is untouched]
Adding a connector does **not** require changing Davirix internals.
Manifest plus adapter — that is all.
:::

## What the manifest declares

```json
{
  "id": "bitrix24",
  "version": "2.1.0",
  "category": "crm",
  "scope": "global",
  "auth":   { "type": "api_key", "credential_ref": "vault:connectors/bitrix24" },
  "config_schema": { },
  "operations": [ ]
}
```

⚠ **A secret is never in the manifest** — only a `vault:` reference.
Inline secrets are **rejected at the schema level**.

## An operation

```json
{
  "name": "crm.create_deal",
  "direction": "write",
  "risk_level": "L2",
  "idempotent": false,
  "timeout_ms": 20000,
  "input_schema":  { },
  "output_schema": { },
  "verification":  { }
}
```

| Field | Required |
|---|---|
| `name` · `direction` · `risk_level` | ✅ |
| `input_schema` · `output_schema` | ✅ |
| `idempotent` · `timeout_ms` | ✅ |
| `verification` | for writes — ⚡ [the most important](/en/konnektor/verification/) |

`direction`: `read` · `write` · `stream`
`risk_level`: `L0` … `L4` — **informational only**; the decision is the
platform's.

## The route

```
1. Write the manifest
2. Write the adapter
3. Verify locally           ← davirix connector verify
4. Submit
5. The system re-verifies   ← conformance suite C1–C12
6. You get a certificate    ← level L0–L4
```

## Three rules — know them upfront

:::caution[1. "Not found" ≠ "error"]
Return `not_found` for an unknown id, not `upstream_error`.

Conflating them turns index lag into `FAILED` and closes the operation
incorrectly.
:::

:::caution[2. Identifiers are STRINGS]
A numeric id converted to `float64` **corrupts** above 2⁵³. A corrupted id
makes the read-back read a **different** record.

Always return them as strings.
:::

:::caution[3. Timeout is `UNKNOWN`, not `FAILED`]
"No response" and "did not happen" are not the same.
:::

## Next

- [Manifest](/en/konnektor/manifest/) — full field reference
- [The verification block](/en/konnektor/verification/) — ⚡ the page that matters most
- [Certification](/en/konnektor/sertifikatsiya/)
