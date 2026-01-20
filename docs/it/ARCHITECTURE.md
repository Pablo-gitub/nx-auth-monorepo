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

### Authentication error handling

For security reasons, authentication errors are intentionally normalized.
The API does not distinguish between non-existing users and wrong passwords
in order to prevent user enumeration attacks.
