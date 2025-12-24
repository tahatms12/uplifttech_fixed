import curriculum from './exports/curriculum.generated.json';
import roles from './roles.json';
import { normalizeCourseContent } from '../../lib/normalizeCourseContent';

export type LessonType = 'read' | 'scenario' | 'quiz' | 'checklist' | 'download';

export interface Role {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export interface LessonContentBlock {
  type: 'markdown';
  content: string;
}

export interface ScenarioContent {
  prompt: string;
  modelAnswer: string;
  guidance: string[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  confirmLabel: string;
}

export interface DownloadResource {
  id: string;
  label: string;
  description: string;
  href: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: { id: string; label: string }[];
  correctOptionId: string;
  explanation: string;
}

export interface LessonQuiz {
  passingScorePercent: number;
  questions: QuizQuestion[];
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  estMinutes: number;
  contentBlocks?: LessonContentBlock[];
  scenario?: ScenarioContent;
  checklist?: ChecklistItem[];
  quiz?: LessonQuiz;
  downloads?: DownloadResource[];
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface CourseRoleMapping {
  required: boolean;
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced';
  estMinutes: number;
  roleMappings: Record<string, CourseRoleMapping>;
  prerequisites: string[];
  objectives: string[];
  requirements: string[];
  assessments: string[];
  sections: Section[];
}

export interface TrainingCatalog {
  roles: Role[];
  courses: Course[];
}

const DEFAULT_CATEGORY = 'Compliance & Security';

const difficultyFromOrder = (order: number): Course['difficulty'] => {
  if (order <= 1) return 'Foundational';
  if (order <= 4) return 'Intermediate';
  return 'Advanced';
};

const buildObjectives = (title: string): string[] => {
  const base = title.replace(/\([^)]*\)/g, '').trim();
  return [
    `Explain the purpose and scope of ${base.toLowerCase()}.`,
    `Apply ${base.toLowerCase()} procedures to realistic, de-identified scenarios.`,
    `Identify compliance risks in ${base.toLowerCase()} workflows and choose the correct escalation path.`,
    `Document completion evidence for ${base.toLowerCase()} tasks using required formats.`,
  ];
};

const buildLessonIntro = (moduleTitle: string, lessonTitle: string): string => {
  const moduleBase = moduleTitle.replace(/\([^)]*\)/g, '').trim();
  const lessonBase = lessonTitle.replace(/\d+\)|\d+\./g, '').trim();
  return [
    `**You will learn:** The key steps in **${lessonBase}** and how they fit within **${moduleBase}**.`,
    `**Why this matters:** ${moduleBase} tasks are audited for completeness and accuracy, so consistent execution protects clients and keeps your team compliant.`,
    `**Do this in your workflow:** Follow the ${moduleBase} checklist, document decisions in the tracking system, and escalate when requirements are unclear.`,
    `**Common mistakes to avoid:** Skipping prerequisite checks, using unapproved shortcuts, or failing to document completion evidence.`,
  ].join('\n\n');
};

const buildScenario = (moduleTitle: string): ScenarioContent => {
  const moduleBase = moduleTitle.replace(/\([^)]*\)/g, '').trim();
  return {
    prompt: `You are assigned a task in ${moduleBase} and notice a required approval is missing in the tracking system. What should you do before continuing?`,
    modelAnswer:
      'Pause the task, document the missing approval, and escalate through the defined coordinator or supervisor channel before proceeding.',
    guidance: [
      'Confirm the required approval or prerequisite is documented.',
      'Notify the training coordinator or supervisor using the approved escalation path.',
      'Record the escalation and resolution timestamp in the tracking system.',
    ],
  };
};

