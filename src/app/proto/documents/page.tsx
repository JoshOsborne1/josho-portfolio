"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  ChevronRight,
  Clock,
  Download,
  FileText,
  Film,
  FolderOpen,
  FolderClosed,
  Image,
  Plus,
  Search,
  Sheet,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Folder = {
  id: string;
  label: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
};

const FOLDERS: Folder[] = [
  { id: "compliance", label: "Compliance", count: 14, icon: FileText },
  { id: "certificates", label: "Certificates", count: 8, icon: Sheet },
  { id: "proposals", label: "Proposals", count: 5, icon: FileText },
  { id: "manuals", label: "Product Manuals", count: 22, icon: Film },
  { id: "images", label: "Site Photos", count: 31, icon: Image },
];

const DOCS: Record<string, { name: string; type: string; size: string; modified: string }[]> = {
  compliance: [
    { name: "LOLER_Inspection_Checklist_2026.pdf", type: "pdf", size: "1.2 MB", modified: "Today, 09:43" },
    { name: "HTM_08-02_Compliance_Matrix.xlsx", type: "xlsx", size: "340 KB", modified: "Mon 24 Feb" },
    { name: "GDPR_Data_Handling_Protocol.docx", type: "docx", size: "218 KB", modified: "18 Feb" },
    { name: "NHS_Estates_Policy_v3.pdf", type: "pdf", size: "3.8 MB", modified: "12 Feb" },
    { name: "Risk_Register_Q1_2026.xlsx", type: "xlsx", size: "620 KB", modified: "7 Feb" },
  ],
  certificates: [
    { name: "GH3_Type_Test_Certificate_2025.pdf", type: "pdf", size: "890 KB", modified: "Oct 2025" },
    { name: "LOLER_Cert_NorthgateCarehome.pdf", type: "pdf", size: "1.1 MB", modified: "Today" },
    { name: "Safe_Working_Load_Certificate_GH5.pdf", type: "pdf", size: "456 KB", modified: "22 Feb" },
    { name: "ISO_9001_Certificate.pdf", type: "pdf", size: "312 KB", modified: "Jan 2025" },
  ],
  proposals: [
    { name: "StJude_Clinic_Quote_v2.docx", type: "docx", size: "184 KB", modified: "Yesterday" },
    { name: "Frimley_Park_Extension_Tender.pdf", type: "pdf", size: "2.4 MB", modified: "20 Feb" },
    { name: "NorthEast_NHS_Trust_Framework_Bid.docx", type: "docx", size: "1.7 MB", modified: "14 Feb" },
  ],
  manuals: [
    { name: "GH3_Ceiling_Track_Installation_Manual.pdf", type: "pdf", size: "8.1 MB", modified: "Aug 2025" },
    { name: "GH5_Service_Manual_2023.pdf", type: "pdf", size: "5.4 MB", modified: "Nov 2023" },
    { name: "GH_Hoist_Safety_Instructions.pdf", type: "pdf", size: "2.3 MB", modified: "Apr 2024" },
    { name: "Track_Junction_Fitting_Guide.pdf", type: "pdf", size: "1.5 MB", modified: "Jan 2025" },
  ],
  images: [
    { name: "Northgate_Site_Pre-Install_01.jpg", type: "jpg", size: "3.2 MB", modified: "Today" },
    { name: "Northgate_Site_Pre-Install_02.jpg", type: "jpg", size: "2.9 MB", modified: "Today" },
    { name: "Swindon_Hoist_Rigging_Photo.jpg", type: "jpg", size: "4.1 MB", modified: "Yesterday" },
    { name: "Frimley_Commissioning_Completed.jpg", type: "jpg", size: "3.8 MB", modified: "10 Feb" },
  ],
};

