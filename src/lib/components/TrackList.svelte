<script lang="ts">
	import { Button, Player } from '$components';
	import { getGridPosition, gridNavigation, msToTime } from '$helpers';
	import { Clock8, ListPlus, ListX } from 'lucide-svelte';
	import playingGif from '$assets/playing.gif';
	import { tippy } from '$actions';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { toasts } from '$stores';
	import { hideAll } from 'tippy.js';
	import { invalidate } from '$app/navigation';
	import { onMount, tick } from 'svelte';

	export let tracks: SpotifyApi.TrackObjectFull[] | SpotifyApi.TrackObjectSimplified[];
	export let isOwner: boolean = false;
	export let userPlaylists: SpotifyApi.PlaylistObjectSimplified[] | undefined;
	export let title: string;
	export let total: number;

	let currentlyPlaying: string | null = null;
	let isPaused: boolean = false;
	let isAddingToPlaylist: string[] = [];
	let isRemovingFromPlaylist: string[] = [];

	let js = false;
	let prevTrackLength = tracks.length;
	let gridRef: HTMLElement | null = null;
	let currentPosition: [number, number, number] | null = null;

	$: gridNavigate = gridNavigation(gridRef, currentPosition, tracks.length);
	$: {
		// if more tracks are loaded, focus back on tracks
		if (prevTrackLength < tracks.length) {
			// focus on first item in the new page
			currentPosition = [prevTrackLength + 2, 1, 1];
		}
		prevTrackLength = tracks.length;
	}

	function handleKeyDown(e: KeyboardEvent) {
		const newPosition = getGridPosition(e, gridNavigate, currentPosition);
		if (newPosition) currentPosition = newPosition;
	}
	$: getSelectableTabIndex = (row: number, column: number, index: number) => {
		if (!js) return undefined;
		if (
			currentPosition &&
			currentPosition[0] === row &&
			currentPosition[1] === column &&
			currentPosition[2] === index
		) {
			return 0;
		}
		return -1;
	};
	$: {
		const focusCurrentSelectable = async () => {
			if (currentPosition && gridRef) {
				await tick();
				const column = gridRef.querySelector(
					`[data-row="${currentPosition[0]}"][data-column="${currentPosition[1]}"]`
				);
				const selectables: NodeListOf<HTMLAnchorElement | HTMLButtonElement> | undefined =
					column?.querySelectorAll('a:not(.not-selectable),button:not(.not-selectable)');
				console.log(selectables);
				if (selectables) {
					selectables[currentPosition[2] - 1].focus();
				}
			}
		};
		focusCurrentSelectable();
	}

	onMount(() => {
		js = true;
	});
</script>

<div
	class="tracks"
	role="grid"
	aria-label={title}
	aria-rowcount={total + 1}
	aria-colcount={5}
	tabindex={js ? 0 : undefined}
	bind:this={gridRef}
	on:keydown={handleKeyDown}
