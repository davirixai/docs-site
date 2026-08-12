---
title: Authentication
description: Which scheme each service expects and what is enough for a normal integration.
sidebar:
  order: 4
holat: qisman
holatIzoh: "Three different schemes are in use today. That is a known weakness — ADR-035 tracks unifying them."
---

## Normal integration

To connect your application to Davirix, **one thing** is enough:

```http
Authorization: Bearer <service-JWT>
```

The SDK sets it for you — you only supply the key:

```python
dx = Davirix(api_key=os.environ["DAVIRIX_KEY"])
```

## Full picture

:::caution[Three schemes exist today]
This is an **openly recorded weakness**. All services should converge on
one scheme (ADR-035). For now:
:::

| Service | Header | Do you need it |
|---|---|---|
| `agent-runtime` (execution) | `Authorization: Bearer <service-JWT>` | ✅ **yes** |
| `platform-core` | `X-API-Key` + `X-Tenant-Id` | usually no |
| `knowledge-runtime` · `integration-hub` | `X-Service-Key` + `X-Tenant-Id` | usually no |

:::note[Other internal services]
The remaining platform components run on the **internal network** and are
not callable from outside. They are not part of your integration.

The only supported external entry point is the **first row** of the table
above.
:::

## Tenant

Every request must state which organisation it belongs to:

```python
# Once on the client — applies to all calls
dx = Davirix(api_key=..., tenant_id="bank-uz")

# Or per call
dx.run(agent_id=..., tenant_id="bank-uz", input=...)
```

If neither is given the SDK **raises** — it does not silently pick a
default. Writing to the wrong tenant is a data boundary violation.

## Storing the key

| ✅ Right | ⛔ Wrong |
|---|---|
| Environment variable | Hard-coded in source |
| Secret manager / Vault | Committed to the repo |
| CI secret | Printed to logs or error messages |

Davirix never returns your key in a response, log or error message —
neither should you.

## Next

- [Python SDK](/en/integrator/python-sdk/)
- [Errors](/en/integrator/xatolar/) — `unauthorized` vs `forbidden`
