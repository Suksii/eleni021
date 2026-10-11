# Eleni — torte, kolači i ketering

Sajt za prezentaciju i online naručivanje torti i kolača, sa keteringom i CMS-om.
Next.js 16 (Cache Components) + Tailwind 4 + Drizzle ORM + Neon Postgres.

## Pokretanje

```bash
cp .env.example .env      # popuni DATABASE_URL, AUTH_SECRET, ADMIN_*
npm install
npm run db:push           # kreira tabele
npm run db:seed           # početni sadržaj + admin nalog iz ADMIN_EMAIL/ADMIN_PASSWORD
npm run dev
```

- Sajt: http://localhost:3000
- CMS: http://localhost:3000/admin (prijava sa `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

## CMS

Proizvodi, kategorije, ketering paketi, galerija, utisci kupaca, podešavanja sajta
(hero, o nama, kontakt, dostava), narudžbe (status + interna bilješka) i upiti
(ketering, kontakt, torta po želji). Slike: URL ili upload u `public/uploads`.

## Dokumentacija

- `docs/ARCHITECTURE.md` — struktura, keš, auth, korpa
- `CLAUDE.md` — pravila projekta za rad sa AI agentima; agenti u `.claude/agents/`

## Produkcija

`npm run build && npm start` (Node runtime). Postavi `NEXT_PUBLIC_BASE_URL` na
produkcijski domen — dok nije `https://eleni.me`, sajt šalje `X-Robots-Tag: noindex`
(vidi `next.config.ts`).

### Vercel

Repo je povezan sa `https://github.com/Suksii/eleni021`. Na Vercel-u:

1. Env varijable (Production + Preview): `DATABASE_URL`, `AUTH_SECRET`,
   `NEXT_PUBLIC_BASE_URL` (URL deploya, bez završne kose crte), `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
2. Storage → **Blob** store povezan sa projektom — daje `BLOB_READ_WRITE_TOKEN`, bez njega
   CMS upload slika na Vercel-u ne radi (fajl-sistem je read-only).
3. Disk keš handler (`cache-handlers/disk.js`) se na Vercel-u automatski isključuje
   (`process.env.VERCEL`), koristi se Vercel Data Cache.

CLI: `npx vercel login`, zatim `npx vercel link` i `npx vercel --prod`.
