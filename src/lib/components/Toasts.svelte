<script lang="ts">
	import { toasts } from '$stores';
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { X } from 'lucide-svelte';
</script>

{#if $toasts.length > 0}
	<div class="toasts">
		{#each $toasts as toast (toast.id)}
			<div
				class="toast {toast.type}"
				transition:fly={{ x: 100, duration: 300 }}
				animate:flip={{ duration: 300 }}
			>
				<div class="content" role="status">
					{toast.message}
				</div>
				<button
					class="close"
					aria-label="Close toast"
					on:click={() => {
						toasts.remove(toast.id);
					}}
				>
					<X focusable="false" aria-hidden color="var(--text-color)" />
				</button>
			</div>
		{/each}
	</div>
{/if}

<style lang="scss">
	.toasts {
		position: fixed;
		top: 0;
		right: 0;
		padding: 20px;
		width: 100%;
		max-width: 300px;
		z-index: 9999;
		max-height: 100vh;
		overflow: auto;
		.toast {
			background-color: var(--accent-color);
			box-shadow: 0 0 10px rgba(1, 1, 1, 0.2);
			border-radius: 2px;
			padding: 10px 20px;
			margin-bottom: 10px;
			font-weight: 500;
			position: relative;
			&.error {
				background-color: var(--error);
			}
			&.warning {
				background-color: var(--warning);
			}
			.close {
				background: none;
				padding: 5px;
				border: none;
				position: absolute;
				top: 0;
				right: 0;
				cursor: pointer;
				:global(svg) {
					width: 18px;
					height: 18px;
				}
			}
		}
	}
</style>
