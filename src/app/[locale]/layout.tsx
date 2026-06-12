import { Oxanium, JetBrains_Mono } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";

import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

import { NextIntlClientProvider } from "next-intl";
import {
  getTranslations,
  getMessages,
  setRequestLocale,
} from "next-intl/server";

import NavigationMenu from "@/components/nav-menu";
import { ThemeProvider } from "@/components/theme-provider";

// Font Configurations
const jetbrainsMonoHeading = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-heading",
});

const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Metadata Configurations
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate if the current locale is supported using strict routing array types instead of "any"
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Server-side localization context setup recommended by next-intl
  setRequestLocale(locale);

  // Fetch localized dictionary messages
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={cn(
        "font-sans",
        oxanium.variable,
        jetbrainsMonoHeading.variable
      )}
      suppressHydrationWarning
    >
      <body className="selection:bg-primary overflow-x-hidden p-2.5 antialiased sm:p-5">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <NavigationMenu />

            <main>{children}</main>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
