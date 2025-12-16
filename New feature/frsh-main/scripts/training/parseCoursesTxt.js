import fs from 'fs';
import path from 'path';

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function parseCoursesTxt() {
  const filePath = path.resolve(process.cwd(), 'courses.txt');
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);
  const programOverview = [];
  const roles = [];
  let inRoleSection = false;
  for (const line of lines) {
    if (line.startsWith('### 1.2')) {
      inRoleSection = true;
      continue;
    }
    if (inRoleSection) {
      if (line.startsWith('### ')) {
        inRoleSection = false;
      } else if (line.trim().startsWith('*')) {
        const name = line.replace(/^\*\s*/, '').trim();
        if (name) {
          const id = slugify(name);
          roles.push({ id, name });
        }
      }
    }
    if (!inRoleSection && line.startsWith('## 1)')) {
      programOverview.push(line);
    }
    if (!inRoleSection && programOverview.length && !line.startsWith('### 1.2')) {
      programOverview.push(line);
    }
  }

  const courseHeadingRegex = /^###\s+([0-9]+\.[0-9]+)\s+COURSE\s+([0-9]+):\s+(.+)$/i;
  const courses = [];
  lines.forEach((line, idx) => {
    const match = line.match(courseHeadingRegex);
    if (match) {
      const [, , num, title] = match;
      const start = idx + 1;
      let end = lines.length;
      for (let j = idx + 1; j < lines.length; j++) {
        if (courseHeadingRegex.test(lines[j])) {
          end = j;
          break;
        }
      }
      const rawLines = lines.slice(start, end);
      const cleanTitle = title.trim();
      courses.push({
        id: `course-${num}`,
        slug: slugify(cleanTitle || `course-${num}`),
        title: cleanTitle,
        heading: line.trim(),
        rawLines,
      });
    }
  });

  return { programOverview, roles, courses, totalLines: lines.length };
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const parsed = parseCoursesTxt();
  const outPath = path.resolve(process.cwd(), 'src/data/training/parsedCourses.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(parsed, null, 2));
  console.log(`Parsed ${parsed.courses.length} courses with ${parsed.roles.length} roles.`);
}
