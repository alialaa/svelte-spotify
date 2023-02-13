<script lang="ts">
	import { Music } from 'lucide-svelte';

	type AlbumType = SpotifyApi.AlbumObjectFull | SpotifyApi.AlbumObjectSimplified;
	type PlaylistType = SpotifyApi.PlaylistObjectFull | SpotifyApi.PlaylistObjectSimplified;
	type ArtistType = SpotifyApi.ArtistObjectFull;

	export let item: AlbumType | PlaylistType | ArtistType;

	const followersFormat = Intl.NumberFormat('en', { notation: 'compact' });
</script>

<div class="card {item.type}">
	{#if item.images.length > 0}
		<img loading="lazy" src={item.images[0].url} alt="{item.type} cover for {item.name}" />
	{:else}
		<div class="cover-placeholder">
			<Music aria-hidden="true" focusable="false" color="var(--light-gray)" />
		</div>
	{/if}
	<h4 class="truncate-1"><a href="/{item.type}/{item.id}" title={item.name}>{item.name}</a></h4>
	{#if item.type === 'album'}
		<p class="truncate-1">{item.artists.map((item) => item.name).join(', ')}</p>
	{/if}
	{#if item.type === 'playlist'}
		<p class="truncate-2">{item.description}</p>
	{/if}
	{#if item.type === 'artist'}
		<p class="truncate-1">{followersFormat.format(item.followers.total)} Followers</p>
	{/if}
</div>

<style lang="scss">
	.card {
		background-color: var(--dark-gray);
		padding: 10px;
		box-shadow: 0 0 40px rgba(0, 0, 0, 0.4);
		border-radius: 4px;
		transition: background 0.3s;
		position: relative;
		&.artist {
			text-align: center;
			padding: 30px 20px;
			img,
			.cover-placeholder {
				width: 150px;
				max-width: 100%;
				border-radius: 100%;
				box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
			}
			h4 {
				margin: 0;
				text-align: center;
				font-size: functions.toRem(18);
				margin-bottom: 0.5em;
			}
			p {
				margin: 0;
			}
		}
		&:hover {
			background-color: var(--medium-gray);
			.cover-placeholder {
				background-color: var(--dark-gray);
			}
		}
		h4 {
			margin: 0 0 10px;
			font-size: functions.toRem(16);
			font-weight: 600;
			line-height: 1;
			a {
				text-decoration: none;
				color: var(--text-color);
				&:focus-visible {
					outline: none;
					&:after {
						outline: 2px solid var(--accent-color);
					}
				}
				&:after {
					content: '';
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					border-radius: 4px;
				}
			}
		}
		p {
			position: relative;
			margin: 0;
			color: var(--light-gray);
			font-size: functions.toRem(14);
		}
		img {
			width: 100%;
			aspect-ratio: 1;
			object-fit: cover;
			margin: 0 0 20px;
		}
		.cover-placeholder {
			width: 100%;
			aspect-ratio: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: var(--medium-gray);
			margin: 0 0 20px;
			transition: background 0.3s;
			:global(svg) {
				width: 40%;
				height: 40%;
			}
		}
	}
</style>
