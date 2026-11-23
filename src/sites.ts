export interface Site {
	/** Shown top left and in the page title. */
	name: string;
	/** Status label top right. */
	status: string;
	/** Text wrapped in *asterisks* is set in italics. */
	headline: string;
	message: string;
	/** Rendered as mailto link when set. */
	email?: string;
	accent: `#${string}`;
	lang: string;
}

const DEFAULTS: Omit<Site, "name"> = {
	status: "Wartungsarbeiten",
	headline: "Hier wird gerade *gebaut.*",
	message: "Schau bald wieder vorbei.",
	accent: "#c8471c",
	lang: "de",
};

// Per-domain overrides. Domains without an entry use DEFAULTS and show their hostname.
const SITES: Record<string, Partial<Site>> = {
	// "example.com": { status: "Maintenance", headline: "Something new is *coming.*", message: "Check back soon.", lang: "en" },
};

export function resolveSite(hostname: string): Site {
	return { ...DEFAULTS, name: hostname, ...SITES[hostname] };
}
