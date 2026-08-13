---
title: Zaxira va tiklash
description: Uch baza, besh hajm — nimani saqlash shart, nimani saqlamasa ham bo'ladi va tiklash tartibi.
sidebar:
  order: 7
holat: qisman
holatIzoh: Ro'yxat va buyruqlar jonli stekdan o'lchangan. Avtomatlashtirish (cron, saqlash muddati, tashqi omborga yuborish) hali yozilmagan.
---

## Nima saqlanadi

⛔ **Uchta baza** — ular alohida va uchalasi ham kerak:

| Baza | Ichida |
|---|---|
| `davirix_ai` | tenantlar · foydalanuvchilar · agentlar · **Operation Ledger** · sarf |
| `davirix_hub` | konnektor instanslari · grantlar · idempotentlik oynasi |
| `davirix_registry` | model profillari · endpointlar · provayderlar |

**Besh hajm:**

| Hajm | Ichida | Yo'qolsa |
|---|---|---|
| `ai-pgdata` | uchala baza | ⛔ hammasi yo'qoladi |
| `qdrant-data` | bilim indeksi va xotira | ⚠ **qayta indekslash mumkin**, lekin qimmat (embedding puli) |
| `tool-audit` | audit jurnali (JSONL) | ⛔ audit izi yo'qoladi — tiklab bo'lmaydi |
| `ai-redisdata` | idempotentlik keshi | ✅ yo'qolsa bo'ladi — qayta quriladi |
| `kamera-data` | demo ilova SQLite | demo bo'lsa ahamiyatsiz |

## Bazalar

```bash
docker compose exec -T ai-postgres \
  pg_dump -U <user> -Fc davirix_ai > davirix_ai_$(date +%F).dump
```

Uchala baza uchun takrorlang. `-Fc` — siqilgan format, `pg_restore`
bilan tiklanadi.

⚠ Bitta `pg_dumpall` yetarli emas deb o'ylamang — u ishlaydi, lekin
tiklashda uchala bazani birga tiklaydi va bittasini alohida qaytarish
imkonini bermaydi.

## Audit jurnali

```bash
docker run --rm -v <project>_tool-audit:/a -v "$PWD:/out" alpine \
  tar czf /out/tool-audit_$(date +%F).tar.gz -C /a .
```

⛔ Bu **eng muhim** zaxira: audit izi tiklanmaydi. Bazani qayta qurish
mumkin, audit jurnalini esa yo'q.

## Qdrant

```bash
docker run --rm -v <project>_qdrant-data:/q -v "$PWD:/out" alpine \
  tar czf /out/qdrant_$(date +%F).tar.gz -C /q .
```

⚠ Qdrant ishlab turganda nusxa olish **mos kelmagan holatga** olib
kelishi mumkin. To'g'ri yo'l — Qdrant snapshot API'si yoki servis
to'xtatilgan holda nusxa olish.

⚡ Yo'qolsa halokat emas: bilim hujjatlari manbadan qayta indekslanadi.
Lekin bu **embedding puli** sarflaydi.

## Tiklash tartibi

⛔ Tartib muhim — teskarisi ishlamaydi:

1. Stekni **to'xtating**
2. Hajmlarni tiklang
3. Bazalarni `pg_restore` bilan tiklang
4. ⚠ Migratsiyalarni **qayta yurgizing** — zaxira eski sxemada bo'lishi mumkin
5. Stekni ko'taring
6. `./tekshir.sh` bilan isbotlang

## Nimani zaxiradan TIKLAB BO'LMAYDI

| | Nega |
|---|---|
| Audit jurnali oralig'i | u faqat oldinga yoziladi |
| Yo'qolgan sarf hisobotlari | ular hodisa sifatida bir marta yuboriladi |
| Tenant kredensiallari | ⛔ ular vault'da, bu zaxirada YO'Q — vault alohida zaxiralanadi |

## Hali yozilmagan

Cron jadvali, saqlash muddati (retention) va tashqi omborga yuborish —
ular server siyosatiga bog'liq va bu yerda taxmin qilinmaydi.
