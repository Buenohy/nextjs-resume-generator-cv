"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Menu } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { LangMenu } from "./lang-menu";
import { DarkMode } from "./dark-mode";

export default function NavigationMenuDemo() {
  const t = useTranslations("NavMenu");

  return (
    <div className="bg-background border-primary mx-auto my-5 flex h-14 w-[95%] max-w-full items-center justify-center gap-4 rounded-lg border px-2 shadow-sm sm:w-fit sm:justify-start">
      <div className="block sm:hidden">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="h-[70vh] w-56 overflow-y-auto"
          >
            <DropdownMenuLabel>{t("pages.trigger")}</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/" className="cursor-pointer">
                {t("pages.home.title")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/components" className="cursor-pointer">
                {t("pages.components.title")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuLabel>{t("jobs.trigger")}</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/job-description" className="cursor-pointer">
                {t("jobs.description.title")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuLabel>{t("contents.trigger")}</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/full-content" className="cursor-pointer">
                {t("contents.full.title")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/resume-builder" className="cursor-pointer">
                {t("contents.builder.title")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuLabel>{t("pdf.trigger")}</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/pdf-preview" className="cursor-pointer">
                {t("pdf.preview.title")}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="hidden sm:block">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                {t("pages.trigger")}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex w-72 flex-col gap-3 p-4">
                  <ListItem href="/" title={t("pages.home.title")}>
                    {t("pages.home.desc")}
                  </ListItem>
                  <ListItem
                    href="/components"
                    title={t("pages.components.title")}
                  >
                    {t("pages.components.desc")}
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>{t("jobs.trigger")}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex w-72 flex-col gap-3 p-4">
                  <ListItem
                    href="/job-description"
                    title={t("jobs.description.title")}
                  >
                    {t("jobs.description.desc")}
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>
                {t("contents.trigger")}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex w-72 flex-col gap-3 p-4">
                  <ListItem
                    href="/full-content"
                    title={t("contents.full.title")}
                  >
                    {t("contents.full.desc")}
                  </ListItem>
                  <ListItem
                    href="/resume-builder"
                    title={t("contents.builder.title")}
                  >
                    {t("contents.builder.desc")}
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>{t("pdf.trigger")}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex w-72 flex-col gap-3 p-4">
                  <ListItem href="/pdf-preview" title={t("pdf.preview.title")}>
                    {t("pdf.preview.desc")}
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <LangMenu />
      <DarkMode />
    </div>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string; title: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="hover:bg-muted flex flex-col gap-1 rounded-md p-2 text-sm transition-colors">
            <div className="text-foreground leading-none font-medium">
              {title}
            </div>
            <div className="text-muted-foreground line-clamp-2">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
