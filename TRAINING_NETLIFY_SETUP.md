# Training module Netlify setup

This guide explains how to configure environment variables and routing so the password-protected **/training** area works in production, deploy previews, branch deploys, and local development.

## Key architecture (what the code does)
- React Router mounts `/training/*` via `TrainingLayout`, with the entry form at `/training` and the dashboard at `/training/dashboard`. `TrainingEntryPage` posts credentials and sets a cookie-based session when `/api/training/auth/login` responds 200, then redirects to the dashboard. 【F:src/App.tsx†L78-L119】【F:src/pages/training/TrainingEntryPage.tsx†L1-L37】
- All training API calls use a Netlify Function (`/.netlify/functions/training-api`) behind the `/api/training/*` rewrite. The client uses `trainingApi` helpers that always include credentials for cookie-based auth. 【F:src/lib/trainingApi.ts†L7-L36】【F:netlify/functions/training-api.ts†L236-L302】
- The function validates the Origin header against `TRAINING_APP_ORIGIN` (plus defaults) and compares the submitted username/password to `DEMO_USERNAME` and `DEMO_KEY`/`demo_key`. Successful logins mint an HTTP-only cookie signed with `TRAINING_JWT_SECRET`. 【F:netlify/functions/training-api.ts†L24-L99】【F:netlify/functions/_lib/security.ts†L63-L84】
- Data is stored in Netlify Blobs (`training-csv` store); no database credentials are required. 【F:netlify/functions/_lib/csvStore.ts†L1-L76】

## Environment variables to set
| Name | Where it is read | Context | Purpose | Default/fallback | Sensitivity | Netlify scope |
| --- | --- | --- | --- | --- | --- | --- |
| `TRAINING_JWT_SECRET` | `netlify/functions/training-api.ts` | Function runtime | Signs/verifies the training session JWT used in the HTTP-only cookie. Required. | None – missing value throws at startup. | Secret | All deploy contexts (Production, Deploy Preview, Branch) |
| `DEMO_USERNAME` | `netlify/functions/training-api.ts` | Function runtime | Demo username for training login. | `admin demo` (required for current demo) | Secret | All deploy contexts |
| `DEMO_KEY` (or `demo_key`) | `netlify/functions/training-api.ts` | Function runtime | The password compared during login; must match what users enter. | `12345` (required for current demo) | Secret | All deploy contexts |
| `TRAINING_COOKIE_NAME` | `netlify/functions/training-api.ts` | Function runtime | Customizes the cookie name for the session token. | `training_session` | Internal | Optional; all contexts if changed |
| `TRAINING_APP_ORIGIN` | `netlify/functions/training-api.ts` | Function runtime | Comma-separated list of allowed `Origin` values for API requests. | Defaults include `https://uplift-technologies.com`, Netlify deploy URLs, `http://localhost:8888`, `http://localhost:5173`. | Internal | Add production and preview origins across contexts if they differ |
| `TRAINING_ADMIN_EMAILS` | `netlify/functions/_lib/env.ts` | Function runtime | Comma-separated admin emails that unlock admin-only endpoints. | Empty list (no admins) | Internal | All contexts (optional) |
| `VITE_HUBSPOT_PORTAL_ID` | `src/components/integrations/HubSpotTracking.tsx` | Client build-time | Loads HubSpot tracking script. | If empty/placeholder, script is skipped. | Public (bundled) | All contexts if tracking is required |

## Netlify UI configuration (production first)
1. In Netlify **Site configuration → Environment variables**, add (or verify) these key/value pairs for **Production**, **Deploy Previews**, and **Branch Deploys**:
   - `TRAINING_JWT_SECRET` = `[REDACTED]`
   - `DEMO_USERNAME` = `admin demo`
   - `DEMO_KEY` = `12345`
   - Optional: `TRAINING_COOKIE_NAME`, `TRAINING_ADMIN_EMAILS`, `TRAINING_APP_ORIGIN` (include `https://uplift-technologies.com`, your preview domain(s), and local origin if using custom ports).
   - Optional: `VITE_HUBSPOT_PORTAL_ID` if HubSpot tracking is desired.
2. Save and **trigger a new deploy**. Any change to `VITE_*` values requires a rebuild; function-only variables take effect on the next function cold start but redeploy keeps contexts aligned.

## Routing and rewrites (current vs required)
- `netlify.toml` already rewrites `/api/training/*` to `/.netlify/functions/training-api` **before** the SPA catch-all to `/index.html`, which preserves both API and client routing. No patch needed. 【F:netlify.toml†L11-L40】
- Keep `_redirects` empty for these paths; adding a catch-all above the API rewrite would break the function endpoint.

## Local development parity
1. Create a local env file **not committed to git** (e.g., `.env`):
   ```
   TRAINING_JWT_SECRET=[REDACTED]
   DEMO_USERNAME=admin demo
   DEMO_KEY=[REDACTED]
   TRAINING_ADMIN_EMAILS=admin@example.com
   TRAINING_APP_ORIGIN=http://localhost:8888,http://localhost:5173
   VITE_HUBSPOT_PORTAL_ID=[OPTIONAL]
   ```
2. Run Netlify Dev to mirror production rewrites and function hosting:
   ```bash
   npm ci
   netlify dev
   ```
   Netlify uses `netlify.toml` to serve Vite on port 5173 and proxy functions under `/api/training/*`.
3. Visit `http://localhost:8888/training`, submit the username/password (matching `DEMO_USERNAME`/`DEMO_KEY`), and confirm redirect to `/training/dashboard`. Subsequent requests to `/api/training/auth/me` should return 200 with user info.

## Production/deploy preview verification checklist
1. Open `https://uplift-technologies.com/training` (or the preview URL). Ensure the form loads without console errors.
2. Log in with the configured `DEMO_USERNAME` and `DEMO_KEY`.
3. Network expectations:
   - `POST /api/training/auth/login` → **200** sets HTTP-only cookie named `training_session` (or your override).
   - `GET /api/training/auth/me` → **200** after login.
   - Subsequent data calls (`/api/training/progress`, `/api/training/events`, etc.) succeed with 200.
4. If you see 401/403 on any training API call:
   - Confirm `Origin` matches `TRAINING_APP_ORIGIN`.
   - Confirm `TRAINING_JWT_SECRET` and `DEMO_KEY` are present in the deploy context.
   - Ensure deploy used the latest build if `VITE_*` changed.

## Common failure modes
- **500 on login**: `DEMO_USERNAME` or `DEMO_KEY`/`demo_key` missing; add it to environment variables and redeploy.
- **401 on all API calls**: Missing/invalid cookie because `TRAINING_JWT_SECRET` changed without re-login; clear cookies and retry. Also ensure origin is allowed.
- **404 on API paths**: A catch-all redirect placed before the `/api/training/*` rule; ensure Netlify redirect order matches `netlify.toml`.
- **Origin forbidden**: Add the requesting origin (including scheme) to `TRAINING_APP_ORIGIN`.
- **HubSpot script missing**: Set `VITE_HUBSPOT_PORTAL_ID` and rebuild.
