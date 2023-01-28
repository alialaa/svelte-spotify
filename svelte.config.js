import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: preprocess({
		scss: {
			prependData: '@use "src/styles/functions";@use "@unsass/breakpoint";'
		}
	}),

	kit: {
		adapter: adapter(),
		alias: {
			$components: 'src/lib/components',
			$assets: 'src/assets',
			$actions: 'src/lib/actions',
			$helpers: 'src/lib/helpers',
			$stores: 'src/lib/stores'
		}
	}
};

export default config;
