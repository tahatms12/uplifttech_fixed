import fs from 'node:fs/promises';
import path from 'node:path';

import { normalizeCourseContentWithReport } from '../../src/lib/normalizeCourseContent.mjs';

const SOURCES = [
  'src/data/training/exports/curriculum.generated.json',
  'src/data/training/courseCatalog.json',
  'src/data/training/exports/courseCatalog.builder.json',
  'UPLIFT TECHNOLOGIES HEALTHCARE-OPERATIONS TRAINING CURRICULUM.md',
];

const REPORT_PATH = 'reports/content-hygiene-report.md';

const skipKeys = new Set(['id', 'slug', 'href', 'courseId', 'moduleId', 'lessonId', 'quizId', 'roleId']);

const isPlainObject = (value) => Object.prototype.toString.call(value) === '[object Object]';

const normalizeStringField = (value, location, reportRows) => {
  const { output, changes } = normalizeCourseContentWithReport(value);
  if (output !== value) {
    changes.forEach((change) => {
      reportRows.push({
        location,
        rule: change.rule,
        before: change.before.replace(/\n/g, ' ').slice(0, 140),
        after: change.after.replace(/\n/g, ' ').slice(0, 140),
      });
    });
  }
  return output;
};

const normalizeRecursive = (value, location, reportRows) => {
  if (typeof value === 'string') {
    return normalizeStringField(value, location, reportRows);
  }
  if (Array.isArray(value)) {
    return value.map((entry, index) => normalizeRecursive(entry, `${location}[${index}]`, reportRows));
  }
  if (isPlainObject(value)) {
    const next = {};
    const idHint = value.id ? `#${value.id}` : '';
    for (const [key, entry] of Object.entries(value)) {
      if (skipKeys.has(key)) {
        next[key] = entry;
        continue;
      }
      const nextLocation = `${location}.${key}${idHint}`;
      next[key] = normalizeRecursive(entry, nextLocation, reportRows);
    }
    return next;
  }
  return value;
};

const backupFile = async (filePath) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${filePath}.bak-${timestamp}`;
  await fs.copyFile(filePath, backupPath);
  return backupPath;
};

const normalizeJsonFile = async (filePath, reportRows) => {
  const raw = await fs.readFile(filePath, 'utf-8');
  const parsed = JSON.parse(raw);
  const normalized = normalizeRecursive(parsed, filePath, reportRows);
  await backupFile(filePath);
  await fs.writeFile(filePath, `${JSON.stringify(normalized, null, 2)}\n`);
};

const normalizeMarkdownFile = async (filePath, reportRows) => {
  const raw = await fs.readFile(filePath, 'utf-8');
  const normalized = normalizeStringField(raw, filePath, reportRows);
  await backupFile(filePath);
  await fs.writeFile(filePath, normalized);
};

const writeReport = async (reportRows) => {
  const summary = reportRows.length
    ? `Total issues fixed: ${reportRows.length}`
    : 'No issues detected.';

  const tableHeader = [
    '| Location | Issue type | Original snippet | Result snippet |',
    '| --- | --- | --- | --- |',
  ];

  const rows = reportRows.map(
    (row) =>
      `| ${row.location} | ${row.rule} | ${row.before.replace(/\|/g, '\\|')} | ${row.after.replace(/\|/g, '\\|')} |`
  );

  const content = [
    '# Content Hygiene Report',
    '',
    summary,
    '',
    ...tableHeader,
    ...rows,
    '',
  ].join('\n');

  await fs.mkdir(path.dirname(REPORT_PATH), { recursive: true });
  await fs.writeFile(REPORT_PATH, content);
};

const run = async () => {
  const reportRows = [];
  for (const source of SOURCES) {
    const fullPath = path.resolve(source);
    if (!(await fs.stat(fullPath).catch(() => null))) continue;
    if (source.endsWith('.json')) {
      await normalizeJsonFile(fullPath, reportRows);
    } else {
      await normalizeMarkdownFile(fullPath, reportRows);
    }
  }
  await writeReport(reportRows);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
