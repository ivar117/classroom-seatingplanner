import type { Metadata } from "next";
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider"

import { Inter as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"
import BaseLayout from "@/components/layout/base-layout";
import { ReactNode, Suspense } from "react";
import { NextFontWithVariable } from "next/dist/compiled/@next/font";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
}) as NextFontWithVariable;

export const metadata = {
  title: "Seating Plan",
} as Metadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}>
        <Suspense fallback={<div>Loading...</div>}>
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
          >
            <AuthProvider>
              <BaseLayout className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col bg-muted/40">
                {children}
              </BaseLayout>
            </AuthProvider>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
