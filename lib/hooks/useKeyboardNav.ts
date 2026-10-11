import { useEffect, useRef } from "react";

type KeyMap = Partial<Record<string, () => void>>;

export function useKeyboardNav(
  keyMap: KeyMap,
  options: {
    target?: React.RefObject<HTMLElement | null>;
    enabled?: boolean;
  } = {},
) {
  const { target, enabled = true } = options;
  const keyMapRef = useRef(keyMap);
  useEffect(() => {
    keyMapRef.current = keyMap;
  });

  useEffect(() => {
    if (!enabled) return;
    const el = (target?.current ?? window) as EventTarget;
    const onKey = (e: KeyboardEvent) => {
      const handler = keyMapRef.current[e.key];
      if (handler) handler();
    };
    el.addEventListener("keydown", onKey as EventListener);
    return () => el.removeEventListener("keydown", onKey as EventListener);
  }, [enabled, target]);
}
