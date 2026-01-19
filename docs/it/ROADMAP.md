# Roadmap – Assignment FTechnology (Nx + React + Nest + Drizzle)

Questa roadmap è una checklist operativa per completare l’assignment in modo incrementale e verificabile.
L’obiettivo è consegnare prima i **requisiti core** (funzionanti end-to-end), poi hardening e bonus.

---

## Convenzioni di lavoro

### Git workflow (lightweight)

- Branch per macro-feature (feature complete prima del merge su `main`)
- PR per ogni macro-feature (2–6 PR totali, descrizione breve e test instructions)
- Commit con Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`)
- No `wip` commits

### Tag (milestone)

- `v0.1.0` → Assignment core completato (tutti i requisiti richiesti)
- `v0.2.0` → Bonus + Extra completati (se applicabile)

---

## Milestone 0 – Repo & Documentazione (baseline)

**Output:** workspace Nx inizializzato e documentazione iniziale pronta.

- [x] README.md (IT) + README.en.md (EN structure)
- [x] `docs/it/COMMANDS.md` (comandi + motivazioni)
- [x] `docs/it/ROADMAP.md` (questa checklist)
- [x] Predisposizione struttura `docs/en/` (placeholder)

---

## Milestone 1 – Workspace Setup + Quality Baseline

**Output:** baseline di qualità stabile (format/lint/test), repo pronto a scalare.

- [x] Verifica comandi Nx base (`nx graph`, `nx lint`, `nx format`)
- [x] Setup formatter/linter (prettier + eslint già funzionanti)
- [ ] (Opzionale) husky + lint-staged + commitlint
- [x] Definizione minima di `.nvmrc`
- [x] Documentazione setup ambiente (`COMMANDS.md`, `SETUP.md`)

---

## Milestone 2 – Backend Foundation (DB + Drizzle + Auth Core)

**Branch:** `feat/api-auth`  
**Output:** API funzionante con DB, schema e autenticazione (register/login), gestione errori e validazione.

### Database & Drizzle

- [x] Scelta DB PostgreSQL
- [x] Setup Drizzle config
- [x] Schema tabelle:
  - [x] `users`
  - [x] `access_logs`
  - [ ] (Se serve per remember me) `refresh_tokens` / `sessions`
- [x] Migration generate/run
- [ ] Seed minimo (opzionale ma consigliato)

### Auth API

- [ ] `POST /auth/register`
  - [ ] validazione input
  - [ ] hashing password
  - [ ] gestione email duplicate
- [ ] `POST /auth/login`
  - [ ] verifica credenziali
  - [ ] JWT access token
  - [ ] gestione errori (401)
- [ ] Remember me
  - [ ] strategia definita (cookie httpOnly refresh token o alternativa)
- [ ] Logging accessi
  - [ ] salva record login in `access_history`
- [ ] Error handling consistente (shape risposta)

**PR:** `feat(api): auth + db foundation`  
**Merge target:** `main`

---

## Milestone 3 – Upload Avatar (Backend)

**Branch:** `feat/api-avatar-upload`  
**Output:** upload avatar opzionale funzionante, con persistenza del riferimento nel profilo.

- [ ] Endpoint upload avatar (multer / file handling)
- [ ] Salvataggio file (es. `/uploads`)
- [ ] Aggiornamento user `avatarUrl` / `avatarPath`
- [ ] Servire file statici (config Nest)
- [ ] Validazioni minime (mime type, size limit)

**PR:** `feat(api): avatar upload`  
**Merge target:** `main`

---

## Milestone 4 – Frontend Foundation (Routing + Auth Context + Guards)

**Branch:** `feat/web-auth-routing`  
**Output:** struttura frontend pronta, routing configurato, protezione route.

- [ ] Setup React app `web`
- [ ] React Router:
  - [ ] `/register`
  - [ ] `/login`
  - [ ] `/dashboard` (private)
- [ ] Auth Context + hook `useAuth()`
- [ ] ProtectedRoute / redirect logic
- [ ] Error Boundaries (root + route-level se utile)
- [ ] Loading states generici

**PR:** `feat(web): auth routing + guards`  
**Merge target:** `main`

---

## Milestone 5 – Register Page (Frontend)

**Branch:** `feat/web-register`  
**Output:** form register completo con validazioni client e UX.

- [ ] Form `/register` campi richiesti:
  - [ ] Nome e Cognome
  - [ ] Email (format)
  - [ ] Password (policy)
  - [ ] Conferma password
  - [ ] Data di nascita
  - [ ] Avatar (opzionale)
- [ ] Validazione client + errori visuali
- [ ] Submit async + loading state
- [ ] Gestione errori server user-friendly
- [ ] Redirect a `/login` dopo successo

**PR:** `feat(web): register page`  
**Merge target:** `main`

---

## Milestone 6 – Login Page (Frontend)

**Branch:** `feat/web-login`  
**Output:** login funzionante con remember me e redirect.

- [ ] Form `/login` (email + password)
- [ ] Errori autenticazione user-friendly
- [ ] Remember me checkbox
- [ ] Link “password dimenticata” (solo UI)
- [ ] Redirect a `/dashboard` dopo login

**PR:** `feat(web): login page`  
**Merge target:** `main`

---

## Milestone 7 – Dashboard (Frontend + Backend endpoints)

**Branch:** `feat/dashboard`  
**Output:** dashboard completa come da requisiti.

### Backend (se non già presenti)

- [ ] `GET /me` (profilo)
- [ ] `PATCH /me` (update dati)
- [ ] `GET /me/access-history?limit=5`

### Frontend

- [ ] Layout dashboard:
  - [ ] Header (logo + menu)
  - [ ] Sidebar (info utente)
  - [ ] Centro:
    - [ ] riepilogo profilo
    - [ ] form modifica dati
    - [ ] ultimi 5 accessi
- [ ] Logout (invalidate session / clear tokens)
- [ ] Loading + error states

**PR:** `feat: user dashboard`  
**Merge target:** `main`

✅ **Tag:** `v0.1.0` (assignment core completato)

---

## Milestone 8 – UX Polish (Toast + Loading + Error Handling)

**Branch:** `feat/polish-ux`  
**Output:** UX più solida e professionale.

- [ ] Toast success/error (login/register/update/logout)
- [ ] Loading states migliorati (skeleton/spinner)
- [ ] Error boundaries con fallback UI
- [ ] Error mapping (messaggi coerenti FE/BE)

**PR:** `feat: polish ux`  
**Merge target:** `main`

---

## Bonus Points (Assignment)

**Branch:** `feat/bonus` (o branch dedicati se separati)

- [ ] Test unitari componenti principali (minimo 2–4 test sensati)
- [ ] Animazioni transizioni tra pagine (se low-effort)
- [ ] “Password dimenticata” (implementazione completa) _(solo se tempo)_
- [ ] Social auth (Google/GitHub) _(solo se tempo)_
- [ ] Theme switcher dark/light

---

## Extra Architetturali (non richiesti, ma utili)

**Branch:** `feat/i18n-theme` (consigliato unificare i due se rapidi)

- [ ] i18n (IT/EN) + language switch
- [ ] String Manager / struttura centralizzata delle stringhe
- [ ] Theme switcher (daisyUI) + persistenza preferenza

✅ **Tag (se completato):** `v0.2.0`

---

## CI / Deploy (WOW opzionale)

**Branch:** `ci/pipeline`

- [ ] GitHub Actions (lint + test + build)
- [ ] (Opzionale) deploy demo (solo se davvero veloce e stabile)

---

## Definition of Done (per ogni milestone)

- [ ] Feature completata e testata manualmente
- [ ] Lint/format pass
- [ ] Nessun errore TypeScript
- [ ] README/docs aggiornati (se la milestone introduce nuove scelte)
- [ ] PR descrittiva (scope + how to test)
