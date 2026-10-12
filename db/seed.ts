import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { hashPassword } from "../lib/auth/password";
import * as schema from "./schema";

const db = drizzle(neon(process.env.DATABASE_URL!), { schema });

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

// Prave fotografije sa Instagram profila eleni_021 (public/brand).
const BRAND = {
  cokoladnaTorta: "/brand/eleni-07.jpg",
  kikirikiPoster: "/brand/eleni-02.jpg",
  borovnica: "/brand/kolac-borovnica.jpg",
  kruska: "/brand/kolac-kruska.jpg",
  kruska2: "/brand/kolac-kruska-2.jpg",
  malina: "/brand/kolac-malina.jpg",
  mango: "/brand/kolac-mango.jpg",
  rawBorovnica: "/brand/kolac-raw-borovnica.jpg",
  kikiriki: "/brand/kolac-kikiriki.jpg",
  komadniMix: "/brand/komadni-kolaci-mix.jpg",
  posniSitni: "/brand/posni-sitni-kolaci.jpg",
  praline: "/brand/praline.jpg",
};

const IMG = {
  // Torte
  chocCake: u("1578985545062-69928b1d9587"),
  mousseCake: u("1602351447937-745cb720612f"),
  chocPour: u("1541783245831-57d6fb0926d3"),
  strawberryCake: u("1565958011703-44f9829ba187"),
  strawberryCups: u("1488477181946-6428a0291777"),
  floralCake: u("1562777717-dc6984f65a63"),
  blackberryCake: u("1559620192-032c4bc4674e"),
  weddingCake: u("1535254973040-607b474cb50d"),
  rainbowCake: u("1464349095431-e9a21285b5f3"),
  pinkDripCake: u("1621303837174-89787a7d4729"),
  dripCake: u("1588195538326-c5b1e9f80a1b"),
  brownie: u("1606313564200-e75d5e30476c"),
  pistachioTart: u("1626803775151-61d756612f97"),
  orangeMousse: u("1542826438-bd32f43d626f"),
  layeredSlice: u("1571115177098-24ec42ed204d"),
  // Kolači i sitno
  tartlets: u("1495147466023-ac5c588e2e94"),
  meringueTart: u("1519915028121-7d3463d20b13"),
  cookies: u("1499636136210-6f4ee915583e"),
  tiramisuJars: u("1542124948-dc391252a940"),
  birthdayBoard: u("1558636508-e0db3814bd1d"),
  // Cheesecake
  blueberryCheesecake: u("1533134242443-d4fd215305ad"),
  blueberryCheesecake2: u("1567327613485-fbc7bf196198"),
  raspberryCheesecake: u("1578775887804-699de7086ff9"),
  // Cupcakes
  cupcakesMint: u("1486427944299-d1955d23e34d"),
  cupcakesSprinkles: u("1519869325930-281384150729"),
  cupcakesPink: u("1563729784474-d77dbb933a9e"),
  cupcakes3: u("1599785209707-a456fc1337bb"),
  cupcakesOreo: u("1612203985729-70726954388c"),
  cupcakeRedVelvet: u("1614707267537-b85aaf00c4b7"),
  cupcakeChoc: u("1550617931-e17a7b70dce2"),
  // Makarons
  macarons: u("1569864358642-9d1684040f43"),
  // Pekara
  croissant: u("1555507036-ab1f4038808a"),
  croissants: u("1530610476181-d83430b64dcd"),
  bakery: u("1587241321921-91a834d6d191"),
  kneading: u("1517686469429-8bdb88b9f907"),
  cooking: u("1556910103-1c02745aae4d"),
  // Ketering
  buffet: u("1555244162-803834f70033"),
  brunch: u("1504754524776-8f4f37790ca0"),
};

