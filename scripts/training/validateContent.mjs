import fs from 'node:fs/promises';
import path from 'node:path';

import { normalizeCourseContent } from '../../src/lib/normalizeCourseContent.mjs';

const SOURCES = [
  'src/data/training/exports/curriculum.generated.json',
  'src/data/training/courseCatalog.json',
  'src/data/training/exports/courseCatalog.builder.json',
  'UPLIFT TECHNOLOGIES HEALTHCARE-OPERATIONS TRAINING CURRICULUM.md',
];

const FORBIDDEN_CHARS = /[\u200B\u200C\u200D\u2060\uFEFF\u00AD\u200E\u200F\u202A-\u202E]/g;

const scanStrings = (value, failures, location) => {
  if (typeof value === 'string') {
    if (FORBIDDEN_CHARS.test(value)) {
      failures.push(`${location} contains forbidden invisible characters`);
    }
    const normalized = normalizeCourseContent(value);
    if (normalized !== value) {
      failures.push(`${location} is not normalized`);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => scanStrings(entry, failures, `${location}[${index}]`));
    return;
  }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, entry]) => scanStrings(entry, failures, `${location}.${key}`));
  }
};

const run = async () => {
  const failures = [];
  for (const source of SOURCES) {
    const fullPath = path.resolve(source);
    const stat = await fs.stat(fullPath).catch(() => null);
    if (!stat) continue;
    const raw = await fs.readFile(fullPath, 'utf-8');
    if (source.endsWith('.json')) {
      scanStrings(JSON.parse(raw), failures, source);
    } else {
      scanStrings(raw, failures, source);
    }
  }

  if (failures.length) {
    console.error('Content normalization validation failed:');
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }
  console.log('Content normalization validation passed.');
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
