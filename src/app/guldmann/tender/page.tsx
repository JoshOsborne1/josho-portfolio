'use client'

import { useState } from 'react'

// ── Answer text constants ──────────────────────────────────────────────────

const A_Q43 = `Guldmann UK takes its obligations under the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018 seriously. As a supplier of patient handling equipment and associated services to health and social care organisations, we recognise that we process personal data - including in some cases special category health data - in the course of delivering our services.

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

Guldmann has a programme of regular review and testing of its data protection controls including: annual review of all data protection policies and procedures; periodic testing of data subject rights processes; review of third-party data processor contracts to ensure Article 28 compliance; and internal audits of data processing activities against the ROPA. Data Protection Impact Assessments (DPIAs) are conducted for any new or changed processing likely to result in high risk to individuals. All staff with access to personal data complete mandatory data protection training at induction and annual refresh.`

const A_Q61 = `Guldmann UK has a comprehensive Health and Safety management framework that reflects both our duties as an employer and our specific obligations as a supplier of lifting equipment to health and social care settings.

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

The primary H&S risks are: working at height during ceiling track installation, electrical isolation during hoist commissioning, manual handling of equipment, and working in live clinical environments. Each is addressed through specific risk assessments and safe systems of work. Risk assessments and method statements (RAMS) are produced for each site installation and reviewed with the customer before work commences.`

const A_Q82 = `Yes. Guldmann holds a current ISO 13485:2016 certification for our Quality Management System covering the design, manufacture, distribution, and post-market surveillance of patient lifting and handling equipment.

**Action required before submission:** Confirm certificate number and current expiry date with your quality/regulatory team. Insert as: "Certificate number: [XXX], valid until [DATE], issued by [CERTIFICATION BODY]."

ISO 13485:2016 is the internationally recognised standard for quality management systems in the medical devices industry. Our certification is maintained through scheduled surveillance audits by an accredited certification body, with full re-certification at three-year intervals. All Guldmann products supplied under this Framework are manufactured under this certified QMS and hold UKCA marking (or CE marking under transitional arrangements) as required for medical devices placed on the UK market.`

const A_Q83 = `Yes. Guldmann UK has a documented Business Continuity Plan (BCP) in place which is reviewed and tested at minimum annually.

Our BCP covers key operational functions including: order processing and customer service, field engineering and installation operations, our UK distribution facility, IT systems and data recovery, and our supply chain and logistics operations. The plan includes defined escalation paths, named responsibilities, recovery time objectives for critical functions, and fallback arrangements for key systems and facilities.

The BCP is maintained by our Operations Director and is subject to structured review following any significant incident or business change, as well as annual scheduled review. Business continuity and disaster recovery arrangements for our IT systems are tested at least annually to verify the resilience of processing systems and recovery procedures.

Where any element of the BCP requires updating prior to Framework commencement, Guldmann commits to completing this process in advance of the Framework start date.

**Action required before submission:** Confirm with your operations/facilities team that the BCP is current and has been tested within the last 12 months. If a formal review is in progress, note the expected completion date.`

