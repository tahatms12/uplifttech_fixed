import fs from 'fs';
import path from 'path';

export interface LineInfo {
  number: number;
  text: string;
}

export interface StepAst {
  line: number;
  type: string;
  title: string;
  content: string;
  activities: string;
  acceptance: string;
}

export interface DayAst {
  line: number;
  dayNumber: number;
  title: string;
  estimatedMinutes: number;
  steps: StepAst[];
}

export interface CourseAst {
  line: number;
  title: string;
  slug: string;
  summary: string;
  roles: string[];
  tags: string[];
  prerequisites: string[];
  outcomes: string[];
  days: DayAst[];
}

export interface CoursesAst {
  lines: LineInfo[];
  courses: CourseAst[];
}

const parseList = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export function parseCoursesTxt(filePath: string): CoursesAst {
  const resolvedPath = path.resolve(filePath);
  const raw = fs.readFileSync(resolvedPath, 'utf-8');
  const lines = raw.split(/\r?\n/);
  const lineInfos: LineInfo[] = lines.map((text, idx) => ({ number: idx + 1, text }));

  const courses: CourseAst[] = [];
  let currentCourse: CourseAst | null = null;
  let currentDay: DayAst | null = null;

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return;
    }

    if (trimmed.startsWith('Course:')) {
      if (currentCourse) {
        courses.push(currentCourse);
      }
      const title = trimmed.replace('Course:', '').trim();
      currentCourse = {
        line: index + 1,
        title,
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

    if (!currentCourse) {
      return;
    }

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
      const outcome = trimmed.replace('- ', '').trim();
      currentCourse.outcomes.push(outcome);
      return;
    }

    if (trimmed.startsWith('Day ')) {
      const parts = trimmed.split('|').map((p) => p.trim());
      const dayNumber = Number(parts[0].replace('Day', '').trim());
      const title = parts[1] || `Day ${dayNumber}`;
      const estimatedMinutes = Number(parts[2]) || 0;
      currentDay = {
        line: index + 1,
        dayNumber,
        title,
        estimatedMinutes,
        steps: [],
      };
      currentCourse.days.push(currentDay);
      return;
    }

    if (trimmed.startsWith('Step') && currentDay) {
      const parts = trimmed.split('|').map((p) => p.trim());
      const type = parts[1] || 'Learn';
      const title = parts[2] || 'Lesson';
      const content = parts[3] || '';
      const activities = parts[4] || '';
      const acceptance = parts[5] || '';
      const step: StepAst = {
        line: index + 1,
        type,
        title,
        content,
        activities,
        acceptance,
      };
      currentDay.steps.push(step);
    }
  });

  if (currentCourse) {
    courses.push(currentCourse);
  }

  return { lines: lineInfos, courses };
}

if (typeof require !== 'undefined' && require.main === module) {
  const filePath = process.argv[2] || path.join(process.cwd(), 'courses.txt');
  const ast = parseCoursesTxt(filePath);
  console.log(JSON.stringify(ast, null, 2));
}
