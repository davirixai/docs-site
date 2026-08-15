---
title: O'z platformangizni ulash
description: Mijoz tizimini Davirix agentiga ulash — boshdan oxirigacha.
sidebar:
  order: 1
holat: ishlaydi
holatIzoh: Ulash, agent yaratish, nashr va suhbat API orqali ishlaydi. Yangi API sirtlari chiqqan sari shu sahifaga qo'shiladi.
---

Sizda mijoz uchun qurilgan tizim bor — do'kon, ERP, CRM, buyurtma
bazasi. Uni Davirix agentiga ulaysiz: agent mijozning ma'lumotini
o'qiydi, u bilan gaplashadi va amal bajaradi.

Butun yo'l **API orqali**. Konsolga faqat kalit olish uchun kiriladi.

## Ish tartibi

```
BIR MARTA          har mijozga
─────────          ────────────
model profili      kalit
NATS               tizimni ulash
                   agent + nashr
                   suhbat
```

Chap ustun — platformani birinchi ko'targaningizda.
O'ng ustun — har yangi mijoz uchun, daqiqalar ichida.

---

## 1. Kalit

**Konsol → Platform → Users & Roles → API keys → Issue API key**

Qamrov tanlang. Integratsiya uchun odatda shu to'rttasi yetadi:

| Qamrov | Nima ochiladi |
|---|---|
| `connectors` | mijoz tizimini ulash, sozlash, o'chirish |
| `agents` | agent yaratish, versiyalash, nashr |
| `graphs` | dialog grafi |
| `agent-tokens` | suhbat tokenini olish |

⛔ **«No scope limit» ni tanlamang.** U kalitni butun admin sirtiga va
**barcha tenantga** ochadi. Integratsiya uchun bu deyarli hech qachon
kerak emas — va kalit sizib ketsa zarar chegarasiz bo'ladi.

Kalit **bir marta ko'rsatiladi**. Uni o'z sir omboringizga yozing;
yo'qotsangiz bekor qiling va yangisini oling.

Har chaqiruvda:

```
X-API-Key: <kalit>
```

⚠ Bir kalit — bir mijoz (tenant). Kalit o'z tenantiga qadalgan va
undan chiqa olmaydi.

---

## 2. Mijoz tizimini ulash

Mijozning ilovasi `rest` konnektori orqali ulanadi. **Kod yozilmaydi** —
manzil va kredensial havolasi yetadi.

```bash
curl -X POST https://<host>/api/admin/connectors \
  -H "X-API-Key: $KALIT" \
  -H 'Content-Type: application/json' \
  -d '{
    "type_id": "rest",
    "name": "Mijoz ERP",
    "auth_mode": "api_key",
    "scope": "read_write",
    "config": { "baseUrl": "https://erp.mijoz.uz" },
    "credential_ref": "vault:kv/mijoz/erp-kaliti"
  }'
```

```json
{ "id": "435f0487-…", "type_id": "rest", "status": "pending" }
```

:::danger[Sirni bu yerga yozmang]
`credential_ref` — **havola**, sirning o'zi emas. Xom kalit yuborilsa u
bazaga, jurnalga va xato matniga tushadi. Sir faqat vault'da yashaydi.
:::

Javobdagi `id` — **instans** id'si. Keyingi chaqiruvlarda aynan u
ishlatiladi:

```
GET    /api/admin/connectors                 ro'yxat
PUT    /api/admin/connectors/{instans_id}    sozlamani yangilash
DELETE /api/admin/connectors/{instans_id}    o'chirish (204)
```

### Mijoz tizimidan nima talab qilinadi

Agent `rest` konnektori orqali oddiy HTTP so'rov yuboradi:

```
GET  /api/products        katalog
POST /api/orders          buyurtma
```

⚡ **Idempotentlik kaliti** — eng muhim talab. Davirix har yozuvga
kalit qo'yadi va uni sarlavhada yuboradi. Mijoz tizimi **ayni kalit
bilan ikkinchi so'rovni yangi buyurtma qilib yozmasligi kerak**.

Busiz retry ikkinchi buyurtma yaratadi va buni hech kim sezmaydi.

---

## 3. Agent yaratish

Agent — **ma'lumot**, kod emas. Bitta JSON hujjat.

