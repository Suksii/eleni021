import { useState, useRef, useCallback, type RefObject } from "react";

function smoothSnapToNearest(el: HTMLElement, onDone: () => void) {
  const containerLeft = el.getBoundingClientRect().left;
  let nearest: Element | null = null;
  let minDist = Infinity;

  for (const child of el.children) {
    const dist = Math.abs(child.getBoundingClientRect().left - containerLeft);
    if (dist < minDist) {
      minDist = dist;
      nearest = child;
    }
  }

  if (nearest && minDist > 1) {
    (nearest as HTMLElement).scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }

  if ("onscrollend" in el) {
    el.addEventListener("scrollend", onDone, { once: true });
  } else {
    setTimeout(onDone, 400);
  }
}

export function useDragScroll(scrollRef: RefObject<HTMLElement | null>) {
  const [isDragging, setIsDragging] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const el = scrollRef.current;
      if (!el) return;

      setIsDragging(true);
      startX.current = e.clientX;
      startScrollLeft.current = el.scrollLeft;
      let moved = false;

      const onMove = (ev: MouseEvent) => {
        const dx = ev.clientX - startX.current;
        if (Math.abs(dx) > 5) moved = true;
        el.scrollLeft = startScrollLeft.current - dx;
      };

      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        setIsDragging(false);

        if (moved) {
          setIsSettling(true);
          smoothSnapToNearest(el, () => setIsSettling(false));

          window.addEventListener(
            "click",
            (ev) => {
              ev.preventDefault();
              ev.stopPropagation();
            },
            { once: true, capture: true },
          );
        }
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [scrollRef],
  );

  return { isDragging, isSettling, onMouseDown };
}
