import fs from 'fs';
import path from 'path';

const COURSE_CATALOG_PATH = path.join(process.cwd(), 'src/data/training/courseCatalog.json');
const VALIDATION_REPORT_PATH = path.join(process.cwd(), 'reports/training/catalog-validation.md');
const VERIFICATION_REPORT_PATH = path.join(process.cwd(), 'reports/training/verification-pack.md');

function loadCatalog() {
  return JSON.parse(fs.readFileSync(COURSE_CATALOG_PATH, 'utf-8'));
}

function ensureReportsDir() {
  fs.mkdirSync(path.join(process.cwd(), 'reports/training'), { recursive: true });
}

function validate() {
  const catalog = loadCatalog();
  const errors = [];
  const warnings = [];

  if (!catalog.courses || !Array.isArray(catalog.courses) || !catalog.courses.length) {
    errors.push('No courses found in catalog.');
  }

  const verificationLines = [];
  const routeLines = ['/training', '/training/dashboard', '/training/course/:courseId', '/training/admin', '/training/verify'];

  catalog.courses?.forEach((course) => {
    if (course.durationPlan !== 7) errors.push(`Course ${course.id} missing 7-day plan.`);
    if (!course.days || course.days.length !== 7) errors.push(`Course ${course.id} does not have exactly 7 days.`);
    const types = new Set();
    course.days?.forEach((day) => {
      if (!day.steps || !day.steps.length) errors.push(`Course ${course.id} day ${day.dayNumber} missing steps.`);
      day.steps?.forEach((step) => {
        types.add(step.type);
        if (!step.acceptanceCriteria || !step.acceptanceCriteria.length) errors.push(`Step ${step.stepId} missing acceptance criteria.`);
        verificationLines.push(`- ${course.title} Day ${day.dayNumber} ${step.title}: ${step.verification.verification_status} (${step.verification.verification_notes})`);
      });
    });
    ['Learn', 'Observe', 'Do', 'Simulate', 'Check', 'Document', 'Reflect'].forEach((type) => {
      if (!types.has(type)) errors.push(`Course ${course.id} missing step type ${type}.`);
    });
  });

  ensureReportsDir();
  const validationReport = [
    '# Training Catalog Validation',
    '',
    `Courses: ${catalog.courses?.length || 0}`,
    '',
    '## Errors',
    errors.length ? errors.join('\n') : 'None',
    '',
    '## Warnings',
    warnings.length ? warnings.join('\n') : 'None',
    '',
    '## UI Routes',
    routeLines.join('\n'),
  ].join('\n');
  fs.writeFileSync(VALIDATION_REPORT_PATH, validationReport);

  const verificationReport = ['# Verification Pack', '', ...verificationLines].join('\n');
  fs.writeFileSync(VERIFICATION_REPORT_PATH, verificationReport);

  if (errors.length) {
    console.error('Validation failed:', errors.join('; '));
    process.exit(1);
  }
}

validate();
