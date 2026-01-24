# Commands and Technical Choices

This document describes the main commands used during the project's development
and the technical reasoning behind the choices made.

The goal is not to provide a step-by-step tutorial, but to make explicit the decisions
that influence the project's architecture, maintainability, and evolution.

---

## Nx Workspace Initialization

```bash
pnpm dlx create-nx-workspace@latest assignment-ftechnology \
  --preset=apps \
  --pm=pnpm \
  --nxCloud=skip

```

### Command Description

This command is used to initialize a new **Nx** workspace within
a dedicated folder, configuring the project as a **monorepo**.

---

### Parameter Explanation

#### `pnpm dlx`

`dlx` is the **pnpm** equivalent of `npx`.

It allows you to:

* execute Node packages without installing them globally
* ensure the use of a clean and isolated version of the tool
* avoid uncontrolled global dependencies

This mode is particularly suitable for bootstrap and scaffolding commands.

---

#### `create-nx-workspace@latest`

Runs the official Nx generator to create a new workspace.

Using the `@latest` tag indicates the latest **stable version** available at the time
of execution, ensuring:

* access to the most up-to-date features
* alignment with best practices recommended by the Nx framework

---

#### `assignment-ftechnology`

Name of the workspace and the main project directory.

A descriptive name consistent with the assignment context was chosen to:

* make the project immediately recognizable
* keep the repository name and Nx workspace name aligned

---

#### `--preset=apps`

The `preset` parameter defines the initial workspace type.

The `apps` option creates a **neutral** workspace without automatically generating
applications or libraries, leaving full control over the initial structure.

This choice allows to:

* manually create applications (`web`, `api`) only when necessary
* avoid unused generated code
* keep the monorepo clean and intentional

Other available presets include:

* `react-monorepo`
* `nest`
* `next`
* `angular`
* `node-monorepo`

In this project, a generic preset was preferred to model
the architecture explicitly and progressively.

---

#### `--pm=pnpm`

Specifies the **package manager** to use in the workspace.

`pnpm` was chosen for the following reasons:

* better dependency management in monorepo contexts
* faster installations
* lower disk space usage thanks to the global store
* native support recommended by Nx

---

#### `--nxCloud=skip`

Disables **Nx Cloud** configuration.

For this assignment:

* a distributed CI pipeline is not required
* remote caching is not necessary
* reducing non-essential external dependencies is preferred

This choice keeps the project simpler and focused on the required aspects.

---

## Considerations

This command represents the starting point of the project and defines the architectural
foundations upon which the frontend applications, backend applications,
and shared libraries will be built.

All choices made in this phase aim to:

* keep the project scalable
* avoid premature configurations
* favor clarity and maintainability

---

## Local Development Environment (PostgreSQL via Docker)

```bash
docker compose up -d

```

### Description

This command starts a local instance of **PostgreSQL** via Docker,
using the `docker-compose.yml` file located in the project root.

The goal is to provide a **completely offline** development environment,
without dependencies on external cloud services.

---

### Why Docker Compose

Using Docker Compose allows to:

* start the database with a single command
* avoid manual PostgreSQL installations
* ensure a consistent environment across different developers or reviewers
* allow the assignment reviewer to run the project locally without additional configurations

---

### Relationship with Cloud Database (Neon)

The project is configured to work with both:

* **Cloud PostgreSQL (Neon)** – for demo and remote development
* **Local PostgreSQL (Docker)** – for offline development and technical review

Switching between the two environments is done simply by modifying the `DATABASE_URL`
variable in the `.env` file.

This choice ensures maximum flexibility without introducing complexity
into the application architecture.

---

## Formatting (Prettier + Nx)

```bash
pnpm add -D prettier
pnpm nx format:check
pnpm nx format:write

```

### Why

Nx uses Prettier for formatting commands (`nx format:*`).
Installing Prettier as a `devDependency` makes the toolchain reproducible for anyone cloning the repository.

`format:check` is used to verify that the codebase is formatted correctly,
while `format:write` automatically applies the changes.

---

## Linting (Nx targets)

