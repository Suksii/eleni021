function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Nedostaje env varijabla: ${name}`);
  return value;
}

const appUrl = (process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

// Pretraživači smeju da indeksiraju sajt samo na pravom domenu. Vercel-ov
// *.vercel.app i localhost su probni — tamo ide noindex (next.config.ts) i
// robots.txt zabranjuje sve (app/robots.ts).
export function isIndexableUrl(url: string): boolean {
  try {
    const { protocol, hostname } = new URL(url);
    if (protocol !== "https:") return false;
    return !(hostname === "localhost" || hostname.endsWith(".vercel.app") || hostname.endsWith(".local"));
  } catch {
    return false;
  }
}

export const env = {
  get databaseUrl() {
    return required("DATABASE_URL");
  },
  get authSecret() {
    return required("AUTH_SECRET");
  },
  appUrl,
  isIndexable: isIndexableUrl(appUrl),
};
