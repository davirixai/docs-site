---
title: Sirlar va kalitlar
description: Qaysi sir qayerda yashaydi, nega ular alohida, va kredensiallar qanday yechiladi.
sidebar:
  order: 6
holat: ishlaydi
---

## Ikki xil sir bor

| Tur | Kim biladi | Misol |
|---|---|---|
| **Platforma sirlari** | servislar | `SERVICE_JWT_SECRET`, baza paroli |
| **Tenant kredensiallari** | ⛔ **faqat hub** | Payme kaliti, SMS paroli, Bitrix webhook |

⛔ Bu farq muhim: tenant kredensiali **hech qachon** konsolga,
agent-runtime'ga yoki tool-executor'ga bermaydi. U integration-hub'da
`vault:` havolasi orqali yechiladi.

## Kredensial sxemasi

```
vault:kv/tenants/<tenant>/payme      ← prod
vault:env/PAYME_KEY                  ← ⚠ faqat dev
```

⛔ **Inline sir RAD ETILADI.** Konnektor instansiga xom kalit yozib
bo'lmaydi — kontrakt uni qabul qilmaydi.

⚠ `vault:env/` — dev yo'li: sir konteyner muhitida turadi. Prod'da
`VAULT_ADDR` + `VAULT_TOKEN` berilishi kerak, aks holda konnektorlar
`credential_error` beradi (fail-closed).

## Nega har servisga ALOHIDA kalit

| Kalit | Kim uchun |
|---|---|
| `INTEGRATION_HUB_SHARED_SECRET` | hub'ga kiruvchi |
| `KNOWLEDGE_SHARED_SECRET` | knowledge-runtime'ga kiruvchi |
| `REGISTRY_SHARED_SECRET` | registry'ga kiruvchi |

⛔ Ularni **bir xil qilmang**. Bitta kalitni ikkala servisga yuborish
birining sirini ikkinchisiga oshkor qiladi — chaqiruvchi kompromis
bo'lsa, u ikkala servisga ham kira oladi.

## API kalitlari — tashqi platformani ulash

Boshqa tizimni Davirix'ga ulash uchun **API kalit** kerak. Uni
konsoldan chiqarasiz: **Platform → Users & Roles → API keys → Issue
API key**.

⛔ **Kalit bir marta ko'rsatiladi.** U hech qayerda saqlanmaydi —
yo'qotsangiz, bekor qiling va yangisini chiqaring.

### Qaysi rolni tanlash

| Rol | Nimaga yetadi |
|---|---|
| `service` | ⛔ admin sirtiga **umuman kirmaydi** — xizmat sirtlari uchun |
| `admin` | admin sirtiga kiradi; qamrov bilan **cheklanadi** |

### Qamrov (scope) — kalitni toraytirish

`admin` kalitiga qaysi bo'limlar ochilishini tanlaysiz (`agents`,
`graphs`, `connectors`, …). Qamrovdan tashqari bo'lim `403` beradi.

⚡ **Ikki holat bir xil emas:**

| Holat | Ma'nosi |
|---|---|
| Qamrov tanlangan | faqat o'sha bo'limlar · **o'z tenantida** |
| «No scope limit» | ⚠ **butun** admin sirti · **barcha** tenantda |

⛔ Qamrovsiz kalit tenantlar orasida yura oladi. Uni faqat o'zingiz
boshqaradigan platforma avtomatikasi uchun ishlating.

### Agent bilan gaplashish — token almashuvi

API kalit `platform-core` admin sirtini ochadi, lekin `agent-runtime`
(suhbat) **boshqa auth** ishlatadi. Ko'prik — almashuv:

```bash
# 1. kalitni chat tokeniga almashtirish
curl -X POST https://<host>/api/admin/agent-tokens \
     -H "X-API-Key: $KALIT"
# → {"token": "...", "expires_in": 300, "tenant_id": "..."}

# 2. agent bilan suhbat
curl -X POST https://<runtime>/v1/chat \
     -H "Authorization: Bearer $TOKEN" \
     -d '{"tenant_id":"...","message":"salom","agent_id":"..."}'
```

⚠ Token **5 daqiqa** yashaydi va uni qayta ishlatish mumkin — har
chaqiruvda almashtirish shart emas.

⛔ **Token o'z tenantiga qadalgan.** Boshqa tenant bilan chaqirsangiz
`403 service_token_tenant_mismatch`. Tenant tokendan keladi, so'rov
tanasidan emas.

⚠ Bunga alohida qamrov kerak: **`agent-tokens`**. `agents` qamrovi
yetarli emas — agent ta'rifini o'qish va agentni **ishga tushirish**
turli huquqlar.

### Birinchi kalit — serverdan

Konsolga kirish uchun ham kalit kerak bo'lgan holat («tovuq-tuxum»)
`PLATFORM_BOOTSTRAP_API_KEY` env o'zgaruvchisi bilan yechiladi. U
**ishonch ildizi** va shu bois serverda qoladi: undan keyingi barcha
kalitlar konsoldan beriladi.

⚠ Bootstrap kaliti qamrovsiz. Uni kundalik integratsiyaga bermang.

## Ikki qatlam: kalit + JWT

Ba'zi sirtlar **ikkalasini** talab qiladi:

```
X-API-Key          ← «bu servis chaqiryapti»
Authorization: JWT ← «bu AYNAN o'sha servis»
```

⚠ Ular bir-birining o'rnini **bosmaydi**. Faqat JWT yuborilsa
platform-core internal sirti `401` beradi — bu tipik jim nosozlik
sababi.

⚡ JWT **qisqa muddatli** (60 s) va **har so'rovda** yangidan zarb
qilinadi. Klient qurilganda bir marta qo'yilsa, uzoq ishlagan
jarayonda hamma keyingi chaqiruv `401` bo'lardi.

## At-rest shifrlash

Ikki alohida keyring bor va ular **turli ma'lumotni** himoya qiladi:

| Sozlama | Nimani shifrlaydi |
|---|---|
| `PLATFORM_ENCRYPTION_KEYRING` | telefon raqamlari, roziliklar (ovozli kanal) |
| `CHECKPOINT_ENCRYPTION_KEY` | ⚠ suhbat mazmuni — ism, telefon, buyurtma tafsilotlari |

⛔ Ikkinchisi ko'pincha unutiladi: kalitsiz suhbatlar bazada **ochiq
matnda** yotadi va bu faqat startup ogohlantirishida aytiladi.

Keyring shakli:

```json
{"<kalit-id>": "<base64 32 bayt>"}
```

`ACTIVE_KEY_ID` **yangi** yozuvlarga tegishli; eski kalitlar keyring'da
**o'qish uchun** qoladi. Rotatsiyada eski kalitni olib tashlamang —
eski yozuvlar deshifrlanmay qoladi.

## Rotatsiya tartibi

1. Yangi kalitni keyring'ga **qo'shing** (eskisini qoldiring)
2. `ACTIVE_KEY_ID` ni yangisiga o'zgartiring
3. Servisni qayta ishga tushiring
4. Eski kalitni **faqat** barcha yozuvlar qayta shifrlangach olib tashlang

## Sir jurnalga tushmaydi

Barcha servislar sirlarni `<redacted>` bilan yozadi va xato matnlariga
kredensial qiymatini qo'shmaydi. ⚠ Lekin **manzil** ba'zan xatoga
tushishi mumkin — masalan Bitrix webhook'da sir manzilning O'ZIDA
bo'ladi. Shu bois hub xato matnlariga hostni ham qo'shmaydi.
