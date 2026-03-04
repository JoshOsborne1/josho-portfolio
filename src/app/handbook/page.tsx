'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Download, FileText, Pencil, Printer, Search, Settings, X } from 'lucide-react';
import Image from 'next/image';

// ---------------------------------------------------------------------------
// TYPES & SETTINGS
// ---------------------------------------------------------------------------

interface CompanySettings {
  companyName: string;
  hrContact: string;
  hrEmail: string;
  pensionProvider: string;
  employerPension: string;
  employeePension: string;
  holidayDays: string;
  holidayYearStart: string;
  probationMonths: string;
  enhancedSickWeeks: string;
  noticeProbation: string;
  noticeUnder2: string;
  noticeOver2: string;
  expenseBreakfast: string;
  expenseLunch: string;
  expenseDinner: string;
  cardApprovalLimit: string;
  extraBenefit1: string;
  extraBenefit2: string;
  extraBenefit3: string;
  versionDate: string;
}

const DEFAULT_SETTINGS: CompanySettings = {
  companyName: 'Guldmann UK',
  hrContact: '',
  hrEmail: '',
  pensionProvider: '',
  employerPension: '',
  employeePension: '',
  holidayDays: '28',
  holidayYearStart: '1 January',
  probationMonths: '6',
  enhancedSickWeeks: '',
  noticeProbation: '1 week',
  noticeUnder2: '1 month',
  noticeOver2: '1 week per year of service (up to 12 weeks)',
  expenseBreakfast: '10',
  expenseLunch: '15',
  expenseDinner: '25',
  cardApprovalLimit: '200',
  extraBenefit1: '',
  extraBenefit2: '',
  extraBenefit3: '',
  versionDate: '2025',
};

function applySettings(content: string, s: CompanySettings): string {
  return content
    .replace(/\[COMPANY_NAME\]/g, s.companyName || 'Guldmann UK')
    .replace(/\[HR_CONTACT\]/g, s.hrContact || 'HR')
    .replace(/\[HR_EMAIL\]/g, s.hrEmail || 'your HR contact')
    .replace(/\[PENSION_PROVIDER\]/g, s.pensionProvider || 'our workplace pension provider')
    .replace(/\[EMPLOYER_PENSION\]/g, s.employerPension ? `${s.employerPension}%` : 'the minimum required by law')
    .replace(/\[EMPLOYEE_PENSION\]/g, s.employeePension ? `${s.employeePension}%` : 'the minimum required by law')
    .replace(/\[HOLIDAY_DAYS\]/g, s.holidayDays || '28')
    .replace(/\[HOLIDAY_YEAR_START\]/g, s.holidayYearStart || '1 January')
    .replace(/\[PROBATION_MONTHS\]/g, s.probationMonths || '6')
    .replace(/\[ENHANCED_SICK\]/g, s.enhancedSickWeeks
      ? `Guldmann enhances this: we pay full salary for the first ${s.enhancedSickWeeks} week(s) of absence before SSP applies.`
      : '')
    .replace(/\[NOTICE_PROBATION\]/g, s.noticeProbation || '1 week')
    .replace(/\[NOTICE_UNDER_2\]/g, s.noticeUnder2 || '1 month')
    .replace(/\[NOTICE_OVER_2\]/g, s.noticeOver2 || '1 week per year of service (up to 12 weeks)')
    .replace(/\[EXPENSE_BREAKFAST\]/g, s.expenseBreakfast || '10')
    .replace(/\[EXPENSE_LUNCH\]/g, s.expenseLunch || '15')
    .replace(/\[EXPENSE_DINNER\]/g, s.expenseDinner || '25')
    .replace(/\[CARD_LIMIT\]/g, s.cardApprovalLimit || '200')
    .replace(/\[VERSION_DATE\]/g, s.versionDate || '2025')
    .replace(/\[EXTRA_BENEFIT_1\]/g, s.extraBenefit1 || '')
    .replace(/\[EXTRA_BENEFIT_2\]/g, s.extraBenefit2 || '')
    .replace(/\[EXTRA_BENEFIT_3\]/g, s.extraBenefit3 || '');
}

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------

interface Clause {
  id: string;
  title: string;
  summary: string;
  required: boolean;
  content: string;
}

interface Category {
  id: string;
  title: string;
  icon: string;
  clauses: Clause[];
}

