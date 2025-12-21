export interface UserRow {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  last_login_at: string;
}

export interface LoginRow {
  id: string;
  user_id: string;
  ts: string;
  ip_hash: string;
  user_agent: string;
}

export interface EventRow {
  id: string;
  user_id: string;
  course_id: string;
  module_id: string;
  lesson_id: string;
  event_type: string;
  ts: string;
  meta_json: string;
}

export interface LessonTimeRow {
  user_id: string;
  course_id: string;
  module_id: string;
  lesson_id: string;
  seconds_active: string;
  updated_at: string;
}

export interface StepCompletionRow {
  user_id: string;
  course_id: string;
  step_id: string;
  completed_at: string;
  updated_at: string;
}

export interface QuizAttemptRow {
  id: string;
  user_id: string;
  course_id: string;
  quiz_id: string;
  attempt_number: string;
  score_percent: string;
  passed: string;
  started_at: string;
  submitted_at: string;
  answers_json: string;
}

export interface CompletionRow {
  id: string;
  user_id: string;
  course_id: string;
  completed_at: string;
  final_score: string;
  certificate_id: string;
}

export interface CertificateRow {
  id: string;
  certificate_code: string;
  user_id: string;
  course_id: string;
  issued_at: string;
}

export interface RateLimitRow {
  key: string;
  window_start: string;
  count: string;
  updated_at: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_admin: boolean;
}
