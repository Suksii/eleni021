const srPluralRules = new Intl.PluralRules("sr");

export function pluralSr(
  count: number,
  [one, few, other]: [string, string, string],
): string {
  const category = srPluralRules.select(count);
  return category === "one" ? one : category === "few" ? few : other;
}