const CATEGORIES: Category[] = [
  {
    id: 'welcome', title: 'Welcome & Introduction', icon: '👋',
    clauses: [
      { id: 'welcome-message', title: 'Welcome Message', summary: 'Opening letter from Guldmann UK leadership', required: false, content: `## Welcome to [COMPANY_NAME]

Welcome to Guldmann.

You have joined a company with a clear purpose: creating Time to Care and Accessibility for All. Every product we make, every service we deliver, every conversation we have with a customer - it all comes back to that. The people who use our equipment depend on it to live their lives with dignity. That is not a small thing.

This handbook gives you the information you need to know how we work, what we expect, and what you can expect from us. It is not a rulebook. We do not believe in having a rule for everything. What we believe in is good judgement, shared values, and people taking responsibility for doing the right thing.

If something is not covered here - use your common sense and ask. We would rather you ask than guess wrong.` },
      { id: 'about-guldmann', title: 'About Guldmann', summary: 'Company background, mission, UK operations', required: false, content: `## About Guldmann

Guldmann was founded in Denmark and has grown into an international company specialising in patient handling and ceiling hoist systems. Our work genuinely matters - the equipment we supply enables care staff to do their jobs safely, and gives patients the ability to move independently.

[COMPANY_NAME] operates across the country, with our team spanning Technical (installation, servicing, IT), Sales, Operations, Contracts, Marketing, and Management. We also represent the Stepless brand in the UK market.

We are a small team. That means everyone is visible, everyone's contribution counts, and how we treat each other every day matters more than at a larger company.` },
      { id: 'values-fact', title: 'Our Values: FACT', summary: 'Flexibility, Ambition, Competence, Trustworthiness', required: false, content: `## Our Values: FACT

Everything at Guldmann comes back to four values. We call them FACT.

**Flexibility** - What is right today may be wrong tomorrow. We hold our views openly, adapt when we need to, and do not cling to "the way we have always done it" when a better way exists.

**Ambition** - We set high goals - and we mean it. Not aspirational posters on the wall, but real targets that stretch us. We hold ourselves and each other to them.

**Competence** - Our customers trust us because we know what we are talking about. We take learning seriously. We share what we know. The strength of every individual is part of our collective strength.

**Trustworthiness** - Trust is earned, not assumed. We earn it by saying what we will do and doing it - with customers, colleagues, and the wider world.` },
      { id: 'code-of-conduct', title: 'Code of Conduct', summary: 'Human Rights, Labour Rights, Environment, Anti-Corruption', required: true, content: `## Code of Conduct

Guldmann operates to a global Code of Conduct built on four principles: Human Rights, Labour Rights, Environment, and Anti-Corruption.

In practical terms this means: treat everyone fairly and with respect, pay and reward people properly, consider the environmental impact of what we do, and never accept or offer anything that could be considered a bribe or improper benefit.

The full Code of Conduct is available from [HR_CONTACT].` },
    ]
  },
  {
    id: 'employment', title: 'Your Employment', icon: '📋',
    clauses: [
      { id: 'contracts', title: 'Employment Contracts', summary: 'Written particulars, contract changes', required: true, content: `## Employment Contracts

Every employee receives a written statement of employment particulars on or before their first day. This confirms your job title, start date, pay, working hours, holiday entitlement, and notice period.

If anything in your contract needs to change - your hours, your role, your location - this will be agreed with you and confirmed in writing.` },
      { id: 'probation', title: 'Probationary Period', summary: 'Probation with mid-point review', required: false, content: `## Probationary Period

All new employees serve a [PROBATION_MONTHS]-month probationary period. This is not a test designed for you to fail - it is a structured period to make sure the role is right for you and you are right for the role.

**At the mid-point:** Your manager will have an informal review. This is a two-way discussion.

**At [PROBATION_MONTHS] months:** A formal probation review. If everything is on track, your employment is confirmed.

The notice period during probation is [NOTICE_PROBATION].` },
      { id: 'working-hours', title: 'Working Hours & Flexibility', summary: 'Standard hours, overtime, flexible working', required: false, content: `## Working Hours and Flexibility

Standard working hours for office and administration staff are Monday to Friday, with an hour for lunch. Your specific hours are confirmed in your contract.

For Technical staff (installers and service technicians), hours vary by job schedule.

**Flexibility:** We trust our people. If you occasionally need to adjust your schedule - talk to your manager.

For sustained changes to your working pattern, submit a flexible working request to [HR_CONTACT].` },
      { id: 'remote-working', title: 'Remote & Hybrid Working', summary: 'Working from home policy and rules', required: false, content: `## Remote and Hybrid Working

You may work from home where your role allows and your manager agrees. Remote working suits tasks that need focus; it does not suit collaboration, client-facing work, or anything that requires you on site.

**Rules for remote working:**
- Inform your team and manager in advance
- Be available during your normal working hours
- Company data security rules apply regardless of where you work
- Any regular hybrid pattern needs manager approval and formal agreement` },
      { id: 'appearance', title: 'Professional Appearance', summary: 'Dress code, branded workwear, PPE requirements', required: false, content: `## Professional Appearance

How we present ourselves reflects on Guldmann. We expect everyone to dress appropriately for their role and any customer or external interactions.

**Technical staff:** Company-issued workwear must be worn on all customer sites. Safety footwear is required.

**Office and sales staff:** Smart business casual is the standard.

**Construction sites:** Safety jacket with Guldmann logo required. Site-specific PPE will be confirmed in advance.` },
      { id: 'notice-periods', title: 'Notice Periods', summary: 'Notice required from both sides', required: true, content: `## Notice Periods

**During probation:** [NOTICE_PROBATION] notice required from either side.

**Under 2 years' service:** [NOTICE_UNDER_2] notice from either side.

**2+ years' service:** [NOTICE_OVER_2].

Your specific notice period is confirmed in your contract.` },
    ]
  },
  {
    id: 'pay-benefits', title: 'Pay & Benefits', icon: '💷',
    clauses: [
      { id: 'pay-dates', title: 'Pay & Payslips', summary: 'Monthly pay, payslip details, error reporting', required: true, content: `## Pay and Payslips

You are paid monthly, on the last working day of each month, directly into your nominated bank account. Keep your bank details up to date with [HR_CONTACT].

Your payslip shows gross pay, all deductions (income tax, National Insurance, pension), and net pay. Payslips are issued electronically.

If you believe your pay is incorrect, contact [HR_CONTACT] immediately.` },
      { id: 'expenses', title: 'Expenses Policy', summary: 'HMRC mileage, subsistence, receipts, approval', required: false, content: `## Expenses

Guldmann will reimburse all reasonable and legitimate business expenses.

**Mileage (own vehicle):**
- First 10,000 business miles/year: 45p per mile
- Over 10,000 miles: 25p per mile
- Daily commute to your normal workplace is not claimable

**Subsistence while travelling:**
- Breakfast (away before 6:00am): up to £[EXPENSE_BREAKFAST]
- Lunch: up to £[EXPENSE_LUNCH]
- Evening meal (away past 8:00pm): up to £[EXPENSE_DINNER]

Always keep receipts. Submit claims within 30 days. All expenses must be approved by your manager.` },
      { id: 'company-card', title: 'Company Credit Card', summary: 'Business use only, approval thresholds, reporting', required: false, content: `## Company Credit Card

Some roles include a company credit card. The card is for business purchases only. Personal use is not permitted.

- Manager approval required for any single purchase over £[CARD_LIMIT]
- Submit receipts and a brief purpose note for every transaction
- Report a lost or stolen card to [HR_CONTACT] and accounts immediately

Spend Guldmann's money the way you would spend your own.` },
      { id: 'company-car', title: 'Company Car Policy', summary: 'Eligibility, standards, fines, private use, BIK', required: false, content: `## Company Car Policy

Company cars are available to certain roles where the business need is clear. Eligibility is confirmed in your contract. Electric vehicles are preferred.

**Your responsibilities:** Keep the car clean, ensure it is serviced on schedule, report any damage promptly.

**Fines:** Parking and speeding penalties are your responsibility.

**Private use:** Any agreed private mileage creates a taxable Benefit in Kind.` },
      { id: 'pension', title: 'Pension', summary: 'Auto-enrolment, contributions, scheme details', required: true, content: `## Pension

[COMPANY_NAME] operates a workplace pension scheme through [PENSION_PROVIDER] in line with UK auto-enrolment legislation. You will be enrolled automatically when you join.

**Contributions:**
- Employer contribution: [EMPLOYER_PENSION]
- Employee contribution: [EMPLOYEE_PENSION]

Contact [HR_CONTACT] with any questions.` },
      { id: 'extra-benefits', title: 'Additional Benefits', summary: 'Company-specific perks and benefits', required: false, content: `## Additional Benefits

[COMPANY_NAME] offers the following additional benefits to all employees:

**[EXTRA_BENEFIT_1]**

**[EXTRA_BENEFIT_2]**

**[EXTRA_BENEFIT_3]**

Contact [HR_CONTACT] for full details.` },
      { id: 'milestones', title: 'Milestone Recognition', summary: 'Anniversary gifts, apprenticeship completion, retirement', required: false, content: `## Milestone Recognition

Guldmann UK marks the following milestones:

- **10-year anniversary:** Team celebration and a gift from the company
- **25-year anniversary:** Department celebration, a gift, and one month's salary
- **Completion of apprenticeship or formal qualification:** Team celebration and a gift
- **Retirement:** A farewell gathering for close colleagues if desired, and a gift` },
    ]
  },
  {
    id: 'time-off', title: 'Time Off', icon: '🏖️',
    clauses: [
      { id: 'holiday', title: 'Holiday Entitlement', summary: 'Days, holiday year, booking, carry-over', required: true, content: `## Holiday Entitlement

You are entitled to [HOLIDAY_DAYS] days of paid holiday per year (inclusive of the eight UK bank holidays). Part-time entitlement is calculated pro-rata.

**Holiday year:** Runs from [HOLIDAY_YEAR_START] each year.

**Booking:** Request holiday through your manager. Summer preferences by end of March. Christmas plans by end of October.

**Carry-over:** Up to 5 days may be carried over by agreement.

**On leaving:** Accrued but untaken holiday is paid in your final salary.` },
      { id: 'sick-leave', title: 'Sick Leave & SSP', summary: 'Reporting, SSP £118.75/week, fit notes, return interviews', required: true, content: `## Sick Leave and Statutory Sick Pay

**Reporting:** Contact your manager before your normal start time on day one of any absence.

**Fit notes:** For absences of 7 calendar days or less, self-certify. Longer than 7 days, a fit note from your GP is required.

**Statutory Sick Pay (SSP):** £118.75 per week (2024/25 rate). SSP begins from day 4 of absence. Payable for up to 28 weeks. You must earn at least £123/week to qualify.

[ENHANCED_SICK]

**Return-to-work:** After every absence, your manager will have a brief supportive check-in.` },
      { id: 'bereavement', title: 'Bereavement & Compassionate Leave', summary: 'Paid leave for immediate and extended family loss', required: false, content: `## Bereavement and Compassionate Leave

**Immediate family** (spouse, partner, parent, child, sibling): minimum 5 days paid compassionate leave. Your manager has discretion to grant more.

**Extended family and close friends** (grandparent, in-law, close friend): minimum 2 days paid.

**Pregnancy loss:** We take a compassionate and flexible approach. Speak to [HR_CONTACT].` },
      { id: 'medical-appointments', title: 'Medical & Dental Appointments', summary: 'Routine vs urgent, children appointments', required: false, content: `## Medical and Dental Appointments

Where possible, book routine appointments outside working hours.

For urgent or referred appointments, we will support attendance during working hours.

**Children:** If your child cannot attend a medical appointment unaccompanied, you may take the time needed.` },
      { id: 'dependants-leave', title: 'Emergency Leave for Dependants', summary: 'Emergency time off for dependent care', required: true, content: `## Emergency Leave for Dependants

You have the right to take emergency time off to deal with unexpected situations involving a dependent - a sick child, emergency care, or an unexpected breakdown of care arrangements.

We will not penalise you for occasionally needing to deal with a family emergency. Notify your manager as early as possible.` },
      { id: 'jury-service', title: 'Jury Service', summary: 'Paid leave, court allowance offsetting', required: false, content: `## Jury Service

If you are called for jury service, notify [HR_CONTACT] and your manager as soon as you receive the summons. Guldmann will top up your income to your normal salary level. You will be expected to claim the daily court allowance, which will be offset against your pay so you are not worse off.` },
    ]
  },
  {
    id: 'family-leave', title: 'Family Leave', icon: '👨‍👩‍👧',
    clauses: [
      { id: 'maternity', title: 'Maternity Leave & Pay', summary: 'Up to 52 weeks, SMP rates, KIT days', required: true, content: `## Maternity Leave and Pay

**Leave:** Up to 52 weeks (26 weeks Ordinary + 26 weeks Additional), regardless of length of service.

**Notification:** Notify Guldmann by the 15th week before your due date. Provide your MATB1 certificate.

**Statutory Maternity Pay (SMP):**
- First 6 weeks: 90% of average weekly earnings
- Remaining 33 weeks: £187.18/week or 90% of AWE, whichever is lower (2024/25 rate)

**Keeping in Touch (KIT) days:** Up to 10 voluntary KIT days during maternity leave.

Contact [HR_CONTACT] to discuss your maternity plans.` },
      { id: 'paternity', title: 'Paternity Leave & Pay', summary: '1-2 weeks, SPP £187.18/week', required: true, content: `## Paternity Leave and Pay

**Leave:** 1 or 2 consecutive weeks, taken within 56 days of the birth.

**Statutory Paternity Pay (SPP):** £187.18/week or 90% of average weekly earnings, whichever is lower (2024/25 rate).

**Notification:** Give at least 15 weeks notice to [HR_CONTACT].` },
      { id: 'shared-parental', title: 'Shared Parental Leave', summary: 'Up to 50 weeks shared, 37 weeks pay', required: true, content: `## Shared Parental Leave

Eligible parents can share up to 50 weeks of leave and 37 weeks of pay in the first year after birth or adoption.

Shared Parental Pay is £187.18/week or 90% of AWE, whichever is lower (2024/25).

Speak to [HR_CONTACT] as early as possible to work through your options.` },
      { id: 'adoption', title: 'Adoption Leave', summary: 'Same entitlements as maternity, SAP rates', required: true, content: `## Adoption Leave

If you are adopting, you have the same entitlements as a birth parent: up to 52 weeks leave and 39 weeks Statutory Adoption Pay (90% for the first 6 weeks, then £187.18/week).

Contact [HR_CONTACT] as soon as you are matched with a child.` },
      { id: 'parental-leave', title: 'Unpaid Parental Leave', summary: '18 weeks unpaid per child, max 4 weeks/year', required: true, content: `## Parental Leave (Unpaid)

Employees with at least one year's service are entitled to 18 weeks of unpaid parental leave per child, up to the child's 18th birthday. Maximum 4 weeks in any one year.

Give at least 21 days notice. Speak to [HR_CONTACT] for details.` },
    ]
  },
  {
    id: 'performance', title: 'Performance & Development', icon: '📈',
    clauses: [
      { id: 'performance-standards', title: 'Expected Standards', summary: 'What Guldmann expects from everyone', required: false, content: `## Expected Standards

Guldmann expects people to do their jobs well. We hire good people, give them clear roles, and trust them to perform.

What we expect from everyone:
- Turn up on time, prepared, and ready to contribute
- Deliver what you commit to
- Be honest when something is going wrong
- Treat colleagues, customers, and partners with respect
- Represent Guldmann well in everything you do` },
      { id: 'appraisals', title: 'Annual Appraisals', summary: 'Yearly review covering performance, development, objectives', required: false, content: `## Annual Appraisals

Every employee has an annual appraisal with their manager - a genuine conversation, not a box-ticking exercise.

The appraisal covers: performance against objectives, what has gone well, what could be better, and development aspirations.

We also encourage mid-year check-ins.` },
      { id: 'learning', title: 'Learning & Development', summary: 'Guldmann Academy, external training, study leave', required: false, content: `## Learning and Development

Guldmann invests in its people. When you grow, we grow.

**Guldmann Academy:** Internal learning platform for product knowledge, technical training, and professional development.

**External training:** Guldmann will support and fund relevant external training.

**Study leave:** Paid time off for exams when undertaking a company-supported qualification.

Contact [HR_CONTACT] to discuss training and development.` },
    ]
  },
  {
    id: 'conduct', title: 'Conduct & Discipline', icon: '⚖️',
    clauses: [
      { id: 'standards-behaviour', title: 'Standards of Behaviour', summary: 'Professionalism, honesty, respect', required: false, content: `## Standards of Behaviour

We expect everyone at Guldmann to behave professionally, honestly, and with respect for others - in the office, on customer sites, when travelling, and in any context where you represent the company.

Treat all colleagues, customers, and partners fairly and without discrimination. Be honest. Respect confidential information.` },
      { id: 'disciplinary', title: 'Disciplinary Procedure', summary: 'Informal to formal stages, rights, appeals', required: true, content: `## Disciplinary Procedure

The disciplinary procedure follows the Acas Code of Practice and deals with conduct or performance issues in a fair, consistent, and proportionate way.

**Informal:** For minor issues, your manager will raise the concern directly.

**First Written Warning:** Formal meeting with right to be accompanied. Remains on file 12 months.

**Final Written Warning:** For continued or more serious issues.

**Dismissal:** For repeated or serious breaches.

**Your rights:** To be told the allegation in advance, see evidence, be accompanied, respond, and appeal. Contact [HR_CONTACT] for the full policy.` },
      { id: 'gross-misconduct', title: 'Gross Misconduct', summary: 'Examples and immediate dismissal procedure', required: true, content: `## Gross Misconduct

Some actions are serious enough to result in immediate dismissal without notice:

- Theft, fraud, or dishonesty
- Physical violence or threats of violence
- Harassment, bullying, or discrimination
- Serious breach of health and safety rules
- Being under the influence of alcohol or drugs at work
- Serious misuse of company IT systems or data
- Unauthorised disclosure of confidential information

Where gross misconduct is suspected, we may suspend on full pay pending investigation.` },
      { id: 'grievance', title: 'Grievance Procedure', summary: 'Informal and formal routes, right to be accompanied', required: true, content: `## Grievance Procedure

If you have a concern about your treatment, working conditions, or a colleague's behaviour, you have the right to raise a formal grievance.

**Informal first:** Raise concerns with your manager directly where possible.

**Formal grievance:** Submit a written grievance to [HR_CONTACT] at [HR_EMAIL]. We will acknowledge within 3 working days.

You have the right to be accompanied at any grievance meeting and to appeal any outcome.` },
      { id: 'whistleblowing', title: 'Whistleblowing', summary: 'Protected disclosures, how to raise concerns', required: true, content: `## Whistleblowing

If you become aware of serious wrongdoing - affecting health and safety, breaking the law, involving fraud - you have the right to speak up.

Raise this with your manager, [HR_CONTACT], or a senior leader. You can also report to the relevant regulator externally.

Guldmann will not penalise any employee for making a whistleblowing disclosure in good faith.` },
    ]
  },
  {
    id: 'health-safety', title: 'Health, Safety & Wellbeing', icon: '🦺',
    clauses: [
      { id: 'hs-commitment', title: 'Health & Safety Commitment', summary: 'Legal duties, employer and employee responsibilities', required: true, content: `## Health and Safety Commitment

[COMPANY_NAME] is committed to a safe and healthy working environment for every employee. We comply with all requirements under the Health and Safety at Work Act 1974.

**Your responsibilities:**
- Follow safe working practices and procedures
- Use all equipment and PPE correctly
- Report hazards, accidents, and near misses immediately
- Complete all mandatory health and safety training

If asked to carry out a task you believe is unsafe - stop and speak to your manager.` },
      { id: 'accident-reporting', title: 'Accident Reporting & RIDDOR', summary: 'Incident recording, legally reportable injuries', required: true, content: `## Accident Reporting

All accidents, injuries, and near misses must be recorded in the accident book. Serious incidents are reported to the HSE under RIDDOR where legally required.

RIDDOR-reportable incidents include deaths, specified injuries, over-7-day incapacitations, and dangerous occurrences.

Report all incidents to your manager and [HR_CONTACT] immediately.` },
      { id: 'ppe-workwear', title: 'Workwear & PPE', summary: 'Installer and technician requirements, screen glasses', required: true, content: `## Workwear and PPE

**Installers and Service Technicians:** Company-issued workwear must be worn at all times on customer sites. Safety footwear required in all applicable environments.

**Screen and Safety Glasses:** If your role involves significant screen use, you are entitled to a company-funded eye test. Contact [HR_CONTACT] for details.` },
      { id: 'mental-health', title: 'Mental Health & Wellbeing', summary: 'Open culture, reasonable adjustments', required: false, content: `## Mental Health and Wellbeing

We take mental health seriously. We are a small team, and we notice when someone is struggling.

If you are going through a difficult time, please talk to your manager or [HR_CONTACT]. We will treat what you share in confidence.

Long-term mental health conditions are a disability under the Equality Act 2010. We have a duty to make reasonable adjustments where these are needed.` },
    ]
  },
  {
    id: 'data-it', title: 'Data, IT & Security', icon: '🔒',
    clauses: [
      { id: 'it-use', title: 'IT Systems & Acceptable Use', summary: 'Business use, prohibited actions, device security', required: true, content: `## IT Systems and Acceptable Use

Guldmann provides IT equipment and systems for business purposes. Reasonable personal use is tolerated - but not for personal projects, entertainment, or anything that could compromise security.

**You must not:**
- Install software on company devices without authorisation
- Share your login credentials
- Leave devices unlocked and unattended
- Connect to unsecured public Wi-Fi without a VPN

Report any suspected security incident to IT immediately.` },
      { id: 'data-protection', title: 'Data Protection & GDPR', summary: 'UK GDPR, handling personal data, breach reporting', required: true, content: `## Data Protection and GDPR

[COMPANY_NAME] handles personal data responsibly in compliance with UK GDPR and the Data Protection Act 2018.

**What this means for you:**
- Only access personal data you need for your role
- Do not share personal data with anyone who does not need it
- Secure personal data - do not leave it exposed
- Report any data breach to [HR_CONTACT] immediately` },
      { id: 'confidentiality', title: 'Confidentiality', summary: 'During and after employment obligations', required: true, content: `## Confidentiality

During your employment you will have access to confidential information: commercial data, customer details, pricing, strategy, and personnel information.

Do not share this outside the company without authorisation. This obligation continues after you leave Guldmann.` },
      { id: 'social-media', title: 'Social Media', summary: 'Personal use guidelines, what not to share', required: false, content: `## Social Media

We are not going to tell you what to do on your personal social media. But we ask for common sense.

Do not share confidential company information, make defamatory comments about Guldmann, colleagues, or customers, or claim to speak on behalf of Guldmann without authorisation.` },
    ]
  },
  {
    id: 'leaving', title: 'Leaving Guldmann', icon: '🚪',
    clauses: [
      { id: 'resignation', title: 'Resignation & Notice', summary: 'Written resignation, notice periods, garden leave', required: true, content: `## Resignation and Notice

Submit your resignation in writing to your manager, with a copy to [HR_CONTACT]. Your notice period is in your contract.

During your notice period, you are expected to work normally and assist with handover. We may place you on garden leave - full pay, not attending work.` },
      { id: 'redundancy', title: 'Redundancy', summary: 'Fair process, statutory pay, £669/week cap (2024/25)', required: true, content: `## Redundancy

Redundancy occurs when a role no longer exists - it is about the job, not the person. Guldmann will follow a fair process: identifying affected roles, consulting, exploring alternatives, and paying statutory redundancy pay where applicable.

**Statutory Redundancy Pay** (2+ years' service):
- Under age 22: 0.5 week's pay per year of service
- Ages 22-40: 1 week's pay per year of service
- Age 41+: 1.5 week's pay per year of service

Weekly pay capped at £669 (2024/25). Maximum 20 years of service count.` },
      { id: 'exit', title: 'Exit Interview & Offboarding', summary: 'Voluntary exit interview, return of property, references', required: false, content: `## Exit Interview and Offboarding

[HR_CONTACT] will invite you to an exit interview before you leave. This is voluntary, but we genuinely value the feedback.

**Return of property:** Return all company property on or before your last day. All system access is revoked on your last day.

**References:** All reference requests go through [HR_CONTACT].` },
    ]
  },
];

