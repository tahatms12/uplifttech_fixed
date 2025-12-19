export interface PodDefinition {
  slug: string;
  title: string;
  heroTitle: string;
  segmentLabel: string;
  summary: string;
  longDescription: string;
  features: string[];
  roles: { title: string; description: string }[];
  benefits: { title: string; description: string }[];
  process: { title: string; description: string }[];
  imageSrc: string;
}

export const pods: PodDefinition[] = [
  {
    slug: 'front-office',
    title: 'Front Office Support',
    heroTitle: 'Front office support',
    segmentLabel: 'Front Office Support',
    summary:
      'Specialists handle intake, demographics and insurance capture, benefits eligibility investigations, cost estimates, and order entry so teams stay prepared.',
    longDescription:
      'Our front-office support teams handle intake, demographics and insurance capture, benefits and eligibility investigations, cost estimate preparation and order entry. Specialists work directly in payer portals, EMR and communication systems to ensure data is captured accurately and authorizations stay on track.',
    features: [
      'Capturing patient demographics and insurance',
      'Verifying benefits and eligibility',
      'Preparing cost estimates',
      'Medication and order intake with accurate EMR entry',
      'Scanning and uploading documentation',
      'Coordinating benefits checks tied to new orders',
      'Following up with referral sources and scheduling',
      'Supporting leadership with administrative tasks'
    ],
    roles: [
      {
        title: 'Patient Coordinator',
        description:
          'Patient Coordinators manage intake workflows, demographics capture, and scheduling communication so appointments stay aligned to clinic protocols.'
      },
      {
        title: 'Client Success Specialist',
        description:
          'Client Success Specialists verify benefits, eligibility, and payer preferences while documenting findings in client systems for accurate cost guidance.'
      },
      {
        title: 'Order Entry Specialist',
        description:
          'Order Entry Specialists input medication orders, capture documentation, and coordinate benefits checks to keep authorizations moving.'
      }
    ],
    benefits: [
      { title: 'Accurate coverage decisions', description: 'Eligibility findings are documented in the right systems at the right time.' },
      { title: 'Prepared appointments', description: 'Teams see complete intake data before patients arrive.' },
      { title: 'Complete orders', description: 'Documentation and order details are captured accurately in the EMR.' },
      { title: 'Coordinated support', description: 'Referral and scheduling follow-ups stay organized and timely.' }
    ],
    process: [
      { title: 'Intake capture', description: 'Demographics and insurance details are recorded inside client systems.' },
      { title: 'Benefit validation', description: 'Eligibility and payer checks confirm coverage before scheduling.' },
      { title: 'Order readiness', description: 'Documentation and EMR entry keep orders complete and compliant.' },
      { title: 'Ongoing coordination', description: 'Work happens inside client EHR, revenue cycle systems, and communication platforms to keep referral sources and leadership requests aligned to timelines.' }
    ],
    imageSrc: 'https://cplyjoeqd4.ufs.sh/f/gAmqiT9pUNhrgCOWBl9pUNhrWouxqs4lZ1DIam2i9Jv0zHyt'
  },
  {
    slug: 'clinical-coordination',
    title: 'Clinical and Care Coordination Support',
    heroTitle: 'Clinical and care coordination support',
    segmentLabel: 'Clinical and Care Coordination Support',
    summary: 'Nurses and scribes coordinate outreach, follow-ups, and charting to keep clinical workflows moving.',
    longDescription:
      'Our clinical and care coordination teams deliver outreach, education, follow-up and documentation so providers can focus on care. Nurses and scribes manage welcome calls, coordinate follow-ups from reports, document adverse events and complete structured notes in the EHR.',
    features: [
      'Medication welcome calls with education',
      'Coordinating follow-ups from report reviews and ordered screenings',
      'Documenting adverse events and escalation paths',
      'Completing EHR-ready charting with accurate histories and plans',
      'Managing schedule governance and updates to clinical tools',
      'Supporting providers with clinical documentation'
    ],
    roles: [
      {
        title: 'Clinical Nurse Coordinator',
        description:
          'Clinical Nurse Coordinators handle outreach, education, and follow-up coordination while documenting outcomes in clinical tools.'
      },
      {
        title: 'Medical Scribe',
        description:
          'Medical Scribes capture histories, plans, and structured notes in the EHR to keep charts complete and audit-ready.'
      }
    ],
    benefits: [
      { title: 'Prepared patients', description: 'Welcome calls and education align patients to care plans.' },
      { title: 'Accurate charts', description: 'Structured documentation keeps histories and plans clear.' },
      { title: 'Documented safety', description: 'Adverse events and escalation steps are captured consistently.' }
    ],
    process: [
      { title: 'Clinical outreach', description: 'Welcome calls and education follow clinical protocols.' },
      { title: 'Charting support', description: 'Notes are captured directly in the EHR.' },
      { title: 'Follow-up coordination', description: 'Reports and screenings are tracked through completion.' },
      { title: 'Schedule governance', description: 'Work happens within client EHR and care coordination tools to keep schedules aligned with provider availability.' }
    ],
    imageSrc: 'https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U48umk0e7rzSVUAW58LFw0OdkaCEGun9vJTQ37M'
  },
  {
    slug: 'revenue-cycle',
    title: 'Revenue Cycle Support',
    heroTitle: 'Revenue cycle support',
    segmentLabel: 'Revenue Cycle Support',
    summary: 'Specialists manage claims follow-up, denials, payment posting, and patient billing with clear documentation.',
    longDescription:
      'Our revenue cycle specialists focus on clean claims follow-up and patient-friendly billing. They prioritize aging reports, contact payers, resolve denials, post payments, manage statements and answer patient questions.',
    features: [
      'Tracking claims and following up with payers',
      'Resolving denials',
      'Posting payments and reconciliation',
      'Handling patient billing questions and statements',
      'Contacting patients for balances and payment plans',
      'Maintaining documented notes for reporting'
    ],
    roles: [
      {
        title: 'Claims Specialist',
        description:
          'Claims Specialists track submissions, resolve denials, and document payer follow-ups inside revenue cycle systems.'
      },
      {
        title: 'Insurance Support Specialist',
        description:
          'Insurance Support Specialists answer billing questions, post payments, and support patient outreach for balances and payment plans.'
      }
    ],
    benefits: [
      { title: 'Recovered revenue', description: 'Follow-ups and reconciliations keep claims moving to resolution.' },
      { title: 'Clear patient billing', description: 'Statements and balances are explained with documented notes.' },
      { title: 'Documented actions', description: 'Billing activity stays visible for reporting and audits.' }
    ],
    process: [
      { title: 'Claim monitoring', description: 'Aging reports and payer queues are reviewed daily inside client revenue cycle management and billing systems.' },
      { title: 'Denial resolution', description: 'Discrepancies are worked and documented to closure.' },
      { title: 'Payment posting', description: 'Payments and adjustments are reconciled accurately.' },
      { title: 'Patient outreach', description: 'Balances and statements are handled with clear communication.' }
    ],
    imageSrc: 'https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U48KsDMQ73cbMY8IewBXDN1uCftWjJZ5Rlhyg0G'
  },
  {
    slug: 'medical-scribes',
    title: 'Medical Scribes',
    heroTitle: 'Medical scribes',
    segmentLabel: 'Medical Scribes',
    summary: 'Trained scribes document visits in real time to keep EHR notes complete and accurate.',
    longDescription:
      'Our medical scribes create accurate, structured clinical notes directly in your EHR during and after patient encounters. They ensure documentation completeness and free providers to focus on patients.',
    features: [
      'Documenting visits in real time',
      'Entering histories and physicals',
      'Capturing orders and care plans',
      'Ensuring chart completeness and compliance'
    ],
    roles: [
      {
        title: 'Medical Scribe',
        description:
          'Medical Scribes are medical professionals with valid credentials that clients can verify by contacting the relevant certification body. They document encounters in the EHR to keep notes structured and complete.'
      }
    ],
    benefits: [
      { title: 'Improved documentation accuracy', description: 'Notes stay structured and complete in the EHR.' },
      { title: 'Enhanced provider efficiency', description: 'Providers stay focused on patients while documentation keeps pace.' }
    ],
    process: [
      { title: 'Encounter documentation', description: 'Visits are captured in real time and finalized after the encounter.' },
      { title: 'Chart completion', description: 'Histories, plans, and orders are entered accurately.' },
      { title: 'Quality review', description: 'Notes are checked for completeness and compliance.' },
      { title: 'Provider alignment', description: 'Scribes follow the provider’s preferred documentation workflow.' }
    ],
    imageSrc: 'https://24vzlu2kzs.ufs.sh/f/4JlBnp1v6U489OxAJFfwdBSz7fDQec0oRvjxW8JlOaM2i6Ip'
  }
];

export const podBySlug = Object.fromEntries(pods.map((pod) => [pod.slug, pod]));
