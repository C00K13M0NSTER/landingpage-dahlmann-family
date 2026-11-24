export type Icon = "mail" | "code" | "lock";

export interface Site {
	/** Shown in the top bar. */
	name: string;
	/** Hero headline; the subtitle follows in grey. */
	title: string;
	subtitle: string;
	intro: string;
	cards: { icon: Icon; title: string; text: string }[];
	/** Page title and footer. */
	owner: string;
	/** Rendered as mailto link in the footer when set. */
	email?: string;
	lang: string;
}

const DEFAULTS: Omit<Site, "name" | "title" | "owner"> = {
	subtitle: "Eine private Domain.",
	intro: "Diese Domain wird privat genutzt, zum Beispiel für E-Mail.",
	cards: [],
	lang: "de",
};

// Per-domain content. Keep it real: URL filters like Palo Alto block pages without content ("insufficient content") and placeholders ("parked").
const SITES: Record<string, Partial<Site>> = {
	"dahlmann.family": {
		title: "Familie Dahlmann.",
		subtitle: "Unser Zuhause im Netz.",
		intro:
			"Unter dahlmann.family laufen unsere privaten E-Mail-Adressen und ein paar kleine Projekte, die wir selbst bauen. Was die Familie betrifft, bleibt in der Familie – öffentlich ist nur diese Seite.",
		cards: [
			{ icon: "mail", title: "E-Mail", text: "Unsere Postfächer laufen über die eigene Domain. So bleiben die Adressen gleich, egal bei welchem Anbieter." },
			{ icon: "code", title: "Projekte", text: "Kleine Web-Apps und Experimente, gebaut für den Familienalltag und aus Spaß am Basteln." },
			{ icon: "lock", title: "Privat", text: "Fotos, Termine und alles Persönliche teilen wir nur untereinander – nicht hier." },
		],
		owner: "Familie Dahlmann",
	},
};

export function resolveSite(hostname: string): Site {
	return { ...DEFAULTS, name: hostname, title: hostname, owner: hostname, ...SITES[hostname] };
}
