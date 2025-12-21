import type { Env } from './types';

export function getEnv(env: Env, name: string, required = false, defaultValue?: string): string | undefined {
  const value = env?.[name as keyof Env] as string | undefined;
  const resolved = value ?? defaultValue;
  if (required && (resolved === undefined || resolved === null || resolved === '')) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return resolved;
}

export function getAdminEmails(env: Env): string[] {
  const raw = getEnv(env, 'TRAINING_ADMIN_EMAILS');
  if (!raw) return [];
  return raw
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
}
