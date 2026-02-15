# Nx Full Stack Authentication – Monorepo Starter

![Nx](https://img.shields.io/badge/Nx-monorepo-143055)
![TypeScript](https://img.shields.io/badge/TypeScript-strongly%20typed-blue)
![NestJS](https://img.shields.io/badge/NestJS-backend-red)
![React](https://img.shields.io/badge/React-frontend-61DAFB)
![License](https://img.shields.io/badge/license-MIT-green)

## 📌 Overview

This project is a **full-stack authentication system** built using an **Nx monorepo architecture**, designed with enterprise-grade structure and scalability in mind.

The goal is not just to implement login and registration, but to provide a **clean, modular and reusable architecture** for real-world applications.

It demonstrates:

- Proper monorepo organization
- Clear frontend/backend separation
- Shared type-safe contracts
- Database schema management with Drizzle ORM
- JWT-based authentication
- Structured technical documentation

---

## 🏗 Architecture

Organized as an Nx monorepo:

- `apps/web` → React frontend
- `apps/api` → NestJS backend
- `libs/api/db` → Database schema and configuration (Drizzle)
- `libs/shared/contracts` → Shared contracts between frontend and backend
- `libs/web/auth` → Authentication logic
- `libs/web/auth-ui` → Reusable UI components

Design principles:

- Modularity
- Separation of concerns
- Shared typed contracts
- Future scalability

---

## ⚙️ Tech Stack

- **Nx** – Monorepo orchestration
- **React** – Frontend
- **NestJS** – Backend
- **TypeScript** – Static typing
- **Drizzle ORM** – Database access
- **PostgreSQL** – Database
- **JWT** – Authentication
- **pnpm** – Package manager
- **shadcn/ui + daisyUI** – UI system

---

## 🚀 Implemented Features

### Authentication

- User registration with validation
- JWT-based login
- Remember me
- Protected routes
- Logout
- Password recovery (UI)

### Dashboard

- Authenticated user area
- Profile editing
- Access logs (last 5 logins)
- Avatar upload

### Backend

- Input validation
- Secure password hashing
- JWT middleware
- Database migrations with Drizzle

---

## 🔐 Security & Future Improvements

- Brute-force protection
- Image metadata stripping (GDPR compliance)
- Extended backend test coverage
- Social authentication
- Full password recovery flow

---

## 🛠 Installation

```bash
pnpm install
pnpm nx serve web
pnpm nx serve api
````

---

## Documentation

The project documentation is organized modularly in the `docs/` folder:

- [`docs/en/SETUP.md`](docs/en/SETUP.md)  
  Guide to environment configuration and project startup (local and Docker).

- [`docs/en/ROADMAP.md`](docs/en/ROADMAP.md)  
  Operational development checklist, milestones, and progress status.

- [`docs/en/ARCHITECTURE.md`](docs/en/ARCHITECTURE.md)  
  Overview of Nx architecture, library organization, and design choices.

- [`docs/en/DATABASE.md`](docs/en/DATABASE.md)  
  Details on PostgreSQL (Neon), Drizzle ORM schema, and migration management.

- [`docs/en/COMMANDS.md`](docs/en/COMMANDS.md)  
  Log of technical decisions and main commands executed during development.

- [`docs/en/TESTING.md`](docs/en/TESTING.md)  
  Testing strategy, current coverage, and adopted philosophy.

- [`docs/en/CLOUD_UPLOAD.md`](docs/en/CLOUD_UPLOAD.md)  
  File upload approach (local vs cloud) and migration strategy.

The structure is fully available in Italian as well (`docs/it/`).

---

## 🎯 Project Purpose

This repository serves as:

* Nx full-stack architecture showcase
* Authentication starter template
* Enterprise-ready structural example
