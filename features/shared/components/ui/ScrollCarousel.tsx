"use client";

import { useState, type ReactNode, type CSSProperties } from "react";
import { useScrollCarousel } from "@/lib/hooks/useScrollCarousel";
import NavButton from "@/features/shared/components/ui/NavButton";
import { useDragScroll } from "@/lib/hooks/useDragScroll";

function DotsIndicator({
  totalPages,
  currentPage,
  onSelect,
  className = "",
}: {
  totalPages: number;
  currentPage: number;
  onSelect: (page: number) => void;
  className?: string;
}) {
  return (
    <div className={`items-center gap-1.5 md:gap-2 ${className}`}>
      {Array.from({ length: totalPages }).map((_, i) => {
        const active = i === currentPage;
        return (
          <button
            key={i}
            type="button"
            aria-label={`Stranica ${i + 1}`}
            aria-current={active}
            onClick={() => onSelect(i)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              active ? "bg-neutral-900" : "bg-neutral-300"
            }`}
          />
        );
      })}
    </div>
  );
}
const MAX_MOBILE_DOTS = 7;

function ProgressDots({
  totalPages,
  progress,
  onSelect,
  className = "",
}: {
  totalPages: number;
  progress: number;
  onSelect: (page: number) => void;
  className?: string;
}) {
  const count = Math.min(totalPages, MAX_MOBILE_DOTS);
  const active = Math.round(progress * (count - 1));
  return (
    <div className={`items-center gap-1.5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => {
        const isActive = i === active;
        return (
          <button
            key={i}
            type="button"
            aria-label={`Pozicija ${i + 1}`}
            aria-current={isActive}
            onClick={() =>
              onSelect(
                count > 1
                  ? Math.round((i / (count - 1)) * (totalPages - 1))
                  : 0,
              )
            }
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              isActive ? "bg-neutral-900" : "bg-neutral-300"
            }`}
          />
        );
      })}
    </div>
  );
}

// Blijeđenje na ivici — signal da traka ide dalje. Isti obrazac kao
// `GalleryThumbs`: maska, ne overlay, pa ne zavisi od boje podloge.
const FADE_PX = 40;

interface ScrollCarouselProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  gap?: number;
  prevLabel?: string;
  nextLabel?: string;
  controls?: "overlay" | "bottom";
  /** Bledi ivicu na strani na kojoj ima još sadržaja. */
  fade?: boolean;
}

export default function ScrollCarousel({
  children,
  className = "",
  style,
  gap = 12,
  prevLabel = "Previous",
  nextLabel = "Next",
  controls = "overlay",
  fade = false,
}: ScrollCarouselProps) {
  const {
    scrollRef,
    canPrev,
    canNext,
    scroll,
    currentPage,
    totalPages,
    scrollToPage,
    progress,
  } = useScrollCarousel({ gap });
  const [hovered, setHovered] = useState(false);
  const { isDragging, isSettling, onMouseDown } = useDragScroll(scrollRef);

  // Bledi samo strana na kojoj još ima sadržaja — na krajevima maska nestaje
  // da se prva/poslednja kartica ne bi bespotrebno gasila.
  const maskImage =
    fade && (canPrev || canNext)
      ? `linear-gradient(to right, ${
          canPrev ? `transparent 0, #000 ${FADE_PX}px` : "#000 0"
        }, ${
          canNext
            ? `#000 calc(100% - ${FADE_PX}px), transparent 100%`
            : "#000 100%"
        })`
      : undefined;

  const track = (
    <div
      ref={scrollRef}
      style={
        {
          gap: `${gap}px`,
          "--carousel-gap": `${gap}px`,
          ...style,
          ...(maskImage && { maskImage, WebkitMaskImage: maskImage }),
          scrollBehavior: isDragging ? "auto" : undefined,
          scrollSnapType: isDragging || isSettling ? "none" : undefined,
        } as React.CSSProperties
      }
      className={`scrollbar-hide flex snap-x snap-mandatory scroll-px-4 overflow-x-auto scroll-smooth px-4 pb-1 sm:scroll-px-6 sm:px-6 md:scroll-px-0 md:px-0 ${isDragging ? "select-none" : ""} ${className}`}
    >
      {children}
    </div>
  );

  if (controls === "bottom") {
    return (
      <div onMouseDown={onMouseDown}>
        <div className="-mx-4 sm:-mx-6 md:mx-0">{track}</div>
        <div className="mt-5 flex items-center justify-center gap-2 md:gap-4">
          <NavButton
            direction="prev"
            aria-label={prevLabel}
            onClick={() => scrollToPage(currentPage - 1)}
            disabled={!canPrev}
            className="shrink-0"
          />
          <DotsIndicator
            totalPages={totalPages}
            currentPage={currentPage}
            onSelect={scrollToPage}
            className="hidden md:flex"
          />
          <ProgressDots
            totalPages={totalPages}
            progress={progress}
            onSelect={scrollToPage}
            className="flex md:hidden"
          />
          <NavButton
            direction="next"
            aria-label={nextLabel}
            onClick={() => scrollToPage(currentPage + 1)}
            disabled={!canNext}
            className="shrink-0"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative -mx-4 sm:-mx-6 md:mx-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={onMouseDown}
    >
      {track}

      {canPrev && (
        <NavButton
          direction="prev"
          aria-label={prevLabel}
          onClick={() => scroll(-1)}
          disabled={!canPrev}
          variant="overlay"
          className={`absolute top-1/2 left-2 z-20 -translate-y-1/2 transition-[opacity,transform] duration-150 ${hovered && canPrev ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0"}`}
        />
      )}

      {canNext && (
        <NavButton
          direction="next"
          aria-label={nextLabel}
          onClick={() => scroll(1)}
          disabled={!canNext}
          variant="overlay"
          className={`absolute top-1/2 right-2 z-20 -translate-y-1/2 transition-[opacity,transform] duration-150 ${hovered && canNext ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0"}`}
        />
      )}
    </div>
  );
}
