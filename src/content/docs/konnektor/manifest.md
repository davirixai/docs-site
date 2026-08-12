---
title: Manifest
description: Konnektor manifestining to'liq maydonlari, majburiy invariantlar va tipik xatolar.
sidebar:
  order: 2
holat: ishlaydi
---

Manifest — konnektorning **yagona haqiqat manbai**. Konsol, tool katalogi,
tasdiq qoidasi va sertifikat — hammasi shundan o'qiydi.

Kontrakt: `contracts/integration/v1/connector-manifest.schema.json`

## Yuqori daraja

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

| Maydon | Qoida |
|---|---|
| `id` | `^[a-z][a-z0-9_.-]{1,63}$` — URL yo'lida ishlatiladi |
| `version` | semver. Amal **qo'shish** — MINOR |
| `category` | `crm` `erp` `bank` `storage` `speech` `payments` `messaging` `inventory` `productivity` `api` `database` |
| `scope` | `global` yoki `tenant:<id>` |

:::note[`scope: tenant:<id>`]
Tenant-eksklyuziv konnektor umumiy katalogda **ko'rinmaydi** — boshqa
tenantlar uning mavjudligini ham bilmaydi.
:::

## Autentifikatsiya

```json
"auth": {
  "type": "api_key",
  "credential_ref": "vault:connectors/bitrix24"
}
```

:::danger[Sxema darajasida majburlangan ikki invariant]
1. **Inline sir TAQIQ.** `auth.type != none` bo'lsa `credential_ref`
   majburiy va `^vault:` bilan boshlanishi shart.
2. `auth.type = none` bo'lsa `credential_ref` **bo'lmasligi** kerak.

Bu review'ga qoldirilmaydi — sxema rad etadi.
:::

## `config_schema`

Tenant instansi to'ldiradigan sozlamalar (portal URL, voronka id va h.k.).
JSON Schema, `additionalProperties: false`.

⚠ Bu maydonlar **sir emas**. Sir faqat `credential_ref` orqali.

## Amallar

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

| Qiymat | Ma'nosi |
|---|---|
| `read` | O'qish — ledger yozuvi yo'q |
| `write` | Yozuv — ledger, idempotentlik, tasdiq |
| `stream` | Oqim |

### `risk_level`

`L0` … `L4` — **faqat ma'lumot**. Approval va policy qarori manifestda
**emas**, platformada.

### `idempotent`

Provayder **o'z tomonida** dublikatni to'sadimi. `false` bo'lsa himoya
faqat platformaning semantik kaliti bilan bo'ladi.

⚠ Halol bo'ling. `true` deb yolg'on yozish — dublikat effekt manbai.

## Tipik xatolar

| ⛔ Xato | Oqibat |
|---|---|
| Identifikatorni **raqam** qilib qaytarish | 2⁵³ dan katta id buziladi |
| Noma'lum id uchun `upstream_error` | Indeks kechikishi `FAILED` ga aylanadi |
| `output_schema` haqiqatdan farq qiladi | Predikat maydonini topa olmaydi |
| Predikat maydonini shartli qo'yish | `field_missing` → jim `UNKNOWN` |
| Xato matnida URL yoki token | Sir **model kontekstiga** tushadi |

## Versiyalash

| O'zgarish | Versiya |
|---|---|
| Amal qo'shish | MINOR |
| Ixtiyoriy maydon qo'shish | MINOR |
| Amal o'chirish / qayta nomlash | **MAJOR** |
| `output_schema` ni toraytirish | **MAJOR** |

⚠ Domain Pack konnektorning **eng past** versiyasini talab qiladi
(`min_version`). Read-back amali yangi versiyada paydo bo'lgan bo'lsa,
undan pastda paket **o'rnatilmaydi**.

## Keyingi qadam

- [verification bloki](/konnektor/verification/) — ⚡ eng muhim
- [Muvofiqlik to'plami](/konnektor/muvofiqlik/)
