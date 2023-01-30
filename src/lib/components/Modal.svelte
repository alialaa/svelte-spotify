<script lang="ts">
	import { X } from 'lucide-svelte';

	export let id: string;
	export let title: string;
</script>

<div {id} aria-hidden="true" class="modal">
	<div tabindex="-1" data-micromodal-close class="modal-overlay">
		<div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="{id}-title">
			<header>
				<h2 id="{id}-title">{title}</h2>

				<button class="close-button" aria-label="Close modal" data-micromodal-close>
					<X aria-hidden focusable="false" />
				</button>
			</header>

			<div id="{id}-content">
				<slot />
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.modal {
		display: none;
		&:global(.is-open) {
			display: block;
		}
		.modal-overlay {
			position: fixed;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			background-color: rgba(0, 0, 0, 0.6);
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 9999;
		}
		.modal-content {
			background-color: var(--dark-gray);
			padding: 30px;
			max-width: 400px;
			max-height: 100vh;
			overflow-y: auto;
			border-radius: 4px;
			position: relative;
		}
		header {
			margin-right: 30px;
			h2 {
				font-size: functions.toRem(26);
			}
			.close-button {
				background: none;
				border: none;
				position: absolute;
				top: 10px;
				right: 10px;
				cursor: pointer;
				:global(svg) {
					stroke: var(--text-color);
				}
			}
		}
	}
</style>
