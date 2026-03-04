'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, ChevronRight, Download, FileText, Printer, Search, X } from 'lucide-react';

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------

export interface Clause {
  id: string;
  title: string;
  summary: string;
  required: boolean;
  content: string;
}

export interface Category {
  id: string;
  title: string;
  icon: string;
  clauses: Clause[];
}

const CATEGORIES: Category[] = [
  {
    id: 'welcome',
    title: 'Welcome & Introduction',
    icon: '👋',
    clauses: [
      {
        id: 'welcome-message',
        title: 'Welcome Message',
        summary: 'Opening letter from Guldmann UK leadership',
        required: false,
        content: `## Welcome to Guldmann UK

Welcome to Guldmann.

You have joined a company with a clear purpose: creating Time to Care and Accessibility for All. Every product we make, every service we deliver, every conversation we have with a customer - it all comes back to that. The people who use our equipment depend on it to live their lives with dignity. That is not a small thing.

This handbook gives you the information you need to know how we work, what we expect, and what you can expect from us. It is not a rulebook. We do not believe in having a rule for everything. What we believe in is good judgement, shared values, and people taking responsibility for doing the right thing.

If something is not covered here - use your common sense and ask. We would rather you ask than guess wrong.`
      },
      {
        id: 'about-guldmann',
        title: 'About Guldmann',
        summary: 'Company background, mission, UK operations',
        required: false,
        content: `## About Guldmann

Guldmann was founded in Denmark and has grown into an international company specialising in patient handling and ceiling hoist systems. Our work genuinely matters - the equipment we supply enables care staff to do their jobs safely, and gives patients the ability to move independently.

Guldmann UK operates across the country, with our team spanning Technical (installation, servicing, IT), Sales, Operations, Contracts, Marketing, and Management. We also represent the Stepless brand in the UK market.

We are a small team. That means everyone is visible, everyone's contribution counts, and how we treat each other every day matters more than at a larger company.`
      },
      {
        id: 'values-fact',
        title: 'Our Values: FACT',
        summary: 'Flexibility, Ambition, Competence, Trustworthiness',
        required: false,
        content: `## Our Values: FACT

Everything at Guldmann comes back to four values. We call them FACT.

**Flexibility** - What is right today may be wrong tomorrow. We hold our views openly, adapt when we need to, and do not cling to "the way we have always done it" when a better way exists.

**Ambition** - We set high goals - and we mean it. Not aspirational posters on the wall, but real targets that stretch us. We hold ourselves and each other to them.

**Competence** - Our customers trust us because we know what we are talking about. We take learning seriously. We share what we know. The strength of every individual is part of our collective strength.

**Trustworthiness** - Trust is earned, not assumed. We earn it by saying what we will do and doing it - with customers, colleagues, and the wider world.`
      },
      {
        id: 'code-of-conduct',
        title: 'Code of Conduct',
        summary: 'Human Rights, Labour Rights, Environment, Anti-Corruption',
        required: true,
        content: `## Code of Conduct

Guldmann operates to a global Code of Conduct built on four principles: Human Rights, Labour Rights, Environment, and Anti-Corruption.

In practical terms this means: treat everyone fairly and with respect, pay and reward people properly, consider the environmental impact of what we do, and never accept or offer anything that could be considered a bribe or improper benefit.

The full Code of Conduct is available on the Guldmann intranet. It applies to how you work, how you represent us to the outside world, and how you make decisions when things get complicated.`
      }
    ]
  },
  {
    id: 'employment',
    title: 'Your Employment',
    icon: '📋',
    clauses: [
      {
        id: 'contracts',
        title: 'Employment Contracts',
        summary: 'Written particulars, contract changes',
        required: true,
        content: `## Employment Contracts

Every employee receives a written statement of employment particulars on or before their first day. This confirms your job title, start date, pay, working hours, holiday entitlement, and notice period.

If anything in your contract needs to change - your hours, your role, your location - this will be agreed with you and confirmed in writing. We will not change your contract without your knowledge and agreement.`
      },
      {
        id: 'probation',
        title: 'Probationary Period',
        summary: '6-month probation with 3-month review',
        required: false,
        content: `## Probationary Period

All new employees serve a six-month probationary period. This is not a test designed for you to fail - it is a structured period to make sure the role is right for you and you are right for the role.

**At three months:** Your manager will have an informal review. This is a two-way discussion - we want to hear how you are finding things as much as we want to share feedback.

**At six months:** A formal probation review. If everything is on track, your employment is confirmed. If there are concerns, we will have discussed them well before this point - there should be no surprises.

The notice period during probation is one week (or the statutory minimum if longer).`
      },
      {
        id: 'working-hours',
        title: 'Working Hours & Flexibility',
        summary: 'Standard hours, overtime, flexible working',
        required: false,
        content: `## Working Hours and Flexibility

Standard working hours for office and administration staff are Monday to Friday, with an hour for lunch. Your specific hours are confirmed in your contract.

For Technical staff (installers and service technicians), hours vary by job schedule.

**Flexibility:** We trust our people. If you occasionally need to adjust your schedule - talk to your manager. We are reasonable about life happening, and we expect our team to be equally responsible about ensuring their work is covered.

For sustained changes to your working pattern, submit a flexible working request to HR.`
      },
      {
        id: 'remote-working',
        title: 'Remote & Hybrid Working',
        summary: 'Working from home policy and rules',
        required: false,
        content: `## Remote and Hybrid Working

You may work from home where your role allows and your manager agrees. Remote working suits tasks that need focus; it does not suit collaboration, client-facing work, or anything that requires you on site.

**Rules for remote working:**
- Inform your team and manager in advance
- Be available during your normal working hours
- Company data security rules apply regardless of where you work
- Any regular hybrid pattern needs manager approval and formal agreement

Remote work provides flexibility, but must be balanced to maintain collaboration and team culture. We value the daily connection with colleagues - professionally and socially.`
      },
      {
        id: 'appearance',
        title: 'Professional Appearance',
        summary: 'Dress code, branded workwear, PPE requirements',
        required: false,
        content: `## Professional Appearance

How we present ourselves reflects on Guldmann. We expect everyone to dress appropriately for their role and any customer or external interactions.

**Technical staff:** Company-issued workwear must be worn on all customer sites and during installation or service work. Clothing must be clean and professional. Safety footwear is required in all applicable environments.

**Office and sales staff:** Smart business casual is the standard. For customer visits, events, or trade shows, branded items may be issued.

**Construction sites:** Safety jacket with Guldmann logo required. Site-specific PPE will be confirmed in advance.`
      }
    ]
  },
  {
    id: 'pay-benefits',
    title: 'Pay & Benefits',
    icon: '💰',
    clauses: [
      {
        id: 'pay-dates',
        title: 'Pay & Payslips',
        summary: 'Monthly pay, payslip details, error reporting',
        required: true,
        content: `## Pay and Payslips

You are paid monthly, on the last working day of each month, directly into your nominated bank account. Keep your bank details up to date with HR.

Your payslip shows gross pay, all deductions (income tax, National Insurance, pension), and net pay. Payslips are issued electronically.

If you believe your pay is incorrect, contact HR immediately. We will investigate and correct any error as a priority.`
      },
      {
        id: 'expenses',
        title: 'Expenses Policy',
        summary: 'HMRC mileage rates, subsistence, receipts, approval',
        required: false,
        content: `## Expenses

Guldmann will reimburse all reasonable and legitimate business expenses. "Reasonable" means what you would spend if you were paying yourself.

**Mileage (own vehicle):**
- First 10,000 business miles/year: 45p per mile
- Over 10,000 miles: 25p per mile (HMRC approved rates - keep a mileage log)
- Daily commute to your normal workplace is not claimable

**Subsistence while travelling:**
- Breakfast (away before 6:00am): up to £10
- Lunch: up to £15
- Evening meal (away past 8:00pm): up to £25

**Rules:** Always keep receipts. Submit claims within 30 days. All expenses must be approved by your manager. A card statement is not a receipt.`
      },
      {
        id: 'company-card',
        title: 'Company Credit Card',
        summary: 'Business use only, approval thresholds, reporting',
        required: false,
        content: `## Company Credit Card

Some roles include a company credit card. If yours does, the card is for business purchases only. Personal use is not permitted and will be treated as a disciplinary matter.

- The card belongs to Guldmann - it is not yours
- Manager approval required for any single purchase over £200
- Submit receipts and a brief purpose note for every transaction promptly
- Report a lost or stolen card to HR and accounts immediately

The principle throughout: spend Guldmann's money the way you would spend your own.`
      },
      {
        id: 'company-car',
        title: 'Company Car Policy',
        summary: 'Eligibility, standards, fines, private use, BIK',
        required: false,
        content: `## Company Car Policy

Company cars are available to certain roles where the business need is clear. Eligibility is confirmed in your contract.

Electric vehicles are preferred in line with Guldmann's environmental commitments.

**Your responsibilities:**
- Keep the car clean and presentable inside and out
- Ensure it is serviced on schedule
- Report any damage promptly
- Drive responsibly at all times

**Fines:** Parking and speeding penalties are your responsibility. If Guldmann receives a notice, you will be asked to pay or have it deducted from salary (always confirmed first).

**Private use:** Any agreed private mileage creates a taxable Benefit in Kind. Keep a log of business vs private mileage.`
      },
      {
        id: 'pension',
        title: 'Pension',
        summary: 'Auto-enrolment, contributions, scheme details',
        required: true,
        content: `## Pension

Guldmann operates a workplace pension scheme in line with UK auto-enrolment legislation. You will be enrolled automatically when you join, unless you choose to opt out.

Contribution levels (employee and employer) are set out in your scheme documentation, provided at the start of your employment.

If you have questions about the pension scheme or want to increase your contributions, contact HR.`
      },
      {
        id: 'milestones',
        title: 'Milestone Recognition',
        summary: 'Anniversary gifts, apprenticeship completion, retirement',
        required: false,
        content: `## Milestone Recognition

People deserve to be celebrated. Guldmann UK marks the following:

- **10-year anniversary:** Team celebration and a gift from the company
- **25-year anniversary:** Department celebration, a gift, and one month's salary
- **Completion of apprenticeship or formal qualification:** Team celebration and a gift
- **Retirement:** A farewell gathering for close colleagues if desired, and a gift

Milestone birthdays are personal and acknowledged only if you want them to be.

Gifts are never cash or gift cards (except the salary component at 25 years).`
      }
    ]
  },
  {
    id: 'time-off',
    title: 'Time Off',
    icon: '🌴',
    clauses: [
      {
        id: 'holiday',
        title: 'Holiday Entitlement',
        summary: '28 days (inc. bank holidays), booking, carry-over',
        required: true,
        content: `## Holiday Entitlement

You are entitled to 28 days of paid holiday per year (inclusive of the eight UK bank holidays). This is 5.6 weeks for a full-time employee. Part-time entitlement is calculated pro-rata.

**Booking:** Request holiday through your manager or HR system. Summer preferences should be submitted by end of March. Christmas plans confirmed by end of October.

**Carry-over:** Up to 5 days may be carried over by agreement. Routine carry-over is not the norm - use your entitlement. If you are unable to take holiday due to illness or family leave, different rules apply - speak to HR.

**On leaving:** Accrued but untaken holiday is paid in your final salary. Holiday taken in excess of accrual will be deducted.`
      },
      {
        id: 'sick-leave',
        title: 'Sick Leave & SSP',
        summary: 'Reporting, SSP £118.75/week, fit notes, return interviews',
        required: true,
        content: `## Sick Leave and Statutory Sick Pay

**Reporting:** Contact your manager directly before your normal start time on day one of any absence. Keep your manager updated if illness continues.

**Fit notes:** For absences of 7 calendar days or less, you self-certify. For absences longer than 7 days, a fit note from your GP is required.

**Statutory Sick Pay (SSP):** The current rate is £118.75 per week (2024/25, reviewed annually). SSP does not apply for the first 3 days of absence (waiting days) - it begins from day 4. SSP can be paid for up to 28 weeks. To qualify, you must earn at least £123/week (Lower Earnings Limit).

**Return-to-work:** After every absence, your manager will have a brief return-to-work conversation. This is a supportive check-in, not a disciplinary process.

**Long-term sickness:** If absent for more than 4 weeks, Guldmann will maintain contact and may arrange an occupational health assessment.`
      },
      {
        id: 'bereavement',
        title: 'Bereavement & Compassionate Leave',
        summary: 'Paid leave for immediate and extended family loss',
        required: false,
        content: `## Bereavement and Compassionate Leave

Losing someone you love is one of the hardest things that can happen. You should not have to worry about work when it does.

**Immediate family** (spouse, partner, parent, child, sibling): minimum 5 days paid compassionate leave. Your manager has discretion to grant more.

**Extended family and close friends** (grandparent, in-law, close friend): minimum 2 days paid. Again, flexibility applies.

**Pregnancy loss:** We take a compassionate and flexible approach regardless of gestation. Speak to HR.

We will never make you prove your grief or justify your need for time. Talk to us and we will work it out together.`
      },
      {
        id: 'medical-appointments',
        title: 'Medical & Dental Appointments',
        summary: 'Routine vs urgent, children\'s appointments',
        required: false,
        content: `## Medical and Dental Appointments

Where possible, book routine appointments outside working hours. Where that is not possible, give your manager as much notice as you can and minimise disruption.

For urgent or referred medical appointments (specialist referrals, physiotherapy, etc.), we will support attendance during working hours.

**Children's appointments:** If your child needs to attend a medical appointment and cannot go unaccompanied, you may take the time needed. Discuss with your manager in advance where possible.`
      },
      {
        id: 'dependants-leave',
        title: "Child's First Sick Day & Dependants Leave",
        summary: 'Emergency time off for dependent care',
        required: true,
        content: `## Emergency Leave for Dependants

You have the right to take emergency time off to deal with unexpected situations involving a dependent - a sick child, a dependent who needs emergency care, or an unexpected breakdown of care arrangements.

This right is typically used for the first day to make arrangements. Guldmann's approach is pragmatic: we will not penalise you for occasionally needing to deal with a family emergency. We do ask that you notify your manager as early as possible.

If this becomes a pattern, your manager will have a supportive conversation to find a workable solution together.`
      },
      {
        id: 'jury-service',
        title: 'Jury Service',
        summary: 'Paid leave, court allowance offsetting',
        required: false,
        content: `## Jury Service

If you are called for jury service, notify HR and your manager as soon as you receive the summons. Guldmann will top up your income to your normal salary level during jury service. You will be expected to claim the daily court allowance, which will be offset against your pay so you are not worse off.

If service causes a genuine operational problem, your manager may ask if you are comfortable applying for a deferral - but this is your choice, not a requirement.`
      }
    ]
  },
  {
    id: 'family-leave',
    title: 'Family Leave',
    icon: '👨‍👩‍👧',
    clauses: [
      {
        id: 'maternity',
        title: 'Maternity Leave & Pay',
        summary: 'Up to 52 weeks, SMP rates, KIT days, return to work',
        required: true,
        content: `## Maternity Leave and Pay

**Leave:** All pregnant employees are entitled to up to 52 weeks of maternity leave (26 weeks Ordinary + 26 weeks Additional), regardless of length of service.

**Notification:** Notify Guldmann by the end of the 15th week before your due date. Provide your MATB1 certificate.

**Statutory Maternity Pay (SMP):** To qualify, you must have been employed for at least 26 weeks by the 15th week before the due date and earn at least £123/week.

- First 6 weeks: 90% of average weekly earnings
- Remaining 33 weeks: £187.18/week or 90% of AWE, whichever is lower (2024/25 rate)

**Keeping in Touch (KIT) days:** Up to 10 voluntary KIT days can be worked during maternity leave without affecting SMP. Paid at your normal day rate.

**Return to work:** You have the right to return to the same job after Ordinary Maternity Leave. After Additional Maternity Leave, to the same or a similar role on no less favourable terms.`
      },
      {
        id: 'paternity',
        title: 'Paternity Leave & Pay',
        summary: '1-2 weeks, SPP £187.18/week, notification rules',
        required: true,
        content: `## Paternity Leave and Pay

**Leave:** Partners are entitled to 1 or 2 consecutive weeks of paternity leave, taken within 56 days of the birth. Qualifying condition: 26 weeks employment by the 15th week before the due date.

**Notification:** Give at least 15 weeks notice of your intended leave dates.

**Statutory Paternity Pay (SPP):** £187.18/week or 90% of average weekly earnings, whichever is lower (2024/25 rate). To qualify, you must earn at least £123/week.`
      },
      {
        id: 'shared-parental',
        title: 'Shared Parental Leave',
        summary: 'Up to 50 weeks shared, 37 weeks pay',
        required: true,
        content: `## Shared Parental Leave

Shared Parental Leave (ShPL) allows eligible parents to share up to 50 weeks of leave and 37 weeks of pay in the first year after birth or adoption.

Leave can be taken at the same time or alternately, in one block or separately. Both parents must meet qualifying criteria.

Shared Parental Pay is £187.18/week or 90% of AWE, whichever is lower (2024/25).

This is a complex entitlement. Speak to HR as early as possible if you are interested - ideally during the pregnancy - so we can work through the options together.`
      },
      {
        id: 'adoption',
        title: 'Adoption Leave',
        summary: 'Same entitlements as maternity, SAP rates',
        required: true,
        content: `## Adoption Leave

If you are adopting a child, you have the same entitlements as a birth parent: up to 52 weeks adoption leave and 39 weeks Statutory Adoption Pay (90% for the first 6 weeks, then £187.18/week). The secondary adopter is entitled to paternity leave.

You must have been employed for at least 26 weeks at the date you are matched with a child.`
      },
      {
        id: 'parental-leave',
        title: 'Parental Leave (Unpaid)',
        summary: '18 weeks unpaid per child, max 4 weeks/year',
        required: true,
        content: `## Parental Leave

Employees with at least one year's service are entitled to 18 weeks of unpaid parental leave per child, up to the child's 18th birthday. The maximum in any one year is 4 weeks per child.

Parental leave must be agreed with your manager at least 21 days in advance. Leave is taken in whole weeks unless your child is disabled.

Your terms and conditions of employment (other than pay) continue during parental leave.`
      }
    ]
  },
  {
    id: 'performance',
    title: 'Performance & Development',
    icon: '📈',
    clauses: [
      {
        id: 'performance-standards',
        title: 'Expected Standards',
        summary: 'What Guldmann expects from everyone',
        required: false,
        content: `## Expected Standards

Guldmann expects people to do their jobs well. We hire good people, give them clear roles, and trust them to perform. Micromanagement is not our style.

What we expect from everyone:
- Turn up on time, prepared, and ready to contribute
- Deliver what you commit to
- Be honest when something is going wrong - do not hide problems until they become crises
- Treat colleagues, customers, and partners with respect
- Represent Guldmann well in everything you do`
      },
      {
        id: 'appraisals',
        title: 'Annual Appraisals',
        summary: 'Yearly review covering performance, development, objectives',
        required: false,
        content: `## Annual Appraisals

Every employee has an annual appraisal with their manager. This is a genuine conversation - not a box-ticking exercise.

The appraisal covers: performance against objectives, what has gone well and what could be better, objectives for the coming year, and development aspirations.

We also encourage mid-year check-ins. You do not need to wait for the annual review to have a conversation about how things are going.`
      },
      {
        id: 'learning',
        title: 'Learning & Development',
        summary: 'Guldmann Academy, external training, study leave',
        required: false,
        content: `## Learning and Development

Guldmann invests in its people. When you grow, we grow.

**Guldmann Academy:** Our internal learning platform provides product knowledge, technical training, and professional development. You will be enrolled when you join.

**External training:** Where relevant to your role, Guldmann will support and fund external training. Discuss development opportunities with your manager.

**Mandatory training:** IT security, compliance, and safety training is mandatory. Complete it when assigned.

**Study leave:** If undertaking a company-supported qualification, you are entitled to paid time off for exams. Notify your manager as soon as exam dates are confirmed.`
      }
    ]
  },
  {
    id: 'conduct',
    title: 'Conduct & Discipline',
    icon: '⚖️',
    clauses: [
      {
        id: 'standards-behaviour',
        title: 'Standards of Behaviour',
        summary: 'Professionalism, honesty, respect',
        required: false,
        content: `## Standards of Behaviour

We expect everyone at Guldmann to behave professionally, honestly, and with respect for others. This applies in the office, on customer sites, when travelling, and in any context where you represent the company.

Treat all colleagues, customers, and partners fairly and without discrimination. Be honest in your communications and your work. Respect confidential information. Do not behave in a way that could bring Guldmann into disrepute.

Most of it is common sense. If you are unsure whether something is appropriate, ask before you do it.`
      },
      {
        id: 'disciplinary',
        title: 'Disciplinary Procedure',
        summary: 'Informal to formal stages, rights at each step, appeals',
        required: true,
        content: `## Disciplinary Procedure

The disciplinary procedure exists to deal with conduct or performance issues in a fair, consistent, and proportionate way. It follows the Acas Code of Practice.

**Informal:** For minor issues, your manager will raise the concern directly. Most issues are resolved here.

**First Written Warning:** A formal meeting where you have the right to be accompanied. Warning remains on file for 12 months.

**Final Written Warning:** For continued or more serious issues. Remains on file for 12 months.

**Dismissal:** For repeated or serious breaches. For gross misconduct, dismissal without notice may be immediate.

**Your rights at every stage:** To be told the allegation in advance, to see evidence, to be accompanied by a colleague or union representative, to respond, and to appeal any decision.`
      },
      {
        id: 'gross-misconduct',
        title: 'Gross Misconduct',
        summary: 'Examples: theft, violence, harassment, fraud, serious safety breaches',
        required: true,
        content: `## Gross Misconduct

Some actions are serious enough to result in immediate dismissal without notice. These include (but are not limited to):

- Theft, fraud, or dishonesty
- Physical violence or threats of violence
- Harassment, bullying, or discrimination
- Serious breach of health and safety rules
- Being under the influence of alcohol or drugs at work
- Serious misuse of company IT systems or data
- Unauthorised disclosure of confidential information

Where gross misconduct is suspected, we may suspend on full pay pending investigation. Suspension is not a punishment - it is a neutral act while we investigate.`
      },
      {
        id: 'grievance',
        title: 'Grievance Procedure',
        summary: 'Informal and formal routes, right to be accompanied, appeal',
        required: true,
        content: `## Grievance Procedure

If you have a concern about your treatment, working conditions, or a colleague's behaviour, you have the right to raise a formal grievance.

**Informal first:** Raise concerns with your manager directly where possible. Most issues can be resolved through honest conversation.

**Formal grievance:** Submit a written grievance to HR. We will acknowledge it within 3 working days and arrange a meeting.

You have the right to be accompanied at any grievance meeting. You also have the right to appeal any outcome.

We will not treat any employee less favourably for raising a genuine grievance.`
      },
      {
        id: 'whistleblowing',
        title: 'Whistleblowing',
        summary: 'Protected disclosures, how to raise concerns',
        required: true,
        content: `## Whistleblowing

If you become aware of serious wrongdoing - something that affects health and safety, breaks the law, involves fraud, or is seriously wrong - you have the right to speak up.

Raise this with your manager, HR, or a senior leader. If not comfortable internally, you can report to the relevant regulator externally.

Guldmann will not penalise any employee for making a whistleblowing disclosure in good faith. This is a protected right under the Public Interest Disclosure Act.`
      }
    ]
  },
  {
    id: 'health-safety',
    title: 'Health, Safety & Wellbeing',
    icon: '🛡️',
    clauses: [
      {
        id: 'hs-commitment',
        title: 'Health & Safety Commitment',
        summary: 'Legal duties, employer and employee responsibilities',
        required: true,
        content: `## Health and Safety Commitment

Guldmann is committed to providing a safe and healthy working environment for every employee. We comply with all requirements under the Health and Safety at Work Act 1974 and associated regulations.

**Your responsibilities:**
- Follow safe working practices and procedures
- Use all equipment and PPE correctly
- Report hazards, accidents, and near misses to your manager immediately
- Do not take risks that put yourself or others in danger
- Complete all mandatory health and safety training

If you are asked to carry out a task you believe is unsafe - stop and speak to your manager. You will not be penalised for raising a safety concern.`
      },
      {
        id: 'accident-reporting',
        title: 'Accident Reporting & RIDDOR',
        summary: 'Incident recording, RIDDOR reportable injuries',
        required: true,
        content: `## Accident Reporting

All accidents, injuries, and near misses must be recorded in the accident book. Serious incidents are reported to the HSE under RIDDOR where legally required.

RIDDOR-reportable incidents include deaths, specified injuries (broken bones, amputations, loss of sight), over-7-day incapacitations, and dangerous occurrences.

Report all incidents to your manager immediately. Do not delay - timely reporting is a legal requirement.`
      },
      {
        id: 'ppe-workwear',
        title: 'Workwear & PPE',
        summary: 'Installer and technician requirements, screen glasses',
        required: true,
        content: `## Workwear and PPE

**Installers and Service Technicians:** Company-issued workwear must be worn at all times on customer sites. Safety footwear is required in all applicable environments. Keep workwear clean and professional.

**Screen and Safety Glasses:** If your role involves significant screen use, you are entitled to a company-funded eye test. If prescription safety glasses are required for your work, Guldmann will contribute to the cost. Speak to HR for the current process.`
      },
      {
        id: 'mental-health',
        title: 'Mental Health & Wellbeing',
        summary: 'Open culture, EAP, reasonable adjustments',
        required: false,
        content: `## Mental Health and Wellbeing

We take mental health seriously. We are a small team, and we notice when someone is struggling. We want to create an environment where people feel they can speak up.

If you are going through a difficult time, please talk to your manager or HR. We will treat what you share in confidence and work with you on a practical response.

Long-term mental health conditions are a disability under the Equality Act 2010. We have a duty to make reasonable adjustments where these are needed.

We do not expect people to be fine all the time. We do expect people to ask for help when they need it.`
      }
    ]
  },
  {
    id: 'data-it',
    title: 'Data, IT & Security',
    icon: '🔐',
    clauses: [
      {
        id: 'it-use',
        title: 'IT Systems & Acceptable Use',
        summary: 'Business use, prohibited actions, device security',
        required: true,
        content: `## IT Systems and Acceptable Use

Guldmann provides IT equipment and systems for business purposes. Reasonable personal use is tolerated; the systems are not for personal projects, entertainment, or anything that could compromise security.

**You must not:**
- Install software on company devices without authorisation
- Share your login credentials
- Leave devices unlocked and unattended
- Connect to unsecured public Wi-Fi without a VPN

**You must:**
- Lock your device when not in use
- Report any suspected security incident to IT immediately
- Complete all mandatory IT security training`
      },
      {
        id: 'data-protection',
        title: 'Data Protection & GDPR',
        summary: 'UK GDPR, handling personal data, breach reporting',
        required: true,
        content: `## Data Protection and GDPR

Guldmann handles personal data about employees, customers, and contacts responsibly and in compliance with UK GDPR and the Data Protection Act 2018.

**What this means for you:**
- Only access personal data you need for your role
- Do not share personal data with anyone who does not need it
- Secure personal data - do not leave it exposed
- Report any data breach or suspected breach to HR or IT immediately

Guldmann's full Data Protection Policy is on the intranet.`
      },
      {
        id: 'confidentiality',
        title: 'Confidentiality',
        summary: 'During and after employment obligations',
        required: true,
        content: `## Confidentiality

During your employment you will have access to confidential information: commercially sensitive data, customer details, pricing, business strategy, personnel information.

Do not share this outside the company without authorisation. Do not discuss it in public places.

Your obligation to keep confidential information confidential continues after you leave Guldmann.`
      },
      {
        id: 'social-media',
        title: 'Social Media',
        summary: 'Personal use guidelines, what not to share',
        required: false,
        content: `## Social Media

We are not going to tell you what to do on your personal social media. But we ask for common sense.

**Do not** share confidential company information, make defamatory or discriminatory comments about Guldmann, colleagues, or customers, or claim to speak on behalf of Guldmann without authorisation.

**Do** remember that you represent Guldmann in everything you put online - and feel free to share genuine enthusiasm for our work and mission.`
      }
    ]
  },
  {
    id: 'leaving',
    title: 'Leaving Guldmann',
    icon: '🚪',
    clauses: [
      {
        id: 'resignation',
        title: 'Resignation & Notice',
        summary: 'Written resignation, statutory notice periods, garden leave',
        required: true,
        content: `## Resignation and Notice

Submit your resignation in writing to your manager. Your notice period is in your contract.

**Statutory minimums:** Less than 1 month - no statutory notice. 1 month to 2 years - 1 week. 2+ years - 1 week per complete year of service, up to 12 weeks maximum.

During your notice period, you are expected to work normally and assist with handover. We may, at our discretion, place you on garden leave - during which you receive full pay but do not attend work.`
      },
      {
        id: 'redundancy',
        title: 'Redundancy',
        summary: 'Fair process, statutory pay, £669/week cap (2024/25)',
        required: true,
        content: `## Redundancy

Redundancy occurs when a role no longer exists - it is about the job, not the person. If redundancy becomes necessary, Guldmann will follow a fair process: identifying affected roles, consulting, exploring alternatives, applying fair selection, providing statutory notice, and paying statutory redundancy pay where applicable.

**Statutory Redundancy Pay** (qualifying service: 2+ years):
- Under age 22: 0.5 week's pay per year of service
- Ages 22-40: 1 week's pay per year of service
- Age 41+: 1.5 week's pay per year of service

Weekly pay is capped at £669 (2024/25). Maximum 20 years of service count. Calculate at gov.uk/calculate-your-redundancy-pay.`
      },
      {
        id: 'exit',
        title: 'Exit Interview & Offboarding',
        summary: 'Voluntary exit interview, return of property, references',
        required: false,
        content: `## Exit Interview and Offboarding

Before you leave, we will invite you to an exit interview with HR. This is voluntary, but we genuinely value the feedback and use it to improve.

**Return of property:** Return all company property on or before your last day - laptop, phone, access cards, car keys, workwear, and anything else belonging to Guldmann. All system access is revoked on your last day.

**References:** Guldmann will provide a reference confirming your job title and dates of employment. Additional information may be provided with your consent. All reference requests go through HR.`
      }
    ]
  }
];

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

