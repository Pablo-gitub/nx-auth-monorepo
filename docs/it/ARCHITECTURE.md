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

## Stato attuale (Milestone 2)

### Moduli implementati

- `DatabaseModule`
  Espone un provider DI (`DB`) che fornisce il client Drizzle condiviso (`libs/api/db`).

- `AuthModule`
  Contiene:
  - `AuthController` (`POST /auth/register`, `POST /auth/login`)
  - `MeController` (`GET /me`, `GET /me/access-history?limit=5`)
  - `AuthService` (logica di registrazione, login, access history)
  - `JwtAuthGuard` (protezione route con header `Authorization: Bearer <token>`)

### Flusso autenticazione (implementato)

- **Register**
  - Validazione input via Zod (`libs/shared/contracts`)
  - Hashing password con bcrypt
  - Insert su tabella `users`
  - Gestione email duplicate con `409 Conflict`

- **Login**
  - Lookup utente per email
  - Verifica password con `bcrypt.compare`
  - Errori normalizzati con `401 Unauthorized` per prevenire user enumeration
  - Generazione JWT access token (expiry breve o lunga con `rememberMe`)
  - Scrittura access log in tabella `access_logs`

### Route protette (implementato)

- `GET /me` → restituisce il profilo dell’utente autenticato
- `GET /me/access-history?limit=5` → restituisce gli ultimi accessi (default 5)

### Error handling (stato attuale)

Attualmente l’API usa:
- Eccezioni NestJS standard (`BadRequest`, `Unauthorized`, `Conflict`)
- Error shape custom per Zod (`{ message, errors }`)

La normalizzazione completa delle risposte (es. tramite global filter/interceptor) è pianificata come UX polish.

---

## Database (PostgreSQL – Neon)
### Tabelle (stato attuale)
- `users`
- `access_logs`

### Tabelle future (opzionali)
- `sessions` / `refresh_tokens` (per remember me)

> Nota: `sessions` / `refresh_tokens` è opzionale e verrà valutato solo se si decide di implementare un refresh token

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

## Validazione dei dati (API)

Per la validazione degli input dell’API è stato scelto **Zod** al posto di `class-validator`.

Questa scelta è motivata dalla sua **migliore integrazione con l’architettura Nx monorepo** adottata nell’assignment, che favorisce la condivisione di codice e contratti tra frontend e backend.

### Motivazioni della scelta

- **Single source of truth**  
  Gli schemi di validazione sono definiti una sola volta e condivisi tra frontend e backend tramite la libreria `libs/shared/contracts`.

- **Type inference nativa**  
  Zod permette di derivare automaticamente i tipi TypeScript dagli schemi (`z.infer`), evitando duplicazioni e possibili inconsistenze tra DTO e validazione runtime.

- **Validazione runtime esplicita**  
  La validazione è dichiarativa e immediata, senza dipendere da decorator, reflection o classi dedicate.

- **Maggiore controllo sugli errori**  
  Gli errori generati da Zod sono facilmente normalizzabili e mappabili verso risposte API coerenti e user-friendly.

La validazione viene applicata tramite una `ZodValidationPipe` custom integrata nei controller NestJS.

Nel contesto di un **monorepo Nx**, questa soluzione consente di mantenere contratti fortemente tipizzati, riutilizzabili e coerenti tra le diverse applicazioni, riducendo il rischio di drift tra frontend e backend.


## Autenticazione (JWT)

L’autenticazione è basata su **JSON Web Token (JWT)**, come richiesto dall’assignment.

- Il token viene generato al login
- Include informazioni minime sull’utente (id, email)
- La durata del token è configurabile tramite variabili d’ambiente
- È previsto il supporto a una durata estesa tramite l’opzione "remember me"

La configurazione del modulo JWT avviene in modo asincrono, leggendo le variabili d’ambiente tramite `ConfigModule`.

### Error handling in autenticazione

Per motivi di sicurezza, gli errori di autenticazione vengono normalizzati.
L’API non distingue tra “utente inesistente” e “password errata” per evitare attacchi
di *user enumeration* (un attaccante potrebbe verificare quali email sono registrate).


## Frontend – Scelta architetturale: Auth logic vs Auth UI

Per mantenere separazione delle responsabilità e favorire riuso/modularità nel monorepo Nx,
l'autenticazione lato frontend è stata divisa in due librerie:

- `libs/web/auth`
  Contiene la logica di autenticazione:
  - gestione token (storage)
  - chiamate API (`/auth/login`, `/me`)
  - stato globale e hook (`AuthProvider`, `useAuth`)
  - protezione route (ProtectedRoute / redirect logic)

- `libs/web/auth-ui`
  Contiene componenti UI riusabili e "presentational":
  - form base di login/register
  - layout/shell
  - componenti senza dipendenze dirette dall'API

Questa scelta permette di:
- sostituire o evolvere l'interfaccia grafica senza impattare la logica auth
- riusare la logica auth in altre app del monorepo (es. admin dashboard) con UI diverse
- mantenere test più mirati (logica vs rendering)

Nota: l'assignment richiede una sola app web, quindi il design resta volutamente "light":
le estensioni/adapter specifici dell'app possono essere introdotti solo se/quando diventano necessari (YAGNI).
