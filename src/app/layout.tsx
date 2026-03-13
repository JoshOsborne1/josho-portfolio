import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "josho.pro — Josh Osborne",
  description: "Python automation, AI systems, games, and full-stack tooling.",
  metadataBase: new URL("https://josho.pro"),
  openGraph: {
    siteName: "josho.pro",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#A78BFA" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Games" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-[#0a0a0b]">
        {children}
        <Footer />
      </body>
    </html>
  );
}
