# Comandi e Scelte Tecniche

Questo documento descrive i principali comandi utilizzati durante lo sviluppo del progetto
e le motivazioni tecniche alla base delle scelte effettuate.

L’obiettivo non è fornire un tutorial passo-passo, ma rendere esplicite le decisioni
che influenzano l’architettura, la manutenibilità e l’evoluzione del progetto.

---

## Inizializzazione del workspace Nx

```bash
pnpm dlx create-nx-workspace@latest assignment-ftechnology \
  --preset=apps \
  --pm=pnpm \
  --nxCloud=skip
````

### Descrizione del comando

Il comando viene utilizzato per inizializzare un nuovo workspace **Nx** all’interno
di una cartella dedicata, configurando il progetto come **monorepo**.

---

### Spiegazione dei parametri

#### `pnpm dlx`

`dlx` è l’equivalente di `npx` per **pnpm**.

Permette di:

* eseguire pacchetti Node senza installarli globalmente
* garantire l’utilizzo di una versione pulita e isolata dello strumento
* evitare dipendenze globali non controllate

Questa modalità è particolarmente indicata per comandi di bootstrap e scaffolding.

---

#### `create-nx-workspace@latest`

Avvia il generatore ufficiale di Nx per la creazione di un nuovo workspace.

L’uso del tag `@latest` indica l’ultima **versione stabile** disponibile al momento
dell’esecuzione del comando, assicurando:

* accesso alle funzionalità più aggiornate
* allineamento con le best practice consigliate dal framework Nx

---

#### `assignment-ftechnology`

Nome del workspace e della directory principale del progetto.

È stato scelto un nome descrittivo e coerente con il contesto dell’assignment,
in modo da:

* rendere immediatamente riconoscibile il progetto
* mantenere allineati nome del repository e nome del workspace Nx

---

#### `--preset=apps`

Il parametro `preset` definisce il tipo di workspace iniziale.

L’opzione `apps` crea un workspace **neutro**, senza generare automaticamente
applicazioni o librerie, lasciando pieno controllo sulla struttura iniziale.

Questa scelta consente di:

* creare manualmente le applicazioni (`web`, `api`) solo quando necessario
* evitare codice generato non utilizzato
* mantenere il monorepo pulito e intenzionale

Altri preset disponibili includono, ad esempio:

* `react-monorepo`
* `nest`
* `next`
* `angular`
* `node-monorepo`

In questo progetto si è preferito un preset generico per modellare
l’architettura in modo esplicito e progressivo.

---

#### `--pm=pnpm`

Specifica il **package manager** da utilizzare nel workspace.

È stato scelto `pnpm` per i seguenti motivi:

* migliore gestione delle dipendenze in contesti monorepo
* installazioni più rapide
* minore utilizzo di spazio su disco grazie allo store globale
* supporto nativo e consigliato da Nx

---

#### `--nxCloud=skip`

Disabilita la configurazione di **Nx Cloud**.

Per questo assignment:

* non è richiesta una pipeline CI distribuita
* non è necessario il caching remoto
* si preferisce ridurre dipendenze esterne non indispensabili

La scelta mantiene il progetto più semplice e focalizzato sugli aspetti richiesti.

---

## Considerazioni

Questo comando rappresenta il punto di partenza del progetto e definisce le basi
architetturali su cui verranno costruite le applicazioni frontend, backend
e le librerie condivise.

Tutte le scelte effettuate in questa fase mirano a:

* mantenere il progetto scalabile
* evitare configurazioni premature
* favorire chiarezza e manutenibilità



## Ambiente di sviluppo locale (PostgreSQL via Docker)

```bash
docker compose up -d
```

### Descrizione

Questo comando avvia un'istanza locale di **PostgreSQL** tramite Docker,
utilizzando il file `docker-compose.yml` presente nella root del progetto.

L’obiettivo è fornire un ambiente di sviluppo **completamente offline**,
senza dipendenze da servizi cloud esterni.

---

### Perché Docker Compose

L’utilizzo di Docker Compose consente di:

* avviare il database con un singolo comando
* evitare installazioni manuali di PostgreSQL
* garantire un ambiente coerente tra diversi sviluppatori o revisori
* permettere a chi valuta l’assignment di eseguire il progetto localmente senza configurazioni aggiuntive

---

### Relazione con il database cloud (Neon)

Il progetto è configurato per funzionare sia con:

* **PostgreSQL cloud (Neon)** – per demo e sviluppo remoto
* **PostgreSQL locale (Docker)** – per sviluppo offline e review tecnica

Il passaggio tra i due ambienti avviene semplicemente modificando la variabile
`DATABASE_URL` nel file `.env`.

Questa scelta garantisce massima flessibilità senza introdurre complessità
nell’architettura applicativa.

---

## Formatting (Prettier + Nx)

```bash
pnpm add -D prettier
pnpm nx format:check
pnpm nx format:write
````

### Perché

