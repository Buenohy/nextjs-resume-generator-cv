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

// Configuração das Fontes
const jetbrainsMonoHeading = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-heading",
});

const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Configuração dos Metadados (Title e Description)
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

  // Verifica se o idioma é válido
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Otimização para Server Components recomendada pelo next-intl
  setRequestLocale(locale);

  // Busca as traduções do pt.json ou en.json
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
      <body className="selection:bg-primary overflow-x-hidden p-5 antialiased">
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
