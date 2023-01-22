import { fetchRefresh } from '$helpers';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params, depends, route }) => {
	depends(`app:${route.id}`);
	const albumRes = await fetchRefresh(fetch, `/api/spotify/albums/${params.id}`);

	if (!albumRes.ok) {
		throw error(albumRes.status, 'Failed to load album!');
	}

	const albumJSON: SpotifyApi.SingleAlbumResponse = await albumRes.json();

	let color = null;
	if (albumJSON.images.length > 0) {
		const colorRes = await fetch(
			`/api/average-color?${new URLSearchParams({
				image: albumJSON.images[0].url
			}).toString()}`
		);
		if (colorRes.ok) {
			color = (await colorRes.json()).color;
		}
	}

	return {
		album: albumJSON,
		title: albumJSON.name,
		color
	};
};
