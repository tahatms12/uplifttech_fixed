import crypto from 'crypto';
import fs from 'fs';

export interface CurriculumMetadata {
  missing_fields: string[];
}

export interface CurriculumAssessmentQuestion {
  id: string;
  question: string;
  answerKey?: string | string[];
}

export interface CurriculumAssessment {
  type: 'quiz' | 'exam' | 'practical';
  questions?: CurriculumAssessmentQuestion[];
  passingScore?: number;
  retakePolicy?: string;
}

export interface CurriculumLessonCheck extends CurriculumAssessment {
  title?: string;
}

export interface CurriculumLesson {
  id: string;
  title: string;
  contentMarkdown: string;
  resources?: string[];
  checks?: CurriculumLessonCheck[];
  order: number;
  metadata?: CurriculumMetadata;
}

export interface CurriculumModule {
  id: string;
  title: string;
  description?: string;
  objectives?: string[];
  estimatedMinutes?: number;
  lessons: CurriculumLesson[];
  assessment?: CurriculumAssessment;
  order: number;
  metadata?: CurriculumMetadata;
}

export interface CurriculumCourse {
  id: string;
  title: string;
  description?: string;
  audience?: string[];
  roleTags?: string[];
  prerequisites?: string[];
  estimatedMinutes?: number;
  modules: CurriculumModule[];
  order: number;
  status: 'published' | 'draft';
  metadata?: CurriculumMetadata;
}

export interface Curriculum {
  curriculumVersion: string;
  generatedAt: string;
  courses: CurriculumCourse[];
}

interface HeadingEntry {
  level: number;
  text: string;
  line: number;
}

