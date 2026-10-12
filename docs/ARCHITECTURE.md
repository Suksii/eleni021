# Arhitektura — Eleni

## Stack

- **Next.js 16** (App Router, Turbopack, `cacheComponents: true`), React 19, TypeScript.
- **Tailwind 4** — tema u `app/globals.css` (`@theme` tokeni: krem podloga, espresso
  tekst, malina akcent `--color-primary`, zlatna `--color-accent`). Fontovi `Fraunces`
  (display) i `Manrope` (body) kroz `next/font`.
- **Drizzle ORM** + **Neon Postgres** (HTTP driver `@neondatabase/serverless`).
- **Zod 4** za validaciju server akcija, **jose** za JWT sesiju, **sonner** za toast,
  **framer-motion** za Drawer/Reveal/lightbox, **lucide-react** ikone.

## Folderi

```
app/
  layout.tsx            root (fontovi, Toaster, metadata)
  (site)/               javni sajt — layout sa Header/Footer/CartDrawer
    page.tsx            naslovna
    proizvodi/          lista + CategoryChips
    kategorija/[slug]/  proizvodi po kategoriji (generateStaticParams)
    proizvod/[slug]/    detalj proizvoda (galerija, add to cart, slični)
    ketering/           paketi + forma upita (?paket=ID)
    galerija/           masonry + lightbox
    o-nama/, kontakt/   (?tema=torta → upit "torta po želji")
    narudzba/           checkout (klijentska korpa → server akcija)
    narudzba/[code]/    potvrda (dinamično, iza Suspense)
    korpa/              redirect → /narudzba
  admin/prijava/        login (van panela, proxy pušta)
  admin/(panel)/        CMS — layout sa auth gate-om (Suspense + getSession)
    page.tsx            dashboard
    proizvodi, kategorije, ketering, narudzbe, upiti, galerija, utisci, podesavanja
  api/admin/upload/     POST upload slike (samo prijavljeni)
  robots.ts, sitemap.ts, not-found.tsx
features/
  <domen>/api/          čitanja (javna: `use cache` + cacheTag; admin: bez keša)
  <domen>/actions.ts    server akcije (javne forme)
  <domen>/components/   UI tog domena
  admin/actions/*       CMS mutacije (requireSession + Zod + updateTag)
  admin/components/     AdminForm, ImagePicker, DeleteButton, Table, fields…
  shared/components/ui  Button, Input, Textarea, Select, Drawer, Skeleton, Price…
  shared/components/layout  Header, MenuDrawer, Footer, Logo
  site/settingsFields.ts    definicija CMS podešavanja (grupe/polja)
db/  schema.ts, index.ts, seed.ts
lib/ auth/, cacheTags.ts, env.ts, utils/, hooks/, motion/
cache-handlers/disk.js  perzistentni use-cache handler
proxy.ts                optimistički guard /admin/*
```

## Data sloj i keš

Javna čitanja su `async` funkcije sa `"use cache"`, `cacheLife("catalog"|"content"|"sitemap")`
i `cacheTag(TAGS.x)`. Cache Components prerenderuju statičku ljusku iz njih; disk
handler čuva unose između restarta (`.next/cache/use-cache/<buildId>`).

Mutacije u CMS-u zovu `updateTag(TAGS.x)` (read-your-own-writes: sljedeći zahtjev
čeka svjež podatak). Tagovi: `categories`, `products`, `catering`, `gallery`,
`testimonials`, `settings`. Kategorija invalidira i `products` (join u listi).

Pravila:
- U `use cache` scope-u nema `cookies()`/`headers()` i nema `try/catch` sa fallback-om.
- Nekeširana čitanja (admin, narudžba po kodu) i `cookies()` samo iza `<Suspense>`.
- `new Date()` u prerenderu ruši build — u klijentu kroz `useSyncExternalStore`
  (`CurrentYear`), na serveru samo u akcijama/route handlerima.

## Auth (CMS)

- `admin_users` (email, scrypt hash). `login` akcija → `createSession` → JWT (HS256,
  `AUTH_SECRET`) u `admin_session` httpOnly cookie, 7 dana.
- `proxy.ts` redirektuje `/admin/*` bez cookie-ja na `/admin/prijava?next=…`;
  pravi guard je `getSession()` u `app/admin/(panel)/layout.tsx`.
- **Svaka admin server akcija** i upload ruta zovu `requireSession()`/`getSession()`.
- Uloge: `admin_users.role` = `owner` | `admin`; u JWT-u. `requireOwner()` za vlasničke stvari;
  `/admin/statistika` i link u navigaciji samo za owner-a (klijent ne vidi).
- Ograničenje prijave: `lib/auth/loginAttempts.ts` + tabela `login_attempts` — 5 neuspešnih
  pokušaja (po IP-u ili emailu) u 15 min → blok 15 min. U bazi jer je Vercel serverless.

## Email (Resend)

`lib/email/send.ts` (jedan POST na Resend API, bez SDK-a; bez `RESEND_API_KEY` samo log),
`lib/email/layout.ts` (HTML omotač, inline stilovi). `features/orders/email.ts` i
`features/inquiries/email.ts` sastavljaju poruke: obaveštenje vlasniku (`settings.email`)
i potvrdu kupcu ako je ostavio email. Pozivaju se iz akcija kroz `after()` — posle
odgovora, neuspeh ne poništava upis u bazu.

## Korpa i narudžba

Korpa je klijentska (localStorage, `features/cart/CartContext.tsx`, `useSyncExternalStore`
da server i klijent renderuju isti HTML). Checkout šalje `items` kao JSON
`{productId, quantity}` — server akcija `placeOrder` čita cijene i rokove iz baze,
validira datum (≥ najduži `leadTimeDays`), računa dostavu iz `settings`
(`deliveryFee`, `freeDeliveryFrom`), upisuje narudžbu sa kodom `EL-YYMM-NNNN`
i redirektuje na `/narudzba/[code]` (koji prazni korpu).

## Admin forme

`AdminForm` (klijent) drži `useActionState` i toast; polja dolaze kao server-renderovani
children sa `defaultValue`. Akcije su `save<Entitet>(id | null, prev, formData)`
bind-ovane u server komponenti forme. Slike kroz `ImagePicker` (URL ili upload) →
hidden JSON polje → `jsonArray()` u akciji.

## Slike

`next/image` sa `remotePatterns` za sve https hostove (placeholderi sa Unsplash-a).
Upload ide u `public/uploads` (gitignore). U produkciji razmisliti o S3/Neon storage-u
i CDN-u, pa suziti `remotePatterns`.

## Skripte

| Komanda | Šta radi |
| --- | --- |
| `npm run dev` | dev server |
| `npm run build && npm start` | produkcija (Node runtime, potreban zbog disk keša) |
| `npm run db:push` | primijeni `db/schema.ts` na bazu |
| `npm run db:seed` | početni podaci (idempotentno); `-- --reset` briše sadržaj |
| `npm run db:studio` | Drizzle Studio |
| `npm run typecheck` / `npm run lint` | obavezno prije commit-a |
