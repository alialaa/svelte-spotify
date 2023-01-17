<script lang="ts">
	import { getCopyrightSymbol } from '$helpers';
	import { Album } from 'lucide-svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: album = data.album;
	$: console.log(album);
</script>

<h5>{album.album_type}</h5>
<h1>{album.name}</h1>

<div class="tracks">
	<ul>
		{#each album.tracks.items as track}
			<li>{track.name}</li>
		{/each}
	</ul>
</div>

<div class="credits">
	<p class="date">
		{new Date(album.release_date).toLocaleDateString('en', {
			dateStyle: 'medium'
		})}
	</p>
	{#each album.copyrights as copyright}
		<p class="copyright">
			{getCopyrightSymbol(copyright.type)}
			{copyright.text}
		</p>
	{/each}
</div>

<style lang="scss">
	.credits {
		margin-top: 40px;
		p {
			color: var(--light-gray);
			margin: 0;
			font-size: functions.toRem(11);
			&.date {
				font-size: functions.toRem(13);
			}
		}
	}
</style>
