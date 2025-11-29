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
    id: 'CV-CS-002',
    fullName: 'A. Fatima', //Alina Fatima
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
    email: 'hr@uplift-technologies.com',
    phone: '+92 315 5899936',
    profilePhoto: '',
    workWindow: '8 am to 6 pm EST',
    summary:
      'Customer service representative with graphic design skills, proven track record in issue resolution and customer satisfaction.'
  },
  {
    id: 'CV-CS-009',
    fullName: 'A. Akhtar', // Alveena Akhtar
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
      'Conflict Resolution',
      'Zoom',
      'Google Meet'
    ],
    primarySkill: 'Customer Support',
    locationCity: 'Islamabad',
    locationCountry: 'Pakistan',
    timezone: 'UTC+5',
    availabilityLeadTime: 'Immediate',
    salaryRangePKR: {
      min: 100000,
      max: 150000
    },
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
          'Primary contact for client inquiries across multiple digital platforms',
          'Collaborate with technical teams to resolve escalated issues',
          'Monitor service performance metrics',
          'Streamline client onboarding processes'
        ]
      },
      {
        company: 'Studio Dental, Toronto',
        role: 'Frontline Medical Receptionist',
        start: 'Oct 2024',
        end: 'Sep 2025',
        highlights: [
          'Scheduled and coordinated patient appointments',
          'Managed patient data entry and records',
          'Delivered excellent customer service',
          'Supported clinic operations and communication'
        ]
      },
      {
        company: 'MicroEnsure Pakistan',
        role: 'Customer Service Representative',
        start: 'Mar 2019',
        end: 'Aug 2019',
        highlights: [
          'Assisted with insurance inquiries and claims',
          'Handled client data entry with precision',
          'Achieved high customer satisfaction scores'
        ]
      }
    ],
    videoUrl: 'https://player.vimeo.com/video/1137861614?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479',
    email: 'hr@uplift-technologies.com',
    phone: '+92 315 5899936',
    profilePhoto: '',
    workWindow: '8 am to 6 pm EST',
    summary:
      'Client support specialist with healthcare front desk experience, strong cross-cultural communication, and expertise in CRM tools.'
  },
  // {
  //   id: 'CV-ACC-010',
  //   fullName: 'R. Mehboob', // Rafia Mehboob
  //   title: 'Accountant & Managing Director',
  //   seniority: 'Senior',
  //   yearsExp: 2,
  //   skills: [
  //     'Financial Reporting',
  //     'Accounting',
  //     'Budgeting',
  //     'Cash Flow Management',
  //     'QuickBooks',
  //     'MS Excel Advanced',
  //     'Business Operations',
  //     'Team Leadership',
  //     'Client Relations',
  //     'Risk Management'
  //   ],
  //   primarySkill: 'Accounting',
  //   locationCity: 'Islamabad',
  //   locationCountry: 'Pakistan',
  //   timezone: 'UTC+5',
  //   availabilityLeadTime: '2 weeks',
  //   salaryRangePKR: {
  //     min: 150000,
  //     max: 250000
  //   },
  //   languages: ['English Fluent', 'Urdu Native'],
  //   education: [
  //     {
  //       degree: 'Chartered Management Accountant (In Progress)',
  //       institution: 'Institute of Chartered Management Accountants',
  //       year: 'Present'
  //     },
  //     {
  //       degree: 'HSSC - Intermediate of Commerce',
  //       institution: 'Punjab Group of Colleges',
  //       year: 2022
  //     }
  //   ],
  //   experience: [
  //     {
  //       company: 'Safety First Security Ltd UK',
  //       role: 'Managing Director',
  //       start: 'Feb 2024',
  //       end: 'Present',
  //       highlights: [
  //         'Managed business operations from recruitment to contracts',
  //         'Pitched and negotiated contracts with clients',
  //         'Supervised security staff and ensured payroll accuracy',
  //         'Handled HR duties and emergency management'
  //       ]
  //     },
  //     {
  //       company: 'Claim Help UK Limited',
  //       role: 'Accountant',
  //       start: 'Feb 2023',
  //       end: 'Present',
  //       highlights: [
  //         'Manage payment records for claims',
  //         'Maintain accurate books and financial documentation',
  //         'Engage with clients to address queries',
  //         'Handle administrative tasks and supervise staff'
  //       ]
  //     }
  //   ],
  //   videoUrl: '',
  //   email: 'hr@uplift-technologies.com',
  //   phone: '+92 315 5899936',
  //   profilePhoto: '',
  //   workWindow: 'Flexible - UK hours preferred',
  //   summary:
  //     'Accountant and business operations leader with expertise in financial management, team leadership, and UK-based client relations.'
  // },
  {
    id: 'CV-PSY-011',
    fullName: 'H. Shabbir', // Hafsa Shabbir
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
      'MS Office',
      'SPSS',
      'Content Development'
    ],
    primarySkill: 'Healthcare',
    locationCity: 'Islamabad',
    locationCountry: 'Pakistan',
    timezone: 'UTC+5',
    availabilityLeadTime: '2 weeks',
    salaryRangePKR: {
      min: 120000,
      max: 180000
    },
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
          'Coordinated with patients and insurance providers',
          'Maintained detailed logs and communication records',
          'Handled large volumes of cases efficiently',
          'Managed patient queries within healthcare systems'
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
          'Managed patient documentation and records',
          'Supported treatment planning coordination'
        ]
      }
    ],
    videoUrl: 'https://player.vimeo.com/video/1139855114?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479',
    email: 'hr@uplift-technologies.com',
    phone: '+92 315 5899936',
    profilePhoto: '',
    workWindow: '8 am to 6 pm EST',
    summary:
      'Clinical psychologist with healthcare operations experience, strong in patient communication, scheduling, and documentation management.'
  },
  {
    id: 'CV-OPS-012',
    fullName: 'K. Riaz', // Komal Riaz
    title: 'Client Support & Operations Specialist',
    seniority: 'Senior',
    yearsExp: 7,
    skills: [
      'Administrative Coordination',
      'Client Support',
      'Quality Assurance',
      'Team Leadership',
      'AR Management',
      'PIPEDA Compliance',
      'Documentation Management',
      'Customer Communication',
      'Process Improvement',
      'Data Entry'
    ],
    primarySkill: 'Operations',
    locationCity: 'Pakistan',
    locationCountry: 'Pakistan',
    timezone: 'UTC+5',
    availabilityLeadTime: 'Immediate',
    salaryRangePKR: {
      min: 140000,
      max: 200000
    },
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
          'Sourced car parts and negotiated deals',
          'Handled multi-channel client communication',
          'Maintained accurate client records',
          'Ensured customer satisfaction through follow-ups'
        ]
      },
      {
        company: 'Sameday Dental (Uplift Technologies)',
        role: 'Quality Assurance Manager',
        start: 'Aug 2025',
        end: 'Sep 2025',
        highlights: [
          'Ensured accurate documentation of dental procedures',
          'Prepared QA reports for management',
          'Maintained and updated SOPs',
          'Enhanced collaboration between teams'
        ]
      },
      {
        company: 'Studio Dental (Uplift Technologies)',
        role: 'AR Team Lead',
        start: 'Jan 2025',
        end: 'Aug 2025',
        highlights: [
          'Led team of collection specialists',
          'Ensured PIPEDA compliance',
          'Monitored performance and provided coaching',
          'Handled sensitive financial matters'
        ]
      },
      {
        company: 'TDEA-FAFEN',
        role: 'Junior Program Officer',
        start: 'Jul 2021',
        end: 'May 2024',
        highlights: [
          'Coordinated with field partner organizations',
          'Monitored project timelines and compliance',
          'Ensured quality of reports and documentation'
        ]
      }
    ],
    videoUrl: 'https://player.vimeo.com/video/1137861485?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479',
    email: 'hr@uplift-technologies.com',
    phone: '+92 315 5899936',
    profilePhoto: '',
    workWindow: 'Flexible - Can work NA shifts',
    summary:
      'Operations specialist with extensive remote work experience in client support, QA management, and AR team leadership.'
  },
  {
    id: 'CV-NUTR-013',
    fullName: 'S. Yasin', // Sabah Yasin
    title: 'Healthcare Operations & Insurance Specialist',
    seniority: 'Mid',
    yearsExp: 5,
    skills: [
      'Patient Scheduling',
      'Insurance Verification',
      'Healthcare Communication',
      'AR Collections',
      'Digital Marketing',
      'Data Labelling',
      'Customer Service',
      'MS Office',
      'SPSS',
      'SEO'
    ],
    primarySkill: 'Healthcare Operations',
    locationCity: 'Faisalabad',
    locationCountry: 'Pakistan',
    timezone: 'UTC+5',
    availabilityLeadTime: 'Immediate',
    salaryRangePKR: {
      min: 110000,
      max: 160000
    },
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
          'Verified dental insurance claims',
          'Followed up on unpaid claims with insurance companies',
          'Ensured accurate documentation',
          'Resolved outstanding accounts'
        ]
      },
      {
        company: 'Uplift Technologies - Same Day Dental',
        role: 'Marketing & Outreach Representative',
        start: 'Aug 2025',
        end: 'Sep 2025',
        highlights: [
          'Executed outbound marketing campaigns',
          'Promoted clinic services to local businesses',
          'Expanded patient base through outreach'
        ]
      },
      {
        company: 'Uplift Technologies - Studio Dental',
        role: 'Front Desk Coordinator',
        start: 'Dec 2024',
        end: 'Aug 2025',
        highlights: [
          'Managed patient communications',
          'Scheduled and confirmed appointments',
          'Conducted reminder and recall calls',
          'Delivered excellent customer service'
        ]
      },
      {
        company: 'The University of Faisalabad',
        role: 'Lecturer',
        start: '2016',
        end: '2018',
        highlights: [
          'Taught nutrition courses',
          'Supervised student research',
          'Organized nutrition events'
        ]
      }
    ],
    videoUrl: 'https://player.vimeo.com/video/1137861337?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479',
    email: 'hr@uplift-technologies.com',
    phone: '+92 315 5899936',
    profilePhoto: '',
    workWindow: 'Flexible - Can work NA shifts',
    summary:
      'Healthcare operations specialist with dental clinic experience in insurance verification, patient scheduling, and collections management.'
  },
  // {
  //   id: 'CV-DEN-004',
  //   fullName: 'A. Hussain', //Ayesha Hussain
  //   title: 'Dental Surgeon',
  //   seniority: 'Mid',
  //   yearsExp: 4,
  //   skills: [
  //     'General Dentistry',
  //     'Root Canal Treatment',
  //     'Restorative Dentistry',
  //     'Treatment Planning',
  //     'Patient Care',
  //     'CAD/CAM',
  //     'CBCT'
  //   ],
  //   primarySkill: 'Healthcare',
  //   locationCity: 'Karachi',
  //   locationCountry: 'Pakistan',
  //   timezone: 'UTC+5',
  //   availabilityLeadTime: '3 weeks',
  //   salaryRangePKR: {
  //     min: 250000,
  //     max: 350000
  //   },
  //   languages: ['English C2', 'Urdu Native'],
  //   education: [
  //     {
  //       degree: 'MSc Public Health',
  //       institution: 'Aga Khan University',
  //       year: 'Present'
  //     },
  //     {
  //       degree: 'BDS',
  //       institution: 'Dow University of Health Sciences',
  //       year: 2021
  //     }
  //   ],
  //   experience: [
  //     {
  //       company: 'Northway Clinics',
  //       role: 'General Dentist',
  //       start: 'Sep 2024',
  //       end: 'Oct 2025',
  //       highlights: [
  //         'Treatment planning',
  //         'Restorations with fillings, crowns, bridges',
  //         'Root canal treatments',
  //         'Simple extractions'
  //       ]
  //     },
  //     {
  //       company: 'Innova Dental Clinic',
  //       role: 'General Dentist',
  //       start: 'Oct 2022',
  //       end: 'Dec 2023',
  //       highlights: [
  //         'Made treatment plans',
  //         'Performed root canal treatments',
  //         'Crown cutting and placement',
  //         'Simple extractions'
  //       ]
  //     },
  //     {
  //       company: 'Dow University Hospital',
  //       role: 'Dental Intern',
  //       start: 'Sep 2021',
  //       end: 'Sep 2022',
  //       highlights: [
  //         'Comprehensive patient care',
  //         'Root canal treatments',
  //         'Prosthetic dentistry',
  //         'Scaling and root planning'
  //       ]
  //     }
  //   ],
  //   videoUrl: '',
  //   email: 'hr@uplift-technologies.com',
  //   phone: '+92 315 5899936',
  //   profilePhoto: '',
  //   workWindow: '8 am to 6 pm EST',
  //   summary:
  //     "Dental surgeon with US observership experience, INBDE passed, pursuing public health master's degree."
  // },
  // {
  //   id: 'CV-BPO-005',
  //   fullName: 'F. Ahmed', //Fahad Ahmed
  //   title: 'BPO & Inside Sales Specialist',
  //   seniority: 'Junior',
  //   yearsExp: 4,
  //   skills: [
  //     'Inside Sales',
  //     'BPO',
  //     'Customer Service',
  //     'Final Expense',
  //     'Insurance',
  //     'Accounting',
  //     'Marketing',
  //     'Amazon Wholesale'
  //   ],
    
  //   primarySkill: 'Sales',
  //   locationCity: 'Rawalpindi',
  //   locationCountry: 'Pakistan',
  //   timezone: 'UTC+5',
  //   availabilityLeadTime: '2 weeks',
  //   salaryRangePKR: {
  //     min: 80000,
  //     max: 120000
  //   },
  //   languages: ['English B2', 'Urdu Native'],
  //   education: [
  //     {
  //       degree: 'BBA Hons',
  //       institution: 'National University of Modern Languages (NUML)',
  //       year: 2025
  //     }
  //   ],
  //   experience: [
  //     {
  //       company: 'Comtanix',
  //       role: 'BPO & Inside Sales',
  //       start: 'Present',
  //       end: 'Present',
  //       highlights: [
  //         'Business process outsourcing',
  //         'Inside sales',
  //         'Client development'
  //       ]
  //     },
  //     {
  //       company: 'Askari Bank',
  //       role: 'Intern',
  //       start: 'Mar 2024',
  //       end: 'Apr 2024',
  //       highlights: [
  //         '6-week internship in banking operations',
  //         'File management and task coordination'
  //       ]
  //     },
  //     {
  //       company: 'Call Center (USA/UK)',
  //       role: 'CSR',
  //       start: '2021',
  //       end: '2022',
  //       highlights: [
  //         'Final expense programs',
  //         'Insurance companies',
  //         'Customer service'
  //       ]
  //     }
  //   ],
  //   videoUrl: '',
  //   email: 'hr@uplift-technologies.com',
  //   phone: '+92 315 5899936',
  //   profilePhoto: '',
  //   workWindow: 'Flexible - Can work NA/UK shifts',
  //   summary:
  //     'BPO and inside sales specialist with call center experience in US/UK insurance and final expense markets.'
  // },
  // {
  //   id: 'CV-EA-006',
  //   fullName: 'M. Shakoor', //Momina Shakoor
  //   title: 'Executive & Administrative Assistant',
  //   seniority: 'Mid',
  //   yearsExp: 3,
  //   skills: [
  //     'Project Management',
  //     'Administrative Assistance',
  //     'Client Liaison',
  //     'Data Management',
  //     'Email Management',
  //     'Ledger Management',
  //     'Invoice Generation',
  //     'Scrum',
  //     'MS Office',
  //     'LMS/CMS'
  //   ],
  //   primarySkill: 'Operations',
  //   locationCity: 'Islamabad',
  //   locationCountry: 'Pakistan',
  //   timezone: 'UTC+5',
  //   availabilityLeadTime: '1 month',
  //   salaryRangePKR: {
  //     min: 100000,
  //     max: 140000
  //   },
  //   languages: ['English B2', 'Urdu Native', 'Korean A2'],
  //   education: [
  //     {
  //       degree: 'BA English Language and Literature',
  //       institution: 'National University of Modern Languages',
  //       year: 2025
  //     },
  //     {
  //       degree: 'Project Management Certificate',
  //       institution: 'Coursera',
  //       year: null
  //     },
  //     {
  //       degree: 'Korean Language Certificate',
  //       institution: 'Islamabad King Sejong Institute',
  //       year: 2023
  //     }
  //   ],
  //   experience: [
  //     {
  //       company: 'ISPR',
  //       role: 'Winter Internship Program',
  //       start: 'Oct 2025',
  //       end: 'Dec 2025',
  //       highlights: ['Administrative support', 'Program coordination']
  //     },
  //     {
  //       company: 'Mountain Village Naran (Real Estate)',
  //       role: 'Executive & Administrative Assistant',
  //       start: '2024',
  //       end: '2025',
  //       highlights: [
  //         'Client and partner liaison',
  //         'Data and email management',
  //         'Ledger management',
  //         'Invoice generation and leasing'
  //       ]
  //     }
  //   ],
  //   videoUrl: '',
  //   email: 'hr@uplift-technologies.com',
  //   phone: '+92 315 5899936',
  //   profilePhoto: '',
  //   workWindow: '8 am to 6 pm EST',
  //   summary:
  //     'Executive assistant with project management skills, strong in administrative coordination and client relations.'
  // },
  // {
  //   id: 'CV-ECOM-007',
  //   fullName: 'Z. Badar', //Zobia Badar
  //   title: 'E-Commerce Account Manager',
  //   seniority: 'Mid',
  //   yearsExp: 5,
  //   skills: [
  //     'Amazon',
  //     'Walmart',
  //     'Shopify',
  //     'Best Buy',
  //     'Inventory Management',
  //     'Product Research',
  //     'Order Management',
  //     'Social Media Marketing',
  //     'Azure DevOps',
  //     'Customer Service'
  //   ],
  //   primarySkill: 'E-Commerce',
  //   locationCity: 'Karachi',
  //   locationCountry: 'Pakistan',
  //   timezone: 'UTC+5',
  //   availabilityLeadTime: '2 weeks',
  //   salaryRangePKR: {
  //     min: 140000,
  //     max: 180000
  //   },
  //   languages: ['English B2', 'Urdu Native'],
  //   education: [
  //     {
  //       degree: 'MBA',
  //       institution: 'Iqra University',
  //       year: 2025
  //     },
  //     {
  //       degree: 'BBA',
  //       institution: 'Iqra University',
  //       year: 2023
  //     }
  //   ],
  //   experience: [
  //     {
  //       company: 'Better Health Services LLC',
  //       role: 'Medical Scheduling Lead',
  //       start: 'Nov 2024',
  //       end: 'Present',
  //       highlights: [
  //         'Coordinate patient scheduling',
  //         'Manage communication with law firms and providers',
  //         'Maintain patient databases',
  //         'Track cases and legal referrals'
  //       ]
  //     },
  //     {
  //       company: 'PuriLite',
  //       role: 'E-Commerce Account Manager',
  //       start: 'Feb 2022',
  //       end: 'Oct 2024',
  //       highlights: [
  //         'Managed Amazon, Walmart, Shopify, Best Buy accounts',
  //         'Handled AZ claims, returns, refunds',
  //         'Inventory management and order fulfillment',
  //         'Used Azure DevOps for project tracking'
  //       ]
  //     },
  //     {
  //       company: 'Cipherology',
  //       role: 'Social Media Manager',
  //       start: 'Jul 2020',
  //       end: 'Jan 2022',
  //       highlights: [
  //         'Managed social media across multiple platforms',
  //         'Executed campaigns to increase brand awareness',
  //         'Optimized content performance through analytics'
  //       ]
  //     }
  //   ],
  //   videoUrl: '',
  //   email: 'hr@uplift-technologies.com',
  //   phone: '+92 315 5899936',
  //   profilePhoto: '',
  //   workWindow: '8 am to 6 pm EST',
  //   summary:
  //     'E-commerce specialist with marketplace expertise and current role in medical scheduling coordination.'
  // },
  // {
  //   id: 'CV-MB-008',
  //   fullName: 'Z. Nazeer', //Zunaira Nazeer
  //   title: 'Medical Billing Trainee',
  //   seniority: 'Junior',
  //   yearsExp: 0,
  //   skills: [
  //     'Medical Billing',
  //     'RCM Basics',
  //     'EOB/ERA',
  //     'Insurance Verification',
  //     'Payment Posting',
  //     'Charge Entry',
  //     'Data Entry'
  //   ],
  //   primarySkill: 'Medical Billing',
  //   locationCity: 'Multan',
  //   locationCountry: 'Pakistan',
  //   timezone: 'UTC+5',
  //   availabilityLeadTime: 'Immediate',
  //   salaryRangePKR: {
  //     min: 50000,
  //     max: 70000
  //   },
  //   languages: ['English B2', 'Urdu Native'],
  //   education: [
  //     {
  //       degree: 'BS Psychology',
  //       institution: 'The Woman University of Multan',
  //       year: 2025
  //     },
  //     {
  //       degree: 'Medical Billing Training',
  //       institution: 'Profit Diaries',
  //       year: 2025
  //     }
  //   ],
  //   experience: [],
  //   videoUrl: '',
  //   email: 'hr@uplift-technologies.com',
  //   phone: '+92 315 5899936',
  //   profilePhoto: '',
  //   workWindow: 'Flexible',
  //   summary:
  //     'Fresh graduate with medical billing training, eager to start career in RCM with strong foundation in billing basics.'
  // }
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
