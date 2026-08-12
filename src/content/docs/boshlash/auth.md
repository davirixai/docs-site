---
title: Autentifikatsiya
description: Qaysi xizmat qanday sxema kutadi va odatiy integratsiya uchun nima yetarli.
sidebar:
  order: 4
holat: qisman
holatIzoh: "Bugun uch xil sxema ishlatiladi. Bu kamchilik — ADR-035 birlashtirishni talab qiladi."
---

## Odatiy integratsiya

Ilovangizni Davirix'ga ulash uchun **bittasi yetarli**:

```http
Authorization: Bearer <service-JWT>
```

SDK buni avtomatik qo'yadi — siz faqat kalitni berasiz:

```python
dx = Davirix(api_key=os.environ["DAVIRIX_KEY"])
```

## To'liq manzara

:::caution[Bugun uch xil sxema bor]
Bu **halol qayd etilgan kamchilik**. Barcha xizmatlar bitta sxemaga
o'tishi kerak (ADR-035). Hozircha esa quyidagicha:
:::

| Xizmat | Sarlavha | Sizga kerakmi |
|---|---|---|
| `agent-runtime` (ijro) | `Authorization: Bearer <service-JWT>` | ✅ **ha** |
| `platform-core` | `X-API-Key` + `X-Tenant-Id` | odatda yo'q |
| `knowledge-runtime` · `integration-hub` | `X-Service-Key` + `X-Tenant-Id` | odatda yo'q |

:::note[Boshqa ichki xizmatlar]
Platformaning qolgan komponentlari **ichki tarmoqda** ishlaydi va
tashqaridan chaqirilmaydi. Ular sizning integratsiyangizning bir qismi
emas.

Yagona qo'llab-quvvatlanadigan tashqi kirish nuqtasi — yuqoridagi
jadvalning **birinchi qatori**.
:::

## Tenant

Har so'rov qaysi tashkilotga tegishli ekanini bildirishi shart:

```python
# Klientda bir marta — barcha chaqiruvlarga qo'llanadi
dx = Davirix(api_key=..., tenant_id="bank-uz")

# Yoki har chaqiruvda alohida
dx.run(agent_id=..., tenant_id="bank-uz", input=...)
```

Ikkalasi ham berilmasa SDK **xato beradi** — jim standart qiymat
ishlatmaydi. Sabab: noto'g'ri tenant'ga yozish — ma'lumot chegarasining
buzilishi.

## Kalitni saqlash

| ✅ To'g'ri | ⛔ Noto'g'ri |
|---|---|
| Muhit o'zgaruvchisi | Kodga yozish |
| Secret manager / Vault | Repoga commit qilish |
| CI secret | Log yoki xato matniga chiqarish |

Davirix hech qachon kalitni javobda, logda yoki xato matnida
qaytarmaydi — siz ham qaytarmang.

## Keyingi qadam

- [Python SDK](/integrator/python-sdk/)
- [Xatolar](/integrator/xatolar/) — `unauthorized` va `forbidden` farqi
