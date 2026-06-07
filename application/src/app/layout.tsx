import type { Metadata } from "next";
import Script from "next/script";
import ThemeWrapper from "@/theme/theme.provider";
import Header from "@/components/header/header";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Starling Vox",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script src="/scripts/setThemeBeforeHydration.js" strategy="beforeInteractive" />
        <ThemeWrapper>
          <Header />
          {children}
        </ThemeWrapper>
      </body>
    </html>
  );
}
