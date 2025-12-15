import { roles } from './roles';

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

const roleMap = Object.fromEntries(roles.map((role) => [role.id, role]));

export const pods: PodDefinition[] = [
  {
    slug: 'administration',
    title: 'Medical Benefits Pod',
    segmentLabel: 'Medical Benefits Pod',
    summary:
      'Client Success Specialists manage benefit investigations, payer preferences, assistance enrollments, and cost estimates before every appointment.',
    longDescription:
      'Our Medical Benefits Pod keeps eligibility, payer preferences, and cost estimates current through structured investigations and proactive communication. Specialists document findings, complete assistance enrollments, and align updates with appointment timelines so decisions stay clear for patients and providers.',
    features: [
      'Benefit investigations through portals and payer calls',
      'Payer preference checks for Buy and Bill vs Specialty Pharmacy',
      'Financial assistance eligibility reviews and enrollments',
      'Cost estimate creation with documented reference details',
      'Daily list monitoring to keep estimates current',
      'Client communication tied to appointment timelines'
    ],
    benefits: [
      {
        title: 'Accurate Coverage Decisions',
        description: 'Insurance details, payer preferences, and assistance options are confirmed before patients arrive.'
      },
      {
        title: 'Predictable Estimates',
        description: 'Cost estimates and documentation stay aligned with the latest benefits investigations.'
      },
      {
        title: 'Clear Client Updates',
        description: 'Stakeholders receive timely notifications on benefit status connected to upcoming appointments.'
      }
    ],
    process: [
      {
        title: 'Benefit Intake & Verification',
        description: 'Specialists submit and track benefit investigations via portals and phone outreach with documented references.'
      },
      {
        title: 'Assistance & Estimate Prep',
        description: 'Financial assistance eligibility is checked, enrollments are completed, and cost estimates are drafted from verified data.'
      },
      {
        title: 'Documentation & Communication',
        description: 'Findings are recorded in patient profiles and shared with clients, including updates tied to appointment timelines.'
      },
      {
        title: 'Ongoing Monitoring',
        description: 'Daily lists are reviewed to keep estimates current and respond quickly to new requests.'
      }
    ],
    imageSrc: 'https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U48KsDMQ73cbMY8IewBXDN1uCftWjJZ5Rlhyg0G',
    roleIds: [
      'client-success-specialist-medical-benefits',
      'client-success-specialist-medical-benefits-remote'
    ]
  },
  {
    slug: 'clinical-coordination',
    title: 'Clinical Coordination Pod',
    segmentLabel: 'Clinical Coordination Pod',
    summary:
      'Clinical Nurse Coordinators deliver medication reviews, patient education calls, schedule governance, and tracker-based documentation.',
    longDescription:
      'Our Clinical Coordination Pod provides clinical coverage that keeps schedules organized and patients informed. Coordinators complete medication welcome calls, route follow-ups from reports, file safety forms, and keep WeInfuse and scheduling headers updated so providers work from accurate calendars.',
    features: [
      'Medication welcome calls covering schedules, side effects, and questions',
      'Clinical reviews that follow medication-specific guidelines',
      'Follow-up coordination from reports, MRI requests, and hearing screenings',
      'Adverse event reporting with on-time form completion',
      'Biweekly schedule reviews with escalation paths',
      'WeInfuse and shift scheduling platform updates',
      'Clinical documentation maintenance and tracker updates'
    ],
    benefits: [
      {
        title: 'Consistent Clinical Follow-Through',
        description: 'Report reviews, follow-up requests, and adverse events are handled with documented steps.'
      },
      {
        title: 'Prepared Patients',
        description: 'Welcome calls set expectations for medications, infusion schedules, and side effects.'
      },
      {
        title: 'Governed Schedules',
        description: 'Regular reviews and updates to clinical tools keep provider calendars accurate.'
      }
    ],
    process: [
      {
        title: 'Medication Review & Outreach',
        description: 'Coordinators complete clinical reviews and welcome calls using medication guidelines.'
      },
      {
        title: 'Follow-Up Coordination',
        description: 'MRI requests, hearing screenings, and report-driven actions are routed and tracked.'
      },
      {
        title: 'Safety & Escalation',
        description: 'Adverse events are documented promptly with escalation based on medication complexity.'
      },
      {
        title: 'Schedule Governance',
        description: 'Biweekly reviews and header updates keep WeInfuse and scheduling tools aligned to staffing changes.'
      }
    ],
    imageSrc: 'https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U48umk0e7rzSVUAW58LFw0OdkaCEGun9vJTQ37M',
    roleIds: ['clinical-nurse-coordinator', 'virtual-assistant-clinical-nurse-coordinator']
  },
  {
    slug: 'front-office',
    title: 'Intake and Order Entry Pod',
    segmentLabel: 'Intake and Order Entry Pod',
    summary:
      'Order Entry Specialists and Executive Assistants keep medication orders, documentation, and executive coordination moving without bottlenecks.',
    longDescription:
      'Our Intake and Order Entry Pod streamlines how orders and leadership tasks move into your EMR and workflows. Specialists capture demographics and insurance, scan and upload documentation, coordinate benefits investigations for new orders, and follow up with referral sources. Executive Assistants support leaders with scheduling, communication, and organized handoffs.',
    features: [
      'Medication order intake and accurate EMR entry',
      'Demographic and insurance data capture',
      'Scanning and uploading of required documentation',
      'Benefits investigations attached to each new order',
      'Referral follow-up for missing prior authorization details',
      'Leadership support with scheduling and coordinated communication'
    ],
    benefits: [
      {
        title: 'Complete Orders Ready for Review',
        description: 'Orders arrive with demographics, insurance, and documentation attached in the EMR.'
      },
      {
        title: 'Faster Authorization Prep',
        description: 'Benefit checks and referral follow-ups reduce delays in prior authorization workflows.'
      },
      {
        title: 'Coordinated Handoffs',
        description: 'Collaboration across intake, finance, and leadership keeps critical updates aligned.'
      }
    ],
    process: [
      {
        title: 'Order Intake & Verification',
        description: 'New orders, demographics, and insurance details are entered according to location standards.'
      },
      {
        title: 'Documentation Capture',
        description: 'Required paperwork is scanned, uploaded, and linked to patient records.'
      },
      {
        title: 'Benefit Investigation',
        description: 'Coverage is verified for each order to confirm readiness for next steps.'
      },
      {
        title: 'Executive Support',
        description: 'Scheduling, communications, and tracker upkeep are coordinated for leadership visibility.'
      }
    ],
    imageSrc: 'https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhrgCOWBl9pUNhrWouxqs4lZ1DIam2i9Jv0zHyt',
    roleIds: ['order-entry-specialist', 'executive-assistant']
  },
  {
    slug: 'revenue-cycle',
    title: 'Claims and AR Pod',
    segmentLabel: 'Claims and AR Pod',
    summary:
      'Patient Claims Specialists track claims, resolve denials, manage payments, and support patient billing with documented follow-up.',
    longDescription:
      'The Claims and AR Pod focuses on clean claims follow-up and patient-friendly billing. Specialists prioritize aging reports, call payers for status updates, post and reconcile payments, and manage statements, refunds, and superbills while keeping documentation current.',
    features: [
      'Claims tracking with payer follow-up and documentation',
      'Denial and discrepancy resolution tied to aging reports',
      'Payment posting and reconciliation to expected reimbursement',
      'Patient billing support for EOBs, refunds, and superbills',
      'Balance accuracy in R2 with statement management and escalation',
      'Coordination with billing tools to apply balances to estimates'
    ],
    benefits: [
      {
        title: 'Recovered Revenue',
        description: 'Structured claim follow-up reduces denials and accelerates collections.'
      },
      {
        title: 'Transparent Patient Billing',
        description: 'Patients receive clear answers on balances, EOBs, refunds, and superbills.'
      },
      {
        title: 'Documented Compliance',
        description: 'Collection activities and payer updates are recorded for reliable reporting.'
      }
    ],
    process: [
      {
        title: 'Claim Intake & Tracking',
        description: 'Claims are monitored with payer outreach and notes for each follow-up.'
      },
      {
        title: 'Denial Resolution & Posting',
        description: 'Discrepancies are worked, payments are posted, and reconciliations are completed.'
      },
      {
        title: 'Patient Billing Support',
        description: 'Patient questions, refunds, and superbills are handled with documented responses.'
      },
      {
        title: 'Reporting & Escalation',
        description: 'Aging, balance accuracy, and high-value cases are surfaced to leadership with recommendations.'
      }
    ],
    imageSrc: 'https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U48KsDMQ73cbMY8IewBXDN1uCftWjJZ5Rlhyg0G',
    roleIds: ['patient-claims-specialist']
  }
];

export const podBySlug = Object.fromEntries(pods.map((pod) => [pod.slug, pod]));
export const rolesById = roleMap;
