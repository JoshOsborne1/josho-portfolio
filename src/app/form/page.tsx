'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Loader2 } from 'lucide-react';
import { GuldmannParticles } from '@/components/GuldmannParticles';

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

  const handleNext = () => {
    // Basic validation
    if (step === 1 && (!formData.name || !formData.jobTitle || !formData.department || !formData.tenure)) {
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => Math.min(s + 1, totalSteps));
  };

  const handlePrev = () => {
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      const response = await fetch('https://formspree.io/f/xqaqnjvo', {
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
      <div className="min-h-screen bg-[#FAFAFA] text-[#171717] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Dark Hero Background */}
        <div className="absolute top-0 left-0 right-0 h-[40vh] bg-[#111111] overflow-hidden">
           <GuldmannParticles />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full text-center relative z-10 border border-gray-100"
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

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#171717] pb-24 font-sans">
      {/* Dark Header */}
      <div className="relative bg-[#111111] text-white pt-16 pb-32 px-6 overflow-hidden">
        <GuldmannParticles />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-6 bg-[#F4B626] rounded-full"></div>
            <span className="text-xl font-bold tracking-wider uppercase">Guldmann</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Internal Workflow Audit</h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl">
            Help us understand your daily tools and processes so we can make your job easier.
          </p>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 -mt-20 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Progress Bar */}
          <div className="bg-gray-100 h-2 w-full">
            <motion.div 
              className="h-full bg-[#F4B626]"
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          
          {/* Step Indicator */}
          <div className="px-8 pt-8 pb-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-[#cd962b] uppercase tracking-wider">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-gray-400 font-medium">
              {step === 1 && "About You"}
              {step === 2 && "What You Do"}
              {step === 3 && "Tools & Software"}
              {step === 4 && "AI & Automation"}
              {step === 5 && "Making Life Easier"}
            </span>
          </div>

          <div className="p-8 md:p-10 min-h-[400px]">
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
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold mb-6">Let's start with the basics</h2>
                    
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Full Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        id="name"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#F4B626] focus:ring-1 focus:ring-[#F4B626] outline-none transition-all"
                        placeholder="Jane Doe"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="jobTitle" className="block text-sm font-semibold text-gray-700">Job Title / Role <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        id="jobTitle"
                        value={formData.jobTitle}
                        onChange={e => setFormData({...formData, jobTitle: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#F4B626] focus:ring-1 focus:ring-[#F4B626] outline-none transition-all"
                        placeholder="e.g. Regional Sales Manager"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="department" className="block text-sm font-semibold text-gray-700">Department <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select 
                          id="department"
                          value={formData.department}
                          onChange={e => setFormData({...formData, department: e.target.value})}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#F4B626] focus:ring-1 focus:ring-[#F4B626] outline-none transition-all appearance-none bg-white"
                        >
                          <option value="" disabled>Select your department</option>
                          <option value="Operations">Operations</option>
                          <option value="Sales">Sales</option>
                          <option value="Clinical/Healthcare">Clinical/Healthcare</option>
                          <option value="IT">IT</option>
                          <option value="Marketing/Communications">Marketing/Communications</option>
                          <option value="Finance/Admin">Finance/Admin</option>
                          <option value="Management">Management</option>
                          <option value="Other">Other</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="tenure" className="block text-sm font-semibold text-gray-700">How long have you been at Guldmann? <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select 
                          id="tenure"
                          value={formData.tenure}
                          onChange={e => setFormData({...formData, tenure: e.target.value})}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#F4B626] focus:ring-1 focus:ring-[#F4B626] outline-none transition-all appearance-none bg-white"
                        >
                          <option value="" disabled>Select duration</option>
                          <option value="Less than 1 year">Less than 1 year</option>
                          <option value="1-3 years">1-3 years</option>
                          <option value="3-5 years">3-5 years</option>
                          <option value="5-10 years">5-10 years</option>
                          <option value="10+ years">10+ years</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- STEP 2: WHAT YOU DO --- */}
                {step === 2 && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold mb-6">Your Daily Work</h2>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">Describe your main areas of work (pick all that apply) <span className="text-red-500">*</span></label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-2">
                          <input 
                            type="text" 
                            value={formData.otherArea}
                            onChange={e => setFormData({...formData, otherArea: e.target.value})}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#F4B626] focus:ring-1 focus:ring-[#F4B626] outline-none"
                            placeholder="Please specify..."
                          />
                        </motion.div>
                      )}
                    </div>

                    <div className="space-y-3 pt-4">
                      <label className="block text-sm font-semibold text-gray-700">How many hours a week do you spend on repetitive or manual tasks? <span className="text-red-500">*</span></label>
                      <p className="text-sm text-gray-500 mb-2">Think data entry, copying between systems, formatting reports, etc.</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold mb-6">Tools & Software</h2>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">Which of these tools do you use regularly? <span className="text-red-500">*</span></label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                          'Project management tools (Monday.com, Trello, Asana etc)',
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
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-2">
                          <input 
                            type="text" 
                            value={formData.otherTool}
                            onChange={e => setFormData({...formData, otherTool: e.target.value})}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#F4B626] focus:ring-1 focus:ring-[#F4B626] outline-none"
                            placeholder="Please specify other tools..."
                          />
                        </motion.div>
                      )}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <label className="block text-sm font-semibold text-gray-700">On a scale 1-5, how comfortable are you with spreadsheets? <span className="text-red-500">*</span></label>
                      
                      <div className="flex flex-col space-y-4">
                        <div className="flex justify-between w-full max-w-md mx-auto relative">
                          {/* Connecting line */}
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
                      <label className="block text-sm font-semibold text-gray-700">Do you use SharePoint regularly? <span className="text-red-500">*</span></label>
                      <div className="flex flex-wrap gap-3">
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
                            className="pt-4 space-y-3"
                          >
                            <label className="block text-sm font-semibold text-gray-700">Do you find it easy to use? <span className="text-red-500">*</span></label>
                            <div className="flex flex-wrap gap-3">
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
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold mb-6">AI & Automation</h2>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">Have you used any AI tools at work? (e.g. ChatGPT, Copilot) <span className="text-red-500">*</span></label>
                      <div className="flex flex-wrap gap-3">
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
                            className="pt-2"
                          >
                            <input 
                              type="text" 
                              value={formData.aiToolsDetails}
                              onChange={e => setFormData({...formData, aiToolsDetails: e.target.value})}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#F4B626] focus:ring-1 focus:ring-[#F4B626] outline-none"
                              placeholder="Which ones? (Required)"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      <label className="block text-sm font-semibold text-gray-700">Which of these AI-assisted tasks interest you most? <span className="text-red-500">*</span></label>
                      <p className="text-sm text-gray-500 mb-2">Select up to 3</p>
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
                      <label className="block text-sm font-semibold text-gray-700">How would you describe your interest in AI tools at work? <span className="text-red-500">*</span></label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold mb-6">Making Life Easier</h2>
                    <p className="text-gray-600 mb-6">Your honest feedback here is incredibly valuable.</p>
                    
                    <div className="space-y-2">
                      <label htmlFor="frustrations" className="block text-sm font-semibold text-gray-700">What's the most time-consuming or frustrating part of your job?</label>
                      <textarea 
                        id="frustrations"
                        rows={3}
                        value={formData.frustrations}
                        onChange={e => setFormData({...formData, frustrations: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#F4B626] focus:ring-1 focus:ring-[#F4B626] outline-none transition-all resize-none"
                        placeholder="Please be specific..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="wishFaster" className="block text-sm font-semibold text-gray-700">Is there anything you wish you could do faster or more easily?</label>
                      <textarea 
                        id="wishFaster"
                        rows={3}
                        value={formData.wishFaster}
                        onChange={e => setFormData({...formData, wishFaster: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#F4B626] focus:ring-1 focus:ring-[#F4B626] outline-none transition-all resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="magicWand" className="block text-sm font-semibold text-gray-700">If you could wave a magic wand and automate one thing in your job, what would it be?</label>
                      <textarea 
                        id="magicWand"
                        rows={2}
                        value={formData.magicWand}
                        onChange={e => setFormData({...formData, magicWand: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#F4B626] focus:ring-1 focus:ring-[#F4B626] outline-none transition-all resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="otherFeedback" className="block text-sm font-semibold text-gray-700">Any other feedback or suggestions? <span className="font-normal text-gray-400">(Optional)</span></label>
                      <textarea 
                        id="otherFeedback"
                        rows={2}
                        value={formData.otherFeedback}
                        onChange={e => setFormData({...formData, otherFeedback: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#F4B626] focus:ring-1 focus:ring-[#F4B626] outline-none transition-all resize-none"
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

          {/* Navigation Footer */}
          <div className="bg-gray-50 p-6 md:p-8 border-t border-gray-100 flex items-center justify-between">
            {step > 1 ? (
              <button 
                onClick={handlePrev}
                className="flex items-center gap-2 text-gray-500 hover:text-[#111111] font-medium transition-colors"
                disabled={isSubmitting}
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
            ) : (
              <div></div> // Empty div for flex spacing
            )}

            <div className="flex items-center gap-4">
              {error && <span className="text-red-500 text-sm font-medium animate-pulse">{error}</span>}
              
              {step < totalSteps ? (
                <button 
                  onClick={handleNext}
                  className="bg-[#111111] hover:bg-black text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  Next Step <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-[#F4B626] hover:bg-[#cd962b] text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      Submit Responses <Check className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
