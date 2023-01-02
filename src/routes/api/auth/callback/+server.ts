import type { RequestHandler } from './$types';

export const GET: RequestHandler = (event) => {
	console.log(event);
};
