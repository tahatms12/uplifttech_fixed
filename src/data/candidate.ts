export interface CandidateEducation {
  degree: string;
  institution: string;
  year: string | number | null;
}

export interface CandidateExperience {
  company: string;
  role: string;
  start: string;
  end: string;
  highlights: string[];
}

export interface CandidateSalaryRange {
  min: number;
  max: number;
}

export interface Candidate {
  id: string;
  fullName: string;
  title: string;
  seniority: string;
  yearsExp: number;
  skills: string[];
  primarySkill: string;
  locationCity: string;
  locationCountry: string;
  timezone: string;
  availabilityLeadTime: string;
  salaryRangePKR: CandidateSalaryRange;
  languages: string[];
  education: CandidateEducation[];
  experience: CandidateExperience[];
  videoUrl?: string;
  email: string;
  phone: string;
  profilePhoto: string;
  workWindow: string;
  summary: string;
  _tokens?: string[];
}

const RAW_CANDIDATES: Candidate[] = [
  {
    id: 'CV-MB-001',
    fullName: 'Afsheen Waheed',
    title: 'Medical Billing Specialist',
    seniority: 'Senior',
    yearsExp: 5,
    skills: [
      'Medical Billing',
      'Authorization',
      'Claims Processing',
      'ICD Coding',
      'CPT Coding',
      'Insurance Verification',
      'Reimbursement'
    ],
    primarySkill: 'Medical Billing',
    locationCity: 'Lahore',
    locationCountry: 'Pakistan',
    timezone: 'UTC+5',
    availabilityLeadTime: '2 weeks',
    salaryRangePKR: {
      min: 150000,
      max: 200000
    },
    languages: ['English B2', 'Urdu Native'],
    education: [
      {
        degree: 'MSc Mathematics',
        institution: 'University of Punjab',
        year: 2021
      },
      {
        degree: 'BA',
        institution: 'University of Punjab',
        year: 2017
      }
    ],
    experience: [
      {
        company: 'Interventional Pain and Spine Specialist',
        role: 'Medical Billing Specialist',
        start: '2020',
        end: 'Present',
        highlights: [
          'Processing claims and authorizations',
          'Ensuring accurate coding',
          'Managing healthcare reimbursement',
          'Authorization for procedures and visits'
        ]
      }
    ],
    videoUrl: '',
    email: 'afsheenwaheed180@gmail.com',
    phone: '+92 336 7256370',
    profilePhoto: '',
    workWindow: '9 am to 6 pm PKT',
    summary:
      'Medical billing professional with 5 years experience in claims, coding, and authorization for interventional pain management.'
  },
  {
    id: 'CV-CS-002',
    fullName: 'Alina Fatima',
    title: 'Customer Service Representative',
    seniority: 'Mid',
    yearsExp: 2,
    skills: [
      'Customer Service',
      'Issue Resolution',
      'Cross-functional Collaboration',
      'Graphic Design',
      'Adobe Photoshop',
      'Adobe Illustrator',
      'Communication'
    ],
    primarySkill: 'Customer Support',
    locationCity: 'Karachi',
    locationCountry: 'Pakistan',
    timezone: 'UTC+5',
    availabilityLeadTime: 'Immediate',
    salaryRangePKR: {
      min: 80000,
      max: 120000
    },
    languages: ['English B2', 'Urdu Native'],
    education: [
      {
        degree: 'BFA (Gold Medalist)',
        institution: 'Government Sadiq College Women University Bahawalpur',
        year: 2020
      }
    ],
    experience: [
      {
        company: 'IDEA Digital',
        role: 'Customer Service Representative',
        start: 'Dec 2024',
        end: 'Present',
        highlights: [
          'Resolved 95 percent of customer issues',
          'Improved satisfaction scores by 15 percent in 6 months',
          'Reduced ticket resolution time by 20 percent through cross-team collaboration'
        ]
      },
      {
        company: 'Self-Employed',
        role: 'Graphic Designer',
        start: 'Feb 2023',
        end: 'Present',
        highlights: [
          'Achieved 95 percent client satisfaction rate',
          'Enhanced client brand identity and social media engagement'
        ]
      }
    ],
    videoUrl: '',
    email: 'fatimaalina051@gmail.com',
    phone: '+92 331 8589888',
    profilePhoto: '',
    workWindow: '9 am to 6 pm PKT',
    summary:
      'Customer service representative with graphic design skills, proven track record in issue resolution and customer satisfaction.'
  },
  {
    id: 'CV-RCM-003',
    fullName: 'Ali Hassan',
    title: 'RCM Specialist',
    seniority: 'Senior',
    yearsExp: 10,
    skills: [
      'Medical Billing',
      'RCM',
      'EMR Support',
      'AR',
      'Authorization',
      'Credentialing',
      'Payment Posting',
      'Denial Management',
      'ECW',
      'Office Ally',
      'Athena',
      'TriZetto'
    ],
    primarySkill: 'Medical Billing',
    locationCity: 'Lahore',
    locationCountry: 'Pakistan',
    timezone: 'UTC+5',
    availabilityLeadTime: '1 month',
    salaryRangePKR: {
      min: 200000,
      max: 280000
    },
    languages: ['English B2', 'Urdu Native'],
    education: [
      {
        degree: 'English (Graduation)',
        institution: 'University of the Punjab',
        year: null
      }
    ],
    experience: [
      {
        company: 'Cure Tech Pro',
        role: 'RCM Specialist & Virtual Assistant',
        start: 'Jun 2024',
        end: 'Present',
        highlights: [
          'Full RCM cycle management',
          'EMR support across multiple platforms',
          'AR and authorization',
          'Client support and credentialing'
        ]
      },
      {
        company: 'Exponere Solutions',
        role: 'Supervisor RCM',
        start: 'Oct 2022',
        end: 'May 2024',
        highlights: [
          'Led RCM team',
          'Handled authorization department',
          'Business development',
          'Complete revenue cycle oversight'
        ]
      },
      {
        company: 'Physicians EMR/MD Tech',
        role: 'Team Lead Authorization',
        start: 'Apr 2022',
        end: 'Oct 2022',
        highlights: [
          'Managed weekly and monthly aging reports',
          'Handled multiple specialist practices',
          'Client communication and team leadership'
        ]
      }
    ],
    videoUrl: '',
    email: 'alexhcgs735_2sb@indeedemail.com',
    phone: '+92 322 8015543',
    profilePhoto: '',
    workWindow: 'Flexible - Willing to work NA shifts',
    summary:
      'Senior RCM specialist with 10 years experience across multiple specialties and EMR platforms, team leadership expertise.'
  },
  {
    id: 'CV-DEN-004',
    fullName: 'Ayesha Hussain',
    title: 'Dental Surgeon',
    seniority: 'Mid',
    yearsExp: 4,
    skills: [
      'General Dentistry',
      'Root Canal Treatment',
      'Restorative Dentistry',
      'Treatment Planning',
      'Patient Care',
      'CAD/CAM',
      'CBCT'
    ],
    primarySkill: 'Healthcare',
    locationCity: 'Karachi',
    locationCountry: 'Pakistan',
    timezone: 'UTC+5',
    availabilityLeadTime: '3 weeks',
    salaryRangePKR: {
      min: 250000,
      max: 350000
    },
    languages: ['English C2', 'Urdu Native'],
    education: [
      {
        degree: 'MSc Public Health',
        institution: 'Aga Khan University',
        year: 'Present'
      },
      {
        degree: 'BDS',
        institution: 'Dow University of Health Sciences',
        year: 2021
      }
    ],
    experience: [
      {
        company: 'Northway Clinics',
        role: 'General Dentist',
        start: 'Sep 2024',
        end: 'Oct 2025',
        highlights: [
          'Treatment planning',
          'Restorations with fillings, crowns, bridges',
          'Root canal treatments',
          'Simple extractions'
        ]
      },
      {
        company: 'Innova Dental Clinic',
        role: 'General Dentist',
        start: 'Oct 2022',
        end: 'Dec 2023',
        highlights: [
          'Made treatment plans',
          'Performed root canal treatments',
          'Crown cutting and placement',
          'Simple extractions'
        ]
      },
      {
        company: 'Dow University Hospital',
        role: 'Dental Intern',
        start: 'Sep 2021',
        end: 'Sep 2022',
        highlights: [
          'Comprehensive patient care',
          'Root canal treatments',
          'Prosthetic dentistry',
          'Scaling and root planning'
        ]
      }
    ],
    videoUrl: '',
    email: 'ayeshahussayin@gmail.com',
    phone: '+92 333 0222437',
    profilePhoto: '',
    workWindow: '9 am to 6 pm PKT',
    summary:
      'Dental surgeon with US observership experience, INBDE passed, pursuing public health master's degree.'
  },
  {
    id: 'CV-BPO-005',
    fullName: 'Fahad Ahmed',
    title: 'BPO & Inside Sales Specialist',
    seniority: 'Junior',
    yearsExp: 4,
    skills: [
      'Inside Sales',
      'BPO',
      'Customer Service',
      'Final Expense',
      'Insurance',
      'Accounting',
      'Marketing',
      'Amazon Wholesale'
    ],
    primarySkill: 'Sales',
    locationCity: 'Rawalpindi',
    locationCountry: 'Pakistan',
    timezone: 'UTC+5',
    availabilityLeadTime: '2 weeks',
    salaryRangePKR: {
      min: 80000,
      max: 120000
    },
    languages: ['English B2', 'Urdu Native'],
    education: [
      {
        degree: 'BBA Hons',
        institution: 'National University of Modern Languages (NUML)',
        year: 2025
      }
    ],
    experience: [
      {
        company: 'Comtanix',
        role: 'BPO & Inside Sales',
        start: 'Present',
        end: 'Present',
        highlights: [
          'Business process outsourcing',
          'Inside sales',
          'Client development'
        ]
      },
      {
        company: 'Askari Bank',
        role: 'Intern',
        start: 'Mar 2024',
        end: 'Apr 2024',
        highlights: [
          '6-week internship in banking operations',
          'File management and task coordination'
        ]
      },
      {
        company: 'Call Center (USA/UK)',
        role: 'CSR',
        start: '2021',
        end: '2022',
        highlights: [
          'Final expense programs',
          'Insurance companies',
          'Customer service'
        ]
      }
    ],
    videoUrl: '',
    email: 'fahadahmed246810@gmail.com',
    phone: '+92 333 1979840',
    profilePhoto: '',
    workWindow: 'Flexible - Can work NA/UK shifts',
    summary:
      'BPO and inside sales specialist with call center experience in US/UK insurance and final expense markets.'
  },
  {
    id: 'CV-EA-006',
    fullName: 'Momina Shakoor',
    title: 'Executive & Administrative Assistant',
    seniority: 'Mid',
    yearsExp: 3,
    skills: [
      'Project Management',
      'Administrative Assistance',
      'Client Liaison',
      'Data Management',
      'Email Management',
      'Ledger Management',
      'Invoice Generation',
      'Scrum',
      'MS Office',
      'LMS/CMS'
    ],
    primarySkill: 'Operations',
    locationCity: 'Islamabad',
    locationCountry: 'Pakistan',
    timezone: 'UTC+5',
    availabilityLeadTime: '1 month',
    salaryRangePKR: {
      min: 100000,
      max: 140000
    },
    languages: ['English B2', 'Urdu Native', 'Korean A2'],
    education: [
      {
        degree: 'BA English Language and Literature',
        institution: 'National University of Modern Languages',
        year: 2025
      },
      {
        degree: 'Project Management Certificate',
        institution: 'Coursera',
        year: null
      },
      {
        degree: 'Korean Language Certificate',
        institution: 'Islamabad King Sejong Institute',
        year: 2023
      }
    ],
    experience: [
      {
        company: 'ISPR',
        role: 'Winter Internship Program',
        start: 'Oct 2025',
        end: 'Dec 2025',
        highlights: ['Administrative support', 'Program coordination']
      },
      {
        company: 'Mountain Village Naran (Real Estate)',
        role: 'Executive & Administrative Assistant',
        start: '2024',
        end: '2025',
        highlights: [
          'Client and partner liaison',
          'Data and email management',
          'Ledger management',
          'Invoice generation and leasing'
        ]
      }
    ],
    videoUrl: '',
    email: 'mominashakoorhioye_46b@indeedemail.com',
    phone: '+92 333 5541839',
    profilePhoto: '',
    workWindow: '9 am to 6 pm PKT',
    summary:
      'Executive assistant with project management skills, strong in administrative coordination and client relations.'
  },
  {
    id: 'CV-ECOM-007',
    fullName: 'Zobia Badar',
    title: 'E-Commerce Account Manager',
    seniority: 'Mid',
    yearsExp: 5,
    skills: [
      'Amazon',
      'Walmart',
      'Shopify',
      'Best Buy',
      'Inventory Management',
      'Product Research',
      'Order Management',
      'Social Media Marketing',
      'Azure DevOps',
      'Customer Service'
    ],
    primarySkill: 'E-Commerce',
    locationCity: 'Karachi',
    locationCountry: 'Pakistan',
    timezone: 'UTC+5',
    availabilityLeadTime: '2 weeks',
    salaryRangePKR: {
      min: 140000,
      max: 180000
    },
    languages: ['English B2', 'Urdu Native'],
    education: [
      {
        degree: 'MBA',
        institution: 'Iqra University',
        year: 2025
      },
      {
        degree: 'BBA',
        institution: 'Iqra University',
        year: 2023
      }
    ],
    experience: [
      {
        company: 'Better Health Services LLC',
        role: 'Medical Scheduling Lead',
        start: 'Nov 2024',
        end: 'Present',
        highlights: [
          'Coordinate patient scheduling',
          'Manage communication with law firms and providers',
          'Maintain patient databases',
          'Track cases and legal referrals'
        ]
      },
      {
        company: 'PuriLite',
        role: 'E-Commerce Account Manager',
        start: 'Feb 2022',
        end: 'Oct 2024',
        highlights: [
          'Managed Amazon, Walmart, Shopify, Best Buy accounts',
          'Handled AZ claims, returns, refunds',
          'Inventory management and order fulfillment',
          'Used Azure DevOps for project tracking'
        ]
      },
      {
        company: 'Cipherology',
        role: 'Social Media Manager',
        start: 'Jul 2020',
        end: 'Jan 2022',
        highlights: [
          'Managed social media across multiple platforms',
          'Executed campaigns to increase brand awareness',
          'Optimized content performance through analytics'
        ]
      }
    ],
    videoUrl: '',
    email: 'zobiabadar54@gmail.com',
    phone: '+92 345 3051715',
    profilePhoto: '',
    workWindow: '9 am to 6 pm PKT',
    summary:
      'E-commerce specialist with marketplace expertise and current role in medical scheduling coordination.'
  },
  {
    id: 'CV-MB-008',
    fullName: 'Zunaira Nazeer',
    title: 'Medical Billing Trainee',
    seniority: 'Junior',
    yearsExp: 0,
    skills: [
      'Medical Billing',
      'RCM Basics',
      'EOB/ERA',
      'Insurance Verification',
      'Payment Posting',
      'Charge Entry',
      'Data Entry'
    ],
    primarySkill: 'Medical Billing',
    locationCity: 'Multan',
    locationCountry: 'Pakistan',
    timezone: 'UTC+5',
    availabilityLeadTime: 'Immediate',
    salaryRangePKR: {
      min: 50000,
      max: 70000
    },
    languages: ['English B2', 'Urdu Native'],
    education: [
      {
        degree: 'BS Psychology',
        institution: 'The Woman University of Multan',
        year: 2025
      },
      {
        degree: 'Medical Billing Training',
        institution: 'Profit Diaries',
        year: 2025
      }
    ],
    experience: [],
    videoUrl: '',
    email: 'zunairanazeera6xxd_4k9@indeedemail.com',
    phone: '+92 329 8059582',
    profilePhoto: '',
    workWindow: 'Flexible',
    summary:
      'Fresh graduate with medical billing training, eager to start career in RCM with strong foundation in billing basics.'
  }
];

const uniqueTokens = (value: string) =>
  Array.from(
    new Set(
      value
        .toLowerCase()
        .split(/[^a-z0-9+]+/)
        .filter(Boolean)
    )
  );

const buildTokens = (candidate: Candidate): string[] => {
  const parts: string[] = [
    candidate.fullName,
    candidate.title,
    candidate.seniority,
    candidate.primarySkill,
    candidate.locationCity,
    candidate.locationCountry,
    candidate.timezone,
    candidate.summary,
    candidate.workWindow,
    ...candidate.skills,
    ...candidate.languages,
    ...candidate.education.flatMap((education) => [education.degree, education.institution]),
    ...candidate.experience.flatMap((experience) => [experience.company, experience.role, ...experience.highlights])
  ];

  return uniqueTokens(parts.join(' '));
};

const buildProfilePhoto = (candidate: Candidate) =>
  candidate.profilePhoto || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(candidate.fullName)}`;

export const CANDIDATES: Candidate[] = RAW_CANDIDATES.map((candidate) => ({
  ...candidate,
  profilePhoto: buildProfilePhoto(candidate),
  _tokens: buildTokens(candidate)
}));

export type { Candidate as CandidateSummary };
