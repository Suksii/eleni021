"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DayPickerProps } from "react-day-picker";
import { srLatn } from "react-day-picker/locale";
import { cn } from "@/lib/utils/cn";

export type CalendarProps = DayPickerProps;

// Preuzeto iz tehnoplus-new; boje kroz theme tokene.
export default function Calendar({ className, classNames, ...props }: CalendarProps) {
  return (
    <DayPicker
      locale={srLatn}
      weekStartsOn={1}
      showOutsideDays
      className={cn("w-full", className)}
      classNames={{
        months: "relative flex flex-col",
        month: "w-full",
        month_caption: "flex h-9 items-center justify-center",
        caption_label: "font-display inline-flex items-center gap-1 px-2.5 py-1.5 text-base font-medium capitalize",
        nav: "absolute inset-x-0 top-0 flex h-9 items-center justify-between",
        button_previous:
          "inline-flex size-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground disabled:pointer-events-none disabled:opacity-30",
        button_next:
          "inline-flex size-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground disabled:pointer-events-none disabled:opacity-30",
        month_grid: "mt-2 w-full border-collapse",
        weekdays: "flex",
        weekday: "font-display flex-1 pb-2 text-center text-xs italic text-muted",
        week: "flex w-full",
        day: "flex flex-1 items-center justify-center text-sm",
        day_button:
          "flex size-9 items-center justify-center rounded-full font-normal transition-colors hover:bg-surface-2 aria-selected:bg-foreground aria-selected:font-semibold aria-selected:text-background",
        today: "font-semibold text-primary",
        outside: "opacity-40",
        disabled: "pointer-events-none opacity-25",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeft : orientation === "right" ? ChevronRight : ChevronDown;
          return <Icon size={16} aria-hidden="true" />;
        },
      }}
      {...props}
    />
  );
}
