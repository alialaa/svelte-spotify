<script lang="ts">
	import { Button, Player } from '$components';
	import { msToTime } from '$helpers';
	import { Clock8, ListPlus, ListX } from 'lucide-svelte';
	import playingGif from '$assets/playing.gif';
	import { tippy } from '$actions';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { toasts } from '$stores';
	import { hideAll } from 'tippy.js';

	let currentlyPlaying: string | null = null;
	let isPaused: boolean = false;
	let isAddingToPlaylist: string[] = [];

	export let tracks: SpotifyApi.TrackObjectFull[] | SpotifyApi.TrackObjectSimplified[];
	export let isOwner: boolean = false;
	export let userPlaylists: SpotifyApi.PlaylistObjectSimplified[] | undefined;
</script>

<div class="tracks">
	<div class="row header">
		<div class="number-column">
			<span class="number">#</span>
		</div>
		<div class="info-column">
			<span class="track-title">Title</span>
		</div>
		<div class="duration-column">
			<Clock8 aria-hidden focusable="false" color="var(--light-gray)" />
		</div>
		<div class="actions-column" class:is-owner={isOwner} />
	</div>
	{#each tracks as track, index}
		<div class="row" class:is-current={currentlyPlaying === track.id}>
			<div class="number-column">
				{#if currentlyPlaying === track.id && !isPaused}
					<img class="playing-gif" src={playingGif} alt="" />
				{:else}
					<span class="number">{index + 1}</span>
				{/if}
				<div class="player">
					<Player
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
			<div class="info-column">
				<div class="track-title">
					<h4>{track.name}</h4>
					{#if track.explicit}
						<span class="explicit">Explicit</span>
					{/if}
				</div>
				<p class="artists">
					{#each track.artists as artist, artistIndex}
						<a href="/artist/{artist.id}">{artist.name}</a
						>{#if artistIndex < track.artists.length - 1}{', '}{/if}
					{/each}
				</p>
			</div>
			<div class="duration-column">
				<span class="duration">{msToTime(track.duration_ms)}</span>
			</div>
			<div class="actions-column" class:is-owner={isOwner}>
				{#if isOwner}
					<form method="POST" action="/playlist/{$page.params.id}?/removeItem">
						<input hidden name="track" value={track.id} />
						<button
							type="submit"
							title="Remove {track.name} from playlist"
							aria-label="Remove {track.name} from playlist"
							class="remove-pl-button"
						>
							<ListX aria-hidden focusable="false" />
						</button>
					</form>
				{:else}
					<button
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
		.row {
			display: flex;
			align-items: center;
			padding: 7px 5px;
			border-radius: 4px;
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
				&:hover {
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
					.field {
						select {
							width: 100%;
							height: 35px;
							border-radius: 4px;
						}
					}
					.submit-button {
						margin-top: 10px;
						text-align: right;
					}
				}
			}
		}
	}
</style>
