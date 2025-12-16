# Uplift Technologies Website

This project is a Vite + React single-page experience with a private training portal under `/training`.

## Development

- Install dependencies: `npm install`
- Start marketing site locally: `npm run dev`
- Training API (Express + SQLite): `npm run training:migrate` then `npm run training:server`

## Training Portal configuration

Set the following environment variables when running the training server:

- `TRAINING_JWT_SECRET` – secret used to sign session tokens.
- `TRAINING_ADMIN_EMAILS` – comma-separated list of admin emails allowed to view `/training/admin`.
- `TRAINING_DB_URL` – path to SQLite database file (defaults to `scripts/training/training.db`).
- `TRAINING_COOKIE_NAME` – optional override for the session cookie name.
- `TRAINING_APP_ORIGIN` – application origin for CSRF/origin validation if needed.
- `TRAINING_ADMIN_EMAIL` / `TRAINING_ADMIN_PASSWORD` / `TRAINING_ADMIN_NAME` – used by the seed script to create an admin user.

### Seeding an admin user

Run `TRAINING_ADMIN_EMAIL="user@example.com" TRAINING_ADMIN_PASSWORD="StrongPassword" npm run training:seed` to create or update an admin record. Passwords are hashed with bcrypt before storage.

### Testing the portal locally

1. Run migrations: `npm run training:migrate`.
2. Seed an admin user using the command above.
3. Start the API server: `npm run training:server` (defaults to port 4173).
4. Start the Vite client: `npm run dev` and browse to `http://localhost:5173/training`.

### Data and persistence

The training server stores data in SQLite tables for users, events, lesson time, quizzes, completions, and certificates. Certificate PDFs are generated on demand via `/api/training/certificates/:id/pdf`.
