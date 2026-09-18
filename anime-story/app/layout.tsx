import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import Navbar from "@/components/ui/Navbar";
import ClientInit from "@/components/ClientInit";
import { AuthProvider } from "@/lib/AuthContext";

const fontBricolage = Bricolage_Grotesque({
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-bricolage",
});

const fontManrope = Manrope({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "CINEMIKS | READ THE REEL",
  description: "CINEMIKS is a cinematic storytelling platform powered by motion, cinematic visuals, atmospheric audio, and vertical scrolling. READ THE REEL.",
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
      className={`${fontBricolage.variable} ${fontManrope.variable} antialiased`}
    >
      <body suppressHydrationWarning className="bg-[#0A0A0A] text-[#F5F5F7]">
        <ClientInit />
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
