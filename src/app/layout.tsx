import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";

const bebasNeueFont = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400"],
  display: "swap",
});

const dmSansFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"],
  display: "swap",
});

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
    <html lang="en" className={`${bebasNeueFont.variable} ${dmSansFont.variable}`}>
      <body className="font-body text-sortd-black bg-white antialiased selection:bg-sortd-yellow selection:text-sortd-black">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}


