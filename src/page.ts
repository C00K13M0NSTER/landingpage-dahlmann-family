import type { Icon, Site } from "./sites";

export const FONT_PATH = "/fonts/inter-latin.woff2";

const CSS = `
@font-face{font-family:Inter;src:url(${FONT_PATH}) format("woff2");font-weight:100 900;font-display:swap}
*,*::before,*::after{box-sizing:border-box}
:root{--paper:#000;--surf:#1d1d1f;--ink:#f5f5f7;--mut:#86868b;--acc:#2997ff;color-scheme:dark}
html{background:var(--paper);color:var(--ink)}
body{margin:0;min-height:100vh;min-height:100svh;display:flex;flex-direction:column;font:400 17px/1.47 Inter,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;letter-spacing:-.01em;-webkit-font-smoothing:antialiased}
::selection{background:var(--acc);color:#fff}
a{color:var(--acc);text-decoration:none}
a:hover{text-decoration:underline}
.wrap{width:min(100% - 44px,980px);margin-inline:auto}
header{border-bottom:1px solid var(--surf)}
header .wrap{display:flex;align-items:center;height:48px;font-size:14px;font-weight:600;letter-spacing:-.016em}
main{flex:1;padding:clamp(72px,15vh,160px) 0 clamp(64px,11vh,128px)}
.hero{text-align:center;animation:settle 1s cubic-bezier(.2,.8,.2,1) both}
h1{margin:0;font-size:clamp(40px,6.4vw,80px);font-weight:600;line-height:1.05;letter-spacing:-.032em;text-wrap:balance}
h1 span{display:block;color:var(--mut)}
.intro{max-width:31em;margin:28px auto 0;color:var(--mut);font-size:clamp(17px,1.8vw,21px);line-height:1.42;letter-spacing:.004em;text-wrap:pretty}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:16px;margin:clamp(64px,10vh,112px) 0 0;padding:0;list-style:none;animation:settle 1s .12s cubic-bezier(.2,.8,.2,1) both}
.cards li{padding:28px 28px 32px;border-radius:18px;background:var(--surf)}
.ico{display:grid;place-items:center;width:32px;height:32px;border-radius:8px;color:#fff}
.ico svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.i-mail{background:#0a84ff}
.i-code{background:#ff9f0a}
.i-lock{background:#30d158}
.cards h2{margin:20px 0 6px;font-size:21px;font-weight:600;line-height:1.19;letter-spacing:-.016em}
.cards p{margin:0;color:var(--mut)}
footer{border-top:1px solid var(--surf)}
footer .wrap{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px 24px;padding:18px 0 26px;color:var(--mut);font-size:12px}
@keyframes settle{from{opacity:0;transform:translateY(14px)}}
@media (prefers-reduced-motion:reduce){.hero,.cards{animation:none}}
`;

const ICONS: Record<Icon, string> = {
	mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
	code: '<path d="m9 8-4 4 4 4m6-8 4 4-4 4"/>',
	lock: '<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
};

export function renderPage(site: Site, nonce: string): string {
	const cards = site.cards
		.map(
			(card) =>
				`<li><span class="ico i-${card.icon}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[card.icon]}</svg></span><h2>${escapeHtml(card.title)}</h2><p>${escapeHtml(card.text)}</p></li>`,
		)
		.join("");
	const contact = site.email ? `<a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a>` : "";

	return `<!doctype html>
<html lang="${escapeHtml(site.lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#000000">
<meta name="description" content="${escapeHtml(site.intro)}">
<title>${escapeHtml(site.owner)}</title>
<link rel="preload" href="${FONT_PATH}" as="font" type="font/woff2" crossorigin>
<link rel="icon" href="${favicon(site)}">
<style nonce="${nonce}">${CSS}</style>
</head>
<body>
<header><div class="wrap">${escapeHtml(site.name)}</div></header>
<main class="wrap">
<section class="hero">
<h1>${escapeHtml(site.title)} <span>${escapeHtml(site.subtitle)}</span></h1>
<p class="intro">${escapeHtml(site.intro)}</p>
</section>
${cards && `<ul class="cards">${cards}</ul>`}
</main>
<footer><div class="wrap"><span>© ${new Date().getFullYear()} ${escapeHtml(site.owner)}</span>${contact}</div></footer>
</body>
</html>`;
}

function favicon(site: Site): string {
	const letter = escapeHtml(site.name.charAt(0));
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" rx="3.5" fill="#1d1d1f"/><text x="8" y="12" text-anchor="middle" font-family="Segoe UI,Helvetica,Arial,sans-serif" font-size="12" font-weight="700" fill="#f5f5f7">${letter}</text></svg>`;
	return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function escapeHtml(value: string): string {
	return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}
