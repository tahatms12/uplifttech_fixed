const INVISIBLE_CHARS = /[\u200B\u200C\u200D\u2060\uFEFF\u00AD\u200E\u200F\u202A-\u202E]/g;
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const BULLET_CHARS = /[•◦▪▫]/g;

const splitByCodeFences = (input) => {
  const segments = [];
  const regex = /```[\s\S]*?```/g;
  let lastIndex = 0;
  let match = null;
  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: input.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'code', content: match[0] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < input.length) {
    segments.push({ type: 'text', content: input.slice(lastIndex) });
  }
  return segments;
};

const applyRule = (input, rule, transform, changes) => {
  const output = transform(input);
  if (output !== input) {
    changes.push({
      rule,
      before: input.slice(0, 160),
      after: output.slice(0, 160),
    });
  }
  return output;
};

const normalizeTextBlock = (input, changes) => {
  let value = input;

  value = applyRule(value, 'Unicode NFC + BOM removal', (text) => text.replace(/^\uFEFF/, '').normalize('NFC'), changes);
  value = applyRule(
    value,
    'Remove invisible/control characters',
    (text) => text.replace(INVISIBLE_CHARS, '').replace(CONTROL_CHARS, ''),
    changes
  );
  value = applyRule(
    value,
    'Normalize quotes/apostrophes',
    (text) => text.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/`([^`\n]*\s[^`\n]*)`/g, '"$1"'),
    changes
  );
  value = applyRule(value, 'Normalize dashes/ellipses', (text) => text.replace(/[–—]/g, '-').replace(/…/g, '...'), changes);
  value = applyRule(
    value,
    'Normalize bullets',
    (text) =>
      text
        .replace(BULLET_CHARS, '-')
        .split('\n')
        .map((line) => line.replace(/^(\s*)-\s*/, '$1- '))
        .join('\n'),
    changes
  );

  value = applyRule(
    value,
    'Normalize whitespace',
    (text) => {
      const lines = text.split('\n').map((line) => line.replace(/[ \t]{2,}/g, ' ').replace(/\s+$/g, ''));
      const collapsed = lines.join('\n');
      return collapsed.replace(/\n{3,}/g, '\n\n');
    },
    changes
  );

  value = applyRule(
    value,
    'Normalize headings',
    (text) => {
      const lines = text.split('\n');
      const next = [];
      lines.forEach((line, index) => {
        let current = line;
        if (/^#{1,6}\S/.test(current)) {
          current = current.replace(/^#{1,6}/, (match) => `${match} `);
        }
        const isHeading = /^#{1,6}\s/.test(current);
        if (isHeading && next.length && next[next.length - 1].trim() !== '') {
          next.push('');
        }
        next.push(current);
        const nextLine = lines[index + 1];
        if (isHeading && nextLine && nextLine.trim() !== '') {
          next.push('');
        }
      });
      return next.join('\n').replace(/\n{3,}/g, '\n\n');
    },
    changes
  );

  value = applyRule(
    value,
    'Normalize markdown links',
    (text) => text.replace(/\]\s+\(/g, '](').replace(/\(\s+/g, '('),
    changes
  );

  value = applyRule(
    value,
    'Fix simple tables',
    (text) => {
      const lines = text.split('\n');
      const output = [];
      for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i];
        output.push(line);
        const nextLine = lines[i + 1];
        if (line.includes('|') && nextLine && nextLine.includes('|') && !/^\s*\|?\s*-+/.test(nextLine)) {
          const columns = line.split('|').length;
          const separator = Array.from({ length: columns }, () => ' --- ').join('|');
          output.push(separator);
        }
      }
      return output.join('\n');
    },
    changes
  );

  return value;
};

export const normalizeCourseContentWithReport = (input) => {
  const changes = [];
  const segments = splitByCodeFences(String(input).replace(/\r\n?/g, '\n'));
  const normalized = segments
    .map((segment) => {
      if (segment.type === 'code') return segment.content;
      return normalizeTextBlock(segment.content, changes);
    })
    .join('');
  const fenceCount = (normalized.match(/```/g) || []).length;
  const output = fenceCount % 2 === 0 ? normalized : `${normalized}\n\`\`\``;
  return { output, changes };
};

export const normalizeCourseContent = (input) => normalizeCourseContentWithReport(input).output;
