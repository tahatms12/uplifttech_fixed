#!/usr/bin/env node
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = process.env.TRAINING_DB_URL || path.join(__dirname, 'training.db');
const email = process.env.TRAINING_ADMIN_EMAIL;
const password = process.env.TRAINING_ADMIN_PASSWORD;
const name = process.env.TRAINING_ADMIN_NAME || 'Training Admin';

if (!email || !password) {
  console.error('Set TRAINING_ADMIN_EMAIL and TRAINING_ADMIN_PASSWORD to seed an admin user.');
  process.exit(1);
}

const db = new Database(DB_PATH);

db.exec(`CREATE TABLE IF NOT EXISTS training_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'learner',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  last_login_at TEXT
);`);

const hash = bcrypt.hashSync(password, 10);
const existing = db.prepare('SELECT * FROM training_users WHERE email=?').get(email.toLowerCase());
if (existing) {
  db.prepare('UPDATE training_users SET password_hash=?, full_name=?, role=? WHERE id=?').run(hash, name, 'admin', existing.id);
  console.log('Updated existing admin');
} else {
  db.prepare('INSERT INTO training_users(id, email, full_name, password_hash, role) VALUES(?,?,?,?,?)').run(
    uuidv4(),
    email.toLowerCase(),
    name,
    hash,
    'admin'
  );
  console.log('Created admin user');
}
