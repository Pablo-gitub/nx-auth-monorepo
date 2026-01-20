
# Setup del progetto (locale)

Questo documento descrive come configurare e avviare il progetto in locale (backend + database).
Il frontend verrà documentato quando verrà completata la Milestone dedicata.

---

## Prerequisiti

- Node.js (vedi `.nvmrc`)
- pnpm
- Docker (solo se vuoi usare PostgreSQL locale)
- Un database PostgreSQL (Neon o Docker)

---

## Installazione dipendenze

Dalla root del repository:

```bash
pnpm install
````

---

## Configurazione environment

Crea un file `.env` nella root copiando `.env.example` e compilando i valori:

```bash
cp .env.example .env
```

Variabili principali:

* `PORT` (default `3000`)
* `DATABASE_URL` (PostgreSQL connection string)
* `WEB_ORIGIN` (origin del frontend in dev, es. `http://localhost:4200`)
* `JWT_SECRET` (segreto per firmare/verificare i token)
* `JWT_EXPIRES_IN` (es. `15m`)
* `JWT_REMEMBER_EXPIRES_IN` (es. `30d`)

> Nota: il file `.env` non è versionato per motivi di sicurezza.

---

## Database

Hai due opzioni:

### Opzione A — PostgreSQL locale via Docker (consigliato per sviluppo offline)

Avvia il DB:

```bash
docker compose up -d
```

Imposta `DATABASE_URL` nel tuo `.env` puntando al container locale.

### Opzione B — Neon (PostgreSQL cloud)

Crea un database su Neon e copia la connection string in `DATABASE_URL`.

---

## Migrations (Drizzle)

Genera la migration (se hai modificato lo schema):

```bash
pnpm db:generate
```

Applica le migrations:

```bash
pnpm db:migrate
```

Apri Drizzle Studio per ispezionare i dati:

```bash
pnpm db:studio
```

---

## Avvio Backend (NestJS)

Avvia l’API in modalità sviluppo:

```bash
pnpm nx serve api --watch
```

L’API sarà disponibile su:

* `http://localhost:3000/api`

---

## Smoke test rapido (API)

### 1) Register

```bash
curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"Paolo",
    "lastName":"Pietrelli",
    "email":"paolo@example.com",
    "password":"Password1",
    "confirmPassword":"Password1",
    "birthDate":"1997-01-01"
  }'
```

### 2) Login (copia `accessToken` dalla risposta)

```bash
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"paolo@example.com",
    "password":"Password1",
    "rememberMe": false
  }'
```

### 3) GET /me (protetto)

```bash
curl -s http://localhost:3000/api/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### 4) Access history (ultimi accessi)

```bash
curl -s "http://localhost:3000/api/me/access-history?limit=5" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

---

## Quality gate

Prima di una PR o merge:

```bash
pnpm nx lint api
pnpm nx test api
pnpm nx format:check
```
