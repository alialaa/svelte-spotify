import type { LayoutServerLoad } from './$types';
import { SPOTIFY_BASE_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ cookies, fetch, url }) => {
	const accessToken = cookies.get('access_token');
	const refreshToken = cookies.get('refresh_token');
	if (!accessToken) {
		return {
			user: null
		};
	}

	const profileRes = await fetch(`${SPOTIFY_BASE_URL}/me`, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
	if (profileRes.ok) {
		const profile: SpotifyApi.CurrentUsersProfileResponse = await profileRes.json();
		let userAllPlaylists: SpotifyApi.PlaylistObjectSimplified[] = [];
		const userPlaylistsRes = await fetch('/api/spotify/me/playlists?limit=50');
		if (userPlaylistsRes.ok) {
			const userPlaylistsResJSON: SpotifyApi.ListOfCurrentUsersPlaylistsResponse =
				await userPlaylistsRes.json();
			userAllPlaylists = userPlaylistsResJSON.items;
		}
		return {
			user: profile,
			userAllPlaylists
		};
	}
	if (profileRes.status === 401 && refreshToken) {
		// refresh the token and try again
		const refreshRes = await fetch('/api/auth/refresh');
		if (refreshRes.ok) {
			throw redirect(307, url.pathname);
		}
		return {
			user: null
		};
	} else {
		return {
			user: null
		};
	}
};
