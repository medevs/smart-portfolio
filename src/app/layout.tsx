import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
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
  metadataBase: new URL("https://medevsmaker.vercel.app"),
  title: {
    template: "%s | Ahmed Oublihi",
    default: "Ahmed Oublihi - Full Stack Developer & AI Engineer",
  },
  description: "Full Stack Developer & AI Engineer specializing in React, Next.js, TypeScript, and AI-powered applications. Building intelligent software with modern web technologies.",
  keywords: [
    "Full Stack Developer",
    "AI Engineer",
    "React",
    "Next.js",
    "TypeScript",
    "LangChain",
    "OpenAI",
    "Web Development",
    "Software Engineer",
    "Ahmed Oublihi",
  ],
  authors: [{ name: "Ahmed Oublihi", url: "https://medevsmaker.vercel.app" }],
  creator: "Ahmed Oublihi",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://medevsmaker.vercel.app",
    siteName: "Ahmed Oublihi Portfolio",
    title: "Ahmed Oublihi - Full Stack Developer & AI Engineer",
    description: "Full Stack Developer & AI Engineer building intelligent software with modern web technologies.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ahmed Oublihi - Full Stack Developer & AI Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Oublihi - Full Stack Developer & AI Engineer",
    description: "Full Stack Developer & AI Engineer building intelligent software with modern web technologies.",
    images: ["/og-image.png"],
    creator: "@medevs",
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
