import fs from 'fs';
import path from 'path';

export interface CatalogCourse {
  id: string;
  slug?: string;
  title: string;
  days?: {
    dayNumber?: number;
    dayTitle?: string;
    steps?: CatalogStep[];
  }[];
}

export interface CatalogStep {
  stepId: string;
  title?: string;
  type?: string;
  acceptanceCriteria?: string[];
  assessment?: {
    quizId?: string;
    questions?: { question: string; id?: string; answerKey?: string | string[] }[];
    answerKey?: (string | string[])[];
    passingThresholdPercent?: number;
  };
}

export interface QuizDefinition {
  courseId: string;
  quizId: string;
  questions: { question: string; id?: string }[];
  answerKey: (string | string[])[];
  passingThresholdPercent: number;
  stepTitle?: string;
  dayNumber?: number;
}

interface CatalogData {
  courses: CatalogCourse[];
  filters?: unknown;
}

let cachedCatalog: CatalogData | null = null;

function catalogPath(): string {
  return path.resolve(process.cwd(), 'src/data/training/exports/courseCatalog.builder.json');
}

function loadCatalogFile(): CatalogData {
  if (cachedCatalog) return cachedCatalog;
  try {
    const file = fs.readFileSync(catalogPath(), 'utf-8');
    const parsed = JSON.parse(file);
    cachedCatalog = { courses: Array.isArray(parsed?.courses) ? parsed.courses : [], filters: parsed?.filters };
  } catch (err) {
    cachedCatalog = { courses: [], filters: undefined };
  }
  return cachedCatalog;
}

function parseThreshold(step?: CatalogStep): number {
  const defaultThreshold = 80;
  const passingFromAssessment = step?.assessment?.passingThresholdPercent;
  if (typeof passingFromAssessment === 'number' && passingFromAssessment > 0) return passingFromAssessment;
  const candidates = step?.acceptanceCriteria || [];
  for (const entry of candidates) {
    const match = /([0-9]{1,3})%/.exec(entry || '');
    if (match) {
      const value = parseInt(match[1], 10);
      if (!Number.isNaN(value)) return value;
    }
  }
  return defaultThreshold;
}

function normalizeAnswerKey(step?: CatalogStep): (string | string[])[] {
  const assessment = step?.assessment;
  if (!assessment) return [];
  const explicit = (assessment as any).answerKey || (assessment as any).answers || assessment.passingAnswers;
  if (Array.isArray(explicit)) {
    return explicit as (string | string[])[];
  }
  if (Array.isArray(assessment.questions)) {
    return assessment.questions.map((q: any) => {
      if (Array.isArray(q?.answerKey)) return q.answerKey as string[];
      if (typeof q?.answerKey === 'string') return q.answerKey as string;
      return '';
    });
  }
  return [];
}

function traverseQuizzes(course: CatalogCourse): QuizDefinition[] {
  const quizzes: QuizDefinition[] = [];
  const days = course.days || [];
  for (const day of days) {
    const steps = day?.steps || [];
    for (const step of steps) {
      const assessment = step.assessment;
      if (!assessment || !Array.isArray(assessment.questions)) continue;
      const quizId = assessment.quizId || step.stepId;
      quizzes.push({
        courseId: course.id,
        quizId,
        questions: assessment.questions.map((q) => ({ question: q.question, id: q.id })),
        answerKey: normalizeAnswerKey(step),
        passingThresholdPercent: parseThreshold(step),
        stepTitle: step.title,
        dayNumber: day.dayNumber,
      });
    }
  }
  return quizzes;
}

export function getCourse(courseId: string): CatalogCourse | null {
  const catalog = loadCatalogFile();
  return catalog.courses.find((c) => c.id === courseId || c.slug === courseId) || null;
}

export function getQuiz(courseId: string, quizId: string): QuizDefinition | null {
  const course = getCourse(courseId);
  if (!course) return null;
  const quizzes = traverseQuizzes(course);
  const quiz = quizzes.find((q) => q.quizId === quizId);
  if (quiz) return quiz;
  // fallback discovery: match by stepId or partial suffix
  return quizzes.find((q) => q.quizId.endsWith(quizId)) || null;
}

export function courseTitle(courseId: string): string {
  const course = getCourse(courseId);
  return course?.title || course?.slug || courseId;
}

export function listCatalogCourses(): CatalogCourse[] {
  return loadCatalogFile().courses || [];
}
