import crypto from 'crypto';
import fs from 'fs';

const HEADING_REGEX = /^(#{1,6})\s+(.+)$/;

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const shortHash = (value) => crypto.createHash('sha1').update(value).digest('hex').slice(0, 8);

const stripMarkdown = (value) =>
  value
    .replace(/\*\*/g, '')
    .replace(/__/g, '')
    .replace(/`/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const buildId = (...parts) => {
  const path = parts.filter(Boolean).join('::');
  const slug = slugify(path).slice(0, 64) || 'item';
  return `${slug}-${shortHash(path)}`;
};

const parseHeadings = (lines) =>
  lines
    .map((line, idx) => {
      const match = line.match(HEADING_REGEX);
      if (!match) return null;
      return {
        level: match[1].length,
        text: stripMarkdown(match[2]),
        line: idx,
      };
    })
    .filter(Boolean);

const sliceSection = (lines, startLine, endLine) => lines.slice(startLine, endLine);

const parseKeyValue = (lines) => {
  const map = {};
  lines.forEach((line) => {
    const match = line.match(/^\*\*([^*]+):\*\*\s*(.*)$/);
    if (match) {
      map[stripMarkdown(match[1]).toLowerCase()] = stripMarkdown(match[2]);
    }
  });
  return map;
};

const parseDurationMinutes = (value) => {
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
};

const splitList = (value) => {
  if (!value) return [];
  return value
    .split(/,|;|\+|\/| and /i)
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const parseModuleDuration = (title) => {
  const match = title.match(/\(([^)]+)\)/);
  if (!match) return null;
  return parseDurationMinutes(match[1]);
};

const parseModuleListEntries = (courseLines) => {
  const entries = [];
  courseLines.forEach((line) => {
    const trimmed = line.trim();
    const match = trimmed.match(/^\*\*Module\s+[^:]+:\*\*\s*(.+)$/i);
    if (match) {
      entries.push({ title: stripMarkdown(match[1]).trim(), rawLine: trimmed });
    }
  });
  return entries;
};

const buildModulesFromList = (courseTitle, entries) =>
  entries.map((entry, idx) => {
    const estimatedMinutes = parseModuleDuration(entry.title);
    const metadata = { missing_fields: [] };
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

const extractQuestions = (content) => {
  const lines = content.split('\n');
  const questions = [];
  let current = null;
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
};

const lessonChecksFromContent = (title, content) => {
  const lowerTitle = title.toLowerCase();
  if (!/knowledge check|quiz|exam/.test(lowerTitle)) return undefined;
  const questions = extractQuestions(content);
  const passingMatch = content.match(/([0-9]{1,3})%/);
  const passingScore = passingMatch ? parseInt(passingMatch[1], 10) : undefined;
  const type = lowerTitle.includes('exam') ? 'exam' : 'quiz';
  return [
    {
      title,
      type,
      questions: questions.length ? questions : undefined,
      passingScore: Number.isFinite(passingScore) ? passingScore : undefined,
    },
  ];
};

const parseLessons = (moduleHeading, moduleEndLine, headings, lines, courseTitle, moduleTitle) => {
  const lessonHeadings = headings.filter(
    (heading) =>
      heading.line > moduleHeading.line &&
      heading.line < moduleEndLine &&
      heading.level === moduleHeading.level + 1
  );

  if (lessonHeadings.length === 0) {
    const content = sliceSection(lines, moduleHeading.line + 1, moduleEndLine).join('\n').trim();
    const metadata = { missing_fields: [] };
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
    const metadata = { missing_fields: [] };
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
};

const parseModulesForCourse = (courseTitle, moduleBuildsHeading, moduleBuildsEndLine, headings, lines) => {
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
    const metadata = { missing_fields: [] };
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
};

const parseCourseMetadata = (courseLines) => {
  const keyValues = parseKeyValue(courseLines);
  const metadata = { missing_fields: [] };
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
};

export const parseCurriculumMarkdown = (markdown) => {
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

  const courses = courseHeadings.map((heading, idx) => {
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
};

export const loadCurriculumFile = (path) => {
  const markdown = fs.readFileSync(path, 'utf-8');
  return parseCurriculumMarkdown(markdown);
};
