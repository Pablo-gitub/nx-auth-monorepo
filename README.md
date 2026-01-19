# Assignment FTechnology – Nx Full Stack Authentication App
[`README.en.md`](README.en.md) Go to english version.

![Nx](https://img.shields.io/badge/Nx-monorepo-143055)
![TypeScript](https://img.shields.io/badge/TypeScript-strongly%20typed-blue)
![pnpm](https://img.shields.io/badge/pnpm-package%20manager-orange)
![License](https://img.shields.io/badge/license-MIT-green)

## Descrizione del progetto

Questo repository contiene l’implementazione di un’applicazione web full stack sviluppata come **esercizio di verifica tecnica**, utilizzando **Nx (monorepo)**, **React**, **NestJS** e **Drizzle ORM**.

L’obiettivo del progetto è realizzare un **sistema di autenticazione completo**, comprensivo di:

* registrazione utente
* login
* dashboard personale
* gestione e modifica del profilo
* cronologia degli accessi

Il progetto è strutturato come **monorepo Nx**, con separazione chiara tra frontend, backend e librerie condivise, seguendo buone pratiche di architettura e organizzazione del codice.

---

## Stack Tecnologico

* **Nx** – Monorepo e gestione del workspace
* **React** – Frontend web
* **NestJS** – Backend API
* **TypeScript** – Tipizzazione statica obbligatoria
* **Drizzle ORM** – Accesso ai dati e gestione del database
* **Database** – PostgreSQL / MariaDB / MongoDB (configurabile)
* **JWT** – Autenticazione e gestione delle sessioni
* **pnpm** – Package manager
* **shadcn/ui** – Componenti UI
* **daisyUI** – Gestione temi (light/dark)

---

## Requisiti Funzionali

### 1. Registrazione Utente (`/register`)

Pagina di registrazione con form contenente i seguenti campi:

* Nome e Cognome
* Email (con validazione del formato)
* Password

  * minimo 8 caratteri
  * almeno una lettera maiuscola
  * almeno un numero
* Conferma Password
* Data di nascita
* Avatar (upload immagine opzionale)

Funzionalità richieste:

* Validazione lato client di tutti i campi
* Feedback visivo degli errori di validazione
* Gestione del caricamento (loading state)
* Redirect alla pagina di login in caso di registrazione avvenuta con successo

---

### 2. Login (`/login`)

Pagina di login con:

* Email
* Password

Funzionalità richieste:

* Gestione degli errori di autenticazione
* Implementazione del “Remember me”
* Link per il recupero password (solo UI)
* Redirect automatico alla dashboard dopo il login

---

### 3. Dashboard Utente (`/dashboard`)

Pagina accessibile solo ad utenti autenticati.

Contenuti:

* Header con logo e menu di navigazione
* Sidebar con informazioni principali dell’utente
* Sezione centrale con:

  * riepilogo dei dati del profilo
  * form di modifica dei dati personali
  * cronologia degli ultimi 5 accessi
* Funzionalità di logout

---

## Requisiti Tecnici

### Frontend

#### Struttura del progetto

* Componenti modulari e riutilizzabili
* Organizzazione chiara di file e cartelle
* Utilizzo di custom hooks per la logica applicativa

#### State Management

* Uso appropriato degli hook React (`useState`, `useEffect`, `useContext`)
* Context dedicato per la gestione dell’autenticazione

#### Routing

* Configurazione delle route con React Router
* Protezione delle route private
* Gestione corretta dei redirect

#### UI / UX

* Design responsive
* Feedback visivo per le azioni dell’utente
* Loading states per operazioni asincrone
* Gestione user-friendly degli errori
* Utilizzo dei componenti **shadcn/ui**

---

### Backend (API)

#### Autenticazione

* API per registrazione e login
* Utilizzo di JWT per la gestione delle sessioni
* Hashing sicuro delle password

#### Gestione Dati

* Validazione dei dati in ingresso
* CRUD del profilo utente
* Gestione strutturata degli errori

#### Storage

* Utilizzo di un database (MariaDB, PostgreSQL o MongoDB)
* Gestione dell’upload dell’avatar
* Implementazione di migration e seed del database

---

## Bonus Points (Assignment)

* Test unitari sui componenti principali
* Animazioni per le transizioni tra le pagine
* Implementazione della funzionalità “Password dimenticata”
* Autenticazione social (Google o GitHub)
* Theme switcher Dark / Light

---

## Bonus Extra (Estensioni Architetturali)

Oltre ai bonus richiesti dall’assignment, il progetto prevede alcune estensioni opzionali orientate alla **qualità architetturale**:

* **Sistema di internazionalizzazione (i18n)**
  Gestione centralizzata delle stringhe tramite file di traduzione, evitando hard-coding dei testi nell’interfaccia e abilitando il supporto multilingua.

* **String Manager**
  Struttura dedicata per l’organizzazione delle stringhe applicative, migliorando manutenibilità, leggibilità e coerenza del codice.

* **Gestione del tema (light / dark)**
  Implementata tramite daisyUI, con persistenza della preferenza utente.

Queste estensioni non sono strettamente richieste, ma mirano a dimostrare attenzione all’architettura, alla scalabilità e alla qualità del codice.

---

## Installazione e Avvio

```bash
pnpm install
pnpm nx serve web
pnpm nx serve api
```

---

## Documentazione

La documentazione di progetto è organizzata nella cartella `docs/`:

- [`docs/it/SETUP.md`](docs/it/SETUP.md)  
  Questo documento descrive le modalità di configurazione e avvio del progetto in ambiente di sviluppo locale.

- [`docs/it/ROADMAP.md`](docs/it/ROADMAP.md)  
  Roadmap di sviluppo e checklist dei requisiti dell’assignment.

- [`docs/it/COMMANDS.md`](docs/it/COMMANDS.md)  
  Elenco dei principali comandi utilizzati durante lo sviluppo e motivazioni delle scelte tecniche.

- [`docs/it/ARCHITECTURE.md`](docs/it/ARCHITECTURE.md)  
  Descrizione dell’architettura del monorepo Nx, delle app e delle librerie condivise.

La struttura è predisposta anche per una versione in lingua inglese (`docs/en/`).


---

## Stato del progetto

Lo sviluppo segue una roadmap incrementale:

* completamento dei requisiti core
* hardening dell’autenticazione
* implementazione dei bonus
* eventuali estensioni architetturali

---

### Nota finale

Questo progetto è pensato come **esercizio tecnico**, ma strutturato seguendo pratiche applicabili a contesti reali di sviluppo software.

