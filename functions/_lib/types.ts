export interface R2ObjectLike {
  text(): Promise<string>;
  etag: string;
}

export interface R2BucketLike {
  get(key: string): Promise<R2ObjectLike | null>;
  put(key: string, value: string, options?: { ifMatch?: string; ifNoneMatch?: string }): Promise<void>;
  delete(key: string): Promise<void>;
  list(options: { prefix: string }): Promise<{ objects: { key: string }[] }>;
}

export interface Env {
  TRAINING_JWT_SECRET?: string;
  DEMO_KEY?: string;
  demo_key?: string;
  DEMO_USERNAME?: string;
  TRAINING_COOKIE_NAME?: string;
  TRAINING_APP_ORIGIN?: string;
  TRAINING_ADMIN_EMAILS?: string;
  TRAINING_CSV?: R2BucketLike;
  CF_PAGES_URL?: string;
}

export interface HandlerEvent {
  path: string;
  rawUrl: string;
  httpMethod: string;
  headers: Record<string, string>;
  queryStringParameters: Record<string, string>;
  body: string | null;
  isBase64Encoded?: boolean;
  env: Env;
}

export interface HandlerResponse {
  statusCode: number;
  headers?: Record<string, string>;
  multiValueHeaders?: Record<string, string[]>;
  body?: string;
  isBase64Encoded?: boolean;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_admin: boolean;
}

export interface CertificateRow {
  id: string;
  certificate_code: string;
  user_id: string;
  course_id: string;
  issued_at: string;
}

export interface CompletionRow {
  id: string;
  user_id: string;
  course_id: string;
  completed_at: string;
  final_score: string;
  certificate_id: string;
}

export interface LessonTimeRow {
  user_id: string;
  course_id: string;
  module_id: string;
  lesson_id: string;
  seconds_active: string;
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

export interface RateLimitRow {
  key: string;
  window_start: string;
  count: string;
  updated_at: string;
}

export interface UserRow {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  last_login_at: string;
}
