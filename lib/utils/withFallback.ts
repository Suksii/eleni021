// Fallback IZVAN `use cache` scope-a: keširana funkcija ne sme da proguta grešku
// (zaključala bi prazan rezultat na ceo TTL), ali pozivalac sme.
export function withFallback<T>(promise: Promise<T>, fallback: T, label: string): Promise<T> {
  return promise.catch((error) => {
    console.error(`[withFallback] ${label} failed`, error);
    return fallback;
  });
}
