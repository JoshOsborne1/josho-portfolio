'use client';

import { useState, useCallback, useRef, useEffect, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, FileText, Pencil, Printer, Search, Settings, X } from 'lucide-react';
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
  versionDate: '2026',
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
    .replace(/\[VERSION_DATE\]/g, s.versionDate || '2026')
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
  label: string;
  clauses: Clause[];
}

const CATEGORIES: Category[] = [
  {
    id: 'welcome', title: 'Welcome & Introduction', label: 'WEL',
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
      { id: 'handbook-use', title: 'How to Use This Handbook', summary: 'Reading alongside your contract, what this document is and is not', required: false, content: `## How to Use This Handbook

This handbook covers the main policies and practices that apply to your employment with [COMPANY_NAME]. Read it alongside your individual employment contract - where the two differ, your contract takes precedence.

We review this handbook regularly. You will be notified of any significant changes. The most current version is always available from [HR_CONTACT].

This handbook does not form part of your contract of employment unless your contract specifically says so.` },
      { id: 'code-of-conduct', title: 'Code of Conduct', summary: 'Human Rights, Labour Rights, Environment, Anti-Corruption', required: true, content: `## Code of Conduct

Guldmann operates to a global Code of Conduct built on four principles: Human Rights, Labour Rights, Environment, and Anti-Corruption.

In practical terms this means: treat everyone fairly and with respect, pay and reward people properly, consider the environmental impact of what we do, and never accept or offer anything that could be considered a bribe or improper benefit.

The full Code of Conduct is available from [HR_CONTACT].` },
    ]
  },
  {
    id: 'employment', title: 'Your Employment', label: 'EMP',
    clauses: [
      { id: 'contracts', title: 'Employment Contracts', summary: 'Written particulars, contract changes', required: true, content: `## Employment Contracts

Every employee receives a written statement of employment particulars on or before their first day. This confirms your job title, start date, pay, working hours, holiday entitlement, and notice period.

If anything in your contract needs to change - your hours, your role, your location - this will be agreed with you and confirmed in writing.` },
      { id: 'probation', title: 'Probationary Period', summary: 'Six-month probation with mid-point review', required: false, content: `## Probationary Period

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

**During probation:** [NOTICE_PROBATION] notice from either side
**Under 2 years service:** [NOTICE_UNDER_2] notice from either side
**Over 2 years service:** [NOTICE_OVER_2]

> Notice may be waived by mutual agreement or replaced with payment in lieu. Your contract is the definitive reference.` },
    ]
  },
  {
    id: 'pay-benefits', title: 'Pay & Benefits', label: 'PAY',
    clauses: [
      { id: 'pay-dates', title: 'Pay & Payslips', summary: 'Monthly pay, payslip details, error reporting', required: true, content: `## Pay and Payslips

You are paid monthly, on the last working day of each month, directly into your nominated bank account. Keep your bank details up to date with [HR_CONTACT].

Your payslip shows gross pay, all deductions (income tax, National Insurance, pension), and net pay. Payslips are issued electronically.

If you believe your pay is incorrect, contact [HR_CONTACT] immediately.` },
      { id: 'expenses', title: 'Expenses Policy', summary: 'HMRC mileage, subsistence, receipts, approval', required: false, content: `## Expenses

Guldmann will reimburse all reasonable and legitimate business expenses.

**Mileage - own vehicle (HMRC 2024/25)**
**First 10,000 miles/year:** 45p per mile
**Over 10,000 miles:** 25p per mile
**Commute to normal workplace:** Not claimable

**Subsistence (while away on business)**
**Breakfast (before 06:00):** Up to £[EXPENSE_BREAKFAST]
**Lunch:** Up to £[EXPENSE_LUNCH]
**Evening meal (after 20:00):** Up to £[EXPENSE_DINNER]

> Always keep receipts. Submit within 30 days. Manager approval required before claiming.` },
      { id: 'company-card', title: 'Company Credit Card', summary: 'Business use only, approval thresholds, reporting', required: false, content: `## Company Credit Card

Some roles include a company credit card. The card is for business purchases only. Personal use is not permitted.

- Manager approval required for any single purchase over £[CARD_LIMIT]
- Submit receipts and a brief purpose note for every transaction
- Report a lost or stolen card to [HR_CONTACT] and accounts immediately

Spend Guldmann money the way you would spend your own.` },
      { id: 'company-car', title: 'Company Car Policy', summary: 'Eligibility, standards, fines, private use, BIK', required: false, content: `## Company Car Policy

Company cars are available to certain roles where the business need is clear. Eligibility is confirmed in your contract. Electric vehicles are preferred.

**Your responsibilities:** Keep the car clean, ensure it is serviced on schedule, report any damage promptly.

**Fines:** Parking and speeding penalties are your responsibility.

**Private use:** Any agreed private mileage creates a taxable Benefit in Kind.` },
      { id: 'pension', title: 'Pension', summary: 'Auto-enrolment, contributions, scheme details', required: true, content: `## Pension

> You are automatically enrolled when you meet the qualifying criteria. You may opt out but this affects your retirement provision.

**Pension provider:** [PENSION_PROVIDER]
**Employer contribution:** [EMPLOYER_PENSION]
**Your contribution:** [EMPLOYEE_PENSION]
**Basis:** Qualifying earnings per HMRC guidelines

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
    id: 'time-off', title: 'Time Off', label: 'LEA',
    clauses: [
      { id: 'holiday', title: 'Holiday Entitlement', summary: 'Days, holiday year, booking, carry-over', required: true, content: `## Holiday Entitlement

Your entitlement is **[HOLIDAY_DAYS] days** per year, inclusive of 8 UK bank holidays. Part-time is pro-rated.

> Part-time staff: bank holidays that fall on non-working days do not automatically convert to lieu days.

**Holiday year start:** [HOLIDAY_YEAR_START]
**Carry-over:** Up to 5 days by agreement only
**On leaving:** Accrued untaken days paid in final salary
**Booking:** Via your manager - summer by March, Christmas by October` },
      { id: 'bank-holidays', title: 'Bank Holidays', summary: 'Eight UK bank holidays, substitute days, part-time pro-rata', required: false, content: `## Bank Holidays

Your [HOLIDAY_DAYS]-day holiday entitlement includes the eight UK public bank holidays. If a bank holiday falls on a day you do not normally work, you do not receive an automatic substitute day - your entitlement is calculated pro-rata based on your contracted days.

We aim to close the office on all UK bank holidays. If your role requires you to work on a bank holiday, you will be given a substitute day off in lieu to be taken by agreement with your manager.

Part-time employees: your entitlement is proportional to your contracted hours.` },
      { id: 'sickness-during-holiday', title: 'Sickness During Holiday', summary: 'Right to reclaim holiday days lost to illness', required: false, content: `## Sickness During Holiday

If you fall ill before or during a period of pre-booked holiday, you have the right to reclaim those days as sick leave rather than holiday, provided you follow the normal sickness reporting procedure.

**What to do:**
- Notify your manager as soon as you are too unwell to enjoy your holiday
- Obtain a fit note if the illness lasts more than 7 calendar days
- The days you were ill can be rebooked as holiday at a later date

This is a statutory right under UK law. Contact [HR_CONTACT] for guidance on how to apply it in practice.` },
      { id: 'sick-leave', title: 'Sick Leave & SSP', summary: 'Reporting, SSP rates, fit notes, return interviews', required: true, content: `## Sick Leave and Statutory Sick Pay

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
    id: 'family-leave', title: 'Family Leave', label: 'FAM',
    clauses: [
      { id: 'maternity', title: 'Maternity Leave & Pay', summary: 'Up to 52 weeks, SMP rates, KIT days', required: true, content: `## Maternity Leave and Pay

**Leave:** Up to 52 weeks (26 weeks Ordinary + 26 weeks Additional), regardless of length of service.

**Notification:** Notify Guldmann by the 15th week before your due date. Provide your MATB1 certificate.

**SMP breakdown (2024/25)**
**Weeks 1-6:** 90% of your average weekly earnings
**Weeks 7-39:** £187.18/week (or 90% AWE if lower)
**Weeks 40-52:** Unpaid - you may use annual leave

**Keeping in Touch (KIT) days:** Up to 10 voluntary KIT days during maternity leave.

Contact [HR_CONTACT] to discuss your maternity plans.` },
      { id: 'paternity', title: 'Paternity Leave & Pay', summary: '1-2 weeks, SPP rates', required: true, content: `## Paternity Leave and Pay

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
      { id: 'pregnancy-risk', title: 'Pregnancy: Risk Assessments & Adjustments', summary: 'Duty to adjust duties and workspace from notification of pregnancy', required: true, content: `## Pregnancy: Risk Assessments and Adjustments

As soon as you tell us you are pregnant, we have a legal duty to carry out a pregnancy risk assessment and make any necessary adjustments to your role, workspace, or working pattern.

This applies immediately - it does not wait for maternity leave to begin.

**Common adjustments may include:**
- Changes to manual handling or physical tasks
- Adjustments to working hours or rest breaks
- Workspace modifications
- Temporary redeployment to a lower-risk role if needed

Speak to [HR_CONTACT] as soon as you are ready to share your news - the earlier we know, the sooner we can put the right support in place. Everything is handled in confidence.` },
      { id: 'parental-leave', title: 'Unpaid Parental Leave', summary: '18 weeks unpaid per child, max 4 weeks/year', required: true, content: `## Parental Leave (Unpaid)

Employees with at least one year's service are entitled to 18 weeks of unpaid parental leave per child, up to the child's 18th birthday. Maximum 4 weeks in any one year.

Give at least 21 days notice. Speak to [HR_CONTACT] for details.` },
    ]
  },
  {
    id: 'performance', title: 'Performance & Development', label: 'DEV',
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
      { id: 'probation-reviews', title: 'Probation Reviews', summary: 'Mid-point check-in and final confirmation structure', required: false, content: `## Probation Reviews

Your [PROBATION_MONTHS]-month probation includes two structured touchpoints:

**Mid-point review (~3 months):** An informal conversation with your manager covering how you have settled in, what is going well, and any support you need. Two-way: your manager listens as much as they talk.

**Final review ([PROBATION_MONTHS] months):** A formal meeting to confirm employment. Your manager will share feedback on performance, conduct, and culture fit. You will have the chance to share your own reflections.

If there are concerns at any stage, your manager will raise them before the review - no surprises at the end.` },
      { id: 'career-progression', title: 'Career Progression', summary: 'Goal setting, promotion criteria, pay review cycle', required: false, content: `## Career Progression

Guldmann is a growing company and we want our people to grow with it. Career progression here is based on performance, attitude, and the business need for the role - not on tenure alone.

**Annual appraisal:** The main forum for discussing your development, setting objectives, and reviewing pay.

**Pay reviews:** Conducted annually, linked to your appraisal outcome and company performance.

**Promotion:** When a more senior role becomes available - or when your contribution has grown significantly beyond your current role - your manager will discuss next steps. We promote from within where we can.

If you have ambitions beyond your current role, tell your manager. We cannot help if we do not know.` },
      { id: 'learning', title: 'Learning & Development', summary: 'Guldmann Academy, external training, study leave', required: false, content: `## Learning and Development

Guldmann invests in its people. When you grow, we grow.

**Guldmann Academy:** Internal learning platform for product knowledge, technical training, and professional development.

**External training:** Guldmann will support and fund relevant external training.

**Study leave:** Paid time off for exams when undertaking a company-supported qualification.

Contact [HR_CONTACT] to discuss training and development.` },
    ]
  },
  {
    id: 'conduct', title: 'Conduct & Discipline', label: 'CON',
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
    id: 'health-safety', title: 'Health, Safety & Wellbeing', label: 'H&S',
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
      { id: 'ppe-workwear', title: 'Workwear & PPE', summary: 'Installer and technician requirements', required: true, content: `## Workwear and PPE

**Installers and Service Technicians:** Company-issued workwear must be worn at all times on customer sites. Safety footwear required in all applicable environments.

**Screen and Safety Glasses:** If your role involves significant screen use, you are entitled to a company-funded eye test. Contact [HR_CONTACT] for details.` },
      { id: 'risk-assessments', title: 'Risk Assessments', summary: 'Who conducts them, when, employee duty to flag hazards', required: true, content: `## Risk Assessments

[COMPANY_NAME] conducts risk assessments for all roles and working environments. These are reviewed regularly and whenever something significant changes - a new task, a new location, new equipment, or an incident.

**Your responsibilities:**
- Follow the safe working practices identified in assessments for your role
- Flag any new hazard, near miss, or change in your working environment to your manager immediately
- Never start a task you believe carries an uncontrolled risk - stop and raise it first

Risk assessments are not bureaucracy. They are the mechanism by which we keep each other safe.` },
      { id: 'dse', title: 'Display Screen Equipment & Eye Tests', summary: 'DSE regulations, eye test entitlement, screen setup', required: true, content: `## Display Screen Equipment and Eye Tests

If you regularly use a computer, laptop, or other display screen as a significant part of your work, you are a "DSE user" under the Health and Safety (Display Screen Equipment) Regulations 1992.

**Your entitlements:**
- A DSE workstation assessment to ensure your setup is ergonomically correct
- A company-funded eye test (ask [HR_CONTACT] for the voucher process)
- A contribution towards corrective lenses if your eye test shows you need them specifically for DSE work

**Your responsibilities:**
- Complete your DSE assessment when requested
- Adjust your screen, chair, and desk to the recommended settings
- Report any discomfort, eye strain, or headaches linked to screen use early - do not wait until it becomes a problem` },
      { id: 'working-environment-committee', title: 'Working Environment Committee', summary: 'Employee representatives, how concerns are raised collectively', required: false, content: `## Working Environment Committee

Guldmann operates a Working Environment Committee (WEC) through which employees can raise concerns, make suggestions, and engage with company-level health, safety, and wellbeing matters.

Employee representatives are elected from within the team. The WEC meets regularly and reports to leadership.

If you have a concern that is wider than your immediate team - or that you feel is better raised collectively than individually - speak to your WEC representative or contact [HR_CONTACT].` },
      { id: 'mental-health', title: 'Mental Health & Wellbeing', summary: 'Open culture, reasonable adjustments', required: false, content: `## Mental Health and Wellbeing

We take mental health seriously. We are a small team, and we notice when someone is struggling.

If you are going through a difficult time, please talk to your manager or [HR_CONTACT]. We will treat what you share in confidence.

Long-term mental health conditions are a disability under the Equality Act 2010. We have a duty to make reasonable adjustments where these are needed.` },
    ]
  },
  {
    id: 'data-it', title: 'Data, IT & Security', label: 'IT',
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
    id: 'leaving', title: 'Leaving Guldmann', label: 'LEV',
    clauses: [
      { id: 'resignation', title: 'Resignation & Notice', summary: 'Written resignation, notice periods, garden leave', required: true, content: `## Resignation and Notice

Submit your resignation in writing to your manager, with a copy to [HR_CONTACT]. Your notice period is in your contract.

During your notice period, you are expected to work normally and assist with handover. We may place you on garden leave - full pay, not attending work.` },
      { id: 'redundancy', title: 'Redundancy', summary: 'Fair process, statutory pay, weekly cap 2024/25', required: true, content: `## Redundancy

Redundancy occurs when a role no longer exists - it is about the job, not the person. Guldmann will follow a fair process: identifying affected roles, consulting, exploring alternatives, and paying statutory redundancy pay where applicable.

**Statutory Redundancy Pay** (2+ years service):
- Under age 22: 0.5 week's pay per year of service
- Ages 22-40: 1 week's pay per year of service
- Age 41+: 1.5 week's pay per year of service

Weekly pay capped at £669 (2024/25). Maximum 20 years of service count.` },
      { id: 'retirement', title: 'Retirement', summary: 'Farewell gathering, company gift, flexible transition options', required: false, content: `## Retirement

When you decide to retire, let your manager and [HR_CONTACT] know as early as possible so we can plan a proper handover and farewell.

**Company gift:** A gift to mark your service, sized to the length of your time at Guldmann.

**Farewell gathering:** A gathering for close colleagues if you would like one - we take our lead from you on how you want to mark it.

**Phased retirement:** If you would prefer to reduce your hours gradually rather than stopping all at once, speak to your manager. We will consider phased arrangements where the role allows.` },
      { id: 'return-of-property', title: 'Return of Company Property', summary: 'All assets returned on last day, access revoked', required: true, content: `## Return of Company Property

On or before your last day, you must return all company property. This includes:

- Laptop, phone, and any other hardware
- Company credit card
- Company car keys, fuel card, and documentation
- Access fobs, keys, and security passes
- Any company documents (physical or digital copies)

All system access - email, SharePoint, internal tools - is revoked on your last day. If you hold any company data on a personal device, delete it.

Failure to return company property may result in the cost being deducted from your final pay (where permitted by law) or recovery through other means.` },
      { id: 'references', title: 'References Policy', summary: 'How references are handled and what Guldmann will provide', required: false, content: `## References Policy

All requests for employment references must be directed to [HR_CONTACT] at [HR_EMAIL]. Managers should not provide individual references without going through HR.

**What we provide:** Guldmann's standard reference confirms your job title, employment dates, and (if you consent) whether you left in good standing.

**What we do not provide:** Personal character references or detailed performance assessments as part of a standard reference.

If a prospective employer requires a more detailed reference, speak to [HR_CONTACT] to discuss what can be provided.` },
      { id: 'exit', title: 'Exit Interview & Offboarding', summary: 'Voluntary exit interview, return of property, references', required: false, content: `## Exit Interview and Offboarding

[HR_CONTACT] will invite you to an exit interview before you leave. This is voluntary, but we genuinely value the feedback.

**Return of property:** Return all company property on or before your last day. All system access is revoked on your last day.

**References:** All reference requests go through [HR_CONTACT].` },
    ]
  },
  {
    id: 'acknowledgement', title: 'Acknowledgement', label: 'ACK',
    clauses: [
      { id: 'acknowledgement-page', title: 'Acknowledgement Page', summary: 'Signed confirmation that employee has read the handbook', required: false, content: `## Acknowledgement

I confirm that I have received, read, and understood the [COMPANY_NAME] Employee Handbook (Version 1.0, [VERSION_DATE]).

I understand that:

- This handbook sets out the policies, procedures, and expectations that apply to my employment
- It does not form part of my contract of employment unless my contract specifically states otherwise
- I am responsible for familiarising myself with its contents and asking [HR_CONTACT] if anything is unclear
- The handbook may be updated from time to time and I will be notified of significant changes

**Employee name:** ___________________________________

**Job title:** ___________________________________

**Signature:** ___________________________________

**Date:** ___________________________________

_Please return a signed copy of this page to [HR_CONTACT] at [HR_EMAIL]._` },
    ]
  }
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
  { label: 'Expenses', fields: [{ key: 'expenseBreakfast', label: 'Breakfast Limit (GBP)', placeholder: '10' }, { key: 'expenseLunch', label: 'Lunch Limit (GBP)', placeholder: '15' }, { key: 'expenseDinner', label: 'Dinner Limit (GBP)', placeholder: '25' }, { key: 'cardApprovalLimit', label: 'Card Single Purchase Limit (GBP)', placeholder: '200' }] },
  { label: 'Additional Benefits', fields: [{ key: 'extraBenefit1', label: 'Benefit 1', placeholder: 'e.g. Private healthcare (AXA Health)' }, { key: 'extraBenefit2', label: 'Benefit 2', placeholder: 'e.g. Annual gym allowance - 300 GBP' }, { key: 'extraBenefit3', label: 'Benefit 3', placeholder: 'e.g. EV salary sacrifice scheme' }] },
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
// LEFT PANEL
// ---------------------------------------------------------------------------

function ClauseCheckbox({ clause, selected, onToggle }: { clause: Clause; selected: boolean; onToggle: () => void }) {
  const required = REQUIRED_IDS.has(clause.id);
  return (
    <button type="button" onClick={() => !required && onToggle()}
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
        <span className="text-[10px] font-bold tracking-widest text-[#F4B626] bg-[#F4B626]/10 px-2 py-1 rounded font-mono">{category.label}</span>
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
// INLINE EDITABLE CLAUSE
// ---------------------------------------------------------------------------

// ─── RICH CONTENT RENDERER ───────────────────────────────────────────────────

type Block =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'para'; html: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'defs'; pairs: { key: string; val: string }[] }
  | { type: 'callout'; text: string }
  | { type: 'divider' };

function inlineHtml(s: string): string {
  return s.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
}

function parseBlocks(text: string): Block[] {
  const lines = text.split('\n');
  const blocks: Block[] = [];
  let bulletAcc: string[] = [];
  let defAcc: { key: string; val: string }[] = [];

  const flushBullets = () => { if (bulletAcc.length) { blocks.push({ type: 'bullets', items: [...bulletAcc] }); bulletAcc = []; } };
  const flushDefs = () => { if (defAcc.length) { blocks.push({ type: 'defs', pairs: [...defAcc] }); defAcc = []; } };
  const flushAll = () => { flushBullets(); flushDefs(); };

  for (const raw of lines) {
    const t = raw.trim();
    if (!t) { flushAll(); continue; }
    if (t === '---') { flushAll(); blocks.push({ type: 'divider' }); continue; }
    if (t.startsWith('## ')) { flushAll(); blocks.push({ type: 'heading', level: 2, text: t.slice(3) }); continue; }
    if (t.startsWith('### ')) { flushAll(); blocks.push({ type: 'heading', level: 3, text: t.slice(4) }); continue; }
    if (t.startsWith('> ')) { flushAll(); blocks.push({ type: 'callout', text: t.slice(2) }); continue; }
    if (t.startsWith('- ') || t.startsWith('* ')) {
      flushDefs();
      bulletAcc.push(t.slice(2));
      continue;
    }
    // Detect "**Key:** value" definition pairs
    const defMatch = t.match(/^\*\*(.+?):\*\*\s+(.+)$/);
    if (defMatch) {
      flushBullets();
      defAcc.push({ key: defMatch[1], val: defMatch[2] });
      continue;
    }
    flushAll();
    blocks.push({ type: 'para', html: inlineHtml(t) });
  }
  flushAll();
  return blocks;
}

function RichBlock({ block, idx }: { block: Block; idx: number }) {
  switch (block.type) {
    case 'heading':
      return block.level === 2
        ? <div key={idx} className="rc-h2 flex items-center gap-2 mb-2 mt-1">
            <div className="w-2 h-2 bg-[#F4B626] rounded-sm shrink-0" />
            <h2 className="text-[13px] font-black text-[#111] leading-tight tracking-tight">{block.text}</h2>
          </div>
        : <h3 key={idx} className="text-[11.5px] font-bold text-[#555] mb-1.5 mt-2 leading-tight pl-3 border-l-2 border-[#F4B626]/50">{block.text}</h3>;

    case 'para':
      return <p key={idx} className="text-[11px] text-gray-600 mb-2 leading-[1.65]" dangerouslySetInnerHTML={{ __html: block.html }} />;

    case 'bullets':
      return (
        <ul key={idx} className="mb-2 space-y-0.5">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-2">
              <span className="mt-[5px] w-1.5 h-1.5 bg-[#F4B626] rounded-sm shrink-0" />
              <span className="text-[11px] text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: inlineHtml(item) }} />
            </li>
          ))}
        </ul>
      );

    case 'defs':
      return (
        <table key={idx} className="rc-defs w-full mb-2 border-collapse">
          <tbody>
            {block.pairs.map((p, j) => (
              <tr key={j} className={j % 2 === 0 ? 'bg-gray-50/80' : 'bg-white'}>
                <td className="text-[10px] font-bold text-[#111] py-1 px-2 w-[38%] border border-gray-100 leading-snug align-top">{p.key}</td>
                <td className="text-[11px] text-gray-600 py-1 px-2 border border-gray-100 leading-snug align-top" dangerouslySetInnerHTML={{ __html: inlineHtml(p.val) }} />
              </tr>
            ))}
          </tbody>
        </table>
      );

    case 'callout':
      return (
        <div key={idx} className="rc-callout flex items-start gap-2 bg-[#F4B626]/8 border-l-3 border-[#F4B626] pl-3 pr-2 py-2 mb-2 rounded-r-md">
          <span className="text-[#F4B626] text-[11px] mt-px shrink-0 font-black">!</span>
          <p className="text-[11px] font-medium text-gray-700 leading-relaxed">{block.text}</p>
        </div>
      );

    case 'divider':
      return <div key={idx} className="my-2 h-px bg-gray-100" />;

    default:
      return null;
  }
}

function renderContent(text: string): React.ReactNode {
  const blocks = parseBlocks(text);
  return blocks.map((b, i) => <RichBlock key={i} block={b} idx={i} />);
}

function InlineClause({ clause, settings, editedContent, onEdit, activeEdit, onSetActive }: {
  clause: Clause;
  settings: CompanySettings;
  editedContent: Record<string, string>;
  onEdit: (id: string, v: string) => void;
  activeEdit: string | null;
  onSetActive: (id: string | null) => void;
}) {
  const isEditing = activeEdit === clause.id;
  const rawContent = editedContent[clause.id] ?? clause.content;
  const displayContent = applySettings(rawContent, settings);
  const editRef = useRef<HTMLDivElement>(null);
  const renderRef = useRef<HTMLDivElement>(null);

  // On enter-edit: populate contenteditable with plain text and match render height
  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.innerText = rawContent;
      editRef.current.focus();
      // Place cursor at end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInput = () => {
    if (editRef.current) {
      onEdit(clause.id, editRef.current.innerText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onSetActive(null); }
  };

  return (
    <div className="doc-clause-editable-root" onClick={() => { if (!isEditing) onSetActive(clause.id); }}>
      {/* Rendered view - always present, hidden while editing */}
      <div
        ref={renderRef}
        className={`doc-clause-render ${isEditing ? 'invisible absolute inset-0' : 'cursor-text'}`}
        title={isEditing ? undefined : 'Click to edit'}
      >
        {renderContent(displayContent)}
      </div>

      {/* Contenteditable editor - overlays rendered view exactly */}
      {isEditing && (
        <div
          ref={editRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onBlur={() => onSetActive(null)}
          className="doc-clause-editor"
          spellCheck
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PAGE HEADER & FOOTER COMPONENTS
// ---------------------------------------------------------------------------

function PageHeader({ section, pageNum, settings }: { section: string; pageNum?: number; settings: CompanySettings }) {
  return (
    <div className="doc-header flex items-center justify-between mb-0 pb-2.5 border-b-2 border-[#F4B626]">
      <Image src="/guldmann-logo-black.png" alt="Guldmann" width={110} height={18} className="object-contain" unoptimized />
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">{section}</span>
        {pageNum !== undefined && <span className="text-[10px] font-mono text-[#F4B626] font-bold">{String(pageNum).padStart(2,'0')}</span>}
      </div>
    </div>
  );
}

function PageFooter({ settings, note }: { settings: CompanySettings; note?: string }) {
  return (
    <div className="doc-footer flex items-center justify-between pt-2 mt-auto border-t border-gray-100">
      <span className="text-[9px] text-gray-300 uppercase tracking-wide font-medium">{note || `Employee Handbook ${settings.versionDate || '2026'} - Confidential`}</span>
      <span className="text-[9px] text-gray-300">{settings.companyName || 'Guldmann UK'}</span>
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

  const selectedCategories = CATEGORIES
    .map(cat => ({ ...cat, clauses: cat.clauses.filter(cl => selected.has(cl.id)) }))
    .filter(cat => cat.clauses.length > 0);

  const totalClauses = selectedCategories.reduce((a, c) => a + c.clauses.length, 0);
  const wordCount = selectedCategories.flatMap(c => c.clauses).reduce(
    (acc, cl) => acc + (editedContent[cl.id] ?? cl.content).split(' ').length, 0
  );

  if (selectedCategories.length === 0) return (
    <div className="flex flex-col items-center justify-center h-full text-center p-12">
      <FileText className="w-12 h-12 text-gray-200 mb-4" />
      <p className="text-sm text-gray-400">Select sections from the left to build your handbook</p>
    </div>
  );

  let pageNum = 0;

  return (
    <div id="handbook-print-root" className="handbook-print-root">
      {/* Edit hint - screen only */}
      <div className="no-print mx-auto mt-5 mb-0 max-w-[794px] flex items-center gap-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
        <Pencil className="w-3 h-3 shrink-0" />
        Click any clause to edit in place. Changes carry through to Word and PDF export.
      </div>

      {/* ── COVER PAGE ── */}
      <div className="doc-page doc-cover bg-white">
        {/* Yellow accent bar top */}
        <div className="doc-cover-topbar bg-[#F4B626] flex items-center justify-between px-8 py-3">
          <Image src="/guldmann-logo-black.png" alt="Guldmann" width={120} height={20} className="object-contain" unoptimized />
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#111111]">Confidential</span>
        </div>
        {/* Main cover body */}
        <div className="doc-cover-body flex flex-col justify-between flex-1 px-10 py-8">
          {/* Hero */}
          <div className="flex flex-col justify-center flex-1">
            <div className="mb-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#F4B626] mb-4">
                {settings.companyName || 'Guldmann UK'}
              </div>
              <div className="text-[72px] font-black text-[#111111] leading-[0.9] tracking-tight">
                Employee<br />
                <span className="text-[#F4B626]">Handbook</span>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Version 1.0 / {settings.versionDate || '2026'}</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
            </div>
            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <div className="text-[28px] font-black text-[#F4B626] leading-none">{selectedCategories.length}</div>
                <div className="text-[9px] text-gray-400 uppercase tracking-wide mt-1 font-medium">Sections</div>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <div className="text-[28px] font-black text-[#F4B626] leading-none">{totalClauses}</div>
                <div className="text-[9px] text-gray-400 uppercase tracking-wide mt-1 font-medium">Policies</div>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <div className="text-[28px] font-black text-[#F4B626] leading-none">UK</div>
                <div className="text-[9px] text-gray-400 uppercase tracking-wide mt-1 font-medium">Operations</div>
              </div>
            </div>
          </div>
          {/* TOC */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Contents</div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {selectedCategories.map((cat, i) => (
                <div key={cat.id} className="flex items-center gap-2.5">
                  <span className="text-[9px] font-black font-mono text-[#F4B626] w-5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex-1 flex items-center gap-1.5">
                    <span className="text-[8px] font-mono bg-gray-100 text-gray-400 px-1 py-0.5 rounded">{cat.label}</span>
                    <span className="text-[10px] text-gray-600 font-medium truncate">{cat.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION PAGES ── */}
      {selectedCategories.map((cat) => {
        pageNum++;
        return (
          <div key={cat.id} className="doc-page doc-page-break bg-white">
            <PageHeader section={cat.title} pageNum={pageNum} settings={settings} />
            {/* Section title bar */}
            <div className="doc-section-title flex items-center gap-3 mt-3 mb-4">
              <div className="flex items-center justify-center bg-[#F4B626] rounded-sm w-8 h-8 shrink-0">
                <span className="text-[8px] font-black text-[#111111] tracking-wider font-mono">{cat.label}</span>
              </div>
              <div>
                <h2 className="text-[20px] font-black text-[#111111] leading-tight tracking-tight">{cat.title}</h2>
                <div className="text-[8px] text-gray-400 uppercase tracking-wide font-medium mt-0.5">{cat.clauses.length} polic{cat.clauses.length === 1 ? 'y' : 'ies'}</div>
              </div>
            </div>
            {/* Rich clause mosaic */}
            <div className="doc-clause-mosaic">
              {cat.clauses.map((clause) => {
                const rawForWidth = editedContent[clause.id] ?? clause.content;
                const dispForWidth = applySettings(rawForWidth, settings);
                const blocksForWidth = parseBlocks(dispForWidth);
                const hasTable = blocksForWidth.some(b => b.type === 'defs');
                const hasManyBullets = blocksForWidth.filter(b => b.type === 'bullets').flatMap(b => b.type === 'bullets' ? b.items : []).length > 5;
                const isWide = hasTable || hasManyBullets;
                return (
                  <div key={clause.id} className={`doc-clause-card doc-clause-item ${isWide ? 'doc-clause-wide' : ''}`}>
                    {/* Clause label strip */}
                    <div className="doc-clause-label">
                      <span className="text-[8px] font-black uppercase tracking-[0.15em] text-[#F4B626]">{clause.title}</span>
                      {clause.required && <span className="ml-1.5 text-[7px] font-bold uppercase tracking-wide text-white bg-[#F4B626] px-1 py-px rounded-sm">Required</span>}
                    </div>
                    <div className="doc-clause-body">
                      <InlineClause
                        clause={clause} settings={settings} editedContent={editedContent}
                        onEdit={onEdit} activeEdit={activeEdit} onSetActive={setActiveEdit}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <PageFooter settings={settings} />
          </div>
        );
      })}

      {/* ── BACK PAGE ── */}
      <div className="doc-page doc-page-break bg-white">
        <div className="doc-cover-topbar bg-[#F4B626] flex items-center justify-between px-8 py-3">
          <Image src="/guldmann-logo-black.png" alt="Guldmann" width={120} height={20} className="object-contain" unoptimized />
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#111111]">Employee Handbook</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-10">
          <Image src="/guldmann-logo-stacked.png" alt="Guldmann" width={180} height={128} className="object-contain mb-6" unoptimized />
          <div className="text-[13px] font-medium text-gray-500 mb-1 italic">Time to Care and Accessibility for All</div>
          <div className="text-[11px] text-gray-400 mt-1">www.guldmann.com/uk</div>
          <div className="mt-8 pt-6 border-t border-gray-100 max-w-xs">
            <p className="text-[10px] text-gray-400 leading-relaxed">
              This handbook is issued for informational purposes and does not form part of your contract of employment.
              For the most current version, contact {settings.hrContact || 'HR'} at {settings.hrEmail || settings.companyName || 'Guldmann UK'}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN PAGE
// ---------------------------------------------------------------------------

export default function HandbookBuilder() {
  const [selected, setSelected] = useState<Set<string>>(defaultSelected);
  const [settings, setSettings] = useState<CompanySettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem('handbook-settings') || '{}') }; } catch { return DEFAULT_SETTINGS; }
  });
  const [editedContent, setEditedContent] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {};
    try { return JSON.parse(localStorage.getItem('handbook-edits') || '{}'); } catch { return {}; }
  });
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved');
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [showSettings, setShowSettings] = useState(false);
  const [search, setSearch] = useState('');

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

  // Load from server on mount (overrides localStorage with authoritative copy)
  useEffect(() => {
    fetch('/api/handbook')
      .then(r => r.json())
      .then(data => {
        if (data.edits && Object.keys(data.edits).length > 0) {
          setEditedContent(data.edits);
          localStorage.setItem('handbook-edits', JSON.stringify(data.edits));
        }
        if (data.settings && Object.keys(data.settings).length > 0) {
          setSettings(prev => ({ ...prev, ...data.settings }));
          localStorage.setItem('handbook-settings', JSON.stringify(data.settings));
        }
        if (data.savedAt) setLastSaved(data.savedAt);
        setSaveStatus('saved');
      })
      .catch(() => setSaveStatus('saved')); // fall through to localStorage silently
  }, []);

  // Auto-save to server 2s after last change
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSave = useRef<{ edits: Record<string, string>; settings: CompanySettings } | null>(null);

  const triggerSave = useCallback((edits: Record<string, string>, s: CompanySettings) => {
    pendingSave.current = { edits, settings: s };
    setSaveStatus('unsaved');
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      if (!pendingSave.current) return;
      const payload = pendingSave.current;
      pendingSave.current = null;
      setSaveStatus('saving');
      fetch('/api/handbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(r => r.json())
        .then(data => {
          if (data.ok) { setSaveStatus('saved'); setLastSaved(data.savedAt); }
          else setSaveStatus('error');
        })
        .catch(() => setSaveStatus('error'));
    }, 2000);
  }, []);

  const handleEdit = useCallback((id: string, value: string) => {
    setEditedContent(prev => {
      const next = { ...prev, [id]: value };
      if (typeof window !== 'undefined') {
        try { localStorage.setItem('handbook-edits', JSON.stringify(next)); } catch {}
      }
      startTransition(() => triggerSave(next, settings));
      return next;
    });
  }, [settings, triggerSave]);

  const updateSetting = useCallback((key: keyof CompanySettings, value: string) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      if (typeof window !== 'undefined') {
        try { localStorage.setItem('handbook-settings', JSON.stringify(next)); } catch {}
      }
      startTransition(() => triggerSave(editedContent, next));
      return next;
    });
  }, [editedContent, triggerSave]);

  const handlePrint = () => window.print();
  const HANDBOOK_VERSION = 'v7';
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);

  const handleExportPDF = async () => {
    setPdfLoading(true);
    setPdfProgress(0);
    try {
      const { toPng } = await import('html-to-image');
      const { jsPDF } = await import('jspdf');
      const pages = Array.from(document.querySelectorAll('.doc-page')) as HTMLElement[];
      if (!pages.length) return;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const A4_W = 210;
      const A4_H = 297;
      for (let i = 0; i < pages.length; i++) {
        setPdfProgress(Math.round(((i) / pages.length) * 90));
        const el = pages[i];
        const dataUrl = await toPng(el, {
          pixelRatio: 2,
          backgroundColor: '#ffffff',
          cacheBust: true,
        });
        const imgW = el.offsetWidth;
        const imgH = el.scrollHeight;
        const mmH = (imgH / imgW) * A4_W;
        if (i > 0) pdf.addPage();
        if (mmH > A4_H) {
          // Scale down to fit A4 height
          const scale = A4_H / mmH;
          pdf.addImage(dataUrl, 'PNG', 0, 0, A4_W * scale, A4_H);
        } else {
          pdf.addImage(dataUrl, 'PNG', 0, 0, A4_W, mmH);
        }
      }
      setPdfProgress(95);
      const fname = `${(settings.companyName || 'Guldmann-UK').replace(/\s+/g, '-')}-Employee-Handbook.pdf`;
      pdf.save(fname);
      setPdfProgress(100);
      setTimeout(() => setPdfProgress(0), 1200);
    } catch (err) {
      console.error('PDF export failed', err);
      alert('PDF export failed: ' + String(err));
    } finally {
      setPdfLoading(false);
    }
  };


  const filteredCategories = search.trim()
    ? CATEGORIES.map(cat => ({ ...cat, clauses: cat.clauses.filter(cl =>
        cl.title.toLowerCase().includes(search.toLowerCase()) || cl.summary.toLowerCase().includes(search.toLowerCase())
      ) })).filter(cat => cat.clauses.length > 0)
    : CATEGORIES;

  return (
    <>
      <style>{`
        /* ---- SCREEN STYLES ---- */
        /* ── SCREEN: fixed A4 pages ── */
        .doc-page {
          width: 794px;
          min-height: 1123px;
          margin: 24px auto;
          box-shadow: 0 4px 24px rgba(0,0,0,0.10);
          border-radius: 2px;
          display: flex;
          flex-direction: column;
          overflow: visible;
          padding: 36px 42px 28px 42px;
          position: relative;
          box-sizing: border-box;
        }
        .doc-cover {
          padding: 0;
          overflow: visible;
        }
        .doc-cover-topbar {
          width: 100%;
          flex-shrink: 0;
        }
        .doc-cover-body {
          padding: 32px 40px;
        }
        .doc-header { flex-shrink: 0; }
        .doc-footer { flex-shrink: 0; }
        .doc-section-title { flex-shrink: 0; }
        /* 2-column clause mosaic */
        .doc-clause-grid,
        .doc-clause-mosaic {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          align-content: start;
          overflow: visible;
        }
        .doc-clause-wide {
          grid-column: 1 / -1;
        }
        .doc-clause-label {
          font-size: 8px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #F4B626;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .doc-clause-body {
          font-size: 11px;
          color: #444;
          line-height: 1.55;
        }
        .doc-clause-card {
          padding: 12px 14px;
          border-bottom: 1px solid #f3f4f6;
          font-size: 11px;
          line-height: 1.6;
        }
        .doc-clause-card:nth-child(odd) {
          border-right: 1px solid #f3f4f6;
        }
        .doc-clause-card h2 {
          font-size: 13px;
          font-weight: 800;
          color: #111;
          margin-bottom: 4px;
          line-height: 1.2;
        }
        .doc-clause-card h3 {
          font-size: 11.5px;
          font-weight: 700;
          color: #333;
          margin-top: 6px;
          margin-bottom: 3px;
        }
        .doc-clause-card p {
          font-size: 11px;
          color: #444;
          line-height: 1.55;
          margin-bottom: 4px;
        }
        .doc-clause-card ul, .doc-clause-card ol {
          padding-left: 12px;
          margin-bottom: 4px;
        }
        .doc-clause-card li {
          font-size: 10.5px;
          color: #555;
          line-height: 1.5;
          margin-bottom: 1px;
        }
        .doc-clause-card strong {
          color: #111;
          font-weight: 700;
        }

        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          @page { size: A4 portrait; margin: 0; }

          .no-print { display: none !important; }
          .handbook-sidebar { display: none !important; }
          .handbook-topbar { display: none !important; }

          body, html { overflow: visible !important; height: auto !important; margin: 0 !important; }
          .handbook-shell { height: auto !important; overflow: visible !important; display: block !important; }
          .handbook-body { height: auto !important; overflow: visible !important; display: block !important; }
          .handbook-preview { overflow: visible !important; height: auto !important; background: white !important; padding: 0 !important; margin: 0 !important; }

          .handbook-print-root { display: block !important; }

          .doc-page {
            width: 100% !important;
            min-height: unset !important;
            margin: 0 !important;
            padding: 14mm 16mm 10mm 16mm !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            page-break-inside: auto !important;
            break-inside: auto !important;
            overflow: visible !important;
            display: block !important;
          }
          .doc-clause-card, .doc-clause-item {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .doc-section-title, .doc-header {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          .doc-cover {
            padding: 0 !important;
          }
          .doc-cover-body {
            padding: 10mm 14mm !important;
          }
          .doc-page:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          .doc-page-break {
            page-break-before: always !important;
            break-before: page !important;
          }
          .doc-clause-item {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .doc-clause-grid,
          .doc-clause-mosaic {
            overflow: visible !important;
          }
        }
        }
      `}</style>

      <div className="handbook-shell flex flex-col h-screen bg-[#F0F0EE] overflow-hidden">
        {/* Top bar */}
        <div className="no-print shrink-0 flex items-center gap-4 px-5 py-3 bg-white border-b border-gray-100 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <Image src="/guldmann-logo-black.png" alt="Guldmann" width={140} height={24} className="object-contain" />
            <div className="h-5 w-px bg-gray-200" />
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Handbook Builder</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="text-[12px] text-gray-500">
              <span className="font-bold text-gray-800">{selected.size}</span>/{ALL_IDS.length} sections
            </div>
            <div className={`flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-md ${
              saveStatus === 'saved' ? 'text-green-600 bg-green-50' :
              saveStatus === 'saving' ? 'text-amber-600 bg-amber-50' :
              saveStatus === 'unsaved' ? 'text-gray-400 bg-gray-50' :
              'text-red-500 bg-red-50'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                saveStatus === 'saved' ? 'bg-green-500' :
                saveStatus === 'saving' ? 'bg-amber-400 animate-pulse' :
                saveStatus === 'unsaved' ? 'bg-gray-300' : 'bg-red-400'
              }`} />
              {saveStatus === 'saved' ? (lastSaved ? 'Saved' : 'Ready') :
               saveStatus === 'saving' ? 'Saving...' :
               saveStatus === 'unsaved' ? 'Unsaved' : 'Save failed'}
            </div>
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
              Print
            </button>
            <button type="button" onClick={handleExportPDF} disabled={pdfLoading}
              className="relative overflow-hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4B626] text-[12px] font-semibold text-black hover:bg-[#e0a820] transition-colors disabled:opacity-80 min-w-[130px]">
              {pdfLoading && (
                <span
                  className="absolute left-0 top-0 bottom-0 bg-black/15 transition-all duration-300"
                  style={{ width: `${pdfProgress}%` }}
                />
              )}
              <span className="relative flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                {pdfLoading ? `${pdfProgress}%` : 'Download PDF'}
              </span>
            </button>
            <div className="no-print ml-1 px-2 py-1 rounded font-mono text-[10px] font-bold text-gray-400 bg-gray-100 border border-gray-200 select-none" title="Deployed version">{HANDBOOK_VERSION}</div>
          </div>
        </div>

        {/* Body */}
        <div className="handbook-body flex-1 flex overflow-hidden relative">
          <AnimatePresence>
            {showSettings && <SettingsPanel settings={settings} onChange={updateSetting} onClose={() => setShowSettings(false)} />}
          </AnimatePresence>

          {/* Left panel */}
          <div className={`handbook-sidebar no-print w-[320px] shrink-0 flex flex-col border-r border-gray-200 bg-white overflow-hidden transition-[margin] ${showSettings ? 'ml-[360px]' : ''}`}>
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

          {/* Right - A4 page preview */}
          <div className="handbook-preview flex-1 overflow-y-auto bg-[#E8E8E6] px-8 py-4 pb-12">
            <DocumentPreview selected={selected} settings={settings} editedContent={editedContent} onEdit={handleEdit} />
          </div>
        </div>
      </div>
    </>
  );
}
