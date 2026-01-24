# Roadmap – Assignment FTechnology (Nx + React + Nest + Drizzle)

This roadmap is an operational checklist to complete the assignment in an incremental and verifiable way.
The goal is to deliver the **core requirements** (fully functional end-to-end) first, followed by hardening and bonuses.

---

## Working Conventions

### Git workflow (lightweight)

* Branch per macro-feature (feature complete before merging to `main`)
* PR for each macro-feature (2–6 PRs total, short description and test instructions)
* Commits using Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`)
* No `wip` commits

### Tags (milestone)

* `v0.1.0` → Core assignment completed (all required requirements)
* `v0.2.0` → Bonus + Extra completed (if applicable)

---

## Milestone 0 – Repo & Documentation (baseline)

**Output:** Initialized Nx workspace and initial documentation ready.

* [x] README.md (IT) + README.en.md (EN structure)
* [x] `docs/en/COMMANDS.md` (commands + reasoning)
* [x] `docs/en/ROADMAP.md` (this checklist)
* [x] Structure setup for `docs/it/` (placeholder)

---

## Milestone 1 – Workspace Setup + Quality Baseline

**Output:** stable quality baseline (format/lint/test), repo ready to scale.

* [x] Verify base Nx commands (`nx graph`, `nx lint`, `nx format`)
* [x] Setup formatter/linter (prettier + eslint already functional)
* [ ] (Optional) husky + lint-staged + commitlint
* [x] Minimal definition of `.nvmrc`
* [x] Environment setup documentation (`COMMANDS.md`, `SETUP.md`)

---

## Milestone 2 – Backend Foundation (DB + Drizzle + Auth Core)

**Branch:** `feat/api-auth`

**Output:** Working API with DB, schema, and authentication (register/login), error handling, and validation.

### Database & Drizzle

* [x] DB Choice PostgreSQL
* [x] Setup Drizzle config
* [x] Table schema:
* [x] `users`
* [x] `access_logs`
* [ ] (If needed for remember me) `refresh_tokens` / `sessions`


* [x] Migrations generated/run
* [ ] Minimal seed (optional but recommended)

### Auth API

* [x] `POST /auth/register`
* [x] input validation
* [x] password hashing
* [x] duplicate email handling


* [x] `POST /auth/login`
* [x] credential verification
* [x] JWT access token
* [x] error handling (401)


* [x] Remember me
* [x] defined strategy (httpOnly cookie refresh token or alternative)


* [x] Access logging
* [x] save login record in `access_logs`


* [x] JWT guard (Bearer token)
* [x] `GET /me` (profile)
* [x] `GET /me/access-history?limit=5`

**PR:** `feat(api): auth + db foundation`

**Merge target:** `main`

---

## Milestone 3 – Upload Avatar (Backend)

**Branch:** `feat/api-avatar-upload`

**Output:** functional optional avatar upload, with reference persistence in the profile.

* [x] Avatar upload endpoint (multer / file handling)
* [x] File saving (e.g., `/uploads`)
* [x] Update user `avatarUrl` / `avatarPath`
* [x] Serve static files (Nest config)
* [x] Minimal validation (mime type, size limit)

**PR:** `feat(api): avatar upload`

**Merge target:** `main`

---

## Milestone 4 – Frontend Foundation (Routing + Auth Context + Guards)

**Branch:** `feat/web-auth-routing`

**Output:** frontend structure ready, routing configured, route protection.

* [x] Setup React app `web`
* [x] React Router:
* [x] `/register`
* [x] `/login`
* [x] `/dashboard` (private)


* [x] Ordered structure (pages / routes / auth)
* [x] Reusable Auth UI (libs/web/auth-ui)
* [x] Auth logic (context)
* [x] AuthProvider/token
* [x] ProtectedRoute / redirect logic
* [x] Error Boundaries (root + route-level if useful)
* [x] Generic loading states

**PR:** `feat(web): auth routing + guards`

**Merge target:** `main`

---

## Milestone 5 – Register Page (Frontend)

**Branch:** `feat/web-register`

**Output:** complete register form with client validations and UX.

* [x] Form `/register` required fields:
* [x] First Name and Last Name
* [x] Email (format)
* [x] Password (policy)
* [x] Confirm password
* [x] Date of birth
* [x] Avatar (optional)


* [x] Client validation + visual errors
* [x] Async submit + loading state
* [x] User-friendly server error handling
* [x] Redirect to `/login` after success

**PR:** `feat(web): register page`

**Merge target:** `main`

---

## Milestone 6 – Login Page (Frontend)

**Branch:** `feat/web-login`

**Output:** working login with remember me and redirect.

* [x] Form `/login` (email + password)
* [x] User-friendly authentication errors
* [x] Remember me checkbox
* [x] "Forgot password" link (UI only)
* [x] Redirect to `/dashboard` after login

**PR:** `feat(web): login page`

**Merge target:** `main`

---

## Milestone 7 – Dashboard (Frontend + Backend endpoints)

**Branch:** `feat/dashboard`

**Output:** complete dashboard as per requirements.

### Backend

* [x] `PATCH /me` (data update)

### Frontend

* [x] Dashboard layout:
* [x] Header (logo + menu)
* [x] Sidebar (user info)
* [x] Center:
* [x] profile summary
* [x] data edit form
* [x] last 5 logins




* [x] Logout (invalidate session / clear tokens)
* [x] Loading + error states

**PR:** `feat: user dashboard`

**Merge target:** `main`

✅ **Tag:** `v0.1.0` (core assignment completed)

---

## Milestone 8 – UX Polish (Toast + Loading + Error Handling)

**Branch:** `feat/polish-ux`

**Output:** More solid and professional UX.

* [x] Consistent error handling (response shape)
* [x] Toast success/error (login/register/update/logout)
* [ ] Improved loading states (skeleton/spinner)
* [ ] Error boundaries with UI fallback
* [ ] Error mapping (consistent FE/BE messages)

**PR:** `feat: polish ux`

**Merge target:** `main`

---

## Bonus Points (Assignment)

**Branch:** `feat/bonus` (or dedicated branches if separated)

* [x] Unit tests on main components (minimum 2–4 meaningful tests)
* [ ] Page transition animations (if low-effort)
* [ ] "Forgot password" (full implementation) *(only if time permits)*
* [ ] Social auth (Google/GitHub) *(only if time permits)*
* [x] Dark/light theme switcher

---

## Architectural Extras (not required, but useful)

**Branch:** `feat/i18n-theme` (recommended to unify if quick)

* [≈] i18n (IT/EN) + language switch
* [x] String Manager / centralized string structure
* [x] Theme switcher (daisyUI) + preference persistence

✅ **Tag (if completed):** `v0.2.0`

---

## CI / Deploy (Optional WOW factor)

**Branch:** `ci/pipeline`

* [ ] GitHub Actions (lint + test + build)
* [ ] (Optional) demo deploy (only if truly fast and stable)

---

## Definition of Done (for each milestone)

* [ ] Feature completed and manually tested
* [x] Lint/format pass
* [x] No TypeScript errors
* [x] README/docs updated (if the milestone introduces new choices)
* [x] Descriptive PR (scope + how to test)