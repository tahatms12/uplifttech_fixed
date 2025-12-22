import type { QuizDefinition } from './catalog';
import type { QuizAttemptRow } from './types';

export interface QuizScoreResult {
  scorePercent: number;
  correctCount: number;
  total: number;
  correctMap: Record<string, boolean>;
  feedback: Record<string, string>;
}

export interface AttemptPolicy {
  maxAttempts: number;
  cooldownMinutes: number;
  passingThresholdPercent: number;
}

export function scoreQuiz(quiz: QuizDefinition, answers: Record<string, unknown>): QuizScoreResult {
  const normalize = (value: unknown) => String(value ?? '').trim().toLowerCase();
  const correctMap: Record<string, boolean> = {};
  const feedback: Record<string, string> = {};
  const total = quiz.questions.length;
  let correctCount = 0;

  quiz.questions.forEach((question, idx) => {
    const questionId = question.id ?? String(idx);
    const expected = quiz.answerKey[idx];
    const answer =
      (answers as any)[questionId] ?? (answers as any)[idx] ?? (answers as any)[String(idx)] ?? '';

    let isCorrect = false;
    if (Array.isArray(expected)) {
      const expectedNormalized = expected.map(normalize).sort();
      const answerNormalized = Array.isArray(answer)
        ? answer.map(normalize).sort()
        : normalize(answer)
            .split(/,|;/)
            .map((part) => part.trim())
            .filter(Boolean)
            .sort();
      isCorrect = expectedNormalized.length === answerNormalized.length && expectedNormalized.every((val, i) => val === answerNormalized[i]);
    } else if (typeof expected === 'string' && expected.trim().length > 0) {
      isCorrect = normalize(expected) === normalize(answer);
    } else {
      isCorrect = String(answer || '').trim().length > 0;
    }

    correctMap[questionId] = isCorrect;
    if (isCorrect) {
      correctCount += 1;
      feedback[questionId] = 'Correct.';
    } else {
      feedback[questionId] = `Review the lesson content for the correct response.`;
    }
  });

  const scorePercent = total ? Math.round((correctCount / total) * 1000) / 10 : 0;
  return { scorePercent, correctCount, total, correctMap, feedback };
}

export function buildAttemptPolicy(quiz: QuizDefinition): AttemptPolicy {
  return {
    maxAttempts: 2,
    cooldownMinutes: 30,
    passingThresholdPercent: quiz.passingThresholdPercent ?? 80,
  };
}

export function evaluateAttemptEligibility(
  attempts: QuizAttemptRow[],
  policy: AttemptPolicy,
  now: Date = new Date()
): { allowed: boolean; reason?: 'cooldown' | 'max_attempts'; retryAfterSeconds?: number } {
  const passedAlready = attempts.some((row) => row.passed === 'true');
  if (passedAlready) return { allowed: true };
  if (attempts.length >= policy.maxAttempts) {
    return { allowed: false, reason: 'max_attempts' };
  }
  const latest = attempts.reduce<QuizAttemptRow | null>((current, next) => {
    if (!current) return next;
    return (next.submitted_at || '') > (current.submitted_at || '') ? next : current;
  }, null);
  if (latest?.submitted_at) {
    const last = new Date(latest.submitted_at).getTime();
    const cooldownMs = policy.cooldownMinutes * 60 * 1000;
    const remaining = Math.max(0, cooldownMs - (now.getTime() - last));
    if (remaining > 0) {
      return { allowed: false, reason: 'cooldown', retryAfterSeconds: Math.ceil(remaining / 1000) };
    }
  }
  return { allowed: true };
}