```bash
curl -X POST https://<host>/api/admin/agents \
  -H "X-API-Key: $KALIT" \
  -H 'Content-Type: application/json' \
  -d @agent.json
```

`agent.json`:

```json
{
  "agent_id": "mijoz-agenti",
  "definition": {
    "schema_version": "1",
    "origin": "console",
    "spec": {
      "schema_version": "1",
      "id": "mijoz-agenti",
      "display_name": "Mijoz agenti",
      "description": "Katalogdan narx o'qiydi va buyurtma rasmiylashtiradi",
      "default_language": "uz",
      "languages": ["uz", "ru"],
      "graph": { "file": "graphs/simple_agent.yaml" },
      "model": { "class": "chat-fast" },
      "permissions": {
        "tools": ["connector.rest.request"],
        "channels": ["web-chat"]
      },
      "capabilities": [
        {
          "id": "savdo-maslahat",
          "risk_level": "low",
          "requires_tools": ["connector.rest.request"],
          "requires_knowledge": []
        },
        {
          "id": "savdo-buyurtma",
          "risk_level": "medium",
          "requires_tools": ["connector.rest.request"],
          "requires_knowledge": []
        }
      ],
      "setup": {
        "inputs": { "type": "object", "properties": {} },
        "requires": {
          "channels": [],
          "knowledge": [],
          "connectors": [{ "category": "api", "purpose": "mijoz tizimi" }]
        },
        "overridable": []
      }
    },
    "setup": {},
    "provenance": null
  }
}
```

```json
{ "agent_id": "mijoz-agenti", "version": 1, "status": "draft" }
```

### Muhim maydonlar

| Maydon | Ma'nosi |
|---|---|
| `capabilities[].risk_level` | `low` javob beradi · `medium`/`high` tasdiq talab qilishi mumkin |
| `permissions.tools` | agent **faqat shu** toollarni chaqira oladi |
| `setup.requires.connectors` | qaysi turdagi ulanish kerakligi |
| `origin` | ⚠ majburiy `"console"` — hayot sikli ajratgichi, aktor emas |

⚠ `origin: "marketplace"` — imzolangan paketdan kelgan agent. U
`provenance` talab qiladi va maydonlari qulflanadi.

---

## 4. Nashr

Yaratilgan versiya `draft` holatida — u **ijro etilmaydi**.

```bash
curl -X POST https://<host>/api/admin/agents/mijoz-agenti/versions/1/publish \
  -H "X-API-Key: $KALIT"
```

⚡ Shu daqiqadan agent ishlaydi. Nashr **audit zanjiriga** yoziladi:
kim, qachon, qaysi kalit bilan.

Yangi versiya — yana `POST /agents` (versiya avtomatik oshadi), keyin
yana nashr. Eski versiya joyida qoladi:

```
GET /api/admin/agents/{id}/versions
GET /api/admin/agents/{id}/versions/{v}
```

---

## 5. Suhbat

Suhbat `agent-runtime` da va u **boshqa auth** ishlatadi. Kalitni
qisqa muddatli tokenga almashtirasiz:

```bash
TOKEN=$(curl -s -X POST https://<host>/api/admin/agent-tokens \
  -H "X-API-Key: $KALIT" | jq -r .token)
```

```json
{ "token": "eyJ…", "expires_in": 300, "audience": "agent-runtime" }
```

Keyin suhbat:

```bash
curl -X POST https://<runtime>/v1/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "tenant_id": "<tenant>",
    "message": "Salom, kamera narxlari qanday?",
    "agent_id": "mijoz-agenti"
  }'
```

| Yo'l | Nima uchun |
|---|---|
| `POST /v1/chat` | sinxron javob |
| `POST /v1/chat/stream` | SSE oqimi |
| `POST /v1/chat/{thread_id}/continue` | suhbatni davom ettirish |

