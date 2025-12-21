import type { HandlerEvent } from './types';

const encoder = new TextEncoder();

export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function base64Encode(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function base64Decode(input: string): Uint8Array {
  const binary = atob(input);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function base64UrlEncode(input: Uint8Array | string): string {
  const bytes = typeof input === 'string' ? encoder.encode(input) : input;
  return base64Encode(bytes).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecode(input: string): Uint8Array {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = 4 - (normalized.length % 4 || 4);
  const padded = normalized + '='.repeat(padLength === 4 ? 0 : padLength);
  return base64Decode(padded);
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
}

const hmacKeyCache = new Map<string, CryptoKey>();

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const cached = hmacKeyCache.get(secret);
  if (cached) return cached;
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ]);
  hmacKeyCache.set(secret, key);
  return key;
}

async function hmacSha256(secret: string, message: string): Promise<Uint8Array> {
  const key = await getHmacKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return new Uint8Array(signature);
}

export interface JwtPayload {
  sub: string;
  email: string;
  is_admin: boolean;
  iat: number;
  exp: number;
  [key: string]: unknown;
}

export async function signJwt(
  payload: Omit<JwtPayload, 'iat' | 'exp'>,
  secret: string,
  expiresInSeconds: number
): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JwtPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  } as JwtPayload;
  const headerEncoded = base64UrlEncode(JSON.stringify(header));
  const payloadEncoded = base64UrlEncode(JSON.stringify(fullPayload));
  const signingInput = `${headerEncoded}.${payloadEncoded}`;
  const signature = await hmacSha256(secret, signingInput);
  return `${signingInput}.${base64UrlEncode(signature)}`;
}

export async function verifyJwt(token: string, secret: string): Promise<JwtPayload | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, signatureB64] = parts;
  const signingInput = `${headerB64}.${payloadB64}`;
  const expectedSig = await hmacSha256(secret, signingInput);
  const providedSig = base64UrlDecode(signatureB64);
  if (!timingSafeEqual(expectedSig, providedSig)) {
    return null;
  }
  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadB64))) as JwtPayload;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    return payload;
  } catch (err) {
    return null;
  }
}

export interface CookieOptions {
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'Lax' | 'Strict' | 'None';
}

export function serializeCookie(name: string, value: string, options: CookieOptions = {}): string {
  const attrs = [
    `${name}=${value}`,
    `Path=${options.path || '/'}`,
    options.maxAge !== undefined ? `Max-Age=${options.maxAge}` : undefined,
    options.domain ? `Domain=${options.domain}` : undefined,
    options.secure === false ? undefined : 'Secure',
    options.httpOnly === false ? undefined : 'HttpOnly',
    `SameSite=${options.sameSite || 'Lax'}`,
  ].filter(Boolean);
  return attrs.join('; ');
}

export function parseCookies(header?: string): Record<string, string> {
  if (!header) return {};
  return header.split(';').reduce((acc, part) => {
    const [name, ...rest] = part.trim().split('=');
    if (!name) return acc;
    acc[name] = rest.join('=');
    return acc;
  }, {} as Record<string, string>);
}

export function getClientIp(event: HandlerEvent): string | null {
  const headers = event.headers || {};
  const cf = headers['cf-connecting-ip'] || headers['CF-Connecting-IP'];
  if (cf) return Array.isArray(cf as any) ? (cf as any)[0] : (cf as string);
  const forwarded = headers['x-forwarded-for'] || headers['X-Forwarded-For'];
  if (forwarded) {
    const value = Array.isArray(forwarded as any) ? (forwarded as any)[0] : (forwarded as string);
    return value.split(',')[0].trim();
  }
  const realIp = headers['x-real-ip'] || headers['X-Real-IP'];
  if (realIp) return Array.isArray(realIp as any) ? (realIp as any)[0] : (realIp as string);
  return null;
}

export async function hashIp(ip: string, secret: string): Promise<string> {
  const signature = await hmacSha256(secret, ip);
  return Array.from(signature)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function verifyOrigin(event: HandlerEvent, allowedOrigin: string | string[]): boolean {
  const origin = event.headers?.origin || event.headers?.Origin || '';
  if (!origin) return false;
  const allowedList = Array.isArray(allowedOrigin)
    ? allowedOrigin
    : allowedOrigin
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean);
  if (!allowedList.length) return false;
  return allowedList.some((candidate) => candidate === origin);
}
