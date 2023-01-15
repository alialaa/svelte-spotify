// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Error {}
	// interface Locals {}
	interface PageData {
		user: SpotifyApi.CurrentUsersProfileResponse | null;
		title?: string;
	}
	// interface Platform {}
}

declare interface Window {
	refreshPromise: Promise<Response> | null;
}
