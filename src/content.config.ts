import { defineCollection, z } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

// ⚠ `holat` — bu hujjatlarning ENG MUHIM maydoni va u MAJBURIY emas,
// lekin bo'lmasa `lint:status` skripti yiqiladi (CI darvozasi).
//
// Sabab: platformada mexanizm bor, lekin mahsulot hali to'liq emas.
// Ishlamaydigan narsani ishlaydi deb yozish — integratsiyani soatlarga
// uzaytiradi va ishonchni buzadi. Har sahifa O'ZI haqida rost gapiradi:
//
//   ishlaydi  — bugun jonli tizimda ishlaydi, isbot bor
//   qisman    — ishlaydi, LEKIN muhim cheklov bor (izoh MAJBURIY)
//   hali-yoq  — kontrakt/dizayn tayyor, ijro yo'q
//   rejada    — qaror qabul qilingan, hali boshlanmagan
//
// `qisman` va `hali-yoq` uchun `holatIzoh` majburiy: «qisman» so'zining
// o'zi hech narsa aytmaydi — dasturchi NIMA ishlamasligini bilishi kerak.
export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        holat: z.enum(["ishlaydi", "qisman", "hali-yoq", "rejada"]).optional(),
        holatIzoh: z.string().max(200).optional(),
      }),
    }),
  }),
};
