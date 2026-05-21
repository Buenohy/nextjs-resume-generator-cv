"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { LangMenu } from "./lang-menu";
import { DarkMode } from "./dark-mode";

export default function NavigationMenuDemo() {
  const t = useTranslations("NavMenu");

  return (
    <NavigationMenu className="mx-auto my-5">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{t("pages.trigger")}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-96 flex-col gap-3 p-4">
              <ListItem href="/" title={t("pages.home.title")}>
                {t("pages.home.desc")}
              </ListItem>
              <ListItem href="/components" title={t("pages.components.title")}>
                {t("pages.components.desc")}
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>{t("jobs.trigger")}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-96 flex-col gap-3 p-4">
              <ListItem
                href="/job-description"
                title={t("jobs.description.title")}
              >
                {t("jobs.description.desc")}
              </ListItem>
              <ListItem href="/job-parse" title={t("jobs.parse.title")}>
                {t("jobs.parse.desc")}
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>{t("ats.trigger")}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-96 flex-col gap-3 p-4">
              <ListItem href="/match-ats" title={t("ats.match.title")}>
                {t("ats.match.desc")}
              </ListItem>
              <ListItem
                href="/optimizing-resume"
                title={t("ats.optimize.title")}
              >
                {t("ats.optimize.desc")}
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>{t("contents.trigger")}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-96 flex-col gap-3 p-4">
              <ListItem href="/full-content" title={t("contents.full.title")}>
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
            <ul className="flex w-96 flex-col gap-3 p-4">
              <ListItem href="/pdf-preview" title={t("pdf.preview.title")}>
                {t("pdf.preview.desc")}
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <LangMenu />
        </NavigationMenuItem>

        <NavigationMenuItem>
          <DarkMode />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
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