async function main() {
  const reset = process.argv.includes("--reset");
  const existing = await db.select().from(schema.categories).limit(1);
  if (existing.length && !reset) {
    console.log("Baza već ima podatke — preskačem seed (npm run db:seed -- --reset briše sadržaj).");
    return;
  }
  if (reset) {
    // Briše samo sadržaj sajta; narudžbe, upiti i admin nalozi ostaju.
    await db.delete(schema.galleryImages);
    await db.delete(schema.testimonials);
    await db.delete(schema.products);
    await db.delete(schema.cateringPackages);
    await db.delete(schema.categories);
    await db.delete(schema.settings);
  }

  const cats = await db
    .insert(schema.categories)
    .values([
      { name: "Torte", slug: "torte", description: "Rođendanske, svečane i torte po želji — od klasika do modernih dizajna.", image: BRAND.cokoladnaTorta, sortOrder: 1 },
      { name: "Komadni kolači", slug: "komadni-kolaci", description: "Realistični komadni kolači — mus od belgijske čokolade i voće, u obliku kruške, borovnice ili maline. Pravljeni ručno, za manje i veće količine.", image: BRAND.komadniMix, sortOrder: 2 },
      { name: "Kolači", slug: "kolaci", description: "Sitni kolači, tradicionalni i moderni, za svaku priliku.", image: BRAND.posniSitni, sortOrder: 3 },
      { name: "Cheesecake", slug: "cheesecake", description: "Kremasti cheesecake u više ukusa, pečeni i nepečeni.", image: IMG.blueberryCheesecake, sortOrder: 4 },
      { name: "Cupcakes & muffini", slug: "cupcakes-i-muffini", description: "Mali zalogaji sreće, idealni za proslave i poklone.", image: IMG.cupcakesMint, sortOrder: 5 },
      { name: "Makarons", slug: "makarons", description: "Francuski makarons u pastelnim bojama i bogatim ukusima.", image: IMG.macarons, sortOrder: 6 },
      { name: "Pekarski program", slug: "pekarski-program", description: "Kroasani, brioši i slatka peciva, svako jutro sveža.", image: IMG.croissants, sortOrder: 7 },
    ])
    .returning();

  const c = Object.fromEntries(cats.map((x) => [x.slug, x.id]));

  await db.insert(schema.products).values([
    { categoryId: c.torte, name: "Čokoladna torta sa malinama", slug: "cokoladna-torta-sa-malinama", shortDescription: "Tamna čokolada, sveže maline i lagana ganache krema.", description: "Tri sloja sočnog čokoladnog biskvita, punjena kremom od tamne čokolade i svežim malinama. Prelivena ganache glazurom i dekorisana svežim voćem.\n\nIdealna za rođendane i porodične proslave. Može se izraditi bez glutena na zahtev.", price: 4450, unit: "kom", images: [IMG.chocCake, IMG.mousseCake, IMG.chocPour], servings: "10–12 osoba", allergens: "gluten, jaja, mleko", featured: true, sortOrder: 1 },
    { categoryId: c.torte, name: "Jagoda i vanila", slug: "jagoda-i-vanila", shortDescription: "Klasična vanila krema sa slojevima svežih jagoda.", description: "Lagani vanila biskvit sa mascarpone kremom i svežim jagodama. Dekorisana sezonskim voćem i jestivim cvećem.", price: 4000, unit: "kom", images: [IMG.strawberryCake, IMG.strawberryCups], servings: "8–10 osoba", allergens: "gluten, jaja, mleko", featured: true, sortOrder: 2 },
    { categoryId: c.torte, name: "Svečana torta po želji", slug: "svecana-torta-po-zelji", shortDescription: "Dizajn, ukus i veličina po vašoj ideji.", description: "Torta koju kreiramo zajedno sa vama — od izbora ukusa (čokolada, vanila, lešnik, pistać, voće) do dekoracije. Cena zavisi od veličine i složenosti dizajna; navedena je početna cena po kilogramu.\n\nPošaljite nam inspiraciju kroz formu za torte po želji i javljamo se sa ponudom u roku od 24h.", price: 3300, unit: "kg", images: [IMG.floralCake, IMG.blackberryCake, IMG.weddingCake], servings: "po dogovoru", allergens: "zavisi od izbora", leadTimeDays: 5, featured: true, sortOrder: 3 },
    { categoryId: c.torte, name: "Rođendanska torta Rainbow", slug: "rodjendanska-torta-rainbow", shortDescription: "Šarena torta za najmlađe sa vanila kremom.", description: "Slojevi biskvita u duginim bojama sa lakom vanila kremom. Dekoracija sa posipom i personalizovanom porukom.", price: 4200, unit: "kom", images: [IMG.rainbowCake, IMG.pinkDripCake], servings: "10–12 osoba", allergens: "gluten, jaja, mleko", sortOrder: 4 },
    { categoryId: c.torte, name: "Svadbena torta", slug: "svadbena-torta", shortDescription: "Višespratna torta za najvažniji dan.", description: "Elegantne višespratne svadbene torte sa dekoracijom po želji — sveže cveće, tekstura, zlatni detalji. Konsultacije i degustacija ukusa su uključene u cenu.", price: 3750, unit: "kg", images: [IMG.weddingCake, IMG.floralCake, IMG.dripCake], servings: "po dogovoru", allergens: "zavisi od izbora", leadTimeDays: 14, sortOrder: 5 },
    { categoryId: c.torte, name: "Lešnik i karamela", slug: "ljesnik-i-karamela", shortDescription: "Pečeni lješnici, slana karamela, mlečna čokolada.", description: "Biskvit sa lješnicima, krema od mlečne čokolade i slane karamele, hrskavi sloj od pralinea.", price: 4700, unit: "kom", images: [IMG.dripCake, IMG.brownie], servings: "10–12 osoba", allergens: "gluten, jaja, mleko, orašasti plodovi", sortOrder: 6 },
    { categoryId: c.torte, name: "Pistać i bela čokolada", slug: "pistac-i-bela-cokolada", shortDescription: "Nježna pistać krema sa belom čokoladom.", description: "Biskvit od pistaća sa kremom od bele čokolade i mascarponea. Dekorisana mljevenim pistaćima.", price: 4900, unit: "kom", images: [IMG.pistachioTart, IMG.orangeMousse], servings: "10–12 osoba", allergens: "gluten, jaja, mleko, orašasti plodovi", sortOrder: 7 },
    // Komadni kolači — opisi preuzeti sa Instagram objava; cene su PROCENA (420 din/kom), uskladiti u CMS-u.
    { categoryId: c["komadni-kolaci"], name: "Kolač od borovnice", slug: "kolac-od-borovnice", shortDescription: "Crni mus od belgijske čokolade sa borovnicama i čokoladnim prelivom.", description: "Crni mus od najfinije belgijske crne čokolade sa borovnicama, u spoju sa prelivom od čokolade. Kombinacija voćne svežine i punog čokoladnog ukusa — za sve ljubitelje voćnih i čokoladnih poslastica.", price: 420, unit: "kom", images: [BRAND.borovnica], servings: "1 osoba", allergens: "mleko; ostalo proverite pri naručivanju", featured: true, sortOrder: 1 },
    { categoryId: c["komadni-kolaci"], name: "Kolač od kruške", slug: "kolac-od-kruske", shortDescription: "Nežan, kremast beli mus sa svežim, sočnim kruškama.", description: "Na prvi pogled — prava kruška. Na prvi zalogaj — nežan, kremasti beli mus sa prefinjenim ukusom sveže kruške. Lagana i osvežavajuća poslastica, prijatne slatkoće i nežne teksture, koja osvaja jednostavnošću i savršenim spojem ukusa.", price: 420, unit: "kom", images: [BRAND.kruska, BRAND.kruska2], servings: "1 osoba", allergens: "mleko; ostalo proverite pri naručivanju", featured: true, sortOrder: 2 },
    { categoryId: c["komadni-kolaci"], name: "Kolač od maline", slug: "kolac-od-maline", shortDescription: "Beli mus od belgijske čokolade sa osvežavajućom malinom.", description: "Beli mus od najfinije belgijske čokolade u kombinaciji sa osvežavajućom malinom, koja svojim blago kiselkastim ukusom pruža savršen balans slatkoće i svežine. Lagana, kremasta i voćna poslastica kojoj je teško odoleti.", price: 420, unit: "kom", images: [BRAND.malina], servings: "1 osoba", allergens: "mleko; ostalo proverite pri naručivanju", sortOrder: 3 },
    { categoryId: c["komadni-kolaci"], name: "Mango kolač", slug: "mango-kolac", shortDescription: "Kremast i osvežavajuć, sa raskošnim tropskim ukusom manga.", description: "Nežan, kremast i osvežavajuć, sa raskošnim tropskim ukusom manga koji osvaja već na prvi zalogaj. Savršen spoj lagane teksture, voćne svežine i nežne slatkoće.", price: 420, unit: "kom", images: [BRAND.mango], servings: "1 osoba", allergens: "mleko; ostalo proverite pri naručivanju", sortOrder: 4 },
    { categoryId: c["komadni-kolaci"], name: "Raw borovnica — posno i vegansko", slug: "raw-borovnica", shortDescription: "Podloga od indijskog oraha, badema i kokosa, zaslađena agavom.", description: "Savršen spoj prirodnih sastojaka i prefinjenog ukusa. Nežna, kremasta podloga od indijskog oraha, badema i kokosa, obogaćena kokosovim puterom i bademovim mlekom, uz blagu, prirodnu slatkoću sirupa od agave. Bez jaja i mlečnih proizvoda — pogodno za post i vegansku ishranu.", price: 420, unit: "kom", images: [BRAND.rawBorovnica], servings: "1 osoba", allergens: "orašasti plodovi (indijski orah, badem)", featured: true, sortOrder: 5 },
    { categoryId: c["komadni-kolaci"], name: "Kikiriki kolač", slug: "kikiriki-kolac", shortDescription: "Mlečna belgijska čokolada, kakao puter i kremasti sloj sa kikirikijem.", description: "Mlečna belgijska čokolada, kakao puter i bogat, kremasti sloj sa kikirikijem — spoj tekstura i ukusa kojem je teško odoleti. Ručno pripremljen.", price: 420, unit: "kom", images: [BRAND.kikiriki, BRAND.kikirikiPoster], servings: "1 osoba", allergens: "kikiriki, mleko", sortOrder: 6 },
    { categoryId: c.kolaci, name: "Posni sitni kolači", slug: "posni-sitni-kolaci", shortDescription: "Mali slatki zalogaji bez mlečnih proizvoda i jaja — za slave i proslave.", description: "Mali slatki zalogaji, puni ukusa i pažljivo pripremljeni da ulepšaju svaku trpezu. Pravljeni bez mlečnih proizvoda i jaja — savršen izbor za slave, proslave i sve posebne trenutke.", price: 2600, unit: "kg", images: [BRAND.posniSitni], servings: "cca 40 komada po kg", allergens: "gluten, orašasti plodovi", leadTimeDays: 3, featured: true, sortOrder: 0 },
    { categoryId: c.kolaci, name: "Mix sitnih kolača", slug: "mix-sitnih-kolaca", shortDescription: "Izbor naših najprodavanijih sitnih kolača.", description: "Kilogram raznovrsnih sitnih kolača: bajadere, kuglice od oraha, moskva šnite, ferrero kocke, mini tartovi. Sastav se prilagođava sezoni.", price: 2800, unit: "kg", images: [IMG.tartlets, IMG.meringueTart], servings: "cca 40 komada po kg", allergens: "gluten, jaja, mleko, orašasti plodovi", featured: true, sortOrder: 1 },
    { categoryId: c.kolaci, name: "Baklava sa orasima", slug: "baklava-sa-orasima", shortDescription: "Tradicionalna baklava sa domaćim orasima.", description: "Tanke kore, bogato punjenje od oraha i domaći agdа. Pravi se po receptu koji se u porodici čuva generacijama.", price: 2550, unit: "kg", images: [IMG.layeredSlice], servings: "cca 25 komada po kg", allergens: "gluten, orašasti plodovi", sortOrder: 2 },
    { categoryId: c.kolaci, name: "Domaći keksići", slug: "domaci-keksici", shortDescription: "Hrskavi keksići sa čokoladom i maslacem.", description: "Klasični cookies sa komadićima čokolade, vanila keksi i keksi sa ovsenim pahuljicama. Pakovanje od 12 komada.", price: 1050, unit: "set", images: [IMG.cookies, IMG.birthdayBoard], servings: "12 komada", allergens: "gluten, jaja, mleko", sortOrder: 3 },
    { categoryId: c.kolaci, name: "Cake pops", slug: "cake-pops", shortDescription: "Šarene lizalice od torte, omiljene na dečjim proslavama.", description: "Kuglice od čokoladnog ili vanila biskvita, obložene čokoladom i posipom. Set od 10 komada, boje po želji.", price: 1750, unit: "set", images: [IMG.cupcakesOreo], servings: "10 komada", allergens: "gluten, jaja, mleko", sortOrder: 4 },
    { categoryId: c.cheesecake, name: "Klasični New York cheesecake", slug: "klasicni-new-york-cheesecake", shortDescription: "Bogat, kremast i pečen po originalnoj recepturi.", description: "Podloga od maslac keksa, kremasto punjenje od svežeg sira i preliv po izboru: šumsko voće, karamela ili čokolada.", price: 3500, unit: "kom", images: [IMG.blueberryCheesecake, IMG.raspberryCheesecake], servings: "10–12 osoba", allergens: "gluten, jaja, mleko", sortOrder: 1 },
    { categoryId: c.cheesecake, name: "Cheesecake sa šumskim voćem", slug: "cheesecake-sa-sumskim-vocem", shortDescription: "Nepečeni, lagani cheesecake sa domaćim prelivom.", description: "Lagani cheesecake bez pečenja, sa prelivom od svežeg šumskog voća. Savršeno osveženje za letne dane.", price: 3300, unit: "kom", images: [IMG.blueberryCheesecake2, IMG.blueberryCheesecake], servings: "8–10 osoba", allergens: "gluten, mleko", sortOrder: 2 },
    { categoryId: c["cupcakes-i-muffini"], name: "Cupcakes vanila & čokolada", slug: "cupcakes-vanila-i-cokolada", shortDescription: "Set od 6 cupcakesa sa buttercream kremom.", description: "Tri vanila i tri čokoladna cupcakesa sa svilenkastom buttercream kremom. Dekoracija u bojama po želji.", price: 1650, unit: "set", images: [IMG.cupcakesMint, IMG.cupcakes3], servings: "6 komada", allergens: "gluten, jaja, mleko", sortOrder: 1 },
    { categoryId: c["cupcakes-i-muffini"], name: "Muffini sa borovnicama", slug: "muffini-sa-borovnicama", shortDescription: "Mekani muffini puni svežih borovnica.", description: "Klasični američki muffini sa borovnicama i hrskavom koricom. Set od 6 komada.", price: 1150, unit: "set", images: [IMG.cupcakesSprinkles], servings: "6 komada", allergens: "gluten, jaja, mleko", sortOrder: 2 },
    { categoryId: c.makarons, name: "Makarons kutija 12", slug: "makarons-kutija-12", shortDescription: "12 makaronsa u 6 ukusa u poklon kutiji.", description: "Malina, pistać, slana karamela, vanila, čokolada i limun. Pakovani u elegantnu poklon kutiju.", price: 2100, unit: "set", images: [IMG.macarons], servings: "12 komada", allergens: "jaja, mleko, orašasti plodovi", sortOrder: 1 },
    { categoryId: c["pekarski-program"], name: "Maslac kroasan", slug: "maslac-kroasan", shortDescription: "Lisnat, zlatan i hrskav, kao u Parizu.", description: "Kroasan od pravog maslaca, fermentisan 24h za punu aromu. Dostupan klasičan, sa čokoladom ili bademom.", price: 260, unit: "kom", images: [IMG.croissant, IMG.croissants], servings: "1 komad", allergens: "gluten, mleko, jaja", leadTimeDays: 1, minQuantity: 4, sortOrder: 1 },
  ]);

  await db.insert(schema.cateringPackages).values([
    { name: "Slatki sto — Klasik", slug: "slatki-sto-klasik", description: "Izbor sitnih kolača, mini cheesecake i cupcakesa, uz dekoraciju stola u boji vaše proslave.", pricePerPerson: 750, minPersons: 20, items: ["4 vrste sitnih kolača", "mini cheesecake", "cupcakes", "makarons", "dekoracija slatkog stola"], image: IMG.tartlets, featured: true, sortOrder: 1 },
    { name: "Slatki sto — Premium", slug: "slatki-sto-premium", description: "Sve iz Klasik paketa plus torta po želji, cake pops i personalizovane etikete.", pricePerPerson: 1100, minPersons: 30, items: ["6 vrsta sitnih kolača", "torta po želji", "cake pops", "makarons", "mini tartovi", "personalizovane etikete", "dekoracija i postavka"], image: IMG.buffet, featured: true, sortOrder: 2 },
    { name: "Poslovni doručak", slug: "poslovni-dorucak", description: "Sveža peciva, mini sendviči i kolači za sastanke, seminare i kancelarijske proslave.", pricePerPerson: 950, minPersons: 10, items: ["kroasani i brioši", "mini sendviči", "sitni kolači", "voće", "kafa i sokovi po dogovoru"], image: IMG.brunch, sortOrder: 3 },
    { name: "Dečji rođendan", slug: "decji-rodjendan", description: "Šarena torta, cupcakes i cake pops u temi koju dete voli.", pricePerPerson: 800, minPersons: 10, items: ["tematska torta", "cupcakes u boji teme", "cake pops", "keksići", "dekoracija stola"], image: IMG.rainbowCake, sortOrder: 4 },
  ]);

  await db.insert(schema.galleryImages).values(
    ["/brand/eleni-10.jpg", "/brand/eleni-01.jpg", "/brand/eleni-04.jpg", "/brand/eleni-06.jpg", "/brand/eleni-09.jpg", "/brand/eleni-03.jpg", "/brand/eleni-05.jpg", "/brand/eleni-07.jpg", "/brand/eleni-08.jpg", "/brand/eleni-02.jpg", BRAND.kruska2, BRAND.komadniMix, BRAND.rawBorovnica, BRAND.mango, BRAND.praline, BRAND.posniSitni].map(
      (image, i) => ({ image, sortOrder: i + 1 }),
    ),
  );

  // Utisci se ne seed-uju — izmišljeni utisci ne smeju na živi sajt; unose se u adminu.

  await db.insert(schema.settings).values(
    Object.entries({
      siteName: "Eleni",
      tagline: "Poslastičarnica u Novom Sadu",
      heroEyebrow: "Grčka poslastičarnica, Novi Sad",
      heroTitle: "Torte i kolači sa ukusom Grčke, *ručno* i bez žurbe.",
      heroSubtitle: "Grčki proizvodi, torte, kolači, slatki i slani ketering. Naručite dva dana unapred, preuzmite u poslastičarnici ili vam dostavimo.",
      heroImage: IMG.floralCake,
      heroImageSecondary: IMG.blueberryCheesecake,
      aboutTitle: "Ukusi Grčke na vašoj trpezi",
      aboutQuote: "Torta se ne pravi po receptu, nego po prilici. Zato prvo pitamo za koga je.",
      aboutText: "Eleni je porodična slastičarnica u kojoj svaki recept ima svoju priču. Koristimo pravi maslac, sveže voće i čokoladu koju biramo sa pažnjom.\n\nOd malih rođendanskih torti do svadbenih spratova i slatkih stolova za stotine gostiju — radimo sa istom posvećenošću.",
      aboutImage: IMG.kneading,
      aboutImageSecondary: IMG.bakery,
      cateringTitle: "Slatki sto, poslovni doručak, rođendan",
      cateringText: "Recite nam broj gostiju i povod. Sastavimo ponudu, dovezemo, postavimo i pospremimo.",
      cateringImage: IMG.buffet,
      phone: "063 346 275",
      email: "eleni021ns@gmail.com",
      address: "Novi Sad",
      workingHours: "Pon–Sub 08:00–20:00, Ned 09:00–15:00",
      instagram: "https://www.instagram.com/eleni_021",
      facebook: "",
      orderNotice: "Torte naručujete najmanje 2 dana unapred. Dostava u Novom Sadu je besplatna za narudžbe preko 6.000 din.",
      deliveryFee: "500",
      freeDeliveryFrom: "6000",
      announceText: "",
      announceLink: "",
      cateringFaq: "Koliko unapred treba naručiti ketering? | Za slatke stolove do 30 osoba dovoljno je 5 dana, za veće događaje dve nedelje.\nDa li dostavljate van Novog Sada? | Da, uz dogovor i naknadu po kilometraži.\nMožemo li probati pre naručivanja? | Za svadbe i veće događaje organizujemo degustaciju u poslastičarnici.\nŠta je sa alergijama i posebnim režimima? | Deo ponude može biti bez glutena ili bez laktoze — navedite u upitu.",
      footerText: "Grčka poslastičarnica u Novom Sadu. Torte, kolači i ketering — naručite online ili nas posetite.",
    }).map(([key, value]) => ({ key, value })),
  );

  const [admin] = await db.select().from(schema.adminUsers).limit(1);
  if (!admin) await db.insert(schema.adminUsers).values({
    email: process.env.ADMIN_EMAIL ?? "admin@eleni.me",
    name: "Administrator",
    passwordHash: await hashPassword(process.env.ADMIN_PASSWORD ?? "change-me"),
  });

  console.log("Seed završen.");
  // Dev server (ako radi) drži keš na disku — obavesti ga da su tagovi istekli.
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  await fetch(`${base}/api/dev/revalidate`).then(
    () => console.log("Keš invalidiran."),
    () => console.log("Dev server nije pokrenut — keš će se osvežiti pri startu."),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