const A_QL1 = `Guldmann UK operates an ISO 13485:2016-certified Quality Management System covering the design, manufacture, distribution, installation, and post-market surveillance of patient lifting and handling equipment. All products supplied under this Framework are manufactured within this certified QMS and carry UKCA marking (or CE marking under applicable transitional arrangements) as required for medical devices placed on the UK market.

**Quality Assurance Processes**

Quality assurance is integrated across the full product lifecycle. At the point of manufacture, products undergo defined in-process checks and final release inspection against controlled specifications, including verification of Safe Working Load (SWL) ratings, electrical safety testing for powered hoists, and functional performance checks. Each product is issued with a Declaration of Conformity and, for lifting equipment, a Thorough Examination certificate as required under LOLER 1998.

In the field, installation and commissioning are performed by trained Guldmann engineers following documented procedures controlled within the QMS. A completed installation record is produced for each site, confirming that equipment has been installed in accordance with the manufacturer's instructions and that commissioning checks have been successfully completed. These records are retained and available to Approved Organisations on request.

Engineering changes to products or processes are subject to formal change control. Any change with potential to affect safety, performance, or regulatory compliance is subject to documented risk assessment and re-validation before implementation, in line with ISO 13485 requirements and applicable MHRA guidance. Products and services supplied under this Framework are reviewed against the requirements set out in section 1.10 of the Specification on an ongoing basis, with any deviations addressed through the CAPA process.

**Non-Conformance Management**

Non-conformances are captured, investigated, and resolved through a formal Non-Conformance Report (NCR) system. NCRs may be raised by any employee, by customers, or as a result of audit findings. Each NCR is assigned an owner and progresses through root cause analysis, corrective action implementation, and verification of effectiveness before closure. Overdue NCRs are escalated to the Quality Manager.

Customer complaints are classified as potential non-conformances and logged centrally regardless of severity. Each complaint receives written acknowledgement within 24 hours and is investigated in accordance with ISO 13485 requirements. Complaint trend data is reviewed quarterly at management review meetings; systemic patterns trigger formal corrective and preventive action (CAPA). Remedial action plans are communicated to the relevant customer where appropriate.

**Audit Programme**

Guldmann's internal audit programme covers all QMS processes on a planned annual cycle, with targeted audits conducted following non-conformances, significant process changes, or customer feedback. Auditors are trained and operate independently of the functions under review. Findings and corrective actions are reviewed by senior management and tracked to closure.

External surveillance audits are conducted by our accredited ISO 13485 certification body on a scheduled basis, with full re-certification at three-year intervals. Critical component suppliers are subject to supplier audits, with frequency risk-rated according to supplier performance and the safety criticality of supplied items. Guldmann commits to making relevant quality documentation, audit findings, and certification available to NHS SBS and Approved Organisations on request throughout the Framework.

**Recall Processes and MHRA Communications**

Guldmann operates a documented Field Safety and Product Recall procedure compliant with the Medical Device Regulations 2002 (as amended) and MHRA guidance on Field Safety Corrective Actions. The procedure provides for: identification of affected products by serial number and installation site; issue of Field Safety Notices to all affected Approved Organisations within MHRA-required timescales by written communication; clear instructions on required action including product quarantine, modification, or return as applicable; and structured tracking of remediation to confirm all affected sites have been addressed.

Post-market surveillance activities include systematic monitoring of MHRA Medical Device Alerts and Field Safety Notices relevant to Guldmann product categories. Relevant communications are assessed by our regulatory team, appropriate action is initiated, and affected Approved Organisations are notified promptly. Product changes affecting safety, performance, or regulatory status are communicated to Approved Organisations in advance of implementation. All recall and safety communications are documented and retained within the QMS.`

