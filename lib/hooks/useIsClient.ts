import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

// false tokom SSR/hidracije, true na klijentu — bez setState-a u effectu.
export function useIsClient(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
