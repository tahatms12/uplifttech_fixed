export interface ApiResponse<T> {
  data: T | null;
  error?: string;
  status: number;
}

async function request<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });
    const contentType = res.headers.get('content-type') || '';
    let data: T | null = null;
    if (contentType.includes('application/json')) {
      data = (await res.json().catch(() => null)) as T | null;
    } else {
      const text = await res.text().catch(() => '');
      data = (text ? (text as unknown as T) : null) as T | null;
    }
    const error = !res.ok
      ? ((data as any)?.error || (data as any)?.message || (res.status === 401 ? 'unauthorized' : undefined))
      : undefined;
    return { data, status: res.status, ...(error ? { error } : {}) };
  } catch (error: any) {
    return { data: null, status: 500, error: error?.message || 'network_error' };
  }
}

export const trainingApi = {
  login: (payload: Record<string, unknown>) =>
    request('/api/training/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  logout: () => request('/api/training/auth/logout', { method: 'POST', body: '{}' }),
  me: () => request('/api/training/auth/me', { method: 'GET' }),
  events: (payload: Record<string, unknown>) =>
    request('/api/training/events', { method: 'POST', body: JSON.stringify(payload) }),
  submitQuiz: (payload: Record<string, unknown>) =>
    request('/api/training/quizzes/submit', { method: 'POST', body: JSON.stringify(payload) }),
  progress: () => request('/api/training/progress', { method: 'GET' }),
  adminUsers: () => request('/api/training/admin/users', { method: 'GET' }),
  adminUserProgress: (id: string) => request(`/api/training/admin/user/${id}/progress`, { method: 'GET' }),
  adminExport: () => request('/api/training/admin/export.csv', { method: 'GET' }),
  issueCertificate: (payload: Record<string, unknown>) =>
    request('/api/training/certificates/issue', { method: 'POST', body: JSON.stringify(payload) }),
  certificatePdf: (courseId: string) =>
    request(`/api/training/certificates/pdf?courseId=${encodeURIComponent(courseId)}`, { method: 'GET' }),
  certificateVerify: (code: string) =>
    request(`/api/training/certificates/verify?code=${encodeURIComponent(code)}`, { method: 'GET' }),
};
