---
title: Manifest
description: Full field reference, the invariants the schema enforces, and the mistakes that bite.
sidebar:
  order: 2
holat: ishlaydi
---

The manifest is the connector's **single source of truth**. The console,
the tool catalogue, the verification rule and the certificate all read
from it.

Contract: `contracts/integration/v1/connector-manifest.schema.json`

## Top level

```json
{
  "id": "bitrix24",
  "version": "2.1.0",
  "category": "crm",
  "display_name": "Bitrix24",
  "scope": "global",
  "description": "…",
  "auth": { },
  "config_schema": { },
  "operations": [ ]
}
```

| Field | Rule |
|---|---|
| `id` | `^[a-z][a-z0-9_.-]{1,63}$` — used in URL paths |
| `version` | semver. **Adding** an operation is MINOR |
| `category` | `crm` `erp` `bank` `storage` `speech` `payments` `messaging` `inventory` `productivity` `api` `database` |
| `scope` | `global` or `tenant:<id>` |

:::note[`scope: tenant:<id>`]
A tenant-exclusive connector is **invisible** in the shared catalogue —
other tenants do not even know it exists.
:::

## Authentication

```json
"auth": {
  "type": "api_key",
  "credential_ref": "vault:connectors/bitrix24"
}
```

:::danger[Two invariants enforced by the schema]
1. **Inline secrets are FORBIDDEN.** If `auth.type != none`, then
   `credential_ref` is required and must start with `^vault:`.
2. If `auth.type = none`, `credential_ref` must be **absent**.

This is not left to review — the schema rejects it.
:::

## `config_schema`

Settings a tenant instance fills in (portal URL, pipeline id, …). JSON
Schema with `additionalProperties: false`.

⚠ These are **not secrets**. Secrets only ever arrive via `credential_ref`.

## Operations

```json
{
  "name": "crm.get_deal",
  "direction": "read",
  "risk_level": "L1",
  "idempotent": true,
  "timeout_ms": 15000,
  "description": "…",
  "input_schema": {
    "type": "object",
    "additionalProperties": false,
    "required": ["id"],
    "properties": { "id": { "type": "string", "pattern": "^[0-9]{1,19}$" } }
  },
  "output_schema": { },
  "verification": { }
}
```

### `direction`

| Value | Meaning |
|---|---|
| `read` | Read — no ledger entry |
| `write` | Write — ledger, idempotency, verification |
| `stream` | Streaming |

### `risk_level`

`L0` … `L4` — **informational only**. Approval and policy decisions are
**not** in the manifest; they belong to the platform.

### `idempotent`

Whether the **provider itself** deduplicates. If `false`, protection comes
only from the platform's semantic key.

⚠ Be honest. Claiming `true` falsely is a source of duplicate effects.

## Mistakes that bite

| ⛔ Mistake | Consequence |
|---|---|
| Returning identifiers as **numbers** | ids above 2⁵³ corrupt |
| `upstream_error` for an unknown id | Index lag becomes `FAILED` |
| `output_schema` differs from reality | The predicate field cannot be found |
| Setting the predicate field conditionally | `field_missing` → silent `UNKNOWN` |
| URL or token in an error message | The secret reaches the **model's context** |

## Versioning

| Change | Version |
|---|---|
| Adding an operation | MINOR |
| Adding an optional field | MINOR |
| Removing / renaming an operation | **MAJOR** |
| Narrowing `output_schema` | **MAJOR** |

⚠ A Domain Pack requires a **minimum** connector version (`min_version`).
If the read-back appeared in a newer version, the pack **will not install**
below it.

## Next

- [The verification block](/en/konnektor/verification/) — ⚡ most important
- [Conformance suite](/en/konnektor/muvofiqlik/)
