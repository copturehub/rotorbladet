# Rotorbladet.se - Drönarnyhetssajt

Sveriges ledande nyhetsaggregator för drönarbranschen, byggd med Next.js 15 och Payload CMS 3.

## Översikt

Rotorbladet aggregerar drönarnyheter från Sverige och världen via en helautomatiserad pipeline:

1. **Raindrop.io** — Bokmärk intressanta artiklar med ett klick (browser extension)
2. **Make.com** — Triggar var 15:e minut, skickar till OpenAI för svensk sammanfattning + kategorisering
3. **POST /api/articles** — Publicerar automatiskt till Payload CMS med duplicate-check
4. **Next.js frontend** — Visar nyheter med ticker, trending, featured och artikelgrid
5. **Resend** — Nyhetsbrev via `/prenumerera`

## Snabbstart

### Förutsättningar
- Node.js 20+
- MongoDB (lokal eller Atlas)
- npm eller pnpm

### Installation

1. **Installera dependencies:**
```bash
npm install
```

2. **Starta MongoDB:**
```bash
brew services start mongodb-community
```

3. **Starta dev-server:**
```bash
npm run dev
```

4. **Skapa admin-konto:**
- Gå till http://localhost:3000/admin
- Skapa ditt första admin-konto

5. **Besök hemsidan:**
- Frontend: http://localhost:3000
- Admin: http://localhost:3000/admin

#### Docker (Optional)

If you prefer to use Docker for local development instead of a local MongoDB instance, the provided docker-compose.yml file can be used.

To do so, follow these steps:

- Modify the `MONGODB_URL` in your `.env` file to `mongodb://127.0.0.1/<dbname>`
- Modify the `docker-compose.yml` file's `MONGODB_URL` to match the above `<dbname>`
- Run `docker-compose up` to start the database, optionally pass `-d` to run in the background.

## Collections

### Articles
Huvudcollection för nyhetsartiklar:
- `title` - Rubrik
- `slug` - URL-vänlig slug
- `summary` - Kort sammanfattning (max 500 tecken)
- `content` - Rich text innehåll
- `category` - Kategori (reglering, utrustning, utbildning, nyheter, affärer)
- `tags` - Relation till Tags
- `original_url` - Länk till originalkälla
- `source` - Källans namn
- `ai_processed` - Flagga om artikeln är AI-bearbetad
- `publishedAt` - Publiceringsdatum
- `featured_image` - Utvald bild

### Tags
Taggar för kategorisering:
- `name` - Taggnamn
- `slug` - URL-vänlig slug

### Media
Bilduppladdning med automatisk resize och optimering.

### Users
Admin-användare med autentisering.

### Docker

Alternatively, you can use [Docker](https://www.docker.com) to spin up this template locally. To do so, follow these steps:

1. Follow [steps 1 and 2 from above](#development), the docker-compose file will automatically use the `.env` file in your project root
1. Next run `docker-compose up`
1. Follow [steps 4 and 5 from above](#development) to login and create your first admin user

That's it! The Docker instance will help you get up and running quickly while also standardizing the development environment across your teams.

## Automation med Make.com

Se [MAKE_AUTOMATION.md](./MAKE_AUTOMATION.md) för detaljerad guide om hur du sätter upp:
- Raindrop.io webhook
- OpenAI artikel-bearbetning
- Automatisk publicering till Payload
- Beehiiv nyhetsbrev-integration

## API Endpoints

### Publika
- `GET /api/articles` — Lista artiklar (`?limit=20&page=1`)
- `GET /api/rss` — RSS-feed

### Autentiserade (kräver `x-api-key` header)
- `POST /api/articles` — Skapa artikel (används av Make.com)
  - Body: `{ title, summary, category, tags, original_url, source, cover_url }`
  - Returnerar 409 om `original_url` redan finns (duplicate-skydd)
- `POST /api/articles/[id]/track-click` — Registrera klick (trending-algoritm)
- `POST /api/articles/[id]/toggle-featured` — Markera som utvald

### Admin
- `POST /api/subscribe` — Prenumerera på nyhetsbrev
- `GET /api/admin/check` — Kontrollera admin-status

### GraphQL
- `POST /api/graphql`

## Deployment

Projektet deployas automatiskt via **Vercel** kopplat till GitHub-repot `copturehub/rotorbladet`.

### Så här deployas

```bash
git add .
git commit -m "beskrivning av ändring"
git push origin main
```

Vercel triggar automatiskt en ny deploy vid push till `main`. Ingen manuell deploy krävs.

**Live URLs:**
- Production: https://rotorbladet.se
- Preview: https://rotorbladet.vercel.app

### Miljövariabler i Vercel
Sätts under Project Settings → Environment Variables:
- `DATABASE_URL` — MongoDB Atlas connection string
- `PAYLOAD_SECRET` — Hemlig nyckel för Payload CMS
- `ARTICLES_API_KEY` — API-nyckel för Make.com → POST /api/articles
- `RESEND_API_KEY` — För nyhetsbrevs-utskick
- `NEXT_PUBLIC_SITE_URL` — `https://rotorbladet.se`

### MongoDB Atlas
1. Skapa gratis cluster på mongodb.com/cloud/atlas
2. Skapa database user
3. Whitelist IP (0.0.0.0/0 för Vercel)
4. Kopiera connection string till `DATABASE_URL`

## Frontend-funktioner (2026 UX)

- Animerad nyhetsticker med senaste rubriker
- Newsletter hero-sektion med prenumerant-räknare
- Featured articles i hero magazine-layout
- Trending horizontal scroll strip (baserat på klick-data)
- 3-kolumns artikelgrid med kategorifilter
- "NY"-badge på artiklar < 6 timmar gamla
- Läs-status persistent i localStorage
- Bokmärk-funktion i localStorage
- Läsprogressbar på artikelsidor
- Relaterade artiklar baserat på kategori
- Delnings-knapp per artikel
- Admin-kontroller (featured/delete/edit) för inloggade
- Responsiv med mobilmeny
- Next/Image för automatisk bildoptimering (WebP/AVIF)

## Make.com Pipeline

```
Raindrop.io (Watch Bookmarks, var 15 min)
  → OpenAI (GPT-4o-mini: svensk titel, summary, kategori, tags)
  → JSON Parse
  → POST /api/articles (x-api-key auth, 409 vid duplicate)
```

## Nästa Steg

- 📊 Analytics-dashboard för redaktören (klick, prenumeranter, kategorier)
- � Push-notiser för nya artiklar
- 🗺️ Förbättrade kategori-sidor med filter

## Support

För frågor om Payload CMS: [Payload Documentation](https://payloadcms.com/docs)
För Make.com automation: Se MAKE_AUTOMATION.md
