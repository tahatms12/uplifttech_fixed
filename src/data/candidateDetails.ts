export interface CandidateDetails {
  overview?: string;
  coreCompetencies?: string[];
  careerHighlights?: string[];
  certifications?: string[];
  additionalInfo?: string;
}

export const CANDIDATE_DETAILS: Record<string, CandidateDetails> = {
  'CV-MB-001': {
    overview:
      'Seasoned medical billing lead supporting interventional pain practices with a focus on clean claims, payer follow-up, and proactive denial prevention.',
    coreCompetencies: [
      'End-to-end medical billing',
      'Authorization management',
      'ICD-10/CPT accuracy',
      'Revenue reconciliation',
      'Patient communication'
    ],
    careerHighlights: [
      'Maintained 98% clean-claim rate for high-volume surgery center.',
      'Reduced AR days from 47 to 28 within two quarters by tightening payer follow-up cadences.',
      'Built payer-specific pre-authorization checklist adopted across a 12-provider group.'
    ],
    certifications: ['AAPC Medical Billing Fundamentals', 'HIPAA Compliance Training 2024'],
    additionalInfo:
      'Comfortable collaborating across US time zones and supporting EHR migrations (AdvancedMD, Kareo, eClinicalWorks).'
  },
  'CV-CS-002': {
    overview:
      'Customer experience specialist who blends design sensibility with empathetic support to deliver memorable brand touchpoints.',
    coreCompetencies: [
      'Omnichannel support',
      'Voice & email etiquette',
      'Ticket QA and macros',
      'Creative asset updates',
      'Customer retention'
    ],
    careerHighlights: [
      'Handled 70+ daily tickets while maintaining CSAT above 95%.',
      'Partnered with product and design to refresh onboarding flows, cutting “how-to” contacts by 18%.',
      'Launched visual FAQ library that drove a 22% lift in self-serve resolutions.'
    ],
    certifications: ['HubSpot Service Software Certification', 'Adobe Creative Cloud Masterclass 2023'],
    additionalInfo:
      'Comfortable supporting SaaS, e-commerce, and agency clients; fluent in Loom, Zendesk, and Notion documentation.'
  },
  'CV-RCM-003': {
    overview:
      'Leader-level revenue cycle professional with a decade of hands-on payer management, cross-functional coaching, and EMR expertise.',
    coreCompetencies: [
      'Revenue cycle leadership',
      'Payer contract navigation',
      'Denial analytics',
      'Credentialing programs',
      'Automation recommendations'
    ],
    careerHighlights: [
      'Scaled a 14-member authorization pod supporting multispecialty clinics across the US.',
      'Recovered $1.2M in previously aged claims by rolling out a denial categorization dashboard.',
      'Served as EMR super-user during migrations to eClinicalWorks and Athena.'
    ],
    certifications: ['HFMA Certified Revenue Cycle Specialist', 'Lean Six Sigma Yellow Belt'],
    additionalInfo:
      'Available for US Eastern overlap and experienced onboarding remote teams with SOP-driven playbooks.'
  },
  'CV-DEN-004': {
    overview:
      'Clinically trained dental surgeon focusing on restorative care and patient education with a public health perspective.',
    coreCompetencies: [
      'Restorative dentistry',
      'Patient case planning',
      'Digital imaging interpretation',
      'Chairside patient education',
      'Sterilization compliance'
    ],
    careerHighlights: [
      'Completed 300+ root canals with 97% long-term success rate.',
      'Designed oral health awareness programs adopted by three Karachi-based schools.',
      'Recognized by clinic leadership for compassionate chairside manner and treatment acceptance growth.'
    ],
    certifications: ['INBDE - International Dentist Exam', 'Basic Life Support (BLS) 2024'],
    additionalInfo:
      'Open to tele-dentistry consult support and remote treatment planning engagements.'
  },
  'CV-BPO-005': {
    overview:
      'Energetic inside sales closer with hybrid experience across financial services, insurance, and SaaS appointment setting.',
    coreCompetencies: [
      'Cold calling & objection handling',
      'CRM pipeline hygiene',
      'Email & SMS cadences',
      'Insurance compliance awareness',
      'Cross-sell discovery'
    ],
    careerHighlights: [
      'Closed $180k in final-expense premiums within 9 months through disciplined follow-up.',
      'Ranked top 5% SDR for dials-to-demo conversion in a 40-rep pod.',
      'Introduced QA scorecards that improved call scripting adherence by 15%.'
    ],
    certifications: ['HubSpot Inbound Sales Certification', 'HIPAA Awareness for Contact Centers'],
    additionalInfo:
      'Experienced with Zoho, GoHighLevel, and Five9; comfortable syncing to US-based calendars.'
  },
  'CV-EA-006': {
    overview:
      'Operations-focused executive assistant adept at keeping founders, real estate teams, and government programs running smoothly.',
    coreCompetencies: [
      'Calendar & inbox mastery',
      'Research & reporting',
      'Stakeholder communication',
      'Document & contract prep',
      'Project tracking'
    ],
    careerHighlights: [
      'Built a centralized operations wiki that trimmed onboarding time by 35%.',
      'Coordinated 20+ partner roadshows and investor briefings with zero scheduling conflicts.',
      'Implemented invoice automation that reduced payment lag by two weeks.'
    ],
    certifications: ['Google Project Management Certificate', 'Notion Essentials Badge'],
    additionalInfo:
      'Advanced user of Airtable, Asana, and ClickUp; conversational Korean for partner-facing work.'
  },
  'CV-ECOM-007': {
    overview:
      'Marketplace operator balancing strategic listing optimization with day-to-day operational excellence across Amazon, Walmart, and Shopify.',
    coreCompetencies: [
      'P&L ownership',
      'Listing optimization',
      'Demand forecasting',
      'Vendor negotiations',
      'Customer experience loops'
    ],
    careerHighlights: [
      'Grew Amazon storefront revenue 62% YoY through catalog expansion and sponsored ads.',
      'Recovered $250k in reimbursable inventory charges via case dispute management.',
      'Led cross-border launch for a health & wellness brand into Walmart Marketplace.'
    ],
    certifications: ['Amazon Advertising Certification', 'Google Analytics 4 Certification'],
    additionalInfo:
      'Data-fluent across Helium10, Jungle Scout, and Azure DevOps; currently supervising US-based scheduling pod.'
  },
  'CV-MB-008': {
    overview:
      'Medical billing trainee with strong academic grounding and eagerness to contribute to denial prevention and payment posting teams.',
    coreCompetencies: [
      'Charge entry & data hygiene',
      'Insurance verification',
      'EOB/ERA interpretation',
      'Denial categorization basics',
      'Patient financial counseling'
    ],
    careerHighlights: [
      'Completed 120-hour Profit Diaries billing practicum with commendation from trainers.',
      'Built sample SOP library to help peers understand payer-specific rules.',
      'Volunteered at local clinic to streamline patient intake documentation.'
    ],
    certifications: ['Profit Diaries Medical Billing Certificate', 'MS Excel Advanced Course 2024'],
    additionalInfo:
      'Open to evening shifts and eager for mentorship within established RCM teams.'
  }
};
