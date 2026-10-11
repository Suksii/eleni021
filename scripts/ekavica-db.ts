import "dotenv/config";
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

// Jednokratno: ijekavica → ekavica nad tekstualnim sadržajem u bazi.
const MAP: [string, string][] = JSON.parse(readFileSync("scripts/ekavica-map.json", "utf8"));
const RULES = MAP.filter(([a, b]) => a !== b).map(([a, b]) => [new RegExp(a, "gi"), b] as const);

function convert(text: string): string {
  let out = text;
  for (const [rx, dst] of RULES) {
    out = out.replace(rx, (s) => {
      if (s.length > 1 && s === s.toUpperCase()) return dst.toUpperCase();
      if (s[0] === s[0].toUpperCase()) return dst[0].toUpperCase() + dst.slice(1);
      return dst;
    });
  }
  return out
    .replace(/Novi Sadi\b/g, "Novom Sadu")
    .replace(/Novi Sade\b/g, "Novog Sada")
    .replace(/Novi Sada\b/g, "Novi Sad");
}

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  const tables: Record<string, string[]> = {
    settings: ["value"],
    categories: ["name", "description"],
    products: ["name", "short_description", "description", "servings", "allergens"],
    catering_packages: ["name", "description"],
    testimonials: ["author", "occasion", "text"],
    gallery_images: ["caption"],
  };
  let changed = 0;
  for (const [table, cols] of Object.entries(tables)) {
    const key = table === "settings" ? "key" : "id";
    const rows = await sql.query(`select ${key} as k, ${cols.join(", ")} from ${table}`);
    for (const row of rows) {
      const sets: string[] = []; const vals: unknown[] = [];
      for (const c of cols) {
        const v = row[c];
        if (typeof v === "string") { const n = convert(v); if (n !== v) { sets.push(`${c} = $${vals.length + 1}`); vals.push(n); } }
      }
      if (sets.length) {
        vals.push(row.k);
        await sql.query(`update ${table} set ${sets.join(", ")} where ${key} = $${vals.length}`, vals);
        changed++;
      }
    }
  }
  // items (jsonb string[]) u paketima
  const pk = await sql.query("select id, items from catering_packages");
  for (const p of pk) {
    const items = (p.items as string[]).map(convert);
    if (JSON.stringify(items) !== JSON.stringify(p.items)) {
      await sql.query("update catering_packages set items = $1 where id = $2", [JSON.stringify(items), p.id]);
      changed++;
    }
  }
  console.log("izmenjeno redova:", changed);
}
main();