const TYPE_ICON: Record<string, { icon: React.ComponentType<{ className?: string }>; style: string }> = {
  pdf: { icon: FileText, style: "text-red-600 bg-red-50 border-red-100" },
  xlsx: { icon: Sheet, style: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  docx: { icon: FileText, style: "text-sky-600 bg-sky-50 border-sky-100" },
  jpg: { icon: Image, style: "text-violet-600 bg-violet-50 border-violet-100" },
};

export default function DocumentsPage() {
  const [activeFolder, setActiveFolder] = useState("compliance");
  const [query, setQuery] = useState("");
  const [dragging, setDragging] = useState(false);

  const folder = FOLDERS.find((f) => f.id === activeFolder)!;
  const docs = DOCS[activeFolder] ?? [];
  const filtered = docs.filter((d) => !query || d.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 py-10 pb-24 flex gap-6">

      {/* Left Folder Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="hidden lg:flex w-64 flex-col gap-2 shrink-0"
      >
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase px-3 mb-3">Folders</h2>
        {FOLDERS.map((f) => {
          const FIcon = activeFolder === f.id ? FolderOpen : FolderClosed;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFolder(f.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-[14px] text-left transition-all border",
                activeFolder === f.id
                  ? "bg-slate-900 text-white border-slate-800 shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
                  : "bg-transparent text-slate-600 border-transparent hover:bg-slate-100 hover:border-slate-200"
              )}
            >
              <FIcon className={cn("w-4 h-4 shrink-0", activeFolder === f.id ? "text-guld-400" : "text-slate-400")} />
              <span className="text-[12px] font-bold uppercase tracking-widest flex-1">{f.label}</span>
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-[5px]",
                activeFolder === f.id ? "bg-white/10 text-white/70" : "bg-slate-100 text-slate-500"
              )}>{f.count}</span>
            </button>
          );
        })}

        {/* Storage Meter */}
        <div className="mt-auto pt-6 border-t border-slate-100">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Storage</p>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "38%" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="h-full bg-guld-500 rounded-full"
            />
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-2">3.8 GB of 10 GB used</p>
        </div>
      </motion.aside>

      {/* Main Area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="flex-1 flex flex-col gap-6 min-w-0"
      >
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-[1.9rem] font-bold tracking-tight text-slate-900 leading-[1.1]">{folder.label}</h1>
            <p className="text-[14px] font-medium text-slate-500 mt-1.5">{filtered.length} documents</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-white border border-slate-200/80 rounded-full py-2.5 pl-10 pr-4 text-[13px] font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-300 shadow-[0_2px_12px_rgba(15,23,42,0.03)] transition-all placeholder:text-slate-400"
              />
            </div>
            <button className="h-10 px-5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold uppercase tracking-widest shadow-md transition-all inline-flex items-center gap-2 whitespace-nowrap">
              <Plus className="w-4 h-4" />
              Upload
            </button>
          </div>
        </header>

        {/* Drag & Drop Upload Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); }}
          className={cn(
            "border-2 border-dashed rounded-[20px] p-8 text-center flex flex-col items-center gap-3 transition-all",
            dragging
              ? "border-guld-400 bg-guld-50/50 scale-[1.01]"
              : "border-slate-200 bg-slate-50/30 hover:border-slate-300 hover:bg-slate-50"
          )}
        >
          <div className="w-12 h-12 rounded-[16px] bg-white border border-slate-200 shadow-sm flex items-center justify-center">
            <Upload className={cn("w-5 h-5 transition-colors", dragging ? "text-guld-500" : "text-slate-400")} />
          </div>
          <div>
            <p className="text-[13px] font-bold text-slate-700">Drop files here or <span className="text-guld-600 cursor-pointer hover:underline">browse</span></p>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5">PDF, DOCX, XLSX, JPG up to 50 MB each</p>
          </div>
        </div>

        {/* File Table */}
        <div className="bg-white border border-slate-200/80 rounded-[24px] shadow-[0_24px_64px_rgba(15,23,42,0.04)] ring-1 ring-slate-100 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[auto_1fr_120px_120px_80px] gap-4 px-6 py-3 bg-slate-50/70 border-b border-slate-100">
            {["", "Name", "Type", "Modified", ""].map((h, i) => (
              <div key={i} className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{h}</div>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-3 text-slate-300">
              <Search className="w-10 h-10" />
              <p className="text-sm font-bold uppercase tracking-wide">No files found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((doc, i) => {
                const typeCfg = TYPE_ICON[doc.type] ?? TYPE_ICON.pdf;
                const TIcon = typeCfg.icon;
                return (
                  <motion.div
                    key={doc.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    className="grid grid-cols-[auto_1fr_120px_120px_80px] items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors group cursor-pointer"
                  >
                    <div className={cn("w-9 h-9 rounded-[10px] border flex items-center justify-center shrink-0", typeCfg.style)}>
                      <TIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-slate-900 truncate group-hover:text-slate-700">{doc.name}</p>
                      <p className="text-[11px] font-medium text-slate-400 mt-0.5">{doc.size}</p>
                    </div>
                    <div>
                      <span className={cn("px-2 py-0.5 rounded-[6px] border text-[9px] font-bold tracking-widest uppercase", typeCfg.style)}>
                        {doc.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                      <Clock className="w-3 h-3" />{doc.modified}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                      <button className="w-8 h-8 rounded-[8px] bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-8 h-8 rounded-[8px] bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
