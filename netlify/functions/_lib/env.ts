const netlifyEnv = (globalThis as any)?.Netlify?.env;

export function getEnv(name: string, required = false, defaultValue?: string): string | undefined {
  const value = netlifyEnv?.get?.(name) ?? process.env[name] ?? defaultValue;
  if (required && (value === undefined || value === null || value === '')) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getAdminEmails(): string[] {
  const raw = getEnv('TRAINING_ADMIN_EMAILS');
  if (!raw) return [];
  return raw
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
}
