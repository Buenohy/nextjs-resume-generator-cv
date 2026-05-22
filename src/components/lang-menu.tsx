"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function LangMenu() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-35 justify-start">
          {locale === "pt" ? "Português (pt-br)" : "English (en-us)"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-35">
        <DropdownMenuItem
          onClick={() => handleLocaleChange("pt")}
          className={locale === "pt" ? "bg-muted font-bold" : ""}
        >
          Português (pt-br)
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleLocaleChange("en")}
          className={locale === "en" ? "bg-muted font-bold" : ""}
        >
          English (en-us)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