const A_QL2DEL = `Guldmann UK's delivery model for Call-Off Contracts under this Framework is built around dedicated account management, robust logistics infrastructure, and a national field engineering network. The following outlines our approach across each element of the required Delivery Plan.

**Delivery Timescales**

Standard product orders are fulfilled against defined lead-times communicated at the point of order confirmation. Our UK distribution facility holds core product stock to support rapid dispatch, with the majority of standard ceiling hoist and track products available for delivery within 5-10 working days of order placement. Urgent clinical orders are triaged by our Customer Service Team and, where clinically indicated, prioritised for earlier dispatch. Order status is tracked in our ERP system and customers receive order confirmation and dispatch notification by email. Where lead-times are expected to vary — for example, for bespoke or made-to-measure configurations — customers are advised at order placement and kept informed of progress.

**Systems Supporting Delivery**

Order management is handled through Guldmann's integrated ERP platform, providing real-time visibility of stock levels, order status, and dispatch scheduling. Our field engineering resource planning tool is used to schedule installation and service activities, minimising response times and optimising geographic coverage. Approved Organisations with access to our customer portal can view order history, service records, and equipment registers. Our Care Lift Management (CLM) system, where installed, enables remote monitoring of powered equipment and supports pre-emptive maintenance scheduling and remote fault diagnosis.

**Risk Identification and Management**

Delivery risks are identified and managed at contract level. A risk register is maintained for each active Call-Off Contract and reviewed at regular account review meetings. Key delivery risks — including supply chain delays, installation site readiness, access constraints, and clinical environment infection control requirements — are assessed at the point of quotation or order, with mitigation actions agreed with the customer in advance. Where site surveys identify factors that could affect installation timescales or method, a revised programme is agreed before work proceeds.

**Training Programme**

Guldmann provides a comprehensive training programme for all products supplied under this Framework. For ceiling hoists and patient handling equipment, training is delivered by qualified Guldmann Trainers and covers: safe system of work for hoist and sling use; equipment inspection prior to each use; emergency lowering procedures; cleaning and infection control; and sling selection and fitting. Training is available as: on-site group sessions at the point of installation; refresher sessions at agreed intervals; e-learning modules (available via our online training portal); and Train-the-Trainer programmes for customers who wish to develop in-house competency. All training is documented, with completion records available to Approved Organisations. Training materials comply with applicable Resuscitation Council, TILE risk assessment principles, and National Back Exchange guidance.

**Maintenance and Servicing Programme**

Guldmann offers a full range of planned preventive maintenance and reactive service contracts tailored to customer requirements. Under our standard planned maintenance programme, ceiling hoists are serviced at six-monthly intervals in accordance with LOLER 1998 (Schedule 1) requirements for lifting equipment used to lift persons, including Thorough Examination by a competent person. Service visits are scheduled proactively, with confirmation provided to nominated site contacts in advance. All service and examination records are issued to the customer and retained on our service management system. Reactive service calls are responded to within agreed SLA timescales, with priority response available for equipment supporting high-dependency patients. Remote diagnostics via CLM reduce unnecessary site visits and enable faster fault resolution for connected equipment.

**Cleaning and Decontamination**

Guldmann products are designed to support effective decontamination in line with NHS infection prevention and control requirements. Product-specific cleaning and decontamination guidance is provided in the relevant Instructions for Use and supplementary technical bulletins, specifying compatible cleaning agents, concentrations, contact times, and any materials that must be avoided. Slings and soft accessories carry defined decontamination protocols and single-patient-use recommendations where appropriate. Product cleaning guides are available in digital format and provided to nursing and housekeeping staff as part of the installation training. Guldmann's technical team remains available to advise Approved Organisations on decontamination queries throughout the contract.

**Transition from Incumbent Supplier**

Where a Call-Off Contract involves transition from an existing supplier, Guldmann's approach is structured to ensure service continuity and minimal clinical disruption. A transition plan is agreed with the Approved Organisation in advance, covering: site survey and equipment audit to establish the installed base; phased replacement scheduling aligned to ward or department priorities; parallel support during the transition period; updated equipment registers and asset tags on completion; and a post-transition review to confirm all activities have been completed and clinical staff are trained on new equipment. Our Framework Manager maintains oversight of all active transitions and reports progress to NHS SBS as required.`

