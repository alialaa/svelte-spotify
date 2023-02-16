<script lang="ts" context="module">
	let current: HTMLAudioElement;
</script>

<script lang="ts">
	import { Pause, Play } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	type Track = SpotifyApi.TrackObjectFull | SpotifyApi.TrackObjectSimplified;
	export let track: Track;
	export let tabIndex: number | undefined = undefined;

	const dispatch = createEventDispatcher<{
		play: { track: Track };
		pause: { track: Track };
	}>();

	let audio: HTMLAudioElement;
	let paused = true;

	function onPlay() {
		if (current && current !== audio) {
			current.currentTime = 0;
			current.pause();
		}
		current = audio;
		dispatch('play', { track });
	}
	function onPause() {
		dispatch('pause', { track });
	}
</script>

<div class="player">
	<audio
		on:play={onPlay}
		on:pause={onPause}
		bind:this={audio}
		bind:paused
		controls
		src={track.preview_url}
		preload="none"
	/>
	<button
		tabindex={tabIndex}
		aria-label={paused ? `Play ${track.name}` : `Pause ${track.name}`}
		on:click={() => {
			if (paused) {
				audio.play();
			} else {
				audio.pause();
			}
		}}
	>
		{#if paused}
			<Play color="var(--text-color)" focusable="false" aria-hidden />
		{:else}
			<Pause color="var(--text-color)" focusable="false" aria-hidden />
		{/if}
	</button>
</div>

<style lang="scss">
	.player {
		audio {
			display: none;
			:global(html.no-js) & {
				display: block;
				width: 100%;
			}
		}
		button {
			width: 12px;
			height: 12px;
			padding: 0;
			background: none;
			border: none;
			cursor: pointer;
			:global(svg) {
				fill: var(--text-color);
				width: 12px;
				height: 12px;
				vertical-align: middle;
			}
			:global(html.no-js) & {
				display: none;
			}
		}
	}
</style>
