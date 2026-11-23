# landingpage-dahlmann-family

Schlichte, typografische Wartungsseite für **dahlmann.family** – als generischer Cloudflare Worker, der beliebig viele Domains bedienen kann.

- Ein Worker, mehrere Domains: Die Seite wird anhand des Hostnamens gerendert. Ohne weitere Konfiguration steht oben einfach der Domainname.
- Nur Systemschriften (Serif + Mono), keine externen Ressourcen (keine Webfonts, Skripte oder Tracker).
- Dark/Light Mode, responsive, respektiert `prefers-reduced-motion`.
- `www.` leitet per 301 auf die Hauptdomain um.

## Nicht in Suchmaschinen

- Jede Antwort sendet `X-Robots-Tag: noindex, nofollow, …`, das HTML zusätzlich `<meta name="robots" content="noindex, nofollow">`.
- Die Seite antwortet mit `503 Service Unavailable` + `Retry-After` (Wartungsmodus). Solche Seiten werden nicht indexiert.
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
3. Optional Status, Überschrift (`*kursiv*` möglich), Text, Sprache, Akzentfarbe oder Kontakt-E-Mail in [src/sites.ts](src/sites.ts) überschreiben:
   ```ts
   "example.com": { status: "Maintenance", headline: "Something new is *coming.*", message: "Check back soon.", lang: "en" },
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
