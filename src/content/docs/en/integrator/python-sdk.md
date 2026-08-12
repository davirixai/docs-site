---
title: Python SDK
description: "`pip install davirix` — full API, statuses, and the four rules the SDK enforces."
sidebar:
  order: 1
holat: ishlaydi
---

```bash
pip install davirix
```

Python 3.10+ · pure Python (`py3-none-any`) · Linux · macOS · Windows.

## Why use the SDK

The SDK is not just an HTTP wrapper. It **enforces four rules in code** —
rules you have to write by hand, and will forget, over raw HTTP:

| Rule | How the SDK does it |
|---|---|
| `completed` ≠ "done" | `.status` and `.verified` are **separate** fields |
| `UNKNOWN` is not an exception | Returned as a state, never raised |
| `idempotency_key` is required | Derived from the body automatically if omitted |
| Retry only when `retryable` | `APIError.retryable` — your call, but the signal is unambiguous |

:::caution[The risk of raw HTTP]
Missing **any one** of the four means a duplicate effect or a false
"done". That is precisely why the SDK exists.
:::

## Client

```python
import os
from davirix import Davirix

dx = Davirix(
    api_key=os.environ["DAVIRIX_KEY"],
    tenant_id="acme-bank",              # optional: can also be per call
    base_url=None,                    # default: https://api.davirix.com
    timeout=30.0,
)
```

Works as a context manager:

```python
with Davirix(api_key=...) as dx:
    n = dx.run(...)
```

## Core methods

### `run()` — submit and wait

```python
n = dx.run(
    agent_id="acme-support",
    input={"text": "Block the card ending 7731"},
    tenant_id="acme-bank",
    idempotency_key="order-2026-08-12-0001",
)
```

Blocks until the execution finishes and returns the result.

### `start()` — submit without waiting

```python
n = dx.start(agent_id=..., input=...)
n.execution_id     # "exe_0123..."
```

For long executions: submit now, collect later with `wait()` or `get()`.

### `wait()` · `get()` · `cancel()`

```python
n = dx.wait(execution_id)      # block until finished
n = dx.get(execution_id)       # current state
n = dx.cancel(execution_id)    # cancel
```

## Reading the result

```python
n.status        # "completed" | "failed" | "cancelled" | ...
n.verified      # ⚡ bool — was the ACTION confirmed against the source
n.unknown       # bool — is the outcome unknown
n.operations    # list of operations

for op in n.operations:
    op.capability_id     # "sales.order.create"
    op.status            # "VERIFIED" | "ACKNOWLEDGED" | "UNKNOWN" | ...
    op.resource_ref      # reference to the resource in the source system
```

:::danger[The most common mistake]
```python
if n.status == "completed":
    print("done")        # ⛔ may be a LIE
```
`status` is about the **model**. `verified` is about the **action**.
[Details](/en/boshlash/eng-muhim-qoida/).
:::

## Idempotency

If you omit the key, the SDK derives it **from the request body**:

```python
from davirix import derive_idempotency_key

key = derive_idempotency_key({"agent_id": "...", "input": {...}})
```

⚠ A derived key produces the same key for the **same body**. If your
intent is "every call is a new action", supply your **own** key.
See [idempotency](/en/integrator/idempotentlik/).

## Errors

```python
from davirix import APIError

try:
    n = dx.run(...)
except APIError as e:
    e.code           # "rate_limited", "unauthorized", ...
    e.retryable      # bool
    e.status_code    # HTTP status
    e.request_id     # include THIS when asking for help
```

⛔ **Retry only when `retryable` is True.** Otherwise retrying will not
fix anything and risks a duplicate.

## Asking for help

When reporting a problem, send the **`execution_id`** and **`request_id`** —
they reconstruct the whole chain.

⛔ Do not send conversation text: we do not need it, and under
zero-retention it is not stored anyway.

## Next

- [HTTP API](/en/integrator/http-api/) — working without the SDK
- [Statuses](/en/integrator/holatlar/)
- [Errors](/en/integrator/xatolar/)
