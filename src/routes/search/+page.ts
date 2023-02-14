import { fetchRefresh } from '$helpers';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const catsRes = await fetchRefresh(fetch, `/api/spotify/browse/categories?limit=50`);
	return {
		title: 'Search',
		categories: catsRes.ok
			? (catsRes.json() as Promise<SpotifyApi.MultipleCategoriesResponse>)
			: undefined
	};
};
