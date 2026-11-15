import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "TerraVision AI — Satellite Earth Observation & AI Flood Segmentation",
  description:
    "AI-powered satellite flood detection comparing multi-temporal pre and post-flood imagery using a U-Net segmentation network trained on the S1GFloods dataset.",
  keywords: ["satellite flood detection", "NASA Earth Observation", "remote sensing", "U-Net", "disaster management", "S1GFloods", "SAR"],
  openGraph: {
    title: "TerraVision AI",
    description: "Satellite Earth Observation & AI Flood Segmentation",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("dark", "font-sans")}>
      <body className="min-h-screen flex flex-col font-sans bg-slate-950 text-slate-100 selection:bg-teal-500/30 selection:text-teal-200">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
