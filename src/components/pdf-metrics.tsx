"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export interface PdfMetricsProps {
  /** The current text or string array value */
  text?: string | string[] | null;
  /**
   * Average characters per line in PDF A4 (Helvetica 9pt):
   * - Experience Bullet Points: ~98
   * - Professional Summary / Job Description: ~110
   */
  charsPerLine?: number;
  /** Recommended maximum PDF lines before displaying a warning highlight */
  maxLines?: number;
  /** Optional maximum character limit */
  maxLength?: number;
  /** Whether to render the PDF line count estimate (default: true) */
  showPdfLines?: boolean;
  /** Additional CSS styling classes */
  className?: string;
}

export function PdfMetrics({
  text = "",
  charsPerLine = 98,
  maxLines,
  maxLength,
  showPdfLines = true,
  className,
}: PdfMetricsProps) {
  const t = useTranslations("TextMetrics");

  // Safely handle strings, string arrays (e.g. keywords), null, or undefined
  const str = Array.isArray(text) ? text.join(", ") : String(text || "");
  const charCount = str.length;

  // Automatic calculation of PDF lines taking into account manual newlines (\n) and width wrapping
  const pdfLines = useMemo(() => {
    if (!str) return 0;
    return str.split("\n").reduce((acc, line) => {
      if (line.length === 0) return acc + 1;
      return acc + Math.ceil(line.length / charsPerLine);
    }, 0);
  }, [str, charsPerLine]);

  const isLineOverflow = maxLines ? pdfLines > maxLines : false;
  const isCharOverflow = maxLength ? charCount > maxLength : false;

  return (
    <div
      className={cn(
        `text-muted-foreground flex items-center justify-between px-1 pt-1 font-mono text-[11px]`,
        className
      )}
    >
      {/* PDF Line Count */}
      {showPdfLines ? (
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "transition-colors",
              isLineOverflow &&
                `font-semibold text-amber-500 dark:text-amber-400`
            )}
          >
            {t("pdfLines", { count: pdfLines })}
          </span>
          {maxLines && (
            <span className="text-muted-foreground/60 font-sans text-[10px]">
              {t("maxRecommended", { max: maxLines })}
            </span>
          )}
        </div>
      ) : (
        <div /> // Spacer when line count is disabled
      )}

      {/* Character Count */}
      <div className="flex items-center gap-1 font-sans">
        <span
          className={cn(
            "font-mono",
            isCharOverflow && "text-destructive font-bold",
            !isCharOverflow && charCount > 0 && "text-foreground/90"
          )}
        >
          {charCount}
        </span>
        {maxLength && <span className="font-mono">/{maxLength}</span>}
        <span className="text-muted-foreground/70 text-[10px]">
          {t("chars")}
        </span>
      </div>
    </div>
  );
}
