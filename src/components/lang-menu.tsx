"use client";

import * as React from "react";
import { useLocale } from "next-intl";

import { useRouter, usePathname } from "@/i18n/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LangMenu() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Select defaultValue={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Select a lang" />
      </SelectTrigger>
      <SelectContent position="item-aligned">
        <SelectGroup>
          <SelectLabel>Langs</SelectLabel>
          <SelectItem value="pt">Português (pt-br)</SelectItem>
          <SelectItem value="en">English (en-us)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
