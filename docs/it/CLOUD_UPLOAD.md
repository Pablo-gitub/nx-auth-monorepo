# Upload Avatar – Local vs Cloud Storage

In questo progetto l’upload degli avatar è implementato **in locale**
tramite filesystem, in modo semplice e coerente con i requisiti
dell’assignment.

L’architettura è però progettata per permettere una migrazione
verso uno storage cloud **senza refactor invasivi**.

---

## Implementazione attuale (Locale)

- Upload gestito tramite `multer` (`diskStorage`)
- File salvati in:
  
```

uploads/avatars/

```

- File serviti staticamente tramite `ServeStaticModule`:

```

GET /uploads/avatars/<filename>

```

- Nel database viene salvato **solo il riferimento** (`avatarUrl`)

### Vantaggi
- Nessuna dipendenza esterna
- Setup immediato
- Ideale per demo e review tecnica
- Facilmente testabile localmente

---

## Migrazione a Object Storage (S3 / Cloudflare R2)

### Strategia consigliata

1. Sostituire `diskStorage` con uno storage custom
2. Delegare l’upload a un service dedicato (es. `FileStorageService`)
3. Salvare nel DB solo l’URL pubblico restituito dallo storage

### Vantaggi
- Scalabilità
- Persistenza indipendente dall’API
- Standard industriale

### Impatto sull’architettura
Minimo.  
Il controller rimane invariato, cambia solo l’implementazione dello storage.

---

## Alternativa: Firebase Storage (Bonus)

Firebase Storage può essere usato **solo come file storage**,
senza Firebase Authentication.

### Possibile setup

- API NestJS deployata (Render / Fly.io / Railway)
- Firebase Storage per asset statici
- Regole di sicurezza basate su:
- token JWT custom
- signed URLs
- oppure bucket pubblico (solo avatar)

### Perché è interessante
- Mostra integrazione con BaaS
- Facile deploy demo
- Abilitabile come extra senza toccare il core

---

## Nota architetturale

L’upload è volutamente **isolato**:
- controller → valida e riceve file
- service → aggiorna riferimento
- storage → intercambiabile

Questo consente di cambiare backend di storage
senza modificare il dominio applicativo.
