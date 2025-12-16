# Stepper-Based LMS Training Portal Migration Guide

This document is a step-by-step specification for recreating the existing stepper-based LMS training portal and private training API from this repository into a fresh repository. It captures architecture, data flows, endpoints, UI behaviors, and configuration so an AI (or developer) can implement the system in a single pass without referring back to the source.

## 1) System Overview
- **Frontend:** Vite + React single-page app with a marketing site and a private training portal under the `/training` path. Routing is handled client-side via `react-router-dom`, with protected pages for the dashboard, courses, admin, and certificate verification.
- **Backend:** Express server with SQLite (via `better-sqlite3`) for authentication, progress capture, quizzes, and certificate generation. API is prefixed with `/api/training` and uses secure, HTTP-only cookies for sessions.
- **Course model:** Courses are 7-day plans composed of `CourseDay` objects, each containing ordered `CourseStep` items. Steps power the UI steppers and tracking events.
- **Data pipeline:** A `courses.txt` source file is parsed to JSON catalogs using build scripts. The catalog drives both the frontend course steppers and quiz metadata on the server.

## 2) Data and Types
Define the following TypeScript types to mirror the current shapes used by both client and server:
- `CourseStep` with fields: `stepId`, `title`, `type` (one of `Learn|Observe|Do|Simulate|Check|Document|Reflect`), `contentBlocks` (string[]), `activities` (string[]), `acceptanceCriteria` (string[]), optional `assessment.questions[{prompt, answerKey, rationale?}]`, `verification` {`verification_status`, `verification_notes`, `references`, `lastReviewed`}, and `roleRelevance` string[].【F:src/types/training.ts†L1-L20】
- `CourseDay` with `dayNumber`, `dayTitle`, `estimatedTimeMinutes`, `steps: CourseStep[]`.【F:src/types/training.ts†L22-L26】
- `Course` with identity fields plus `summary`, `roles`, `tags`, `durationPlan`, `prerequisites`, `outcomes`, `source`, and `days: CourseDay[]`. The catalog contains `programOverview` and `roles` arrays.【F:src/types/training.ts†L28-L45】

### Catalog content
Seed the new repo with a `src/data/training/catalog` module exporting a `Catalog` object. It should include at least one course similar to “Healthcare Compliance Foundations” with seven days of steps, as shown in the existing `catalog.ts`. Preserve structure (titles, verification metadata, activities, acceptance criteria).【F:src/data/training/catalog.ts†L1-L150】

### Role/tag maps
Add static JSON files for `roles.json`, `tags.json`, and `roleCourseMap.json` matching the builder outputs so the frontend can load role/tag metadata. They live under `src/data/training/` in the current project.【F:src/data/training/roles.json†L1-L3】【F:src/data/training/tags.json†L1-L1】【F:src/data/training/roleCourseMap.json†L1-L8】

