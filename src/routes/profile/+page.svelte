<script lang="ts">
	import ItemPage from '$components/ItemPage.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: user = data.user;
	$: color = data.color;
	$: following = data.following;

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
	}
</style>
