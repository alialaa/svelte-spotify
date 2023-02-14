<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: items = data.categories?.categories.items;
</script>

{#if items}
	<h2>Browse Categories</h2>
	<div class="items">
		{#each items as item}
			<div class="item">
				<a href="/category/{item.id}">
					{#if item.icons.length > 0}
						<img src={item.icons[0].url} alt="" />
					{/if}
					<span class="truncate-1">{item.name}</span>
				</a>
			</div>
		{/each}
	</div>
{/if}

<style lang="scss">
	.items {
		display: grid;
		grid-template-columns: 1fr;
		gap: 20px;

		.item {
			position: relative;
			a {
				text-decoration: none;
			}
			span {
				color: var(--text-color);
				font-size: functions.toRem(16);
				font-weight: 700;
				position: absolute;
				bottom: 20px;
				width: 100%;
				text-align: center;
				padding: 0 10px;
			}
			img {
				width: 100%;
				aspect-ratio: 1;
				object-fit: cover;
			}
		}
		@include breakpoint.up('sm') {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		@include breakpoint.up('md') {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}

		@include breakpoint.up('xl') {
			grid-template-columns: repeat(7, minmax(0, 1fr));
			.item span {
				font-size: functions.toRem(20);
			}
		}
	}
</style>
