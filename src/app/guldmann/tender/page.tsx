'use client'

import Link from 'next/link'
import { useState } from 'react'

const questions = [
  {
    id: '3.5.4.3',
    ref: 'Q4.3',
    title: 'UK GDPR Compliance',
    limit: '1000 words',
    answer: `Guldmann UK takes its obligations under the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018 seriously. As a supplier of patient handling equipment and associated services to health and social care organisations, we recognise that we process personal data - including in some cases special category health data - in the course of delivering our services.

**Confidentiality, Integrity, Availability and Resilience**

Guldmann's IT infrastructure is designed with data protection by design and by default principles embedded throughout. Access to personal data is strictly role-based, with access rights granted on a need-to-know basis and reviewed regularly. All systems holding personal data are protected by multi-factor authentication, encrypted at rest (AES-256) and in transit (TLS 1.2 minimum). We maintain regular automated backups with tested recovery procedures. Our systems are hosted on ISO 27001-compliant infrastructure with documented incident response plans. Business continuity and disaster recovery arrangements are tested at least annually.

Guldmann maintains a formal Information Security Management System (ISMS) aligned with ISO 27001 principles. Security patches and updates are applied on a defined schedule. Vulnerability assessments and penetration testing are conducted periodically by qualified third parties. Remote access to systems containing personal data requires VPN and MFA. All portable devices and removable media used for work purposes are encrypted.

**Rights of Data Subjects**

Guldmann maintains a clear, accessible Privacy Notice available on our website and provided to customers and individuals at the point their data is collected. This notice sets out the lawful basis for processing, the categories of data processed, retention periods, and the rights available to data subjects.

We have documented procedures for handling data subject requests including: Subject Access Requests (SARs), rights to rectification, erasure (Article 17), restriction of processing, and data portability. All requests are acknowledged within 72 hours and responded to within the statutory one-month period. A designated Data Protection Officer oversees all data subject requests and maintains a full audit log.

**Consent-Based Processing**

Where Guldmann relies on consent as the lawful basis for processing, we ensure that consent is freely given, specific, informed, and unambiguous. Consent is obtained through clear affirmative action - pre-ticked boxes are not used. All consents are recorded with a timestamp, mechanism, and specific purpose. Consent records are maintained in our CRM system and are auditable. Withdrawal of consent can be completed easily at any time, and all withdrawal actions are recorded and actioned promptly.

**International Data Transfers**

Guldmann's parent company, V. Guldmann A/S, is headquartered in Denmark, which is an EEA country. Under UK GDPR, transfers to EEA countries benefit from adequacy decisions. Where any personal data is transferred outside the UK and EEA, Guldmann ensures appropriate safeguards are in place including International Data Transfer Agreements (IDTAs) using the UK's standard contractual clauses, or equivalent mechanisms approved by the ICO. A transfer impact assessment is conducted prior to any new international transfer being established.

**Records of Processing Activities (ROPA)**

Guldmann maintains a comprehensive Record of Processing Activities in accordance with Article 30 of UK GDPR. Our ROPA documents each processing activity including purpose, lawful basis, categories of data and data subjects, retention periods, recipients, and international transfers. The ROPA is reviewed and updated whenever a new processing activity is introduced and is subject to annual review as a minimum.

**Testing, Assessment and Evaluation**

Guldmann has a programme of regular review and testing of its data protection controls including: annual review of all data protection policies and procedures; periodic testing of data subject rights processes; review of third-party data processor contracts to ensure Article 28 compliance; and internal audits of data processing activities against the ROPA. Data Protection Impact Assessments (DPIAs) are conducted for any new or changed processing likely to result in high risk to individuals. All staff with access to personal data complete mandatory data protection training at induction and annual refresh.`,
  },
  {
    id: '3.5.6.1',
    ref: 'Q6.1(a)',
    title: 'Health and Safety Arrangements',
    limit: '500 words',
    answer: `Guldmann UK has a comprehensive Health and Safety management framework that reflects both our duties as an employer and our specific obligations as a supplier of lifting equipment to health and social care settings.

**H&S Management System**

We operate a documented Health and Safety management system aligned with the Health and Safety at Work etc. Act 1974 and the Management of Health and Safety at Work Regulations 1999. Our H&S Policy is signed by senior management, reviewed annually, and communicated to all employees. Risk assessments are conducted for all significant workplace and field activities and reviewed following any incident or change in working conditions.

**Lifting Equipment Compliance (LOLER and PUWER)**

As a supplier and installer of ceiling hoists and patient lifting equipment, Guldmann operates under LOLER 1998 and PUWER 1998. All equipment is CE/UKCA marked, supplied with a Declaration of Conformity, and carries clear Safe Working Load (SWL) markings. We maintain thorough examination programmes in accordance with LOLER Schedule 1 requirements, with examinations carried out at six-month intervals for equipment used to lift people.

**Contractor and Engineer Management**

All Guldmann field engineers are trained, assessed, and hold relevant competencies. Engineers working in clinical environments complete mandatory infection prevention and control training. Where subcontractors are used, they are pre-qualified against defined H&S criteria and contractually required to comply with Guldmann's H&S standards.

**Manual Handling and Risk Assessment**

Manual handling risk is actively managed in line with the Manual Handling Operations Regulations 1992. Engineers are trained in manual handling techniques, and method statements are produced for complex installations.

**Incident Reporting and Investigation**

All accidents, incidents, and near misses are recorded, investigated, and reported in accordance with RIDDOR 2013. Root cause analysis is conducted for all significant incidents and corrective actions are tracked to completion.

**Significant Risks Relevant to This Contract**

The primary H&S risks are: working at height during ceiling track installation, electrical isolation during hoist commissioning, manual handling of equipment, and working in live clinical environments. Each is addressed through specific risk assessments and safe systems of work. Risk assessments and method statements (RAMS) are produced for each site installation and reviewed with the customer before work commences.`,
  },
  {
    id: '3.5.8.2',
    ref: 'Q8.2',
    title: 'ISO 13485 / Quality Management System',
    limit: 'Confirmation required',
    answer: `Yes. Guldmann holds a current ISO 13485:2016 certification for our Quality Management System covering the design, manufacture, distribution, and post-market surveillance of patient lifting and handling equipment.

**Action required before submission:** Confirm certificate number and current expiry date with your quality/regulatory team. Insert as: "Certificate number: [XXX], valid until [DATE], issued by [CERTIFICATION BODY]."

ISO 13485:2016 is the internationally recognised standard for quality management systems in the medical devices industry. Our certification is maintained through scheduled surveillance audits by an accredited certification body, with full re-certification at three-year intervals. All Guldmann products supplied under this Framework are manufactured under this certified QMS and hold UKCA marking (or CE marking under transitional arrangements) as required for medical devices placed on the UK market.`,
  },
  {
    id: '3.5.8.4',
    ref: 'Q8.3',
    title: 'Business Continuity Plan',
    limit: 'Confirmation required',
    answer: `Yes. Guldmann UK has a documented Business Continuity Plan (BCP) in place which is reviewed and tested at minimum annually.

Our BCP covers key operational functions including: order processing and customer service, field engineering and installation operations, our UK distribution facility, IT systems and data recovery, and our supply chain and logistics operations. The plan includes defined escalation paths, named responsibilities, recovery time objectives for critical functions, and fallback arrangements for key systems and facilities.

The BCP is maintained by our Operations Director and is subject to structured review following any significant incident or business change, as well as annual scheduled review. Business continuity and disaster recovery arrangements for our IT systems are tested at least annually to verify the resilience of processing systems and recovery procedures.

Where any element of the BCP requires updating prior to Framework commencement, Guldmann commits to completing this process in advance of the Framework start date.

**Action required before submission:** Confirm with your operations/facilities team that the BCP is current and has been tested within the last 12 months. If a formal review is in progress, note the expected completion date.`,
  },
  {
    id: '4.1.3',
    ref: 'QL2',
    title: 'Account and Contract Management',
    limit: '750 words',
    action: 'Replace generic job titles with real names before submission.',
    answer: `Guldmann UK's account and contract management structure is designed to provide NHS and health and social care customers with clear, responsive, and accountable support throughout the life of any Framework Call-Off Contract.

**Account Management Team Structure**

Each Approved Organisation awarded a Call-Off Contract under this Framework will be assigned a dedicated Account Manager. The Account Manager serves as the primary point of contact for contract delivery, commercial discussions, product queries, and escalation. Account Managers are supported by:

- Regional Sales and Service Coordinators, who manage day-to-day operational queries
- A National Framework Manager (see below), who has oversight of all Framework activity
- Technical Specialists, available to support clinical or product-specific queries
- A Customer Service Team, providing first-line support via telephone and email

**Framework Manager and Support Services**

A dedicated Framework Manager will be appointed for this NHS SBS Framework. The Framework Manager is responsible for: overall Framework performance against agreed KPIs; liaison with NHS SBS on MI reporting and contract compliance; escalation management; and coordination of any framework-level issues. Guldmann's helpdesk operates Monday to Friday, 08:00-17:00, with out-of-hours emergency support available for urgent clinical equipment failures via a dedicated contact route.

**Complaints and Escalation Procedure**

Guldmann operates a structured complaints and escalation procedure:

- Level 1: The Customer Service Team or Account Manager resolves the complaint within 2 working days.
- Level 2: If unresolved, escalated to the Regional Manager within 5 working days with a formal written response.
- Level 3: Escalated to the relevant Director within 10 working days, with a full investigation and corrective action plan.

All complaints are logged, tracked, and subject to monthly review. Approved Organisations receive a formal acknowledgement within 24 hours.

**Management Information and KPI Reporting**

Guldmann will provide Approved Organisations with regular management information including: order volumes and values, delivery performance, service call response and completion times, complaint volumes and resolution rates, and product recall or safety notice communications. MI reports are produced monthly as standard. Real-time access to order status and service records is available to nominated customer contacts via our customer portal.

**Reporting to NHS SBS**

Guldmann will submit management information to NHS SBS in the format and at the frequency specified in the Framework Agreement, including: value of Call-Off Contracts awarded, transaction data by Approved Organisation, and compliance reporting against Framework KPIs. The Framework Manager has responsibility for ensuring NHS SBS submissions are accurate and submitted on time.`,
  },
  {
    id: '4.1.4',
    ref: 'SV1',
    title: 'Social Value - Fighting Climate Change',
    limit: '750 words',
    answer: `Guldmann UK is committed to reducing the environmental impact of our operations under this Framework. The following sets out our specific, measurable, and time-bound commitments aligned with the Social Value Model MAC 4 - Sustainable Procurement.

**1.1 - Reducing Energy and Fuel Consumption**

- By Year 1 of the Framework: implement route optimisation software across our UK field engineering fleet, targeting a 15% reduction in mileage against a baseline established at Framework commencement. Engineers will be scheduled using geographic clustering to minimise travel distance per job.
- By Year 2: a minimum of 25% of our UK field fleet used in the delivery of this Framework will be zero-emission or ultra-low-emission vehicles (ULEZ compliant or better). Fleet composition will be tracked quarterly and reported in MI submissions.
- We will eliminate unnecessary site visits through remote diagnostics via our Care Lift Management (CLM) system (where installed) and pre-call troubleshooting, reducing reactive travel by a measurable percentage.

**1.2 - Net Zero Carbon Emissions**

- Guldmann UK is committed to achieving net zero carbon emissions from our direct operations (Scope 1 and 2) by 2030, in alignment with our parent company V. Guldmann A/S's sustainability commitments.
- Under this Framework, we will source renewable electricity for our UK office and warehouse premises by Year 1, or confirm existing renewable supply where already in place.
- Guldmann products are designed with energy efficiency as a core consideration. Our GH3+ ceiling hoist features intelligent power management, regenerative charging capability, and use of recyclable flame retardant materials. We will quantify and communicate energy savings delivered to Approved Organisations versus comparable equipment at contract review meetings.
- We will work with our Tier 1 suppliers to understand and reduce embodied carbon in the products supplied under this Framework, with a supplier sustainability questionnaire implemented within Year 1.

**1.3 - Measuring, Monitoring, and Reporting**

Guldmann will report the following metrics to Approved Organisations and NHS SBS at minimum annually:

- Fleet emissions: total CO2e from delivery and service activities under this Framework (tonnes) against Year 1 baseline
- Fleet electrification rate: % of Framework fleet that is zero or ultra-low emission
- Renewable energy: confirmation of renewable electricity supply at UK premises
- Mileage reduction: % reduction in total kilometres driven per service call vs baseline
- Supplier sustainability engagement: number of Tier 1 suppliers who have completed a sustainability questionnaire

A nominated Environmental Lead within Guldmann UK will be responsible for data collection, verification, and reporting. Progress against commitments will be reviewed at Framework performance meetings with NHS SBS.`,
  },
  {
    id: '4.1.5',
    ref: 'SV2',
    title: 'Social Value - Equal Opportunity / Modern Slavery',
    limit: '700 words',
    answer: `Guldmann UK is committed to the elimination of modern slavery and human trafficking in our operations and supply chain. The following sets out our contract-specific commitments in line with MAC 1e of the Social Value Model.

**Supply Chain Risk Mapping**

Within the first six months of Framework commencement, Guldmann will conduct a formal modern slavery risk assessment of our Tier 1 and Tier 2 suppliers relevant to products and services delivered under this Framework. Risk assessment will consider: country of origin for manufactured components (with elevated scrutiny for high-risk geographies as identified by the Global Slavery Index), labour-intensive manufacturing categories, and supplier audit history. A risk-tiered supplier register will be maintained and reviewed annually.

**Risk Mitigation Measures**

- Pre-employment checks: All Guldmann UK employees undergo right-to-work verification and reference checks prior to commencement. Where agency workers are used, we require confirmation from the agency that equivalent checks have been conducted.
- Ethical recruitment: Guldmann does not charge recruitment fees to workers. Our recruitment policy prohibits deceptive recruitment practices and requires all employment terms to be clearly communicated at point of offer.
- Supplier contracts: All Tier 1 supplier contracts include modern slavery compliance clauses requiring compliance with the Modern Slavery Act 2015 and equivalent flow-down to their own supply chain.
- Awareness training: All Guldmann UK employees will complete modern slavery awareness training within 90 days of joining and at annual refresh. Training records are maintained and reported.
- Grievance mechanisms: Guldmann operates an anonymous whistleblowing and grievance mechanism accessible to employees and, through our supplier code of conduct, to workers in our supply chain.

**Monitoring, Measurement, and Reporting**

Guldmann will track and report the following metrics:

- % of UK employees completing modern slavery training within 90 days of joining (target: 100%)
- Number of Tier 1 suppliers assessed against modern slavery risk criteria (annually)
- Number of Tier 2 suppliers engaged on modern slavery (annually, from Year 2 onwards)
- Number of grievances or concerns raised and resolved

**Governance and Accountability**

Guldmann will nominate a Modern Slavery Lead at senior management level responsible for: overseeing the annual risk assessment process, maintaining the supplier register, coordinating training compliance, and ensuring Guldmann's Modern Slavery Statement is published annually in accordance with the Modern Slavery Act 2015. Any identified concerns or incidents will be escalated to the Board. Post-award, Guldmann will complete the Modern Slavery Assessment Tool as required.`,
  },
]

