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
produkcijski domen — na `*.vercel.app` i `localhost` sajt šalje `X-Robots-Tag: noindex`
  i `robots.txt` zabranjuje sve; na bilo kom pravom https domenu indeksiranje je uključeno
(vidi `next.config.ts`).

### Vercel

Repo je povezan sa `https://github.com/Suksii/eleni021`. Na Vercel-u:

1. Env varijable (Production + Preview): `DATABASE_URL`, `AUTH_SECRET`,
   `NEXT_PUBLIC_BASE_URL` (URL deploya, bez završne kose crte), `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
2. Storage → **Blob** store povezan sa projektom — daje `BLOB_READ_WRITE_TOKEN`, bez njega
   CMS upload slika na Vercel-u ne radi (fajl-sistem je read-only).
3. Disk keš handler (`cache-handlers/disk.js`) se na Vercel-u automatski isključuje
   (`process.env.VERCEL`), koristi se Vercel Data Cache.

4. `RESEND_API_KEY` (i `EMAIL_FROM` kad je domen verifikovan) — bez toga se emailovi o
   narudžbama i upitima ne šalju, samo se loguju.

CLI: `npx vercel login`, zatim `npx vercel link` i `npx vercel --prod`.

### Email (Resend)

Nova narudžba i novi upit šalju email vlasniku (adresa = `email` u CMS podešavanjima)
i potvrdu kupcu ako je ostavio email (`lib/email/*`, `features/orders/email.ts`,
`features/inquiries/email.ts`). Slanje ide kroz `after()` posle odgovora, pa neuspeh
emaila ne poništava narudžbu. Dok domen nije verifikovan u Resend-u, pošiljalac je
`onboarding@resend.dev` i Resend dozvoljava slanje samo na email vlasnika Resend
naloga — potvrde kupcima tada ne prolaze (greška se loguje). Posle verifikacije domena
postavi `EMAIL_FROM="Eleni <narudzbe@eleni.me>"`.

### Kontakt dugme i analitika

Lebdeće dugme dole desno (`ContactFab`) nudi Poziv / Viber / WhatsApp — brojevi iz CMS
podešavanja (`phone`, `viber`, `whatsapp`; prazno = kanal se ne nudi). Vercel Web Analytics
(`<Analytics />` u root layoutu, bez kolačića) beleži događaje `kontakt` (kanal, mesto),
`narudzba` (iznos) i `upit` (tip); izveštaj je u Vercel panelu projekta.

### Uloge i statistika (samo vlasnik)

`admin_users.role`: `owner` (programer) ili `admin` (klijent). Owner vidi i `/admin/statistika`
(`features/admin/api/stats.ts`): klikovi na kontakt po kanalu i periodu, narudžbe i upiti po
periodu, poslednjih 100 klikova sa vremenom. Klikovi se upisuju u tabelu `events` kroz javnu
akciju `logEvent` (anonimno: kanal, putanja, vreme) iz `lib/track.ts` / `TrackLink`.
Nalozi iz `.env`: `ADMIN_*` = klijent (admin), `OWNER_*` = programer (owner); seed ih kreira
ako ne postoje. Uloga se proverava iz baze pri svakom zahtevu (sesija može biti stara).

### Prijava u admin

Posle 5 neuspešnih pokušaja (po IP-u ili po emailu) u 15 minuta prijava je blokirana
15 minuta (`lib/auth/loginAttempts.ts`, tabela `login_attempts`).