## 3) Backend (Training API)
Implement an Express server (e.g., `scripts/training/server.js`) with:
- **Database:** SQLite via `better-sqlite3`, default path `scripts/training/training.db` (override with `TRAINING_DB_URL`). Ensure `ensureTables()` creates tables for `training_users`, `training_events`, `training_lesson_time`, `training_quiz_attempts`, `training_completions`, `training_certificates`, `training_courses`, and `training_logins`.【F:scripts/training/server.js†L18-L82】
- **Configuration:** Read `TRAINING_JWT_SECRET`, `TRAINING_COOKIE_NAME` (default `training_session`), `TRAINING_APP_ORIGIN` (for origin validation if needed), and `TRAINING_ADMIN_EMAILS` (comma-separated).【F:scripts/training/server.js†L16-L36】
- **Auth:** `/api/training/auth/login` checks email/password (bcrypt compare), updates `last_login_at`, logs to `training_logins`, and sets a signed JWT cookie (`httpOnly`, `secure`, `sameSite:lax`, `path:'/training'`, 2h). `/auth/logout` clears the cookie. `/auth/me` returns decoded user info. Use `express-rate-limit` on auth endpoints.【F:scripts/training/server.js†L46-L113】
- **Events:** `/api/training/events` accepts `{courseId,moduleId?,lessonId?,eventType,meta?}`. For `eventType==='heartbeat'` with `lessonId` and `meta.seconds`, increment `training_lesson_time.seconds_active` per `(user, course, module, lesson)`; otherwise insert a training_events row. Rate-limit to 120/minute.【F:scripts/training/server.js†L115-L173】
- **Quizzes:** `/api/training/quizzes/submit` looks up quiz definitions from the catalog, scores answers (case-insensitive), saves to `training_quiz_attempts` with incremented `attempt_number`, and returns `{score, passed}` using course quiz passing thresholds (default 80).【F:scripts/training/server.js†L175-L206】
- **Progress:** `/api/training/progress` returns lesson time, quiz attempts, and completions for the authenticated user.【F:scripts/training/server.js†L208-L212】
- **Certificates:** `/api/training/certificates` inserts records into `training_certificates` and `training_completions` with generated UUIDs and verification code; returns `{certificateId, code}`. `/api/training/certificates/:id/pdf` streams a PDF certificate via `pdfkit` with user name, course title, certificate ID, verification code, and issued date. `/api/training/verify?code=...` validates by certificate code and returns holder, course, and issuance data.【F:scripts/training/server.js†L228-L283】
- **Admin:** Middleware `requireAdmin` checks that the user email is in `TRAINING_ADMIN_EMAILS`. Admin endpoints: `/admin/users` (list users), `/admin/user/:id/progress` (user time/quizzes/completions), and `/admin/export.csv` (CSV of completions).【F:scripts/training/server.js†L214-L227】
- **Server start:** Listen on `PORT` (default 4173).【F:scripts/training/server.js†L285-L288】

### Database migration and seeding scripts
- Provide a `migrate.js` script that creates all tables (same schema as `ensureTables`).【F:scripts/training/migrate.js†L1-L48】
- Provide a `seedAdmin.js` script that hashes `TRAINING_ADMIN_PASSWORD`, creates/updates a training user with role `admin` using `TRAINING_ADMIN_EMAIL/NAME`, and exits with guidance if env vars are missing.【F:scripts/training/seedAdmin.js†L1-L40】

### Catalog builder (optional automation)
- Implement `parseCoursesTxt.js` to read `courses.txt`, extract roles, program overview, and course sections (regex `### <num>.<num> COURSE <num>: <Title>`), slugify IDs, and emit `{programOverview, roles, courses}`.【F:scripts/training/parseCoursesTxt.js†L1-L60】
- Implement `buildCatalog.js` to:
  - Define step type order (`Learn, Observe, Do, Simulate, Check, Document, Reflect`).
  - Chunk course raw lines into seven steps, generate day/step metadata, outcomes, tags, and role relevance.
  - Write `src/data/training/courseCatalog.json`, `roles.json`, `tags.json`, `roleCourseMap.json`, and `exports/courseCatalog.builder.json` (with navigation graph and completion thresholds).
  - Emit a verification report `reports/training/verification-pack.md` summarizing verification statuses per step.
  - CLI usage logs “Wrote N courses to courseCatalog.json”.【F:scripts/training/buildCatalog.js†L1-L110】【F:scripts/training/buildCatalog.js†L112-L169】

## 4) Frontend Application
### Routing
Use `react-router-dom` with routes:
- `/` marketing content.
- `/training` login page.
- `/training/dashboard` learner dashboard (requires authenticated user).
- `/training/course/:courseId` course detail with stepper navigation and quiz/certificate hooks.
- `/training/admin` admin console (relies on backend admin check).
- `/training/verify` certificate verification page.
Wrap the app with Router, include shared `Header/Footer`, `PriceTicker`, and background components.【F:src/App.tsx†L1-L46】

### Training API client (`src/lib/trainingApi.ts`)
Implement a fetch helper that attaches JSON headers and `credentials:'include'`. Expose functions: `login`, `logout`, `currentUser`, `sendEvent`, `submitQuiz`, `fetchProgress`, `issueCertificate`, `fetchAdminUsers`, `fetchAdminUserProgress`, `fetchAdminExport` (raw text), and `verifyCertificate`. Import `catalog` from `src/data/training/catalog`.【F:src/lib/trainingApi.ts†L1-L60】【F:src/lib/trainingApi.ts†L62-L109】

