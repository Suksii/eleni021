"use client";

import { useRef, useState, useEffect, useCallback } from "react";

export interface UseScrollCarouselOptions {
  gap?: number;
}

export function useScrollCarousel({ gap = 12 }: UseScrollCarouselOptions = {}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [progress, setProgress] = useState(0);
  const [thumbFraction, setThumbFraction] = useState(1);

  const updateButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < maxScroll - 4);
    setTotalPages(Math.max(1, Math.round(el.scrollWidth / el.clientWidth)));
    setCurrentPage(Math.round(el.scrollLeft / el.clientWidth));
    setThumbFraction(
      el.scrollWidth > 0 ? Math.min(1, el.clientWidth / el.scrollWidth) : 1,
    );
    setProgress(maxScroll > 0 ? Math.min(1, Math.max(0, el.scrollLeft / maxScroll)) : 0);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateButtons();
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [updateButtons]);

  const scroll = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const firstCard = el.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard?.offsetWidth ?? 220;
    el.scrollBy({ left: dir * (cardWidth + gap), behavior: "smooth" });
  };

  const scrollToPage = (page: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: page * el.clientWidth, behavior: "smooth" });
  };

  return {
    scrollRef,
    canPrev,
    canNext,
    scroll,
    currentPage,
    totalPages,
    scrollToPage,
    progress,
    thumbFraction,
  };
}
