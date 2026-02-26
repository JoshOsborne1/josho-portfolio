"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Briefcase, LayoutDashboard, FileText, Bot, FileCheck, CircleUserRound } from "lucide-react";

export default function ProtoNavigation() {
  const pathname = usePathname();

  if (pathname === "/proto") return null;

  const links = [
    { name: "Dashboard", href: "/proto/dashboard", icon: LayoutDashboard },
    { name: "My Jobs", href: "/proto/jobs", icon: Briefcase },
    { name: "RAMS", href: "/proto/rams", icon: FileCheck },
    { name: "Documents", href: "/proto/documents", icon: FileText },
    { name: "Agent Terminal", href: "/proto/chat", icon: Bot },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-[64px] border-b border-slate-200/80 bg-white/80 backdrop-blur-xl px-5 sm:px-8 flex items-center justify-between shadow-[0_4px_30px_rgba(15,23,42,0.02)]">
      <div className="flex items-center gap-10">
        {/* Brand */}
        <Link href="/proto/dashboard" className="flex items-center gap-2.5 group">
           <div className="w-2 h-2 rounded-full bg-guld-500 shadow-[0_0_12px_rgba(205,150,43,0.8)] group-hover:scale-125 transition-transform" />
           <span className="font-bold tracking-[0.2em] text-[12px] text-slate-900 uppercase">Guldmann</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative px-3.5 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors",
                  isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-[10px] bg-slate-100/80 border border-slate-200/60"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-2 z-10">
                  <Icon className="w-[14px] h-[14px]" />
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* User Badge */}
        <div className="flex items-center gap-2.5 pl-4 py-1.5 rounded-full border border-slate-200/80 bg-slate-50 shadow-sm hover:bg-slate-100 transition-colors cursor-pointer group">
           <span className="text-[12px] font-bold text-slate-700 tracking-tight">James S.</span>
           <div className="w-[28px] h-[28px] rounded-full bg-guld-50 border border-guld-200 flex items-center justify-center text-guld-600 group-hover:bg-guld-500 group-hover:text-white group-hover:border-guld-600 transition-colors mr-1">
              <CircleUserRound className="w-[14px] h-[14px]" />
           </div>
        </div>
      </div>
    </nav>
  );
}