const ALL_IDS = CATEGORIES.flatMap(c => c.clauses.map(cl => cl.id));
const REQUIRED_IDS = new Set(
  CATEGORIES.flatMap(c => c.clauses.filter(cl => cl.required).map(cl => cl.id))
);

function defaultSelected(): Set<string> {
  return new Set(ALL_IDS);
}

// ---------------------------------------------------------------------------
// COMPONENTS
// ---------------------------------------------------------------------------

function ClauseCheckbox({
  clause,
  selected,
  onToggle,
}: {
  clause: Clause;
  selected: boolean;
  onToggle: () => void;
}) {
  const required = REQUIRED_IDS.has(clause.id);
  return (
    <button
      type="button"
      onClick={() => !required && onToggle()}
      className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all group ${
        selected ? 'bg-[#F4B626]/8 hover:bg-[#F4B626]/12' : 'hover:bg-gray-50'
      } ${required ? 'cursor-default' : 'cursor-pointer'}`}
    >
      <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
        selected ? 'bg-[#F4B626] border-[#F4B626]' : 'border-gray-300'
      }`}>
        {selected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-[13px] font-medium leading-tight ${selected ? 'text-gray-900' : 'text-gray-500'}`}>
            {clause.title}
          </span>
          {required && (
            <span className="shrink-0 text-[9px] font-bold uppercase tracking-wide text-[#F4B626] bg-[#F4B626]/10 px-1.5 py-0.5 rounded">
              Required
            </span>
          )}
        </div>
        <span className="block text-[11px] text-gray-400 mt-0.5 leading-snug">{clause.summary}</span>
      </div>
    </button>
  );
}

function CategoryAccordion({
  category,
  selected,
  onToggleClause,
  onToggleAll,
}: {
  category: Category;
  selected: Set<string>;
  onToggleClause: (id: string) => void;
  onToggleAll: (catId: string, on: boolean) => void;
}) {
  const [open, setOpen] = useState(true);
  const selectedCount = category.clauses.filter(c => selected.has(c.id)).length;
  const allSelected = selectedCount === category.clauses.length;

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <span className="text-base">{category.icon}</span>
        <span className="flex-1 text-[13px] font-semibold text-gray-800">{category.title}</span>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
          selectedCount === category.clauses.length
            ? 'bg-[#F4B626]/15 text-[#c9961e]'
            : selectedCount > 0
            ? 'bg-blue-50 text-blue-600'
            : 'bg-gray-100 text-gray-400'
        }`}>
          {selectedCount}/{category.clauses.length}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-2 pt-1 bg-white border-t border-gray-50 space-y-0.5">
              <button
                type="button"
                onClick={() => onToggleAll(category.id, !allSelected)}
                className="w-full text-left text-[11px] font-medium text-[#F4B626] hover:text-[#c9961e] px-3 py-1.5 transition-colors"
              >
                {allSelected ? 'Deselect all' : 'Select all'}
              </button>
              {category.clauses.map(clause => (
                <ClauseCheckbox
                  key={clause.id}
                  clause={clause}
                  selected={selected.has(clause.id)}
                  onToggle={() => onToggleClause(clause.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DocumentPreview({ selected }: { selected: Set<string> }) {
  const selectedClauses = CATEGORIES.flatMap(cat =>
    cat.clauses
      .filter(cl => selected.has(cl.id))
      .map(cl => ({ ...cl, categoryTitle: cat.title, categoryIcon: cat.icon }))
  );

  const wordCount = selectedClauses.reduce((acc, cl) => acc + cl.content.split(' ').length, 0);

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-[15px] font-bold text-[#111] mt-5 mb-2 first:mt-0 border-b border-gray-100 pb-1.5">{line.slice(3)}</h2>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="text-[12px] font-semibold text-gray-800 mt-2">{line.slice(2, -2)}</p>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="text-[12px] text-gray-700 ml-3 leading-relaxed list-disc">{
          line.slice(2).replace(/\*\*(.*?)\*\*/g, '$1')
        }</li>;
      }
      if (line === '') return <div key={i} className="h-1" />;
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={i} className="text-[12px] text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  if (selectedClauses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-12">
        <FileText className="w-12 h-12 text-gray-200 mb-4" />
        <p className="text-sm text-gray-400">Select sections from the left to build your handbook</p>
      </div>
    );
  }

  let currentCategory = '';
  return (
    <div id="handbook-document" className="p-8 max-w-[680px] mx-auto">
      <div className="text-center mb-10 pb-8 border-b-2 border-[#F4B626]">
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#F4B626] mb-2">Guldmann UK</div>
        <h1 className="text-[28px] font-bold text-[#111] leading-tight">Employee Handbook</h1>
        <p className="text-[13px] text-gray-400 mt-2">Version 1.0 - 2025</p>
        <div className="mt-4 text-[11px] text-gray-400">
          {selectedClauses.length} sections - approx. {wordCount.toLocaleString()} words
        </div>
      </div>

      {selectedClauses.map((clause) => {
        const showCategoryHeader = clause.categoryTitle !== currentCategory;
        if (showCategoryHeader) currentCategory = clause.categoryTitle;
        return (
          <div key={clause.id}>
            {showCategoryHeader && (
              <div className="mt-8 mb-4 flex items-center gap-2">
                <span className="text-lg">{clause.categoryIcon}</span>
                <h2 className="text-[17px] font-bold text-[#111]">{clause.categoryTitle}</h2>
                <div className="flex-1 h-px bg-gray-200 ml-2" />
              </div>
            )}
            <div className="mb-4">{renderContent(clause.content)}</div>
          </div>
        );
      })}

      <div className="mt-12 pt-6 border-t border-gray-200 text-[10px] text-gray-400 text-center">
        <p>Guldmann UK Employee Handbook - Confidential</p>
        <p className="mt-1">For questions about anything in this handbook, contact HR.</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN PAGE
// ---------------------------------------------------------------------------

export default function HandbookBuilder() {
  const [selected, setSelected] = useState<Set<string>>(defaultSelected);
  const [search, setSearch] = useState('');
  const [exporting, setExporting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const toggleClause = useCallback((id: string) => {
    if (REQUIRED_IDS.has(id)) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback((catId: string, on: boolean) => {
    const cat = CATEGORIES.find(c => c.id === catId);
    if (!cat) return;
    setSelected(prev => {
      const next = new Set(prev);
      cat.clauses.forEach(cl => {
        if (REQUIRED_IDS.has(cl.id)) return;
        if (on) next.add(cl.id);
        else next.delete(cl.id);
      });
      return next;
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = async () => {
    setExporting(true);
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = await import('docx');
      const { saveAs } = await import('file-saver');

      const selectedClauses = CATEGORIES.flatMap(cat =>
        cat.clauses
          .filter(cl => selected.has(cl.id))
          .map(cl => ({ ...cl, categoryTitle: cat.title }))
      );

      const children: InstanceType<typeof Paragraph>[] = [
        new Paragraph({
          text: 'Guldmann UK',
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          text: 'Employee Handbook',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          text: 'Version 1.0 - 2025',
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
      ];

      let currentCat = '';
      selectedClauses.forEach(clause => {
        if (clause.categoryTitle !== currentCat) {
          currentCat = clause.categoryTitle;
          children.push(
            new Paragraph({
              text: clause.categoryTitle,
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 },
              border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'F4B626', space: 4 } },
            })
          );
        }

        clause.content.split('\n').forEach(line => {
          if (line.startsWith('## ')) {
            children.push(new Paragraph({
              text: line.slice(3),
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 240, after: 120 },
            }));
          } else if (line.startsWith('- ')) {
            children.push(new Paragraph({
              bullet: { level: 0 },
              children: [new TextRun({ text: line.slice(2).replace(/\*\*(.*?)\*\*/g, '$1') })],
            }));
          } else if (line.trim()) {
            const parts = line.split(/\*\*(.*?)\*\*/g);
            children.push(new Paragraph({
              children: parts.map((part, i) =>
                new TextRun({ text: part, bold: i % 2 === 1 })
              ),
              spacing: { after: 120 },
            }));
          }
        });
      });

      const doc = new Document({ sections: [{ children }] });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, 'Guldmann-UK-Employee-Handbook-2025.docx');
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setExporting(false);
    }
  };

  const filteredCategories = search.trim()
    ? CATEGORIES.map(cat => ({
        ...cat,
        clauses: cat.clauses.filter(cl =>
          cl.title.toLowerCase().includes(search.toLowerCase()) ||
          cl.summary.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter(cat => cat.clauses.length > 0)
    : CATEGORIES;

  const totalSelected = selected.size;
  const totalClauses = ALL_IDS.length;

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #handbook-document, #handbook-document * { visibility: visible !important; }
          #handbook-document { position: fixed; top: 0; left: 0; width: 100%; background: white; }
        }
      `}</style>

      <div className="flex flex-col h-screen bg-[#F8F8F6] overflow-hidden">
        {/* Top bar */}
        <div className="shrink-0 flex items-center gap-4 px-5 py-3 bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#F4B626] flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-gray-900 leading-tight">Handbook Builder</div>
              <div className="text-[10px] text-gray-400">Guldmann UK - 2025</div>
            </div>
          </div>

          <div className="h-5 w-px bg-gray-200 mx-1" />

          <div className="text-[12px] text-gray-500">
            <span className="font-semibold text-gray-800">{totalSelected}</span>/{totalClauses} sections selected
          </div>

          <div className="flex-1" />

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / PDF
          </button>

          <button
            type="button"
            onClick={handleExportWord}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4B626] text-[12px] font-semibold text-white hover:bg-[#e0a820] transition-colors disabled:opacity-60"
          >
            <Download className="w-3.5 h-3.5" />
            {exporting ? 'Exporting...' : 'Export Word'}
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left - selector */}
          <div className="w-[340px] shrink-0 flex flex-col border-r border-gray-100 bg-white overflow-hidden">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sections..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-[12px] rounded-lg border border-gray-200 focus:border-[#F4B626] focus:ring-1 focus:ring-[#F4B626] outline-none"
                />
                {search && (
                  <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredCategories.map(cat => (
                <CategoryAccordion
                  key={cat.id}
                  category={cat}
                  selected={selected}
                  onToggleClause={toggleClause}
                  onToggleAll={toggleAll}
                />
              ))}
              {filteredCategories.length === 0 && (
                <div className="text-center py-8 text-[12px] text-gray-400">No sections match your search</div>
              )}
            </div>

            <div className="p-3 border-t border-gray-100 flex gap-2">
              <button
                type="button"
                onClick={() => setSelected(new Set(ALL_IDS))}
                className="flex-1 py-1.5 text-[11px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={() => setSelected(new Set(REQUIRED_IDS))}
                className="flex-1 py-1.5 text-[11px] font-medium text-[#F4B626] border border-[#F4B626]/30 rounded-lg hover:bg-[#F4B626]/5 transition-colors"
              >
                Required only
              </button>
            </div>
          </div>

          {/* Right - document preview */}
          <div className="flex-1 overflow-y-auto bg-[#F8F8F6]">
            <div className="min-h-full bg-white shadow-sm mx-auto my-6 rounded-xl overflow-hidden" style={{ maxWidth: '780px' }}>
              <DocumentPreview selected={selected} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
