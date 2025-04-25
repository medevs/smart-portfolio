import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NextUIProvider } from "@/components/NextUIProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Ahmed Oublihi",
    default: "Ahmed Oublihi",
  },
  description: "Check out my smart portfolio website with a custom AI chatbot.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <NextUIProvider>
            <div className="min-h-screen bg-background text-foreground">
              <Navbar />
              <main className="py-8 px-4 md:px-6 mx-auto max-w-7xl">
                {children}
              </main>
              <Footer />
            </div>
          </NextUIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
