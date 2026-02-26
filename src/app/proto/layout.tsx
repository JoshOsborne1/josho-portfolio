import type { Metadata } from "next";
import "../globals.css";
import ProtoNavigation from "@/components/proto-navigation";

export const metadata: Metadata = {
  title: "Guldmann UK AI Platform",
  description: "Your Team's Personal AI Platform - Guldfriend",
};

export default function ProtoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ProtoNavigation />
      <main className="flex-1 flex flex-col relative pt-16">{children}</main>
    </>
  );
}
