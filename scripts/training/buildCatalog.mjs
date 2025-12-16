import fs from 'fs';
import path from 'path';
import { parseCoursesTxt } from './parseCoursesTxt.mjs';

const COURSE_SCHEMA_PATH = path.join(process.cwd(), 'src/data/training/courseCatalog.schema.json');
const COURSE_CATALOG_PATH = path.join(process.cwd(), 'src/data/training/courseCatalog.json');
const BUILDER_EXPORT_PATH = path.join(process.cwd(), 'src/data/training/exports/courseCatalog.builder.json');
const ROLES_PATH = path.join(process.cwd(), 'src/data/training/roles.json');
const TAGS_PATH = path.join(process.cwd(), 'src/data/training/tags.json');
const ROLE_COURSE_MAP_PATH = path.join(process.cwd(), 'src/data/training/roleCourseMap.json');

const slugify = (value = '') =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const buildSource = (lines, ast) => ({
  lines,
  text: lines.map((num) => ast.lines.find((l) => l.number === num)?.text || ''),
});

const normalizeStep = (course, day, step, ast, roleIds) => {
  const stepId = `${course.slug || slugify(course.title)}-day-${day.dayNumber}-step-${day.steps.indexOf(step) + 1}`;
  const type = step.type || 'Learn';
  return {
    stepId,
    title: step.title,
    type,
    contentBlocks: [step.content],
    activities: step.activities ? [step.activities] : [],
    acceptanceCriteria: step.acceptance ? [step.acceptance] : [],
    assessment: type === 'Check' ? { questions: [{ question: `Checkpoint for ${step.title}` }] } : undefined,
    verification: {
      verification_status: 'needs_review',
      verification_notes: 'Content derived from courses.txt source; pending SME verification.',
      recommended_correction: 'Confirm accuracy of procedures and update with references.',
    },
    roleRelevance: roleIds,
    source: buildSource([step.line], ast),
  };
};

const ensureStepTypesPresent = (course) => {
  const requiredTypes = ['Learn', 'Observe', 'Do', 'Simulate', 'Check', 'Document', 'Reflect'];
  const present = new Set(course.days.flatMap((d) => d.steps.map((s) => s.type)));
  requiredTypes.forEach((type) => {
    if (!present.has(type) && course.days[0]?.steps[0]) {
      course.days[0].steps[0].verification.verification_notes += ` Missing required step type ${type}; review course design.`;
    }
  });
};

const normalizeCourse = (course, ast, roleIds, tagIds) => {
  const slug = course.slug || slugify(course.title);
  const days = course.days.map((day) => ({
    dayNumber: day.dayNumber,
    dayTitle: day.title,
    estimatedTimeMinutes: day.estimatedMinutes,
    steps: day.steps.map((step) => normalizeStep(course, day, step, ast, roleIds)),
  }));
  const normalized = {
    id: slug,
    slug,
    title: course.title,
    summary: course.summary,
    roles: roleIds,
    tags: tagIds,
    durationPlan: 7,
    prerequisites: course.prerequisites,
    outcomes: course.outcomes,
    days,
    source: buildSource(Array.from({ length: ast.lines.length }, (_, idx) => idx + 1), ast),
  };
  ensureStepTypesPresent(normalized);
  return normalized;
};

const buildRoles = (courses) => {
  const roleNames = new Set();
  courses.forEach((course) => course.roles.forEach((role) => roleNames.add(role)));
  return Array.from(roleNames).map((name) => ({ id: slugify(name), name, description: `${name} training pathway`, active: true }));
};

const buildTags = (courses) => {
  const tagNames = new Set();
  courses.forEach((course) => course.tags.forEach((tag) => tagNames.add(tag)));
  return Array.from(tagNames).map((name) => ({ id: slugify(name), name, description: `${name} related training content`, active: true }));
};

const buildRoleCourseMap = (roles, courses) => {
  const map = {};
  roles.forEach((role) => {
    map[role.id] = { requiredCourses: [], recommendedCourses: [] };
  });
  courses.forEach((course) => {
    course.roles.forEach((roleId) => {
      if (!map[roleId]) map[roleId] = { requiredCourses: [], recommendedCourses: [] };
      map[roleId].recommendedCourses.push(course.id);
    });
  });
  return map;
};

const buildNavigation = (course) => {
  const steps = course.days.flatMap((day) => day.steps.map((step) => ({ dayNumber: day.dayNumber, step })));
  return steps.map((entry, index) => ({
    stepId: entry.step.stepId,
    previousStep: index > 0 ? steps[index - 1].step.stepId : null,
    nextStep: index < steps.length - 1 ? steps[index + 1].step.stepId : null,
    dayNumber: entry.dayNumber,
  }));
};

function buildCatalog() {
  const ast = parseCoursesTxt(path.join(process.cwd(), 'courses.txt'));
  const roles = buildRoles(ast.courses);
  const tags = buildTags(ast.courses);

  const roleIdMap = new Map();
  roles.forEach((role) => roleIdMap.set(role.name, role.id));
  const tagIdMap = new Map();
  tags.forEach((tag) => tagIdMap.set(tag.name, tag.id));

  const courses = ast.courses.map((course) => {
    const roleIds = course.roles.map((r) => roleIdMap.get(r) || slugify(r));
    const tagIds = course.tags.map((t) => tagIdMap.get(t) || slugify(t));
    return normalizeCourse(course, ast, roleIds, tagIds);
  });

  const catalog = { courses };
  const builderExport = {
    courses: courses.map((course) => ({ ...course, navigation: buildNavigation(course) })),
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
    properties: { courses: { type: 'array' } },
    required: ['courses'],
  };
  fs.writeFileSync(COURSE_SCHEMA_PATH, JSON.stringify(schema, null, 2));
}

buildCatalog();
