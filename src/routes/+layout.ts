import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ data, url }) => {
	const { user, userAllPlaylists } = data || {};
	if (user && url.pathname === '/login') {
		throw redirect(307, '/');
	}
	if (!user && url.pathname !== '/login') {
		throw redirect(307, '/login');
	}

	return {
		user,
		userAllPlaylists
	};
};
