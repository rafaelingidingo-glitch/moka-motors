import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moka Motors - Premium Motorbikes & Spare Parts | Dar es Salaam",
  description:
    "Moka Motors is your trusted partner for premium motorbikes and spare parts in Dar es Salaam, Tanzania. We are the solution for your problems.",
  keywords: [
    "Moka Motors",
    "motorbikes",
    "spare parts",
    "Dar es Salaam",
    "Tanzania",
    "Honda",
    "Kawasaki",
    "KTM",
    "Yamaha",
  ],
  icons: {
    icon: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning id="root-html">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-foreground`}
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
