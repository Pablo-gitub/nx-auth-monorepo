# Nx Full Stack Authentication – Monorepo Starter

![Nx](https://img.shields.io/badge/Nx-monorepo-143055)
![TypeScript](https://img.shields.io/badge/TypeScript-strongly%20typed-blue)
![NestJS](https://img.shields.io/badge/NestJS-backend-red)
![React](https://img.shields.io/badge/React-frontend-61DAFB)
![License](https://img.shields.io/badge/license-MIT-green)

## 📌 Descrizione

Questo progetto rappresenta un **sistema di autenticazione full stack** sviluppato con **Nx monorepo**, progettato con un approccio orientato all’architettura enterprise.

L’obiettivo non è solo implementare login e registrazione, ma costruire una **base scalabile, riutilizzabile e ben strutturata** per applicazioni reali.

Il progetto dimostra:

- organizzazione modulare in monorepo
- separazione chiara tra frontend, backend e librerie condivise
- tipizzazione completa TypeScript
- gestione database con Drizzle ORM
- autenticazione JWT
- documentazione tecnica strutturata

---

## 🏗 Architettura

Il progetto è organizzato come **Nx monorepo** con separazione in:

- `apps/web` → Frontend React
- `apps/api` → Backend NestJS
- `libs/api/db` → Schema e configurazione database (Drizzle)
- `libs/shared/contracts` → Contratti condivisi tra frontend e backend
- `libs/web/auth` → Logica di autenticazione lato frontend
- `libs/web/auth-ui` → Componenti UI riutilizzabili

Principi adottati:

- Modularità
- Separazione delle responsabilità
- Condivisione tipizzata tra frontend e backend
- Scalabilità futura

---

## ⚙️ Stack Tecnologico

- **Nx** – Monorepo orchestration
- **React** – Frontend
- **NestJS** – Backend API
- **TypeScript** – Strong typing
- **Drizzle ORM** – Database access layer
- **PostgreSQL** – Database
- **JWT** – Authentication
- **pnpm** – Package manager
- **shadcn/ui + daisyUI** – UI system

---

## 🚀 Funzionalità Implementate

### Autenticazione

- Registrazione utente con validazione completa
- Login con JWT
- Remember me
- Protezione delle route
- Logout
- Recupero password (UI)

### Dashboard

- Accesso riservato ad utenti autenticati
- Modifica dati profilo
- Cronologia ultimi accessi
- Upload avatar

### Backend

- Validazione robusta dei dati
- Hashing password sicuro
- Middleware di autenticazione JWT
- Schema database con migrazioni Drizzle

---

## 🔐 Hardening e Miglioramenti Futuri

- Protezione brute-force
- Sanitizzazione metadata immagini (GDPR)
- Incremento coverage test backend
- Social login (Google / GitHub)
- Password recovery completa

---

## 🛠 Installazione

```bash
pnpm install
pnpm nx serve web
pnpm nx serve api
````

---

## Documentazione

La documentazione di progetto è organizzata in modo modulare nella cartella `docs/`:

- [`docs/it/SETUP.md`](docs/it/SETUP.md)  
  Guida alla configurazione dell’ambiente e avvio del progetto (locale e Docker).

- [`docs/it/ROADMAP.md`](docs/it/ROADMAP.md)  
  Checklist operativa dello sviluppo, milestone e stato di avanzamento.

- [`docs/it/ARCHITECTURE.md`](docs/it/ARCHITECTURE.md)  
  Panoramica dell’architettura Nx, organizzazione delle librerie e scelte di design.

- [`docs/it/DATABASE.md`](docs/it/DATABASE.md)  
  Dettagli su PostgreSQL (Neon), schema Drizzle ORM e gestione migrazioni.

- [`docs/it/COMMANDS.md`](docs/it/COMMANDS.md)  
  Log delle decisioni tecniche e comandi principali eseguiti durante lo sviluppo.

- [`docs/it/TESTING.md`](docs/it/TESTING.md)  
  Strategia di testing, coverage attuale e filosofia adottata.

- [`docs/it/CLOUD_UPLOAD.md`](docs/it/CLOUD_UPLOAD.md)  
  Approccio all’upload dei file (locale vs cloud) e strategia di migrazione.

La struttura è interamente disponibile anche in lingua inglese (`docs/en/`).

---

## 🎯 Obiettivo del Progetto

Questo repository è pensato come:

* dimostrazione di architettura Nx full stack
* base riutilizzabile per sistemi autenticazione
* starter enterprise per applicazioni scalabili
