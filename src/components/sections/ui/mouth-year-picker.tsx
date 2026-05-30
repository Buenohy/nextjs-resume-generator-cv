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
  return (
    <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end sm:gap-2 lg:flex-col lg:items-start xl:flex-row xl:items-end">
      {/* O Bloco de início só será renderizado se onlyEnd for falso */}
      {!onlyEnd && (
        <div className="flex w-full flex-col gap-1.5 sm:w-auto">
          <span className="text-muted-foreground pl-1 text-[10px] font-semibold uppercase">
            {t("sections.education.start")}
          </span>
          <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row">
            {/* START MONTH PICKER */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex h-9 w-full items-center justify-between px-3 font-normal sm:w-32"
                >
                  <span className="truncate">
                    {startMonth || t("sections.education.month")}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={side}
                className="max-h-60 overflow-y-auto"
              >
                {months.map((m) => (
                  <DropdownMenuItem
                    key={m}
                    onClick={() => onStartMonthChange(m)}
                    className={startMonth === m ? "bg-muted font-bold" : ""}
                  >
                    {m}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* START YEAR PICKER */}
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

      {/* O separador só será renderizado se onlyEnd for falso */}
      {!onlyEnd && (
        <span className="text-muted-foreground hidden pb-2.5 sm:block lg:hidden xl:block">
          -
        </span>
      )}

      {/* O bloco de término sempre será renderizado */}
      <div className="flex w-full flex-col gap-1.5 sm:w-auto">
        <span className="text-muted-foreground pl-1 text-[10px] font-semibold uppercase">
          {t("sections.education.end")}
        </span>
        <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row">
          {/* END MONTH PICKER */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex h-9 w-full items-center justify-between px-3 font-normal sm:w-32"
              >
                <span className="truncate">
                  {endMonth === "Present"
                    ? t("sections.education.present")
                    : endMonth || t("sections.education.month")}
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
                  onClick={() => onEndMonthChange("Present")}
                  className={endMonth === "Present" ? "bg-muted font-bold" : ""}
                >
                  {t("sections.education.present")}
                </DropdownMenuItem>
              )}
              {months.map((m) => (
                <DropdownMenuItem
                  key={m}
                  onClick={() => onEndMonthChange(m)}
                  className={endMonth === m ? "bg-muted font-bold" : ""}
                >
                  {m}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* END YEAR PICKER */}
          {(!showPresent || endMonth !== "Present") && (
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
