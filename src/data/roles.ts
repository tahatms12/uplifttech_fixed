export interface RoleSectionGroup {
  title: string;
  items: string[];
}

export interface RoleDefinition {
  id: string;
  title: string;
  shortTitle?: string;
  slug: string;
  serviceLine: 'Front Office' | 'Clinical and Care Coordination' | 'Revenue Cycle' | 'Operations';
  hourlyRates?: { intermediate: number; professional: number };
  summary: string;
  employmentType: string;
  hours: string;
  pricingTiers?: { level: string; range: string }[];
  sections: {
    overview: string;
    responsibilities: RoleSectionGroup[];
    qualifications: string[];
    technicalRequirements: string[];
    equalOpportunity: string;
    applyEmail: string;
  };
}

const equalOpportunity = 'We are an Equal Opportunity Employer and committed to creating an inclusive environment for all employees.';
const applyEmail = 'hr@uplift-technologies.com';
export const defaultHourlyRates = {
  intermediate: 10.25,
  professional: 13
};

export const medicalScribeHourlyRates = {
  intermediate: 11,
  professional: 14
};

const formatRate = (rate: number) => `$${rate.toFixed(2)}`;

const createPricingTiers = (rates = defaultHourlyRates) => [
  { level: 'Intermediate', range: formatRate(rates.intermediate) },
  { level: 'Professional', range: formatRate(rates.professional) }
];

