<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { Button } from '$components';
	import Card from '$components/Card.svelte';
	import ItemPage from '$components/ItemPage.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: user = data.user;
	$: color = data.color;
	$: following = data.following;

	let isRetrying = false;

	const followersFormat = Intl.NumberFormat('en', { notation: 'compact' });
</script>

<div id="profile-page">
	<ItemPage
		{color}
		title={user?.display_name || ''}
		image={user?.images && user?.images?.length > 0 ? user.images[0].url : undefined}
		type={user?.type}
	>
		<span slot="meta" class="following-count"
			>{followersFormat.format(user?.followers?.total || 0)} Followers</span
		>

		{#if following === undefined}
			<div class="fail">
				<p>Failed to load data.</p>
				<Button
					disabled={isRetrying}
					element="button"
					on:click={async () => {
						isRetrying = true;
						await invalidate((url) => url.pathname === '/api/spotify/me/following');
						isRetrying = false;
					}}>Retry</Button
				>
			</div>
		{/if}

		{#if following && following.artists.items.length > 0}
			<div class="following">
				<h2>Following</h2>
				<div class="grid-items">
					{#each following.artists.items as artist}
						<div class="grid-item">
							<Card item={artist} />
						</div>
					{/each}
				</div>
				<div class="view-all-button">
					<Button element="a" variant="outline" href="/profile/following"
						>View All <span class="visually-hidden">artists that you are following</span></Button
					>
				</div>
			</div>
		{/if}
	</ItemPage>
</div>

<style lang="scss">
	#profile-page {
		:global(.banner) {
			align-items: center;
			text-align: center;
			@include breakpoint.up('sm') {
				text-align: left;
			}
		}
		:global(.cover-img) {
			border-radius: 100%;
		}
		.following-count {
			font-size: functions.toRem(14);
			color: var(--light-gray);
		}
		.fail {
			text-align: center;
			margin-top: 40px;
		}
		.following {
			margin-top: 30px;
			h2 {
				font-size: functions.toRem(24);
				margin-bottom: 0.7em;
			}
			.view-all-button {
				margin-top: 30px;
				text-align: right;
			}
		}
	}
</style>