### User hook (`src/lib/useTrainingUser.ts`)
Implement a React hook that fetches `/auth/me` on mount, sets `{user, loading}`, and exposes a `setUser` setter for sign-out. Ensure cleanup guard for unmounted state.【F:src/lib/useTrainingUser.ts†L1-L17】

### Progress store (`src/components/training/ProgressStore.ts`)
Use Zustand to persist course progress in `localStorage` under key `training-progress-v1`. State shape: `courseProgress` keyed by `courseId`, each with `{completedSteps: string[], lastStep?}`. Provide `toggleStep(courseId, stepId)` to add/remove completed steps and `setLastStep(courseId, stepId)` to bookmark navigation. Persist after each update.【F:src/components/training/ProgressStore.ts†L1-L34】

### Course stepper components
- **CourseStepper:** Accepts a `Course`, renders a day tab list (`role="tablist"`) and completion bar. Computes completion percent from total steps vs. `completedSteps`. Clicking a day sets `activeDay`; keyboard Enter/Space supported. Renders `DayStepper` for the active day. Styling differentiates active tabs.【F:src/components/training/CourseStepper.tsx†L1-L49】
- **DayStepper:** Renders step cards for a given day. Each card shows type, title, content blocks, activities, and acceptance criteria. Includes a toggle button to mark complete (updates store and last step). Completed steps show green styling. Accessibility: container `role="group"`, button `aria-pressed`.【F:src/components/training/DayStepper.tsx†L1-L55】

### Training pages
- **LoginPage:** Email/password form, `login()` call, redirects to `/training/dashboard` on success. Shows privacy copy and invalid-credential error. Adds `robots` meta `noindex,nofollow`. Redirects authenticated users automatically.【F:src/pages/training/LoginPage.tsx†L1-L54】
- **DashboardPage:** Loads `catalog` courses and user progress (`fetchProgress`). Lists cards linking to `/training/course/:slug`, shows completion/certificate hint when completions exist. Includes sign-out button calling `logout()` and clearing user via hook. Adds `noindex` meta.【F:src/pages/training/DashboardPage.tsx†L1-L49】
- **CoursePage:** Finds course by `slug` or `id` from params. Protects access (redirect to `/training` if unauthenticated). Allows marking lesson completion via `sendEvent`, running quizzes via `submitQuiz` (placeholder answers), and generating certificates via `issueCertificate`, displaying verification code. Uses status messages and ensures meta `noindex`.【F:src/pages/training/CoursePage.tsx†L1-L66】【F:src/pages/training/CoursePage.tsx†L68-L122】
- **AdminPage:** Requires authenticated user; fetches admin user list and per-user progress via API. Supports CSV export by creating a Blob and downloading `training-progress.csv`. Renders users list and selected user’s completions/quiz attempts. Adds `noindex` meta.【F:src/pages/training/AdminPage.tsx†L1-L72】【F:src/pages/training/AdminPage.tsx†L74-L142】
- **VerifyPage:** Reads `code` query param, calls `verifyCertificate`, and displays validity and certificate details or an error. Adds `noindex` meta.【F:src/pages/training/VerifyPage.tsx†L1-L36】【F:src/pages/training/VerifyPage.tsx†L38-L61】

