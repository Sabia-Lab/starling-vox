import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeWrapper from "@/theme/theme.provider";
import Header from "@/components/header/header";
import Head from "@/components/head/head";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Starling Vox",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeWrapper>
      <html lang="en" suppressHydrationWarning>
        <Head />
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <Header />
          {children}
        </body>
      </html>
    </ThemeWrapper>
  );
}
