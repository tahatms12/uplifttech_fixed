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
    id: 'client-success-specialist',
    name: 'Client Success Specialist (Medical Benefits)',
    podName: 'Medical Benefits Pod',
    podSlug: 'administration',
    summary:
      'Handles benefit investigations, payer preferences, cost estimates, and client updates tied to appointments.',
    responsibilities: [
      'Benefit investigations via payer portals and phone outreach',
      'Determine payer preference for Buy and Bill vs Specialty Pharmacy',
      'Maintain accurate insurance details in patient profiles',
      'Verify financial assistance eligibility and complete enrollments',
      'Produce cost estimates and document investigations',
      'Monitor daily lists to keep estimates on schedule',
      'Communicate updates to clients, especially around upcoming appointments'
    ],
    qualifications: [
      'Experience in medical billing, coding, or benefits verification',
      'Knowledge of insurance benefits, financial assistance, and prior authorizations',
      'Strong communication, organization, and multitasking skills',
      'Ability to work efficiently in fast-paced environments with reliable connectivity'
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
      'Provides clinical reviews, patient education calls, schedule governance, and documentation support across sites.',
    responsibilities: [
      'Perform clinical reviews using medication guidelines',
      'Conduct medication welcome calls with education and schedule guidance',
      'Coordinate follow-ups from report reviews such as MRI requests and hearing screenings',
      'Complete adverse event reporting and required forms',
      'Run schedule reviews and escalate based on medication complexity',
      'Update WeInfuse and ShiftAdmin for staffing changes',
      'Maintain documentation and trackers, including Clinical Quality Measures support'
    ],
    qualifications: [
      'RN license or equivalent clinical certification with 3–5 years of experience',
      'Background in infusion therapy or specialty medication coordination',
      'Proficiency with EHRs, documentation, and patient education',
      'Organized communicator comfortable managing multiple clinical priorities'
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
      'Intake and enter medication orders within the EMR',
      'Capture demographics and insurance details accurately',
      'Scan and upload required documentation to patient records',
      'Run benefits investigations for each new order',
      'Follow up with referral sources for prior authorization documentation',
      'Coordinate with intake and finance, including co-pay assistance enrollments'
    ],
    qualifications: [
      '1–2 years working in EMR systems for order entry',
      'Pharmacy-oriented background with strong attention to detail',
      'Customer service mindset for internal and external coordination',
      'Ability to manage documentation, scanning, and insurance workflows'
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
      'Tracks claims, resolves denials, posts payments, and manages patient billing with clear documentation.',
    responsibilities: [
      'Track insurance claims and follow up with payers',
      'Resolve denials, discrepancies, and payment issues',
      'Prioritize aging reports and collection activities',
      'Post payments and reconcile to expected reimbursement',
      'Support patient billing questions, EOBs, refunds, and superbills',
      'Coordinate with billing tools to apply balances to estimates',
      'Document collection activities while staying current on payer updates'
    ],
    qualifications: [
      '1–2 years in medical billing or claims processing with knowledge of ICD-10',
      'Experience posting payments and reconciling against expected reimbursement',
      'Proficiency with billing software and strong attention to detail',
      'Clear communicator who can manage patient financial questions professionally'
    ],
    pricingTiers: [
      { level: 'Intermediate', range: '-' },
      { level: 'Professional', range: '$15/hour' }
    ],
    type: 'Virtual Assistant | Full-time Contract',
    schedule: 'Mon–Fri, 9:00 AM–5:00 PM U.S. Eastern',
    location: 'Remote'
  }
];
