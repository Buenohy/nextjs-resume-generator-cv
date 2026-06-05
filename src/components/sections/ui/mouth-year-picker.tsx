"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

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
  side?: "top" | "bottom";
  onlyEnd?: boolean;
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
  side = "bottom",
  onlyEnd = false,
}: MonthYearPickerProps) {
  // Função que traduz o Token (ex: __MONTH_0__) para o nome real na interface
  const getDisplayMonth = (val: string) => {
    if (!val) return null;
    if (val === "__PRESENT__") return t("sections.education.present");
    if (val.startsWith("__MONTH_")) {
      const idx = parseInt(val.replace(/\D/g, ""), 10);
      return months[idx] || val;
    }
    return val; // Fallback para dados antigos salvos como "Janeiro"
  };

  return (
    <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end sm:gap-2 lg:flex-col lg:items-start xl:flex-row xl:items-end">
      {!onlyEnd && (
        <div className="flex w-full flex-col gap-1.5 sm:w-auto">
          <span className="text-muted-foreground pl-1 text-[10px] font-semibold uppercase">
            {t("sections.education.start")}
          </span>
          <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row">
            {/* START MONTH */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex h-9 w-full items-center justify-between px-3 font-normal sm:w-32"
                >
                  <span className="truncate">
                    {getDisplayMonth(startMonth) ||
                      t("sections.education.month")}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={side}
                className="max-h-60 overflow-y-auto"
              >
                {months.map((m, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => onStartMonthChange(`__MONTH_${index}__`)}
                    className={
                      startMonth === `__MONTH_${index}__`
                        ? "bg-muted font-bold"
                        : ""
                    }
                  >
                    {m}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* START YEAR */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex h-9 w-full items-center justify-between px-3 font-normal sm:w-22.5"
                >
                  <span className="truncate">
                    {startYear || t("sections.education.year")}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={side}
                className="max-h-60 overflow-y-auto"
              >
                {years.map((y) => (
                  <DropdownMenuItem
                    key={y}
                    onClick={() => onStartYearChange(y)}
                    className={startYear === y ? "bg-muted font-bold" : ""}
                  >
                    {y}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {!onlyEnd && (
        <span className="text-muted-foreground hidden pb-2.5 sm:block lg:hidden xl:block">
          -
        </span>
      )}

      <div className="flex w-full flex-col gap-1.5 sm:w-auto">
        <span className="text-muted-foreground pl-1 text-[10px] font-semibold uppercase">
          {t("sections.education.end")}
        </span>
        <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row">
          {/* END MONTH */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex h-9 w-full items-center justify-between px-3 font-normal sm:w-32"
              >
                <span className="truncate">
                  {getDisplayMonth(endMonth) || t("sections.education.month")}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side={side}
              className="max-h-60 overflow-y-auto"
            >
              {showPresent && (
                <DropdownMenuItem
                  onClick={() => onEndMonthChange("__PRESENT__")}
                  className={
                    endMonth === "__PRESENT__" ? "bg-muted font-bold" : ""
                  }
                >
                  {t("sections.education.present")}
                </DropdownMenuItem>
              )}
              {months.map((m, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => onEndMonthChange(`__MONTH_${index}__`)}
                  className={
                    endMonth === `__MONTH_${index}__`
                      ? "bg-muted font-bold"
                      : ""
                  }
                >
                  {m}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* END YEAR */}
          {(!showPresent || endMonth !== "__PRESENT__") && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex h-9 w-full items-center justify-between px-3 font-normal sm:w-22.5"
                >
                  <span className="truncate">
                    {endYear || t("sections.education.year")}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={side}
                className="max-h-60 overflow-y-auto"
              >
                {years.map((y) => (
                  <DropdownMenuItem
                    key={y}
                    onClick={() => onEndYearChange(y)}
                    className={endYear === y ? "bg-muted font-bold" : ""}
                  >
                    {y}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
