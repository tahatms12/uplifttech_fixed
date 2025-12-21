import type { HandlerEvent, HandlerResponse } from './types';

const JSON_LIMIT = 64 * 1024;

export function jsonResponse(
  statusCode: number,
  body: Record<string, unknown> | unknown,
  cookies: string[] = []
): HandlerResponse {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
    multiValueHeaders: cookies.length ? { 'Set-Cookie': cookies } : undefined,
    body: JSON.stringify(body),
  };
}

export function textResponse(statusCode: number, body: string, headers: Record<string, string> = {}): HandlerResponse {
  return {
    statusCode,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      ...headers,
    },
    body,
  };
}

function decodeBase64ToString(encoded: string): string {
  const binary = atob(encoded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function parseJsonBody<T = any>(event: HandlerEvent): T | null {
  let raw = event.body || '';
  if (event.isBase64Encoded && raw) {
    raw = decodeBase64ToString(raw);
  }
  if (raw.length > JSON_LIMIT) {
    throw Object.assign(new Error('Payload too large'), { statusCode: 413 });
  }
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    throw Object.assign(new Error('Invalid JSON'), { statusCode: 400 });
  }
}

export function methodNotAllowed(): HandlerResponse {
  return jsonResponse(405, { error: 'method_not_allowed' });
}

export function notFound(): HandlerResponse {
  return jsonResponse(404, { error: 'not_found' });
}

export function badRequest(message: string): HandlerResponse {
  return jsonResponse(400, { error: message });
}

export function serverError(): HandlerResponse {
  return jsonResponse(500, { error: 'server_error' });
}
