import React, { useMemo, useState } from 'react';
import { trainingApi } from '../../lib/trainingApi';
import type { LearningObjective, QuizPolicy } from '../../lib/trainingPolicy';
import { getQuizPolicy, mapQuestionObjectives } from '../../lib/trainingPolicy';

interface QuizQuestion {
  id?: string;
  question: string;
}

export interface QuizProgressSnapshot {
  attempts: number;
  latestScorePercent: number;
  passed: boolean;
  latestSubmittedAt?: string;
}

interface QuizEngineProps {
  courseId: string;
  moduleId: string;
  lessonId: string;
  quizId: string;
  questions: QuizQuestion[];
  passingThresholdPercent?: number;
  progress?: QuizProgressSnapshot;
  objectives: LearningObjective[];
  curriculumVersion?: string | null;
  catalogVersion?: string | null;
  onPass?: () => void;
}

interface ParsedQuestion {
  prompt: string;
  options: string[];
  type: 'single' | 'multi' | 'text';
}

function parseQuestion(question: string): ParsedQuestion {
  const optionMatches = [...question.matchAll(/([A-Z])\)\s*([^A-Z]+)/g)];
  if (optionMatches.length >= 2) {
    const options = optionMatches.map((match) => match[2].trim());
    const prompt = question.split(/A\)\s*/)[0].trim();
    return { prompt, options, type: 'single' };
  }
  return { prompt: question.trim(), options: [], type: 'text' };
}

function objectiveCoverage(
  questions: (QuizQuestion & { originalIndex: number })[],
  objectives: LearningObjective[],
  correctMap: Record<string, boolean>
): { missed: LearningObjective[]; covered: LearningObjective[] } {
  const missedIds = new Set<string>();
  const coveredIds = new Set<string>();
  questions.forEach((q) => {
    const id = q.id ?? String(q.originalIndex);
    const objectiveIds = mapQuestionObjectives(q.originalIndex, objectives);
    const correct = correctMap[id];
    objectiveIds.forEach((objectiveId) => {
      coveredIds.add(objectiveId);
      if (!correct) missedIds.add(objectiveId);
    });
  });
  return {
    missed: objectives.filter((obj) => missedIds.has(obj.id)),
    covered: objectives.filter((obj) => coveredIds.has(obj.id)),
  };
}