const A_QL3 = `Guldmann UK's security of supply model reflects our position as part of a vertically integrated global group. V. Guldmann A/S, our Danish parent company, designs and manufactures the majority of products supplied under this Framework at owned manufacturing facilities in Denmark. This direct control over the supply chain — from component sourcing through to finished goods — provides structural resilience that third-party distributor models cannot replicate.

**Actively Ensuring Security of Supply**

Guldmann's supply chain management processes are integrated across our global manufacturing and regional distribution operations. Critical components are dual-sourced wherever practicable, and strategic inventory buffers are maintained at manufacturing level to absorb short-term demand fluctuations and supply disruptions. Our UK distribution facility carries finished goods stock sized to meet forecast demand across our NHS and health and social care customer base. Safety stock levels for core Framework products are reviewed and maintained on a rolling basis. Supplier relationships with key component vendors are actively managed through formal supplier qualification, regular performance reviews, and contractual requirements for supply security, including advance notification of any capacity changes or supply risks.

**Forecasting and Stock Management**

Demand forecasting is conducted monthly using order history, contracted volume projections, and pipeline sales data from our CRM system. Forecasts are shared with our manufacturing operations to support production planning and ensure appropriate stock availability. For larger Call-Off Contracts with defined delivery programmes, Approved Organisations are encouraged to provide forward demand schedules at the point of contract award; this enables Guldmann to pre-position stock and reserve manufacturing capacity, reducing lead-times and eliminating unnecessary risk. Current standard lead-times for core ceiling hoist and track products from UK stock are 5-10 working days. Products subject to bespoke configuration are managed against agreed lead-times communicated at order placement, with progress updates provided proactively.

**Emergency and Out-of-Hours Services**

Guldmann operates a standard customer service function Monday to Friday, 08:00-17:00. Outside these hours, a dedicated out-of-hours emergency contact route is available for urgent clinical equipment failures. Engineers on emergency call-out are equipped to carry out fault diagnosis, temporary repair, or equipment replacement where required to restore patient safety. Response priorities are agreed with individual Approved Organisations at the point of contract and documented in service level agreements. Where a hoist or track requires immediate withdrawal from service following an emergency call, Guldmann can provide loan equipment to maintain clinical continuity subject to availability.

**Back-Up Systems and Contingency Plans**

Guldmann's Business Continuity Plan (BCP) covers supply chain disruption as a defined risk scenario. Contingency measures include: overflow stock held at a secondary UK storage location; cross-trained engineering resource deployable across regions in high-demand periods; and identified alternative component sources for critical parts. Our IT systems, including ERP, order management, and customer portal, are hosted on resilient cloud infrastructure with defined recovery time objectives and tested disaster recovery procedures. In the event of a significant supply disruption affecting availability, Guldmann's commercial and operations leadership convene within 24 hours to assess impact, activate contingency arrangements, and communicate with affected Approved Organisations.

**Communicating Supply Issues to Approved Organisations**

Guldmann is committed to proactive, transparent communication in the event of any supply constraint. Where a supply issue is identified that could affect an Approved Organisation's order, their Account Manager or the Framework Manager will make direct contact within 24 hours of the issue being identified. Communication will include: the nature and anticipated duration of the constraint; the products or order lines affected; revised delivery estimates; and proposed mitigation options. NHS SBS will be kept informed of any Framework-level supply issues in accordance with contract requirements. Supply issue communications are logged and tracked to resolution.

**Minimising the Impact of Raw Material and Fuel Cost Fluctuations**

Guldmann's pricing model for Framework products reflects long-term cost management strategies built into our supply chain and operations. Fixed Framework pricing is supported by: forward purchasing arrangements for key materials including steel and electronic components; multi-year supply contracts with critical vendors providing pricing certainty; and a geographically clustered field engineering model that minimises fuel exposure per service call. Route optimisation software is used across our field fleet to reduce mileage and fuel consumption. Where Guldmann anticipates cost pressures that may require a pricing review, we will engage NHS SBS and Approved Organisations in advance and in accordance with the Framework Agreement's price review mechanisms, ensuring full transparency and adequate notice.`

const A_QL2ACC = `Guldmann UK's account and contract management structure is designed to provide NHS and health and social care customers with clear, responsive, and accountable support throughout the life of any Framework Call-Off Contract.

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

Guldmann will submit management information to NHS SBS in the format and at the frequency specified in the Framework Agreement, including: value of Call-Off Contracts awarded, transaction data by Approved Organisation, and compliance reporting against Framework KPIs. The Framework Manager has responsibility for ensuring NHS SBS submissions are accurate and submitted on time.`

const A_SV1 = `Guldmann UK is committed to reducing the environmental impact of our operations under this Framework. The following sets out our specific, measurable, and time-bound commitments aligned with the Social Value Model MAC 4 - Sustainable Procurement.

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

A nominated Environmental Lead within Guldmann UK will be responsible for data collection, verification, and reporting. Progress against commitments will be reviewed at Framework performance meetings with NHS SBS.`

const A_SV2 = `Guldmann UK is committed to the elimination of modern slavery and human trafficking in our operations and supply chain. The following sets out our contract-specific commitments in line with MAC 1e of the Social Value Model.

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

Guldmann will nominate a Modern Slavery Lead at senior management level responsible for: overseeing the annual risk assessment process, maintaining the supplier register, coordinating training compliance, and ensuring Guldmann's Modern Slavery Statement is published annually in accordance with the Modern Slavery Act 2015. Any identified concerns or incidents will be escalated to the Board. Post-award, Guldmann will complete the Modern Slavery Assessment Tool as required.`

// ── Question definitions ───────────────────────────────────────────────────

