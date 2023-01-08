<script lang="ts">
	import { Navigation } from '$components';
	import 'modern-normalize/modern-normalize.css';
	import '../styles/main.scss';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	$: user = data.user;
</script>

<div id="main">
	{#if user}
		<div id="sidebar">
			<Navigation desktop={true} />
		</div>
	{/if}
	<div id="content">
		<main id="main-content">
			<slot />
		</main>
	</div>
</div>

<style lang="scss">
	#main {
		display: flex;
		#content {
			flex: 1;
			main#main-content {
				padding: 30px 15px 60px;
				@include breakpoint.up('md') {
					padding: 30px 30px 60px;
				}
			}
		}
	}
</style>
