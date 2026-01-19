# Roadmap – Assignment FTechnology (Nx + React + Nest + Drizzle)

This roadmap is an operational checklist to complete the assignment in an incremental and verifiable way.
The goal is to deliver the **core requirements** (fully functional end-to-end) first, followed by hardening and bonuses.

---

## Working Conventions

### Git workflow (lightweight)

* Branch per macro-feature (feature complete before merging to `main`)
* PR for each macro-feature (2–6 total PRs, short description and test instructions)
* Commits using Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`)
* No `wip` commits

### Tags (milestones)

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
* [ ] Setup formatter/linter (prettier + eslint already functional)
* [ ] (Optional) husky + lint-staged + commitlint
* [x] Minimal definition of `.nvmrc`
* [x] Documentation setup enviroment (`COMMANDS.md`, `SETUP.md`)

---

## Milestone 2 – Backend Foundation (DB + Drizzle + Auth Core)

**Branch:** `feat/api-auth`

**Output:** Working API with DB, schema, and authentication (register/login), error handling, and validation.

### Database & Drizzle

* [ ] DB Choice PostgreSQL
* [ ] Setup Drizzle config
* [ ] Table schema:
* [ ] `users`
* [ ] `access_history`
* [ ] (If needed for remember me) `refresh_tokens` / `sessions`


* [ ] Migrations generated/run
* [ ] Minimal seed (optional but recommended)

### Auth API

* [ ] `POST /auth/register`
* [ ] input validation
* [ ] password hashing
* [ ] duplicate email handling


* [ ] `POST /auth/login`
* [ ] credential verification
* [ ] JWT access token
* [ ] error handling (401)


* [ ] Remember me
* [ ] defined strategy (httpOnly cookie refresh token or alternative)


* [ ] Access logging
* [ ] save login record in `access_history`


* [ ] Consistent error handling (response shape)

**PR:** `feat(api): auth + db foundation`

**Merge target:** `main`

---

## Milestone 3 – Upload Avatar (Backend)

**Branch:** `feat/api-avatar-upload`

**Output:** functional optional avatar upload, with reference persistence in the profile.

* [ ] Avatar upload endpoint (multer / file handling)
* [ ] File saving (e.g., `/uploads`)
* [ ] Update user `avatarUrl` / `avatarPath`
* [ ] Serve static files (Nest config)
* [ ] Minimal validation (mime type, size limit)

**PR:** `feat(api): avatar upload`

**Merge target:** `main`

---

## Milestone 4 – Frontend Foundation (Routing + Auth Context + Guards)

**Branch:** `feat/web-auth-routing`

**Output:** frontend structure ready, routing configured, route protection.

* [ ] Setup React app `web`
* [ ] React Router:
* [ ] `/register`
* [ ] `/login`
* [ ] `/dashboard` (private)


* [ ] Auth Context + hook `useAuth()`
* [ ] ProtectedRoute / redirect logic
* [ ] Error Boundaries (root + route-level if useful)
* [ ] Generic loading states

**PR:** `feat(web): auth routing + guards`

**Merge target:** `main`

---

## Milestone 5 – Register Page (Frontend)

**Branch:** `feat/web-register`

**Output:** complete register form with client validations and UX.

* [ ] Form `/register` required fields:
* [ ] First Name and Last Name
* [ ] Email (format)
* [ ] Password (policy)
* [ ] Confirm password
* [ ] Date of birth
* [ ] Avatar (optional)


* [ ] Client validation + visual errors
* [ ] Async submit + loading state
* [ ] User-friendly server error handling
* [ ] Redirect to `/login` after success

**PR:** `feat(web): register page`

**Merge target:** `main`

---

## Milestone 6 – Login Page (Frontend)

**Branch:** `feat/web-login`

**Output:** working login with remember me and redirect.

* [ ] Form `/login` (email + password)
* [ ] User-friendly authentication errors
* [ ] Remember me checkbox
* [ ] "Forgot password" link (UI only)
* [ ] Redirect to `/dashboard` after login

**PR:** `feat(web): login page`

**Merge target:** `main`

---

## Milestone 7 – Dashboard (Frontend + Backend endpoints)

**Branch:** `feat/dashboard`

**Output:** complete dashboard as per requirements.

### Backend (if not already present)

* [ ] `GET /me` (profile)
* [ ] `PATCH /me` (data update)
* [ ] `GET /me/access-history?limit=5`

### Frontend

* [ ] Dashboard layout:
* [ ] Header (logo + menu)
* [ ] Sidebar (user info)
* [ ] Center:
* [ ] profile summary
* [ ] data edit form
* [ ] last 5 logins




* [ ] Logout (invalidate session / clear tokens)
* [ ] Loading + error states

**PR:** `feat: user dashboard`

**Merge target:** `main`

✅ **Tag:** `v0.1.0` (core assignment completed)

---

## Milestone 8 – UX Polish (Toast + Loading + Error Handling)

**Branch:** `feat/polish-ux`

**Output:** More solid and professional UX.

* [ ] Toast success/error (login/register/update/logout)
* [ ] Improved loading states (skeleton/spinner)
* [ ] Error boundaries with UI fallback
* [ ] Error mapping (consistent FE/BE messages)

**PR:** `feat: polish ux`

**Merge target:** `main`

---

## Bonus Points (Assignment)

**Branch:** `feat/bonus` (or dedicated branches if separated)

* [ ] Unit tests on main components (minimum 2–4 meaningful tests)
* [ ] Page transition animations (if low-effort)
* [ ] "Forgot password" (full implementation) *(only if time permits)*
* [ ] Social auth (Google/GitHub) *(only if time permits)*
* [ ] Dark/light theme switcher

---

## Architectural Extras (not required, but useful)

**Branch:** `feat/i18n-theme` (recommended to unify if quick)

* [ ] i18n (IT/EN) + language switch
* [ ] String Manager / centralized string structure
* [ ] Theme switcher (daisyUI) + preference persistence

✅ **Tag (if completed):** `v0.2.0`

---

## CI / Deploy (Optional WOW factor)

**Branch:** `ci/pipeline`

* [ ] GitHub Actions (lint + test + build)
* [ ] (Optional) demo deploy (only if truly fast and stable)

---

## Definition of Done (for each milestone)

* [ ] Feature completed and manually tested
* [ ] Lint/format pass
* [ ] No TypeScript errors
* [ ] README/docs updated (if the milestone introduces new choices)
* [ ] Descriptive PR (scope + how to test)