const buildQuickCheckQuiz = (moduleTitle: string): LessonQuiz => {
  const moduleBase = moduleTitle.replace(/\([^)]*\)/g, '').trim();
  return {
    passingScorePercent: 80,
    questions: [
      {
        id: `${moduleBase}-qc-1`,
        prompt: `Which action aligns with ${moduleBase} requirements when a prerequisite is missing?`,
        options: [
          { id: 'a', label: 'Proceed to keep momentum and fill gaps later.' },
          { id: 'b', label: 'Pause, document the gap, and escalate before continuing.' },
          { id: 'c', label: 'Ask a peer for a quick summary and move on.' },
        ],
        correctOptionId: 'b',
        explanation:
          'Compliance policy requires you to stop and escalate when prerequisites are missing to prevent audit gaps.',
      },
      {
        id: `${moduleBase}-qc-2`,
        prompt: `Why is documentation required in ${moduleBase} workflows?`,
        options: [
          { id: 'a', label: 'It reduces meetings but is optional.' },
          { id: 'b', label: 'It creates an audit trail that verifies completion and decisions.' },
          { id: 'c', label: 'It is only needed for optional tasks.' },
        ],
        correctOptionId: 'b',
        explanation:
          'Documentation creates the evidence needed to verify compliance and completion timing.',
      },
      {
        id: `${moduleBase}-qc-3`,
        prompt: `Which escalation path best fits ${moduleBase} issues?`,
        options: [
          { id: 'a', label: 'Continue alone and resolve after the deadline.' },
          { id: 'b', label: 'Escalate to the training coordinator or supervisor immediately.' },
          { id: 'c', label: 'Post in a general chat channel and wait for replies.' },
        ],
        correctOptionId: 'b',
        explanation:
          'Escalations must follow the defined coordinator or supervisor path to protect timelines and compliance.',
      },
    ],
  };
};

const buildCourseAssessment = (courseTitle: string): LessonQuiz => {
  const base = courseTitle.replace(/\([^)]*\)/g, '').trim();
  return {
    passingScorePercent: 80,
    questions: [
      {
        id: `${base}-final-1`,
        prompt: `What is the primary purpose of ${base}?`,
        options: [
          { id: 'a', label: 'Provide optional tips only.' },
          { id: 'b', label: 'Establish consistent, compliant workflows and documentation.' },
          { id: 'c', label: 'Replace manager oversight.' },
        ],
        correctOptionId: 'b',
        explanation: 'The course standardizes workflows, documentation, and escalation to meet compliance expectations.',
      },
      {
        id: `${base}-final-2`,
        prompt: 'When should you pause and escalate during training tasks?',
        options: [
          { id: 'a', label: 'Only after a deadline is missed.' },
          { id: 'b', label: 'Whenever prerequisites, approvals, or requirements are unclear.' },
          { id: 'c', label: 'Never, because escalation slows progress.' },
        ],
        correctOptionId: 'b',
        explanation: 'Training policy requires escalation when requirements are unclear to prevent compliance gaps.',
      },
      {
        id: `${base}-final-3`,
        prompt: 'Which action best demonstrates compliant documentation?',
        options: [
          { id: 'a', label: 'Saving notes locally without timestamps.' },
          { id: 'b', label: 'Recording completion evidence with timestamps in the tracking system.' },
          { id: 'c', label: 'Sending a private message to a peer.' },
        ],
        correctOptionId: 'b',
        explanation: 'Official tracking systems capture timestamps and evidence required for audits.',
      },
      {
        id: `${base}-final-4`,
        prompt: 'Which statement matches HIPAA-aligned training expectations?',
        options: [
          { id: 'a', label: 'Use only fictional or de-identified examples.' },
          { id: 'b', label: 'Share real patient details for realism.' },
          { id: 'c', label: 'Use personal email for documentation.' },
        ],
        correctOptionId: 'a',
        explanation: 'Training content must use fictional or de-identified examples and avoid PHI.',
      },
      {
        id: `${base}-final-5`,
        prompt: 'What should you do after completing a lesson?',
        options: [
          { id: 'a', label: 'Mark it complete and confirm next steps in the outline.' },
          { id: 'b', label: 'Skip to unrelated content.' },
          { id: 'c', label: 'Wait for a supervisor to mark it for you.' },
        ],
        correctOptionId: 'a',
        explanation: 'Marking completion updates progress and confirms readiness for the next lesson.',
      },
    ],
  };
};

