import fs from 'fs';
import path from 'path';
import { parseCoursesTxt } from './parseCoursesTxt.js';

const STEP_TYPES = ['Learn', 'Observe', 'Do', 'Simulate', 'Check', 'Document', 'Reflect'];

function chunkContent(raw, parts) {
  const chunkSize = Math.ceil(raw.length / parts) || 1;
  const chunks = [];
  for (let i = 0; i < raw.length; i += chunkSize) {
    chunks.push(raw.slice(i, i + chunkSize));
  }
  while (chunks.length < parts) {
    chunks.push([]);
  }
  return chunks.slice(0, parts);
}

function buildSteps(course, roleIds) {
  const contentChunks = chunkContent(course.rawLines, STEP_TYPES.length);
  return STEP_TYPES.map((type, index) => {
    const chunk = contentChunks[index] || [];
    return {
      stepId: `${course.id}-day${index + 1}-step`,
      title: `${type} focus`,
      type,
      contentBlocks: [chunk.join('\n') || course.title],
      activities: [`Review course materials for ${type.toLowerCase()} phase.`],
      acceptanceCriteria: ['Document completion in progress tracker.', 'Summarize one actionable takeaway.'],
      assessment: {
        questions: [
          {
            prompt: `List one key concept from the ${type} segment for ${course.title}.`,
            answerKey: 'Learner articulates a concept from preserved source content.',
            rationale: 'Ensures recall from the original training materials.',
          },
        ],
      },
      verification: {
        verification_status: 'needs_review',
        verification_notes: 'Verification pending against authoritative sources.',
        references: [],
        lastReviewed: new Date().toISOString(),
      },
      roleRelevance: roleIds,
    };
  });
}

function buildDays(course, roleIds) {
  const steps = buildSteps(course, roleIds);
  return Array.from({ length: 7 }, (_, i) => {
    const daySteps = [steps[i % steps.length]];
    return {
      dayNumber: i + 1,
      dayTitle: `Day ${i + 1}`,
      estimatedTimeMinutes: 60,
      steps: daySteps,
    };
  });
}

function deriveTags(title) {
  const tags = [];
  if (/privacy|security|breach/i.test(title)) tags.push('privacy-security');
  if (/ICD-10|coding/i.test(title)) tags.push('coding-operations');
  if (/documentation|hygiene/i.test(title)) tags.push('documentation');
  if (tags.length === 0) tags.push('general-compliance');
  return Array.from(new Set(tags));
}

function deriveOutcomes(raw) {
  const firstLines = raw.filter((line) => line.trim()).slice(0, 5);
  if (firstLines.length) return firstLines;
  return ['Complete the course and meet passing standards stated in courses.txt.'];
}

function buildCatalog() {
  const parsed = parseCoursesTxt();
  const roleIds = parsed.roles.map((r) => r.id);
  const courses = parsed.courses.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    summary: c.rawLines.find((l) => l.trim())?.trim() || c.title,
    roles: roleIds,
    tags: deriveTags(c.title),
    durationPlan: 7,
    prerequisites: [],
    outcomes: deriveOutcomes(c.rawLines),
    source: { heading: c.heading, raw: c.rawLines },
    days: buildDays(c, roleIds),
  }));

  return {
    programOverview: parsed.programOverview,
    roles: parsed.roles.map((r) => ({
      id: r.id,
      name: r.name,
      description: `${r.name} as referenced in courses.txt`,
      active: true,
      category: 'program',
    })),
    courses,
  };
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const catalog = buildCatalog();
  const baseDir = path.resolve(process.cwd(), 'src/data/training');
  fs.mkdirSync(baseDir, { recursive: true });
  const outPath = path.join(baseDir, 'courseCatalog.json');
  fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2));

  const rolesPath = path.join(baseDir, 'roles.json');
  fs.writeFileSync(rolesPath, JSON.stringify(catalog.roles, null, 2));

  const tags = Array.from(new Set(catalog.courses.flatMap((c) => c.tags))).map((t) => ({ id: t, name: t }));
  const tagsPath = path.join(baseDir, 'tags.json');
  fs.writeFileSync(tagsPath, JSON.stringify(tags, null, 2));

  const roleCourseMap = catalog.roles.reduce((acc, role) => {
    acc[role.id] = {
      requiredCourses: catalog.courses.map((c) => c.id),
      recommendedCourses: [],
    };
    return acc;
  }, {});
  const roleCourseMapPath = path.join(baseDir, 'roleCourseMap.json');
  fs.writeFileSync(roleCourseMapPath, JSON.stringify(roleCourseMap, null, 2));

  const builderOut = catalog.courses.map((course) => {
    const stepsFlat = course.days.flatMap((d) => d.steps.map((s) => ({ ...s, dayNumber: d.dayNumber })));
    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      summary: course.summary,
      roles: course.roles,
      tags: course.tags,
      navigation: stepsFlat.map((s, idx) => ({
        stepId: s.stepId,
        dayNumber: s.dayNumber,
        previousStep: idx > 0 ? stepsFlat[idx - 1].stepId : null,
        nextStep: idx < stepsFlat.length - 1 ? stepsFlat[idx + 1].stepId : null,
      })),
      completionThresholdPerDay: 1,
    };
  });
  const builderPath = path.join(baseDir, 'exports', 'courseCatalog.builder.json');
  fs.mkdirSync(path.dirname(builderPath), { recursive: true });
  fs.writeFileSync(builderPath, JSON.stringify({ courses: builderOut }, null, 2));

  const verificationLines = ['# Verification Pack', '', 'All lessons require verification against external sources.', '', '## Lessons'];
  catalog.courses.forEach((course) => {
    course.days.forEach((day) => {
      day.steps.forEach((step) => {
        verificationLines.push(`- ${course.title} / Day ${day.dayNumber} / ${step.title}: ${step.verification.verification_status}`);
      });
    });
  });
  verificationLines.push('', '## Notes', '- No external references are attached; all entries marked needs_review pending primary-source confirmation.');
  const verificationPath = path.resolve(process.cwd(), 'reports/training/verification-pack.md');
  fs.mkdirSync(path.dirname(verificationPath), { recursive: true });
  fs.writeFileSync(verificationPath, verificationLines.join('\n'));

  console.log(`Wrote ${catalog.courses.length} courses to courseCatalog.json`);
}

export default buildCatalog;