In a newly created Nx workspace (without `apps/` or `libs/`), projects with a `lint` target do not exist yet.
For this reason, `pnpm nx lint` requires a specific `project:target` argument.

Once `apps/web` and `apps/api` are present, the following command will be used:

```bash
pnpm nx run-many -t lint

```

`run-many` is an Nx command that allows executing the same target
across multiple workspace projects simultaneously.

It runs the `lint` target (`-t lint`) on all workspace projects
(applications and libraries) that expose it, allowing for code quality verification
across the entire monorepo with a single command.

This command becomes the reference as soon as the workspace contains
multiple projects and is easily integrable into a CI pipeline.

---

## Node.js Version Management (.nvmrc)

```bash
node -v

```

The `.nvmrc` file defines the recommended Node.js version for the project.

### It serves to:

* ensure development environment consistency across different developers
* avoid issues related to Node version discrepancies
* make the project setup reproducible

Tools like `nvm` or `fnm` automatically use this file to select the correct Node version.

---

## Backend App Generation (NestJS)

```bash
pnpm nx g @nx/nest:application apps/api \
  --name=api \
  --linter=eslint \
  --unitTestRunner=jest \
  --e2eTestRunner=none

```

Notes:

* `apps/api` is the positional parameter `[directory]` of the generator (project root).
* `--name=api` is the project name within Nx.
* `--e2eTestRunner=none` skips e2e tests for now (not required in the initial phase).

---

## Workspace Verification (Quality Gate)

```bash
pnpm nx show project api
pnpm nx lint api
pnpm nx test api
pnpm nx format:check
pnpm nx graph

```

---

## Backend Database Library Creation

```bash
pnpm nx g @nx/js:lib libs/api/db --bundler=tsc

```

**Description**

This command generates a TypeScript library dedicated to database access for the Backend API.

The library is placed in `libs/api/db`, following a **feature-oriented** structure and maintaining the database as an **isolated concern** relative to the rest of the application.

**Parameter Explanation**

* `@nx/js:lib`
Nx generator for framework-independent JavaScript / TypeScript libraries, ideal for shared or infrastructural logic.
* `libs/api/db`
Explicit path for the library.
The structure reflects the usage context (`api`) and responsibility (`db`), avoiding generic libraries and favoring clear separation of architectural boundaries.
* `--bundler=tsc`
Uses the TypeScript compiler (`tsc`) as the build system.
This choice is intentional:
* database code does not require advanced bundling
* keeps the build simple, transparent, and fast
* improves debuggability and maintainability
* integrates perfectly with Drizzle ORM and Node.js environments



**Architectural Motivation**

Isolating database access in a dedicated library allows to:

* avoid direct coupling between the API and the persistence layer
* facilitate testing, refactoring, and database replacement
* keep the backend modular and scalable
* fully leverage the advantages of the Nx monorepo

---

## Backend – Auth Scaffolding (Nx)

For the creation of the API authentication module, Nx generators for NestJS were used to maintain structural consistency and best practices.

```bash
pnpm nx g @nx/nest:module apps/api/src/app/auth/auth
pnpm nx g @nx/nest:service apps/api/src/app/auth/auth
pnpm nx g @nx/nest:controller apps/api/src/app/auth/auth

```

Nx generators allow to:

* automatically create files and correct wiring
* maintain naming and structural standards
* correctly integrate code into the Nx graph

---

## Backend – Run & Verify (Auth)

Start API in development mode (watch):

```bash
pnpm nx serve api --watch

```

Quality gate:

```bash
pnpm nx lint api
pnpm nx test api
pnpm nx format:check

```

Nx cache reset (useful if watch doesn't detect changes or the daemon is in an inconsistent state):

```bash
pnpm nx reset

```

### Smoke Test (curl)

Login (copy `accessToken`):

```bash
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"paolo@example.com",
    "password":"Password1",
    "rememberMe": false
  }'

```

Protected endpoint `/me`:

```bash
curl -s http://localhost:3000/api/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"

```

Access history:

```bash
curl -s "http://localhost:3000/api/me/access-history?limit=5" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"

```