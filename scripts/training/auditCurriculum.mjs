import fs from 'fs';
import path from 'path';
import { loadCurriculumFile } from './parseCurriculum.mjs';

const CURRICULUM_MARKDOWN_PATH = path.join(
  process.cwd(),
  'UPLIFT TECHNOLOGIES HEALTHCARE-OPERATIONS TRAINING CURRICULUM.md'
);
const REPORT_PATH = path.join(process.cwd(), 'reports/training/curriculum-audit.md');

const ensureReportsDir = () => {
  fs.mkdirSync(path.join(process.cwd(), 'reports/training'), { recursive: true });
};

const audit = () => {
  const curriculum = loadCurriculumFile(CURRICULUM_MARKDOWN_PATH);
  const errors = [];
  const warnings = [];
  const idSet = new Set();

  const addId = (id, label) => {
    if (idSet.has(id)) {
      errors.push(`Duplicate id detected for ${label}: ${id}`);
    }
    idSet.add(id);
  };

  curriculum.courses.forEach((course) => {
    if (!course.title) errors.push('Course with empty title detected.');
    addId(course.id, `course ${course.title}`);
    if (!course.modules.length) {
      errors.push(`Course "${course.title}" has no modules.`);
    }

    course.modules.forEach((module) => {
      if (!module.title) errors.push(`Module with empty title in course "${course.title}".`);
      addId(module.id, `module ${module.title}`);
      if (!module.lessons.length) {
        const isAssessmentModule = /assessment|exam|final/i.test(module.title);
        if (!isAssessmentModule) {
          errors.push(`Module "${module.title}" in course "${course.title}" has no lessons.`);
        }
      }

      module.lessons.forEach((lesson) => {
        if (!lesson.title) errors.push(`Lesson with empty title in module "${module.title}".`);
        addId(lesson.id, `lesson ${lesson.title}`);
      });
    });
  });

  ensureReportsDir();
  const report = [
    '# Curriculum Audit',
    '',
    `Curriculum Version: ${curriculum.curriculumVersion}`,
    `Generated At: ${curriculum.generatedAt}`,
    `Courses: ${curriculum.courses.length}`,
    `Modules: ${curriculum.courses.reduce((acc, course) => acc + course.modules.length, 0)}`,
    `Lessons: ${curriculum.courses.reduce(
      (acc, course) => acc + course.modules.reduce((mAcc, mod) => mAcc + mod.lessons.length, 0),
      0
    )}`,
    '',
    '## Errors',
    errors.length ? errors.join('\n') : 'None',
    '',
    '## Warnings',
    warnings.length ? warnings.join('\n') : 'None',
  ].join('\n');
  fs.writeFileSync(REPORT_PATH, report);

  if (errors.length) {
    console.error('Curriculum audit failed:', errors.join('; '));
    process.exit(1);
  }
};

audit();
