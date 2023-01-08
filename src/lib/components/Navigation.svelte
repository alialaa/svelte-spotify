<script lang="ts">
	import { Home, Search, ListMusic, type Icon } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import logo from '$assets/Spotify_Logo_RGB_White.png';
	import { page } from '$app/stores';

	export let desktop: boolean;

	const menuItems: { path: string; label: string; icon: ComponentType<Icon> }[] = [
		{
			path: '/',
			label: 'Home',
			icon: Home
		},
		{
			path: '/search',
			label: 'Search',
			icon: Search
		},
		{
			path: '/playlists',
			label: 'Playlists',
			icon: ListMusic
		}
	];
</script>

<div class="nav-content" class:desktop class:mobile={!desktop}>
	<nav aria-label="Main">
		<div class="nav-content-inner">
			<img src={logo} class="logo" alt="Spotify" width="100px" />
			<ul>
				{#each menuItems as item}
					<li class:active={item.path === $page.url.pathname}>
						<a href={item.path}>
							<svelte:component
								this={item.icon}
								focusable="false"
								aria-hidden="true"
								color="var(--text-color)"
								size={26}
								strokeWidth={2}
							/>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</nav>
</div>
