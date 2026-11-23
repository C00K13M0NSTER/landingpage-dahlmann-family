import type { Site } from "./sites";

const CSS = `
*,*::before,*::after{box-sizing:border-box}
:root{--bg:#09090b;--fg:#fafafa;--fg-fade:rgb(250 250 250/.55);--muted:#a1a1aa;--line:rgb(255 255 255/.08);--glass:rgb(255 255 255/.04);--glow:.4;--a2:var(--accent);--a3:var(--accent);color-scheme:dark}
@supports (color:oklch(from red l c h)){:root{--a2:oklch(from var(--accent) l c calc(h + 70));--a3:oklch(from var(--accent) l c calc(h - 70))}}
@media (prefers-color-scheme:light){:root{--bg:#fafafa;--fg:#09090b;--fg-fade:rgb(9 9 11/.6);--muted:#52525b;--line:rgb(0 0 0/.07);--glass:rgb(255 255 255/.6);--glow:.28;color-scheme:light}}
html{background:var(--bg);color:var(--fg)}
body{margin:0;min-height:100vh;min-height:100svh;display:grid;grid-template-rows:1fr auto;font:400 1rem/1.6 ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.bg{position:fixed;inset:0;z-index:-1;overflow:hidden;pointer-events:none}
.bg::before{content:"";position:absolute;inset:0;background:linear-gradient(var(--line) 1px,transparent 1px) 0 0/56px 56px,linear-gradient(90deg,var(--line) 1px,transparent 1px) 0 0/56px 56px;-webkit-mask:radial-gradient(ellipse 70% 60% at 50% 45%,#000 10%,transparent 70%);mask:radial-gradient(ellipse 70% 60% at 50% 45%,#000 10%,transparent 70%)}
.bg span{position:absolute;width:60vmax;aspect-ratio:1;border-radius:50%;opacity:var(--glow);animation:drift 24s ease-in-out infinite alternate}
.bg span:nth-child(1){top:-30vmax;left:-20vmax;background:radial-gradient(closest-side,var(--accent),transparent)}
.bg span:nth-child(2){right:-25vmax;bottom:-35vmax;background:radial-gradient(closest-side,var(--a2),transparent);animation-duration:30s;animation-direction:alternate-reverse}
.bg span:nth-child(3){top:45%;left:55%;width:40vmax;background:radial-gradient(closest-side,var(--a3),transparent);animation-duration:36s}
@keyframes drift{to{transform:translate(10vmax,6vmax) scale(1.15)}}
main{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4rem 1.5rem;text-align:center;animation:rise .9s cubic-bezier(.2,.8,.2,1) both}
@keyframes rise{from{opacity:0;transform:translateY(16px)}}
.badge{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 2rem;padding:.375rem .875rem .375rem .75rem;border:1px solid var(--line);border-radius:999px;background:var(--glass);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);color:var(--muted);font-size:.8125rem;font-weight:500;letter-spacing:.01em}
.dot{position:relative;width:.5rem;height:.5rem;border-radius:50%;background:#f59e0b}
.dot::after{content:"";position:absolute;inset:0;border-radius:inherit;background:inherit;animation:ping 2s cubic-bezier(0,0,.2,1) infinite}
@keyframes ping{75%,to{transform:scale(2.6);opacity:0}}
h1{margin:0;padding-bottom:.1em;background:linear-gradient(180deg,var(--fg) 35%,var(--fg-fade));-webkit-background-clip:text;background-clip:text;color:transparent;font-size:clamp(2.5rem,9.5vw,6.5rem);font-weight:700;line-height:1.05;letter-spacing:-.045em;overflow-wrap:anywhere}
h1 span{background:linear-gradient(100deg,var(--accent),var(--a2));-webkit-background-clip:text;background-clip:text}
.lead{max-width:32rem;margin:1.25rem 0 0;color:var(--muted);font-size:clamp(1.05rem,2.4vw,1.25rem);text-wrap:balance}
.progress{position:relative;width:11rem;height:2px;margin-top:2.75rem;overflow:hidden;border-radius:2px;background:var(--line)}
.progress::after{content:"";position:absolute;inset:0;width:40%;background:linear-gradient(90deg,transparent,var(--accent),var(--a2),transparent);animation:slide 2.2s ease-in-out infinite}
@keyframes slide{from{transform:translateX(-100%)}to{transform:translateX(250%)}}
.contact{margin-top:2.5rem;padding:.625rem 1.25rem;border:1px solid var(--line);border-radius:999px;background:var(--glass);color:var(--fg);font-size:.9375rem;font-weight:500;text-decoration:none;transition:border-color .2s,transform .2s}
.contact:hover{border-color:var(--accent);transform:translateY(-1px)}
.contact:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
footer{padding:1.5rem;color:var(--muted);font-size:.8125rem;text-align:center}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}
`;

export function renderPage(site: Site, nonce: string): string {
	const name = escapeHtml(site.name);
	const dot = site.name.indexOf(".");
	const wordmark =
		dot > 0 ? `${escapeHtml(site.name.slice(0, dot))}<wbr><span>${escapeHtml(site.name.slice(dot))}</span>` : name;
	const contact = site.email
		? `<a class="contact" href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a>`
		: "";

	return `<!doctype html>
<html lang="${escapeHtml(site.lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="color-scheme" content="dark light">
<meta name="theme-color" content="#09090b" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#fafafa" media="(prefers-color-scheme: light)">
<title>${name} · ${escapeHtml(site.badge)}</title>
<link rel="icon" href="${favicon(site)}">
<style nonce="${nonce}">:root{--accent:${site.accent}}${CSS}</style>
</head>
<body>
<div class="bg" aria-hidden="true"><span></span><span></span><span></span></div>
<main>
<p class="badge"><span class="dot"></span>${escapeHtml(site.badge)}</p>
<h1>${wordmark}</h1>
<p class="lead">${escapeHtml(site.message)}</p>
<div class="progress" aria-hidden="true"></div>
${contact}
</main>
<footer>© ${new Date().getFullYear()} ${name}</footer>
</body>
</html>`;
}

function favicon(site: Site): string {
	const letter = escapeHtml(site.name.charAt(0).toUpperCase());
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="${site.accent}"/><text x="32" y="44" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34" font-weight="700" fill="#fff">${letter}</text></svg>`;
	return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function escapeHtml(value: string): string {
	return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}
