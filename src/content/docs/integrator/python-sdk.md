---
title: Python SDK
description: "`pip install davirix` — to'liq API, holatlar va SDK majburlaydigan to'rt qoida."
sidebar:
  order: 1
holat: ishlaydi
---

```bash
pip install davirix
```

Python 3.10+ · sof-Python (`py3-none-any`) · Linux · macOS · Windows.

## SDK nima uchun kerak

SDK shunchaki HTTP o'ram emas. U **to'rt qoidani kod bilan majburlaydi** —
xom HTTP'da bu qoidalar qo'lda yoziladi va unutiladi:

| Qoida | SDK'da qanday |
|---|---|
| `completed` ≠ «bajarildi» | `.status` va `.verified` — **ayrim** maydonlar |
| `UNKNOWN` istisno emas | Holat sifatida qaytadi, `raise` qilinmaydi |
| `idempotency_key` majburiy | Berilmasa tanadan **avtomatik** hosil qilinadi |
| Retry faqat `retryable` da | `APIError.retryable` — qaror sizniki, lekin ma'lumot aniq |

:::caution[Xom HTTP'ning xavfi]
To'rt qoidaning **birortasini** unutish — dublikat effekt yoki soxta
«bajarildi». Aynan shuning uchun SDK bor.
:::

## Klient

```python
import os
from davirix import Davirix

dx = Davirix(
    api_key=os.environ["DAVIRIX_KEY"],
    tenant_id="acme-bank",              # ixtiyoriy: har chaqiruvda ham berish mumkin
    base_url=None,                    # standart: https://api.davirix.com
    timeout=30.0,
)
```

Kontekst menejeri sifatida ham ishlaydi:

```python
with Davirix(api_key=...) as dx:
    n = dx.run(...)
```

## Asosiy metodlar

### `run()` — yuborish va kutish

```python
n = dx.run(
    agent_id="acme-support",
    input={"text": "Kartani bloklang, oxirgi 4 raqam 7731"},
    tenant_id="acme-bank",
    idempotency_key="buyurtma-2026-08-12-0001",
)
```

Ijro yakunlanguncha kutadi va natijani qaytaradi.

### `start()` — yuborish, kutmaslik

```python
n = dx.start(agent_id=..., input=...)
n.execution_id     # "exe_0123..."
```

Uzoq ijro uchun: yuborasiz, keyin `wait()` yoki `get()` bilan olasiz.

### `wait()` · `get()` · `cancel()`

```python
n = dx.wait(execution_id)      # yakunlanishini kutadi
n = dx.get(execution_id)       # joriy holatni oladi
n = dx.cancel(execution_id)    # bekor qiladi
```

## Natijani o'qish

```python
n.status        # "completed" | "failed" | "cancelled" | ...
n.verified      # ⚡ bool — AMAL manbadan tasdiqlandimi
n.unknown       # bool — natija noma'lummi
n.operations    # amallar ro'yxati

for op in n.operations:
    op.capability_id     # "sales.order.create"
    op.status            # "VERIFIED" | "ACKNOWLEDGED" | "UNKNOWN" | ...
    op.resource_ref      # manbadagi resurs havolasi
```

:::danger[Eng ko'p uchraydigan xato]
```python
if n.status == "completed":
    print("bajarildi")        # ⛔ YOLG'ON bo'lishi mumkin
```
`status` — **model** haqida. `verified` — **amal** haqida.
[Batafsil](/boshlash/eng-muhim-qoida/).
:::

## Idempotentlik

Kalit berilmasa SDK uni **so'rov tanasidan** hosil qiladi:

```python
from davirix import derive_idempotency_key

key = derive_idempotency_key({"agent_id": "...", "input": {...}})
```

⚠ Avtomatik kalit **ayni tana** uchun ayni kalitni beradi. Agar sizning
niyatingiz «har chaqiruv — yangi amal» bo'lsa, **o'z** kalitingizni
bering. Batafsil: [idempotentlik](/integrator/idempotentlik/).

## Xatolar

```python
from davirix import APIError

try:
    n = dx.run(...)
except APIError as e:
    e.code           # "rate_limited", "unauthorized", ...
    e.retryable      # bool
    e.status_code    # HTTP kodi
    e.request_id     # yordam so'raganda SHU kerak
```

⛔ **Retry faqat `retryable: True` da.** Boshqa holatda qayta urinish
muammoni tuzatmaydi va dublikat xavfi tug'diradi.

## Yordam so'raganda

Xato haqida xabar berganda **`execution_id`** va **`request_id`** ni
yuboring — ular bilan butun zanjir tiklanadi.

⛔ Suhbat matnini yubormang: u bizga kerak emas va nol-saqlash rejimida
saqlanmaydi ham.

## Keyingi qadam

- [HTTP API](/integrator/http-api/) — SDK'siz ishlash
- [Holatlar](/integrator/holatlar/) — 12 ta ijro holati
- [Xatolar](/integrator/xatolar/)