Nx utilizza Prettier per i comandi di formattazione (`nx format:*`).
Installare Prettier come devDependency rende la toolchain riproducibile per chi clona il repository.

`format:check` viene usato per verificare che la base codice sia formattata correttamente,
mentre `format:write` applica automaticamente le modifiche.

---

## Linting (Nx targets)

In un workspace Nx appena creato (senza `apps/` e `libs/`) non esistono ancora progetti con target `lint`.
Per questo `pnpm nx lint` richiede `project:target`.

Quando saranno presenti `apps/web` e `apps/api`, verrà usato:

```bash
pnpm nx run-many -t lint
```

`run-many` è un comando Nx che permette di eseguire lo stesso target
su più progetti del workspace contemporaneamente.

Esegue il target `lint` (`-t lint`) su tutti i progetti del workspace
(applicazioni e librerie) che lo espongono, permettendo di verificare
la qualità del codice sull’intero monorepo con un singolo comando.

Questo comando diventa il riferimento non appena il workspace contiene
più progetti ed è facilmente integrabile in una pipeline CI.

---

## Gestione versione Node.js (.nvmrc)

```bash
node -v
```
Il file .nvmrc definisce la versione di Node.js consigliata per il progetto.

### Serve a:

- garantire coerenza dell’ambiente di sviluppo tra diversi sviluppatori

- evitare problemi legati a differenze di versione di Node

- rendere il setup del progetto riproducibile

- Strumenti come nvm o fnm utilizzano automaticamente questo file per selezionare la versione corretta di Node.


## Generazione app backend (NestJS)

```bash
pnpm nx g @nx/nest:application apps/api \
  --name=api \
  --linter=eslint \
  --unitTestRunner=jest \
  --e2eTestRunner=none
````

Note:

* `apps/api` è il parametro posizionale `[directory]` del generator (root del progetto).
* `--name=api` è il nome del project in Nx.
* `--e2eTestRunner=none` evita test e2e per ora (non richiesti nella fase iniziale).


## Verifiche workspace (quality gate)

```bash
pnpm nx show project api
pnpm nx lint api
pnpm nx test api
pnpm nx format:check
pnpm nx graph
```
---

## Creazione libreria database backend

```bash
pnpm nx g @nx/js:lib libs/api/db --bundler=tsc
```

**Descrizione**

Questo comando genera una libreria TypeScript dedicata all’accesso al database per il backend API.

La libreria viene posizionata in `libs/api/db`, seguendo una struttura **feature-oriented** e mantenendo il database come **concern isolato** rispetto al resto dell’applicazione.

**Spiegazione dei parametri**

* `@nx/js:lib`
  Generatore Nx per librerie JavaScript / TypeScript indipendenti dal framework, ideale per logica condivisa o infrastrutturale.

* `libs/api/db`
  Percorso esplicito della libreria.
  La struttura riflette il contesto di utilizzo (`api`) e la responsabilità (`db`), evitando librerie generiche e favorendo una chiara separazione dei confini architetturali.

* `--bundler=tsc`
  Utilizza il compilatore TypeScript (`tsc`) come sistema di build.

  Questa scelta è intenzionale:

  * il codice database non richiede bundling avanzato
  * mantiene il build semplice, trasparente e veloce
  * migliora debuggabilità e manutenibilità
  * si integra perfettamente con Drizzle ORM e ambienti Node.js

**Motivazione architetturale**

Isolare l’accesso al database in una libreria dedicata consente di:

* evitare accoppiamenti diretti tra API e persistence layer
* facilitare test, refactor e sostituzione del database
* mantenere il backend modulare e scalabile
* sfruttare pienamente i vantaggi del monorepo Nx

---

## Backend – Auth scaffolding (Nx)

Per la creazione del modulo di autenticazione lato API sono stati utilizzati i generatori Nx per NestJS, in modo da mantenere coerenza strutturale e best practice.

```bash
pnpm nx g @nx/nest:module apps/api/src/app/auth/auth
pnpm nx g @nx/nest:service apps/api/src/app/auth/auth
pnpm nx g @nx/nest:controller apps/api/src/app/auth/auth
```

I generatori Nx permettono di:

* creare automaticamente file e wiring corretti

* mantenere naming e struttura standard

* integrare correttamente il codice nel graph Nx


## Backend – Run & Verify (Auth)

Avvio API in modalità sviluppo (watch):

```bash
pnpm nx serve api --watch
````

Quality gate:

```bash
pnpm nx lint api
pnpm nx test api
pnpm nx format:check
```

Reset cache Nx (utile se il watch non rileva cambiamenti o la daemon è in stato inconsistente):

```bash
pnpm nx reset
```

### Smoke test (curl)

Login (copia `accessToken`):

```bash
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"paolo@example.com",
    "password":"Password1",
    "rememberMe": false
  }'
```

Endpoint protetto `/me`:

```bash
curl -s http://localhost:3000/api/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Access history:

```bash
curl -s "http://localhost:3000/api/me/access-history?limit=5" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```
