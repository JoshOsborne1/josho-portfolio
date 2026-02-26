"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Bot,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  FilePen,
  FolderOpen,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const RAMS_DOCS = [
  {
    id: "RAMS-2041",
    title: "GH3 Ceiling Track Installation",
    site: "Northgate Care Home",
    job_id: "JOB-2041",
    engineer: "James S.",
    date: "Today",
    status: "Pending Review",
    hazards: 4,
  },
  {
    id: "RAMS-2039",
    title: "GH5 Sling Replacement Protocol",
    site: "Royal Surrey Hospital",
    job_id: "JOB-2039",
    engineer: "James S.",
    date: "22 Feb 2026",
    status: "Approved",
    hazards: 2,
  },
  {
    id: "RAMS-2035",
    title: "GH3 Track Extension — East Wing",
    site: "Eastbourne District Hospital",
    job_id: "JOB-2035",
    engineer: "James S.",
    date: "18 Feb 2026",
    status: "Approved",
    hazards: 3,
  },
  {
    id: "RAMS-2031",
    title: "Hoist Installation & Commissioning",
    site: "Frimley Park Hospital",
    job_id: "JOB-2031",
    engineer: "James S.",
    date: "10 Feb 2026",
    status: "Archived",
    hazards: 5,
  },
  {
    id: "RAMS-2028",
    title: "Emergency Track Inspection",
    site: "Winchester County Hospital",
    job_id: "JOB-2028",
    engineer: "James S.",
    date: "3 Feb 2026",
    status: "Archived",
    hazards: 1,
  },
  {
    id: "DRAFT-01",
    title: "LOLER Inspection — St. Jude Clinic",
    site: "St. Jude Clinic",
    job_id: "SV-8790",
    engineer: "James S.",
    date: "Draft",
    status: "Draft",
    hazards: null,
  },
];

const TABS = ["All", "Draft", "Pending Review", "Approved", "Archived"] as const;
type Tab = (typeof TABS)[number];

const STATUS_CONFIG: Record<string, { style: string; dot: string }> = {
  Draft: { style: "text-slate-600 bg-slate-50 border-slate-200", dot: "bg-slate-400" },
  "Pending Review": { style: "text-amber-700 bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  Approved: { style: "text-emerald-700 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" },
  Archived: { style: "text-slate-400 bg-slate-50 border-slate-100", dot: "bg-slate-300" },
};

export default function RamsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [query, setQuery] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = RAMS_DOCS.filter((d) => {
    const matchTab = activeTab === "All" || d.status === activeTab;
    const matchQuery =
      !query ||
      d.id.toLowerCase().includes(query.toLowerCase()) ||
      d.site.toLowerCase().includes(query.toLowerCase()) ||
      d.title.toLowerCase().includes(query.toLowerCase());
    return matchTab && matchQuery;
  });

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGeneratedId("DRAFT-" + Math.floor(Math.random() * 900 + 100));
    }, 2500);
  };

  return (
    <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 py-10 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="flex flex-col gap-8"
      >
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <h1 className="text-[1.9rem] font-bold tracking-tight text-slate-900 leading-[1.1]">RAMS Library</h1>
            <p className="text-[14px] font-medium text-slate-500 mt-1.5">
              {RAMS_DOCS.filter((d) => d.status === "Approved").length} approved &middot;&nbsp;
              {RAMS_DOCS.filter((d) => d.status === "Pending Review").length} awaiting review &middot;&nbsp;
              {RAMS_DOCS.filter((d) => d.status === "Draft").length} draft
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search RAMS..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-white border border-slate-200/80 rounded-full py-2.5 pl-10 pr-4 text-[13px] font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-300 shadow-[0_2px_12px_rgba(15,23,42,0.03)] transition-all placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="h-10 px-5 rounded-full bg-guld-600 hover:bg-guld-500 disabled:opacity-70 disabled:cursor-not-allowed text-white text-[11px] font-bold uppercase tracking-widest shadow-md shadow-guld-500/20 transition-all inline-flex items-center gap-2 whitespace-nowrap"
            >
              {generating ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Bot className="w-4 h-4" />
                  </motion.div>
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Generate via Agent
                </>
              )}
            </button>
          </div>
        </header>

        {/* Agent Success Toast */}
        {generatedId && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 p-4 rounded-[16px] bg-emerald-50 border border-emerald-200 shadow-sm"
          >
            <div className="w-8 h-8 rounded-[10px] bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-emerald-900">New RAMS draft created: <span className="text-emerald-700">{generatedId}</span></p>
              <p className="text-[11px] font-medium text-emerald-600 mt-0.5">Agent used GH3 standard template. Review before submitting for sign-off.</p>
            </div>
            <button onClick={() => setGeneratedId(null)} className="text-emerald-400 hover:text-emerald-800 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200">
          {TABS.map((tab) => {
            const count = RAMS_DOCS.filter((d) => tab === "All" || d.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "relative px-4 py-2.5 text-[12px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2",
                  activeTab === tab ? "text-slate-900" : "text-slate-400 hover:text-slate-700"
                )}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="rams-tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                {tab}
                <span className={cn(
                  "px-1.5 py-0.5 rounded text-[9px] font-bold border",
                  activeTab === tab ? "bg-slate-900 text-white border-slate-900" : "bg-slate-100 text-slate-500 border-transparent"
                )}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* RAMS Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-[24px] py-24 flex flex-col items-center gap-4 text-slate-400 shadow-sm">
            <FolderOpen className="w-10 h-10 text-slate-200" />
            <p className="text-sm font-bold tracking-wide uppercase">No documents found</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((doc, i) => {
              const cfg = STATUS_CONFIG[doc.status];
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  className="group bg-white border border-slate-200/80 rounded-[24px] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.03)] ring-1 ring-slate-100 hover:shadow-[0_16px_40px_rgba(15,23,42,0.07)] transition-all flex flex-col gap-5 relative"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-[16px] bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm shrink-0">
                      <FileText className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="relative ml-auto">
                      <button
                        onClick={() => setOpenMenu(openMenu === doc.id ? null : doc.id)}
                        className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200/0 hover:border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {openMenu === doc.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className="absolute top-10 right-0 w-44 bg-white border border-slate-200 rounded-[14px] shadow-xl z-20 overflow-hidden"
                        >
                          {[
                            { label: "Edit Draft", icon: FilePen },
                            { label: "Download PDF", icon: Download },
                            { label: "Request Sign-Off", icon: ShieldCheck },
                            { label: "Archive", icon: Trash2 },
                          ].map((a) => {
                            const AIcon = a.icon;
                            return (
                              <button
                                key={a.label}
                                onClick={() => setOpenMenu(null)}
                                className="flex items-center gap-3 w-full px-4 py-3 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-0"
                              >
                                <AIcon className="w-3.5 h-3.5 text-slate-400" /> {a.label}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-1.5 flex-1">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">{doc.id} &middot; {doc.job_id}</span>
                    <h3 className="text-[15px] font-bold text-slate-900 leading-snug">{doc.title}</h3>
                    <p className="text-[12px] font-medium text-slate-500">{doc.site}</p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", cfg.dot)} />
                      <span className={cn("px-2 py-0.5 rounded-[6px] border text-[9px] font-bold tracking-widest uppercase", cfg.style)}>{doc.status}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{doc.date}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