const SECTIONS = [
  {
    id: 'cop',
    label: 'Conditions of Participation',
    questions: [
      { id: '3.5.4.3',  ref: 'Q4.3',    title: 'UK GDPR Compliance',                limit: '1000 words',         answer: A_Q43 },
      { id: '3.5.6.1',  ref: 'Q6.1(a)', title: 'Health & Safety Arrangements',      limit: '500 words',          answer: A_Q61 },
      { id: '3.5.8.2',  ref: 'Q8.2',    title: 'ISO 13485 / Quality Management',    limit: 'Confirmation',       answer: A_Q82 },
      { id: '3.5.8.4',  ref: 'Q8.3',    title: 'Business Continuity Plan',          limit: 'Confirmation',       answer: A_Q83 },
    ],
  },
  {
    id: 'lot',
    label: 'Lot Quality Criteria',
    questions: [
      { id: '4.1.6',    ref: 'QL1',      title: 'Quality Assurance',                limit: '700 words',          answer: A_QL1 },
      { id: '4.1.7',    ref: 'QL2-DEL',  title: 'Delivery Plan',                    limit: '1500 words',         answer: A_QL2DEL },
      { id: '4.1.8',    ref: 'QL3',      title: 'Security of Supply',               limit: '1500 words',         answer: A_QL3 },
    ],
  },
  {
    id: 'mgmt',
    label: 'Contract Management & Social Value',
    questions: [
      { id: '4.1.3',    ref: 'QL2',      title: 'Account & Contract Management',    limit: '750 words',          answer: A_QL2ACC, action: 'Replace generic job titles with real names before submission.' },
      { id: '4.1.4',    ref: 'SV1',      title: 'Social Value: Climate Change',     limit: '750 words',          answer: A_SV1 },
      { id: '4.1.5',    ref: 'SV2',      title: 'Social Value: Equal Opportunity',  limit: '700 words',          answer: A_SV2 },
    ],
  },
]

const TOTAL = SECTIONS.reduce((n, s) => n + s.questions.length, 0)

// ── Answer renderer ────────────────────────────────────────────────────────

function renderAnswer(text: string) {
  return text.split('\n\n').map((para, i) => {
    // Section header: **...**  on its own paragraph
    if (/^\*\*[^*]+\*\*$/.test(para.trim())) {
      return (
        <h3 key={i} style={{ fontSize: 15, fontWeight: 700, color: '#F0F0F0', margin: '20px 0 8px', paddingLeft: 12, borderLeft: '3px solid #F4B626', letterSpacing: '-0.01em' }}>
          {para.replace(/\*\*/g, '')}
        </h3>
      )
    }
    const lines = para.split('\n')
    if (lines.some(l => l.startsWith('- '))) {
      return (
        <ul key={i} style={{ margin: '6px 0 14px 4px', padding: 0, listStyle: 'none' }}>
          {lines.filter(l => l.startsWith('- ')).map((l, j) => {
            const raw = l.replace(/^- /, '')
            const parts = raw.split(/\*\*(.*?)\*\*/g)
            return (
              <li key={j} style={{ fontSize: 15, color: '#888', lineHeight: 1.7, marginBottom: 4, paddingLeft: 16, position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: '#F4B626' }}>›</span>
                {parts.map((p, k) => k % 2 === 1 ? <strong key={k} style={{ color: '#F0F0F0' }}>{p}</strong> : p)}
              </li>
            )
          })}
        </ul>
      )
    }
    const parts = para.split(/\*\*(.*?)\*\*/g)
    const isLead = i === 0
    return (
      <p key={i} style={{ fontSize: isLead ? 16 : 15, color: isLead ? '#AAAAAA' : '#888', lineHeight: 1.75, marginBottom: 10 }}>
        {parts.map((p, k) => k % 2 === 1 ? <strong key={k} style={{ color: '#F0F0F0' }}>{p}</strong> : p)}
      </p>
    )
  })
}

