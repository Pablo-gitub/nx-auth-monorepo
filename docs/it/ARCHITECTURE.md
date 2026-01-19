# Architettura – Nx Full Stack Auth App

## Obiettivi
- Monorepo Nx con separazione chiara tra frontend (React) e backend (NestJS)
- Riuso tramite librerie condivise (types/contracts, ui, server modules)
- Tipizzazione TypeScript end-to-end
- Evoluzione incrementale guidata dalla roadmap

---

## Struttura Nx (high-level)

### Apps
- `apps/web`  
  Frontend React (React Router, shadcn/ui, daisyUI)
- `apps/api`  
  Backend NestJS (Auth, Users, Upload, Drizzle)

### Libs (planned)
- `libs/shared/contracts`  
  DTO/types condivisi 
- `libs/shared/utils`  
  Utility comuni (es. formatting, helpers)
- `libs/web/ui`  
  Componenti UI riusabili (layout, form fields, ecc.)
- `libs/web/auth`  
  Auth context, hooks, API client wrapper
- `libs/api/db`  
  Drizzle config, schema, migrations
- `libs/api/auth`  
  JWT, guards, strategies, session handling
- `libs/api/users`  
  CRUD profilo e access history
- `libs/api/files`  
  Avatar upload e static serving

> Nota: le libs verranno create solo quando necessarie (YAGNI).

---

## Backend (NestJS)

### Moduli principali (planned)
- AuthModule
- UsersModule
- FilesModule
- Common (filters/interceptors/guards)

### Cross-cutting concerns
- CORS
- Global ValidationPipe
- Error handling consistente (HTTP exceptions / filter)
- Logging (Nest Logger / interceptor)
- Rate limiting (opzionale)

---

## Database (PostgreSQL – Neon)
### Tabelle (planned)
- `users`
- `access_history`
- `sessions` / `refresh_tokens` (per remember me)

### Migrations & Seed
- Drizzle migrations eseguite su DB cloud
- Seed minimo (opzionale)

---

## Frontend (React)
- Routing: `/register`, `/login`, `/dashboard` (private)
- Auth context + protected routes
- Error boundaries + loading states
- Toast notifications (UX polish)

---

## Autenticazione (overview)
- Register → crea utente, hashing password, avatar opzionale
- Login → JWT access token, remember me (session/refresh)
- Dashboard → endpoints protetti + logout

---

## Decisioni chiave
- Package manager: pnpm
- DB provider: Neon (PostgreSQL managed)
- UI: shadcn/ui + daisyUI (theme)
- i18n + string manager: extra architetturale (opzionale)


## Workspace baseline (Nx + TypeScript)

- `nx.json` include `workspaceLayout` per standardizzare la struttura `apps/` e `libs/`.
- `tsconfig.base.json` è la configurazione TypeScript condivisa a livello workspace: i singoli progetti (`apps/*`, `libs/*`) estendono questa base.