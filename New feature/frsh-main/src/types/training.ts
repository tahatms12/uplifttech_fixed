export type CourseStep = {
  stepId: string;
  title: string;
  type: 'Learn' | 'Observe' | 'Do' | 'Simulate' | 'Check' | 'Document' | 'Reflect';
  contentBlocks: string[];
  activities: string[];
  acceptanceCriteria: string[];
  assessment?: {
    questions: { prompt: string; answerKey: string; rationale?: string }[];
  };
  verification: {
    verification_status: 'verified' | 'needs_review' | 'conflicting_sources';
    verification_notes: string;
    references: any[];
    lastReviewed: string;
  };
  roleRelevance: string[];
};

export type CourseDay = {
  dayNumber: number;
  dayTitle: string;
  estimatedTimeMinutes: number;
  steps: CourseStep[];
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  roles: string[];
  tags: string[];
  durationPlan: number;
  prerequisites: string[];
  outcomes: string[];
  source: {
    heading: string;
    raw: string[];
  };
  days: CourseDay[];
};

export type Catalog = {
  programOverview: string[];
  roles: { id: string; name: string; description: string; active: boolean; category?: string }[];
  courses: Course[];
};
