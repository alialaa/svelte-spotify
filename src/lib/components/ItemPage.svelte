<script lang="ts">
	import { Music } from 'lucide-svelte';

	export let color: string | null;
	export let image: string | undefined;
	export let title: string;
	export let type: string | undefined;
</script>

<div class="banner">
	<div class="cover">
		{#if image}
			<img src={image} alt={title} />
		{:else}
			<div class="cover-placeholder">
				<Music focusable="false" aria-hidden />
			</div>
		{/if}
	</div>
	<div class="info">
		{#if type} <p class="type">{type}</p>{/if}
		<h1 class="title">{title}</h1>
		<slot name="meta" />
	</div>
</div>
<div class="content">
	<slot />
</div>
