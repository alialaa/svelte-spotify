import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
	return ['section', 'category', 'artist', 'profile'].includes(param);
};
