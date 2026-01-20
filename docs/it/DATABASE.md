# Database Setup – Neon + Drizzle ORM

Questo progetto utilizza **PostgreSQL serverless tramite Neon** e **Drizzle ORM**
per la gestione type-safe dello schema e delle migrazioni.

L’obiettivo è avere:
- database cloud pronto all’uso (Neon)
- schema dichiarativo in TypeScript
- migrazioni versionate e riproducibili
- supporto completo a sviluppo locale e CI

## Perché Neon

È stato scelto Neon perché:
- fornisce PostgreSQL serverless gestito
- non richiede container o setup locali complessi
- è adatto a demo, assignment e ambienti CI
- espone una connection string standard PostgreSQL

Per lo sviluppo locale è comunque previsto l’uso di `docker-compose`
con PostgreSQL, mantenendo la stessa interfaccia applicativa.

## Environment Variables

La connessione al database avviene tramite variabile d’ambiente:

DATABASE_URL=postgresql://...

Il file `.env` **non è versionato** ed è escluso dal repository.
È invece fornito un file `.env.example` come riferimento.

Questo approccio garantisce:
- sicurezza delle credenziali
- chiarezza per chi clona il repository
- compatibilità con ambienti cloud e CI

## Perché Drizzle ORM

Drizzle è stato scelto al posto di ORM più “magici” perché:

- E' una richiesta esplicita dell'assignment
- è **type-safe** senza runtime overhead
- lo schema è scritto in TypeScript (single source of truth)
- le migrazioni sono SQL esplicite e versionate
- non nasconde il funzionamento del database
- si integra bene con monorepo Nx

Drizzle non genera codice runtime: il database rimane centrale
e trasparente.


## Schema del Database

Lo schema è definito in:

libs/api/db/src/schema.ts

Contiene attualmente:
- tabella `users`
- tabella `access_logs`

Le tabelle sono modellate direttamente tramite Drizzle,
includendo:
- tipi
- vincoli
- indici
- relazioni

### Note su indici e configurazione

La funzione:

(t) => ({
  userIdIdx: index(...).on(t.userId)
})

serve a definire:
- indici
- vincoli aggiuntivi
- configurazioni extra della tabella

## Migrazioni

Le migrazioni sono generate automaticamente da Drizzle:

pnpm db:generate

Questo comando:
- confronta lo schema TypeScript con lo stato del database
- genera una migration SQL versionata

Le migration sono applicate con:

pnpm db:migrate

## Drizzle Studio

Per ispezionare il database è disponibile Drizzle Studio:

pnpm db:studio

Studio permette di:
- visualizzare tabelle e colonne
- verificare vincoli e indici
- controllare lo stato del database

Nota: Drizzle Studio è attualmente in Beta.

## Stato attuale

- Schema applicato correttamente
- Tabelle create su Neon
- Migrazione iniziale versionata
- Studio operativo

Il database è pronto per l’integrazione con l’API NestJS.

## Integrazione con NestJS 

Ho centralizzato la connessione Postgres e il client Drizzle in una libreria Nx dedicata. L’API Nest consuma il client tramite un provider DI (token-based), così posso riusare la stessa configurazione ovunque, mantenere isolamento delle dipendenze per progetto e rendere la parte DB testabile e sostituibile.
Il provider è esposto da `DatabaseModule` tramite token `DB`

## Access logs (login audit)

La tabella `access_logs` viene utilizzata per registrare gli accessi utente al login:

- `user_id` (FK su `users`)
- `ip_address` (se disponibile)
- `user_agent` (se disponibile)
- `created_at`

L’API espone un endpoint protetto per recuperare gli ultimi accessi:

- `GET /me/access-history?limit=5`

La query è ordinata per `created_at DESC` e limitata (default 5, max 50) per evitare letture eccessive.
