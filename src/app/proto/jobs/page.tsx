"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Activity,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileCheck as FileCheckIcon,
  Filter,
  HeartPulse,
  MapPin,
  Phone,
  Search,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const JOBS = [
  {
    id: "JOB-2041",
    type: "GH3 Ceiling Track Install",
    category: "Installation",
    site: "Northgate Care Home",
    location: "Reading, Berkshire",
    engineer: "James S.",
    contact: "Sue Lawson",
    phone: "07712 334 221",
    date: "Today, 09:00 – 14:00",
    status: "In Progress",
    linked_rams: "RAMS-2041",
    notes: "Additional bracket support required. Check suspended ceiling condition on arrival.",
  },
  {
    id: "SV-8832",
    type: "Hoist Weight & Load Test",
    category: "Inspection",
    site: "Swindon General Hospital",
    location: "Swindon, Wiltshire",
    engineer: "James S.",
    contact: "Dr. R. Patel",
    phone: "01793 604 000",
    date: "Today, 14:30 – 16:30",
    status: "Scheduled",
    linked_rams: null,
    notes: null,
  },
  {
    id: "JOB-2039",
    type: "GH5 Sling Replacement",
    category: "Maintenance",
    site: "Royal Surrey Hospital",
    location: "Guildford, Surrey",
    engineer: "James S.",
    contact: "Ward Manager — Lynne",
    phone: "07891 445 221",
    date: "Fri 28 Feb, 10:00",
    status: "Scheduled",
    linked_rams: "RAMS-2039",
    notes: "Carry spare GH5 sling set (x3).",
  },
  {
    id: "SV-8790",
    type: "Annual LOLER Inspection",
    category: "Compliance",
    site: "St. Jude Clinic",
    location: "Basingstoke, Hampshire",
    engineer: "James S.",
    contact: "Clinic Secretary",
    phone: "01256 312 400",
    date: "Mon 3 Mar, 08:30",
    status: "Upcoming",
    linked_rams: null,
    notes: null,
  },
  {
    id: "JOB-2035",
    type: "GH3 Track Extension",
    category: "Installation",
    site: "Eastbourne District Hospital",
    location: "Eastbourne, East Sussex",
    engineer: "James S.",
    contact: "Tom H. (Estates)",
    phone: "01323 417 400",
    date: "Tue 18 Feb",
    status: "Completed",
    linked_rams: "RAMS-2035",
    notes: "Sign-off obtained. Certificate filed.",
  },
  {
    id: "JOB-2031",
    type: "New Hoist Install + Commission",
    category: "Installation",
    site: "Frimley Park Hospital",
    location: "Camberley, Surrey",
    engineer: "James S.",
    contact: "Purchasing — Ellen Ward",
    phone: "01276 604 604",
    date: "Mon 10 Feb",
    status: "Completed",
    linked_rams: "RAMS-2031",
    notes: null,
  },
];

const TABS = ["All", "Today", "Upcoming", "Completed"] as const;
type Tab = (typeof TABS)[number];

const STATUS_CONFIG: Record<string, { label: string; style: string }> = {
  "In Progress": { label: "In Progress", style: "text-amber-700 bg-amber-50 border-amber-200" },
  Scheduled: { label: "Scheduled", style: "text-sky-700 bg-sky-50 border-sky-200" },
  Upcoming: { label: "Upcoming", style: "text-slate-600 bg-slate-50 border-slate-200" },
  Completed: { label: "Completed", style: "text-emerald-700 bg-emerald-50 border-emerald-200" },
};

