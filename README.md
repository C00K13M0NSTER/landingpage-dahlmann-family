# landingpage-dahlmann-family

Moderne Wartungsseite für **dahlmann.family** – als generischer Cloudflare Worker, der beliebig viele Domains bedienen kann.

- Ein Worker, mehrere Domains: Die Seite wird anhand des Hostnamens gerendert. Ohne weitere Konfiguration zeigt sie einfach den Domainnamen.
- Keine externen Ressourcen (keine Fonts, Skripte oder Tracker), ca. 3 KB gzip.
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
3. Optional Texte, Sprache, Akzentfarbe oder Kontakt-E-Mail in [src/sites.ts](src/sites.ts) überschreiben:
   ```ts
   "example.com": { badge: "Coming soon", message: "Something new is on its way.", lang: "en", accent: "#0ea5e9" },
   ```
4. Push auf `main`. Cloudflare legt DNS-Einträge und Zertifikate selbst an. Bestehende A/AAAA/CNAME-Einträge dieser Hostnamen werden dabei ersetzt.

## Entwicklung

```sh
npm install
npm run dev     # lokal, zeigt die erste Domain aus "routes"
npm run check   # TypeScript + Deploy-Dry-Run
```

Andere Domain lokal ansehen: `npx wrangler dev --local-upstream example.com`

## Deployment

Workers Builds führt bei jedem Push auf `main` `npx wrangler deploy` aus. Der `name` in [wrangler.jsonc](wrangler.jsonc) muss dem Worker-Namen im Cloudflare-Dashboard entsprechen.
