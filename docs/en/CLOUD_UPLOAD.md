# Upload Avatar – Local vs Cloud Storage

In this project, avatar upload is implemented **locally** via the filesystem,
keeping it simple and consistent with the assignment requirements.

However, the architecture is designed to allow migration to **cloud storage**
**without invasive refactoring**.

---

## Current Implementation (Local)

* Upload managed via `multer` (`diskStorage`)
* Files saved in:

```

uploads/avatars/


```

* Files served statically via `ServeStaticModule`:

```

GET /uploads/avatars/<filename>


```

* **Only the reference** (`avatarUrl`) is saved in the database.

### Advantages

* No external dependencies
* Instant setup
* Ideal for demos and technical reviews
* Easily testable locally

---

## Migration to Object Storage (S3 / Cloudflare R2)

### Recommended Strategy

1. Replace `diskStorage` with a custom storage engine
2. Delegate the upload to a dedicated service (e.g., `FileStorageService`)
3. Save only the public URL returned by the storage provider in the DB

### Advantages

* Scalability
* Persistence independent of the API
* Industry standard

### Architectural Impact

Minimal.
The controller remains unchanged; only the storage implementation changes.

---

## Alternative: Firebase Storage (Bonus)

Firebase Storage can be used **only as file storage**,
without Firebase Authentication.

### Possible Setup

* Deployed NestJS API (Render / Fly.io / Railway)
* Firebase Storage for static assets
* Security rules based on:
* custom JWT tokens
* signed URLs
* or public bucket (avatars only)



### Why it's interesting

* Demonstrates BaaS integration
* Easy demo deployment
* Can be enabled as an extra without touching the core

---

## Architectural Note

The upload is intentionally **isolated**:

* controller → validates and receives files
* service → updates reference
* storage → interchangeable/swappable

This allows changing the storage backend
without modifying the application domain.