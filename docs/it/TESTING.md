# Testing

Questo documento descrive la strategia di testing adottata nel progetto,
le aree attualmente coperte dai test automatici e le parti volutamente
lasciate a verifica manuale.

L’obiettivo non è massimizzare la coverage numerica, ma garantire
**affidabilità delle parti critiche** e **confidenza nelle evoluzioni future**.

---

## Tooling

Il progetto utilizza:

- **Jest** come test runner
- **@testing-library/react** per i test del frontend
- **Testing utilities NestJS** per i test del backend
- Target Nx dedicati (`nx test <project>`)

Esecuzione completa dei test:

```bash
pnpm nx run-many -t test --all
````

---

## Backend (NestJS)

### AuthService

File:

* `apps/api/src/app/auth/auth.service.spec.ts`

Copertura:

* **Register**

  * creazione utente con hashing password
  * ritorno del DTO pubblico (assenza di `passwordHash`)
  * gestione conflitto email (`ConflictException`)

* **Login**

  * credenziali non valide (`UnauthorizedException`)
  * password errata
  * login valido con:

    * generazione JWT
    * mapping corretto dell’utente
    * inserimento del record in `access_logs`

Approccio:

* database completamente mockato
* `bcrypt` mockato per evitare hashing reale
* test focalizzati sulla **logica di dominio**, non sull’infrastruttura

---

### AvatarController

File:

* `apps/api/src/app/auth/avatar.controller.spec.ts`

Copertura:

* validazione input:

  * errore se il file non è presente
* comportamento corretto:

  * costruzione dell’`avatarUrl`
  * delega ad `AuthService.updateAvatar`
  * ritorno dell’utente aggiornato

Il test verifica il **contratto tra controller e service** senza dipendere
dal filesystem o da Multer.

---

### AppController / AppService

File:

* `apps/api/src/app/app.controller.spec.ts`
* `apps/api/src/app/app.service.spec.ts`

Copertura:

* smoke test per verificare il corretto wiring dell’applicazione
* utile come guardia contro refactor accidentali o errori di bootstrap

---

## Frontend (React)

### App routing

File:

* `apps/web/src/app/app.spec.ts`

Copertura:

* rendering dell’applicazione senza crash
* rendering corretto della pagina di login sulla route `/login`

Il test utilizza:

* `MemoryRouter` per simulare la navigazione
* `AuthProvider` reale per rispettare il wiring dell’app

Questo garantisce che:

* il routing funzioni correttamente
* il contesto di autenticazione sia correttamente montato

---

### Librerie frontend

#### Auth (logic)

File:

* `libs/web/auth/src/lib/auth.spec.tsx`

Copertura:

* smoke test di rendering
* verifica che la libreria sia correttamente buildabile e importabile

#### Auth UI

File:

* `libs/web/auth-ui/src/lib/auth-ui.spec.tsx`

Copertura:

* smoke test di rendering dei componenti UI
* garantisce stabilità della libreria come modulo riusabile

---

## Cosa non è coperto (scelta consapevole)

Attualmente **non sono coperti da test automatici**:

* flusso completo di login/register lato UI
* gestione errori visuali nei form
* dashboard e visualizzazione access history
* test end-to-end (E2E)

Queste parti sono:

* verificate manualmente
* pianificate per fasi successive (UX polish / bonus)

Questa scelta è intenzionale e coerente con lo scope dell’assignment,
privilegiando stabilità del core rispetto a coverage superficiale.

---

## Filosofia di testing

* testare la **logica critica**
* evitare test fragili o puramente cosmetici
* mantenere i test come supporto al refactoring, non come vincolo
* aggiungere nuovi test solo quando introducono reale valore