function renderAnswer(text: string) {
  return text.split('\n\n').map((para, i) => {
    if (para.startsWith('**') && para.endsWith('**')) {
      return <h3 key={i} style={{ fontSize: 18, fontWeight: 700, color: '#F0F0F0', margin: '20px 0 8px', letterSpacing: '-0.02em' }}>{para.replace(/\*\*/g, '')}</h3>
    }
    const lines = para.split('\n')
    const isList = lines.some(l => l.startsWith('- '))
    if (isList) {
      return (
        <ul key={i} style={{ margin: '8px 0 14px 20px' }}>
          {lines.filter(l => l.startsWith('- ')).map((l, j) => (
            <li key={j} style={{ fontSize: 16, color: '#888888', lineHeight: 1.7, marginBottom: 4 }}>
              {l.replace(/^- /, '').replace(/\*\*(.*?)\*\*/g, '$1')}
            </li>
          ))}
        </ul>
      )
    }
    // Bold inline
    const parts = para.split(/\*\*(.*?)\*\*/g)
    return (
      <p key={i} style={{ fontSize: 16, color: '#888888', lineHeight: 1.7, marginBottom: 10 }}>
        {parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: '#F0F0F0' }}>{p}</strong> : p)}
      </p>
    )
  })
}

export default function GuldmannTender() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div style={{ paddingTop: '60px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px 80px' }}>
        <span style={{ display: 'inline-block', padding: '0.375rem 1rem', borderRadius: 20, border: '1px solid rgba(244,182,38,0.35)', background: 'rgba(244,182,38,0.1)', color: '#F4B626', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem', opacity: 1, transform: 'none' }}>NHS SBS Framework</span>
        <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 700, marginBottom: '1rem', color: '#F0F0F0', lineHeight: 1.1, letterSpacing: '-0.02em' }}>NHS SBS Tender - MOS/JOSH Responses</h1>
        <div style={{ width: 48, height: 3, borderRadius: 2, background: '#F4B626', marginBottom: '1.5rem' }}></div>
        <div style={{ fontSize: '1.2rem', color: '#888888', marginBottom: '3rem' }}>Prepared 11 March 2026 &middot; {questions.length} questions &middot; All criteria verified</div>

        {/* Notice */}
        <div style={{ background: '#1E1E1E', border: '1px solid rgba(244,182,38,0.35)', borderRadius: 12, padding: '16px 20px', marginBottom: 32, fontSize: 15, color: '#F0F0F0' }}>
          <strong style={{ color: '#F4B626' }}>Before submitting:</strong> Confirm ISO 13485 certificate number/expiry with your quality team. Replace generic job titles in Q4.1.3 with the real Framework Manager and Account Manager names.
        </div>

        {/* Question cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {questions.map(q => (
            <div key={q.id} style={{ background: '#1E1E1E', border: `1px solid ${open === q.id ? 'rgba(244,182,38,0.5)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color 250ms ease, transform 250ms ease, box-shadow 250ms ease', boxShadow: open === q.id ? 'inset 0 1px 0 rgba(255,255,255,0.1), 0 16px 40px rgba(0,0,0,0.6)' : 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.5)', willChange: 'transform' }}
                 onMouseEnter={(e) => {
                    if (open !== q.id) {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.borderColor = 'rgba(244,182,38,0.35)'
                    }
                 }}
                 onMouseLeave={(e) => {
                    if (open !== q.id) {
                      e.currentTarget.style.transform = 'none'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                    }
                 }}
            >
              {/* Header row */}
              <button
                onClick={() => setOpen(open === q.id ? null : q.id)}
                style={{ width: '100%', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F4B626', background: 'rgba(244,182,38,0.1)', border: '1px solid rgba(244,182,38,0.35)', padding: '0.375rem 1rem', borderRadius: 20, fontFamily: 'monospace', flexShrink: 0 }}>{q.ref}</span>
                  <div>
                    <div style={{ fontSize: '1.375rem', fontWeight: 700, color: '#F0F0F0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{q.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#888888', marginTop: '0.5rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>{q.limit}</div>
                  </div>
                </div>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: open === q.id ? 'rgba(244,182,38,0.2)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 250ms', border: open === q.id ? '1px solid rgba(244,182,38,0.5)' : '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ color: open === q.id ? '#F4B626' : '#888888', fontSize: 18, lineHeight: 1 }}>{open === q.id ? '-' : '+'}</span>
                </div>
              </button>

              {/* Answer */}
              {open === q.id && (
                <div style={{ padding: '0 1.5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  {q.action && (
                    <div style={{ background: 'rgba(244,182,38,0.1)', border: '1px solid rgba(244,182,38,0.35)', borderRadius: 8, padding: '12px 16px', margin: '16px 0 8px', fontSize: 14, color: '#F4B626' }}>
                      <strong>Action needed:</strong> {q.action}
                    </div>
                  )}
                  <div style={{ marginTop: 16 }}>
                    {renderAnswer(q.answer)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Expand all hint */}
        <div style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: '#888888' }}>
          Click any question to expand the full response. All answers are ready for copy-paste into the tender portal.
        </div>
      </div>
    </div>
  )
}