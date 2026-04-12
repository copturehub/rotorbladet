# Rotorbladet.se - Drönarnyhetssajt

En nyhetsaggregator för drönarbranschen i Sverige, byggd med Next.js och Payload CMS.

## Översikt

Rotorbladet.se aggregerar drönarnyheter från Sverige och världen genom en automatiserad workflow:
- **Raindrop.io** - Spara intressanta artiklar med ett klick
- **Make.com** - Automation och AI-bearbetning med OpenAI
- **Payload CMS** - Innehållshantering och API
- **Next.js** - Modern frontend
- **Beehiiv** - Nyhetsbrev (optional)

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

### REST API
- **Articles:** `GET/POST /api/articles`
- **Single Article:** `GET/PATCH/DELETE /api/articles/:id`
- **Tags:** `GET/POST /api/tags`
- **Media:** `GET/POST /api/media`

### GraphQL
- **Endpoint:** `POST /api/graphql`

## Deployment

Deploy till Vercel med ett klick. MongoDB Atlas rekommenderas för production.

**Live URL:** Coming soon...
### MongoDB Atlas
1. Skapa gratis cluster på mongodb.com/cloud/atlas
2. Skapa database user
3. Whitelist IP (0.0.0.0/0 för Vercel)
4. Kopiera connection string till `DATABASE_URL`

## Nästa Steg

1. ✅ Skapa ditt första admin-konto
2. ✅ Lägg till några artiklar manuellt för att testa
3. 📝 Sätt upp Make.com automation (se MAKE_AUTOMATION.md)
4. 📧 Konfigurera Beehiiv för nyhetsbrev
5. 🚀 Deploy till production

## Support

För frågor om Payload CMS: [Payload Documentation](https://payloadcms.com/docs)
För Make.com automation: Se MAKE_AUTOMATION.md
