#!/usr/bin/env node
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = process.env.TRAINING_DB_URL || path.join(__dirname, 'training.db');
const db = new Database(DB_PATH);

db.exec(`
CREATE TABLE IF NOT EXISTS training_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'learner',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  last_login_at TEXT
);
CREATE TABLE IF NOT EXISTS training_courses (
  id TEXT PRIMARY KEY,
  title TEXT,
  version TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS training_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  module_id TEXT,
  lesson_id TEXT,
  event_type TEXT NOT NULL,
  ts TEXT DEFAULT CURRENT_TIMESTAMP,
  meta_json TEXT
);
CREATE TABLE IF NOT EXISTS training_lesson_time (
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  module_id TEXT,
  lesson_id TEXT,
  seconds_active INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(user_id, course_id, module_id, lesson_id)
);
CREATE TABLE IF NOT EXISTS training_quiz_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  quiz_id TEXT NOT NULL,
  attempt_number INTEGER NOT NULL,
  score_percent REAL NOT NULL,
  passed INTEGER DEFAULT 0,
  started_at TEXT DEFAULT CURRENT_TIMESTAMP,
  submitted_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS training_completions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  completed_at TEXT DEFAULT CURRENT_TIMESTAMP,
  final_score REAL,
  certificate_id TEXT
);
CREATE TABLE IF NOT EXISTS training_certificates (
  id TEXT PRIMARY KEY,
  certificate_code TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  issued_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS training_logins (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

console.log('Training tables ready at', DB_PATH);