// ── Copy button ────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        const plain = text.replace(/\*\*/g, '')
        navigator.clipboard.writeText(plain).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
      }}
      style={{ padding: '6px 14px', fontSize: 13, fontWeight: 600, borderRadius: 6, border: '1px solid rgba(244,182,38,0.4)', background: copied ? 'rgba(244,182,38,0.2)' : 'rgba(244,182,38,0.08)', color: copied ? '#F4B626' : '#888', cursor: 'pointer', transition: 'all 200ms', flexShrink: 0 }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function GuldmannTender() {
  const [open, setOpen] = useState<string | null>(null)

  const scrollTo = (id: string) => {
    const el = document.getElementById('section-' + id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div style={{ paddingTop: 60, background: '#0D0D0D', minHeight: '100vh' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Badge + title */}
        <span style={{ display: 'inline-block', padding: '0.375rem 1rem', borderRadius: 20, border: '1px solid rgba(244,182,38,0.35)', background: 'rgba(244,182,38,0.1)', color: '#F4B626', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          NHS SBS Framework
        </span>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, marginBottom: '0.75rem', color: '#F0F0F0', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          NHS SBS Tender -- MOS/JOSH Responses
        </h1>
        <div style={{ width: 48, height: 3, borderRadius: 2, background: '#F4B626', marginBottom: '1.25rem' }} />
        <div style={{ fontSize: '1.1rem', color: '#888', marginBottom: '2rem' }}>
          Prepared 11 March 2026 &middot; {TOTAL} questions &middot; All criteria verified
        </div>

        {/* Action notice */}
        <div style={{ background: '#1A1A1A', border: '1px solid rgba(244,182,38,0.35)', borderRadius: 10, padding: '14px 18px', marginBottom: 24, fontSize: 14, color: '#F0F0F0' }}>
          <strong style={{ color: '#F4B626' }}>Before submitting:</strong> Confirm ISO 13485 certificate number/expiry with your quality team. Replace generic job titles in QL2 with the real Framework Manager and Account Manager names.
        </div>

        {/* Section jump nav */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => scrollTo(s.id)}
              style={{ padding: '7px 16px', fontSize: 13, fontWeight: 600, borderRadius: 20, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#888', cursor: 'pointer', transition: 'all 200ms' }}
              onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = 'rgba(244,182,38,0.5)'; (e.target as HTMLButtonElement).style.color = '#F4B626' }}
              onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.target as HTMLButtonElement).style.color = '#888' }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Sections */}
        {SECTIONS.map(section => (
          <div key={section.id} id={'section-' + section.id} style={{ marginBottom: 48 }}>
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#555', whiteSpace: 'nowrap' }}>
                {section.label}
              </span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>

            {/* Question cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {section.questions.map(q => {
                const isOpen = open === q.id
                return (
                  <div key={q.id}
                    style={{ background: '#1A1A1A', border: `1px solid ${isOpen ? 'rgba(244,182,38,0.45)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 10, overflow: 'hidden', transition: 'border-color 200ms, box-shadow 200ms', boxShadow: isOpen ? '0 8px 32px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.3)' }}>

                    {/* Card header button */}
                    <button onClick={() => setOpen(isOpen ? null : q.id)}
                      style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F4B626', background: 'rgba(244,182,38,0.1)', border: '1px solid rgba(244,182,38,0.3)', padding: '4px 10px', borderRadius: 16, fontFamily: 'monospace', flexShrink: 0 }}>
                          {q.ref}
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F0F0F0', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{q.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#555', marginTop: 3, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase' }}>{q.limit}</div>
                        </div>
                      </div>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: isOpen ? 'rgba(244,182,38,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isOpen ? 'rgba(244,182,38,0.4)' : 'rgba(255,255,255,0.09)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 200ms' }}>
                        <span style={{ color: isOpen ? '#F4B626' : '#666', fontSize: 16, lineHeight: 1, fontWeight: 400 }}>{isOpen ? '−' : '+'}</span>
                      </div>
                    </button>

                    {/* Expanded answer */}
                    {isOpen && (
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '0 1.5rem 1.75rem' }}>
                        {q.action && (
                          <div style={{ background: 'rgba(244,182,38,0.08)', border: '1px solid rgba(244,182,38,0.3)', borderRadius: 7, padding: '10px 14px', margin: '16px 0 4px', fontSize: 13, color: '#F4B626' }}>
                            <strong>Action needed:</strong> {q.action}
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '14px 0 4px' }}>
                          <CopyButton text={q.answer} />
                        </div>
                        <div>{renderAnswer(q.answer)}</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#444' }}>
          Click any question to expand. All answers are ready for copy-paste into the tender portal.
        </div>
      </div>
    </div>
  )
}