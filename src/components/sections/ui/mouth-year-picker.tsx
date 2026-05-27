"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MonthYearPickerProps {
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  months: string[];
  years: string[];
  onStartMonthChange: (val: string) => void;
  onStartYearChange: (val: string) => void;
  onEndMonthChange: (val: string) => void;
  onEndYearChange: (val: string) => void;
  t: (key: string) => string;
  showPresent?: boolean;
}

export function MonthYearPicker({
  startMonth,
  startYear,
  endMonth,
  endYear,
  months,
  years,
  onStartMonthChange,
  onStartYearChange,
  onEndMonthChange,
  onEndYearChange,
  t,
  showPresent = false,
}: MonthYearPickerProps) {
  return (
    <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end sm:gap-2">
      <div className="flex w-full flex-col gap-1.5 sm:w-auto">
        <span className="text-muted-foreground pl-1 text-[10px] font-semibold uppercase">
          {t("sections.education.start")}
        </span>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Select value={startMonth} onValueChange={onStartMonthChange}>
            <SelectTrigger className="w-full sm:w-27.5">
              <SelectValue placeholder={t("sections.education.month")} />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={startYear} onValueChange={onStartYearChange}>
            <SelectTrigger className="w-full sm:w-22.5">
              <SelectValue placeholder={t("sections.education.year")} />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <span className="text-muted-foreground hidden pb-2.5 sm:block">-</span>

      <div className="flex w-full flex-col gap-1.5 sm:w-auto">
        <span className="text-muted-foreground pl-1 text-[10px] font-semibold uppercase">
          {t("sections.education.end")}
        </span>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Select value={endMonth} onValueChange={onEndMonthChange}>
            <SelectTrigger className="w-full sm:w-27.5">
              <SelectValue placeholder={t("sections.education.month")} />
            </SelectTrigger>
            <SelectContent>
              {showPresent && <SelectItem value="Present">Present</SelectItem>}
              {months.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(!showPresent || endMonth !== "Present") && (
            <Select value={endYear} onValueChange={onEndYearChange}>
              <SelectTrigger className="w-full sm:w-22.5">
                <SelectValue placeholder={t("sections.education.year")} />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
}
