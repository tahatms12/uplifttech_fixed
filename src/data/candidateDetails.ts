// src/data/candidateDetails.ts

// 🧠 Stores extended details and editable notes per candidate
export interface CandidateDetail {
  overview?: string;
  coreCompetencies?: string[];
  achievements?: string[];
}

export const CANDIDATE_DETAILS: Record<string, CandidateDetail> = {
  'CV-MB-001': {
    overview: `Afsheen is a senior medical billing professional with over 5 years of experience in claims processing, authorization, and coding. 
She has extensive expertise in interventional pain management billing and healthcare reimbursement workflows.`,
    coreCompetencies: [
      'Medical Billing & Claims Processing',
      'ICD & CPT Coding',
      'Authorization & Reimbursement Management',
      'Insurance Verification & Denial Resolution',
    ],
    achievements: [
      '5+ years of consistent billing accuracy across multiple payers',
      'Streamlined claim authorization and reduced denials by 20%',
      'Ensured compliance with healthcare reimbursement standards',
    ],
  },
  'CV-CS-002': {
    overview: `Alina is a customer service representative and designer with a strong record in issue resolution and client satisfaction. 
She blends creative design thinking with customer engagement to deliver impactful results.`,
    coreCompetencies: [
      'Customer Support & Issue Resolution',
      'Communication & Cross-functional Collaboration',
      'Adobe Photoshop & Illustrator',
      'Brand Identity & Visual Design',
    ],
    achievements: [
      'Improved customer satisfaction by 15% in 6 months',
      'Resolved 95% of customer queries independently',
      'Gold Medalist in Fine Arts with multiple design awards',
    ],
  },
  'CV-RCM-003': {
    overview: `Ali is a senior RCM specialist with a decade of experience managing complete revenue cycle processes for multi-specialty practices. 
He brings deep knowledge of EMR platforms, AR management, and team leadership.`,
    coreCompetencies: [
      'Revenue Cycle Management (RCM)',
      'EMR/EHR Support (ECW, Office Ally, Athena)',
      'Accounts Receivable & Denial Management',
      'Authorization & Credentialing',
    ],
    achievements: [
      'Led RCM teams across 12+ medical specialties',
      'Handled full billing cycle for multiple U.S. practices',
      'Trained junior staff on EMR workflows and AR analysis',
    ],
  },
  'CV-DEN-004': {
    overview: `Ayesha is a dental surgeon with 4 years of clinical experience and advanced public health training. 
She combines hands-on dental practice with strong academic and international exposure.`,
    coreCompetencies: [
      'General & Restorative Dentistry',
      'Root Canal Treatment & Treatment Planning',
      'CAD/CAM and CBCT Imaging',
      'Patient Care & Communication',
    ],
    achievements: [
      'INBDE certified with TOEFL IBT score of 116/120',
      'Completed observerships in multiple U.S. dental programs',
      'Currently pursuing MSc in Public Health at Aga Khan University',
    ],
  },
  'CV-BPO-005': {
    overview: `Fahad is a junior BPO and inside sales specialist with 4 years of call center and client communication experience. 
He has worked with international clients in insurance and finance sectors.`,
    coreCompetencies: [
      'Business Process Outsourcing (BPO)',
      'Inside Sales & Lead Generation',
      'Customer Service for US/UK Markets',
      'Final Expense & Insurance Products',
    ],
    achievements: [
      'Consistently met sales and client satisfaction KPIs',
      'Completed professional internship at Askari Bank',
      'Adaptable to flexible NA/UK shift timings',
    ],
  },
  'CV-EA-006': {
    overview: `Momina is an executive and administrative assistant skilled in project management and client coordination. 
She brings organizational discipline, multilingual ability, and technical proficiency to every task.`,
    coreCompetencies: [
      'Executive & Administrative Assistance',
      'Project Management (Certified)',
      'Client & Partner Liaison',
      'Data, Ledger & Email Management',
    ],
    achievements: [
      'Project Management certification via Coursera',
      'Served at ISPR Winter Internship Program 2025',
      'Proficient in MS Office, Scrum, and CMS tools',
    ],
  },
  'CV-ECOM-007': {
    overview: `Zobia is an experienced e-commerce and operations professional with expertise in Amazon, Shopify, and Walmart marketplaces. 
She combines marketing, scheduling, and technical coordination skills for end-to-end business management.`,
    coreCompetencies: [
      'E-Commerce Account Management',
      'Inventory & Order Management',
      'Social Media Marketing & Campaigns',
      'Azure DevOps & Project Coordination',
    ],
    achievements: [
      'Managed 4 major e-commerce platforms concurrently',
      'Reduced fulfillment errors through process automation',
      'Delivered strong client communication in medical scheduling role',
    ],
  },
  'CV-MB-008': {
    overview: `Zunaira is a fresh medical billing trainee with strong foundational understanding of RCM processes. 
She is eager to apply her training and analytical skills to real-world billing operations.`,
    coreCompetencies: [
      'Medical Billing & RCM Fundamentals',
      'Insurance Verification & Payment Posting',
      'EOB/ERA Processing',
      'Data Entry & Accuracy',
    ],
    achievements: [
      'Completed professional medical billing training (Profit Diaries, 2025)',
      'Earned BS Psychology degree from Woman University of Multan',
      'Demonstrated high learning agility and work ethic',
    ],
  },
};

export default CANDIDATE_DETAILS;
