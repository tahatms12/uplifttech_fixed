export interface CandidateEducation {
  degree: string;
  institution: string;
  year?: string | number | null;
}

export interface CandidateExperience {
  company: string;
  role: string;
  start: string;
  end: string;
  highlights: string[];
}

export interface Candidate {
  id: string;
  fullName: string;
  title: string;
  seniority: string;
  yearsExp: number;
  skills: string[];
  capabilities?: string[];
  primarySkill: string;
  locationCity: string;
  locationCountry: string;
  timezone: string;
  availabilityLeadTime: string;
  languages: string[];
  education: CandidateEducation[];
  experience: CandidateExperience[];
  certifications?: string[];
  videoUrl?: string;
  email: string;
  phone: string;
  profilePhoto?: string;
  workWindow: string;
  summary: string;
  overview?: string;
  searchTokens?: string[];
}

const buildTokens = (candidate: Candidate): string[] => {
  const parts = [
    candidate.fullName,
    candidate.title,
    candidate.seniority,
    candidate.primarySkill,
    candidate.locationCity,
    candidate.locationCountry,
    candidate.timezone,
    candidate.availabilityLeadTime,
    candidate.workWindow,
    candidate.summary,
    candidate.overview ?? ''
  ];

  candidate.skills.forEach((skill) => parts.push(skill));
  candidate.capabilities?.forEach((item) => parts.push(item));
  candidate.languages.forEach((language) => parts.push(language));

  return parts
    .join(' ')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
};

