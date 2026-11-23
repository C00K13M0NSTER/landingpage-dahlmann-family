import type { Site } from "./sites";

const CSS = `
*,*::before,*::after{box-sizing:border-box}
:root{--paper:#f2efe9;--ink:#1a1917;--muted:#6f6a62;--rule:rgb(26 25 23/.18);--display:ui-serif,"Iowan Old Style","Sitka Banner",Charter,Georgia,serif;--text:ui-serif,"Iowan Old Style","Sitka Text",Charter,Georgia,serif;--mono:ui-monospace,"SF Mono","Cascadia Mono","Segoe UI Mono",Menlo,Consolas,monospace;--pad:clamp(1.25rem,4vw,3rem);color-scheme:light}
@media (prefers-color-scheme:dark){:root{--paper:#151412;--ink:#ebe7df;--muted:#9a948a;--rule:rgb(235 231 223/.16);color-scheme:dark}}
html{background:var(--paper);color:var(--ink)}
body{margin:0;min-height:100vh;min-height:100svh;display:grid;grid-template-rows:auto 1fr auto;padding:0 var(--pad);font:1.125rem/1.5 var(--text);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
::selection{background:var(--accent);color:var(--paper)}
header,footer{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:.5rem 2rem;font:.75rem/1.4 var(--mono);letter-spacing:.08em;text-transform:uppercase}
header{padding:var(--pad) 0 .875rem;border-bottom:1px solid var(--rule)}
footer{padding:.875rem 0 var(--pad);border-top:1px solid var(--rule);color:var(--muted)}
footer a{text-transform:none;letter-spacing:0}
.status{display:inline-flex;align-items:center;gap:.625rem}
.mark{width:.75rem;height:.75rem;border:1px solid var(--accent);background:repeating-linear-gradient(-45deg,var(--accent) 0 1px,transparent 1px 3px);animation:work 1.6s linear infinite}
@keyframes work{to{background-position:4.243px 0}}
main{display:grid;align-content:end;justify-items:start;padding:clamp(5rem,16vh,12rem) 0 clamp(2rem,7vh,4.5rem)}
h1{margin:0;font:clamp(3.5rem,11vw + 1rem,11rem)/.95 var(--display);letter-spacing:-.025em;text-wrap:balance}
h1 em{color:var(--accent)}
main p{max-width:30ch;margin:1.75rem 0 0;color:var(--muted);font-size:clamp(1.125rem,1.6vw,1.375rem)}
a{color:inherit;text-decoration-color:var(--accent);text-decoration-thickness:1px;text-underline-offset:.2em}
a:hover{color:var(--accent)}
@media (prefers-reduced-motion:reduce){.mark{animation:none}}
`;

export function renderPage(site: Site, nonce: string): string {
	const name = escapeHtml(site.name);
	const headline = escapeHtml(site.headline).replace(/\*(.+?)\*/g, "<em>$1</em>");
	const contact = site.email ? `<a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a>` : "";

	return `<!doctype html>
<html lang="${escapeHtml(site.lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#f2efe9" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#151412" media="(prefers-color-scheme: dark)">
<title>${name} – ${escapeHtml(site.status)}</title>
<link rel="icon" href="${favicon(site)}">
<style nonce="${nonce}">:root{--accent:${site.accent}}${CSS}</style>
</head>
<body>
<header>
<span>${name}</span>
<span class="status"><span class="mark" aria-hidden="true"></span>${escapeHtml(site.status)}</span>
</header>
<main>
<h1>${headline}</h1>
<p>${escapeHtml(site.message)}</p>
</main>
<footer>
<span>© ${new Date().getFullYear()}</span>
${contact}
</footer>
</body>
</html>`;
}

function favicon(site: Site): string {
	const letter = escapeHtml(site.name.charAt(0));
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${site.accent}"/><text x="32" y="48" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="48" fill="#f2efe9">${letter}</text></svg>`;
	return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function escapeHtml(value: string): string {
	return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}
