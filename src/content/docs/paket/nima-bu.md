---
title: Domain Pack nima
description: Vertikalni qadoqlaydigan paket — biznes amallari, tasdiq qoidalari va konnektor talablari bitta faylda.
sidebar:
  order: 1
holat: qisman
holatIzoh: "Kontrakt va yuklovchi ishlaydi (testlar bilan). Jonli o'rnatilgan paket hali yo'q."
---

Domain Pack bazaviy platformani **bitta vertikalga** moslaydi: ta'mirlash
ustaxonasi, klinika, do'kon.

## Nima uchun kerak

Platformada mexanizm bor: ledger, tasdiq, idempotentlik. Lekin mijoz
«ledger bor» degani sotib olmaydi — u **«mening biznesim uchun tayyor
ishlaydi»** deganini sotib oladi.

Domain Pack — o'sha «tayyor»ning o'zi.

## Nimadan iborat

```json
{
  "id": "texnik-servis",
  "version": "1.0.0",
  "display_name": "Texnik servis — qabul, savdo va to'lov",
  "domain": "texnik-servis",
  "connectors":   [ { "id": "bitrix24", "min_version": "2.1.0" } ],
  "capabilities": [ ],
  "read_tools":   [ ]
}
```

| Bo'lim | Nima |
|---|---|
| `connectors` | Paket **talab qiladigan** konnektorlar va eng past versiyasi |
| `capabilities` | Biznes **yozuv** amallari + tasdiq qoidalari |
| `read_tools` | Agent chaqira oladigan **o'qish** tool'lari |

## ⚠ Capability — faqat yozuv

```
capabilities  →  yozuv amallari (REVERSIBLE | IRREVERSIBLE)
read_tools    →  o'qish amallari
```

O'qish amali ledger yozuvini talab qilmaydi va katalogni shishiradi.
Shuning uchun `side_effect: NONE` paket sxemasida **umuman yo'q**.

:::caution[`read_tools` — maxfiylik chegarasi ham]
Bu ro'yxat paket qaysi ma'lumotni **ko'ra olishini** oshkor qiladi.
:::

## Capability yozuvi

```json
{
  "id": "service.order.create",
  "tools": ["connector.bitrix24.crm.create_lead"],
  "side_effect": "REVERSIBLE",
  "resource_param": "external_id",
  "verification": {
    "operation": "crm.get_lead",
    "business_key": "id",
    "expect": { "field": "status_id", "in": ["NEW", "IN_PROCESS"] },
    "max_wait_ms": 15000,
    "on_missing": "UNKNOWN"
  }
}
```

## Uchta qattiq qoida

:::danger[1. Qaytarilmaydigan amal tasdiqsiz bo'lolmaydi]
`side_effect: IRREVERSIBLE` + `verification` yo'q → paket **rad etiladi**.

Sabab: tasdiqsiz amal hech qachon `VERIFIED` bo'lmaydi. Qaytariladigan
amalda bunga chidasa bo'ladi; qaytarilmaydiganda — pul ketdi, SMS ketdi —
noaniqlik **abadiy**.
:::

:::danger[2. Bitta tool — bitta capability]
Ikki biznes ma'nosi bitta tool'ni bo'lisha **olmaydi**: tizim ularni
ajrata olmasdi va ledger noto'g'ri amalga yozilardi.

Shuning uchun `service.order.create` (lead) va `sales.order.create` (deal)
**ayrim** tool'larda.
:::

:::danger[3. Paket bazaviy amalni qayta ta'riflay olmaydi]
Platformaning o'z amali (masalan SMS) paket tomonidan **o'zgartirilmaydi**.
Aks holda paket tasdiq qoidasini bo'shashtirib, soxta `VERIFIED` yaratishi
mumkin edi.
:::

## Capability ID — abadiy

⚡ `capability_id` **semantik kalitga** tushadi. Uni o'zgartirish —
idempotentlikning buzilishi: eski yozuvlar eski id'ga bog'langan, yangi
so'rov yangi id bilan kelib **dublikat effekt** yaratadi.

| O'zgarish | Versiya |
|---|---|
| Capability qo'shish | MINOR |
| Capability **o'chirish** yoki **qayta nomlash** | **MAJOR** |

## Keyingi qadam

- [Paket yozish](/paket/yozish/) — qadamma-qadam
- [verification bloki](/konnektor/verification/)
