import { fetchRefresh } from '$helpers';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch: _fetch, url, depends, route }) => {
	const fetch = (path: string) => fetchRefresh(_fetch, path);

	depends(`app:${route.id}`);

	const { list, rest } = params;
	const limit = 18;
	const page = url.searchParams.get('page');

	const searchParams = new URLSearchParams({
		limit: `${limit}`,
		offset: page ? `${limit * (Number(page) - 1)}` : '0'
	}).toString();

	let request;
	let title;

	if (list === 'section' && rest === 'new-releases') {
		request = fetch(`/api/spotify/browse/new-releases?${searchParams}`);
		title = 'New Releases';
	} else if (list === 'section' && rest === 'featured-playlists') {
		request = fetch(`/api/spotify/browse/featured-playlists?${searchParams}`);
		title = 'Featured Playlists';
	}

	if (!request) {
		throw error(404, 'Page Not Found!');
	}

	const res = await request;

	if (!res.ok) {
		throw error(res.status, 'Failed to Load Data!');
	}

	const resJSON: SpotifyApi.ListOfNewReleasesResponse | SpotifyApi.ListOfFeaturedPlaylistsResponse =
		await res.json();

	const getData = () => {
		if ('playlists' in resJSON) return resJSON.playlists;
		if ('albums' in resJSON) return resJSON.albums;
	};

	return {
		data: getData(),
		title
	};
};
