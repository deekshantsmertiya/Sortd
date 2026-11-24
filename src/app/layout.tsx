import type { Metadata, Viewport } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import { SiteThemeVars } from "@/lib/siteSettings";

// Headings: "block" hides heading text for a moment until Bebas Neue arrives,
// instead of flashing it in a wide fallback font (which looked like "the font changed").
const bebasNeueFont = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400"],
  display: "block",
  fallback: ["Impact", "Arial Narrow", "sans-serif"],
});

// Body: every weight the site uses is loaded (600/800/900 were missing, so the browser faked them).
const dmSansFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Phone browser bar (Android Chrome, Safari, Samsung Internet) matches the yellow header on every page.
export const viewport: Viewport = {
  themeColor: "#FFCC00",
};

export const metadata: Metadata = {
  title: "sortd — Dubai | News, Culture & Community in 60 Seconds",
  description: "Dubai's unfiltered take on news, culture & community. Read in 60 seconds.",
  keywords: ["Dubai news", "Dubai culture", "Dubai community", "sortd Dubai", "UAE media"],
  openGraph: {
    title: "sortd — Dubai",
    description: "Dubai's unfiltered take on news, culture & community. Read in 60 seconds.",
    url: "https://sortd.ae",
    siteName: "sortd Dubai",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeueFont.variable} ${dmSansFont.variable} overflow-x-clip w-full max-w-full`}>
      <body className="font-body text-sortd-black bg-[#F7F7F8] antialiased selection:bg-sortd-yellow selection:text-sortd-black overflow-x-clip w-full max-w-full">
        <QueryProvider>
          <SiteThemeVars />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}


