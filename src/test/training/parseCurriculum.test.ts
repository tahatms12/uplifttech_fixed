// @vitest-environment node
import { describe, expect, test } from 'vitest';
import { parseCurriculumMarkdown } from '../../../scripts/training/parseCurriculum';

describe('parseCurriculumMarkdown', () => {
  test('parses courses, modules, and lessons from headings', () => {
    const markdown = `
# B) COURSE BUILDS

# COURSE 1: Sample Course

**Purpose:** Sample purpose
**Audience:** Role A, Role B
**Prerequisites:** None
**Duration:** 2 hours

# C) MODULE BUILDS

## COURSE 1 MODULE BUILDS

### MODULE 1: Module One (30 min)

#### 1) Entry-Level Primer

Primer content goes here.
`;

    const curriculum = parseCurriculumMarkdown(markdown);
    expect(curriculum.courses).toHaveLength(1);
    const course = curriculum.courses[0];
    expect(course.title).toBe('Sample Course');
    expect(course.modules).toHaveLength(1);
    const module = course.modules[0];
    expect(module.title).toBe('Module One (30 min)');
    expect(module.lessons).toHaveLength(1);
    expect(module.lessons[0].title).toContain('Entry-Level Primer');
  });
});
