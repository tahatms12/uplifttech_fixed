import fs from 'fs';
import path from 'path';
import { parseCoursesTxt, CoursesAst, CourseAst, DayAst, StepAst } from './parseCoursesTxt';

const COURSE_SCHEMA_PATH = path.join(process.cwd(), 'src/data/training/courseCatalog.schema.json');
const COURSE_CATALOG_PATH = path.join(process.cwd(), 'src/data/training/courseCatalog.json');
const BUILDER_EXPORT_PATH = path.join(process.cwd(), 'src/data/training/exports/courseCatalog.builder.json');
const ROLES_PATH = path.join(process.cwd(), 'src/data/training/roles.json');
const TAGS_PATH = path.join(process.cwd(), 'src/data/training/tags.json');
const ROLE_COURSE_MAP_PATH = path.join(process.cwd(), 'src/data/training/roleCourseMap.json');

interface SourceBlock {
  lines: number[];
  text: string[];
}

interface Verification {
  verification_status: 'verified' | 'needs_review' | 'conflicting_sources';
  verification_notes: string;
  recommended_correction?: string;
  references?: { title: string; publisher?: string; link?: string; date?: string }[];
}

interface AssessmentQuestion {
  question: string;
  answer: string;
  rationale?: string;
}

interface StepNormalized {
  stepId: string;
  title: string;
  type: string;
  contentBlocks: string[];
  activities: string[];
  acceptanceCriteria: string[];
  assessment?: {
    questions: AssessmentQuestion[];
  };
  verification: Verification;
  roleRelevance: string[];
  source: SourceBlock;
}

interface DayNormalized {
  dayNumber: number;
  dayTitle: string;
  estimatedTimeMinutes: number;
  steps: StepNormalized[];
}

interface CourseNormalized {
  id: string;
  slug: string;
  title: string;
  summary: string;
  roles: string[];
  tags: string[];
  durationPlan: number;
  prerequisites: string[];
  outcomes: string[];
  days: DayNormalized[];
  source: SourceBlock;
}

interface RoleEntry {
  id: string;
  name: string;
  description: string;
  category?: string;
  active: boolean;
}

