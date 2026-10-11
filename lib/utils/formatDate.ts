const LOCALE = "sr-Latn-RS";

const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

// Lokalizovan datum (sr-Latn-RS). Vraća `fallback` za prazne/nevalidne vrednosti.
export function formatDate(
  value: string | number | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = DEFAULT_OPTIONS,
  fallback = "",
): string {
  if (value == null || value === "") return fallback;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime())
    ? fallback
    : d.toLocaleDateString(LOCALE, options);
}
