# landingpage-dahlmann-family

Schlichte Parkseite für **dahlmann.family** (Stil wie dhlmnn.de) – als generischer Cloudflare Worker, der beliebig viele Domains bedienen kann.

- Ein Worker, mehrere Domains: Jede Domain zeigt ihren Hostnamen und „Diese Domain ist geparkt.“ – ohne weitere Konfiguration.
- Inter wird selbst ausgeliefert, keine externen Ressourcen (keine Skripte, Tracker oder CDNs).
- `www.` leitet per 301 auf die Hauptdomain um.

Hinweis: URL-Filter wie Palo Alto ordnen solche Seiten der Kategorie **Parked** zu.

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
3. Optional Text oder Sprache in [src/sites.ts](src/sites.ts) überschreiben:
   ```ts
   "example.com": { message: "This domain is parked.", lang: "en" },
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
