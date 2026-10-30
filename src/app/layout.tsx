import LegalFooter from "@/components/LegalFooter";
import { ThemeProvider } from "@/components/ThemeProvider";
import { seoConfig } from "@/config";
import type { Metadata } from "next";
import { Fraunces, Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.siteUrl),
  title: {
    template: `%s · medevsmaker`,
    default: "medevsmaker — a farm you can wander",
  },
  description: seoConfig.description,
  keywords: seoConfig.keywords,
  authors: [{ name: "medevsmaker", url: seoConfig.siteUrl }],
  creator: "medevsmaker",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: seoConfig.siteUrl,
    siteName: "medevsmaker",
    title: "medevsmaker — a farm you can wander",
    description: seoConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "medevsmaker — a farm you can wander",
    description: seoConfig.description,
    creator: "@medevsmaker",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${nunito.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <LegalFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
