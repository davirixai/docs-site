# docs.davirix.com

Dasturchi hujjatlari — Astro + Starlight, statik chiqish.

## Ishga tushirish

```bash
nvm use            # .nvmrc → Node 22
npm ci
npm run dev        # http://localhost:4321
```

> ⚠ **Node 22 majburiy.** Astro 6+ undan pastda umuman ishga tushmaydi
> (`engines.node: >=22.12.0`). `nvm` yo'q bo'lsa:
> `curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash`

## Buyruqlar

| Buyruq | Nima qiladi |
|---|---|
| `npm run dev` | Lokal server |
| `npm run build` | `dist/` ga statik qurish |
| `npm run preview` | Qurilganini ko'rish |
| `npm run lint:status` | **Halollik darvozasi** — har sahifada holat belgisi |
| `npm run lint:links` | Ichki havolalar (qurishdan **keyin**) |

## Eng muhim qoida — `holat`

Har sahifaning frontmatter'ida **majburiy** maydon:

```yaml
---
title: Python SDK
holat: ishlaydi
---
```

| Qiymat | Ma'nosi |
|---|---|
| `ishlaydi` | Bugun jonli tizimda ishlaydi |
| `qisman` | Ishlaydi, **lekin** muhim cheklov bor — `holatIzoh` **majburiy** |
| `hali-yoq` | Kontrakt/dizayn tayyor, ijro yo'q — `holatIzoh` **majburiy** |
| `rejada` | Qaror qabul qilingan, boshlanmagan |

```yaml
holat: qisman
holatIzoh: "SDK ishlaydi. Tasdiq zanjiri hozir tuzatilmoqda."
```

⚠ **Nega majburiy:** ishlamaydigan narsani ishlaydi deb yozish
integratsiyani soatlarga uzaytiradi. `npm run lint:status` buni CI'da
majburlaydi — belgisiz sahifa bilan build **o'tmaydi**.

Belgi sahifa **sarlavhasi ostida** ko'rinadi (`src/components/PageTitle.astro`) —
pastda emas, chunki dasturchi qidiruvdan kelib kod blokini nusxalaydi.

## Tuzilma

```
src/
├── content/docs/
│   ├── index.mdx            bosh sahifa
│   ├── boshlash/            umumiy kirish — har kim o'qiydi
│   ├── integrator/          "ilovamdan AI'ni chaqiraman"
│   ├── konnektor/           "o'z tizimimni ulayman"
│   ├── paket/               "vertikalni qadoqlayman"
│   └── malumotnoma/         jadvallar va cheklovlar
├── components/PageTitle.astro   holat belgisi
├── styles/davirix.css
└── content.config.ts        `holat` sxemasi
```

Sidebar **qo'lda** yozilgan (`astro.config.mjs`) — avtomatik tartib
alfavit bo'yicha chiqib, o'qish ketma-ketligini buzardi.

## Til

O'zbek — `root` locale (prefikssiz). Ingliz — `/en/`.

Tarjima qilinmagan sahifa uchun Starlight **o'zbek** versiyasini
ko'rsatadi va ogohlantiradi. Ya'ni ingliz tarjimasini bosqichma-bosqich
qo'shish mumkin, sayt **buzilmaydi**.

## Yangi sahifa qo'shish

1. `src/content/docs/<bo'lim>/<nom>.md` — MDX komponenti kerak bo'lsa `.mdx`
2. Frontmatter'ga `title` · `description` · **`holat`**
3. `astro.config.mjs` sidebar'iga `{ slug: "<bo'lim>/<nom>" }`
4. `npm run lint:status && npm run build && npm run lint:links`
