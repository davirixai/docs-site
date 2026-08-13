---
title: Stek xaritasi
description: 12 servis, ular orasidagi bog'liqlik, uchta migratsiya bosqichi va ko'tarilish tartibi.
sidebar:
  order: 2
holat: ishlaydi
---

Platforma **12 uzoq yashovchi servis** va **4 bir martalik bosqichdan**
iborat. Bir martalik bosqichlar (`*-migrate`, `*-init`) ishini bajaradi
va chiqadi — ular yiqilsa, ularga bog'liq servis **umuman ko'tarilmaydi**.

## Qatlamlar

```
   Infratuzilma      postgres · redis · qdrant
        ↑
   Platforma         platform-core ── web-console
        ↑
   Ijro              tool-executor · integration-hub
        ↑
   AI                inference-gateway · registry · agent-runtime
        ↑
   Bilim             knowledge-runtime
```

## Bog'liqlik jadvali

Compose faylidan o'lchangan (`docker compose config`):

| Servis | Kutadi |
|---|---|
| `platform-core-migrate` | postgres **sog'lom** |
| `platform-core` | postgres · redis · **migrate tugaganini** |
| `web-console` | platform-core |
| `tool-executor-migrate` | postgres |
| `tool-executor` | postgres · redis · **migrate tugaganini** |
| `integration-hub` | postgres |
| `agent-runtime` | postgres · redis · platform-core-migrate |
| `registry-db-init` | postgres |
| `registry-migrate` | **db-init tugaganini** |
| `registry` | **migrate tugaganini** |
| `qdrant` | — |
| `knowledge-runtime` | qdrant **sog'lom** · inference-gateway |
| `inference-gateway` | — |

## Uchta migratsiya — uchta ALOHIDA baza

⛔ **Bu ataylab.** Uch servis ham `alembic`/o'z migratsiyasini ishlatadi
va bitta bazada `alembic_version` jadvali **bitta** bo'ladi. Ular bir
bazada bo'lsa, ikkinchi migratsiya birinchisining revizyasini ko'rib
yiqiladi:

```
Can't locate revision identified by '0037'
```

| Baza | Egasi |
|---|---|
| `davirix_ai` | platform-core · agent-runtime · tool-executor ledger |
| `davirix_hub` | integration-hub |
| `davirix_registry` | registry |

⚠ `davirix_registry` **avtomatik yaratilmaydi**: PostgreSQL'da
`CREATE DATABASE IF NOT EXISTS` yo'q. Shu bois `registry-db-init`
bosqichi bor — u shartli `psql` bilan bazani yaratadi.

## Ko'tarilish tartibi

Compose `depends_on` bilan o'zi hal qiladi, lekin **nima kutilayotganini
bilish** kerak:

```
postgres/redis/qdrant sog'lom
   ↓
tool-audit-init · registry-db-init          (bir martalik)
   ↓
platform-core-migrate · tool-executor-migrate · registry-migrate
   ↓
platform-core · tool-executor · integration-hub · registry · gateway
   ↓
agent-runtime · knowledge-runtime · web-console
```

## Bir martalik bosqichlar nima qiladi

| Bosqich | Ishi | Yiqilsa |
|---|---|---|
| `platform-core-migrate` | alembic → `davirix_ai` | platform-core ko'tarilmaydi |
| `tool-executor-migrate` | ledger sxemasi | ⚠ tool-executor **ko'tariladi**, lekin ledger o'qishlari 500 beradi |
| `registry-db-init` | bazani yaratadi | registry-migrate yiqiladi |
| `registry-migrate` | alembic → `davirix_registry` | registry ko'tarilmaydi |
| `tool-audit-init` | audit hajmi egaligini `65532` ga beradi | tool-executor **permission denied** bilan yiqiladi |

⚠ `tool-audit-init` kerak, chunki nomli hajm **root** sifatida
yaratiladi, konteyner esa `nonroot` (uid 65532) ostida ishlaydi.

## Portlar

⛔ Tashqariga **faqat konsol** ochiladi. Qolganlari ichki tarmoqda
qoladi — ularda tashqi auth yo'q va ochiq port butun ma'lumotni berardi.

| Servis | Ichki port | Tashqariga |
|---|---|---|
| web-console | 3000 | ✅ `CONSOLE_PORT` |
| platform-core | 8000 | ⛔ |
| agent-runtime | 8001 | ⛔ |
| knowledge-runtime | 8002 | ⛔ |
| registry | 8003 | ⛔ |
| integration-hub | 8004 | ⛔ |
| inference-gateway | 8081 | ⛔ |
| tool-executor | 8083 | ⛔ |
| qdrant | 6333 | ⛔ |