const ALL_IDS = CATEGORIES.flatMap(c => c.clauses.map(cl => cl.id));
const REQUIRED_IDS = new Set(CATEGORIES.flatMap(c => c.clauses.filter(cl => cl.required).map(cl => cl.id)));
function defaultSelected(): Set<string> { return new Set(ALL_IDS); }

// ---------------------------------------------------------------------------
// SETTINGS PANEL
// ---------------------------------------------------------------------------

const FIELD_GROUPS = [
  { label: 'Company', fields: [{ key: 'companyName', label: 'Company Name', placeholder: 'Guldmann UK' }, { key: 'versionDate', label: 'Version / Year', placeholder: '2025' }] },
  { label: 'HR Contact', fields: [{ key: 'hrContact', label: 'HR Contact Name', placeholder: 'e.g. Sarah Jones' }, { key: 'hrEmail', label: 'HR Email', placeholder: 'hr@guldmann.com' }] },
  { label: 'Pension', fields: [{ key: 'pensionProvider', label: 'Pension Provider', placeholder: 'e.g. NEST, Royal London' }, { key: 'employerPension', label: 'Employer Contribution %', placeholder: 'e.g. 5' }, { key: 'employeePension', label: 'Employee Contribution %', placeholder: 'e.g. 3' }] },
  { label: 'Employment', fields: [{ key: 'probationMonths', label: 'Probation (months)', placeholder: '6' }, { key: 'noticeProbation', label: 'Notice - During Probation', placeholder: '1 week' }, { key: 'noticeUnder2', label: 'Notice - Under 2 Years', placeholder: '1 month' }, { key: 'noticeOver2', label: 'Notice - Over 2 Years', placeholder: '1 week per year (max 12)' }] },
  { label: 'Holiday', fields: [{ key: 'holidayDays', label: 'Holiday Days (inc. bank hols)', placeholder: '28' }, { key: 'holidayYearStart', label: 'Holiday Year Start', placeholder: '1 January' }] },
  { label: 'Sick Pay', fields: [{ key: 'enhancedSickWeeks', label: 'Enhanced Sick Pay - Full Salary Weeks', placeholder: 'e.g. 4 (blank = SSP only)' }] },
  { label: 'Expenses', fields: [{ key: 'expenseBreakfast', label: 'Breakfast Limit (£)', placeholder: '10' }, { key: 'expenseLunch', label: 'Lunch Limit (£)', placeholder: '15' }, { key: 'expenseDinner', label: 'Dinner Limit (£)', placeholder: '25' }, { key: 'cardApprovalLimit', label: 'Card Single Purchase Limit (£)', placeholder: '200' }] },
  { label: 'Additional Benefits', fields: [{ key: 'extraBenefit1', label: 'Benefit 1', placeholder: 'e.g. Private healthcare (AXA Health)' }, { key: 'extraBenefit2', label: 'Benefit 2', placeholder: 'e.g. Annual gym allowance - £300' }, { key: 'extraBenefit3', label: 'Benefit 3', placeholder: 'e.g. EV salary sacrifice scheme' }] },
];

