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
      <body className="font-sans antialiased min-h-screen flex flex-col bg-[#0a0a0b]">
        {children}
        <Footer />
      </body>
    </html>
  );
}
