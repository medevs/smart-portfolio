import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { seoConfig, personalInfo } from "@/config";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.siteUrl),
  title: {
    template: `%s | ${personalInfo.fullName}`,
    default: `${personalInfo.fullName} - ${personalInfo.title}`,
  },
  description: seoConfig.description,
  keywords: seoConfig.keywords,
  authors: [{ name: seoConfig.author.name, url: seoConfig.author.url }],
  creator: personalInfo.fullName,
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.svg", sizes: "16x16", type: "image/svg+xml" },
      { url: "/icons/favicon-32x32.svg", sizes: "32x32", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
    other: [
      { rel: "icon", url: "/icons/android-chrome-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    type: "website",
    locale: seoConfig.openGraph.locale,
    url: seoConfig.siteUrl,
    siteName: seoConfig.siteName,
    title: seoConfig.openGraph.title,
    description: seoConfig.openGraph.description,
    images: seoConfig.openGraph.images,
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.twitter.title,
    description: seoConfig.twitter.description,
    images: seoConfig.twitter.images,
    creator: seoConfig.twitter.creator,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="h-screen flex flex-col overflow-hidden bg-background text-foreground">
            <Navbar />
            <main className="flex-1 overflow-hidden">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