function SettingsPanel({ settings, onChange, onClose }: {
  settings: CompanySettings; onChange: (k: keyof CompanySettings, v: string) => void; onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ x: -360 }} animate={{ x: 0 }} exit={{ x: -360 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute top-0 left-0 bottom-0 w-[360px] bg-white border-r border-gray-200 z-30 flex flex-col shadow-xl"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <Settings className="w-4 h-4 text-[#F4B626]" />
          <span className="text-[13px] font-bold text-gray-900">Company Details</span>
        </div>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-4 h-4" /></button>
      </div>
      <p className="px-5 pt-3 pb-2 text-[11px] text-gray-400 leading-relaxed">Fill in your details. The document updates live as you type.</p>
      <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-5">
        {FIELD_GROUPS.map(group => (
          <div key={group.label}>
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2 mt-3">{group.label}</div>
            <div className="space-y-2">
              {group.fields.map(f => (
                <div key={f.key}>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">{f.label}</label>
                  <input type="text" value={settings[f.key as keyof CompanySettings]}
                    onChange={e => onChange(f.key as keyof CompanySettings, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-1.5 text-[12px] rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:border-[#F4B626] focus:ring-2 focus:ring-[#F4B626]/20 outline-none transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// LEFT PANEL - clause toggles only
// ---------------------------------------------------------------------------

function ClauseCheckbox({ clause, selected, onToggle }: { clause: Clause; selected: boolean; onToggle: () => void }) {
  const required = REQUIRED_IDS.has(clause.id);
  return (
    <button
      type="button"
      onClick={() => !required && onToggle()}
      className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
        selected ? 'bg-[#F4B626]/8 hover:bg-[#F4B626]/12' : 'hover:bg-gray-50'
      } ${required ? 'cursor-default' : 'cursor-pointer'}`}
    >
      <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
        selected ? 'bg-[#F4B626] border-[#F4B626]' : 'border-gray-300 bg-white'
      }`}>
        {selected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[13px] font-medium leading-tight ${selected ? 'text-gray-900' : 'text-gray-400'}`}>{clause.title}</span>
          {required && <span className="text-[9px] font-bold uppercase tracking-wide text-[#c9961e] bg-[#F4B626]/10 px-1.5 py-0.5 rounded">Required</span>}
        </div>
        <span className="block text-[11px] text-gray-400 mt-0.5 leading-snug">{clause.summary}</span>
      </div>
    </button>
  );
}

function CategoryAccordion({ category, selected, onToggleClause, onToggleAll }: {
  category: Category; selected: Set<string>; onToggleClause: (id: string) => void; onToggleAll: (catId: string, on: boolean) => void;
}) {
  const [open, setOpen] = useState(true);
  const count = category.clauses.filter(c => selected.has(c.id)).length;
  const allOn = count === category.clauses.length;
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left">
        <span className="text-base">{category.icon}</span>
        <span className="flex-1 text-[13px] font-semibold text-gray-800">{category.title}</span>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${count === category.clauses.length ? 'bg-[#F4B626]/15 text-[#c9961e]' : count > 0 ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
          {count}/{category.clauses.length}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
            <div className="px-2 pb-2 pt-1 bg-white border-t border-gray-50 space-y-0.5">
              <button type="button" onClick={() => onToggleAll(category.id, !allOn)}
                className="w-full text-left text-[11px] font-medium text-[#F4B626] hover:text-[#c9961e] px-3 py-1.5 transition-colors">
                {allOn ? 'Deselect all' : 'Select all'}
              </button>
              {category.clauses.map(cl => (
                <ClauseCheckbox key={cl.id} clause={cl} selected={selected.has(cl.id)} onToggle={() => onToggleClause(cl.id)} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// INLINE EDITABLE CLAUSE - the heart of the new editing UX
// ---------------------------------------------------------------------------

function InlineClause({ clause, settings, editedContent, onEdit, activeEdit, onSetActive }: {
  clause: Clause & { categoryTitle: string; categoryIcon: string };
  settings: CompanySettings;
  editedContent: Record<string, string>;
  onEdit: (id: string, v: string) => void;
  activeEdit: string | null;
  onSetActive: (id: string | null) => void;
}) {
  const isEditing = activeEdit === clause.id;
  const rawContent = editedContent[clause.id] ?? clause.content;
  const displayContent = applySettings(rawContent, settings);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onEdit(clause.id, e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-[15px] font-bold text-[#111] mt-5 mb-2 first:mt-0 border-b border-gray-100 pb-1.5">{line.slice(3)}</h2>;
      if (line.startsWith('- ')) {
        const html = line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return <li key={i} className="text-[12px] text-gray-700 ml-3 leading-relaxed list-disc" dangerouslySetInnerHTML={{ __html: html }} />;
      }
      if (!line.trim()) return <div key={i} className="h-1" />;
      const html = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={i} className="text-[12px] text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />;
    });
  };

  return (
    <div className="group relative">
      {/* Edit mode */}
      {isEditing ? (
        <div className="relative">
          <div className="absolute -top-2 -left-3 -right-3 -bottom-2 bg-[#FFFBF0] border-2 border-[#F4B626]/40 rounded-xl pointer-events-none z-0" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#c9961e]">
                <Pencil className="w-3 h-3" />
                Editing - use ## for headings, **bold**, - for bullets
              </div>
              <button
                type="button"
                onClick={() => onSetActive(null)}
                className="text-[11px] font-semibold text-[#F4B626] hover:text-[#c9961e] transition-colors px-2 py-0.5 rounded bg-[#F4B626]/10"
              >
                Done
              </button>
            </div>
            <textarea
              ref={textareaRef}
              value={rawContent}
              onChange={handleTextareaChange}
              className="w-full text-[12px] font-mono text-gray-700 bg-white border border-[#F4B626]/30 rounded-lg p-3 resize-none focus:border-[#F4B626] focus:ring-2 focus:ring-[#F4B626]/20 outline-none leading-relaxed min-h-[80px]"
              style={{ overflow: 'hidden' }}
            />
          </div>
        </div>
      ) : (
        /* Read mode - click anywhere to edit */
        <div
          className="relative cursor-text rounded-xl transition-all duration-150 hover:bg-gray-50/80 -mx-3 px-3 py-1"
          onClick={() => onSetActive(clause.id)}
          title="Click to edit"
        >
          {renderContent(displayContent)}
          {/* Edit hint on hover */}
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-1 text-[10px] text-gray-400 bg-white border border-gray-200 rounded-md px-1.5 py-0.5 shadow-sm">
              <Pencil className="w-2.5 h-2.5" />
              Edit
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DOCUMENT PREVIEW
// ---------------------------------------------------------------------------

function DocumentPreview({ selected, settings, editedContent, onEdit }: {
  selected: Set<string>; settings: CompanySettings; editedContent: Record<string, string>;
  onEdit: (id: string, v: string) => void;
}) {
  const [activeEdit, setActiveEdit] = useState<string | null>(null);

  const selectedClauses = CATEGORIES.flatMap(cat =>
    cat.clauses.filter(cl => selected.has(cl.id)).map(cl => ({ ...cl, categoryTitle: cat.title, categoryIcon: cat.icon }))
  );
  const wordCount = selectedClauses.reduce((acc, cl) => acc + (editedContent[cl.id] ?? cl.content).split(' ').length, 0);

  if (selectedClauses.length === 0) return (
    <div className="flex flex-col items-center justify-center h-full text-center p-12">
      <FileText className="w-12 h-12 text-gray-200 mb-4" />
      <p className="text-sm text-gray-400">Select sections from the left to build your handbook</p>
    </div>
  );

  let currentCategory = '';
  return (
    <div id="handbook-document" className="p-8 max-w-[680px] mx-auto">
      {/* Editing hint banner */}
      <div className="no-print mb-4 flex items-center gap-2 text-[11px] text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
        <Pencil className="w-3 h-3 shrink-0" />
        Click any section to edit it directly. Changes appear in Print and Word export.
      </div>

      {/* Cover */}
      <div className="text-center mb-10 pb-8 border-b-2 border-[#F4B626]">
        <div className="flex justify-center mb-4">
          <Image src="/guldmann-logo-real.png" alt="Guldmann" width={150} height={34} />
        </div>
        <h1 className="text-[28px] font-bold text-[#111] leading-tight">Employee Handbook</h1>
        <p className="text-[13px] text-gray-400 mt-2">{settings.companyName || 'Guldmann UK'} - Version 1.0 - {settings.versionDate || '2025'}</p>
        <div className="mt-3 text-[11px] text-gray-400">{selectedClauses.length} sections - approx. {wordCount.toLocaleString()} words</div>
      </div>

      {selectedClauses.map(clause => {
        const showCat = clause.categoryTitle !== currentCategory;
        if (showCat) currentCategory = clause.categoryTitle;
        return (
          <div key={clause.id}>
            {showCat && (
              <div className="mt-8 mb-4 flex items-center gap-2">
                <span className="text-lg">{clause.categoryIcon}</span>
                <h2 className="text-[17px] font-bold text-[#111]">{clause.categoryTitle}</h2>
                <div className="flex-1 h-px bg-gray-200 ml-2" />
              </div>
            )}
            <div className="mb-6">
              <InlineClause
                clause={clause} settings={settings} editedContent={editedContent}
                onEdit={onEdit} activeEdit={activeEdit} onSetActive={setActiveEdit}
              />
            </div>
          </div>
        );
      })}

      <div className="mt-12 pt-6 border-t border-gray-200 text-[10px] text-gray-400 text-center">
        <p className="font-medium text-gray-600">{settings.companyName || 'Guldmann UK'} Employee Handbook - Confidential</p>
        {settings.hrContact && <p className="mt-1">For questions, contact {settings.hrContact}{settings.hrEmail ? ` at ${settings.hrEmail}` : ''}.</p>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN PAGE
// ---------------------------------------------------------------------------

export default function HandbookBuilder() {
  const [selected, setSelected] = useState<Set<string>>(defaultSelected);
  const [settings, setSettings] = useState<CompanySettings>(DEFAULT_SETTINGS);
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  const [showSettings, setShowSettings] = useState(false);
  const [search, setSearch] = useState('');
  const [exporting, setExporting] = useState(false);

  const toggleClause = useCallback((id: string) => {
    if (REQUIRED_IDS.has(id)) return;
    setSelected(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  }, []);

  const toggleAll = useCallback((catId: string, on: boolean) => {
    const cat = CATEGORIES.find(c => c.id === catId); if (!cat) return;
    setSelected(prev => {
      const n = new Set(prev);
      cat.clauses.forEach(cl => { if (REQUIRED_IDS.has(cl.id)) return; if (on) n.add(cl.id); else n.delete(cl.id); });
      return n;
    });
  }, []);

  const handleEdit = useCallback((id: string, content: string) => {
    setEditedContent(prev => ({ ...prev, [id]: content }));
  }, []);

  const updateSetting = useCallback((key: keyof CompanySettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const handlePrint = () => window.print();

  const handleExportWord = async () => {
    setExporting(true);
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = await import('docx');

      const selectedClauses = CATEGORIES.flatMap(cat =>
        cat.clauses.filter(cl => selected.has(cl.id)).map(cl => ({ ...cl, categoryTitle: cat.title }))
      );

      const children: InstanceType<typeof Paragraph>[] = [
        new Paragraph({ text: settings.companyName || 'Guldmann UK', heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: 'Employee Handbook', heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: `Version 1.0 - ${settings.versionDate || '2025'}`, alignment: AlignmentType.CENTER, spacing: { after: 400 } }),
      ];

      let currentCat = '';
      for (const clause of selectedClauses) {
        if (clause.categoryTitle !== currentCat) {
          currentCat = clause.categoryTitle;
          children.push(new Paragraph({ text: clause.categoryTitle, heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 }, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'F4B626', space: 4 } } }));
        }
        const raw = editedContent[clause.id] ?? clause.content;
        const content = applySettings(raw, settings);
        for (const line of content.split('\n')) {
          if (!line.trim()) continue;
          if (line.startsWith('## ')) { children.push(new Paragraph({ text: line.slice(3), heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 } })); }
          else if (line.startsWith('- ')) { children.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: line.slice(2).replace(/\*\*(.*?)\*\*/g, '$1') })] })); }
          else {
            const parts = line.split(/\*\*(.*?)\*\*/g);
            children.push(new Paragraph({ children: parts.map((part, i) => new TextRun({ text: part, bold: i % 2 === 1 })), spacing: { after: 120 } }));
          }
        }
      }

      const doc = new Document({ sections: [{ children }] });
      const base64 = await Packer.toBase64String(doc);
      const a = document.createElement('a');
      a.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64}`;
      a.download = `${(settings.companyName || 'Guldmann-UK').replace(/\s+/g, '-')}-Employee-Handbook-${settings.versionDate || '2025'}.docx`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } catch (err) {
      console.error('Export failed', err);
      alert('Export failed - please try again.');
    } finally {
      setExporting(false);
    }
  };

  const filteredCategories = search.trim()
    ? CATEGORIES.map(cat => ({ ...cat, clauses: cat.clauses.filter(cl => cl.title.toLowerCase().includes(search.toLowerCase()) || cl.summary.toLowerCase().includes(search.toLowerCase())) })).filter(cat => cat.clauses.length > 0)
    : CATEGORIES;

  return (
    <>
      <style>{`
        .no-print { display: flex; }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        @page { margin: 20mm; size: A4; }
      `}</style>

      <div className="flex flex-col h-screen bg-[#F8F8F6] overflow-hidden">
        {/* Top bar */}
        <div className="no-print shrink-0 flex items-center gap-4 px-5 py-3 bg-white border-b border-gray-100 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <Image src="/guldmann-logo-real.png" alt="Guldmann" width={110} height={26} />
            <div className="h-5 w-px bg-gray-200" />
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Handbook Builder</span>
          </div>
          <div className="flex-1" />
          <div className="text-[12px] text-gray-500">
            <span className="font-bold text-gray-800">{selected.size}</span>/{ALL_IDS.length} sections
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setShowSettings(s => !s)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-all ${showSettings ? 'bg-[#F4B626]/10 border-[#F4B626]/40 text-[#c9961e]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              <Settings className="w-3.5 h-3.5" />
              Company Details
            </button>
            <button type="button" onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <Printer className="w-3.5 h-3.5" />
              Print / PDF
            </button>
            <button type="button" onClick={handleExportWord} disabled={exporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4B626] text-[12px] font-semibold text-black hover:bg-[#e0a820] transition-colors disabled:opacity-60">
              <Download className="w-3.5 h-3.5" />
              {exporting ? 'Exporting...' : 'Export Word'}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden relative">
          <AnimatePresence>
            {showSettings && <SettingsPanel settings={settings} onChange={updateSetting} onClose={() => setShowSettings(false)} />}
          </AnimatePresence>

          {/* Left panel - section toggles only */}
          <div className={`no-print w-[340px] shrink-0 flex flex-col border-r border-gray-100 bg-white overflow-hidden transition-[margin] ${showSettings ? 'ml-[360px]' : ''}`}>
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input type="text" placeholder="Search sections..." value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-[12px] rounded-lg border border-gray-200 focus:border-[#F4B626] focus:ring-1 focus:ring-[#F4B626]/20 outline-none" />
                {search && <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-3 h-3 text-gray-400" /></button>}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredCategories.map(cat => (
                <CategoryAccordion key={cat.id} category={cat} selected={selected} onToggleClause={toggleClause} onToggleAll={toggleAll} />
              ))}
              {filteredCategories.length === 0 && <div className="text-center py-8 text-[12px] text-gray-400">No sections match</div>}
            </div>
            <div className="p-3 border-t border-gray-100 flex gap-2">
              <button type="button" onClick={() => setSelected(new Set(ALL_IDS))}
                className="flex-1 py-1.5 text-[11px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Select all</button>
              <button type="button" onClick={() => setSelected(new Set(REQUIRED_IDS))}
                className="flex-1 py-1.5 text-[11px] font-medium text-[#F4B626] border border-[#F4B626]/30 rounded-lg hover:bg-[#F4B626]/5 transition-colors">Required only</button>
            </div>
          </div>

          {/* Right - document preview with inline editing */}
          <div className="flex-1 overflow-y-auto bg-[#F8F8F6]">
            <div className="min-h-full bg-white shadow-sm mx-auto my-6 rounded-xl overflow-hidden" style={{ maxWidth: '780px' }}>
              <DocumentPreview selected={selected} settings={settings} editedContent={editedContent} onEdit={handleEdit} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
