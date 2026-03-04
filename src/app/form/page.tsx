'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Search, ChevronLeft, Check, Loader2, Scan, BookOpen, Clock, FileText, Zap, GraduationCap, Lightbulb, MessageSquare, ChevronDown, QrCode, Plus, Minus } from 'lucide-react';


const StockTakeMockup = () => {
  const items = [
    { name: "Ceiling Hook Assembly", part: "GLD-CHA-120", qty: "x3" },
    { name: "C-Rail Bracket Set", part: "GLD-CRS-045", qty: "x12" },
    { name: "HC300 Remote Unit", part: "GLD-RC-300", qty: "x1" }
  ];
  const [idx, setIdx] = useState(0);
  const [flash, setFlash] = useState(false);

  const handleScan = () => {
    setFlash(true);
    setIdx((i) => (i + 1) % items.length);
    setTimeout(() => setFlash(false), 300);
  };

  return (
    <div className="w-full max-w-[240px] mx-auto mt-4 overflow-hidden rounded-[28px] border-2 border-[rgba(255,255,255,0.1)] bg-[#0A0A0A] relative hover:scale-[1.02] transition-transform cursor-pointer" onClick={handleScan}>
      <div className="absolute top-0 inset-x-0 h-4 bg-[#0A0A0A] z-10 flex justify-center">
        <div className="w-16 h-3 bg-black rounded-b-xl"></div>
      </div>
      <div className="p-4 pt-6 h-[220px] flex flex-col relative">
        <div className="text-center mb-2">
          <div className="text-[10px] text-[#F4B626] font-bold tracking-widest">STOCK TAKE</div>
          <div className="text-[10px] text-[#555] h-3">{flash ? <span className="text-[#F4B626] font-bold">ITEM FOUND</span> : 'Tap item to scan'}</div>
        </div>
        
        <div className="flex-1 flex items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            
            {/* Constant subtle pulse - always present */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border border-[#F4B626]/20 animate-ping opacity-30"></div>
            </div>
            {/* Flash overlay - only shows on scan */}
            {flash && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-green-500/20 animate-pulse"></div>
              </div>
            )}

          </div>
          <div className="w-20 h-20 border-2 border-[#F4B626]/20 relative flex items-center justify-center">
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#F4B626]"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-[#F4B626]"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-[#F4B626]"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[#F4B626]"></div>
            <QrCode className="w-8 h-8 text-[#333]" />
          </div>
        </div>

        <div className="bg-[#111] rounded-lg p-2.5 mt-2 border border-white/5">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-white text-[13px] font-medium leading-tight">{items[idx].name}</div>
              <div className="text-[#555] text-[11px] mt-0.5">{items[idx].part}</div>
            </div>
            <div className="bg-[#F4B626]/10 text-[#F4B626] text-[11px] font-bold px-1.5 py-0.5 rounded">{items[idx].qty}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimeLoggerMockup = () => {
  const [hours, setHours] = useState(7.5);
  
  const handleDec = (e: React.MouseEvent) => { e.stopPropagation(); setHours(h => Math.max(0.5, h - 0.5)); };
  const handleInc = (e: React.MouseEvent) => { e.stopPropagation(); setHours(h => Math.min(12, h + 0.5)); };

  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  return (
    <div className="w-full max-w-[240px] mx-auto mt-4 overflow-hidden rounded-[28px] border-2 border-[rgba(255,255,255,0.1)] bg-[#0A0A0A] relative hover:scale-[1.02] transition-transform">
      <div className="absolute top-0 inset-x-0 h-4 bg-[#0A0A0A] z-10 flex justify-center">
        <div className="w-16 h-3 bg-black rounded-b-xl"></div>
      </div>
      <div className="p-4 pt-6 h-[220px] flex flex-col">
        <div className="text-center mb-3">
          <div className="text-[10px] text-[#F4B626] font-bold tracking-widest">TIME LOG</div>
          <div className="text-[10px] text-[#555]">Today - {date}</div>
        </div>

        <div className="bg-[#1A1A1A] rounded-md px-3 py-2 flex items-center justify-between mb-4 border border-white/5">
          <span className="text-white text-[12px] truncate">St. Mary's - Hoist Install</span>
          <ChevronDown className="w-3 h-3 text-[#666]" />
        </div>

        <div className="flex items-center justify-between px-4 mb-4">
          <button onClick={handleDec} className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-white/5 text-white hover:bg-[#222]">
            <Minus className="w-4 h-4" />
          </button>
          <div className="text-3xl font-light text-white tracking-tight">{hours.toFixed(1)}</div>
          <button onClick={handleInc} className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-white/5 text-white hover:bg-[#222]">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-auto">
          <button className="w-full bg-[#F4B626] text-black text-[12px] font-bold py-2 rounded-lg">LOG IT</button>
          <div className="text-center mt-2 text-[9px] text-[#444] italic">Syncs to SharePoint automatically</div>
        </div>
      </div>
    </div>
  );
};

const QuoteAssistantMockup = () => {
  return (
    <div className="w-full max-w-[240px] mx-auto mt-4 overflow-hidden rounded-[28px] border-2 border-[rgba(255,255,255,0.1)] bg-[#0A0A0A] relative hover:scale-[1.02] transition-transform">
      <div className="absolute top-0 inset-x-0 h-4 bg-[#0A0A0A] z-10 flex justify-center">
        <div className="w-16 h-3 bg-black rounded-b-xl"></div>
      </div>
      <div className="p-3 pt-6 h-[220px] flex flex-col">
        <div className="text-center mb-3">
          <div className="text-[10px] text-[#F4B626] font-bold tracking-widest">QUOTE ASSISTANT</div>
        </div>

        <div className="space-y-2 flex-1">
          <div className="flex justify-end">
            <div className="bg-[#F4B626] text-black text-[10px] p-2 rounded-xl rounded-tr-sm max-w-[85%] leading-tight">
              Customer needs ceiling hoist for 2-bed ward, weight limit 200kg
            </div>
          </div>
          
          <div className="flex justify-start">
            <div className="bg-[#1A1A1A] border border-white/5 text-white text-[10px] p-2 rounded-xl rounded-tl-sm max-w-[85%] leading-tight flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin text-[#F4B626] shrink-0" />
              Got it. Generating quote for GH5 Hoist System...
            </div>
          </div>

          <div className="flex justify-start">
            <div className="bg-[#1A1A1A] border border-white/5 text-white text-[10px] p-2 rounded-xl rounded-tl-sm max-w-[85%] leading-tight">
              <div className="mb-1.5">Draft ready. GH5 + C-Rail Kit + Installation. Est. £4,200.</div>
              <button className="bg-[#F4B626]/20 text-[#F4B626] font-medium px-2 py-1 rounded text-[9px]">View Quote</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const AskTheManualMockup = () => {
  const [queryIdx, setQueryIdx] = useState(0);
  const [flash, setFlash] = useState(false);
  
  const queries = [
    {
      q: "Max SWL for GH3 hoist?",
      a: "Maximum Safe Working Load: 205kg",
      tag: "p.12 - GH3 Technical Manual",
      sub: "See also: p.14 for load chart"
    },
    {
      q: "Error code E04 on HC300?",
      a: "Motor overheat. Reset via p.89, HC300 Service Manual",
      tag: "p.89 - HC300 Service Manual",
      sub: "Wait 15 mins before reset"
    },
    {
      q: "C-rail min bend radius?",
      a: "1,200mm minimum. See p.31, C-Rail Installation Guide",
      tag: "p.31 - C-Rail Guide",
      sub: "See also: Track limits table"
    }
  ];

  const handleNext = () => {
    setFlash(true);
    setQueryIdx((i) => (i + 1) % queries.length);
    setTimeout(() => setFlash(false), 300);
  };

  const current = queries[queryIdx];

  return (
    <div className="w-full max-w-[240px] mx-auto mt-4 overflow-hidden rounded-[28px] border-2 border-[rgba(255,255,255,0.1)] bg-[#0A0A0A] relative hover:scale-[1.02] transition-transform cursor-pointer" onClick={handleNext}>
      <div className="absolute top-0 inset-x-0 h-4 bg-[#0A0A0A] z-10 flex justify-center">
        <div className="w-16 h-3 bg-black rounded-b-xl"></div>
      </div>
      <div className="p-4 pt-6 h-[220px] flex flex-col">
        <div className="text-center mb-3">
          <div className="text-[10px] text-[#F4B626] font-bold tracking-widest">ASK THE MANUAL</div>
        </div>

        <div className="bg-[#1A1A1A] rounded-full px-3 py-2 flex items-center gap-2 mb-4 border border-white/5">
          <Search className="w-3.5 h-3.5 text-[#666]" />
          <span className="text-[11px] text-[#888] truncate select-none">{current.q}</span>
        </div>

        <div className="flex-1 relative">
          <div className={`absolute inset-0 bg-[#111] rounded-xl p-3 border border-white/5 flex flex-col transition-colors duration-300 ${flash ? 'border-[#F4B626]/50 bg-[#F4B626]/10' : ''}`}>
            <div className="inline-block bg-[#F4B626] text-black text-[9px] font-bold px-1.5 py-0.5 rounded self-start mb-2">
              {current.tag}
            </div>
            <div className="text-white text-[11px] font-medium leading-tight mb-1">
              {current.a}
            </div>
            <div className="text-[#555] text-[10px] mt-auto">
              {current.sub}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportBuilderMockup = () => {
  const [reportState, setReportState] = useState<'idle' | 'generating' | 'done'>('idle');

  const handleGenerate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (reportState !== 'idle') {
      setReportState('idle');
      return;
    }
    setReportState('generating');
    setTimeout(() => {
      setReportState('done');
    }, 1500);
  };

  return (
    <div className="w-full max-w-[240px] mx-auto mt-4 overflow-hidden rounded-[28px] border-2 border-[rgba(255,255,255,0.1)] bg-[#0A0A0A] relative hover:scale-[1.02] transition-transform">
      <div className="absolute top-0 inset-x-0 h-4 bg-[#0A0A0A] z-10 flex justify-center">
        <div className="w-16 h-3 bg-black rounded-b-xl"></div>
      </div>
      <div className="p-4 pt-6 h-[220px] flex flex-col">
        <div className="text-center mb-3">
          <div className="text-[10px] text-[#F4B626] font-bold tracking-widest">REPORT BUILDER</div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="bg-[#111] rounded p-2 border border-white/5 flex flex-col gap-0.5">
            <span className="text-[#555] text-[9px]">Site</span>
            <span className="text-white text-[11px]">St. Mary's Hospital</span>
          </div>
          <div className="bg-[#111] rounded p-2 border border-white/5 flex flex-col gap-0.5">
            <span className="text-[#555] text-[9px]">Visit Type</span>
            <span className="text-white text-[11px]">Annual Inspection</span>
          </div>
          <div className="bg-[#111] rounded p-2 border border-white/5 flex flex-col gap-0.5">
            <span className="text-[#555] text-[9px]">Engineer</span>
            <span className="text-white text-[11px]">Dan Mitchell</span>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <button 
            onClick={handleGenerate}
            className={`w-full text-black text-[12px] font-bold py-2 rounded-lg transition-colors ${reportState === 'done' ? 'bg-white' : 'bg-[#F4B626]'}`}
          >
            {reportState === 'done' ? 'Reset' : 'Generate Report'}
          </button>
          
          <div className="h-4 flex items-center justify-center">
            {reportState === 'idle' && <span className="text-[10px] text-[#444]">Ready to generate</span>}
            {reportState === 'generating' && (
              <div className="flex items-center gap-1.5 text-[10px] text-[#F4B626]">
                <Loader2 className="w-3 h-3 animate-spin" /> Generating PDF...
              </div>
            )}
            {reportState === 'done' && (
              <div className="flex items-center gap-1 text-[10px] text-green-500">
                <Check className="w-3 h-3" /> Report ready - 4 pages
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TrainingTrackerMockup = () => {
  const [expanded, setExpanded] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSent(true);
    setTimeout(() => setSent(false), 1000);
  };

  return (
    <div className="w-full max-w-[240px] mx-auto mt-4 overflow-hidden rounded-[28px] border-2 border-[rgba(255,255,255,0.1)] bg-[#0A0A0A] relative hover:scale-[1.02] transition-transform">
      <div className="absolute top-0 inset-x-0 h-4 bg-[#0A0A0A] z-10 flex justify-center">
        <div className="w-16 h-3 bg-black rounded-b-xl"></div>
      </div>
      <div className="p-4 pt-6 h-[220px] flex flex-col">
        <div className="text-center mb-1">
          <div className="text-[10px] text-[#F4B626] font-bold tracking-widest">TRAINING TRACKER</div>
          <div className="text-[10px] text-[#555]">4 of 5 compliant</div>
        </div>

        <div className="w-full h-1 bg-[#222] rounded-full overflow-hidden mb-4">
          <div className="h-full bg-[#F4B626] w-[80%] rounded-full"></div>
        </div>

        <div className="flex-1 space-y-1.5 overflow-hidden">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></div>
            <div>
              <div className="text-[11px] text-white">Dan M.</div>
              <div className="text-[9px] text-[#555]">Moving & Handling - up to date</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></div>
            <div>
              <div className="text-[11px] text-white">Sarah K.</div>
              <div className="text-[9px] text-[#555]">Fire Safety - up to date</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></div>
            <div>
              <div className="text-[11px] text-white">Nathan B.</div>
              <div className="text-[9px] text-[#555]">LOLER - up to date</div>
            </div>
          </div>
          
          <div 
            onClick={() => setExpanded(!expanded)}
            className={`bg-[#111] rounded p-1.5 border ${expanded ? 'border-[#F4B626]/30' : 'border-red-500/20'} cursor-pointer transition-all`}
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
              <div>
                <div className="text-[11px] text-white">Emma T.</div>
                <div className="text-[9px] text-[#F4B626]">Moving & Handling - expires 12 days</div>
              </div>
            </div>
            {expanded && (
              <div className="mt-2 flex justify-end">
                <button 
                  onClick={handleSend}
                  className="bg-[#F4B626] text-black text-[9px] font-bold px-2 py-1 rounded"
                >
                  {sent ? 'Reminder sent!' : 'Send reminder'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-2 text-center">
          <span className="inline-block bg-[#F4B626]/10 text-[#F4B626] text-[9px] px-2 py-0.5 rounded-full">
            1 renewal due
          </span>
        </div>
      </div>
    </div>
  );
};

// Reusable custom checkbox component
const CustomCheckbox = ({ 
  checked, 
  onChange, 
  label, 
  id 
}: { 
  checked: boolean, 
  onChange: (checked: boolean) => void, 
  label: string, 
  id: string 
}) => (
  <label htmlFor={id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#F4B626] cursor-pointer transition-colors bg-white">
    <div className="relative flex items-center justify-center mt-0.5">
      <input 
        type="checkbox" 
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <div className={`w-5 h-5 rounded border ${checked ? 'bg-[#F4B626] border-[#F4B626]' : 'border-gray-300'} peer-focus:ring-2 peer-focus:ring-[#F4B626] peer-focus:ring-offset-1 transition-colors flex items-center justify-center`}>
        {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
      </div>
    </div>
    <span className="text-gray-700 leading-tight">{label}</span>
  </label>
);

// Reusable custom radio component
const CustomRadio = ({ 
  checked, 
  onChange, 
  label, 
  id,
  name
}: { 
  checked: boolean, 
  onChange: () => void, 
  label: string, 
  id: string,
  name: string
}) => (
  <label htmlFor={id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#F4B626] cursor-pointer transition-colors bg-white">
    <div className="relative flex items-center justify-center">
      <input 
        type="radio" 
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <div className={`w-5 h-5 rounded-full border ${checked ? 'border-[#F4B626]' : 'border-gray-300'} peer-focus:ring-2 peer-focus:ring-[#F4B626] peer-focus:ring-offset-1 transition-colors flex items-center justify-center`}>
        {checked && <div className="w-2.5 h-2.5 rounded-full bg-[#F4B626]" />}
      </div>
    </div>
    <span className="text-gray-700">{label}</span>
  </label>
);

// Reusable Hint Box component
const HintBox = ({ title, children }: { title: React.ReactNode, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mt-4 mb-6 rounded-lg border-l-4 border-[#F4B626] bg-[rgba(244,182,38,0.08)] overflow-hidden">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[rgba(244,182,38,0.12)] transition-colors"
      >
        <div className="flex items-center gap-2 text-gray-800 font-semibold">
          <Lightbulb className="w-5 h-5 text-[#F4B626]" />
          <span>{title}</span>
        </div>
        <div className="text-sm font-medium text-gray-600 flex items-center gap-1">
          {isOpen ? 'Hide' : 'Show examples'}
          <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 pt-1 text-sm text-gray-700 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


const DEPARTMENTS: { value: string; sub?: string }[] = [
  { value: 'Technical', sub: 'Technicians, IT, Stepless' },
  { value: 'Marketing' },
  { value: 'Operations' },
  { value: 'Contracts' },
  { value: 'Sales', sub: 'Stepless, Trusts, Other' },
  { value: 'Manager', sub: 'All departments' },
];

const DepartmentPicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full px-4 py-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
          value ? 'border-[#F4B626] bg-[#F4B626]/5 text-gray-800 font-medium' : 'border-gray-300 text-gray-400 bg-white'
        } focus:outline-none focus:ring-1 focus:ring-[#F4B626]`}
      >
        <span>{value || 'Select your department'}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 grid grid-cols-2 gap-2">
              {DEPARTMENTS.map(dept => (
                <button
                  key={dept.value}
                  type="button"
                  onMouseEnter={() => setHovered(dept.value)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => {
                    onChange(dept.value);
                    setOpen(false);
                  }}
                  className={`relative px-4 py-3 rounded-lg border text-left transition-all ${
                    value === dept.value
                      ? 'border-[#F4B626] bg-[#F4B626]/10 text-gray-800'
                      : 'border-gray-200 bg-white hover:border-[#F4B626] hover:bg-[#F4B626]/5 text-gray-700'
                  }`}
                >
                  <span className="block font-semibold text-[13px]">{dept.value}</span>
                  <span className={`block text-[11px] mt-0.5 transition-colors duration-150 ${
                    dept.sub && (hovered === dept.value || value === dept.value)
                      ? 'text-[#F4B626]'
                      : 'text-transparent select-none'
                  }`}>
                    {dept.sub || '\u00A0'}
                  </span>
                  {value === dept.value && (
                    <div className="absolute top-2 right-2">
                      <Check className="w-3.5 h-3.5 text-[#F4B626]" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function GuldmannForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Step 1
    name: '',
    jobTitle: '',
    department: '',
    brand: '',
    tenure: '',
    
    // Step 2
    mainAreas: [] as string[],
    otherArea: '',
    repetitiveHours: '',
    
    // Step 3
    tools: [] as string[],
    otherTool: '',
    spreadsheetComfort: 0, // 1-5
    sharepointUse: '',
    sharepointEase: '',
    
    // Step 4
    aiUsed: '',
    aiToolsDetails: '',
    aiInterests: [] as string[],
    aiAttitude: '',
    
    // Step 5
    frustrations: '',
    wishFaster: '',
    magicWand: '',
    otherFeedback: '',
    consent: false
  });

  const totalSteps = 5;

  const scrollToTop = () => {
    document.getElementById('form-top')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNext = () => {
    // Basic validation
    if (step === 1 && (!formData.name || !formData.jobTitle || !formData.department || !formData.brand || !formData.tenure)) {
      setError('Please fill in all required fields.');
      return;
    }
    if (step === 2 && (formData.mainAreas.length === 0 || !formData.repetitiveHours)) {
      setError('Please select your main areas of work and estimated repetitive hours.');
      return;
    }
    if (step === 3 && (formData.tools.length === 0 || formData.spreadsheetComfort === 0 || !formData.sharepointUse || (['Yes', 'Sometimes'].includes(formData.sharepointUse) && !formData.sharepointEase))) {
      setError('Please answer all questions about your tools and software usage.');
      return;
    }
    if (step === 4 && (!formData.aiUsed || (formData.aiUsed === 'Yes' && !formData.aiToolsDetails) || formData.aiInterests.length === 0 || !formData.aiAttitude)) {
      setError('Please answer all questions about your AI and automation interests.');
      return;
    }
    
    setError('');
    scrollToTop();
    setStep(s => Math.min(s + 1, totalSteps));
  };

  const handlePrev = () => {
    setError('');
    scrollToTop();
    setStep(s => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    if (!formData.consent) {
      setError('Please consent to your responses being reviewed.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('https://formspree.io/f/mkovaddd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for array toggles (checkboxes)
  const toggleArrayItem = (field: 'mainAreas' | 'tools' | 'aiInterests', value: string, maxItems?: number) => {
    setFormData(prev => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      } else {
        if (maxItems && current.length >= maxItems) return prev;
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-[100dvh] bg-[#FAFAFA] text-[#171717] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full text-center border border-gray-100"
        >
          <div className="w-20 h-20 bg-[#F4B626]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-[#cd962b]" strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Thank you, {formData.name.split(' ')[0]}!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Your responses have been securely submitted. The project team will review these insights to help improve our tools and processes.
          </p>
          <a href="https://www.guldmann.com/uk/" className="inline-block bg-[#111111] text-white px-8 py-3 rounded-lg font-medium hover:bg-black transition-colors">
            Return to Guldmann Website
          </a>
        </motion.div>
      </div>
    );
  }

  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  const getStepTitle = (s: number) => {
    switch (s) {
      case 1: return "About You";
      case 2: return "What You Do";
      case 3: return "Tools & Software";
      case 4: return "AI & Automation";
      case 5: return "Making Life Easier";
      default: return "";
    }
  };

  return (
    <div className="font-sans text-[#171717]">
      {/* SECTION A - The Form (Viewport height focus) */}
      <div id="form-top" className="min-h-[100dvh] flex flex-col bg-[#FAFAFA]">
        
        {/* Compact Header Strip */}
        <header className="h-[72px] bg-[#111111] text-white px-4 md:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center">
            <Image src="/guldmann-logo-stacked-white.png" alt="Guldmann" width={60} height={44} className="object-contain" unoptimized />
          </div>
          
          <div className="hidden md:flex items-center gap-3">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => {
                   if (num < step) setStep(num);
                }}
                disabled={num >= step}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                  ${num === step ? 'bg-[#F4B626] text-white' : ''}
                  ${num < step ? 'bg-[#F4B626] text-white cursor-pointer hover:bg-[#cd962b]' : ''}
                  ${num > step ? 'border border-gray-600 text-gray-500 cursor-not-allowed' : ''}
                `}
              >
                {num < step ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : num}
              </button>
            ))}
          </div>

          <button 
            onClick={() => document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[rgba(244,182,38,0.15)] border border-[rgba(244,182,38,0.5)] text-[#F4B626] text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-[rgba(244,182,38,0.25)] transition-all"
            style={{ boxShadow: '0 0 12px rgba(244,182,38,0.4)' }}
          >
            <Zap className="w-3.5 h-3.5" /> See what could be built
          </button>
        </header>

        {/* Teaser Strip */}
        <div 
          onClick={() => document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="cursor-pointer shrink-0 bg-[#0D0D0D] flex items-center justify-center gap-3 group"
          style={{ height: '52px' }}
        >
          <Zap className="w-3.5 h-3.5 text-[#F4B626]" />
          <span className="text-xs text-[#666] font-semibold tracking-widest uppercase group-hover:text-[#999] transition-colors">
            See what could be built for your team
          </span>
          <ChevronDown className="w-4 h-4 text-[#F4B626] animate-bounce" />
        </div>

        {/* Form Card Area (takes remaining viewport) */}
        <main className="flex-1 overflow-hidden flex items-stretch">

          {/* Left sidebar - tool teasers (desktop only) */}
          <div className="hidden xl:flex flex-col justify-center gap-3 px-6 py-8 w-[220px] shrink-0">
            {[
              { icon: <Scan className="w-4 h-4 text-[#F4B626]" />, name: 'Smart Stock Take', desc: 'Tap to log inventory' },
              { icon: <BookOpen className="w-4 h-4 text-[#F4B626]" />, name: 'Ask the Manual', desc: 'AI over every document' },
              { icon: <Clock className="w-4 h-4 text-[#F4B626]" />, name: 'Time Logger', desc: 'Log a day in 10 seconds' },
            ].map(tool => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-start gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm cursor-pointer hover:border-[#F4B626]/40 hover:shadow-md transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#F4B626]/10 flex items-center justify-center shrink-0 group-hover:bg-[#F4B626]/20 transition-colors">{tool.icon}</div>
                <div>
                  <div className="text-[12px] font-semibold text-gray-700 leading-tight">{tool.name}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{tool.desc}</div>
                </div>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-[11px] text-gray-300 text-center pt-1"
            >
              + 3 more below
            </motion.div>
          </div>

          {/* Center - the form */}
          <div className="flex-1 flex flex-col items-center justify-center p-0 md:p-6 overflow-hidden">
          <div className="w-full max-w-3xl h-full md:h-auto md:max-h-full bg-white md:rounded-2xl shadow-none md:shadow-xl border-0 md:border border-gray-100 flex flex-col overflow-hidden">
            
            {/* Slim Card Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <h1 className="font-bold text-lg text-gray-800">{getStepTitle(step)}</h1>
              <span className="text-sm font-medium text-gray-400">
                Step {step} of {totalSteps}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-100 h-[3px] w-full shrink-0">
              <motion.div 
                className="h-full bg-[#F4B626]"
                initial={{ width: 0 }}
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  
                  {/* --- STEP 1: ABOUT YOU --- */}
                  {step === 1 && (
                    <div className="space-y-6 max-w-xl mx-auto">
                      
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="block text-[14px] font-semibold text-gray-700">Full Name <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          id="name"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#F4B626] focus:ring-1 focus:ring-[#F4B626] outline-none transition-all"
                          placeholder="Jane Doe"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label htmlFor="jobTitle" className="block text-[14px] font-semibold text-gray-700">Job Title / Role <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          id="jobTitle"
                          value={formData.jobTitle}
                          onChange={e => setFormData({...formData, jobTitle: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#F4B626] focus:ring-1 focus:ring-[#F4B626] outline-none transition-all"
                          placeholder="e.g. Regional Sales Manager"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[14px] font-semibold text-gray-700">Department <span className="text-red-500">*</span></label>
                        <DepartmentPicker
                          value={formData.department}
                          onChange={v => setFormData({...formData, department: v})}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[14px] font-semibold text-gray-700">Which brand do you work under? <span className="text-red-500">*</span></label>
                        <div className="flex gap-3 flex-wrap">
                          {['Guldmann', 'Stepless', 'Both'].map(brand => (
                            <label key={brand} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-all select-none ${
                              formData.brand === brand ? 'border-[#F4B626] bg-[#F4B626]/10 text-gray-800 font-semibold' : 'border-gray-200 bg-white text-gray-600 hover:border-[#F4B626] hover:bg-[#F4B626]/5'
                            }`}>
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                formData.brand === brand ? 'bg-[#F4B626] border-[#F4B626]' : 'border-gray-300'
                              }`}>
                                {formData.brand === brand && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                              </div>
                              <span className="text-[13px]">{brand}</span>
                              <input type="radio" name="brand" value={brand} checked={formData.brand === brand} onChange={() => setFormData({...formData, brand})} className="sr-only" />
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-[14px] font-semibold text-gray-700">How long have you been at Guldmann? <span className="text-red-500">*</span></label>
                          {formData.tenure && (
                            <span className="text-[13px] font-semibold text-[#cd962b] bg-[#F4B626]/10 px-2.5 py-0.5 rounded-full">{formData.tenure}</span>
                          )}
                        </div>
                        {(() => {
                          const tenureOptions = ['Less than 1 year', '1-3 years', '3-5 years', '5-10 years', '10+ years'];
                          const idx = tenureOptions.indexOf(formData.tenure);
                          const sliderVal = idx === -1 ? 0 : idx;
                          return (
                            <div className="px-1">
                              <input
                                type="range"
                                min={0}
                                max={4}
                                step={1}
                                value={sliderVal}
                                onChange={e => setFormData({...formData, tenure: tenureOptions[Number(e.target.value)]})}
                                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                                style={{
                                  background: `linear-gradient(to right, #F4B626 0%, #F4B626 ${sliderVal * 25}%, #e5e7eb ${sliderVal * 25}%, #e5e7eb 100%)`,
                                  accentColor: '#F4B626',
                                }}
                              />
                              <div className="flex justify-between mt-1.5">
                                {tenureOptions.map((opt, i) => (
                                  <span key={opt} className={`text-[10px] font-medium transition-colors ${i === sliderVal ? 'text-[#cd962b]' : 'text-gray-400'}`} style={{ width: '20%', textAlign: i === 0 ? 'left' : i === 4 ? 'right' : 'center' }}>
                                    {opt}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* --- STEP 2: WHAT YOU DO --- */}
                  {step === 2 && (
                    <div className="space-y-6">
                      
                      <div className="space-y-3">
                        <label className="block text-[14px] font-semibold text-gray-700">Describe your main areas of work (pick all that apply) <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {[
                            'Patient/Client care or coordination',
                            'Sales and account management',
                            'Marketing and communications',
                            'Project management',
                            'Finance and reporting',
                            'IT and systems',
                            'Training and compliance',
                            'Data entry and admin',
                            'Customer service/support',
                            'Other'
                          ].map((area) => (
                            <CustomCheckbox 
                              key={area}
                              id={`area-${area.replace(/\s+/g, '-')}`}
                              label={area}
                              checked={formData.mainAreas.includes(area)}
                              onChange={() => toggleArrayItem('mainAreas', area)}
                            />
                          ))}
                        </div>
                        
                        {formData.mainAreas.includes('Other') && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-1">
                            <input 
                              type="text" 
                              value={formData.otherArea}
                              onChange={e => setFormData({...formData, otherArea: e.target.value})}
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#F4B626] focus:ring-1 focus:ring-[#F4B626] outline-none"
                              placeholder="Please specify..."
                            />
                          </motion.div>
                        )}
                      </div>

                      <div className="space-y-3 pt-4 border-t border-gray-100">
                        <label className="block text-[14px] font-semibold text-gray-700">How many hours a week do you spend on repetitive or manual tasks? <span className="text-red-500">*</span></label>
                        <p className="text-sm text-gray-500 mb-2">Think data entry, copying between systems, formatting reports, etc.</p>
                        
                        <HintBox title="Not sure what could be automated?">
                          <p>Things like copying data between systems, chasing colleagues for updates, formatting the same report every week, filling in the same fields across multiple spreadsheets - all of these can typically be automated.</p>
                        </HintBox>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {[
                            'Less than 2hrs',
                            '2-5hrs',
                            '5-10hrs',
                            '10+ hrs',
                            'Not sure'
                          ].map((time) => (
                            <CustomRadio 
                              key={time}
                              id={`time-${time.replace(/\s+/g, '-')}`}
                              name="repetitiveHours"
                              label={time}
                              checked={formData.repetitiveHours === time}
                              onChange={() => setFormData({...formData, repetitiveHours: time})}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- STEP 3: TOOLS & SOFTWARE --- */}
                  {step === 3 && (
                    <div className="space-y-6">
                      
                      <div className="space-y-3">
                        <label className="block text-[14px] font-semibold text-gray-700">Which of these tools do you use regularly? <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {[
                            'Microsoft Teams',
                            'SharePoint',
                            'Microsoft Excel / Spreadsheets',
                            'Microsoft Word / Documents',
                            'Outlook / Email',
                            'Dynamics 365 / CRM',
                            'SAP or ERP system',
                            'Power BI / Reporting tools',
                            'Adobe products (design/PDF)',
                            'Google Workspace (Docs, Sheets etc)',
                            'Zoom / video calling',
                            'Project management tools',
                            'Other'
                          ].map((tool) => (
                            <CustomCheckbox 
                              key={tool}
                              id={`tool-${tool.replace(/[^a-zA-Z0-9]/g, '-')}`}
                              label={tool}
                              checked={formData.tools.includes(tool)}
                              onChange={() => toggleArrayItem('tools', tool)}
                            />
                          ))}
                        </div>
                        
                        {formData.tools.includes('Other') && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-1">
                            <input 
                              type="text" 
                              value={formData.otherTool}
                              onChange={e => setFormData({...formData, otherTool: e.target.value})}
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#F4B626] focus:ring-1 focus:ring-[#F4B626] outline-none"
                              placeholder="Please specify other tools..."
                            />
                          </motion.div>
                        )}
                      </div>

                      <div className="space-y-4 pt-4 border-t border-gray-100">
                        <label className="block text-[14px] font-semibold text-gray-700">On a scale 1-5, how comfortable are you with spreadsheets? <span className="text-red-500">*</span></label>
                        
                        <div className="flex flex-col space-y-4">
                          <div className="flex justify-between w-full max-w-md mx-auto relative">
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 -translate-y-1/2 rounded-full"></div>
                            
                            {[1, 2, 3, 4, 5].map((num) => (
                              <button
                                key={num}
                                onClick={() => setFormData({...formData, spreadsheetComfort: num})}
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                  formData.spreadsheetComfort === num 
                                    ? 'bg-[#F4B626] text-white shadow-md scale-110' 
                                    : 'bg-white border-2 border-gray-300 text-gray-500 hover:border-[#F4B626] hover:text-[#F4B626]'
                                }`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 max-w-md mx-auto w-full px-2">
                            <span className="text-left w-20 leading-tight">I avoid them</span>
                            <span className="text-right w-20 leading-tight">I build complex ones</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-gray-100">
                        <label className="block text-[14px] font-semibold text-gray-700">Do you use SharePoint regularly? <span className="text-red-500">*</span></label>
                        <div className="flex flex-wrap gap-2.5">
                          {['Yes', 'No', 'Sometimes'].map((opt) => (
                            <div key={opt} className="flex-1 min-w-[100px]">
                              <CustomRadio 
                                id={`sp-${opt}`}
                                name="sharepointUse"
                                label={opt}
                                checked={formData.sharepointUse === opt}
                                onChange={() => setFormData({...formData, sharepointUse: opt})}
                              />
                            </div>
                          ))}
                        </div>

                        <AnimatePresence>
                          {['Yes', 'Sometimes'].includes(formData.sharepointUse) && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }} 
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pt-2 space-y-3"
                            >
                              <label className="block text-[14px] font-semibold text-gray-700">Do you find it easy to use? <span className="text-red-500">*</span></label>
                              <div className="flex flex-wrap gap-2.5">
                                {['Yes', 'No', 'Partially'].map((opt) => (
                                  <div key={opt} className="flex-1 min-w-[100px]">
                                    <CustomRadio 
                                      id={`sp-ease-${opt}`}
                                      name="sharepointEase"
                                      label={opt}
                                      checked={formData.sharepointEase === opt}
                                      onChange={() => setFormData({...formData, sharepointEase: opt})}
                                    />
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {/* --- STEP 4: AI & AUTOMATION --- */}
                  {step === 4 && (
                    <div className="space-y-6">
                      
                      <div className="space-y-3">
                        <label className="block text-[14px] font-semibold text-gray-700">Have you used any AI tools at work? (e.g. ChatGPT, Copilot) <span className="text-red-500">*</span></label>
                        <div className="flex flex-wrap gap-2.5">
                          {['Yes', 'No', 'Not sure'].map((opt) => (
                            <div key={opt} className="flex-1 min-w-[100px]">
                              <CustomRadio 
                                id={`ai-${opt.replace(/\s+/g, '-')}`}
                                name="aiUsed"
                                label={opt}
                                checked={formData.aiUsed === opt}
                                onChange={() => setFormData({...formData, aiUsed: opt})}
                              />
                            </div>
                          ))}
                        </div>
                        
                        <AnimatePresence>
                          {formData.aiUsed === 'Yes' && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }} 
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pt-1"
                            >
                              <input 
                                type="text" 
                                value={formData.aiToolsDetails}
                                onChange={e => setFormData({...formData, aiToolsDetails: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#F4B626] focus:ring-1 focus:ring-[#F4B626] outline-none"
                                placeholder="Which ones? (Required)"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-gray-100">
                        <label className="block text-[14px] font-semibold text-gray-700">Which of these AI-assisted tasks interest you most? <span className="text-red-500">*</span></label>
                        <p className="text-sm text-gray-500 mb-2">Select up to 3</p>
                        
                        <HintBox title="What AI can actually do at work:">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>"Summarise this 40-page report for me" - done in 10 seconds</li>
                            <li>"Draft a reply to this complaint email" - review and send in 2 minutes</li>
                            <li>"Find every mention of [customer] across SharePoint" - instant</li>
                            <li>"I need to write up this site visit" - speak naturally, AI formats it</li>
                          </ul>
                        </HintBox>

                        <div className="grid grid-cols-1 gap-2">
                          {[
                            'Writing/drafting emails and documents',
                            'Summarising long documents or reports',
                            'Answering internal questions automatically',
                            'Finding information quickly across company files',
                            'Automating repetitive data tasks',
                            'Creating reports automatically',
                            'Translating documents or communications',
                            'Scheduling and calendar management',
                            'Training and onboarding support',
                            'I\'m not sure yet'
                          ].map((task) => (
                            <CustomCheckbox 
                              key={task}
                              id={`ai-task-${task.replace(/[^a-zA-Z0-9]/g, '-')}`}
                              label={task}
                              checked={formData.aiInterests.includes(task)}
                              onChange={() => toggleArrayItem('aiInterests', task, 3)}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-gray-100">
                        <label className="block text-[14px] font-semibold text-gray-700">How would you describe your interest in AI tools at work? <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {[
                            'Not interested',
                            'Curious but unsure',
                            'Open to it',
                            'Keen to try',
                            'Already using them'
                          ].map((attitude) => (
                            <CustomRadio 
                              key={attitude}
                              id={`attitude-${attitude.replace(/\s+/g, '-')}`}
                              name="aiAttitude"
                              label={attitude}
                              checked={formData.aiAttitude === attitude}
                              onChange={() => setFormData({...formData, aiAttitude: attitude})}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- STEP 5: MAKING LIFE EASIER --- */}
                  {step === 5 && (
                    <div className="space-y-6">
                      <p className="text-[14px] text-gray-600">Your honest feedback here is incredibly valuable.</p>
                      
                      <HintBox title="Need inspiration? Common examples:">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Filling in the same information across multiple systems</li>
                          <li>Chasing colleagues for sign-offs or updates</li>
                          <li>Manually creating weekly/monthly reports from spreadsheets</li>
                          <li>Formatting and sending the same type of email repeatedly</li>
                          <li>Finding the right document in SharePoint</li>
                          <li>Logging time or activity at the end of the day</li>
                        </ul>
                      </HintBox>
                      
                      <div className="space-y-1.5 mt-2">
                        <label htmlFor="frustrations" className="block text-[14px] font-semibold text-gray-700">What's the most time-consuming or frustrating part of your job?</label>
                        <textarea 
                          id="frustrations"
                          rows={3}
                          value={formData.frustrations}
                          onChange={e => setFormData({...formData, frustrations: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#F4B626] focus:ring-1 focus:ring-[#F4B626] outline-none transition-all resize-none"
                          placeholder="Please be specific..."
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="wishFaster" className="block text-[14px] font-semibold text-gray-700">Is there anything you wish you could do faster or more easily?</label>
                        <textarea 
                          id="wishFaster"
                          rows={3}
                          value={formData.wishFaster}
                          onChange={e => setFormData({...formData, wishFaster: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#F4B626] focus:ring-1 focus:ring-[#F4B626] outline-none transition-all resize-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="magicWand" className="block text-[14px] font-semibold text-gray-700">If you could wave a magic wand and automate one thing in your job, what would it be?</label>
                        <textarea 
                          id="magicWand"
                          rows={2}
                          value={formData.magicWand}
                          onChange={e => setFormData({...formData, magicWand: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#F4B626] focus:ring-1 focus:ring-[#F4B626] outline-none transition-all resize-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="otherFeedback" className="block text-[14px] font-semibold text-gray-700">Any other feedback or suggestions? <span className="font-normal text-gray-400">(Optional)</span></label>
                        <textarea 
                          id="otherFeedback"
                          rows={2}
                          value={formData.otherFeedback}
                          onChange={e => setFormData({...formData, otherFeedback: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#F4B626] focus:ring-1 focus:ring-[#F4B626] outline-none transition-all resize-none"
                        />
                      </div>

                      <div className="pt-6 border-t border-gray-100">
                        <CustomCheckbox 
                          id="consent"
                          label="I'm happy for my responses to be reviewed by the project team *"
                          checked={formData.consent}
                          onChange={(checked) => setFormData({...formData, consent: checked})}
                        />
                      </div>
                    </div>
                  )}
                  
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Footer (Sticky to bottom of card) */}
            <div className="bg-gray-50 px-6 py-4 md:px-8 md:py-5 border-t border-gray-100 flex items-center justify-between shrink-0">
              {step > 1 ? (
                <button 
                  onClick={handlePrev}
                  className="flex items-center gap-2 text-gray-500 hover:text-[#111111] font-medium transition-colors"
                  disabled={isSubmitting}
                >
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
              ) : (
                <div></div>
              )}

              <div className="flex items-center gap-4">
                {error && <span className="text-red-500 text-sm font-medium animate-pulse">{error}</span>}
                
                {step < totalSteps ? (
                  <button 
                    onClick={handleNext}
                    className="bg-[#111111] hover:bg-black text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    Next <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-[#F4B626] hover:bg-[#cd962b] text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        Submit <Check className="w-5 h-5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
            
          </div>
          </div>

          {/* Right sidebar - CTA teaser (desktop only) */}
          <div className="hidden xl:flex flex-col justify-center gap-3 px-6 py-8 w-[220px] shrink-0">
            {[
              { icon: <FileText className="w-4 h-4 text-[#F4B626]" />, name: 'Report Builder', desc: 'PDF reports in seconds' },
              { icon: <MessageSquare className="w-4 h-4 text-[#F4B626]" />, name: 'Quote Assistant', desc: 'Draft quotes instantly' },
              { icon: <GraduationCap className="w-4 h-4 text-[#F4B626]" />, name: 'Training Tracker', desc: 'Team compliance at a glance' },
            ].map(tool => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-start gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm cursor-pointer hover:border-[#F4B626]/40 hover:shadow-md transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#F4B626]/10 flex items-center justify-center shrink-0 group-hover:bg-[#F4B626]/20 transition-colors">{tool.icon}</div>
                <div>
                  <div className="text-[12px] font-semibold text-gray-700 leading-tight">{tool.name}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{tool.desc}</div>
                </div>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={() => document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center justify-center gap-1.5 text-[11px] text-[#F4B626] cursor-pointer hover:text-[#cd962b] transition-colors pt-1 font-medium"
            >
              See all tools <ChevronDown className="w-3 h-3" />
            </motion.div>
          </div>

        </main>
        <div 
          onClick={() => document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="cursor-pointer bg-[#0D0D0D] h-14 flex flex-col items-center justify-center gap-1 group w-full shrink-0"
        >
          <span className="text-xs text-[#555] font-medium group-hover:text-[#888] transition-colors tracking-wide uppercase">See what could be built</span>
          <ChevronDown className="w-4 h-4 text-[#F4B626] animate-bounce" />
        </div>
      </div>

      {/* SECTION B - Tool Cards (Scrolled to on demand) */}
      <div id="tools-section" className="bg-[#0D0D0D] min-h-[100dvh] py-16 px-4 md:px-6 relative flex flex-col">
        <div className="max-w-6xl mx-auto w-full">
          
          <button 
            onClick={() => document.getElementById('form-top')?.scrollIntoView({ behavior: 'smooth' })}
            className="mb-10 px-4 py-2 rounded-full border border-white/10 text-[#999] hover:text-white hover:border-white/20 transition-colors flex items-center gap-2 text-sm mx-auto bg-white/5"
          >
            Back to form &uarr;
          </button>

          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">What could be built for your team</h2>
            <p className="text-[#666] text-lg">Every tool built around your actual workflow. These are examples of what's possible.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
            
            {/* Tool 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0 * 0.07, duration: 0.5 }}
              whileHover={{ boxShadow: '0 0 0 1px rgba(244,182,38,0.5), 0 4px 24px rgba(244,182,38,0.1)' }}
              className="bg-[#111] rounded-xl p-6 border border-white/5 flex flex-col h-full relative group transition-all duration-250 ease-out col-span-1"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-full bg-[rgba(244,182,38,0.12)] flex items-center justify-center group-hover:bg-[#F4B626] transition-colors duration-250">
                  <Scan className="w-6 h-6 text-[#F4B626] group-hover:text-white transition-colors duration-250" />
                </div>
              </div>
              <h3 className="text-[16px] font-bold text-white mb-3">Smart Stock Take</h3>
              <p className="text-[14px] text-[#777] group-hover:text-[#ccc] leading-relaxed transition-colors duration-250 mb-6">
                Tap your phone to any item. Inventory logged, van stock updated, activity trail created. Zero spreadsheets.
              </p>
              <div className="mt-auto mb-6 flex justify-center items-center">
                <StockTakeMockup />
              </div>
              <div className="absolute bottom-6 right-6">
                <span className="px-2 py-0.5 bg-[rgba(244,182,38,0.12)] text-[#cd962b] text-xs font-bold rounded-full">Possible</span>
              </div>
            </motion.div>

            {/* Tool 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 1 * 0.07, duration: 0.5 }}
              whileHover={{ boxShadow: '0 0 0 1px rgba(244,182,38,0.5), 0 4px 24px rgba(244,182,38,0.1)' }}
              className="bg-[#111] rounded-xl p-6 border border-white/5 flex flex-col h-full relative group transition-all duration-250 ease-out col-span-1"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-full bg-[rgba(244,182,38,0.12)] flex items-center justify-center group-hover:bg-[#F4B626] transition-colors duration-250">
                  <BookOpen className="w-6 h-6 text-[#F4B626] group-hover:text-white transition-colors duration-250" />
                </div>
              </div>
              <h3 className="text-[16px] font-bold text-white mb-3">Ask the Manual</h3>
              <p className="text-[14px] text-[#777] group-hover:text-[#ccc] leading-relaxed transition-colors duration-250 mb-6">
                Every Guldmann manual searchable by AI. Ask a question, get the answer with a page reference. 24/7.
              </p>
              <div className="mt-auto mb-6 flex justify-center items-center">
                <AskTheManualMockup />
              </div>
              <div className="absolute bottom-6 right-6">
                <span className="px-2 py-0.5 bg-[rgba(244,182,38,0.12)] text-[#cd962b] text-xs font-bold rounded-full">Possible</span>
              </div>
            </motion.div>

            {/* Tool 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 2 * 0.07, duration: 0.5 }}
              whileHover={{ boxShadow: '0 0 0 1px rgba(244,182,38,0.5), 0 4px 24px rgba(244,182,38,0.1)' }}
              className="bg-[#111] rounded-xl p-6 border border-white/5 flex flex-col h-full relative group transition-all duration-250 ease-out"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-full bg-[rgba(244,182,38,0.12)] flex items-center justify-center group-hover:bg-[#F4B626] transition-colors duration-250">
                  <Clock className="w-6 h-6 text-[#F4B626] group-hover:text-white transition-colors duration-250" />
                </div>
              </div>
              <h3 className="text-[16px] font-bold text-white mb-3">Time Logger</h3>
              <p className="text-[14px] text-[#777] group-hover:text-[#ccc] leading-relaxed transition-colors duration-250 mb-6">
                Log your day in 10 seconds. Auto-syncs to timesheets. No end-of-week guessing.
              </p>
              <div className="mt-auto mb-6 flex justify-center items-center">
                <TimeLoggerMockup />
              </div>
              <div className="absolute bottom-6 right-6">
                <span className="px-2 py-0.5 bg-[rgba(244,182,38,0.12)] text-[#cd962b] text-xs font-bold rounded-full">Possible</span>
              </div>
            </motion.div>

            {/* Tool 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 3 * 0.07, duration: 0.5 }}
              whileHover={{ boxShadow: '0 0 0 1px rgba(244,182,38,0.5), 0 4px 24px rgba(244,182,38,0.1)' }}
              className="bg-[#111] rounded-xl p-6 border border-white/5 flex flex-col h-full relative group transition-all duration-250 ease-out"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-full bg-[rgba(244,182,38,0.12)] flex items-center justify-center group-hover:bg-[#F4B626] transition-colors duration-250">
                  <FileText className="w-6 h-6 text-[#F4B626] group-hover:text-white transition-colors duration-250" />
                </div>
              </div>
              <h3 className="text-[16px] font-bold text-white mb-3">Report Builder</h3>
              <p className="text-[14px] text-[#777] group-hover:text-[#ccc] leading-relaxed transition-colors duration-250 mb-6">
                Answer a few questions, get a formatted PDF report ready to send. No more Word wrestling.
              </p>
              <div className="mt-auto mb-6 flex justify-center items-center">
                <ReportBuilderMockup />
              </div>
              <div className="absolute bottom-6 right-6">
                <span className="px-2 py-0.5 bg-[rgba(244,182,38,0.12)] text-[#cd962b] text-xs font-bold rounded-full">Possible</span>
              </div>
            </motion.div>

            {/* Tool 5 */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 4 * 0.07, duration: 0.5 }}
              whileHover={{ boxShadow: '0 0 0 1px rgba(244,182,38,0.5), 0 4px 24px rgba(244,182,38,0.1)' }}
              className="bg-[#111] rounded-xl p-6 border border-white/5 flex flex-col h-full relative group transition-all duration-250 ease-out col-span-1"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-full bg-[rgba(244,182,38,0.12)] flex items-center justify-center group-hover:bg-[#F4B626] transition-colors duration-250">
                  <MessageSquare className="w-6 h-6 text-[#F4B626] group-hover:text-white transition-colors duration-250" />
                </div>
              </div>
              <h3 className="text-[16px] font-bold text-white mb-3">Quote Assistant</h3>
              <p className="text-[14px] text-[#777] group-hover:text-[#ccc] leading-relaxed transition-colors duration-250 mb-6">
                Type a customer need, get a pre-filled draft quote from the product catalogue. Done in minutes.
              </p>
              <div className="mt-auto mb-6 flex justify-center items-center">
                <QuoteAssistantMockup />
              </div>
              <div className="absolute bottom-6 right-6">
                <span className="px-2 py-0.5 bg-[rgba(244,182,38,0.12)] text-[#cd962b] text-xs font-bold rounded-full">Possible</span>
              </div>
            </motion.div>

            {/* Tool 6 */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 5 * 0.07, duration: 0.5 }}
              whileHover={{ boxShadow: '0 0 0 1px rgba(244,182,38,0.5), 0 4px 24px rgba(244,182,38,0.1)' }}
              className="bg-[#111] rounded-xl p-6 border border-white/5 flex flex-col h-full relative group transition-all duration-250 ease-out"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-full bg-[rgba(244,182,38,0.12)] flex items-center justify-center group-hover:bg-[#F4B626] transition-colors duration-250">
                  <GraduationCap className="w-6 h-6 text-[#F4B626] group-hover:text-white transition-colors duration-250" />
                </div>
              </div>
              <h3 className="text-[16px] font-bold text-white mb-3">Training Tracker</h3>
              <p className="text-[14px] text-[#777] group-hover:text-[#ccc] leading-relaxed transition-colors duration-250 mb-6">
                Team compliance at a glance. Auto-reminders before expiry. Nothing falls through the cracks.
              </p>
              <div className="mt-auto mb-6 flex justify-center items-center">
                <TrainingTrackerMockup />
              </div>
              <div className="absolute bottom-6 right-6">
                <span className="px-2 py-0.5 bg-[rgba(244,182,38,0.12)] text-[#cd962b] text-xs font-bold rounded-full">Possible</span>
              </div>
            </motion.div>
            
          </div>
        </div>
      </div>

    </div>
  );
}
