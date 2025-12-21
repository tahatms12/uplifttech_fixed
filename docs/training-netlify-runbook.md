# Training LMS Netlify Runbook

## Netlify build settings
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

## Required environment variables
Set these for Production and Deploy Previews:
- `TRAINING_JWT_SECRET`
- `DEMO_KEY` (or `demo_key`)
- `DEMO_USERNAME` (comma-separated list)
- `TRAINING_ADMIN_EMAILS` (optional)
- `TRAINING_APP_ORIGIN` (comma-separated list)

### Recommended `TRAINING_APP_ORIGIN` values
- `https://uplift-technologies.com`
- `https://<SITE_NAME>.netlify.app`

Local Netlify Dev uses `http://localhost:8888` and is already allowed in code.

## Smoke tests
- `/training` loads
- `/training/course/:id` redirects to `/training` when logged out
- Login works and sets the auth cookie
- “Mark complete” persists across refresh
- `/training/admin` blocked for non-admin and works for admin

## Troubleshooting
- Secure cookie on HTTP: fixed by conditional `Secure` flag for local dev.
- Missing credentials include: fixed in the training API client.
- Origin mismatch: fixed by allowlist + `SITE_NAME` pattern support.
