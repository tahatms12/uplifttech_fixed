#!/usr/bin/env node
import express from 'express';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 4173;
const JWT_SECRET = process.env.TRAINING_JWT_SECRET || 'change-me';
const COOKIE_NAME = process.env.TRAINING_COOKIE_NAME || 'training_session';
const APP_ORIGIN = process.env.TRAINING_APP_ORIGIN || 'http://localhost:5173';
const DB_PATH = process.env.TRAINING_DB_URL || path.join(__dirname, 'training.db');
const ADMIN_EMAILS = (process.env.TRAINING_ADMIN_EMAILS || '').split(',').map((v) => v.trim()).filter(Boolean);

const catalogPath = path.join(__dirname, 'catalog.json');
const catalog = fs.existsSync(catalogPath)
  ? JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
  : { courses: [] };

const db = new Database(DB_PATH);

function ensureTables() {
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
      PRIMARY KEY (user_id, course_id, module_id, lesson_id)
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
    CREATE TABLE IF NOT EXISTS training_courses (
      id TEXT PRIMARY KEY,
      title TEXT,
      version TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS training_logins (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      ip_hash TEXT,
      user_agent TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

ensureTables();

const app = express();
app.use(express.json());
app.use(cookieParser());

const authLimiter = rateLimit({ windowMs: 5 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });
const eventLimiter = rateLimit({ windowMs: 60 * 1000, max: 120, standardHeaders: true, legacyHeaders: false });

function setSessionCookie(res, payload) {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/training',
    maxAge: 2 * 60 * 60 * 1000,
  });
}

function authMiddleware(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: 'unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ error: 'unauthorized' });
  }
}