const CATEGORY_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  Installation: Activity,
  Inspection: HeartPulse,
  Maintenance: FileCheckIcon,
  Compliance: FileCheckIcon,
};

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<(typeof JOBS)[0] | null>(null);

  const filtered = JOBS.filter((j) => {
    const matchTab =
      activeTab === "All" ||
      (activeTab === "Today" && j.date.startsWith("Today")) ||
      (activeTab === "Upcoming" && (j.status === "Upcoming" || j.status === "Scheduled")) ||
      (activeTab === "Completed" && j.status === "Completed");
    const matchQuery =
      !query ||
      j.id.toLowerCase().includes(query.toLowerCase()) ||
      j.site.toLowerCase().includes(query.toLowerCase()) ||
      j.type.toLowerCase().includes(query.toLowerCase());
    return matchTab && matchQuery;
  });

  return (
    <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 py-10 pb-24 flex gap-8">
      {/* Main Column */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="flex-1 flex flex-col gap-6 min-w-0"
      >
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-[1.9rem] font-bold tracking-tight text-slate-900 leading-[1.1]">My Jobs</h1>
            <p className="text-[14px] font-medium text-slate-500 mt-1.5">
              {JOBS.filter((j) => j.status !== "Completed").length} active &middot; {JOBS.filter((j) => j.status === "Completed").length} completed this month
            </p>
          </div>
          <div className="relative group w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
            <input
              type="text"
              placeholder="Search ID, site, or type..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white border border-slate-200/80 rounded-full py-2.5 pl-10 pr-4 text-[13px] font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-300 shadow-[0_2px_12px_rgba(15,23,42,0.03)] transition-all placeholder:text-slate-400"
            />
          </div>
        </header>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200">
          {TABS.map((tab) => {
            const count = JOBS.filter((j) =>
              tab === "All" ? true :
              tab === "Today" ? j.date.startsWith("Today") :
              tab === "Upcoming" ? (j.status === "Upcoming" || j.status === "Scheduled") :
              j.status === "Completed"
            ).length;
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
                    layoutId="jobs-tab"
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

        {/* Job List */}
        <div className="bg-white border border-slate-200/80 rounded-[24px] shadow-[0_24px_64px_rgba(15,23,42,0.04)] ring-1 ring-slate-100 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-24 flex flex-col items-center gap-4 text-slate-400">
              <Filter className="w-10 h-10 text-slate-200" />
              <p className="text-sm font-bold tracking-wide uppercase">No jobs found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((job) => {
                const Icon = CATEGORY_ICON[job.category] ?? Activity;
                const statusCfg = STATUS_CONFIG[job.status];
                const isActive = selected?.id === job.id;
                return (
                  <button
                    key={job.id}
                    onClick={() => setSelected(isActive ? null : job)}
                    className={cn(
                      "w-full text-left p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors",
                      isActive ? "bg-slate-50 border-l-2 border-l-slate-900" : "hover:bg-slate-50/60 border-l-2 border-l-transparent"
                    )}
                  >
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "w-12 h-12 rounded-[16px] border flex items-center justify-center flex-shrink-0 shadow-sm transition-all",
                        isActive ? "bg-slate-900 text-white border-slate-800" : "bg-slate-50 text-slate-500 border-slate-200"
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-[14px] font-bold text-slate-900">{job.id}</span>
                          <span className="px-2 py-0.5 rounded-[6px] bg-white border border-slate-200 text-[9px] font-bold tracking-widest uppercase text-slate-500 shadow-sm">{job.category}</span>
                        </div>
                        <p className="text-[13px] font-semibold text-slate-700">{job.type}</p>
                        <p className="text-[12px] font-medium text-slate-400 flex items-center gap-1.5 mt-0.5"><Building2 className="w-3 h-3" />{job.site}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 sm:flex-col sm:items-end sm:gap-2">
                      <span className={cn("px-2.5 py-1 rounded-[8px] border text-[10px] font-bold tracking-widest uppercase whitespace-nowrap", statusCfg.style)}>{statusCfg.label}</span>
                      <span className="text-[12px] font-semibold text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{job.date}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>

      {/* Detail Sidebar */}
      <AnimatePresence>
        {selected && (
          <motion.aside
            key={selected.id}
            initial={{ opacity: 0, x: 24, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 360 }}
            exit={{ opacity: 0, x: 24, width: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="hidden lg:flex flex-col bg-white border border-slate-200/80 rounded-[24px] shadow-[0_24px_64px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 overflow-hidden h-fit sticky top-28 shrink-0"
          >
            <div className="p-6 border-b border-slate-100 bg-slate-50/60 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-guld-600 bg-guld-50 px-2 py-0.5 rounded border border-guld-100 inline-block mb-2">{selected.category}</p>
                <h2 className="text-[16px] font-bold text-slate-900 leading-snug">{selected.id}</h2>
                <p className="text-[13px] font-semibold text-slate-500 mt-1">{selected.type}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors shrink-0">
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-6">
              {/* Site */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">Site Details</span>
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[13px] font-bold text-slate-900">{selected.site}</p>
                    <p className="text-[12px] font-medium text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{selected.location}</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Contact */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">Site Contact</span>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <p className="text-[13px] font-semibold text-slate-900">{selected.contact}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <p className="text-[13px] font-semibold text-slate-700">{selected.phone}</p>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Time */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">Schedule</span>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <p className="text-[13px] font-semibold text-slate-900">{selected.date}</p>
                </div>
              </div>

              {/* Notes */}
              {selected.notes && (
                <>
                  <div className="h-px bg-slate-100" />
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">Engineer Notes</span>
                    <p className="text-[13px] font-medium text-slate-600 leading-relaxed bg-slate-50 rounded-[14px] p-4 border border-slate-200">{selected.notes}</p>
                  </div>
                </>
              )}

              {/* RAMS Link */}
              {selected.linked_rams && (
                <>
                  <div className="h-px bg-slate-100" />
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">Linked RAMS</span>
                    <div className="flex items-center gap-3 p-4 rounded-[14px] bg-slate-50 border border-slate-200 hover:bg-white hover:border-slate-300 cursor-pointer transition-all group">
                      <FileCheckIcon className="w-5 h-5 text-emerald-600" />
                      <div className="flex flex-col gap-0.5 flex-1">
                        <span className="text-[13px] font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{selected.linked_rams}</span>
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">View Document →</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="pt-2 flex flex-col gap-3">
                {selected.status !== "Completed" && (
                  <button className="w-full h-11 rounded-[14px] bg-slate-900 hover:bg-slate-800 text-white text-[12px] font-bold uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Mark Complete
                  </button>
                )}
                <button className="w-full h-11 rounded-[14px] bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[12px] font-bold uppercase tracking-widest shadow-sm transition-all flex items-center justify-center gap-2">
                  <ChevronRight className="w-4 h-4" /> Open Full Record
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
