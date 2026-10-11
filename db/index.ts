import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/lib/env";
import * as schema from "@/db/schema";

// Neon HTTP driver — bez pool-a, svaki upit je jedan HTTP zahtev. Dovoljno za
// CMS + katalog koji je ionako iza `use cache`.
const sql = neon(env.databaseUrl);

export const db = drizzle(sql, { schema });
export type Db = typeof db;
