export interface RoleDefinition {
  id: string;
  name: string;
  podName: string;
  podSlug: string;
  summary: string;
  responsibilities: string[];
  qualifications: string[];
  pricingTiers: { level: 'Intermediate' | 'Professional'; range: string }[];
  type: string;
  schedule: string;
  location: string;
}

export const roles: RoleDefinition[] = [
  {
    id: 'client-success-specialist-medical-benefits',
    name: 'Client Success Specialist (Medical Benefits)',
    podName: 'Medical Benefits Pod',
    podSlug: 'administration',
    summary:
      'Handles payer outreach, preference checks, financial assistance, and cost estimates to keep benefits decisions aligned with appointments.',
    responsibilities: [
      'Benefit investigations',
      'Payer preference determination (Buy and Bill vs Specialty Pharmacy)',
      'Patient profile insurance maintenance',
      'Financial assistance enrollments',
      'Cost estimates',
      'Daily list monitoring',
      'Client communications'
    ],
    qualifications: [
      'Experience in medical benefits investigation and payer outreach',
      'Comfort communicating findings to clients and clinical teams',
      'Detail orientation for documenting coverage decisions'
    ],
    pricingTiers: [
      { level: 'Intermediate', range: '-' },
      { level: 'Professional', range: '$13/hour' }
    ],
    type: 'Virtual Assistant | Full-time Contract',
    schedule: 'Mon–Fri, 9:00 AM–5:00 PM U.S. Eastern',
    location: 'Remote'
  },
  {
    id: 'client-success-specialist-medical-benefits-remote',
    name: 'Client Success Specialist – Medical Benefits (Remote)',
    podName: 'Medical Benefits Pod',
    podSlug: 'administration',
    summary:
      'Completes benefit investigations, insurance maintenance, assistance enrollments, and cost estimates with updates tied to appointments.',
    responsibilities: [
      'Benefit investigations',
      'Patient profile insurance maintenance',
      'Financial assistance enrollments',
      'Cost estimates',
      'Daily list monitoring',
      'Client updates tied to appointments'
    ],
    qualifications: [
      'Experience coordinating benefits and patient communications remotely',
      'Ability to maintain insurance records with timely updates',
      'Proactive communication tied to visit schedules'
    ],
    pricingTiers: [
      { level: 'Intermediate', range: '-' },
      { level: 'Professional', range: '$13/hour' }
    ],
    type: 'Virtual Assistant | Full-time Contract',
    schedule: 'Mon–Fri, 9:00 AM–5:00 PM U.S. Eastern',
    location: 'Remote'
  },
  {
    id: 'clinical-nurse-coordinator',
    name: 'Clinical Nurse Coordinator',
    podName: 'Clinical Coordination Pod',
    podSlug: 'clinical-coordination',
    summary:
      'Provides clinical reviews, medication welcome calls, report-driven follow-ups, safety reporting, and scheduling governance with documentation.',
    responsibilities: [
      'Clinical reviews using medication guidelines',
      'Medication welcome calls',
      'Report review and follow-up coordination (MRI requests, hearing screenings, results routing)',
      'Adverse event reporting',
      'Schedule reviews and escalation',
      'WeInfuse and shift scheduling platform updates',
      'Clinical Quality Measures reporting support',
      'Documentation maintenance and task tracking'
    ],
    qualifications: [
      'Clinical background with experience coordinating patient care',
      'Comfort handling medication-specific education and safety reporting',
      'Organized documentation habits across clinical tools'
    ],
    pricingTiers: [
      { level: 'Intermediate', range: '-' },
      { level: 'Professional', range: '$13/hour' }
    ],
    type: 'Virtual Assistant | Full-time Contract',
    schedule: 'Mon–Fri, 9:00 AM–5:00 PM U.S. Eastern',
    location: 'Remote'
  },
  {
    id: 'virtual-assistant-clinical-nurse-coordinator',
    name: 'Virtual Assistant – Clinical Nurse Coordinator',
    podName: 'Clinical Coordination Pod',
    podSlug: 'clinical-coordination',
    summary:
      'Supports clinical coordination with reviews, welcome calls, follow-ups, safety documentation, schedule governance, and tracker management.',
    responsibilities: [
      'Clinical reviews',
      'Medication welcome calls',
      'Report-driven follow-ups',
      'Adverse event forms',
      'Schedule governance',
      'WeInfuse and shift scheduling platform updates',
      'Quality measure support',
      'Documentation maintenance and tracker-based workflow management'
    ],
    qualifications: [
      'Experience assisting clinical teams with documentation and follow-ups',
      'Ability to manage schedules and safety tasks in clinical settings',
      'Strong written communication for tracker-based workflows'
    ],
    pricingTiers: [
      { level: 'Intermediate', range: '-' },
      { level: 'Professional', range: '$13/hour' }
    ],
    type: 'Virtual Assistant | Full-time Contract',
    schedule: 'Mon–Fri, 9:00 AM–5:00 PM U.S. Eastern',
    location: 'Remote'
  },
  {
    id: 'order-entry-specialist',
    name: 'Order Entry Specialist (OES)',
    podName: 'Intake and Order Entry Pod',
    podSlug: 'front-office',
    summary:
      'Captures medication orders, demographics, insurance details, and documentation to keep EMR records accurate and ready.',
    responsibilities: [
      'Medication order intake and entry in EMR',
      'Demographic and insurance entry',
      'Documentation scanning and uploading',
      'Benefits investigations per new order',
      'Referral source follow-up for missing prior auth documentation',
      'Coordination with intake and finance including co-pay assistance enrollments'
    ],
    qualifications: [
      '1–2 years working in EMR systems for order entry',
      'Pharmacy-oriented background with strong attention to detail',
      'Customer service mindset for internal and external coordination'
    ],
    pricingTiers: [
      { level: 'Intermediate', range: '-' },
      { level: 'Professional', range: '$13/hour' }
    ],
    type: 'Virtual Assistant | Full-time Contract',
    schedule: 'Mon–Fri, 9:00 AM–5:00 PM U.S. Eastern',
    location: 'Remote'
  },
  {
    id: 'patient-claims-specialist',
    name: 'Patient Claims Specialist (PCS)',
    podName: 'Claims and AR Pod',
    podSlug: 'revenue-cycle',
    summary:
      'Tracks claims, resolves denials, posts payments, and manages patient billing with clear documentation and escalation.',
    responsibilities: [
      'Claim tracking and payer follow-up',
      'Denials and discrepancy resolution',
      'Aging report management',
      'Payment posting and reconciliation',
      'Patient billing and EOB support',
      'Weekly balance accuracy in R2',
      'Refunds and superbills',
      'Lucent coordination for estimate applications',
      'Statement management and leadership escalation for high-balance cases',
      'Documentation of collection activities and compliance with payer and coding updates'
    ],
    qualifications: [
      'Experience in medical billing, claims follow-up, and reconciliation',
      'Ability to manage aging reports with documented payer outreach',
      'Clear communication for patient billing support and escalations'
    ],
    pricingTiers: [
      { level: 'Intermediate', range: '-' },
      { level: 'Professional', range: '$15/hour' }
    ],
    type: 'Virtual Assistant | Full-time Contract',
    schedule: 'Mon–Fri, 9:00 AM–5:00 PM U.S. Eastern',
    location: 'Remote'
  },
  {
    id: 'executive-assistant',
    name: 'Executive Assistant',
    podName: 'Intake and Order Entry Pod',
    podSlug: 'front-office',
    summary: 'Supports leaders with coordination and communication for remote operations.',
    responsibilities: ['Details shared during screening'],
    qualifications: ['Details shared during screening'],
    pricingTiers: [
      { level: 'Intermediate', range: '-' },
      { level: 'Professional', range: '$13/hour' }
    ],
    type: 'Virtual Assistant | Full-time Contract',
    schedule: 'Mon–Fri, 9:00 AM–5:00 PM U.S. Eastern',
    location: 'Remote'
  }
];
