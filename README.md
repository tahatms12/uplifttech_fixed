uplifttech

## Build Issue: rollup-plugin-visualizer and @rollup/rollup-win32-x64-msvc

**Problem:** The project build consistently fails with the error `Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'rollup-plugin-visualizer' imported from /opt/build/repo/node_modules/.vite-te` or `Error: Cannot find module @rollup/rollup-win32-x64-msvc`. This indicates a problem with `rollup`'s native module on Windows, likely due to an `npm` bug related to optional dependencies.

**Attempted Solutions:**
1.  **Minimal Fix (Remove `rollup-plugin-visualizer`):**
    *   Removed `rollup-plugin-visualizer` import and usage from `vite.config.ts`.
    *   Result: Build still failed with `@rollup/rollup-win32-x64-msvc` error.

2.  **Full Dependency Audit (Clean install and update):**
    *   Deleted `node_modules` and `package-lock.json`.
    *   Updated all packages using `npx npm-check-updates -u`.
    *   Performed `npm install`.
    *   Result: Build still failed with `@rollup/rollup-win32-x64-msvc` error.

3.  **Nuclear Option (Rebuild project from scratch):**
    *   Created a new Vite project.
    *   Copied `src` and `public` directories.
    *   Installed dependencies in the new project.
    *   Result: Build failed with TypeScript errors and eventually the same `@rollup/rollup-win32-x64-msvc` error when trying to build the copied project.

4.  **Direct `rollup` and native module installation attempts:**
    *   Updated `npm` to latest.
    *   Installed `rollup` directly.
    *   Installed `@rollup/rollup-win32-x64-msvc` directly.
    *   Installed `rollup` with `--legacy-peer-deps`.
    *   Result: All attempts resulted in the same `@rollup/rollup-win32-x64-msvc` error.

5.  **Clean npm cache and reinstall:**
    *   Cleared `npm` cache with `npm cache clean --force`.
    *   Removed `node_modules` and `package-lock.json`.
    *   Performed `npm install`.
    *   Result: Build still failed with `@rollup/rollup-win32-x64-msvc` error.

**Conclusion:**
The issue appears to be deeply rooted in how `rollup`'s native module interacts with the Windows environment, possibly exacerbated by `npm`'s handling of optional dependencies. Given the persistence of the error across multiple troubleshooting steps, it is recommended to explore alternative deployment strategies such as:

*   **Strategy 4: Migrate to Vercel/Cloudflare Pages:** These platforms often have more robust build environments that might handle such dependency issues better.
*   **Strategy 6: Containerize the Build:** Creating a Dockerfile with a controlled build environment (e.g., Linux-based) could bypass the Windows-specific `rollup` problem.
## Cloudflare Pages Deployment

**Build command:** `npm run build`

**Build output directory:** `dist`

**Functions directory:** `functions`

**Node.js version:** `18.x`

### Required bindings

- **R2 bucket binding:** `TRAINING_CSV`

### Environment variables

- `TRAINING_JWT_SECRET` (required)
- `DEMO_USERNAME` (required)
- `DEMO_KEY` (required; `demo_key` is also accepted)
- `TRAINING_COOKIE_NAME` (optional; defaults to `training_session`)
- `TRAINING_APP_ORIGIN` (optional; comma-separated allowed Origins)
- `TRAINING_ADMIN_EMAILS` (optional; comma-separated admin emails)
