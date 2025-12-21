import crypto from 'crypto';
import type { HandlerEvent } from '@netlify/functions';

export function safeCompare(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function base64UrlEncode(input: Buffer | string): string {
  return (typeof input === 'string' ? Buffer.from(input) : input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(input: string): Buffer {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = 4 - (normalized.length % 4 || 4);
  const padded = normalized + '='.repeat(padLength === 4 ? 0 : padLength);
  return Buffer.from(padded, 'base64');
}

export interface JwtPayload {
  sub: string;
  email: string;
  is_admin: boolean;
  iat: number;
  exp: number;
  [key: string]: unknown;
}

export function signJwt(payload: Omit<JwtPayload, 'iat' | 'exp'>, secret: string, expiresInSeconds: number): string {
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
  const signature = crypto.createHmac('sha256', secret).update(signingInput).digest();
  return `${signingInput}.${base64UrlEncode(signature)}`;
}

export function verifyJwt(token: string, secret: string): JwtPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, signatureB64] = parts;
  const signingInput = `${headerB64}.${payloadB64}`;
  const expectedSig = crypto.createHmac('sha256', secret).update(signingInput).digest();
  const providedSig = base64UrlDecode(signatureB64);
  if (expectedSig.length !== providedSig.length || !crypto.timingSafeEqual(expectedSig, providedSig)) {
    return null;
  }
  try {
    const payload = JSON.parse(base64UrlDecode(payloadB64).toString('utf8')) as JwtPayload;
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
  const direct = headers['x-nf-client-connection-ip'] || headers['X-NF-Client-Connection-IP'];
  if (direct) return Array.isArray(direct) ? direct[0] : direct;
  const forwarded = headers['x-forwarded-for'] || headers['X-Forwarded-For'];
  if (forwarded) {
    const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return value.split(',')[0].trim();
  }
  return null;
}

export function hashIp(ip: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(ip).digest('hex');
}

export function requestIsHttps(event: HandlerEvent): boolean {
  const proto = String(event.headers['x-forwarded-proto'] || event.headers['X-Forwarded-Proto'] || '').toLowerCase();
  return proto === 'https';
}

function normalizeOrigin(origin: string): string {
  return origin.trim().toLowerCase();
}

function buildAllowedOrigins(allowedOrigin: string | string[]): string[] {
  const configured = Array.isArray(allowedOrigin)
    ? allowedOrigin
    : allowedOrigin
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean);
  return configured.map((origin) => normalizeOrigin(origin));
}

function originMatches(origin: string, allowedList: string[]): boolean {
  const normalized = normalizeOrigin(origin);
  if (allowedList.includes(normalized)) return true;
  if (normalized === 'http://localhost:8888' || normalized === 'http://127.0.0.1:8888') return true;
  const siteName = process.env.SITE_NAME;
  if (siteName) {
    const base = `${siteName}.netlify.app`;
    if (normalized === `https://${base}`) return true;
    if (normalized.endsWith(`--${base}`)) return true;
  }
  return false;
}

export function verifyOrigin(event: HandlerEvent, allowedOrigin: string | string[]): boolean {
  const allowedList = buildAllowedOrigins(allowedOrigin);
  const headerOrigin = event.headers?.origin || event.headers?.Origin;
  if (headerOrigin && originMatches(headerOrigin, allowedList)) return true;
  const host = event.headers?.host || event.headers?.Host;
  if (!host) return false;
  const proto =
    String(event.headers['x-forwarded-proto'] || event.headers['X-Forwarded-Proto'] || 'https').toLowerCase() || 'https';
  const derivedOrigin = `${proto}://${host}`;
  return originMatches(derivedOrigin, allowedList);
}
