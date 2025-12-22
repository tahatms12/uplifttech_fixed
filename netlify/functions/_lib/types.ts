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
  curriculum_version?: string;
  catalog_version?: string;
}

export interface LessonTimeRow {
  user_id: string;
  course_id: string;
  module_id: string;
  lesson_id: string;
  seconds_active: string;
  updated_at: string;
  curriculum_version?: string;
  catalog_version?: string;
}

export interface StepCompletionRow {
  user_id: string;
  course_id: string;
  step_id: string;
  completed_at: string;
  updated_at: string;
  curriculum_version?: string;
  catalog_version?: string;
}

export interface QuizAttemptRow {
  id: string;
  idempotency_key?: string;
  user_id: string;
  course_id: string;
  quiz_id: string;
  attempt_number: string;
  score_percent: string;
  passed: string;
  started_at: string;
  submitted_at: string;
  answers_json: string;
  curriculum_version?: string;
  catalog_version?: string;
}

export interface CompletionRow {
  id: string;
  user_id: string;
  course_id: string;
  completed_at: string;
  final_score: string;
  certificate_id: string;
  curriculum_version?: string;
  catalog_version?: string;
}

export interface CertificateRow {
  id: string;
  certificate_code: string;
  user_id: string;
  course_id: string;
  issued_at: string;
  curriculum_version?: string;
  catalog_version?: string;
}

export interface AuditLogRow {
  event_id: string;
  user_id: string;
  event_type: string;
  entity_type: string;
  entity_id: string;
  payload_json: string;
  created_at: string;
  curriculum_version?: string;
  catalog_version?: string;
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
