const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const ROOT = path.join(process.cwd(), ".next", "cache", "use-cache");

function buildId() {
  try {
    return fs
      .readFileSync(path.join(process.cwd(), ".next", "BUILD_ID"), "utf8")
      .trim();
  } catch {
    return "dev";
  }
}

const DIR = path.join(ROOT, buildId());
const TAGS_FILE = path.join(DIR, "tags.json");

const MAX_AGE_MS = 86400 * 1000;

try {
  fs.mkdirSync(DIR, { recursive: true });

  for (const name of fs.readdirSync(ROOT)) {
    if (name !== path.basename(DIR)) {
      fs.rmSync(path.join(ROOT, name), { recursive: true, force: true });
    }
  }

  const cutoff = Date.now() - MAX_AGE_MS;
  for (const name of fs.readdirSync(DIR)) {
    const file = path.join(DIR, name);
    try {
      if (fs.statSync(file).mtimeMs < cutoff) fs.rmSync(file, { force: true });
    } catch {}
  }
} catch {}

const keyFile = (cacheKey) =>
  path.join(DIR, crypto.createHash("sha256").update(cacheKey).digest("hex"));

/** RAM sloj ispred diska. Ograničen brojem unosa, ne bajtovima — unosi su
 * ujednačeni (jedan odgovor API-ja), a brojanje je jeftinije. */
const HOT_MAX = 500;
const hot = new Map();
function hotSet(k, v) {
  if (hot.has(k)) hot.delete(k);
  hot.set(k, v);
  if (hot.size > HOT_MAX) hot.delete(hot.keys().next().value);
}

const pendingSets = new Map();

/** tag -> timestamp (ms) kad je označen isteklim. Perzistira uz unose. */
let tags = new Map();
try {
  tags = new Map(
    Object.entries(JSON.parse(fs.readFileSync(TAGS_FILE, "utf8"))),
  );
} catch {}

async function persistTags() {
  // tmp + rename kao i kod unosa: pad usred direktnog pisanja ostavlja odsječen
  // JSON, `catch` na čitanju ga proguta, mapa tagova ostane prazna i svi tagovi
  // izgledaju kao da nikad nisu istekli — tj. zastarjeli sadržaj se tiho servira.
  const tmp = `${TAGS_FILE}.${process.pid}.tmp`;
  try {
    await fsp.writeFile(tmp, JSON.stringify(Object.fromEntries(tags)));
    await fsp.rename(tmp, TAGS_FILE);
  } catch {
    try {
      await fsp.unlink(tmp);
    } catch {}
  }
}

function tagsExpired(entryTags, timestamp) {
  return entryTags.some((t) => (tags.get(t) ?? 0) > timestamp);
}

function streamOf(buffer) {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(buffer));
      controller.close();
    },
  });
}

/** Zajednička provjera svježine. Vraća null ako unos više ne valja. */
function resolveEntry(meta, body) {
  const now = Date.now();

  if (meta.expire < 0) return null;

  if (now > meta.timestamp + meta.expire * 1000) return null;
  if (tagsExpired(meta.tags, meta.timestamp)) return null;

  const revalidate =
    now > meta.timestamp + meta.revalidate * 1000 ? -1 : meta.revalidate;

  return {
    value: streamOf(body),
    tags: meta.tags,
    stale: meta.stale,
    timestamp: meta.timestamp,
    expire: meta.expire,
    revalidate,
  };
}

module.exports = {
  async get(cacheKey) {
    const pending = pendingSets.get(cacheKey);
    if (pending) await pending;

    const cached = hot.get(cacheKey);
    if (cached) {
      const entry = resolveEntry(cached.meta, cached.body);
      if (entry) return entry;
      hot.delete(cacheKey);
      return undefined;
    }

    const file = keyFile(cacheKey);
    let meta, body;
    try {
      [meta, body] = await Promise.all([
        fsp.readFile(`${file}.json`, "utf8").then(JSON.parse),
        fsp.readFile(`${file}.bin`),
      ]);
    } catch {
      return undefined;
    }

    const entry = resolveEntry(meta, body);
    if (!entry) return undefined;

    hotSet(cacheKey, { meta, body });
    return entry;
  },

  async set(cacheKey, pendingEntry) {
    let resolvePending = () => {};
    pendingSets.set(
      cacheKey,
      new Promise((resolve) => {
        resolvePending = resolve;
      }),
    );

    try {
      const entry = await pendingEntry;

      if (entry.expire === 0) return;

      const [forCaller, forDisk] = entry.value.tee();
      entry.value = forCaller;

      const chunks = [];
      const reader = forDisk.getReader();
      for (let c; !(c = await reader.read()).done; )
        chunks.push(Buffer.from(c.value));
      const body = Buffer.concat(chunks);

      const meta = {
        tags: entry.tags,
        stale: entry.stale,
        timestamp: entry.timestamp,
        expire: entry.expire,
        revalidate: entry.revalidate,
      };

      hotSet(cacheKey, { meta, body });

      const file = keyFile(cacheKey);
      const tmp = `${file}.${process.pid}.tmp`;
      await fsp.writeFile(`${tmp}.bin`, body);
      await fsp.writeFile(`${tmp}.json`, JSON.stringify(meta));
      await Promise.all([
        fsp.rename(`${tmp}.bin`, `${file}.bin`),
        fsp.rename(`${tmp}.json`, `${file}.json`),
      ]);
    } catch {
      // Neuspjeh keširanja ne smije oboriti zahtjev — sljedeći put promašaj.
    } finally {
      resolvePending();
      pendingSets.delete(cacheKey);
    }
  },

  async refreshTags() {
    // Jedna pm2 instanca — nema eksternog tag servisa sa kojim bi se sinhronizovao.
  },

  async getExpiration(...checked) {
    let max = 0;
    for (const t of checked.flat()) max = Math.max(max, tags.get(t) ?? 0);
    return max;
  },

  async updateTags(...args) {
    const now = Date.now();
    for (const t of args.flat().filter((v) => typeof v === "string")) {
      tags.set(t, now);
    }
    for (const [k, v] of hot) {
      if (tagsExpired(v.meta.tags, v.meta.timestamp)) hot.delete(k);
    }
    await persistTags();
  },
};