app.post('/api/training/auth/login', authLimiter, (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Invalid credentials' });
  const stmt = db.prepare('SELECT * FROM training_users WHERE email = ?');
  const user = stmt.get(email.toLowerCase());
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  db.prepare('UPDATE training_users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);
  db.prepare('INSERT INTO training_logins(id, user_id, ip_hash, user_agent) VALUES(?,?,?,?)').run(
    uuidv4(),
    user.id,
    bcrypt.hashSync(req.ip || 'local', 8),
    req.headers['user-agent'] || ''
  );
  setSessionCookie(res, { id: user.id, email: user.email, role: user.role, full_name: user.full_name });
  res.json({ ok: true });
});

app.post('/api/training/auth/logout', authMiddleware, (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/training' });
  res.json({ ok: true });
});

app.get('/api/training/auth/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

app.post('/api/training/events', eventLimiter, authMiddleware, (req, res) => {
  const { courseId, moduleId, lessonId, eventType, meta } = req.body || {};
  if (!courseId || !eventType) return res.status(400).json({ error: 'invalid' });
  const id = uuidv4();
  db.prepare('INSERT INTO training_events(id, user_id, course_id, module_id, lesson_id, event_type, meta_json) VALUES(?,?,?,?,?,?,?)').run(
    id,
    req.user.id,
    courseId,
    moduleId || null,
    lessonId || null,
    eventType,
    meta ? JSON.stringify(meta) : null
  );
  if (eventType === 'heartbeat' && lessonId && meta?.seconds) {
    const existing = db.prepare('SELECT * FROM training_lesson_time WHERE user_id=? AND course_id=? AND module_id=? AND lesson_id=?').get(
      req.user.id,
      courseId,
      moduleId || '',
      lessonId
    );
    const seconds = meta.seconds || 0;
    if (existing) {
      db.prepare('UPDATE training_lesson_time SET seconds_active = seconds_active + ?, updated_at=CURRENT_TIMESTAMP WHERE user_id=? AND course_id=? AND module_id=? AND lesson_id=?').run(
        seconds,
        req.user.id,
        courseId,
        moduleId || '',
        lessonId
      );
    } else {
      db.prepare('INSERT INTO training_lesson_time(user_id, course_id, module_id, lesson_id, seconds_active) VALUES(?,?,?,?,?)').run(
        req.user.id,
        courseId,
        moduleId || '',
        lessonId,
        seconds
      );
    }
  }
  res.json({ ok: true });
});

function getQuizDefinition(courseId, quizId) {
  const course = catalog.courses.find((c) => c.id === courseId || c.slug === courseId);
  if (!course) return null;
  return (course.quizzes || []).find((q) => q.id === quizId) || null;
}

app.post('/api/training/quizzes/submit', authMiddleware, (req, res) => {
  const { courseId, quizId, answers } = req.body || {};
  if (!courseId || !quizId || !answers) return res.status(400).json({ error: 'invalid' });
  const def = getQuizDefinition(courseId, quizId);
  if (!def) return res.status(404).json({ error: 'quiz_not_found' });
  const total = def.questions.length;
  let correct = 0;
  def.questions.forEach((q, idx) => {
    if ((answers[idx] || '').trim().toLowerCase() === q.correct.trim().toLowerCase()) correct += 1;
  });
  const score = Math.round((correct / total) * 100);
  const passed = score >= (def.passing || 80);
  const attempts = db.prepare('SELECT COUNT(*) as count FROM training_quiz_attempts WHERE user_id=? AND quiz_id=?').get(req.user.id, quizId)?.count || 0;
  db.prepare('INSERT INTO training_quiz_attempts(id, user_id, course_id, quiz_id, attempt_number, score_percent, passed) VALUES(?,?,?,?,?,?,?)').run(
    uuidv4(),
    req.user.id,
    courseId,
    quizId,
    attempts + 1,
    score,
    passed ? 1 : 0
  );
  res.json({ score, passed });
});

app.get('/api/training/progress', authMiddleware, (req, res) => {
  const timeRows = db.prepare('SELECT * FROM training_lesson_time WHERE user_id=?').all(req.user.id);
  const quizRows = db.prepare('SELECT * FROM training_quiz_attempts WHERE user_id=?').all(req.user.id);
  const completions = db.prepare('SELECT * FROM training_completions WHERE user_id=?').all(req.user.id);
  res.json({ time: timeRows, quizzes: quizRows, completions });
});

function requireAdmin(req, res, next) {
  if (!ADMIN_EMAILS.length || !req.user?.email) return res.status(403).json({ error: 'forbidden' });
  if (!ADMIN_EMAILS.includes(req.user.email)) return res.status(403).json({ error: 'forbidden' });
  next();
}

app.get('/api/training/admin/users', authMiddleware, requireAdmin, (req, res) => {
  const users = db.prepare('SELECT id, email, full_name, role, created_at, last_login_at FROM training_users').all();
  res.json({ users });
});

app.get('/api/training/admin/user/:id/progress', authMiddleware, requireAdmin, (req, res) => {
  const userId = req.params.id;
  const time = db.prepare('SELECT * FROM training_lesson_time WHERE user_id=?').all(userId);
  const quizzes = db.prepare('SELECT * FROM training_quiz_attempts WHERE user_id=?').all(userId);
  const completions = db.prepare('SELECT * FROM training_completions WHERE user_id=?').all(userId);
  res.json({ time, quizzes, completions });
});

app.get('/api/training/admin/export.csv', authMiddleware, requireAdmin, (req, res) => {
  const rows = db.prepare('SELECT * FROM training_completions').all();
  const header = 'user_id,course_id,completed_at,final_score,certificate_id\n';
  const body = rows.map((r) => `${r.user_id},${r.course_id},${r.completed_at},${r.final_score || ''},${r.certificate_id || ''}`).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.send(header + body);
});

app.post('/api/training/certificates', authMiddleware, (req, res) => {
  const { courseId, finalScore } = req.body || {};
  if (!courseId) return res.status(400).json({ error: 'invalid' });
  const code = uuidv4();
  const certId = uuidv4();
  db.prepare('INSERT INTO training_certificates(id, certificate_code, user_id, course_id) VALUES(?,?,?,?)').run(certId, code, req.user.id, courseId);
  db.prepare('INSERT INTO training_completions(id, user_id, course_id, final_score, certificate_id) VALUES(?,?,?,?,?)').run(
    uuidv4(),
    req.user.id,
    courseId,
    finalScore || null,
    certId
  );
  res.json({ certificateId: certId, code });
});

app.get('/api/training/certificates/:id/pdf', authMiddleware, (req, res) => {
  const cert = db.prepare('SELECT * FROM training_certificates WHERE id=?').get(req.params.id);
  if (!cert) return res.status(404).json({ error: 'not_found' });
  const user = db.prepare('SELECT full_name FROM training_users WHERE id=?').get(cert.user_id);
  const course = catalog.courses.find((c) => c.id === cert.course_id || c.slug === cert.course_id);
  res.setHeader('Content-Type', 'application/pdf');
  const doc = new PDFDocument();
  doc.info.Title = 'Uplift Technologies Training Certificate';
  doc.pipe(res);
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0b1224');
  doc.fillColor('#ffffff');
  doc.fontSize(22).text('Uplift Technologies Training Certificate', { align: 'center', underline: true });
  doc.moveDown();
  doc.fontSize(16).text(`Awarded to: ${user?.full_name || 'Learner'}`, { align: 'center' });
  doc.text(`Course: ${course?.title || cert.course_id}`, { align: 'center' });
  doc.text(`Certificate ID: ${cert.id}`, { align: 'center' });
  doc.text(`Verification Code: ${cert.certificate_code}`, { align: 'center' });
  doc.text(`Issued: ${new Date(cert.issued_at || Date.now()).toDateString()}`, { align: 'center' });
  doc.moveDown();
  doc.text('Verify at https://uplift-technologies.com/training/verify', { align: 'center' });
  doc.end();
});

app.get('/api/training/verify', (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: 'missing_code' });
  const cert = db.prepare('SELECT * FROM training_certificates WHERE certificate_code=?').get(code);
  if (!cert) return res.json({ valid: false });
  const user = db.prepare('SELECT full_name FROM training_users WHERE id=?').get(cert.user_id);
  res.json({ valid: true, certificateId: cert.id, user: user?.full_name ? `${user.full_name}` : 'Learner', courseId: cert.course_id, issued_at: cert.issued_at });
});

app.listen(PORT, () => {
  console.log(`Training API listening on :${PORT}`);
});