function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], seed: number): T[] {
  const array = [...items];
  const random = mulberry32(seed);
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const QuizEngine: React.FC<QuizEngineProps> = ({
  courseId,
  moduleId,
  lessonId,
  quizId,
  questions,
  passingThresholdPercent,
  progress,
  objectives,
  curriculumVersion,
  catalogVersion,
  onPass,
}) => {
  const policy: QuizPolicy = getQuizPolicy(passingThresholdPercent);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<null | {
    scorePercent: number;
    passed: boolean;
    correctMap: Record<string, boolean>;
    feedback: Record<string, string>;
  }>(null);
  const [error, setError] = useState<string | null>(null);

  const lastSubmittedAt = progress?.latestSubmittedAt ? new Date(progress.latestSubmittedAt) : null;
  const cooldownMs = policy.cooldownMinutes * 60 * 1000;
  const cooldownRemaining = lastSubmittedAt ? Math.max(0, cooldownMs - (Date.now() - lastSubmittedAt.getTime())) : 0;
  const attemptsUsed = progress?.attempts ?? 0;
  const attemptsRemaining = Math.max(0, policy.maxAttempts - attemptsUsed);
  const locked = attemptsRemaining === 0 && !progress?.passed;

  const parsed = useMemo(() => {
    const seed = hashSeed(`${quizId}-${attemptsUsed + 1}`);
    const withIndex = questions.map((q, index) => ({ ...q, originalIndex: index }));
    const ordered = shuffle(withIndex, seed);
    return ordered.map((q) => ({
      id: q.id ?? String(q.originalIndex),
      question: q.question,
      originalIndex: q.originalIndex,
    }));
  }, [questions, quizId, attemptsUsed]);

  const handleAnswerChange = (questionId: string, value: string, multi = false) => {
    setAnswers((prev) => {
      if (!multi) return { ...prev, [questionId]: value };
      const current = Array.isArray(prev[questionId]) ? (prev[questionId] as string[]) : [];
      const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
      return { ...prev, [questionId]: next };
    });
  };

  const handleSubmit = async () => {
    setError(null);
    if (locked) {
      setError('Maximum attempts reached. Please contact your training coordinator for access.');
      return;
    }
    if (cooldownRemaining > 0) {
      setError(`Cooldown active. You can retry in ${Math.ceil(cooldownRemaining / 60000)} minutes.`);
      return;
    }
    setSubmitting(true);
    const startedAt = new Date().toISOString();
    const payload = {
      courseId,
      quizId,
      startedAt,
      answers,
      curriculumVersion,
      catalogVersion,
      idempotencyKey: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    };
    const res = await trainingApi.submitQuiz(payload);
    if (res.status !== 200 || !res.data) {
      const errorCode = (res.data as any)?.error;
      if (errorCode === 'cooldown_active') {
        const retry = (res.data as any)?.retryAfterSeconds || 0;
        setError(`Cooldown active. Retry in ${Math.ceil(retry / 60)} minutes.`);
        setSubmitting(false);
        return;
      }
      if (errorCode === 'max_attempts') {
        setError('Maximum attempts reached. Contact your training coordinator for assistance.');
        setSubmitting(false);
        return;
      }
      const message = (res.data as any)?.message || res.error || 'Unable to submit quiz.';
      setError(message);
      setSubmitting(false);
      return;
    }
    const data = res.data as any;
    const correctMap: Record<string, boolean> = data.correctMap || {};
    const feedback: Record<string, string> = data.feedback || {};
    const passed = Boolean(data.passed);
    setResult({
      scorePercent: data.scorePercent ?? 0,
      passed,
      correctMap,
      feedback,
    });
    if (passed) {
      onPass?.();
    }
    setSubmitting(false);
  };

  const coverage = result ? objectiveCoverage(parsed, objectives, result.correctMap) : null;

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-300">
        <p>Passing score: {policy.passingThresholdPercent}%</p>
        <p>Attempts remaining: {attemptsRemaining}</p>
        <p>Attempts used: {attemptsUsed}</p>
        {progress?.latestScorePercent ? (
          <p>Last score: {progress.latestScorePercent}%</p>
        ) : null}
        <p>Cooldown after a failed attempt: {policy.cooldownMinutes} minutes</p>
      </div>

      {parsed.map((q) => {
        const questionId = q.id ?? String(q.originalIndex);
        const parsedQuestion = parseQuestion(q.question);
        const selected = answers[questionId];
        const isSubmitted = Boolean(result);
        const correct = result?.correctMap?.[questionId];
        return (
          <div key={questionId} className="bg-gray-900 p-4 rounded space-y-2">
            <fieldset>
              <legend className="text-sm text-gray-100">{parsedQuestion.prompt}</legend>
              {parsedQuestion.options.length ? (
                <div className="space-y-2">
                  {parsedQuestion.options.map((option) => (
                    <label key={option} className="flex items-start gap-2 text-sm text-gray-200">
                      <input
                        type={parsedQuestion.type === 'multi' ? 'checkbox' : 'radio'}
                        name={questionId}
                        value={option}
                        checked={
                          parsedQuestion.type === 'multi'
                            ? Array.isArray(selected) && selected.includes(option)
                            : selected === option
                        }
                        onChange={() => handleAnswerChange(questionId, option, parsedQuestion.type === 'multi')}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  className="w-full bg-gray-800 p-2 rounded border border-gray-700"
                  value={typeof selected === 'string' ? selected : ''}
                  onChange={(event) => handleAnswerChange(questionId, event.target.value)}
                  placeholder="Enter your answer"
                />
              )}
            </fieldset>
            {isSubmitted ? (
              <div className="text-xs">
                <p className={correct ? 'text-green-400' : 'text-red-300'}>
                  {correct ? 'Correct' : 'Needs review'}
                </p>
                {feedback[questionId] ? <p className="text-gray-300">{feedback[questionId]}</p> : null}
              </div>
            ) : null}
          </div>
        );
      })}

      {result ? (
        <div className="bg-gray-900 p-4 rounded">
          <h4 className="text-lg font-semibold">Quiz results</h4>
          <p className="text-sm text-gray-200">
            Score: {result.scorePercent}% — {result.passed ? 'Passed' : 'Not passed'}
          </p>
          {coverage ? (
            <div className="mt-3 text-sm">
              <p className="text-gray-200 font-semibold">Objectives coverage</p>
              <ul className="list-disc list-inside text-gray-300">
                {coverage.missed.length ? (
                  coverage.missed.map((objective) => (
                    <li key={objective.id}>
                      {objective.text} (needs review)
                    </li>
                  ))
                ) : (
                  <li>All objectives met for this assessment.</li>
                )}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <button
        type="button"
        className="px-4 py-2 rounded bg-indigo-600 text-white focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-60"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? 'Submitting...' : 'Submit quiz'}
      </button>
    </div>
  );
};

export default QuizEngine;