:::danger[Token o'z tenantiga qadalgan]
Boshqa `tenant_id` bilan chaqirsangiz —
`403 service_token_tenant_mismatch`. Tenant **tokendan** olinadi.
:::

⚠ Token 5 daqiqa yashaydi va **qayta ishlatiladi**. Har chaqiruvdan
oldin almashtirish shart emas — muddati tugaganda yangilang.

---

## Xatolarni qanday o'qish

| Kod | Ma'nosi | Nima qilasiz |
|---|---|---|
| `401` | token yo'q yoki yaroqsiz | kalitni tekshiring |
| `403` `…tenant_mismatch` | token boshqa tenantga | to'g'ri tenant bilan chaqiring |
| `403` `Kalit qamrovi…` | qamrov yetmaydi | kalitga kerakli qamrovni bering |
| `422` | tana sxemaga mos emas | xabar **qaysi maydon** ekanini aytadi |
| `429` | kvota tugadi | keyingi oy yoki limitni oshiring |
| `502` | quyi tizim javob bermadi | `retryable` maydoniga qarang |

⛔ **`retryable: false` bo'lsa qayta urinmang.** Bu «amal bajarilmadi»
degani emas — «natija noma'lum» bo'lishi mumkin va takror amal
dublikat effekt beradi.

---

## Nimani o'zingizda saqlaysiz

| Qiymat | Nega |
|---|---|
| `X-API-Key` | sir omboringizda, kodda emas |
| `tenant_id` | har chaqiruvda kerak |
| `agent_id` | siz bergan nom, o'zgarmaydi |
| konnektor `instans_id` | sozlamani yangilash uchun |
| `thread_id` | suhbatni davom ettirish uchun |

⚠ Chat tokenini **saqlamang** — u 5 daqiqalik va har safar
olinaveradi.

---

## Platformani birinchi ko'targaningizda

Bu qadamlar bir marta, hamma mijozga umumiy:

| Nima | Qayerda | Busiz nima bo'ladi |
|---|---|---|
| Model profili | `POST /api/admin/model-profiles` | `/v1/chat` → 502 `model profile … is not configured` |
| Provayder | `POST /api/admin/providers` | model chaqirilmaydi |
| Endpoint | `POST /api/admin/endpoints` | model chaqirilmaydi |
| NATS (hodisa shinasi) | `docker-compose` | audit zanjiri **qurilmaydi** |
| Vault | `VAULT_ADDR` | kredensiallar konteyner muhitida qoladi |

---

## Mavjud API sirtlari

⚠ Ro'yxat yangi sirtlar chiqqan sari **kengayadi**.

| Sirt | Yo'l | Holat |
|---|---|---|
| Konnektorlar | `/api/admin/connectors` | ✅ to'liq CRUD |
| Agentlar | `/api/admin/agents` | ✅ yaratish · versiya · nashr · rollout |
| Graflar | `/api/admin/graphs` | ✅ yaratish · versiya · nashr |
| Kalitlar | `/api/admin/api-keys` | ✅ chiqarish · bekor · qamrov |
| Chat tokeni | `/api/admin/agent-tokens` | ✅ almashuv |
| Suhbat | `/v1/chat` · `/stream` · `/continue` | ✅ |
| Ijro | `/v1/executions` | ✅ |
| Model/provayder | `/api/admin/model-profiles` · `/providers` | ✅ |
| Tasdiqlar | `/api/admin/approvals` | ✅ |
| Audit | `/api/admin/audit` | ✅ o'qish |
| Bilim | `/api/admin/knowledge/*` | ◐ **faqat o'qish** |
| Ulanishni sinash | `POST /connectors/{id}/test` | ⛔ ruxsat grantsiz |

### ◐ Bilim — hozircha konsoldan

Baza yaratish va hujjat yuklash API'da yo'q; `GET` yo'llari ishlaydi.
Mijoz hujjatlarini bugun konsol orqali yuklaysiz.

### ⛔ Ulanishni sinash

`POST /connectors/{id}/test` javob bermaydi: tool-executor
`connector.probe` uchun ruxsat talab qiladi (fail-closed), ruxsatlar
esa nashr qilingan **agentlardan** sinxron bo'ladi.

⚠ Bu konnektorning o'zini to'smaydi — haqiqiy chaqiruvlar ishlaydi.
Faqat instans `status: "pending"` bo'lib qoladi va «sinash» tugmasi
javobsiz.

---

## Keyingi qadam

- [Idempotentlik](/integrator/idempotentlik/) — dublikat effektdan himoya
- [Xatolar](/integrator/xatolar/) — to'liq kod ro'yxati
- [Holatlar](/integrator/holatlar/) — `UNKNOWN` nega `FAILED` emas
- [Python SDK](/integrator/python-sdk/) — HTTP o'rniga
