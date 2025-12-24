import React, { useMemo, useState } from 'react';
import type { LessonQuiz } from '../../data/training/trainingCatalog';
import { progressService } from './ProgressService';
import { normalizeCourseContent } from '../../lib/normalizeCourseContent';

interface TrainingQuizEngineProps {
  courseId: string;
  quizId: string;
  quiz: LessonQuiz;
  onPass?: () => void;
}

const TrainingQuizEngine: React.FC<TrainingQuizEngineProps> = ({ courseId, quizId, quiz, onPass }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const total = quiz.questions.length;

  const attempts = useMemo(() => {
    const course = progressService.getCourseState(courseId);
    return course.quizAttempts[quizId]?.attempts ?? 0;
  }, [courseId, quizId]);

  const normalizedQuestions = useMemo(
    () =>
      quiz.questions.map((question) => ({
        ...question,
        prompt: normalizeCourseContent(question.prompt),
        options: question.options.map((option) => ({
          ...option,
          label: normalizeCourseContent(option.label),
        })),
        explanation: normalizeCourseContent(question.explanation),
      })),
    [quiz.questions]
  );

  const handleSubmit = () => {
    const correctCount = quiz.questions.filter((question) => answers[question.id] === question.correctOptionId).length;
    const scorePercent = Math.round((correctCount / total) * 100);
    setScore(scorePercent);
    setSubmitted(true);
    const passed = scorePercent >= quiz.passingScorePercent;
    progressService.recordQuizAttempt(courseId, quizId, scorePercent, passed);
    if (passed) {
      onPass?.();
    }
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="training-lesson-content space-y-4">
      <div className="text-sm text-gray-300">
        <p>Passing score: {quiz.passingScorePercent}%</p>
        <p>Attempts: {attempts}</p>
      </div>
      {normalizedQuestions.map((question) => (
        <div key={question.id} className="bg-gray-900 border border-gray-700 rounded p-4 space-y-2">
          <p className="text-sm text-gray-100">{question.prompt}</p>
          <div className="space-y-2">
            {question.options.map((option) => (
              <label key={option.id} className="flex items-start gap-2 text-sm text-gray-200">
                <input
                  type="radio"
                  name={question.id}
                  value={option.id}
                  checked={answers[question.id] === option.id}
                  onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: option.id }))}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          {submitted ? (
            <div className="text-xs text-gray-300">
              <p
                className={
                  answers[question.id] === question.correctOptionId ? 'text-green-400' : 'text-red-300'
                }
              >
                {answers[question.id] === question.correctOptionId ? 'Correct' : 'Review needed'}
              </p>
              <p>{question.explanation}</p>
            </div>
          ) : null}
        </div>
      ))}
      {submitted ? (
        <div className="bg-gray-900 border border-gray-700 rounded p-4 text-sm text-gray-200">
          <p>
            Score: {score}% — {score >= quiz.passingScorePercent ? 'Passed' : 'Not passed'}
          </p>
          <p className="text-xs text-gray-400">
            Review any missed questions, then retry if needed.
          </p>
          {score < quiz.passingScorePercent ? (
            <button
              type="button"
              className="mt-3 px-3 py-2 rounded bg-gray-800 text-white focus-visible:ring-2 focus-visible:ring-indigo-400"
              onClick={reset}
            >
              Retry quiz
            </button>
          ) : null}
        </div>
      ) : null}
      {!submitted ? (
        <button
          type="button"
          className="px-4 py-2 rounded bg-indigo-600 text-white focus-visible:ring-2 focus-visible:ring-indigo-400"
          onClick={handleSubmit}
        >
          Submit answers
        </button>
      ) : null}
    </div>
  );
};

export default TrainingQuizEngine;
