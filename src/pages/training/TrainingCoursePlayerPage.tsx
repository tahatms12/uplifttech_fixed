import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TrainingNoIndexHelmet from '../../components/training/TrainingNoIndexHelmet';
import { flattenLessons, getCourseById, getLessonById } from '../../data/training/trainingCatalog';
import CoursePlayerLayout from '../../components/training/CoursePlayerLayout';
import { progressService } from '../../components/training/ProgressService';
import { trainingApi } from '../../lib/trainingApi';

const TrainingCoursePlayerPage: React.FC = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const course = useMemo(() => (courseId ? getCourseById(courseId) : null), [courseId]);

  const active = useMemo(() => {
    if (!course || !courseId) return null;
    if (!lessonId) return null;
    return getLessonById(courseId, lessonId);
  }, [course, courseId, lessonId]);

  useEffect(() => {
    if (!course || !courseId) return;
    const lessons = flattenLessons(course);
    const nextLessonId = progressService.getNextLessonId(courseId, lessons.map((lesson) => lesson.id));
    if (!lessonId || !getLessonById(courseId, lessonId)) {
      navigate(`/training/course/${courseId}/learn/${nextLessonId}`, { replace: true });
    }
  }, [course, courseId, lessonId, navigate]);

  useEffect(() => {
    if (!course || !courseId || !lessonId) return;
    progressService.recordLessonVisit(courseId, lessonId);
  }, [course, courseId, lessonId]);

  if (!course || !courseId || !lessonId || !active) {
    return (
      <div className="space-y-3">
        <TrainingNoIndexHelmet />
        <h1 className="text-2xl font-bold">Lesson not available</h1>
        <Link to="/training/dashboard" className="text-indigo-300 underline">
          Return to dashboard
        </Link>
      </div>
    );
  }

  const lessons = flattenLessons(course);

  const handleSelectLesson = (nextLessonId: string) => {
    navigate(`/training/course/${course.id}/learn/${nextLessonId}`);
  };

  const handleMarkComplete = async () => {
    progressService.markLessonComplete(course.id, active.lesson.id, lessons.length);
    await trainingApi.events({
      eventType: 'lesson_completed',
      courseId: course.id,
      moduleId: active.section.id,
      lessonId: active.lesson.id,
      idempotencyKey: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    });
    const currentIndex = lessons.findIndex((lesson) => lesson.id === active.lesson.id);
    const next = lessons[currentIndex + 1];
    if (next) {
      navigate(`/training/course/${course.id}/learn/${next.id}`);
    }
  };

  const handleQuizPass = async () => {
    progressService.markLessonComplete(course.id, active.lesson.id, lessons.length);
    await trainingApi.events({
      eventType: 'quiz_passed',
      courseId: course.id,
      moduleId: active.section.id,
      lessonId: active.lesson.id,
      idempotencyKey: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    });
  };

  return (
    <div className="space-y-4">
      <TrainingNoIndexHelmet />
      <nav aria-label="Breadcrumb" className="text-sm text-gray-300">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link to="/training/dashboard" className="underline text-indigo-300">
              Dashboard
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to={`/training/course/${course.id}`} className="underline text-indigo-300">
              {course.title}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>{active.lesson.title}</li>
        </ol>
      </nav>

      <CoursePlayerLayout
        course={course}
        activeLesson={active.lesson}
        onSelectLesson={handleSelectLesson}
        onMarkComplete={handleMarkComplete}
        onQuizPass={handleQuizPass}
      />
    </div>
  );
};

export default TrainingCoursePlayerPage;
