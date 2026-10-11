// Jedini izvor istine za breakpointove — prati Tailwind default skalu. Koristi se
// za media-query helpere u JS-u (useMediaQuery), da se px granice ne kucaju ručno
// i da ostanu sinhronizovane sa Tailwind klasama (sm:/md:/lg:…).
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// `(min-width: …)` — poklapa se na bp i naviše (kao Tailwind `lg:` prefiks).
export const minWidth = (bp: Breakpoint): string =>
  `(min-width: ${BREAKPOINTS[bp]}px)`;

// `(max-width: …)` — poklapa se ispod bp (kao Tailwind `max-lg:`). -0.02px da se
// ne preklopi sa min-width na tačnoj granici.
export const maxWidth = (bp: Breakpoint): string =>
  `(max-width: ${BREAKPOINTS[bp] - 0.02}px)`;
