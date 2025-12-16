import type { Course } from '../types/training';
import catalogData from '../data/training/catalog';

export const catalog = catalogData.courses as Course[];

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }
  return (await res.json()) as T;
}

export async function login(email: string, password: string) {
  return request<{ ok: boolean }>('/api/training/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  return request<{ ok: boolean }>('/api/training/auth/logout', { method: 'POST' });
}

export async function currentUser() {
  return request<{ user: { id: string; email: string; role: string; full_name: string } }>('/api/training/auth/me', {
    method: 'GET',
  });
}

export async function sendEvent(payload: {
  courseId: string;
  moduleId?: string;
  lessonId?: string;
  eventType: string;
  meta?: Record<string, unknown>;
}) {
  return request<{ ok: boolean }>('/api/training/events', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function submitQuiz(courseId: string, quizId: string, answers: string[]) {
  return request<{ score: number; passed: boolean }>('/api/training/quizzes/submit', {
    method: 'POST',
    body: JSON.stringify({ courseId, quizId, answers }),
  });
}

export async function fetchProgress() {
  return request<{ time: any[]; quizzes: any[]; completions: any[] }>('/api/training/progress');
}

export async function issueCertificate(courseId: string, finalScore?: number) {
  return request<{ certificateId: string; code: string }>('/api/training/certificates', {
    method: 'POST',
    body: JSON.stringify({ courseId, finalScore }),
  });
}

export async function fetchAdminUsers() {
  return request<{ users: any[] }>('/api/training/admin/users');
}

export async function fetchAdminUserProgress(id: string) {
  return request<{ time: any[]; quizzes: any[]; completions: any[] }>(`/api/training/admin/user/${id}/progress`);
}

export async function fetchAdminExport() {
  const res = await fetch('/api/training/admin/export.csv', { credentials: 'include' });
  if (!res.ok) throw new Error('Export failed');
  return res.text();
}

export async function verifyCertificate(code: string) {
  return request<{ valid: boolean; certificateId?: string; user?: string; courseId?: string; issued_at?: string }>(
    `/api/training/verify?code=${encodeURIComponent(code)}`,
    { method: 'GET' }
  );
}