export const candidates: Candidate[] = [
  {
    id: 'CV-CS-009',
    fullName: 'A. Akhtar',
    title: 'Client Support Specialist',
    seniority: 'Mid',
    yearsExp: 3,
    skills: [
      'Customer Service',
      'Client Support',
      'Healthcare Front Desk',
      'CRM Tools',
      'Data Entry',
      'Scheduling',
      'Patient Communication',
      'MS Office',
      'Conflict Resolution'
    ],
    capabilities: [
      'Healthcare customer support',
      'Multi-channel communication',
      'Record keeping',
      'Scheduling assistance',
      'Issue escalation',
      'Patient follow-up'
    ],
    primarySkill: 'Customer Support',
    locationCity: 'Islamabad',
    locationCountry: 'Pakistan',
    timezone: 'UTC+5',
    availabilityLeadTime: 'Immediate',
    languages: ['English Fluent', 'Urdu Native'],
    education: [
      {
        degree: 'Bachelor of Humanities and Social Sciences',
        institution: 'Bahria University',
        year: 2025
      },
      {
        degree: 'Semester Exchange Program',
        institution: 'Yeditepe University, Istanbul',
        year: 2023
      }
    ],
    experience: [
      {
        company: 'Auto Enhance Hub',
        role: 'Client Support Specialist',
        start: 'Aug 2025',
        end: 'Present',
        highlights: [
          'Primary contact for client inquiries across digital channels',
          'Coordinated with technical teams to resolve escalations',
          'Monitored service performance updates',
          'Streamlined client onboarding steps'
        ]
      },
      {
        company: 'Studio Dental, Toronto',
        role: 'Frontline Medical Receptionist',
        start: 'Oct 2024',
        end: 'Sep 2025',
        highlights: [
          'Scheduled and coordinated patient appointments',
          'Maintained patient data entry and records',
          'Delivered patient support across phone and chat',
          'Supported clinic operations with accurate documentation'
        ]
      },
      {
        company: 'MicroEnsure Pakistan',
        role: 'Customer Service Representative',
        start: 'Mar 2019',
        end: 'Aug 2019',
        highlights: [
          'Assisted with insurance inquiries and claims',
          'Maintained organized client data',
          'Achieved high customer satisfaction scores'
        ]
      }
    ],
    videoUrl: 'https://player.vimeo.com/video/1137861614?badge=0&autopause=0&player_id=0&app_id=58479',
    email: 'hr@uplift-technologies.com',
    phone: '+92 315 5899936',
    profilePhoto: '',
    workWindow: '8 am to 6 pm Eastern',
    summary: 'Client support specialist with healthcare front desk experience and disciplined documentation.',
    overview:
      'Patient-facing support specialist who combines healthcare reception skills with multi-channel client assistance and consistent record keeping.'
  },
  {
    id: 'CV-PSY-011',
    fullName: 'H. Shabbir',
    title: 'Associate Clinical Psychologist',
    seniority: 'Junior',
    yearsExp: 2,
    skills: [
      'Clinical Psychology',
      'Patient Communication',
      'Healthcare Scheduling',
      'Documentation Management',
      'Psychological Testing',
      'Patient Intake',
      'Research',
      'SPSS',
      'Content Development'
    ],
    capabilities: [
      'Patient intake interviews',
      'Scheduling coordination',
      'Healthcare documentation',
      'Professional communication',
      'Support for mental health programs'
    ],
    primarySkill: 'Healthcare',
    locationCity: 'Islamabad',
    locationCountry: 'Pakistan',
    timezone: 'UTC+5',
    availabilityLeadTime: '2 weeks',
    languages: ['English Fluent', 'Urdu Native'],
    education: [
      {
        degree: 'MSCP Clinical Psychology (In Progress)',
        institution: 'National University of Sciences and Technology',
        year: 'Present'
      },
      {
        degree: 'BSCP Clinical Psychology (Silver Medal)',
        institution: 'Shifa Tameer-e-Millat University',
        year: null
      }
    ],
    experience: [
      {
        company: 'Uplift Technologies',
        role: 'Accounts Receivable Agent',
        start: 'Recent',
        end: 'Present',
        highlights: [
          'Coordinated with patients and insurance teams on account questions',
          'Maintained detailed logs and communication records',
          'Handled high volumes of cases within documented workflows',
          'Managed patient queries in healthcare systems'
        ]
      },
      {
        company: 'Bahria University',
        role: 'Lecturer',
        start: 'Recent',
        end: 'Recent',
        highlights: [
          'Delivered lectures and facilitated discussions',
          'Designed lesson plans and assessments',
          'Mentored students in academic development'
        ]
      },
      {
        company: 'Shifa International Hospital',
        role: 'Clinical Intern',
        start: 'Previous',
        end: 'Previous',
        highlights: [
          'Conducted patient intake interviews',
          'Maintained patient documentation and records',
          'Supported treatment planning coordination'
        ]
      }
    ],
    videoUrl: 'https://player.vimeo.com/video/1139855114?badge=0&autopause=0&player_id=0&app_id=58479',
    email: 'hr@uplift-technologies.com',
    phone: '+92 315 5899936',
    profilePhoto: '',
    workWindow: '8 am to 6 pm Eastern',
    summary: 'Clinical psychology professional with healthcare operations experience and organized follow-up habits.',
    overview:
      'Clinician with a foundation in psychology and hands-on healthcare support who balances patient empathy with accurate documentation and schedule coordination.'
  },
  {
    id: 'CV-OPS-012',
    fullName: 'K. Riaz',
    title: 'Client Support & Operations Specialist',
    seniority: 'Senior',
    yearsExp: 7,
    skills: [
      'Administrative Coordination',
      'Client Support',
      'Quality Assurance',
      'Team Leadership',
      'AR Management',
      'Documentation Management',
      'Customer Communication',
      'Process Improvement',
      'Data Entry'
    ],
    capabilities: [
      'Operations playbooks',
      'Team coaching',
      'Client communications',
      'Quality reviews',
      'Case tracking',
      'Compliance awareness'
    ],
    primarySkill: 'Operations',
    locationCity: 'Lahore',
    locationCountry: 'Pakistan',
    timezone: 'UTC+5',
    availabilityLeadTime: 'Immediate',
    languages: ['English Fluent', 'Urdu Intermediate'],
    education: [
      {
        degree: 'BSc International Business',
        institution: 'Madonna University, Michigan, USA',
        year: 2014
      },
      {
        degree: 'IGCSE O Level',
        institution: 'The Westminster School, Dubai',
        year: 2007
      }
    ],
    experience: [
      {
        company: 'Auto Enhance Hub (Uplift Technologies)',
        role: 'Client Support Specialist',
        start: 'Sep 2025',
        end: 'Present',
        highlights: [
          'Sourced resources and negotiated deals for client needs',
          'Handled multi-channel client communication',
          'Maintained accurate client records',
          'Drove satisfaction through structured follow-ups'
        ]
      },
      {
        company: 'Sameday Dental (Uplift Technologies)',
        role: 'Quality Assurance Manager',
        start: 'Aug 2025',
        end: 'Sep 2025',
        highlights: [
          'Maintained documentation standards for dental workflows',
          'Prepared quality reports for leadership',
          'Updated SOPs and team guidance',
          'Strengthened collaboration between teams'
        ]
      },
      {
        company: 'Studio Dental (Uplift Technologies)',
        role: 'AR Team Lead',
        start: 'Jan 2025',
        end: 'Aug 2025',
        highlights: [
          'Led a team of collection specialists',
          'Maintained compliance expectations for documentation',
          'Monitored performance and delivered coaching',
          'Handled sensitive account matters with accuracy'
        ]
      },
      {
        company: 'TDEA-FAFEN',
        role: 'Junior Program Officer',
        start: 'Jul 2021',
        end: 'May 2024',
        highlights: [
          'Coordinated with partner organizations on program steps',
          'Monitored project timelines and compliance',
          'Maintained quality of reports and documentation'
        ]
      }
    ],
    videoUrl: 'https://player.vimeo.com/video/1137861485?badge=0&autopause=0&player_id=0&app_id=58479',
    email: 'hr@uplift-technologies.com',
    phone: '+92 315 5899936',
    profilePhoto: '',
    workWindow: 'Flexible with North America shifts',
    summary: 'Operations specialist with client support leadership experience and consistent QA standards.',
    overview:
      'Operations leader who blends client communication strength with documentation discipline to guide teams and maintain quality benchmarks.'
  },
  {
    id: 'CV-NUTR-013',
    fullName: 'S. Yasin',
    title: 'Healthcare Operations & Insurance Specialist',
    seniority: 'Mid',
    yearsExp: 5,
    skills: [
      'Patient Scheduling',
      'Insurance Verification',
      'Healthcare Communication',
      'AR Collections',
      'Data Labelling',
      'Customer Service',
      'MS Office',
      'SPSS',
      'SEO'
    ],
    capabilities: [
      'Insurance verification',
      'Patient outreach',
      'Schedule coordination',
      'Documentation accuracy',
      'Collections follow-up',
      'Clinic communications'
    ],
    primarySkill: 'Healthcare Operations',
    locationCity: 'Faisalabad',
    locationCountry: 'Pakistan',
    timezone: 'UTC+5',
    availabilityLeadTime: 'Immediate',
    languages: ['English Fluent', 'Urdu Native'],
    education: [
      {
        degree: 'MSc (Hons.) Food & Nutrition',
        institution: 'University of Agriculture Faisalabad',
        year: 2015
      },
      {
        degree: 'BSc (Hons.) Food & Nutrition',
        institution: 'University of Agriculture Faisalabad',
        year: 2013
      }
    ],
    experience: [
      {
        company: 'Uplift Technologies - Studio Dental',
        role: 'Insurance & Collections Specialist',
        start: 'Sep 2025',
        end: 'Present',
        highlights: [
          'Verified dental insurance claims and requirements',
          'Followed up on unpaid claims with insurers',
          'Ensured accurate documentation for each account',
          'Resolved outstanding balances with clear notes'
        ]
      },
      {
        company: 'Uplift Technologies - Same Day Dental',
        role: 'Outreach Representative',
        start: 'Aug 2025',
        end: 'Sep 2025',
        highlights: [
          'Coordinated outbound outreach to local partners',
          'Shared clinic services with community offices',
          'Expanded patient interest through targeted calls'
        ]
      },
      {
        company: 'Uplift Technologies - Studio Dental',
        role: 'Front Desk Coordinator',
        start: 'Dec 2024',
        end: 'Aug 2025',
        highlights: [
          'Managed patient communications and reminders',
          'Scheduled and confirmed appointments',
          'Conducted recall calls and confirmations',
          'Delivered consistent customer service support'
        ]
      },
      {
        company: 'The University of Faisalabad',
        role: 'Lecturer',
        start: '2016',
        end: '2018',
        highlights: [
          'Taught nutrition courses and mentored students',
          'Supervised research efforts',
          'Organized academic events'
        ]
      }
    ],
    videoUrl: 'https://player.vimeo.com/video/1137861337?badge=0&autopause=0&player_id=0&app_id=58479',
    email: 'hr@uplift-technologies.com',
    phone: '+92 315 5899936',
    profilePhoto: '',
    workWindow: 'Flexible with North America shifts',
    summary: 'Healthcare operations specialist with dental clinic experience in insurance verification and patient outreach.',
    overview:
      'Insurance and scheduling specialist focused on accurate account handling, clear patient communication, and organized follow-up for clinical teams.'
  }
].map((candidate) => ({
  ...candidate,
  searchTokens: buildTokens(candidate)
}));

export const candidatesById = Object.fromEntries(candidates.map((candidate) => [candidate.id, candidate]));
