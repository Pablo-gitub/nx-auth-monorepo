# Testing

This document describes the testing strategy adopted in the project,
the areas currently covered by automated tests, and the parts intentionally
left for manual verification.

The goal is not to maximize numerical coverage, but to ensure
**reliability of critical parts** and **confidence in future development**.

---

## Tooling

The project uses:

* **Jest** as the test runner
* **@testing-library/react** for frontend tests
* **NestJS testing utilities** for backend tests
* Dedicated Nx targets (`nx test <project>`)

Full test execution:

```bash
pnpm nx run-many -t test --all

```

---

## Backend (NestJS)

### AuthService

File:

* `apps/api/src/app/auth/auth.service.spec.ts`

Coverage:

* **Register**
* user creation with password hashing
* return of public DTO (absence of `passwordHash`)
* duplicate email handling (`ConflictException`)


* **Login**
* invalid credentials (`UnauthorizedException`)
* wrong password
* valid login with:
* JWT generation
* correct user mapping
* record insertion in `access_logs`





Approach:

* database completely mocked
* `bcrypt` mocked to avoid real hashing
* tests focused on **domain logic**, not infrastructure

---

### AvatarController

File:

* `apps/api/src/app/auth/avatar.controller.spec.ts`

Coverage:

* input validation:
* error if the file is missing


* correct behavior:
* construction of `avatarUrl`
* delegation to `AuthService.updateAvatar`
* return of the updated user



The test verifies the **contract between controller and service** without depending
on the filesystem or Multer.

---

### AppController / AppService

File:

* `apps/api/src/app/app.controller.spec.ts`
* `apps/api/src/app/app.service.spec.ts`

Coverage:

* smoke test to verify correct application wiring
* useful as a guard against accidental refactors or bootstrap errors

---

## Frontend (React)

### App routing

File:

* `apps/web/src/app/app.spec.ts`

Coverage:

* application rendering without crashing
* correct rendering of the login page on the `/login` route

The test uses:

* `MemoryRouter` to simulate navigation
* Real `AuthProvider` to respect app wiring

This ensures that:

* routing works correctly
* authentication context is correctly mounted

---

## Frontend Libraries

### Auth (logic)

File:

* `libs/web/auth/src/lib/auth.spec.tsx`

Coverage:

* rendering smoke test
* verification that the library is correctly buildable and importable

### Auth UI

File:

* `libs/web/auth-ui/src/lib/auth-ui.spec.tsx`

Coverage:

* UI component rendering smoke test
* ensures stability of the library as a reusable module

---

## What is not covered (Conscious Choice)

Currently, the following are **not covered by automated tests**:

* full UI login/register flow
* visual error handling in forms
* dashboard and access history visualization
* end-to-end (E2E) tests

These parts are:

* manually verified
* planned for subsequent phases (UX polish / bonus)

This choice is intentional and consistent with the assignment scope,
prioritizing core stability over superficial coverage.

---

## Testing Philosophy

* test **critical logic**
* avoid fragile or purely cosmetic tests
* maintain tests as support for refactoring, not as a constraint
* add new tests only when they introduce real value