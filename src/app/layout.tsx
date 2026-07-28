import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";

const montserratFont = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["700", "800", "900"],
  display: "swap",
});

const poppinsFont = Poppins({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
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
    <html lang="en" className={`${montserratFont.variable} ${poppinsFont.variable}`}>
      <body className="font-body text-sortd-black bg-white antialiased selection:bg-sortd-yellow selection:text-sortd-black">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}