const buildChecklist = (moduleTitle: string): ChecklistItem[] => {
  const moduleBase = moduleTitle.replace(/\([^)]*\)/g, '').trim();
  return [
    {
      id: `${moduleBase}-cl-1`,
      text: `Verified prerequisites for ${moduleBase}.`,
      confirmLabel: 'I confirmed prerequisites.',
    },
    {
      id: `${moduleBase}-cl-2`,
      text: `Documented completion evidence for ${moduleBase} tasks.`,
      confirmLabel: 'I documented evidence.',
    },
    {
      id: `${moduleBase}-cl-3`,
      text: `Escalated blockers using the approved path for ${moduleBase}.`,
      confirmLabel: 'I escalated blockers correctly.',
    },
  ];
};

const legacyCourses = (curriculum as any).courses || [];

const courses: Course[] = legacyCourses.map((course: any) => {
  const objectives = buildObjectives(course.title);
  const requirements = [
    'Complete lessons in order to satisfy prerequisite sequencing.',
    'Use only fictional or de-identified examples in all responses.',
    'Document completion evidence in the tracking system.',
  ];
  const assessments = ['Module quick checks', 'Scenario practice', 'Final knowledge check'];

  const sections: Section[] = [];
  const overviewSection: Section = {
    id: `${course.id}-overview`,
    title: 'Course overview',
    lessons: [
      {
        id: `${course.id}-overview-1`,
        title: 'Welcome and learning objectives',
        type: 'read',
        estMinutes: 6,
        contentBlocks: [
          {
            type: 'markdown',
            content: normalizeCourseContent(
              [
                `**You will learn:**`,
                ...objectives.map((objective) => `- ${objective}`),
                '',
                '**Why this matters:** Consistent training ensures compliant workflows and reliable audit evidence across every client engagement.',
              ].join('\n')
            ),
          },
        ],
      },
      {
        id: `${course.id}-overview-2`,
        title: 'Requirements and prerequisites',
        type: 'read',
        estMinutes: 4,
        contentBlocks: [
          {
            type: 'markdown',
            content: normalizeCourseContent(
              [
                '**Requirements:**',
                ...requirements.map((item) => `- ${item}`),
                '',
                '**Prerequisites:**',
                ...(course.prerequisites && course.prerequisites.length
                  ? course.prerequisites.map((item: string) => `- ${item}`)
                  : ['- No prerequisites listed.']),
              ].join('\n')
            ),
          },
        ],
      },
      {
        id: `${course.id}-overview-3`,
        title: 'Assessment approach',
        type: 'read',
        estMinutes: 4,
        contentBlocks: [
          {
            type: 'markdown',
            content: normalizeCourseContent(
              [
                '**Assessments included:**',
                ...assessments.map((item) => `- ${item}`),
                '',
                'You must pass the final knowledge check with an 80% score or higher. Retakes are allowed after review.',
              ].join('\n')
            ),
          },
        ],
      },
    ],
  };
  sections.push(overviewSection);

  (course.modules || []).forEach((module: any, index: number) => {
    const lessons: Lesson[] = (module.lessons || []).map((lesson: any) => ({
      id: lesson.id,
      title: lesson.title,
      type: 'read',
      estMinutes: Math.max(4, Math.round((module.estimatedMinutes || 20) / Math.max(module.lessons?.length || 1, 1))),
      contentBlocks: [
        {
          type: 'markdown',
          content: normalizeCourseContent(
            `${buildLessonIntro(module.title, lesson.title)}\n\n---\n\n${lesson.contentMarkdown || ''}`
          ),
        },
      ],
    }));

    lessons.push({
      id: `${module.id}-scenario`,
      title: `${module.title} scenario practice`,
      type: 'scenario',
      estMinutes: 8,
      scenario: buildScenario(module.title),
      contentBlocks: [
        {
          type: 'markdown',
          content: normalizeCourseContent(
            '**Scenario guidance:** Use the prompt below to practice decision-making. Compare your response to the model answer and guidance checklist.'
          ),
        },
      ],
    });

    lessons.push({
      id: `${module.id}-quick-check`,
      title: `${module.title} quick check`,
      type: 'quiz',
      estMinutes: 10,
      quiz: buildQuickCheckQuiz(module.title),
      contentBlocks: [
        {
          type: 'markdown',
          content: normalizeCourseContent(
            'Answer each question to confirm your understanding before moving to the next module.'
          ),
        },
      ],
    });

    lessons.push({
      id: `${module.id}-checklist`,
      title: `${module.title} workflow checklist`,
      type: 'checklist',
      estMinutes: 6,
      checklist: buildChecklist(module.title),
      contentBlocks: [
        {
          type: 'markdown',
          content: normalizeCourseContent('Confirm each operational step before marking the module complete.'),
        },
      ],
    });

    sections.push({
      id: module.id,
      title: module.title,
      lessons,
    });
  });

  sections.push({
    id: `${course.id}-wrap-up`,
    title: 'Course completion',
    lessons: [
      {
        id: `${course.id}-final-assessment`,
        title: 'Final knowledge check',
        type: 'quiz',
        estMinutes: 12,
        quiz: buildCourseAssessment(course.title),
        contentBlocks: [
          {
            type: 'markdown',
            content: normalizeCourseContent(
              'Complete the final knowledge check to validate readiness for role-based work.'
            ),
          },
        ],
      },
      {
        id: `${course.id}-completion-summary`,
        title: 'Completion summary and next steps',
        type: 'read',
        estMinutes: 6,
        contentBlocks: [
          {
            type: 'markdown',
            content: normalizeCourseContent(
              [
                '**Completion summary:** You have reviewed core procedures, practiced scenarios, and confirmed readiness through knowledge checks.',
                '',
                '**Next recommended step:** Continue to the next course in your role learning path to maintain sequencing and compliance continuity.',
                '',
                'Remember: Completion does not confer HIPAA certification. Training content uses fictional or de-identified examples only.',
              ].join('\n')
            ),
          },
        ],
      },
    ],
  });

  const roleMappings: Record<string, CourseRoleMapping> = {};
  (roles as Role[]).forEach((role) => {
    roleMappings[role.id] = {
      required: true,
      order: (course.order ?? 0) + 1,
    };
  });

  return {
    id: course.id,
    title: course.title,
    description:
      course.description ||
      'Structured training covering foundational workflows, compliance expectations, and audit-ready documentation standards.',
    tags: (course.roleTags || course.audience || []).filter(Boolean).slice(0, 4),
    category: DEFAULT_CATEGORY,
    difficulty: difficultyFromOrder(course.order ?? 0),
    estMinutes: course.estimatedMinutes || 60,
    roleMappings,
    prerequisites: course.prerequisites || [],
    objectives,
    requirements,
    assessments,
    sections,
  };
});

export const trainingCatalog: TrainingCatalog = {
  roles: roles as Role[],
  courses,
};

export const getCourseById = (courseId: string) => trainingCatalog.courses.find((course) => course.id === courseId);

export const getLessonById = (courseId: string, lessonId: string) => {
  const course = getCourseById(courseId);
  if (!course) return null;
  for (const section of course.sections) {
    const lesson = section.lessons.find((entry) => entry.id === lessonId);
    if (lesson) return { lesson, section };
  }
  return null;
};

export const flattenLessons = (course: Course): Lesson[] => course.sections.flatMap((section) => section.lessons);
