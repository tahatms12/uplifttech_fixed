import { rolesById } from './roles';

export interface PodDefinition {
  slug: string;
  title: string;
  segmentLabel: string;
  summary: string;
  longDescription: string;
  features: string[];
  benefits: { title: string; description: string }[];
  process: { title: string; description: string }[];
  imageSrc: string;
  roleIds: string[];
}

export const pods: PodDefinition[] = [
  {
    slug: 'administration',
    title: 'Medical Benefits Pod',
    segmentLabel: 'Medical Benefits Pod',
    summary:
      'Client Success Specialists verify coverage, assistance options, and payer preferences so clinics have clear guidance before visits.',
    longDescription:
      'Our Medical Benefits Pod keeps eligibility, payer preferences, and assistance decisions current through structured benefit investigations. Specialists work directly in payer portals and by phone to document findings, prepare estimate references, and keep clinics informed.',
    features: [
      'Benefit investigations through portals and payer calls',
      'Payer preference checks for Buy and Bill versus Specialty Pharmacy',
      'Financial assistance eligibility reviews and enrollments',
      'Cost estimate references with documented sources',
      'Daily list monitoring tied to upcoming appointments',
      'Clinic updates aligned to scheduling needs'
    ],
    benefits: [
      {
        title: 'Accurate Coverage Decisions',
        description: 'Insurance details, preferences, and assistance notes are confirmed before patients arrive.'
      },
      {
        title: 'Prepared Appointments',
        description: 'Clinics receive benefit outcomes tied to appointment timelines for smoother visits.'
      },
      {
        title: 'Documented Evidence',
        description: 'Each investigation is logged for easy review and follow-up.'
      }
    ],
    process: [
      { title: 'Benefit Intake', description: 'Investigations are submitted and tracked with payer references.' },
      { title: 'Assistance Review', description: 'Eligibility is checked and enrollments are completed when approved.' },
      { title: 'Estimate Support', description: 'Coverage findings feed into cost estimate references for clinics.' },
      { title: 'Ongoing Monitoring', description: 'Lists are reviewed daily to keep data current.' }
    ],
    imageSrc: 'https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U48KsDMQ73cbMY8IewBXDN1uCftWjJZ5Rlhyg0G',
    roleIds: ['client-success-specialist']
  },
  {
    slug: 'clinical-coordination',
    title: 'Clinical Coordination Pod',
    segmentLabel: 'Clinical Coordination Pod',
    summary: 'Clinical teams provide welcome calls, documentation, and charting support for providers.',
    longDescription:
      'Our Clinical Coordination Pod delivers clinical outreach, chart preparation, and documentation support so providers can focus on care. Coordinators and scribes manage welcome calls, follow-ups from clinical reviews, and complete structured notes inside the EHR.',
    features: [
      'Medication welcome calls with education and schedules',
      'Follow-ups from report reviews and ordered screenings',
      'Adverse event documentation and escalation paths',
      'EHR-ready charting with accurate histories and plans',
      'Schedule governance with updates to clinical tools'
    ],
    benefits: [
      { title: 'Prepared Patients', description: 'Patients receive clear guidance and expectations before appointments.' },
      { title: 'Accurate Charts', description: 'Notes stay structured, legible, and ready for provider review.' },
      { title: 'Documented Safety', description: 'Events and follow-ups are tracked with escalation steps.' }
    ],
    process: [
      { title: 'Clinical Review', description: 'Welcome calls and medication guidance follow defined protocols.' },
      { title: 'Documentation', description: 'EHR entries capture histories, exam elements, and plans accurately.' },
      { title: 'Follow-Up', description: 'Ordered actions and screenings are tracked through completion.' },
      { title: 'Schedule Governance', description: 'Clinical tools are updated to match staffing and visit needs.' }
    ],
    imageSrc: 'https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U48umk0e7rzSVUAW58LFw0OdkaCEGun9vJTQ37M',
    roleIds: ['clinical-nurse-coordinator', 'medical-scribe-mbbs']
  },
  {
    slug: 'front-office',
    title: 'Intake and Order Entry Pod',
    segmentLabel: 'Intake and Order Entry Pod',
    summary: 'Order Entry Specialists and support staff keep demographics, insurance, and documentation complete inside your systems.',
    longDescription:
      'The Intake and Order Entry Pod streamlines how orders move into your records. Specialists capture demographics and insurance, upload documentation, coordinate benefit checks, and follow up with referral sources so authorizations stay on track.',
    features: [
      'Medication order intake with accurate EMR entry',
      'Demographic and insurance capture for each order',
      'Scanning and uploading of required documentation',
      'Benefits investigations linked to new orders',
      'Referral follow-up for missing authorization details',
      'Administrative support for leadership scheduling and documentation'
    ],
    benefits: [
      { title: 'Complete Orders', description: 'Demographics, insurance, and documents are attached before review.' },
      { title: 'Faster Prep', description: 'Benefit checks reduce delays in authorization workflows.' },
      { title: 'Coordinated Support', description: 'Executive support keeps leadership calendars and documentation organized.' }
    ],
    process: [
      { title: 'Order Capture', description: 'New orders and required details are entered according to site standards.' },
      { title: 'Documentation', description: 'Paperwork is scanned, uploaded, and linked to patient records.' },
      { title: 'Benefit Verification', description: 'Coverage is confirmed for each new order.' },
      { title: 'Administrative Support', description: 'Scheduling, note taking, and follow-up tasks are managed for leaders.' }
    ],
    imageSrc: 'https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhrgCOWBl9pUNhrWouxqs4lZ1DIam2i9Jv0zHyt',
    roleIds: ['order-entry-specialist', 'executive-assistant']
  },
  {
    slug: 'revenue-cycle',
    title: 'Claims and AR Pod',
    segmentLabel: 'Claims and AR Pod',
    summary: 'Claims and patient billing coverage including denials, payment posting, and patient-facing collections.',
    longDescription:
      'The Claims and AR Pod focuses on clean claims follow-up and patient-friendly billing. Specialists prioritize aging reports, contact payers, reconcile payments, and manage statements while handling patient outreach with clear documentation.',
    features: [
      'Claims tracking with payer follow-up',
      'Denial resolution tied to aging reports',
      'Payment posting and reconciliation',
      'Patient billing support and statements',
      'Patient outreach for balances and payment plans',
      'Documented notes for reporting'
    ],
    benefits: [
      { title: 'Recovered Revenue', description: 'Structured claim follow-up reduces denials and delays.' },
      { title: 'Clear Patient Billing', description: 'Patients receive clear answers on balances and arrangements.' },
      { title: 'Documented Actions', description: 'All outreach and resolutions are logged for review.' }
    ],
    process: [
      { title: 'Claim Intake', description: 'Claims are monitored with payer outreach and notes for each step.' },
      { title: 'Resolution', description: 'Discrepancies are worked and payments are reconciled.' },
      { title: 'Patient Support', description: 'Statements, refunds, and balance questions are handled professionally.' },
      { title: 'Reporting', description: 'Aging, balance accuracy, and escalations are shared with leadership.' }
    ],
    imageSrc: 'https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U48KsDMQ73cbMY8IewBXDN1uCftWjJZ5Rlhyg0G',
    roleIds: ['patient-claims-specialist', 'patient-accounts-receivable-specialist']
  }
];

export const podBySlug = Object.fromEntries(pods.map((pod) => [pod.slug, pod]));
export const rolesByPod = (pod: PodDefinition) => pod.roleIds.map((id) => rolesById[id]).filter(Boolean);
