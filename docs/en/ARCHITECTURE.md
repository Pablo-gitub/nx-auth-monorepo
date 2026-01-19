# Architecture – Nx Full Stack Auth App

## Objectives

* Nx Monorepo with clear separation between frontend (React) and backend (NestJS)
* Reuse via shared libraries (types/contracts, ui, server modules)
* End-to-end TypeScript typing
* Incremental evolution driven by the roadmap

---

## Nx Structure (high-level)

### Apps

* `apps/web`
React Frontend (React Router, shadcn/ui, daisyUI)
* `apps/api`
NestJS Backend (Auth, Users, Upload, Drizzle)

### Libs (planned)

* `libs/shared/contracts`
Shared DTOs/types
* `libs/shared/utils`
Common utilities (e.g., formatting, helpers)
* `libs/web/ui`
Reusable UI components (layout, form fields, etc.)
* `libs/web/auth`
Auth context, hooks, API client wrapper
* `libs/api/db`
Drizzle config, schema, migrations
* `libs/api/auth`
JWT, guards, strategies, session handling
* `libs/api/users`
Profile CRUD and access history
* `libs/api/files`
Avatar upload and static serving

> Note: libs will be created only when necessary (YAGNI).

---

## Backend (NestJS)

### Main Modules (planned)

* AuthModule
* UsersModule
* FilesModule
* Common (filters/interceptors/guards)

### Cross-cutting concerns

* CORS
* Global ValidationPipe
* Consistent error handling (HTTP exceptions / filter)
* Logging (Nest Logger / interceptor)
* Rate limiting (optional)

---

## Database (PostgreSQL – Neon)

### Tables (planned)

* `users`
* `access_history`
* `sessions` / `refresh_tokens` (for remember me)

### Migrations & Seed

* Drizzle migrations executed on cloud DB
* Minimal seed (optional)

---

## Frontend (React)

* Routing: `/register`, `/login`, `/dashboard` (private)
* Auth context + protected routes
* Error boundaries + loading states
* Toast notifications (UX polish)

---

## Authentication (overview)

* Register → creates user, password hashing, optional avatar
* Login → JWT access token, remember me (session/refresh)
* Dashboard → protected endpoints + logout

---

## Key Decisions

* Package manager: pnpm
* DB provider: Neon (managed PostgreSQL)
* UI: shadcn/ui + daisyUI (theme)
* i18n + string manager: architectural extra (optional)
