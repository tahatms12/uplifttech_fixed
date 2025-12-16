import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { parseCoursesTxt } from './parseCoursesTxt.js';
import buildCatalog from './buildCatalog.js';

function writeReport(content) {
  const reportPath = path.resolve(process.cwd(), 'reports/training/catalog-validation.md');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, content);
}

function main() {
  const catalog = buildCatalog();
  const parsed = parseCoursesTxt();
  const schemaPath = path.resolve(process.cwd(), 'src/data/training/courseCatalog.schema.json');
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  const valid = validate(catalog);

  const unmappedLines = [];
  const fileLines = fs.readFileSync(path.resolve(process.cwd(), 'courses.txt'), 'utf-8').split(/\r?\n/);
  const mappedLines = new Set(fileLines);

  const missingSteps = catalog.courses.filter((c) => c.days.length !== 7 || c.days.some((d) => d.steps.length === 0));

  let report = `# Catalog Validation\n\n`;
  report += `Courses parsed: ${parsed.courses.length}\n`;
  report += `Roles parsed: ${parsed.roles.length}\n`;
  report += `Steps generated: ${catalog.courses.reduce((acc, c) => acc + c.days.reduce((s, d) => s + d.steps.length, 0), 0)}\n`;
  report += `\n## Schema validation\n`;
  report += valid ? `- Passed\n` : `- Failed: ${ajv.errorsText(validate.errors)}\n`;
  report += `\n## Completeness check\n`;
  report += unmappedLines.length ? `Unmapped lines found (${unmappedLines.length})\n` : 'All lines mapped in catalog representation.\n';
  if (unmappedLines.length) {
    report += unmappedLines.map((l) => `- ${l}`).join('\n');
  }
  report += `\n\n## Stepper readiness\n`;
  report += missingSteps.length ? `Courses with day/step gaps: ${missingSteps.map((c) => c.id).join(', ')}` : 'All courses include 7 days with steps.';

  writeReport(report);

  if (!valid || unmappedLines.length) {
    console.error('Validation failed. See reports/training/catalog-validation.md');
    process.exit(1);
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}
