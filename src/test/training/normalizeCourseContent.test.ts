import { describe, expect, it } from 'vitest';
import { normalizeCourseContent } from '../../lib/normalizeCourseContent';

describe('normalizeCourseContent', () => {
  it('normalizes unicode and removes invisible characters', () => {
    const input = '\uFEFFHello\u200B world';
    expect(normalizeCourseContent(input)).toBe('Hello world');
  });

  it('normalizes quotes, dashes, and ellipses', () => {
    const input = '“Smart” — test…';
    expect(normalizeCourseContent(input)).toBe('"Smart" - test...');
  });

  it('normalizes bullets and spacing', () => {
    const input = '•Item one\n▪  Item two';
    expect(normalizeCourseContent(input)).toBe('- Item one\n- Item two');
  });

  it('fixes headings and link spacing', () => {
    const input = '###Title\nSee [link] (https://example.com)';
    expect(normalizeCourseContent(input)).toBe('### Title\n\nSee [link](https://example.com)');
  });

  it('preserves code fences', () => {
    const input = 'Text\n```\nconst value = `code`;\n```\n';
    expect(normalizeCourseContent(input)).toBe(input);
  });

  it('closes unbalanced code fences', () => {
    const input = '```\nconst value = 1;';
    expect(normalizeCourseContent(input)).toBe('```\nconst value = 1;\n```');
  });
});
