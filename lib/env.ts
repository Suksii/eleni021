function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Nedostaje env varijabla: ${name}`);
  return value;
}

export const env = {
  get databaseUrl() {
    return required("DATABASE_URL");
  },
  get authSecret() {
    return required("AUTH_SECRET");
  },
  appUrl: (process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  ),
};
