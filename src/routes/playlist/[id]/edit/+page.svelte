<script lang="ts">
	import { PlaylistForm } from '$components';
	import type { ActionData, PageData } from './$types';

	export let form: ActionData;
	export let data: PageData;

	$: playlist = data.playlist;
</script>

<h2>{data.title}</h2>

<PlaylistForm {form} {playlist} action="?redirect" />
