# Assignment FTechnology – Nx Full Stack Authentication App

[`README.md`](README.md) Go to Italian version.

## Project Description

This repository contains the implementation of a full stack web application developed as a **technical assessment**, using **Nx (monorepo)**, **React**, **NestJS**, and **Drizzle ORM**.

The goal of the project is to build a **complete authentication system**, including:

* User registration
* Login
* Personal dashboard
* Profile management and editing
* Access history (Login logs)

The project is structured as an **Nx monorepo**, with a clear separation between frontend, backend, and shared libraries, following architecture and code organization best practices.

---

## Tech Stack

* **Nx** – Monorepo and workspace management
* **React** – Web Frontend
* **NestJS** – Backend API
* **TypeScript** – Mandatory static typing
* **Drizzle ORM** – Data access and database management
* **Database** – PostgreSQL / MariaDB / MongoDB (configurable)
* **JWT** – Authentication and session management
* **pnpm** – Package manager
* **shadcn/ui** – UI Components
* **daisyUI** – Theme management (light/dark)

---

## Functional Requirements

### 1. User Registration (`/register`)

Registration page with a form containing the following fields:

* First Name and Last Name
* Email (with format validation)
* Password
* Minimum 8 characters
* At least one uppercase letter
* At least one number


* Confirm Password
* Date of birth
* Avatar (optional image upload)

Required functionality:

* Client-side validation for all fields
* Visual feedback for validation errors
* Loading state management
* Redirect to the login page upon successful registration

---

### 2. Login (`/login`)

Login page with:

* Email
* Password

Required functionality:

* Authentication error management
* "Remember me" implementation
* Password recovery link (UI only)
* Automatic redirect to the dashboard after login

---

### 3. User Dashboard (`/dashboard`)

Page accessible only to authenticated users.

Contents:

* Header with logo and navigation menu
* Sidebar with main user information
* Central section with:
* Profile data summary
* Personal data editing form
* History of the last 5 logins


* Logout functionality

---

## Technical Requirements

### Frontend

#### Project Structure

* Modular and reusable components
* Clear organization of files and folders
* Use of custom hooks for application logic

#### State Management

* Appropriate use of React hooks (`useState`, `useEffect`, `useContext`)
* Dedicated Context for authentication management

#### Routing

* Route configuration with React Router
* Protection of private routes
* Correct handling of redirects

#### UI / UX

* Responsive design
* Visual feedback for user actions
* Loading states for asynchronous operations
* User-friendly error handling
* Usage of **shadcn/ui** components

---

### Backend (API)

#### Authentication

* API for registration and login
* Use of JWT for session management
* Secure password hashing

#### Data Management

* Input data validation
* User profile CRUD
* Structured error handling

#### Storage

* Use of a database (MariaDB, PostgreSQL, or MongoDB)
* Avatar upload management
* Implementation of database migrations and seeds

---

## Bonus Points (Assignment)

* Unit tests on main components
* Animations for page transitions
* Implementation of "Forgot Password" functionality
* Social authentication (Google or GitHub)
* Dark / Light Theme switcher

---

## Bonus Extra (Architectural Extensions)

In addition to the bonuses required by the assignment, the project includes some optional extensions focused on **architectural quality**:

* **Internationalization System (i18n)**
Centralized string management via translation files, avoiding hard-coded text in the interface and enabling multi-language support.
* **String Manager**
Dedicated structure for organizing application strings, improving maintainability, readability, and code consistency.
* **Theme Management (light / dark)**
Implemented via daisyUI, with user preference persistence.

These extensions are not strictly required but aim to demonstrate attention to architecture, scalability, and code quality.

---

## Installation and Startup

```bash
pnpm install
pnpm nx serve web
pnpm nx serve api

```

---

## Documentation

The project documentation is organized in the `docs/` folder:

* [`docs/en/ROADMAP.md`](https://www.google.com/search?q=docs/en/ROADMAP.md)
Development roadmap and assignment requirements checklist.
* [`docs/en/COMMANDS.md`](https://www.google.com/search?q=docs/en/COMMANDS.md)
List of main commands used during development and reasoning behind technical choices.
* [`docs/en/ARCHITECTURE.md`](https://www.google.com/search?q=docs/en/ARCHITECTURE.md)
Description of the Nx monorepo architecture, apps, and shared libraries.

The structure is also prepared for an Italian version (`docs/it/`).

---

## Project Status

Development follows an incremental roadmap:

* Completion of core requirements
* Authentication hardening
* Implementation of bonuses
* Potential architectural extensions

---

### Final Note

This project is designed as a **technical exercise**, but structured following practices applicable to real-world software development contexts.