### UX/Accessibility patterns
- Meta tag `robots` set to `noindex,nofollow` on all training pages to keep private content out of search results. Implement via `useEffect` per page.
- Buttons and tab controls use `aria-*` attributes for accessibility (`role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, `aria-pressed`). Progress bars use `role="progressbar"` with `aria-valuenow/min/max`.【F:src/components/training/CourseStepper.tsx†L17-L48】

## 5) Marketing Shell (optional for parity)
Maintain the marketing components (`Header`, `Hero`, `About`, `Strategy`, `Portfolio`, `Tokenomics`, `Roadmap`, `Community`, `Footer`, `FloatingParticles`, `PriceTicker`) as placeholders to wrap the training portal routes. These can be stubs in the new repo but should preserve routing scaffolding so `/training` paths coexist with the main site. The `App` component shows how both areas are combined.【F:src/App.tsx†L1-L46】

## 6) Environment and Setup
- **Dependencies:** `express`, `express-rate-limit`, `cookie-parser`, `bcryptjs`, `jsonwebtoken`, `better-sqlite3`, `pdfkit`, `uuid`, `vite`, `react`, `react-router-dom`, `zustand`.
- **Env vars for server:**
  - `TRAINING_JWT_SECRET`: JWT signing secret.
  - `TRAINING_ADMIN_EMAILS`: comma-separated admin emails for `/training/admin` access.
  - `TRAINING_DB_URL`: SQLite path (defaults to `scripts/training/training.db`).
  - `TRAINING_COOKIE_NAME`: optional session cookie name.
  - `TRAINING_APP_ORIGIN`: origin string for future CSRF/origin checks.
  - `TRAINING_ADMIN_EMAIL/PASSWORD/NAME`: used by `seedAdmin` script to create an admin.
- **Local run sequence:**
  1. `npm install`.
  2. `npm run training:migrate` to create tables.
  3. Seed admin: `TRAINING_ADMIN_EMAIL="user@example.com" TRAINING_ADMIN_PASSWORD="StrongPassword" npm run training:seed`.
  4. Start API: `npm run training:server` (defaults to port 4173).
  5. Start Vite client: `npm run dev` and browse to `http://localhost:5173/training`.

## 7) Implementation Steps for a Fresh Repo
1. **Initialize project:** Create Vite + React app, add TypeScript support, install dependencies above, and set up Tailwind or equivalent styling if desired.
2. **Add training data:** Copy/create `src/data/training/catalog.ts` and related JSON files; ensure they export a `Catalog` object matching section 2.
3. **Add types:** Recreate `src/types/training.ts` and global declarations (`types.d.ts` if needed) so components can import type-safe models.
4. **Implement API client + hook:** Add `src/lib/trainingApi.ts` and `src/lib/useTrainingUser.ts` with the same request patterns and exports.
5. **State store:** Implement `ProgressStore` via Zustand with localStorage persistence and `training-progress-v1` key.
6. **UI components:** Build `CourseStepper` and `DayStepper` components with accessibility attributes and completion logic. Style completed cards and progress bar as per existing classes.
7. **Pages and routing:** Wire up `LoginPage`, `DashboardPage`, `CoursePage`, `AdminPage`, `VerifyPage` under `/training` routes. Ensure redirects for unauthenticated users and meta tag handling.
8. **Backend server:** Add Express server with routes described in section 3, plus `migrate.js` and `seedAdmin.js` scripts. Include `buildCatalog.js` and `parseCoursesTxt.js` if automatic catalog generation is required; otherwise, ship static catalog files.
9. **Certificates and verification:** Integrate `pdfkit` streaming for certificate PDFs and verification endpoint for public validation.
10. **Testing:** Validate login/logout flow, progress capture (events + heartbeats), quiz submissions, certificate issuance, admin export, and verification endpoint.

## 8) Security and Privacy Notes
- Use HTTPS (`secure` cookies) in production; keep `httpOnly` and `sameSite:lax` on session cookies.
- Rate-limit authentication and event ingestion per existing settings (20 login attempts / 5 min; 120 events / min).【F:scripts/training/server.js†L46-L59】
- Ensure catalog and quiz definitions are trusted sources; verification status fields are included to track content provenance.
- Training pages set `noindex,nofollow` to keep the portal private.

## 9) Artifact Outputs
- Generated catalogs: `src/data/training/courseCatalog.json`, `exports/courseCatalog.builder.json` (navigation graph), `roles.json`, `tags.json`, `roleCourseMap.json`.
- Verification pack: `reports/training/verification-pack.md` summarizing per-step verification status.
- Database: `training.db` with tables listed above and seeded admin user.

Following this document in a new repository will recreate the full stepper-driven LMS experience, including backend APIs, data flows, and frontend UI/UX parity with the current implementation.
