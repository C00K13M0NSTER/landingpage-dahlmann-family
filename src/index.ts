import { renderPage } from "./page";
import { resolveSite } from "./sites";

// Crawling stays allowed on purpose: search engines only drop pages they can fetch and see "noindex" on.
const ROBOTS_TXT = "User-agent: *\nAllow: /\n";

const BASE_HEADERS = {
	"X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex",
	"X-Content-Type-Options": "nosniff",
	"Referrer-Policy": "no-referrer",
	"Strict-Transport-Security": "max-age=31536000",
	"Cache-Control": "no-store",
};

export default {
	fetch(request) {
		if (request.method !== "GET" && request.method !== "HEAD") {
			return respond(null, 405, { Allow: "GET, HEAD" });
		}

		const url = new URL(request.url);

		if (url.hostname.startsWith("www.")) {
			url.hostname = url.hostname.slice(4);
			url.protocol = "https:";
			return respond(null, 301, { Location: url.href });
		}

		if (url.pathname === "/robots.txt") {
			return respond(ROBOTS_TXT, 200, { "Content-Type": "text/plain; charset=utf-8" });
		}

		const nonce = crypto.randomUUID();
		// 503 marks the page as temporarily unavailable, an additional signal against indexing.
		return respond(renderPage(resolveSite(url.hostname), nonce), 503, {
			"Content-Type": "text/html; charset=utf-8",
			"Content-Security-Policy": `default-src 'none'; style-src 'nonce-${nonce}'; img-src data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`,
			"Retry-After": "86400",
		});
	},
} satisfies ExportedHandler;

function respond(body: string | null, status: number, headers: Record<string, string>): Response {
	return new Response(body, { status, headers: { ...BASE_HEADERS, ...headers } });
}
