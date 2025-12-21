export interface ApiResponse<T> {
  data: T | null;
  error?: string;
  status: number;
}

async function request<T>(url: string, options: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });
    const data = (await res.json().catch(() => null)) as T | null;
    const error = !res.ok ? ((data as any)?.error || (data as any)?.message || (res.status === 401 ? 'unauthorized' : undefined)) : undefined;
    return { data, status: res.status, ...(error ? { error } : {}) };
  } catch (error: any) {
    return { data: null, status: 500, error: error?.message || 'network_error' };
  }
}

export const trainingApi = {
  // Mock auth endpoints - no backend needed
  login: (payload: Record<string, unknown>) => 
    Promise.resolve({ data: { success: true }, status: 200 }),
  logout: () => 
    Promise.resolve({ data: { success: true }, status: 200 }),
  me: () => 
    Promise.resolve({ data: { id: 'demo-user', username: 'demo' }, status: 200 }),
  
  // Mock progress endpoint with empty progress (fresh start)
  progress: () => 
    Promise.resolve({ 
      data: { 
        progress: [],
        curriculumVersion: '1.0.0',
        catalogVersion: '1.0.0'
      }, 
      status: 200 
    }),
  
  // Keep other endpoints as-is
  events: (payload: Record<string, unknown>) => request('/api/training/events', { method: 'POST', body: JSON.stringify(payload) }),
  submitQuiz: (payload: Record<string, unknown>) => request('/api/training/quizzes/submit', { method: 'POST', body: JSON.stringify(payload) }),
  adminUsers: () => request('/api/training/admin/users', { method: 'GET' }),
  adminUserProgress: (id: string) => request(`/api/training/admin/user/${id}/progress`, { method: 'GET' }),
  adminExport: () => request('/api/training/admin/export.csv', { method: 'GET' }),
  issueCertificate: (payload: Record<string, unknown>) => request('/api/training/certificates/issue', { method: 'POST', body: JSON.stringify(payload) }),
  certificatePdf: (courseId: string) => request(`/api/training/certificates/pdf?courseId=${encodeURIComponent(courseId)}`, { method: 'GET' }),
  certificateVerify: (code: string) => request(`/api/training/certificates/verify?code=${encodeURIComponent(code)}`, { method: 'GET' }),
};
