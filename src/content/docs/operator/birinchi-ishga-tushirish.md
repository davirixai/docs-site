---
title: Birinchi ishga tushirish
description: Toza serverdan tirik stekgacha — qadamlar, birinchi admin va ishlaganini isbotlash.
sidebar:
  order: 5
holat: qisman
holatIzoh: Qadamlar va tekshiruv skripti jonli stendda sinalgan. TLS, domen va teskari proksi qismi hali yozilmagan — u server va domenga bog'liq.
---

## Talablar

| | |
|---|---|
| OS | Ubuntu 22.04+ |
| Docker | Compose v2 bilan |
| RAM | ≥ 8 GB (Qdrant + Postgres + 10 servis) |
| Disk | ≥ 40 GB |
| Tashqi | model provayderi kaliti · SMS/to'lov kredensiallari |

## 1. Sirlarni tayyorlash

```bash
cp env/ai.env.example env/prod.env
chmod 600 env/prod.env
```

Har sirni **generatsiya qiling** — nusxalamang:

```bash
# ≥32 bayt talab qiladiganlar
openssl rand -hex 32     # SERVICE_JWT_SECRET va boshqalar

# at-rest shifrlash kaliti (base64, 32 bayt)
openssl rand -base64 32  # PLATFORM_ENCRYPTION_KEYRING ichiga
```

⚠ To'liq ro'yxat: [Sozlamalar](/operator/sozlamalar/).

## 2. Ko'tarish

```bash
docker compose -f docker-compose.ai.yml --env-file env/prod.env up -d
```

Migratsiya bosqichlari o'zi ketma-ket ishlaydi. Ular tugamaguncha
bog'liq servislar boshlanmaydi.

## 3. Migratsiyalar tugaganini tekshirish

```bash
for s in platform-core-migrate tool-executor-migrate registry-migrate; do
  echo "── $s"; docker compose logs "$s" | tail -3
done
```

⛔ Uchalasi ham tugagan bo'lishi shart. `tool-executor-migrate`
yiqilsa servis baribir ko'tariladi — va Ledger bo'limi **jimgina**
bo'sh qoladi.

## 4. Jurnalni O'QISH

⚠ **Bu qadam o'tkazib yuborilmaydi.** Yetishmagan sozlamalar
startupda **bir marta** aytiladi va keyin jim qoladi.

```bash
docker compose logs --since 10m \
  | grep -iE '"level":"(ERROR|WARN)"|WARNING|Traceback'
```

Har xabar uchun: [Jim nosozliklar](/operator/jim-nosozliklar/).

## 5. Birinchi admin

Bootstrap kaliti bilan tenant va admin yaratiladi. Undan keyin:

⛔ **Bootstrap kalitini olib tashlang.** U tenantdan tashqarida ishlaydi
va faqat birinchi hisobni yaratish uchun.

⚠ Bootstrap kalitini servislarga `PLATFORM_CORE_SERVICE_KEY` sifatida
**bermang**: u o'z tenantiga tegishli va u yerda agent yo'q — ruxsat
sinxroni `200` qaytaradi, lekin bo'sh ro'yxat bilan.

## 6. Ishlaganini ISBOTLASH

Ko'tarilgani — ishlagani emas. Tekshiruv skripti stekni uchidan-uchiga
bosib chiqadi:

```bash
cd deploy/demo/kamera-shop
./tekshir.sh
```

U 27 tekshiruv yurgizadi:

| Bosqich | Nimani isbotlaydi |
|---|---|
| 1 | 12 servis ishlayapti |
| 2 | login ishlaydi · **noto'g'ri parol RAD ETILADI** |
| 3 | 12 sahifa ochiladi |
| 4 | 7 sirt **jonli** ma'lumot beradi (namuna emas) |
| 5 | qidiruv **semantik** — har so'rov kutilgan hujjatni birinchi qaytaradi |
| 6 | idempotentlik: ikki chaqiruv → bitta yozuv |

`--agent` bayrog'i bilan agent zanjiri ham sinaladi (⚠ model puli
sarflanadi).

⚡ Skript agent **javobini dalil deb qabul qilmaydi**: model
«bajarildi» deb yozib hech narsa qilmasligi mumkin — u manbadan qayta
o'qiydi.

## 7. Hali qilinmagan

Bu qadamlar server va domenga bog'liq, shu bois bu yerda yozilmagan:

| Ish | Nega bu yerda yo'q |
|---|---|
| TLS sertifikati | domenga bog'liq |
| Teskari proksi | tanlangan yechimga bog'liq (nginx/caddy/traefik) |
| Vault | ombor turiga bog'liq |
| Monitoring | [Operations Guide](https://github.com/davirixai) da alohida |
