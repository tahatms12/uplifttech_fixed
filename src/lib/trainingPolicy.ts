export interface LearningObjective {
  id: string;
  text: string;
}

export interface QuizPolicy {
  passingThresholdPercent: number;
  maxAttempts: number;
  cooldownMinutes: number;
}

export interface PracticeActivityData {
  matchingPairs: { prompt: string; match: string }[];
  scenario: {
    prompt: string;
    options: { id: string; label: string; feedback: string }[];
    correctOptionId: string;
  };
}

const DEFAULT_QUIZ_POLICY: QuizPolicy = {
  passingThresholdPercent: 80,
  maxAttempts: 2,
  cooldownMinutes: 30,
};

export function getQuizPolicy(passingThresholdPercent?: number): QuizPolicy {
  return {
    ...DEFAULT_QUIZ_POLICY,
    passingThresholdPercent: passingThresholdPercent ?? DEFAULT_QUIZ_POLICY.passingThresholdPercent,
  };
}

export function buildModuleObjectives(moduleTitle: string): LearningObjective[] {
  const base = moduleTitle.replace(/\s*\([^)]*\)\s*/g, '').trim();
  return [
    {
      id: 'OBJ-1',
      text: `Define the key terms and workflow steps in ${base}.`,
    },
    {
      id: 'OBJ-2',
      text: `Apply the required procedures from ${base} to a realistic scenario.`,
    },
    {
      id: 'OBJ-3',
      text: `Identify compliance risks in ${base} and select the correct escalation path.`,
    },
  ];
}

export function mapQuestionObjectives(questionIndex: number, objectives: LearningObjective[]): string[] {
  if (!objectives.length) return [];
  const bucket = questionIndex % objectives.length;
  return [objectives[bucket].id];
}

export function buildPracticeActivity(moduleTitle: string): PracticeActivityData {
  const base = moduleTitle.replace(/\s*\([^)]*\)\s*/g, '').trim();
  return {
    matchingPairs: [
      {
        prompt: 'Delivery mode',
        match: `Confirm the assigned training format for ${base}.`,
      },
      {
        prompt: 'Readiness check',
        match: 'Complete prerequisites before advancing to live or locked content.',
      },
      {
        prompt: 'Escalation trigger',
        match: 'Pause and notify the training coordinator when requirements are unclear.',
      },
    ],
    scenario: {
      prompt: `You are working through ${base} and notice a missing prerequisite module. What should you do next?`,
      options: [
        {
          id: 'option-a',
          label: 'Skip ahead and return later to keep momentum.',
          feedback: 'Skipping prerequisites can break compliance sequencing and should be avoided.',
        },
        {
          id: 'option-b',
          label: 'Pause, document the blocker, and escalate through the defined path.',
          feedback: 'Correct. Training policy requires escalation and documentation before proceeding.',
        },
        {
          id: 'option-c',
          label: 'Ask a peer to summarize the missing material and move on.',
          feedback: 'Peer summaries are not a substitute for required coursework.',
        },
      ],
      correctOptionId: 'option-b',
    },
  };
}

export function isPracticeLesson(title: string): boolean {
  return /practice pack|practice/i.test(title);
}

export function isKnowledgeCheck(title: string): boolean {
  return /knowledge check|quiz|assessment/i.test(title);
}
