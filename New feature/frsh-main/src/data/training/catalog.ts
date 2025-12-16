import type { Catalog } from '../../types/training';

export const trainingCatalog: Catalog = {
  programOverview: [
    'Uplift Technologies private training portal delivers compliance-ready enablement with recorded progress.',
    'Courses include lesson steppers, embedded quizzes, and certificate issuance for compliant records.',
  ],
  roles: [
    { id: 'operations', name: 'Operations Specialist', description: 'Handles daily program execution.', active: true },
    { id: 'clinical', name: 'Clinical Coordinator', description: 'Supports patient coordination and documentation.', active: true },
    { id: 'analyst', name: 'Revenue Analyst', description: 'Owns payer workflows and claims follow-up.', active: true },
  ],
  courses: [
    {
      id: 'uplift-hc-basics',
      slug: 'uplift-hc-basics',
      title: 'Healthcare Compliance Foundations',
      summary: 'HIPAA-ready onboarding with workflows, minimum necessary, and practical safeguards.',
      roles: ['operations', 'clinical', 'analyst'],
      tags: ['hipaa', 'security', 'onboarding'],
      durationPlan: 7,
      prerequisites: ['Active Uplift account', 'Signed confidentiality acknowledgment'],
      outcomes: [
        'Explain minimum necessary and apply it to daily tasks.',
        'Detect and escalate incidents using the defined pathway.',
        'Follow device and account hygiene guidelines.',
      ],
      source: {
        heading: 'Uplift Policies',
        raw: [
          'Content curated from Uplift privacy, security, and operations playbooks. Version 1.0.',
        ],
      },
      days: [
        {
          dayNumber: 1,
          dayTitle: 'Orientation and Data Handling',
          estimatedTimeMinutes: 45,
          steps: [
            {
              stepId: 'intro',
              title: 'Why this training matters',
              type: 'Learn',
              contentBlocks: [
                'Understand how HIPAA obligations map to Uplift workflows.',
                'Know what counts as PHI and why minimum necessary limits risk.',
              ],
              activities: [
                'Read the PHI definitions and examples.',
                'List three data types you touch daily.',
              ],
              acceptanceCriteria: [
                'Can state PHI definition and provide examples.',
                'Acknowledges that minimum necessary applies to every task.',
              ],
              assessment: {
                questions: [
                  { prompt: 'Which statement best defines PHI?', answerKey: 'Any information that can identify a patient combined with health, treatment, or payment details.' },
                  { prompt: 'When is it acceptable to access more PHI than needed?', answerKey: 'Never; access is limited to the minimum necessary to perform the task.' },
                ],
              },
              verification: {
                verification_status: 'verified',
                verification_notes: 'Sourced from policy handbook 2024.01',
                references: [],
                lastReviewed: '2024-01-01',
              },
              roleRelevance: ['operations', 'clinical', 'analyst'],
            },
            {
              stepId: 'data-handling',
              title: 'Handling data safely',
              type: 'Do',
              contentBlocks: [
                'Follow workstation locking, secure sharing, and breach triage basics.',
              ],
              activities: ['Enable disk encryption and screen lock timers.', 'Use approved channels for PHI sharing.'],
              acceptanceCriteria: ['Completed workstation checklist in-app.'],
              verification: {
                verification_status: 'verified',
                verification_notes: 'Aligned to security SOP v2',
                references: [],
                lastReviewed: '2024-01-01',
              },
              roleRelevance: ['operations', 'clinical', 'analyst'],
            },
          ],
        },
        {
          dayNumber: 2,
          dayTitle: 'Incidents and Escalations',
          estimatedTimeMinutes: 40,
          steps: [
            {
              stepId: 'escalations',
              title: 'Incident recognition',
              type: 'Observe',
              contentBlocks: ['Spot suspicious activity and misdirected PHI.'],
              activities: ['Review two sample incident scenarios.'],
              acceptanceCriteria: ['Correctly classify two out of two example scenarios.'],
              assessment: {
                questions: [
                  { prompt: 'First action after noticing PHI sent to wrong recipient?', answerKey: 'Stop further disclosure and file an incident via the portal immediately.' },
                ],
              },
              verification: {
                verification_status: 'verified',
                verification_notes: 'Based on incident SOP',
                references: [],
                lastReviewed: '2024-01-01',
              },
              roleRelevance: ['operations', 'clinical', 'analyst'],
            },
            {
              stepId: 'reporting',
              title: 'Reporting workflow',
              type: 'Do',
              contentBlocks: ['Use the incident form and include required details.'],
              activities: ['Submit a practice incident with redacted data.'],
              acceptanceCriteria: ['Form submitted with correct fields.'],
              verification: {
                verification_status: 'verified',
                verification_notes: 'SOP aligned',
                references: [],
                lastReviewed: '2024-01-01',
              },
              roleRelevance: ['operations', 'clinical', 'analyst'],
            },
          ],
        },
      ],
    },
  ],
};

export default trainingCatalog;