>
	<div class="row header" role="row" aria-rowindex={1}>
		<div class="number-column" role="columnheader" aria-colindex={1} data-row={1}>
			<span class="number">#</span>
		</div>
		<div class="info-column" role="columnheader" aria-colindex={2} data-row={1}>
			<span class="track-title">Title</span>
		</div>
		<div class="duration-column" role="columnheader" aria-colindex={3} data-row={1}>
			<Clock8 aria-hidden focusable="false" color="var(--light-gray)" />
		</div>
		<div
			class="actions-column"
			class:is-owner={isOwner}
			role="columnheader"
			aria-colindex={4}
			data-row={1}
		/>
	</div>
	{#each tracks as track, index}
		<div
			class="row"
			class:is-current={currentlyPlaying === track.id}
			role="row"
			aria-rowindex={index + 2}
			aria-selected={currentPosition && currentPosition[0] === index + 2 ? 'true' : 'false'}
		>
			<div
				class="number-column"
				role="gridcell"
				aria-colindex={1}
				data-column={1}
				data-row={index + 2}
			>
				{#if currentlyPlaying === track.id && !isPaused}
					<img class="playing-gif" src={playingGif} alt="" />
				{:else}
					<span class="number">{index + 1}</span>
				{/if}
				<div class="player">
					<Player
						tabIndex={getSelectableTabIndex(index + 2, 1, 1)}
						{track}
						on:play={(e) => {
							currentlyPlaying = e.detail.track.id;
							isPaused = false;
						}}
						on:pause={(e) => {
							isPaused = e.detail.track.id === currentlyPlaying;
						}}
					/>
				</div>
			</div>
			<div
				class="info-column"
				role="gridcell"
				aria-colindex={2}
				data-column={2}
				data-row={index + 2}
			>
				<div class="track-title">
					<h4>{track.name}</h4>
					{#if track.explicit}
						<span class="explicit">Explicit</span>
					{/if}
				</div>
				<p class="artists">
					{#each track.artists as artist, artistIndex}
						<a
							href="/artist/{artist.id}"
							tabindex={getSelectableTabIndex(index + 2, 2, artistIndex + 1)}>{artist.name}</a
						>{#if artistIndex < track.artists.length - 1}{', '}{/if}
					{/each}
				</p>
			</div>
			<div
				class="duration-column"
				role="gridcell"
				aria-colindex={3}
				data-column={3}
				data-row={index + 2}
			>
				<span class="duration">{msToTime(track.duration_ms)}</span>
			</div>
			<div
				class="actions-column"
				class:is-owner={isOwner}
				role="gridcell"
				aria-colindex={4}
				data-column={4}
				data-row={index + 2}
			>
				{#if isOwner}
					<form
						method="POST"
						action="/playlist/{$page.params.id}?/removeItem"
						use:enhance={({ cancel }) => {
							if (isRemovingFromPlaylist.includes(track.id)) {
								cancel();
							}
							isRemovingFromPlaylist = [...isRemovingFromPlaylist, track.id];
							return ({ result }) => {
								if (result.type === 'error') {
									toasts.error(result.error.message);
								}
								if (result.type === 'redirect') {
									const url = new URL(`${$page.url.origin}${result.location}`);
									const error = url.searchParams.get('error');
									const success = url.searchParams.get('success');
									if (error) {
										toasts.error(error);
									}
									if (success) {
										toasts.success(success);
										invalidate(`/api/spotify/playlists/${$page.params.id}`);
									}
								}
								isRemovingFromPlaylist = isRemovingFromPlaylist.filter((t) => t !== track.id);
							};
						}}
					>
						<input hidden name="track" value={track.id} />
						<button
							tabindex={getSelectableTabIndex(index + 2, 4, 1)}
							type="submit"
							title="Remove {track.name} from playlist"
							aria-label="Remove {track.name} from playlist"
							class="remove-pl-button"
							disabled={isRemovingFromPlaylist.includes(track.id)}
						>
							<ListX aria-hidden focusable="false" />
						</button>
					</form>
				{:else}
					<button
						tabindex={getSelectableTabIndex(index + 2, 4, 1)}
						title="Add {track.name} to a playlist"
						aria-label="Add {track.name} to a playlist"
						class="add-pl-button"
						disabled={!userPlaylists}
						use:tippy={{
							content: document.getElementById(`${track.id}-playlists-menu`) || undefined,
							allowHTML: true,
							trigger: 'click',
							interactive: true,
							theme: 'menu',
							placement: 'bottom-end',
							onMount: () => {
								const template = document.getElementById(`${track.id}-playlists-menu`);
								if (template) {
									template.style.display = 'block';
								}
							}
						}}
					>
						<ListPlus aria-hidden focusable="false" />
					</button>
					{#if userPlaylists}
						<div class="playlists-menu" id="{track.id}-playlists-menu" style="display: none;">
							<div class="playlists-menu-content">
								<form
									method="POST"
									action="/playlist?/addItem&redirect={$page.url.pathname}"
									use:enhance={({ cancel }) => {
										if (isAddingToPlaylist.includes(track.id)) {
											cancel();
										}
										isAddingToPlaylist = [...isAddingToPlaylist, track.id];
										return ({ result }) => {
											if (result.type === 'error') {
												toasts.error(result.error.message);
											}
											if (result.type === 'redirect') {
												const url = new URL(`${$page.url.origin}${result.location}`);
												const error = url.searchParams.get('error');
												const success = url.searchParams.get('success');
												if (error) {
													toasts.error(error);
												}
												if (success) {
													toasts.success(success);
													hideAll();
												}
											}
											isAddingToPlaylist = isAddingToPlaylist.filter((t) => t !== track.id);
										};
									}}
								>
									<input hidden value={track.id} name="track" />
									<div class="field">
										<select aria-label="Playlist" name="playlist">
											{#each userPlaylists as playlist}
												<option value={playlist.id}>{playlist.name}</option>
											{/each}
										</select>
									</div>
									<div class="submit-button">
										<Button
											disabled={isAddingToPlaylist.includes(track.id)}
											element="button"
											type="submit"
											className="not-selectable"
										>
											Add <span class="visually-hidden"> {track.name} to selected playlist.</span>
										</Button>
									</div>
								</form>
							</div>
						</div>
					{/if}
				{/if}
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.tracks {
		&:focus {
			outline: 2px solid var(--accent-color);
		}
		.row {
			display: flex;
			align-items: center;
			padding: 7px 5px;
			border-radius: 4px;
			&[aria-selected='true'] {
				background-color: rgba(255, 255, 255, 0.3);
				outline: 1px solid #fff;
			}
			@include breakpoint.down('md') {
				:global(.no-js) & {
					flex-direction: column;
					background-color: rgba(255, 255, 255, 0.03);
					padding: 20px;
					margin-bottom: 20px;
				}
			}
			&.is-current {
				.info-column .track-title h4,
				.number-column span.number {
					color: var(--accent-color);
				}
			}
			&.header {
				border-bottom: 1px solid var(--border);
				border-radius: 0px;
				padding: 5px;
				margin-bottom: 15px;
				@include breakpoint.down('md') {
					:global(.no-js) & {
						display: none;
					}
				}
				.track-title {
					color: var(--light-gray);
					font-size: functions.toRem(12);
					text-transform: uppercase;
				}
				.duration-column :global(svg) {
					width: 16px;
					height: 16px;
				}
			}
			&:not(.header) {
				&:not([aria-selected='true']):hover {
					background-color: rgba(255, 255, 255, 0.05);
				}
				&:hover,
				&[aria-selected='true'] {
					background-color: rgba(255, 255, 255, 0.05);
					.number-column {
						.player {
							display: block;
						}
						span.number {
							display: none;
							:global(.no-js) & {
								display: block;
							}
						}
						.playing-gif {
							display: none;
						}
					}
				}
			}
			.number-column {
				width: 30px;
				display: flex;
				justify-content: flex-end;
				margin-right: 15px;
				span.number {
					color: var(--light-gray);
					font-size: functions.toRem(14);
				}
				.playing-gif {
					width: 12px;
				}
				.player {
					display: none;
				}
				:global(html.no-js) & {
					width: 200px;
					display: flex;
					align-items: center;
					@include breakpoint.down('md') {
						width: 100%;
						margin-right: 0;
						margin-bottom: 15px;
					}
					.player {
						display: block;
						width: 100%;
						margin-left: 10px;
					}
				}
			}
			.info-column {
				flex: 1;
				@include breakpoint.down('md') {
					:global(.no-js) & {
						width: 100%;
					}
				}
				.track-title {
					display: flex;
					align-items: center;
					h4 {
						margin: 0;
						font-size: functions.toRem(15);
						font-weight: 400;
						line-height: 1;
					}
					span.explicit {
						text-transform: uppercase;
						font-size: functions.toRem(8);
						margin-left: 10px;
						border: 1px solid;
						padding: 2px 3px;
						border-radius: 2px;
						line-height: functions.toRem(10);
						color: var(--light-gray);
					}
				}
				.artists {
					color: var(--light-gray);
					font-size: functions.toRem(13);
					margin: 7px 0 0;
					line-height: 1;
					a {
						color: inherit;
						text-decoration: none;
					}
				}
			}
			.duration-column {
				span.duration {
					color: var(--light-gray);
					font-size: functions.toRem(14);
				}
				@include breakpoint.down('md') {
					:global(.no-js) & {
						width: 100%;
						margin: 10px 0;
					}
				}
			}
			.actions-column {
				width: 30px;
				margin-left: 15px;
				&:not(.is-owner) {
					:global(html.no-js) & {
						width: 200px;
						@include breakpoint.down('md') {
							margin-left: 0;
							width: 100%;
						}
					}
				}
				.add-pl-button {
					:global(html.no-js) & {
						display: none;
					}
				}
				.playlists-menu {
					:global(html.no-js) & {
						display: block !important;
					}
				}
				.add-pl-button,
				.remove-pl-button {
					background: none;
					border: none;
					padding: 5px;
					cursor: pointer;
					:global(svg) {
						stroke: var(--text-color);
						vertical-align: middle;
						width: 22px;
						height: 22px;
					}
					&:disabled {
						opacity: 0.8;
						cursor: not-allowed;
					}
				}
				.playlists-menu-content {
					padding: 15px;
					:global(html.no-js) & {
						padding: 0;
					}
					form {
						:global(html.no-js) & {
							display: flex;
							align-items: center;
						}
					}
					.field {
						:global(html.no-js) & {
							flex: 1;
						}
						select {
							width: 100%;
							height: 35px;
							border-radius: 4px;
						}
					}
					.submit-button {
						margin-top: 10px;
						text-align: right;
						:global(html.no-js) & {
							margin-top: 0;
							margin-left: 10px;
						}
					}
				}
			}
		}
	}
</style>
