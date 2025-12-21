import type { HandlerEvent, HandlerResponse } from '../_lib/types';
import { jsonResponse } from '../_lib/http';
import { handleTrainingRequest } from '../_lib/training-api';

interface PagesContext<Env = any, Params = Record<string, string | undefined>> {
  request: Request;
  env: Env;
  params: Params;
}

function decodeBase64ToUint8Array(encoded: string): Uint8Array {
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function toResponse(result: HandlerResponse): Response {
  const headers = new Headers(result.headers || {});
  if (result.multiValueHeaders) {
    for (const [key, values] of Object.entries(result.multiValueHeaders)) {
      for (const value of values) {
        headers.append(key, value);
      }
    }
  }
  const body = result.body
    ? result.isBase64Encoded
      ? decodeBase64ToUint8Array(result.body)
      : result.body
    : undefined;
  return new Response(body, { status: result.statusCode, headers });
}

async function buildEvent(context: PagesContext<any, { path?: string }>): Promise<HandlerEvent> {
  const { request, env } = context;
  const url = new URL(request.url);
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
    headers[key.toLowerCase()] = value;
  });
  const queryStringParameters: Record<string, string> = {};
  for (const [key, value] of url.searchParams.entries()) {
    if (!(key in queryStringParameters)) {
      queryStringParameters[key] = value;
    }
  }
  const body = request.method === 'GET' || request.method === 'HEAD' ? null : await request.text();
  return {
    path: url.pathname,
    rawUrl: request.url,
    httpMethod: request.method,
    headers,
    queryStringParameters,
    body,
    isBase64Encoded: false,
    env,
  };
}

export async function onRequest(context: PagesContext<any, { path?: string }>): Promise<Response> {
  const event = await buildEvent(context);
  const apiPath = event.path || '';

  if (apiPath === '/api/health' || apiPath === '/api/health/') {
    return toResponse(jsonResponse(200, { ok: true, status: 'healthy' }));
  }

  if (apiPath.startsWith('/api/training')) {
    const result = await handleTrainingRequest(event);
    return toResponse(result);
  }

  return toResponse(
    jsonResponse(400, {
      ok: false,
      error: 'unknown_endpoint',
      path: apiPath,
    })
  );
}
