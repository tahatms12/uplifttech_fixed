import React, { Suspense, useMemo, useState } from 'react';
import type { Lesson } from '../../data/training/trainingCatalog';
import TrainingQuizEngine from './TrainingQuizEngine';
import { normalizeCourseContent } from '../../lib/normalizeCourseContent';

const TrainingMarkdown = React.lazy(() => import('./TrainingMarkdown'));

interface LessonRendererProps {
  courseId: string;
  lesson: Lesson;
  onQuizPass?: () => void;
}

const LessonRenderer: React.FC<LessonRendererProps> = ({ courseId, lesson, onQuizPass }) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const checklistComplete = useMemo(() => {
    if (!lesson.checklist?.length) return false;
    return lesson.checklist.every((item) => checkedItems[item.id]);
  }, [lesson.checklist, checkedItems]);

  const normalizedScenario = useMemo(() => {
    if (!lesson.scenario) return null;
    return {
      prompt: normalizeCourseContent(lesson.scenario.prompt),
      modelAnswer: normalizeCourseContent(lesson.scenario.modelAnswer),
      guidance: lesson.scenario.guidance.map((item) => normalizeCourseContent(item)),
    };
  }, [lesson.scenario]);

  const normalizedChecklist = useMemo(() => {
    if (!lesson.checklist) return null;
    return lesson.checklist.map((item) => ({
      ...item,
      text: normalizeCourseContent(item.text),
      confirmLabel: normalizeCourseContent(item.confirmLabel),
    }));
  }, [lesson.checklist]);

  return (
    <div className="space-y-6">
      {lesson.contentBlocks?.map((block, index) => (
        <Suspense key={`${lesson.id}-block-${index}`} fallback={<p className="text-sm text-gray-400">Loading...</p>}>
          <TrainingMarkdown content={block.content} />
        </Suspense>
      ))}

      {lesson.type === 'scenario' && normalizedScenario ? (
        <section className="training-lesson-content bg-gray-900 border border-gray-700 rounded p-4 space-y-3">
          <h3 className="text-lg font-semibold">Scenario prompt</h3>
          <p className="text-sm text-gray-200">{normalizedScenario.prompt}</p>
          <div className="text-sm text-gray-300">
            <h4 className="font-semibold text-gray-100">Model answer</h4>
            <p>{normalizedScenario.modelAnswer}</p>
          </div>
          <div className="text-sm text-gray-300">
            <h4 className="font-semibold text-gray-100">Guidance checklist</h4>
            <ul className="list-disc list-inside">
              {normalizedScenario.guidance.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {lesson.type === 'quiz' && lesson.quiz ? (
        <TrainingQuizEngine
          courseId={courseId}
          quizId={lesson.id}
          quiz={lesson.quiz}
          onPass={onQuizPass}
        />
      ) : null}

      {lesson.type === 'checklist' && normalizedChecklist ? (
        <section className="training-lesson-content bg-gray-900 border border-gray-700 rounded p-4 space-y-3">
          <h3 className="text-lg font-semibold">Operational checklist</h3>
          <ul className="space-y-2 text-sm text-gray-200">
            {normalizedChecklist.map((item) => (
              <li key={item.id} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(checkedItems[item.id])}
                  onChange={() =>
                    setCheckedItems((prev) => ({
                      ...prev,
                      [item.id]: !prev[item.id],
                    }))
                  }
                />
                <div>
                  <p>{item.text}</p>
                  <p className="text-xs text-gray-400">{item.confirmLabel}</p>
                </div>
              </li>
            ))}
          </ul>
          {checklistComplete ? (
            <p className="text-xs text-green-300">Checklist complete. You can mark this lesson complete.</p>
          ) : (
            <p className="text-xs text-gray-400">Complete each item to finish the checklist.</p>
          )}
        </section>
      ) : null}

      {lesson.type === 'download' && lesson.downloads?.length ? (
        <section className="training-lesson-content bg-gray-900 border border-gray-700 rounded p-4 space-y-2">
          <h3 className="text-lg font-semibold">Downloads</h3>
          <ul className="space-y-2 text-sm text-gray-200">
            {lesson.downloads.map((download) => (
              <li key={download.id}>
                <a className="text-indigo-300 underline" href={download.href}>
                  {normalizeCourseContent(download.label)}
                </a>
                <p className="text-xs text-gray-400">{normalizeCourseContent(download.description)}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
};

export default LessonRenderer;
