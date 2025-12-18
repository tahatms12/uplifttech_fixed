import type { Config, Handler, HandlerEvent, HandlerResponse } from '@netlify/functions';
import { handler as trainingHandler } from './training-api';

function jsonResponse(statusCode: number, body: Record<string, unknown>): HandlerResponse {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  };
}

function normalizePath(event: HandlerEvent): string {
  const rawPath = event.path || '';
  const withoutFunctionPrefix = rawPath.replace(/^\/?\.netlify\/functions\/api/, '') || rawPath;
  if (!withoutFunctionPrefix.startsWith('/')) {
    return `/${withoutFunctionPrefix}`;
  }
  return withoutFunctionPrefix;
}

const handler: Handler = async (event) => {
  const apiPath = normalizePath(event) || '/api';

  if (apiPath === '/api/health' || apiPath === '/api/health/') {
    return jsonResponse(200, { ok: true, status: 'healthy' });
  }

  if (apiPath.startsWith('/api/training')) {
    const updatedPath = `/.netlify/functions/training-api${apiPath}`;
    const delegatedEvent: HandlerEvent = {
      ...event,
      path: updatedPath,
      rawUrl: event.rawUrl?.replace(/\/\.netlify\/functions\/api/, '/.netlify/functions/training-api'),
    };
    return trainingHandler(delegatedEvent as any);
  }

  return jsonResponse(400, {
    ok: false,
    error: 'unknown_endpoint',
    path: apiPath,
  });
};

export { handler };

export const config: Config = {
  path: '/api/*',
  preferStatic: true,
};
