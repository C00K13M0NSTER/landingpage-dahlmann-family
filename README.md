# landingpage-dahlmann-family

Kleine Familien-Startseite für **dahlmann.family** (Stil wie dhlmnn.de) – als generischer Cloudflare Worker, der beliebig viele Domains bedienen kann.

- Ein Worker, mehrere Domains: Inhalt pro Hostname aus [src/sites.ts](src/sites.ts). Domains ohne Eintrag zeigen nur ihren Namen.
- Inter wird selbst ausgeliefert, keine externen Ressourcen (keine Skripte, Tracker oder CDNs).
- `/` antwortet mit 200, unbekannte Pfade mit echtem 404. `www.` leitet per 301 auf die Hauptdomain um.

## Warum echter Inhalt (Palo Alto & Co.)

URL-Filter wie Palo Alto (PAN-DB) stufen Seiten ohne Inhalt als **Insufficient Content** und Platzhalter/geparkte Domains als **Parked** ein. Beide Kategorien werden in Firmennetzen üblicherweise blockiert. Deshalb zeigt die Seite ein paar echte Sätze statt „Wartung“ oder „Domain geparkt“ – Ziel ist die Kategorie **Personal Sites and Blogs**.

Nach dem Deploy unter [Test A Site](https://urlfiltering.paloaltonetworks.com/) prüfen und bei Bedarf eine Neukategorisierung beantragen. Bei *Insufficient Content* geht kein Antrag; die Kategorie wird beim nächsten Crawl automatisch neu bewertet.

## Nicht in Suchmaschinen

- Jede Antwort sendet `X-Robots-Tag: noindex, nofollow, …`, das HTML zusätzlich `<meta name="robots" content="noindex, nofollow">`.
- Die `robots.txt` erlaubt das Crawlen **bewusst**: Suchmaschinen befolgen `noindex` nur, wenn sie die Seite abrufen dürfen. Mit `Disallow: /` könnten verlinkte URLs trotzdem (ohne Inhalt) im Index landen.

## Neue Domain hinzufügen

1. Die Zone muss im selben Cloudflare-Account liegen.
2. In [wrangler.jsonc](wrangler.jsonc) unter `routes` eintragen:
   ```jsonc
   { "pattern": "example.com", "custom_domain": true },
   { "pattern": "www.example.com", "custom_domain": true }
   ```
   `custom_domain` funktioniert nur, wenn der Hostname noch keinen A/AAAA/CNAME-Eintrag hat. Hängt die Domain z. B. noch an einem Pages-Projekt (proxied CNAME), stattdessen eine Route nutzen und den Eintrag stehen lassen:
   ```jsonc
   { "pattern": "example.com/*", "zone_name": "example.com" }
   ```
3. Inhalt in [src/sites.ts](src/sites.ts) eintragen (Überschrift, Untertitel, Einleitung, Karten, Inhaber, optional E-Mail):
   ```ts
   "example.com": {
   	title: "Familie Beispiel.",
   	subtitle: "Unser Zuhause im Netz.",
   	intro: "Ein paar echte Sätze darüber, wofür die Domain genutzt wird.",
   	cards: [{ icon: "mail", title: "E-Mail", text: "…" }],
   	owner: "Familie Beispiel",
   },
   ```
4. Push auf `main`. Für Custom Domains legt Cloudflare DNS-Einträge und Zertifikate selbst an.

## Entwicklung

```sh
npm install
npm run dev     # lokal, zeigt die erste Domain aus "routes"
npm run check   # TypeScript + Deploy-Dry-Run
```

Andere Domain lokal ansehen: `npx wrangler dev --local-upstream example.com`

## Deployment

Workers Builds führt bei jedem Push auf `main` `npx wrangler deploy` aus. Der `name` in [wrangler.jsonc](wrangler.jsonc) muss dem Worker-Namen im Cloudflare-Dashboard entsprechen.