export const roles: RoleDefinition[] = [
  {
    id: 'client-success-specialist',
    title: 'Client Success Specialist (Medical Benefits)',
    slug: 'client-success-specialist',
    serviceLine: 'Revenue Cycle',
    hourlyRates: defaultHourlyRates,
    summary: 'Handles benefit investigations, payer preferences, and enrollment support so cost guidance is ready ahead of appointments.',
    employmentType: 'Full-time Contract, Remote',
    hours: 'Mon to Fri, 9:00 AM to 5:00 PM U.S. Eastern',
    pricingTiers: createPricingTiers(),
    sections: {
      overview:
        'Client Success Specialists manage payer outreach, verify coverage details, and produce cost-ready benefit notes so clinics have clarity before each visit.',
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
      equalOpportunity,
      applyEmail
    }
  },
  {
    id: 'clinical-nurse-coordinator',
    title: 'Clinical Nurse Coordinator',
    slug: 'clinical-nurse-coordinator',
    serviceLine: 'Clinical and Care Coordination',
    hourlyRates: defaultHourlyRates,
    summary: 'Provides clinical reviews, patient education, and schedule governance with thorough documentation.',
    employmentType: 'Full-time Contract, Remote',
    hours: 'Mon to Fri, 9:00 AM to 5:00 PM U.S. Eastern',
    pricingTiers: createPricingTiers(),
    sections: {
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
            'Update systems to reflect staffing changes and review outcomes.'
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
      equalOpportunity,
      applyEmail
    }
  },
  {
    id: 'order-entry-specialist',
    title: 'Order Entry Specialist (OES)',
    slug: 'order-entry-specialist',
    serviceLine: 'Front Office',
    hourlyRates: defaultHourlyRates,
    summary: 'Captures medication orders, demographics, insurance details, and documentation to keep records ready for review.',
    employmentType: 'Full-time Contract, Remote',
    hours: 'Mon to Fri, 9:00 AM to 5:00 PM U.S. Eastern',
    pricingTiers: createPricingTiers(),
    sections: {
      overview:
        'Order Entry Specialists intake orders, attach complete documentation, and coordinate benefit checks so authorization packages stay on track.',
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
      equalOpportunity,
      applyEmail
    }
  },
  {
    id: 'patient-claims-specialist',
    title: 'Patient Claims Specialist (PCS)',
    slug: 'patient-claims-specialist',
    serviceLine: 'Revenue Cycle',
    hourlyRates: defaultHourlyRates,
    summary: 'Tracks claims, resolves denials, posts payments, and manages patient billing with clear documentation.',
    employmentType: 'Full-time Contract, Remote',
    hours: 'Mon to Fri, 9:00 AM to 5:00 PM U.S. Eastern',
    pricingTiers: createPricingTiers(),
    sections: {
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
            'Handle patient questions about balances and statements with clear notes.'
          ]
        }
      ],
      qualifications: [
        'Experience in medical billing or claims processing.',
        'Proficiency with billing software and attention to detail.',
        'Clear communicator able to address patient financial questions professionally.'
      ],
      technicalRequirements: [
        'Laptop (Company Provided)',
        'Headset (Company Provided)',
        'Minimum download speed of 30 Mbps',
        'Backup internet connection',
        'Wired ethernet connection preferred'
      ],
      equalOpportunity,
      applyEmail
    }
  },
  {
    id: 'patient-accounts-receivable-specialist',
    title: 'Patient Accounts Receivable Specialist',
    slug: 'patient-accounts-receivable-specialist',
    serviceLine: 'Revenue Cycle',
    hourlyRates: defaultHourlyRates,
    summary: 'Handles patient-facing collections and billing follow-up to close outstanding balances with clear documentation.',
    employmentType: 'Full-time Contract, Remote',
    hours: 'Mon to Fri, 9:00 AM to 5:00 PM U.S. Eastern',
    pricingTiers: createPricingTiers(),
    sections: {
      overview:
        'The Patient Accounts Receivable Specialist performs outbound patient contact, resolves billing questions, sets up approved payment arrangements, and keeps accurate notes in client billing systems to drive timely collections.',
      responsibilities: [
        {
          title: 'Patient Balance Collections',
          items: [
            'Contact patients via approved channels to reduce aged receivables.',
            'Explain statements, charges, and payment options while addressing objections respectfully.',
            'Set up and track approved payment plans with documented commitments.'
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
        '1 to 3+ years experience in healthcare AR, patient collections, or medical billing with patient balance outreach.',
        'Ability to explain charges, statements, and payment options clearly with confident phone presence.',
        'Familiarity with insurance concepts that impact patient responsibility is preferred.'
      ],
      technicalRequirements: [
        'Laptop (Company Provided)',
        'Headset (Company Provided)',
        'Minimum download speed of 30 Mbps',
        'Backup internet connection',
        'Wired ethernet connection preferred'
      ],
      equalOpportunity,
      applyEmail
    }
  },
  {
    id: 'executive-assistant',
    title: 'Executive Assistant',
    slug: 'executive-assistant',
    serviceLine: 'Operations',
    hourlyRates: defaultHourlyRates,
    summary: 'Provides administrative and operational support to senior leadership with reliable follow-through.',
    employmentType: 'Full-time Contract, Remote',
    hours: 'Mon to Fri, 9:00 AM to 5:00 PM U.S. Eastern',
    pricingTiers: createPricingTiers(),
    sections: {
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
        '2+ years experience as an Executive Assistant, Administrative Assistant, or equivalent support role.',
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
      equalOpportunity,
      applyEmail
    }
  },
  {
    id: 'medical-scribe-mbbs',
    title: 'Medical Scribe (MBBS)',
    slug: 'medical-scribe-mbbs',
    serviceLine: 'Clinical and Care Coordination',
    hourlyRates: medicalScribeHourlyRates,
    summary: 'Documents patient encounters accurately in the EHR and keeps charts structured for provider review.',
    employmentType: 'Full-time Contract, Remote',
    hours: 'Mon to Fri, 9:00 AM to 5:00 PM U.S. Eastern',
    pricingTiers: createPricingTiers(medicalScribeHourlyRates),
    sections: {
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
            'Ensure notes are structured and audit-ready with correct medical terminology.'
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
      equalOpportunity,
      applyEmail
    }
  },
  {
    id: 'accounts-receivable-executive-patient-balance-collections',
    title: 'Accounts Receivable Executive (Patient Balance Collections)',
    shortTitle: 'AR Patient Collections',
    slug: 'accounts-receivable-executive-patient-balance-collections',
    serviceLine: 'Revenue Cycle',
    hourlyRates: defaultHourlyRates,
    summary:
      'Responsible for outbound patient balance outreach, resolving billing questions, arranging payments, and keeping meticulous documentation to accelerate collections.',
    employmentType: 'Full-time Contract, Remote',
    hours: 'Mon to Fri, 9:00 AM to 5:00 PM U.S. Eastern',
    pricingTiers: createPricingTiers(),
    sections: {
      overview:
        'The Accounts Receivable Executive is responsible for patient-facing collections and follow-up to close outstanding patient balances. This role focuses on outbound patient contact, resolving billing questions, setting up payment arrangements, and maintaining accurate notes and follow-up activity in the client’s billing system. Core expectations include disciplined call cadence, clear documentation, and professional, compliant communication while driving timely collections.',
      responsibilities: [
        {
          title: 'Patient Balance Collections',
          items: [
            'Contact patients via phone and approved channels to collect outstanding balances and reduce aged AR.',
            'Explain statements, charges, and payment options; address common billing objections and escalate complex disputes per workflow.',
            'Set up and track payment plans when approved; document commitments, due dates, and outcomes in the billing system.',
            'Take payments securely using approved tools, ensure accurate posting references, and route issues to the correct internal team.'
          ]
        },
        {
          title: 'Accounts Review, Documentation, and Follow-up',
          items: [
            'Monitor assigned patient AR worklists, prioritize by aging and balance thresholds, and execute follow-up steps consistently.',
            'Maintain complete account notes including contact attempts, patient responses, and next actions to keep an auditable record.',
            'Coordinate with insurance and billing teams as needed to clarify coverage, denials, or account discrepancies that impact patient responsibility.'
          ]
        },
        {
          title: 'Service and Compliance',
          items: [
            'Handle inbound patient billing questions professionally, with empathy and firmness, while protecting PHI and following client policies.'
          ]
        }
      ],
      qualifications: [
        '1 to 3+ years experience in healthcare AR, patient collections, or medical billing with patient balance outreach.',
        'Strong ability to explain charges, statements, and payment options clearly; confident phone presence and objection handling.',
        'Experience working in practice management systems or billing platforms; accurate, detailed documentation habits.',
        'Familiarity with insurance concepts that impact patient responsibility (eligibility, EOBs, denials) is preferred.'
      ],
      technicalRequirements: [
        'Laptop (Company Provided)',
        'Headset (Company Provided)',
        'Minimum download speed of 30 Mbps',
        'Backup internet connection',
        'Wired (Ethernet) connection preferred for dedicated bandwidth'
      ],
      equalOpportunity,
      applyEmail
    }
  }
];

export const rolesBySlug = Object.fromEntries(roles.map((role) => [role.slug, role]));
export const rolesById = Object.fromEntries(roles.map((role) => [role.id, role]));
