import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Lora, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "SideQuest — Find your next adventure.",
    template: "%s · SideQuest",
  },
  description:
    "SideQuest is a modern student event discovery platform. Discover, save, and register for workshops, competitions, talks and more happening around your university.",
  openGraph: {
    title: "SideQuest — Find your next adventure.",
    description:
      "Discover events, activities, competitions and opportunities happening around your university.",
    siteName: "SideQuest",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SideQuest — Find your next adventure.",
    description:
      "Discover events, activities, competitions and opportunities happening around your university.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${lora.variable} ${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
