import fs from 'fs';
import path from 'path';

const parseList = (value = '') =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export function parseCoursesTxt(filePath) {
  const resolvedPath = path.resolve(filePath);
  const raw = fs.readFileSync(resolvedPath, 'utf-8');
  const lines = raw.split(/\r?\n/);
  const lineInfos = lines.map((text, idx) => ({ number: idx + 1, text }));

  const courses = [];
  let currentCourse = null;
  let currentDay = null;

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('Course:')) {
      if (currentCourse) courses.push(currentCourse);
      currentCourse = {
        line: index + 1,
        title: trimmed.replace('Course:', '').trim(),
        slug: '',
        summary: '',
        roles: [],
        tags: [],
        prerequisites: [],
        outcomes: [],
        days: [],
      };
      currentDay = null;
      return;
    }
    if (!currentCourse) return;

    if (trimmed.startsWith('Slug:')) {
      currentCourse.slug = trimmed.replace('Slug:', '').trim();
      return;
    }
    if (trimmed.startsWith('Summary:')) {
      currentCourse.summary = trimmed.replace('Summary:', '').trim();
      return;
    }
    if (trimmed.startsWith('Roles:')) {
      currentCourse.roles = parseList(trimmed.replace('Roles:', '').trim());
      return;
    }
    if (trimmed.startsWith('Tags:')) {
      currentCourse.tags = parseList(trimmed.replace('Tags:', '').trim());
      return;
    }
    if (trimmed.startsWith('Prerequisites:')) {
      const prereq = trimmed.replace('Prerequisites:', '').trim();
      currentCourse.prerequisites = prereq && prereq.toLowerCase() !== 'none' ? parseList(prereq) : [];
      return;
    }
    if (trimmed.startsWith('- ')) {
      currentCourse.outcomes.push(trimmed.replace('- ', '').trim());
      return;
    }
    if (trimmed.startsWith('Day ')) {
      const parts = trimmed.split('|').map((p) => p.trim());
      currentDay = {
        line: index + 1,
        dayNumber: Number(parts[0].replace('Day', '').trim()),
        title: parts[1] || '',
        estimatedMinutes: Number(parts[2]) || 0,
        steps: [],
      };
      currentCourse.days.push(currentDay);
      return;
    }
    if (trimmed.startsWith('Step') && currentDay) {
      const parts = trimmed.split('|').map((p) => p.trim());
      currentDay.steps.push({
        line: index + 1,
        type: parts[1] || 'Learn',
        title: parts[2] || '',
        content: parts[3] || '',
        activities: parts[4] || '',
        acceptance: parts[5] || '',
      });
    }
  });

  if (currentCourse) courses.push(currentCourse);
  return { lines: lineInfos, courses };
}