const HEADING_REGEX = /^(#{1,6})\s+(.+)$/;

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function shortHash(value: string): string {
  return crypto.createHash('sha1').update(value).digest('hex').slice(0, 8);
}

function stripMarkdown(value: string): string {
  return value
    .replace(/\*\*/g, '')
    .replace(/__/g, '')
    .replace(/`/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function buildId(...parts: string[]): string {
  const path = parts.filter(Boolean).join('::');
  const slug = slugify(path).slice(0, 64) || 'item';
  return `${slug}-${shortHash(path)}`;
}

function parseHeadings(lines: string[]): HeadingEntry[] {
  return lines
    .map((line, idx) => {
      const match = line.match(HEADING_REGEX);
      if (!match) return null;
      return {
        level: match[1].length,
        text: stripMarkdown(match[2]),
        line: idx,
      } satisfies HeadingEntry;
    })
    .filter(Boolean) as HeadingEntry[];
}

function sliceSection(lines: string[], startLine: number, endLine: number): string[] {
  return lines.slice(startLine, endLine);
}

function parseKeyValue(lines: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  lines.forEach((line) => {
    const match = line.match(/^\*\*([^*]+):\*\*\s*(.*)$/);
    if (match) {
      map[stripMarkdown(match[1]).toLowerCase()] = stripMarkdown(match[2]);
    }
  });
  return map;
}

function parseDurationMinutes(value?: string): number | null {
  if (!value) return null;
  const normalized = value.toLowerCase();
  const hoursMatch = normalized.match(/([0-9]+(?:\.[0-9]+)?)\s*hours?/);
  if (hoursMatch) {
    const hours = parseFloat(hoursMatch[1]);
    return Number.isFinite(hours) ? Math.round(hours * 60) : null;
  }
  const minutesMatch = normalized.match(/([0-9]+)\s*min/);
  if (minutesMatch) {
    const minutes = parseInt(minutesMatch[1], 10);
    return Number.isFinite(minutes) ? minutes : null;
  }
  const rangeMatch = normalized.match(/([0-9]+)\s*-\s*([0-9]+)\s*hours?/);
  if (rangeMatch) {
    const low = parseInt(rangeMatch[1], 10);
    const high = parseInt(rangeMatch[2], 10);
    if (Number.isFinite(low) && Number.isFinite(high)) {
      return Math.round(((low + high) / 2) * 60);
    }
  }
  return null;
}

function splitList(value?: string): string[] {
  if (!value) return [];
  return value
    .split(/,|;|\+|\/| and /i)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function parseModuleDuration(title: string): number | null {
  const match = title.match(/\(([^)]+)\)/);
  if (!match) return null;
  return parseDurationMinutes(match[1]);
}

function parseModuleListEntries(courseLines: string[]): { title: string; rawLine: string }[] {
  const entries: { title: string; rawLine: string }[] = [];
  courseLines.forEach((line) => {
    const trimmed = line.trim();
    const match = trimmed.match(/^\*\*Module\s+[^:]+:\*\*\s*(.+)$/i);
    if (match) {
      entries.push({ title: stripMarkdown(match[1]).trim(), rawLine: trimmed });
    }
  });
  return entries;
}

function buildModulesFromList(courseTitle: string, entries: { title: string; rawLine: string }[]): CurriculumModule[] {
  return entries.map((entry, idx) => {
    const estimatedMinutes = parseModuleDuration(entry.title);
    const metadata: CurriculumMetadata = { missing_fields: [] };
    if (!estimatedMinutes) metadata.missing_fields.push('estimatedMinutes');
    metadata.missing_fields.push('moduleBuild');
    return {
      id: buildId(courseTitle, entry.title),
      title: entry.title,
      estimatedMinutes: estimatedMinutes ?? undefined,
      lessons: [
        {
          id: buildId(courseTitle, entry.title, entry.title),
          title: entry.title,
          contentMarkdown: entry.rawLine,
          order: 1,
          metadata: {
            missing_fields: ['lessonBuild'],
          },
        },
      ],
      order: idx + 1,
      metadata,
    };
  });
}

function extractQuestions(content: string): CurriculumAssessmentQuestion[] {
  const lines = content.split('\n');
  const questions: CurriculumAssessmentQuestion[] = [];
  let current: CurriculumAssessmentQuestion | null = null;
  const pushCurrent = () => {
    if (current) {
      questions.push(current);
      current = null;
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    const itemMatch = trimmed.match(/^\*\*Item\s+([0-9]+)[^*]*\*\*:?(.+)?$/i);
    if (itemMatch) {
      pushCurrent();
      const questionText = stripMarkdown(itemMatch[2] || '').trim();
      current = {
        id: `item-${itemMatch[1]}`,
        question: questionText,
      };
      return;
    }

    const answerMatch = trimmed.match(/^\*\*Answer:\*\*\s*(.+)$/i);
    if (answerMatch && current) {
      current.answerKey = stripMarkdown(answerMatch[1]);
      return;
    }

    if (current && trimmed && !trimmed.startsWith('**')) {
      current.question = `${current.question} ${stripMarkdown(trimmed)}`.trim();
    }
  });
  pushCurrent();
  return questions;
}

function lessonChecksFromContent(title: string, content: string): CurriculumLessonCheck[] | undefined {
  const lowerTitle = title.toLowerCase();
  if (!/knowledge check|quiz|exam/.test(lowerTitle)) return undefined;
  const questions = extractQuestions(content);
  const passingMatch = content.match(/([0-9]{1,3})%/);
  const passingScore = passingMatch ? parseInt(passingMatch[1], 10) : undefined;
  const type: CurriculumAssessment['type'] = lowerTitle.includes('exam') ? 'exam' : 'quiz';
  return [
    {
      title,
      type,
      questions: questions.length ? questions : undefined,
      passingScore: Number.isFinite(passingScore) ? passingScore : undefined,
    },
  ];
}

function parseLessons(
  moduleHeading: HeadingEntry,
  moduleEndLine: number,
  headings: HeadingEntry[],
  lines: string[],
  courseTitle: string,
  moduleTitle: string
): CurriculumLesson[] {
  const lessonHeadings = headings.filter(
    (heading) =>
      heading.line > moduleHeading.line &&
      heading.line < moduleEndLine &&
      heading.level === moduleHeading.level + 1
  );

  if (lessonHeadings.length === 0) {
    const content = sliceSection(lines, moduleHeading.line + 1, moduleEndLine).join('\n').trim();
    const metadata: CurriculumMetadata = { missing_fields: [] };
    if (!content) metadata.missing_fields.push('contentMarkdown');
    return [
      {
        id: buildId(courseTitle, moduleTitle, moduleTitle),
        title: moduleTitle,
        contentMarkdown: content,
        order: 1,
        metadata,
      },
    ];
  }

  return lessonHeadings.map((heading, idx) => {
    const nextHeading = lessonHeadings[idx + 1];
    const endLine = nextHeading ? nextHeading.line : moduleEndLine;
    const content = sliceSection(lines, heading.line + 1, endLine).join('\n').trim();
    const checks = lessonChecksFromContent(heading.text, content);
    const metadata: CurriculumMetadata = { missing_fields: [] };
    if (!content) metadata.missing_fields.push('contentMarkdown');
    return {
      id: buildId(courseTitle, moduleTitle, heading.text),
      title: heading.text,
      contentMarkdown: content,
      checks,
      order: idx + 1,
      metadata,
    };
  });
}

function parseModulesForCourse(
  courseTitle: string,
  moduleBuildsHeading: HeadingEntry,
  moduleBuildsEndLine: number,
  headings: HeadingEntry[],
  lines: string[]
): CurriculumModule[] {
  const moduleHeadings = headings.filter(
    (heading) =>
      heading.line > moduleBuildsHeading.line &&
      heading.line < moduleBuildsEndLine &&
      heading.level > moduleBuildsHeading.level &&
      /^module\s+/i.test(heading.text)
  );

  return moduleHeadings.map((heading, idx) => {
    const nextModuleHeading = moduleHeadings[idx + 1];
    const endLine = nextModuleHeading ? nextModuleHeading.line : moduleBuildsEndLine;
    const moduleTitleMatch = heading.text.match(/module\s+[^:]+:\s*(.*)/i);
    const moduleTitle = moduleTitleMatch ? moduleTitleMatch[1].trim() : heading.text;
    const estimatedMinutes = parseModuleDuration(heading.text) ?? parseModuleDuration(moduleTitle);
    const lessons = parseLessons(heading, endLine, headings, lines, courseTitle, moduleTitle);
    const metadata: CurriculumMetadata = { missing_fields: [] };
    if (!estimatedMinutes) metadata.missing_fields.push('estimatedMinutes');
    return {
      id: buildId(courseTitle, moduleTitle),
      title: moduleTitle,
      estimatedMinutes: estimatedMinutes ?? undefined,
      lessons,
      order: idx + 1,
      metadata,
    };
  });
}

function parseCourseMetadata(courseLines: string[]): {
  description?: string;
  audience?: string[];
  prerequisites?: string[];
  estimatedMinutes?: number;
  metadata: CurriculumMetadata;
} {
  const keyValues = parseKeyValue(courseLines);
  const metadata: CurriculumMetadata = { missing_fields: [] };
  const description = keyValues['purpose'];
  if (!description) metadata.missing_fields.push('description');
  const audience = splitList(keyValues['audience']);
  if (!audience.length) metadata.missing_fields.push('audience');
  const prerequisites = splitList(keyValues['prerequisites']);
  if (!prerequisites.length) metadata.missing_fields.push('prerequisites');
  const estimatedMinutes = parseDurationMinutes(keyValues['duration']);
  if (!estimatedMinutes) metadata.missing_fields.push('estimatedMinutes');
  return {
    description,
    audience: audience.length ? audience : undefined,
    prerequisites: prerequisites.length ? prerequisites : undefined,
    estimatedMinutes: estimatedMinutes ?? undefined,
    metadata,
  };
}

export function parseCurriculumMarkdown(markdown: string): Curriculum {
  const lines = markdown.split('\n');
  const headings = parseHeadings(lines);
  const version = sha256(markdown);

  const courseBuildsHeading =
    headings.find((heading) => /course builds/i.test(heading.text) && /\bB\)/i.test(heading.text)) ||
    headings.find((heading) => /course builds/i.test(heading.text));
  const moduleBuildsHeading =
    headings.find((heading) => /module builds/i.test(heading.text) && /\bC\)/i.test(heading.text)) ||
    headings.find((heading) => /module builds/i.test(heading.text) && !/course and module builds/i.test(heading.text));

  const courseBuildsStart = courseBuildsHeading ? courseBuildsHeading.line : 0;
  const courseBuildsEnd = moduleBuildsHeading ? moduleBuildsHeading.line : lines.length;

  const courseHeadings = headings.filter(
    (heading) =>
      heading.line > courseBuildsStart &&
      heading.line < courseBuildsEnd &&
      /course\s+\d+/i.test(heading.text) &&
      heading.text.includes(':')
  );

  const moduleBuildHeadings = headings.filter(
    (heading) => heading.line > courseBuildsEnd && /course\s+\d+\s+module builds/i.test(heading.text)
  );

  const courses: CurriculumCourse[] = courseHeadings.map((heading, idx) => {
    const nextCourse = courseHeadings[idx + 1];
    const endLine = nextCourse ? nextCourse.line : courseBuildsEnd;
    const courseTitleMatch = heading.text.match(/course\s+\d+:\s*(.*)/i);
    const courseTitle = courseTitleMatch ? courseTitleMatch[1].trim() : heading.text;
    const courseLines = sliceSection(lines, heading.line + 1, endLine);
    const courseMeta = parseCourseMetadata(courseLines);

    const courseNumberMatch = heading.text.match(/course\s+([0-9]+)/i);
    const courseNumber = courseNumberMatch ? parseInt(courseNumberMatch[1], 10) : idx;
    const matchingModuleBuild = moduleBuildHeadings.find((moduleHeading) =>
      moduleHeading.text.toLowerCase().includes(`course ${courseNumber}`)
    );
    const moduleEndLine = matchingModuleBuild
      ? headings.find((heading) => {
          if (heading.line <= matchingModuleBuild.line) return false;
          if (!/^course\s+\d+/i.test(heading.text)) return false;
          if (courseNumberMatch && new RegExp(`^course\\s+${courseNumberMatch[1]}\\b`, 'i').test(heading.text)) {
            return false;
          }
          return true;
        })?.line ?? lines.length
      : lines.length;

    const moduleListEntries = parseModuleListEntries(courseLines);
    const modulesFromBuild = matchingModuleBuild
      ? parseModulesForCourse(courseTitle, matchingModuleBuild, moduleEndLine, headings, lines)
      : [];
    const modules = modulesFromBuild.length ? modulesFromBuild : buildModulesFromList(courseTitle, moduleListEntries);

    return {
      id: buildId(courseTitle),
      title: courseTitle,
      description: courseMeta.description,
      audience: courseMeta.audience,
      roleTags: courseMeta.audience,
      prerequisites: courseMeta.prerequisites,
      estimatedMinutes: courseMeta.estimatedMinutes,
      modules,
      order: Number.isFinite(courseNumber) ? courseNumber : idx + 1,
      status: 'published',
      metadata: courseMeta.metadata,
    };
  });

  return {
    curriculumVersion: version,
    generatedAt: new Date().toISOString(),
    courses,
  };
}

export function loadCurriculumFile(path: string): Curriculum {
  const markdown = fs.readFileSync(path, 'utf-8');
  return parseCurriculumMarkdown(markdown);
}
