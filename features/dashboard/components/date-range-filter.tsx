"use client";

import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { DateRange as DayPickerRange } from "react-day-picker";
import { es } from "react-day-picker/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useFilters } from "@/features/dashboard/hooks/use-filters";
import { resolveDateRange } from "@/features/dashboard/lib/search-params";
import type { DateRange } from "@/features/dashboard/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { dt } from "@/lib/date";
import { formatDateRange } from "@/utils/date";

// Presets end today at most: future dates can't be picked.
const presets = [
  { label: "Este mes", range: (today: string) => ({ from: dt.startOfMonth(today), to: today }) },
  {
    label: "Mes pasado",
    range: (today: string) => {
      const lastMonth = dt.subMonths(today, 1);
      return { from: dt.startOfMonth(lastMonth), to: dt.endOfMonth(lastMonth) };
    },
  },
  { label: "Este año", range: (today: string) => ({ from: dt.startOfYear(today), to: today }) },
] satisfies { label: string; range: (today: string) => DateRange }[];

export function DateRangeFilter() {
  const [filters, setFilters] = useFilters({ history: "push" });
  const range = resolveDateRange(filters);
  const isMobile = useIsMobile();
  const [today] = useState(() => dt.today());
  const [open, setOpen] = useState(false);
  // In-progress selection; the URL only changes once the range is complete.
  const [draft, setDraft] = useState<DayPickerRange>();

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen)
      setDraft(range ? { from: dt.toDate(range.from), to: dt.toDate(range.to) } : undefined);
    setOpen(nextOpen);
  }

  function apply(next: DateRange | null) {
    setFilters(next);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger render={<Button variant="outline" className="w-full sm:w-fit sm:self-end" />}>
        <CalendarIcon data-icon="inline-start" />
        {range ? formatDateRange(range) : "Todo el historial"}
      </PopoverTrigger>
      <PopoverContent className="items-center md:w-auto" align="end">
        <Calendar
          mode="range"
          locale={es}
          // The first click only sets `from`; without it, it selects a full one-day range.
          resetOnSelect
          selected={draft}
          defaultMonth={draft?.from}
          endMonth={dt.toDate(today)}
          disabled={{ after: dt.toDate(today) }}
          numberOfMonths={isMobile ? 1 : 2}
          onSelect={(selected) => {
            setDraft(selected);
            if (selected?.from && selected.to) {
              apply({ from: dt.fromDate(selected.from), to: dt.fromDate(selected.to) });
            }
          }}
        />
        <Separator />
        <div className="flex flex-wrap gap-3">
          {presets.map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => apply(preset.range(today))}>
              {preset.label}
            </Button>
          ))}
          <Button variant="ghost" size="sm" className="flex-1" onClick={() => apply(null)}>
            Todo el historial
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
