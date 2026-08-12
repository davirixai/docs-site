---
title: The one rule that matters
description: "`status: completed` does NOT mean \"done\". Integrating without knowing this breaks silently."
sidebar:
  order: 3
  badge:
    text: Read first
    variant: caution
holat: ishlaydi
---

:::danger[One sentence]
### `status: completed` does **NOT** mean "done".

It means **the model replied**. Whether the action happened (SMS sent,
deal created) lives in a **different field**.
:::

## Why two fields

A single execution contains two independent things:

| Question | Field |
|---|---|
| Did the agent finish its work? | `status` |
| Did an **effect** occur in the outside world? | `operations[].status` |

They are **not linked**. The agent can reply successfully while the SMS
never went out — and that is a normal outcome, not an error.

```json
{
  "status": "completed",
  "operations": [
    { "capability_id": "notification.send_sms", "status": "UNKNOWN" }
  ]
}
```

> In the response above: **the agent replied, but whether the SMS arrived
> is unknown.**

### How this happens

If the connector times out, the error is returned to the model. The model
still writes its answer — it has to say something to the user. The
operation stays `UNKNOWN` in the Ledger and reconciliation resolves it
later.

## Operation statuses

| Status | Meaning | What you do |
|---|---|---|
| **`VERIFIED`** | ✅ **Confirmed against the source.** The only meaning of "done" | Continue |
| `ACKNOWLEDGED` | The connector replied — **transport**, not outcome | Wait |
| **`UNKNOWN`** | ⚠ **Outcome unknown** | ⛔ Do not retry. Wait |
| `MANUAL_REVIEW` | Held for a human | Resolved in the console |
| `FAILED` | Explicit rejection — an effect is **impossible** | Safe to retry |

:::caution[Retrying on `UNKNOWN` is FORBIDDEN]
A second SMS may go out. A second payment may clear.

"No response" and "did not happen" are **not the same thing**.
Reconciliation will find the final state; your job is to wait.
:::

## Right and wrong code

Wrong — the most common mistake:

```python
n = dx.run(...)
if n.status == "completed":
    print("SMS sent!")        # ⛔ may be a LIE
```

Right:

```python
n = dx.run(...)

if n.verified:
    print("SMS delivered")     # ✅ confirmed against the source
elif n.unknown:
    print("Outcome unknown — wait, do not resend")
else:
    print("Did not happen")
```

:::tip[The SDK enforces this]
The Python SDK does **not** raise on `UNKNOWN` — it returns as a state you
must handle explicitly. A silently swallowed `UNKNOWN` is exactly how
duplicate effects happen.
:::

## Why it is built this way

Many platforms treat HTTP 200 as "done". That is wrong:

- the connector **accepted the request** — that is transport;
- the provider **processed it** — that is a different thing;
- the effect **actually occurred** — that is a third thing.

Davirix marks only the third as `VERIFIED`, and proves it by **reading
back from the source**. Without a read-back it stays `ACKNOWLEDGED` — and
that is an **honest answer**.

## Next

- [Status reference](/en/malumotnoma/holatlar-jadvali/) — 12 execution and 9 operation states
- [Idempotency](/en/integrator/idempotentlik/) — how you are protected from duplicates
- [First execution in 5 minutes](/en/boshlash/besh-daqiqa/)
