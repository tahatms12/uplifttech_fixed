import { getStore } from '@netlify/blobs';

const store = getStore({ name: 'training-csv', consistency: 'strong' });

interface CsvData {
  headers: string[];
  rows: Record<string, string>[];
}

const HEADER_MAP: Record<string, string[]> = {
  'users.csv': ['id', 'email', 'full_name', 'role', 'created_at', 'last_login_at'],
  'logins.csv': ['id', 'user_id', 'ts', 'ip_hash', 'user_agent'],
  'lesson_time.csv': ['user_id', 'course_id', 'module_id', 'lesson_id', 'seconds_active', 'updated_at'],
  'quiz_attempts.csv': ['id', 'user_id', 'course_id', 'quiz_id', 'attempt_number', 'score_percent', 'passed', 'started_at', 'submitted_at', 'answers_json'],
  'completions.csv': ['id', 'user_id', 'course_id', 'completed_at', 'final_score', 'certificate_id'],
  'certificates.csv': ['id', 'certificate_code', 'user_id', 'course_id', 'issued_at'],
  'rate_limits.csv': ['key', 'window_start', 'count', 'updated_at'],
};

function headersForKey(key: string): string[] {
  if (HEADER_MAP[key]) return HEADER_MAP[key];
  if (key.startsWith('events-') && key.endsWith('.csv')) {
    return ['id', 'user_id', 'course_id', 'module_id', 'lesson_id', 'event_type', 'ts', 'meta_json'];
  }
  throw new Error(`Unknown CSV key: ${key}`);
}

function parseCsv(text: string, expectedHeaders: string[]): CsvData {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = '';
  let inQuotes = false;

  const pushField = () => {
    current.push(field);
    field = '';
  };

  const pushRow = () => {
    if (current.length > 0 || field.length > 0) {
      pushField();
      rows.push(current);
      current = [];
    }
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        const next = text[i + 1];
        if (next === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        pushField();
      } else if (ch === '\n') {
        pushRow();
      } else if (ch === '\r') {
        continue;
      } else {
        field += ch;
      }
    }
  }
  pushRow();

  const header = rows.shift() || [];
  if (header.length === 0) {
    return { headers: expectedHeaders, rows: [] };
  }
  const headers = header;
  const dataRows = rows.map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((name, idx) => {
      obj[name] = row[idx] ?? '';
    });
    return obj;
  });
  return { headers, rows: dataRows };
}

function serializeCsv(headers: string[], rows: Record<string, string>[]): string {
  const escape = (value: string) => {
    if (value === undefined || value === null) return '';
    const needsQuote = /[",\n\r]/.test(value);
    const escaped = value.replace(/"/g, '""');
    return needsQuote ? `"${escaped}"` : escaped;
  };
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h] ?? '')).join(','));
  }
  return lines.join('\n');
}

async function acquireLock(key: string): Promise<string> {
  const lockKey = `locks/${key}.lock`;
  const now = Date.now();
  for (let attempt = 0; attempt < 10; attempt++) {
    const value = now.toString();
    const created = await store.set(lockKey, value, { onlyIfNew: true });
    if (created) return lockKey;
    const existing = await store.getWithMetadata(lockKey, { type: 'text' }).catch(() => null as any);
    const timestamp = existing?.data ? parseInt(existing.data, 10) : 0;
    if (timestamp && now - timestamp > 5000) {
      await store.delete(lockKey).catch(() => {});
    } else {
      await new Promise((resolve) => setTimeout(resolve, 100 + attempt * 25));
    }
  }
  throw new Error(`Unable to acquire lock for ${key}`);
}

async function releaseLock(lockKey: string) {
  await store.delete(lockKey).catch(() => {});
}

async function ensureHeaders(key: string, headers: string[]) {
  const existing = await store.get(key, { type: 'text' });
  if (existing === null) {
    await store.set(key, `${headers.join(',')}`);
  }
}

export async function readAll(key: string): Promise<Record<string, string>[]> {
  const headers = headersForKey(key);
  await ensureHeaders(key, headers);
  const text = (await store.get(key, { type: 'text' })) || '';
  if (!text) return [];
  const parsed = parseCsv(text, headers);
  return parsed.rows;
}

export async function appendRow(key: string, row: Record<string, string>): Promise<void> {
  const headers = headersForKey(key);
  const lockKey = await acquireLock(key);
  try {
    await ensureHeaders(key, headers);
    const text = (await store.get(key, { type: 'text' })) || headers.join(',');
    const parsed = parseCsv(text, headers);
    parsed.rows.push(row);
    await store.set(key, serializeCsv(headers, parsed.rows));
  } finally {
    await releaseLock(lockKey);
  }
}

export async function upsertBy(
  key: string,
  predicate: (row: Record<string, string>) => boolean,
  updater: (row: Record<string, string> | null) => Record<string, string>
): Promise<void> {
  const headers = headersForKey(key);
  const lockKey = await acquireLock(key);
  try {
    await ensureHeaders(key, headers);
    const text = (await store.get(key, { type: 'text' })) || headers.join(',');
    const parsed = parseCsv(text, headers);
    const idx = parsed.rows.findIndex(predicate);
    if (idx >= 0) {
      parsed.rows[idx] = updater(parsed.rows[idx]);
    } else {
      parsed.rows.push(updater(null));
    }
    await store.set(key, serializeCsv(headers, parsed.rows));
  } finally {
    await releaseLock(lockKey);
  }
}

export async function findOne(
  key: string,
  predicate: (row: Record<string, string>) => boolean
): Promise<Record<string, string> | null> {
  const rows = await readAll(key);
  return rows.find(predicate) || null;
}

export async function listKeys(prefix: string): Promise<string[]> {
  const result = await store.list({ prefix });
  return result.blobs.map((b) => b.key);
}
