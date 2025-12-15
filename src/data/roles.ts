export interface RoleSection {
  title: string;
  items: string[];
}

export interface RoleDefinition {
  id: string;
  title: string;
  name?: string;
  slug: string;
  serviceLine: 'Front Office' | 'Clinical and Care Coordination' | 'Revenue Cycle' | 'Operations';
  summary: string;
  employmentType: string;
  hours: string;
  location: string;
  overview: string;
  responsibilities: RoleSection[];
  qualifications: string[];
  technicalRequirements: string[];
  applyEmail: string;
}

export const roles: RoleDefinition[] = [
  {
    id: 'client-success-specialist',
    title: 'Client Success Specialist (Medical Benefits)',
    name: 'Client Success Specialist (Medical Benefits)',
    slug: 'client-success-specialist',
    serviceLine: 'Revenue Cycle',
    summary:
      'Handles benefit investigations, payer preferences, and assistance enrollments so benefit decisions are ready before appointments.',
    employmentType: 'Full-time Contract, Remote',
    hours: 'Mon to Fri, 9:00 AM to 5:00 PM U.S. Eastern',
    location: 'Remote',
    overview:
      'Client Success Specialists manage payer outreach, verify coverage details, and produce cost-ready benefit notes so clinics have clarity ahead of each visit.',
    responsibilities: [
      {
        title: 'Benefit Investigations',
        items: [
          'Complete payer checks through portals and phone outreach to confirm eligibility and preferences.',
          'Document Buy and Bill versus Specialty Pharmacy guidance for upcoming appointments.'
        ]
      },
      {
        title: 'Estimates and Assistance',
        items: [
          'Prepare cost estimate references with verified data and maintain supporting documentation.',
          'Review financial assistance eligibility and complete enrollments when qualified.'
        ]
      },
      {
        title: 'Communication and Tracking',
        items: [
          'Share updates with clinics tied to appointment timelines.',
          'Monitor daily worklists to keep benefits data current.'
        ]
      }
    ],
    qualifications: [
      'Experience in medical billing, coding, or benefits verification.',
      'Knowledge of insurance benefits, financial assistance, and prior authorizations.',
      'Clear written and verbal communication with strong organization.'
    ],
    technicalRequirements: [
      'Laptop (Company Provided)',
      'Headset (Company Provided)',
      'Minimum download speed of 30 Mbps',
      'Backup internet connection',
      'Wired ethernet connection preferred'
    ],
    applyEmail: 'hr@uplift-technologies.com'
  },
  {
    id: 'clinical-nurse-coordinator',
    title: 'Clinical Nurse Coordinator',
    name: 'Clinical Nurse Coordinator',
    slug: 'clinical-nurse-coordinator',
    serviceLine: 'Clinical and Care Coordination',
    summary:
      'Provides clinical reviews, patient education, and schedule governance with thorough documentation.',
    employmentType: 'Full-time Contract, Remote',
    hours: 'Mon to Fri, 9:00 AM to 5:00 PM U.S. Eastern',
    location: 'Remote',
    overview:
      'Clinical Nurse Coordinators deliver medication welcome calls, manage follow-ups from clinical reviews, and keep schedules aligned with provider standards.',
    responsibilities: [
      {
        title: 'Clinical Outreach',
        items: [
          'Complete medication welcome calls with education and schedule guidance.',
          'Coordinate follow-ups from report reviews including imaging and screenings.'
        ]
      },
      {
        title: 'Safety and Documentation',
        items: [
          'File adverse event forms on time and maintain clinical trackers.',
          'Update systems such as WeInfuse and ShiftAdmin to reflect staffing changes.'
        ]
      }
    ],
    qualifications: [
      'RN license or equivalent clinical certification with experience in infusion or specialty coordination.',
      'Proficiency with EHR documentation and patient education.',
      'Organized communicator comfortable managing multiple clinical priorities.'
    ],
    technicalRequirements: [
      'Laptop (Company Provided)',
      'Headset (Company Provided)',
      'Minimum download speed of 30 Mbps',
      'Backup internet connection',
      'Wired ethernet connection preferred'
    ],
    applyEmail: 'hr@uplift-technologies.com'
  },
  {
    id: 'order-entry-specialist',
    title: 'Order Entry Specialist (OES)',
    name: 'Order Entry Specialist (OES)',
    slug: 'order-entry-specialist',
    serviceLine: 'Front Office',
    summary:
      'Captures medication orders, demographics, insurance details, and documentation to keep records ready for review.',
    employmentType: 'Full-time Contract, Remote',
    hours: 'Mon to Fri, 9:00 AM to 5:00 PM U.S. Eastern',
    location: 'Remote',
    overview:
      'Order Entry Specialists intake orders, attach complete documentation, and coordinate benefit checks so prior authorization packages stay on track.',
    responsibilities: [
      {
        title: 'Order Intake',
        items: [
          'Enter medication orders, demographics, and insurance details according to site standards.',
          'Scan and upload required documentation to patient records.'
        ]
      },
      {
        title: 'Coordination',
        items: [
          'Run benefits investigations for new orders.',
          'Follow up with referral sources for missing authorization details.'
        ]
      }
    ],
    qualifications: [
      'Experience working in EMR systems for order entry.',
      'Pharmacy-oriented background with attention to detail.',
      'Customer service mindset for internal and external coordination.'
    ],
    technicalRequirements: [
      'Laptop (Company Provided)',
      'Headset (Company Provided)',
      'Minimum download speed of 30 Mbps',
      'Backup internet connection',
      'Wired ethernet connection preferred'
    ],
    applyEmail: 'hr@uplift-technologies.com'
  },
  {
    id: 'patient-claims-specialist',
    title: 'Patient Claims Specialist (PCS)',
    name: 'Patient Claims Specialist (PCS)',
    slug: 'patient-claims-specialist',
    serviceLine: 'Revenue Cycle',
    summary:
      'Tracks claims, resolves denials, posts payments, and manages patient billing with clear documentation.',
    employmentType: 'Full-time Contract, Remote',
    hours: 'Mon to Fri, 9:00 AM to 5:00 PM U.S. Eastern',
    location: 'Remote',
    overview:
      'Patient Claims Specialists prioritize aging reports, complete payer follow-up, and handle patient billing support while keeping documentation current.',
    responsibilities: [
      {
        title: 'Claims and Denials',
        items: [
          'Track claims and contact payers for status updates.',
          'Resolve denials and discrepancies with documented actions.'
        ]
      },
      {
        title: 'Billing Support',
        items: [
          'Post payments and reconcile against expectations.',
          'Handle patient questions about balances, refunds, and statements.'
        ]
      }
    ],
    qualifications: [
      'Experience in medical billing or claims processing.',
      'Proficiency with billing software and attention to detail.',
      'Clear communicator who can address patient financial questions professionally.'
    ],
    technicalRequirements: [
      'Laptop (Company Provided)',
      'Headset (Company Provided)',
      'Minimum download speed of 30 Mbps',
      'Backup internet connection',
      'Wired ethernet connection preferred'
    ],
    applyEmail: 'hr@uplift-technologies.com'
  },
  {
    id: 'patient-accounts-receivable-specialist',
    title: 'Patient Accounts Receivable Specialist',
    name: 'Patient Accounts Receivable Specialist',
    slug: 'patient-accounts-receivable-specialist',
    serviceLine: 'Revenue Cycle',
    summary:
      'Handles patient-facing collections and billing follow-up to close outstanding balances with clear documentation.',
    employmentType: 'Full-time Contract, Remote',
    hours: 'Mon to Fri, 9:00 AM to 5:00 PM U.S. Eastern',
    location: 'Remote',
    overview:
      'The Patient Accounts Receivable Specialist performs outbound patient contact, resolves billing questions, sets up approved payment arrangements, and keeps accurate notes in client billing systems to drive timely collections.',
    responsibilities: [
      {
        title: 'Patient Balance Collections',
        items: [
          'Contact patients via approved channels to reduce aged receivables.',
          'Explain statements, charges, and payment options while addressing objections respectfully.',
          'Set up and track payment plans when approved with documented commitments.'
        ]
      },
      {
        title: 'Accounts Review and Follow-up',
        items: [
          'Monitor assigned worklists and prioritize by aging and thresholds.',
          'Maintain complete account notes including attempts, responses, and next actions.'
        ]
      },
      {
        title: 'Service and Compliance',
        items: [
          'Handle inbound patient billing questions while protecting PHI and following client policies.',
          'Coordinate with insurance and billing teams to clarify coverage issues that affect patient responsibility.'
        ]
      }
    ],
    qualifications: [
      'Experience in healthcare accounts receivable, patient collections, or medical billing.',
      'Ability to explain statements and payment options clearly with confident phone presence.',
      'Familiarity with insurance concepts that impact patient responsibility is preferred.'
    ],
    technicalRequirements: [
      'Laptop (Company Provided)',
      'Headset (Company Provided)',
      'Minimum download speed of 30 Mbps',
      'Backup internet connection',
      'Wired ethernet connection preferred'
    ],
    applyEmail: 'hr@uplift-technologies.com'
  },
  {
    id: 'executive-assistant',
    title: 'Executive Assistant',
    name: 'Executive Assistant',
    slug: 'executive-assistant',
    serviceLine: 'Operations',
    summary:
      'Provides administrative and operational support to senior leadership with reliable follow-through.',
    employmentType: 'Full-time Contract, Remote',
    hours: 'Mon to Fri, 9:00 AM to 5:00 PM U.S. Eastern',
    location: 'Remote',
    overview:
      'The Executive Assistant owns calendars, meeting coordination, inbox triage, document preparation, and follow-through on action items across workstreams while operating with high discretion.',
    responsibilities: [
      {
        title: 'Calendar and Meetings',
        items: [
          'Manage calendars, schedule meetings, and coordinate attendees across time zones.',
          'Prepare agendas, capture notes, and track action items to completion.'
        ]
      },
      {
        title: 'Communication and Admin Support',
        items: [
          'Triage email and messages and route requests to the right owner.',
          'Create and format documents, spreadsheets, and simple presentations.'
        ]
      },
      {
        title: 'Operations Support',
        items: [
          'Prepare expense reports and maintain administrative trackers.',
          'Support light project coordination including vendor coordination and task tracking.'
        ]
      }
    ],
    qualifications: [
      'Experience as an Executive Assistant, Administrative Assistant, or equivalent support role.',
      'Strong written English, organization, and time management with minimal direction.',
      'Proficiency with Google Workspace or Microsoft Office and comfort with task trackers.'
    ],
    technicalRequirements: [
      'Laptop (Company Provided)',
      'Headset (Company Provided)',
      'Minimum download speed of 30 Mbps',
      'Backup internet connection',
      'Wired ethernet connection preferred'
    ],
    applyEmail: 'hr@uplift-technologies.com'
  },
  {
    id: 'medical-scribe-mbbs',
    title: 'Medical Scribe (MBBS)',
    name: 'Medical Scribe (MBBS)',
    slug: 'medical-scribe-mbbs',
    serviceLine: 'Clinical and Care Coordination',
    summary:
      'Documents patient encounters accurately in the EHR and keeps charts structured for provider review.',
    employmentType: 'Full-time Contract, Remote',
    hours: 'Mon to Fri, 9:00 AM to 5:00 PM U.S. Eastern',
    location: 'Remote',
    overview:
      'The Medical Scribe captures histories, exam elements, assessments, and plans in the EHR in real time and ensures charts are complete while maintaining strict confidentiality. This role requires an MBBS degree and disciplined documentation.',
    responsibilities: [
      {
        title: 'Clinical Documentation',
        items: [
          'Document patient encounters including history, exam findings, diagnostics, assessment, and plan in the EHR.',
          'Prepare charts before visits by organizing relevant history and results.',
          'Update problem lists, medications, allergies, and past history as directed by the provider.'
        ]
      },
      {
        title: 'Quality and Compliance',
        items: [
          'Maintain confidentiality and follow HIPAA-aligned documentation standards.',
          'Ensure notes are legible, structured, and audit-ready with correct medical terminology.'
        ]
      }
    ],
    qualifications: [
      'MBBS required with strong clinical documentation discipline.',
      'Prior experience as a medical scribe or in clinical documentation preferred.',
      'Excellent written English and fast, accurate typing for real-time documentation.'
    ],
    technicalRequirements: [
      'Laptop (Company Provided)',
      'Headset (Company Provided)',
      'Minimum download speed of 30 Mbps',
      'Backup internet connection',
      'Wired ethernet connection preferred'
    ],
    applyEmail: 'hr@uplift-technologies.com'
  }
];

export const rolesBySlug = Object.fromEntries(roles.map((role) => [role.slug, role]));
export const rolesById = Object.fromEntries(roles.map((role) => [role.id, role]));
