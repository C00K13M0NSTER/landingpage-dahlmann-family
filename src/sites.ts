export interface Site {
	/** Headline and page title. */
	name: string;
	/** Status pill above the headline. */
	badge: string;
	message: string;
	/** Rendered as mailto button when set. */
	email?: string;
	/** Base color of all gradients; the other hues are derived from it. */
	accent: `#${string}`;
	lang: string;
}

const DEFAULTS: Omit<Site, "name"> = {
	badge: "Wartungsarbeiten",
	message: "Hier wird gerade gebaut. Schau bald wieder vorbei.",
	accent: "#8b5cf6",
	lang: "de",
};

// Per-domain overrides. Domains without an entry use DEFAULTS and show their hostname as headline.
const SITES: Record<string, Partial<Site>> = {
	// "example.com": { badge: "Coming soon", message: "Something new is on its way.", lang: "en", accent: "#0ea5e9" },
};

export function resolveSite(hostname: string): Site {
	return { ...DEFAULTS, name: hostname, ...SITES[hostname] };
}
