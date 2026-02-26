import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Josh Osborne — josho.pro",
  description: "Python automation, AI systems, and full-stack tooling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
