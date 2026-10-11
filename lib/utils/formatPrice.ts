import { siteConfig } from "@/config/site.config";

// Dinari: bez decimala kad su cele (2.500 din.), sa decimalama samo ako postoje.
export function formatPrice(amount: number, locale: string = siteConfig.locale): string {
  const number = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
  return `${number} ${siteConfig.currencySuffix}`;
}
