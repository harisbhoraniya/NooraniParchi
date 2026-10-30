import localFont from "next/font/local";
import {
  Noto_Nastaliq_Urdu,
  Noto_Sans_Devanagari,
} from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

// Local Manrope variable font downloaded into folder structure
const manrope = localFont({
  src: "./fonts/Manrope-Variable.ttf",
  variable: "--font-sans",
  display: "swap",
});

const notoNastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "600"],
  variable: "--font-nastaliq",
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "600"],
  variable: "--font-devanagari",
  display: "swap",
});

export const metadata = {
  title: "Noorani Masjid Parchi Generator",
  description: "Daily Urdu Parchi Maker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        manrope.variable,
        notoNastaliq.variable,
        notoDevanagari.variable,
        "font-sans"
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster position="top-right" duration={2000} />
      </body>
    </html>
  );
}
