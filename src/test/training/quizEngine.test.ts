// @vitest-environment node
import { describe, expect, test } from 'vitest';
import { scoreQuiz, buildAttemptPolicy, evaluateAttemptEligibility } from '../../../netlify/functions/_lib/quizEngine';
import type { QuizDefinition } from '../../../netlify/functions/_lib/catalog';

const quiz: QuizDefinition = {
  courseId: 'course-1',
  quizId: 'quiz-1',
  questions: [
    { question: 'Question 1?', id: 'q1' },
    { question: 'Question 2?', id: 'q2' },
  ],
  answerKey: ['A', 'B'],
  passingThresholdPercent: 80,
};

describe('quiz scoring', () => {
  test('scores correct answers and returns feedback', () => {
    const result = scoreQuiz(quiz, { q1: 'A', q2: 'B' });
    expect(result.scorePercent).toBe(100);
    expect(result.correctMap.q1).toBe(true);
    expect(result.correctMap.q2).toBe(true);
    expect(result.feedback.q1).toBeTruthy();
  });

  test('handles incorrect answers', () => {
    const result = scoreQuiz(quiz, { q1: 'A', q2: 'C' });
    expect(result.scorePercent).toBe(50);
    expect(result.correctMap.q2).toBe(false);
  });
});

describe('attempt eligibility', () => {
  test('blocks max attempts', () => {
    const policy = buildAttemptPolicy(quiz);
    const attempts = [
      {
        id: '1',
        user_id: 'user',
        course_id: 'course-1',
        quiz_id: 'quiz-1',
        attempt_number: '1',
        score_percent: '50',
        passed: 'false',
        started_at: new Date().toISOString(),
        submitted_at: new Date().toISOString(),
        answers_json: '{}',
      },
      {
        id: '2',
        user_id: 'user',
        course_id: 'course-1',
        quiz_id: 'quiz-1',
        attempt_number: '2',
        score_percent: '60',
        passed: 'false',
        started_at: new Date().toISOString(),
        submitted_at: new Date().toISOString(),
        answers_json: '{}',
      },
    ];
    const eligibility = evaluateAttemptEligibility(attempts as any, policy);
    expect(eligibility.allowed).toBe(false);
    expect(eligibility.reason).toBe('max_attempts');
  });

  test('enforces cooldown between attempts', () => {
    const policy = { ...buildAttemptPolicy(quiz), cooldownMinutes: 30 };
    const now = new Date();
    const recent = new Date(now.getTime() - 5 * 60 * 1000);
    const attempts = [
      {
        id: '1',
        user_id: 'user',
        course_id: 'course-1',
        quiz_id: 'quiz-1',
        attempt_number: '1',
        score_percent: '50',
        passed: 'false',
        started_at: recent.toISOString(),
        submitted_at: recent.toISOString(),
        answers_json: '{}',
      },
    ];
    const eligibility = evaluateAttemptEligibility(attempts as any, policy, now);
    expect(eligibility.allowed).toBe(false);
    expect(eligibility.reason).toBe('cooldown');
    expect(eligibility.retryAfterSeconds).toBeGreaterThan(0);
  });
});
