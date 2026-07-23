import type { Metadata } from "next";
import { Cinzel, Bebas_Neue, Noto_Serif_JP, Space_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import Navbar from "@/components/ui/Navbar";
import { AuthProvider } from "@/lib/AuthContext";

const fontDisplay = Cinzel({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-display",
});

const fontHero = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hero",
});

const fontBody = Noto_Serif_JP({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

const fontMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Anime Story | The World Awakens",
  description: "A cinematic, scroll-driven anime story website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontHero.variable} ${fontBody.variable} ${fontMono.variable} antialiased`}
    >
      <head>
        <Script id="performance-polyfill" strategy="beforeInteractive">
          {`(function(){
  if (typeof window === 'undefined') return;
  var perf = window.performance;
  if (!perf) return;
  if (typeof perf.mark !== 'function') perf.mark = function(){};
  if (typeof perf.measure !== 'function') perf.measure = function(){};
  if (typeof perf.clearMarks !== 'function') perf.clearMarks = function(){};
  if (typeof perf.clearMeasures !== 'function') perf.clearMeasures = function(){};
})();`}
        </Script>
      </head>
      <body>
        <AuthProvider>
          <LenisProvider>
            <CustomCursor />
            <Navbar />
            {children}
          </LenisProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
