// Pretvara broj kako ga vlasnik upiše ("063 346 275", "+381 63 346 275",
// "0038163346275") u međunarodni oblik bez plusa ("38163346275") —
// to traže wa.me i viber:// linkovi. Podrazumevana država je Srbija (381).
export function toInternational(raw: string, country = "381"): string {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  else if (d.startsWith("0")) d = country + d.slice(1);
  return d;
}

export function telHref(raw: string): string {
  return `tel:+${toInternational(raw)}`;
}

export function whatsappHref(raw: string, text?: string): string {
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${toInternational(raw)}${q}`;
}

export function viberHref(raw: string): string {
  return `viber://chat?number=%2B${toInternational(raw)}`;
}
