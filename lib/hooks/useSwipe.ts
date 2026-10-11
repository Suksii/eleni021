import { useRef, type TouchEvent } from "react";

interface UseSwipeOptions {
  threshold?: number;
  maxDrift?: number;
}

// Horizontalni swipe na dodir — vertikalni pomak preko `maxDrift` se ignoriše
// (korisnik skroluje stranicu, ne lista slike).
export function useSwipe(
  onLeft: () => void,
  onRight: () => void,
  { threshold = 40, maxDrift = 60 }: UseSwipeOptions = {},
) {
  const start = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: TouchEvent) => {
    start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (!start.current) return;
    const dx = e.changedTouches[0].clientX - start.current.x;
    const dy = Math.abs(e.changedTouches[0].clientY - start.current.y);
    if (Math.abs(dx) > threshold && dy < maxDrift) {
      if (dx < 0) onLeft();
      else onRight();
    }
    start.current = null;
  };

  return { onTouchStart, onTouchEnd };
}
