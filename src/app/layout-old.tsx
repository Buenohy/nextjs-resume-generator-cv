import { Oxanium, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import NavigationMenuDemo from "@/components/nav-menu";

import { ThemeProvider } from "@/components/theme-provider";

import { NextIntlClientProvider } from "next-intl";

import { setRequestLocale } from "next-intl/server";

const jetbrainsMonoHeading = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-heading",
});

const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-sans" });

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  setRequestLocale(locale);

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
      <body className={`selection:bg-primary p-5 antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavigationMenuDemo />
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
