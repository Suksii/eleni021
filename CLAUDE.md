@AGENTS.md

# Eleni — sajt za torte, kolače i ketering (projekt-specifično)

Next.js 16 App Router + Cache Components, React 19, Tailwind 4, Drizzle ORM na
Neon Postgres. Sajt je jednojezičan (srpski, **ekavica** — firma je u Novom Sadu), bez i18n.
Valuta: dinari (`formatPrice` → "2.500 din.", `siteConfig` u `config/site.config.ts`).
UI tekst i sadržaj pišu se ekavicom; `scripts/ekavica.py` + `ekavica-map.json` su jednokratni alat za konverziju.
Detalji arhitekture: `docs/ARCHITECTURE.md`. Pokretanje i env: `README.md`.

- **Struktura**: feature-based — `features/<domen>/{api,components,actions,pages}`.
  `app/` drži samo rute (`(site)` javni sajt, `admin/(panel)` CMS, `admin/prijava`).
  Dijeljene UI komponente u `features/shared/components/ui` (preuzete iz
  `/var/www/html/lubenicashop-new`, generičke — bez brend literala, samo theme tokeni).
- **Baza**: šema u `db/schema.ts`, klijent `db/index.ts` (Neon HTTP driver).
  Izmjena šeme → `npm run db:push`. Seed `npm run db:seed` (`-- --reset` briše
  sadržaj, ne narudžbe/upite/admin naloge). Nema migracija u repou — koristi se push.
- **Keširanje**: `cacheComponents: true` + `use cache` + `cacheTag` (tagovi u
  `lib/cacheTags.ts`, profili `catalog`/`content`/`sitemap` u `next.config.ts`).
  Disk handler `cache-handlers/disk.js` (keš preživi restart). Svaka CMS mutacija
  zove `updateTag(TAGS.x)`. Admin čitanja (`features/admin/api/*`) su bez keša.
  Keširana funkcija ne smije hvatati grešku i vraćati fallback (zaključa prazan rezultat).
  Poslije ručnog seed-a/SQL-a keš NE zna za promjenu — obriši `.next/cache/use-cache`.
- **Dinamika**: `cookies()`/DB bez keša samo iza `<Suspense>`; `new Date()` ne
  smije u prerender (ni u klijentskoj komponenti — vidi `CurrentYear.tsx`).
- **Auth CMS**: `lib/auth/session.ts` (jose JWT u httpOnly cookie-ju, 7 dana),
  lozinke scrypt (`lib/auth/password.ts`). `proxy.ts` optimistički štiti `/admin/*`;
  pravi guard je `getSession()` u admin layoutu, a **svaka server akcija zove
  `requireSession()` prvo**. Upload slika: `app/api/admin/upload/route.ts` → `public/uploads`.
- **Forme**: server actions + `useActionState`; admin forme kroz `AdminForm` (polja
  nekontrolisana, `defaultValue`). Cijene narudžbe se uvijek računaju iz baze, nikad iz klijenta.
- **Korpa**: klijentska, localStorage, `features/cart/CartContext.tsx` (`useSyncExternalStore`).
- **Slike**: `next/image`, `remotePatterns` dozvoljava sve https hostove (Unsplash
  placeholderi za start). Upload-ovane (`/uploads/*`) u adminu idu `unoptimized`.
- **Tekstovi sajta**: iz tabele `settings` (`getSettings()`), ključevi u
  `features/site/settingsFields.ts` — novi tekst koji CMS treba da uređuje ide tu, ne hardkodovan.

Prije commit-a: `npx tsc --noEmit` i `npm run lint` moraju proći čisto.