interface TagEntry {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

function buildSource(lines: number[], ast: CoursesAst): SourceBlock {
  const texts = lines.map((lineNumber) => {
    const line = ast.lines.find((l) => l.number === lineNumber);
    return line ? line.text : '';
  });
  return { lines, text: texts };
}

function normalizeStep(course: CourseAst, day: DayAst, step: StepAst, ast: CoursesAst, roleIds: string[]): StepNormalized {
  const stepId = `${course.slug || slugify(course.title)}-day-${day.dayNumber}-step-${day.steps.indexOf(step) + 1}`;
  const type = step.type || 'Learn';
  const assessmentQuestions: AssessmentQuestion[] = type === 'Check'
    ? [
        {
          question: `Checkpoint for ${step.title}`,
          answer: 'needs_review',
          rationale: 'Manual validation required for training check.',
        },
      ]
    : [];

  const verification: Verification = {
    verification_status: 'needs_review',
    verification_notes: 'Content derived from courses.txt source; pending SME verification.',
    recommended_correction: 'Confirm accuracy of procedures and update with references.',
  };

  return {
    stepId,
    title: step.title,
    type,
    contentBlocks: [step.content],
    activities: step.activities ? [step.activities] : [],
    acceptanceCriteria: step.acceptance ? [step.acceptance] : [],
    assessment: assessmentQuestions.length ? { questions: assessmentQuestions } : undefined,
    verification,
    roleRelevance: roleIds,
    source: buildSource([step.line], ast),
  };
}

function ensureStepTypesPresent(course: CourseNormalized) {
  const requiredTypes = ['Learn', 'Observe', 'Do', 'Simulate', 'Check', 'Document', 'Reflect'];
  const present = new Set(course.days.flatMap((d) => d.steps.map((s) => s.type)));
  requiredTypes.forEach((type) => {
    if (!present.has(type)) {
      // attach a needs_review flag to first step
      const firstStep = course.days[0]?.steps[0];
      if (firstStep) {
        firstStep.verification.verification_notes += ` Missing required step type ${type}; review course design.`;
      }
    }
  });
}

function normalizeCourse(course: CourseAst, ast: CoursesAst, roleIds: string[], tagIds: string[]): CourseNormalized {
  const slug = course.slug || slugify(course.title);
  const id = slug;
  const days: DayNormalized[] = course.days.map((day) => ({
    dayNumber: day.dayNumber,
    dayTitle: day.title,
    estimatedTimeMinutes: day.estimatedMinutes,
    steps: day.steps.map((step) => normalizeStep(course, day, step, ast, roleIds)),
  }));

  const normalized: CourseNormalized = {
    id,
    slug,
    title: course.title,
    summary: course.summary,
    roles: roleIds,
    tags: tagIds,
    durationPlan: 7,
    prerequisites: course.prerequisites,
    outcomes: course.outcomes,
    days,
    source: buildSource(
      Array.from({ length: ast.lines.length }, (_, idx) => idx + 1),
      ast
    ),
  };

  ensureStepTypesPresent(normalized);
  return normalized;
}

function buildRoles(courses: CourseAst[]): RoleEntry[] {
  const roleNames = new Set<string>();
  courses.forEach((course) => course.roles.forEach((role) => roleNames.add(role)));
  return Array.from(roleNames).map((name) => ({
    id: slugify(name),
    name,
    description: `${name} training pathway`,
    active: true,
  }));
}

function buildTags(courses: CourseAst[]): TagEntry[] {
  const tagNames = new Set<string>();
  courses.forEach((course) => course.tags.forEach((tag) => tagNames.add(tag)));
  return Array.from(tagNames).map((name) => ({
    id: slugify(name),
    name,
    description: `${name} related training content`,
    active: true,
  }));
}

function buildRoleCourseMap(roles: RoleEntry[], courses: CourseNormalized[]) {
  const map: Record<string, { requiredCourses: string[]; recommendedCourses: string[] }> = {};
  roles.forEach((role) => {
    map[role.id] = { requiredCourses: [], recommendedCourses: [] };
  });

  courses.forEach((course) => {
    course.roles.forEach((roleId) => {
      if (!map[roleId]) {
        map[roleId] = { requiredCourses: [], recommendedCourses: [] };
      }
      map[roleId].recommendedCourses.push(course.id);
    });
  });
  return map;
}

function buildNavigation(course: CourseNormalized) {
  const steps = course.days.flatMap((day) => day.steps.map((step) => ({ dayNumber: day.dayNumber, step })));
  return steps.map((entry, index) => ({
    stepId: entry.step.stepId,
    previousStep: index > 0 ? steps[index - 1].step.stepId : null,
    nextStep: index < steps.length - 1 ? steps[index + 1].step.stepId : null,
    dayNumber: entry.dayNumber,
  }));
}

function buildCatalog() {
  const ast = parseCoursesTxt(path.join(process.cwd(), 'courses.txt'));
  const roles = buildRoles(ast.courses);
  const tags = buildTags(ast.courses);

  const roleIdMap = new Map<string, string>();
  roles.forEach((role) => roleIdMap.set(role.name, role.id));
  const tagIdMap = new Map<string, string>();
  tags.forEach((tag) => tagIdMap.set(tag.name, tag.id));

  const courses: CourseNormalized[] = ast.courses.map((course) => {
    const roleIds = course.roles.map((r) => roleIdMap.get(r) || slugify(r));
    const tagIds = course.tags.map((t) => tagIdMap.get(t) || slugify(t));
    return normalizeCourse(course, ast, roleIds, tagIds);
  });

  const catalog = { courses };
  const builderExport = {
    courses: courses.map((course) => ({
      ...course,
      navigation: buildNavigation(course),
    })),
    filters: {
      byRole: roles.map((r) => ({ id: r.id, name: r.name })),
      byTag: tags.map((t) => ({ id: t.id, name: t.name })),
    },
  };

  fs.mkdirSync(path.dirname(COURSE_CATALOG_PATH), { recursive: true });
  fs.writeFileSync(COURSE_CATALOG_PATH, JSON.stringify(catalog, null, 2));
  fs.writeFileSync(BUILDER_EXPORT_PATH, JSON.stringify(builderExport, null, 2));
  fs.writeFileSync(ROLES_PATH, JSON.stringify(roles, null, 2));
  fs.writeFileSync(TAGS_PATH, JSON.stringify(tags, null, 2));
  fs.writeFileSync(ROLE_COURSE_MAP_PATH, JSON.stringify(buildRoleCourseMap(roles, courses), null, 2));

  const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {
      courses: { type: 'array' },
    },
    required: ['courses'],
  };
  fs.writeFileSync(COURSE_SCHEMA_PATH, JSON.stringify(schema, null, 2));
}

buildCatalog();
