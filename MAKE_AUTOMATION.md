# Make.com Automation Setup för Rotorbladet.se

## Översikt
Raindrop.io → Make.com → OpenAI → Payload CMS → Beehiiv

## Steg 1: Skapa API Token i Payload

1. Gå till http://localhost:3000/admin/account
2. Klicka på "API Keys"
3. Skapa ny API key med namn "Make.com Integration"
4. Kopiera token (visas bara en gång!)

## Steg 2: Make.com Scenario

### Module 1: Raindrop Webhook
- **Trigger:** Webhooks → Custom webhook
- **Webhook URL:** Kopiera från Make.com
- **I Raindrop:** Settings → Integrations → Webhooks → Lägg till webhook-URL

### Module 2: OpenAI - Process Article
- **Action:** OpenAI → Create a Chat Completion
- **Model:** gpt-4
- **System Message:**
```
Du är en redaktör för Rotorbladet.se, Sveriges ledande nyhetssajt för drönarbranschen.

Bearbeta följande artikel och returnera JSON:
{
  "title": "Rubrik på svenska",
  "summary": "Sammanfattning i 2-3 meningar",
  "category": "reglering|utrustning|utbildning|nyheter|affarer",
  "tags": ["tag1", "tag2"],
  "content": "Omskriven artikel i neutralt, informativ ton för svenska drönarpiloter"
}
```

- **User Message:**
```
Titel: {{1.item.title}}
URL: {{1.item.url}}
```

### Module 3: Parse JSON
- **Action:** Tools → Parse JSON
- **JSON String:** `{{2.choices[0].message.content}}`

### Module 4: Create Article in Payload
- **Action:** HTTP → Make a Request
- **Method:** POST
- **URL:** `http://localhost:3000/api/articles`
- **Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_PAYLOAD_API_TOKEN
```
- **Body:**
```json
{
  "title": "{{3.title}}",
  "slug": "{{replace(lower(3.title); ' '; '-')}}",
  "summary": "{{3.summary}}",
  "content": {
    "root": {
      "type": "root",
      "children": [
        {
          "type": "paragraph",
          "children": [
            {
              "type": "text",
              "text": "{{3.content}}"
            }
          ]
        }
      ]
    }
  },
  "original_url": "{{1.item.url}}",
  "source": "{{1.item.domain}}",
  "category": "{{3.category}}",
  "ai_processed": true,
  "publishedAt": "{{now}}"
}
```

### Module 5: Send to Beehiiv (Optional)
- **Action:** HTTP → Make a Request
- **Method:** POST
- **URL:** `https://api.beehiiv.com/v2/publications/YOUR_PUBLICATION_ID/posts`
- **Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_BEEHIIV_API_KEY
```
- **Body:**
```json
{
  "title": "{{3.title}}",
  "content_html": "{{3.content}}",
  "status": "draft"
}
```

## Steg 3: Testa Workflow

1. Spara en artikel i Raindrop
2. Kontrollera att Make.com-scenariot körs
3. Verifiera att artikeln skapas i Payload (http://localhost:3000/admin/collections/articles)
4. Kolla att den syns på hemsidan (http://localhost:3000)

## API Endpoints

### Payload CMS
- **Base URL:** `http://localhost:3000/api`
- **Articles:** `GET/POST /api/articles`
- **Single Article:** `GET/PATCH/DELETE /api/articles/:id`
- **Tags:** `GET/POST /api/tags`

### Beehiiv
- **Base URL:** `https://api.beehiiv.com/v2`
- **Documentation:** https://developers.beehiiv.com/

## Troubleshooting

### Artikel skapas inte
- Kontrollera API token
- Kolla Make.com execution logs
- Verifiera att MongoDB körs: `brew services list | grep mongodb`

### OpenAI timeout
- Öka timeout i Make.com settings
- Använd kortare artiklar för test

### Beehiiv integration
- Verifiera API key i Beehiiv dashboard
- Kontrollera publication ID
