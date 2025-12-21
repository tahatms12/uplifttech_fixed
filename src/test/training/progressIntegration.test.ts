// @vitest-environment node
import crypto from 'crypto';
import { describe, expect, test } from 'vitest';
import { appendRow } from '../../../netlify/functions/_lib/csvStore';
import { buildProgress } from '../../../netlify/functions/_lib/completion';
import { getCatalogVersion, getCurriculumVersion, listCatalogCourses } from '../../../netlify/functions/_lib/catalog';

describe('training progress integration', () => {
  test('records completion with curriculum version and lesson id', async () => {
    const curriculumVersion = getCurriculumVersion();
    const catalogVersion = getCatalogVersion();
    const course = listCatalogCourses()[0];
    const module = course.modules[0];
    const lesson = module.lessons[0];
    const userId = crypto.randomUUID();
    const now = new Date().toISOString();

    await appendRow('lesson_time.csv', {
      user_id: userId,
      course_id: course.id,
      module_id: module.id,
      lesson_id: lesson.id,
      seconds_active: '200',
      updated_at: now,
      curriculum_version: curriculumVersion,
      catalog_version: catalogVersion,
    });

    await appendRow('step_completions.csv', {
      user_id: userId,
      course_id: course.id,
      step_id: lesson.id,
      completed_at: now,
      updated_at: now,
      curriculum_version: curriculumVersion,
      catalog_version: catalogVersion,
    });

    const progress = await buildProgress(userId, { persistCompletions: false });
    const courseProgress = progress.find((entry) => entry.courseId === course.id);
    expect(courseProgress).toBeTruthy();
    const lessonProgress = courseProgress?.lessons.find((entry) => entry.lessonId === lesson.id);
    expect(lessonProgress?.completed).toBe(true);
    expect(lessonProgress?.moduleId).toBe(module.id);
  });
});
