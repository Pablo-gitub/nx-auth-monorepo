# Project Setup (Local)

This document describes how to configure and start the project locally (backend + database).
The frontend will be documented once the dedicated Milestone is completed.

---

## Prerequisites

* Node.js (see `.nvmrc`)
* pnpm
* Docker (only if you want to use local PostgreSQL)
* A PostgreSQL database (Neon or Docker)

---

## Dependency Installation

From the repository root:

```bash
pnpm install

```

---

## Environment Configuration

Create a `.env` file in the root by copying `.env.example` and filling in the values:

```bash
cp .env.example .env

```

Main variables:

* `PORT` (default `3000`)
* `DATABASE_URL` (PostgreSQL connection string)
* `WEB_ORIGIN` (frontend origin in dev, e.g., `http://localhost:4200`)
* `JWT_SECRET` (secret to sign/verify tokens)
* `JWT_EXPIRES_IN` (e.g., `15m`)
* `JWT_REMEMBER_EXPIRES_IN` (e.g., `30d`)

> Note: the `.env` file is not versioned for security reasons.

---

## Database

You have two options:

### Option A — Local PostgreSQL via Docker (recommended for offline development)

Start the DB:

```bash
docker compose up -d

```

Set `DATABASE_URL` in your `.env` pointing to the local container.

### Option B — Neon (Cloud PostgreSQL)

Create a database on Neon and copy the connection string into `DATABASE_URL`.

---

## Migrations (Drizzle)

Generate the migration (if you modified the schema):

```bash
pnpm db:generate

```

Apply the migrations:

```bash
pnpm db:migrate

```

Open Drizzle Studio to inspect data:

```bash
pnpm db:studio

```

---

## Start Backend (NestJS)

Start the API in development mode:

```bash
pnpm nx serve api --watch

```

The API will be available at:

* `http://localhost:3000/api`

---

## Quick Smoke Test (API)

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

### 2) Login (copy `accessToken` from response)

```bash
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"paolo@example.com",
    "password":"Password1",
    "rememberMe": false
  }'

```

### 3) GET /me (protected)

```bash
curl -s http://localhost:3000/api/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"

```

### 4) Access history (recent logins)

```bash
curl -s "http://localhost:3000/api/me/access-history?limit=5" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"

```

---

## Quality Gate

Before a PR or merge:

```bash
pnpm nx lint api
pnpm nx test api
pnpm nx format:check

```

## Upload Avatar (Local)

To test avatar upload:

1. Start the API:
```bash
pnpm nx serve api

```


2. Login and copy the `accessToken`
3. Use Postman:
* Method: POST
* URL: `http://localhost:3000/api/me/avatar`
* Header:
```
Authorization: Bearer <ACCESS_TOKEN>

```


* Body → form-data:
* key: `file`
* type: File
* value: `.jpg` / `.png` image




4. The image will be accessible at:
```
http://localhost:3000/uploads/avatars/<filename>

```



