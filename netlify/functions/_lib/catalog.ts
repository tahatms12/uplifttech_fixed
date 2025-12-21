import fs from 'fs';
import path from 'path';

export interface CurriculumMetadata {
  missing_fields: string[];
}

export interface CatalogAssessmentQuestion {
  id: string;
  question: string;
  answerKey?: string | string[];
}

export interface CatalogAssessment {
  type: 'quiz' | 'exam' | 'practical';
  questions?: CatalogAssessmentQuestion[];
  passingScore?: number;
  retakePolicy?: string;
}

export interface CatalogLesson {
  id: string;
  title: string;
  contentMarkdown: string;
  resources?: string[];
  checks?: CatalogAssessment[];
  order: number;
  metadata?: CurriculumMetadata;
}

export interface CatalogModule {
  id: string;
  title: string;
  description?: string;
  objectives?: string[];
  estimatedMinutes?: number;
  lessons: CatalogLesson[];
  assessment?: CatalogAssessment;
  order: number;
  metadata?: CurriculumMetadata;
}

export interface CatalogCourse {
  id: string;
  title: string;
  description?: string;
  audience?: string[];
  roleTags?: string[];
  prerequisites?: string[];
  estimatedMinutes?: number;
  modules: CatalogModule[];
  order: number;
  status: 'published' | 'draft';
  metadata?: CurriculumMetadata;
}

export interface CurriculumData {
  curriculumVersion: string;
  generatedAt: string;
  courses: CatalogCourse[];
}

export interface QuizDefinition {
  courseId: string;
  quizId: string;
  questions: { question: string; id?: string }[];
  answerKey: (string | string[])[];
  passingThresholdPercent: number;
  lessonTitle?: string;
  moduleTitle?: string;
}

let cachedCatalog: CurriculumData | null = null;

function catalogPath(): string {
  return path.resolve(process.cwd(), 'src/data/training/exports/curriculum.generated.json');
}

function loadCatalogFile(): CurriculumData {
  if (cachedCatalog) return cachedCatalog;
  try {
    const file = fs.readFileSync(catalogPath(), 'utf-8');
    const parsed = JSON.parse(file);
    cachedCatalog = {
      curriculumVersion: parsed?.curriculumVersion || '',
      generatedAt: parsed?.generatedAt || '',
      courses: Array.isArray(parsed?.courses) ? parsed.courses : [],
    };
  } catch (err) {
    cachedCatalog = { curriculumVersion: '', generatedAt: '', courses: [] };
  }
  return cachedCatalog;
}

function normalizeAnswerKey(assessment?: CatalogAssessment): (string | string[])[] {
  if (!assessment) return [];
  if (Array.isArray(assessment.questions)) {
    return assessment.questions.map((q) => {
      if (Array.isArray(q.answerKey)) return q.answerKey;
      if (typeof q.answerKey === 'string') return q.answerKey;
      return '';
    });
  }
  return [];
}

function traverseQuizzes(course: CatalogCourse): QuizDefinition[] {
  const quizzes: QuizDefinition[] = [];
  for (const module of course.modules || []) {
    for (const lesson of module.lessons || []) {
      const check = lesson.checks?.find((entry) => entry.questions && entry.questions.length);
      if (!check || !check.questions) continue;
      const quizId = `${course.id}:${lesson.id}`;
      quizzes.push({
        courseId: course.id,
        quizId,
        questions: check.questions.map((q) => ({ question: q.question, id: q.id })),
        answerKey: normalizeAnswerKey(check),
        passingThresholdPercent: check.passingScore ?? 80,
        lessonTitle: lesson.title,
        moduleTitle: module.title,
      });
    }
  }
  return quizzes;
}

export function getCurriculumVersion(): string {
  return loadCatalogFile().curriculumVersion || '';
}

export function getCatalogVersion(): string {
  return loadCatalogFile().generatedAt || '';
}

export function getCourse(courseId: string): CatalogCourse | null {
  const catalog = loadCatalogFile();
  return catalog.courses.find((c) => c.id === courseId) || null;
}

export function getQuiz(courseId: string, quizId: string): QuizDefinition | null {
  const course = getCourse(courseId);
  if (!course) return null;
  const quizzes = traverseQuizzes(course);
  const quiz = quizzes.find((q) => q.quizId === quizId);
  if (quiz) return quiz;
  return quizzes.find((q) => q.quizId.endsWith(quizId)) || null;
}

export function courseTitle(courseId: string): string {
  const course = getCourse(courseId);
  return course?.title || courseId;
}

export function listCatalogCourses(): CatalogCourse[] {
  return loadCatalogFile().courses || [];
}
