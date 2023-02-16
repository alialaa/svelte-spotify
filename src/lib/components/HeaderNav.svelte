<script lang="ts">
	import { afterNavigate, preloadData } from '$app/navigation';
	import { IconButton } from '$components';
	import { page } from '$app/stores';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	let backStack: string[] = []; // Stores previous route's pathnames
	let forwardStack: string[] = []; // Stores next route's pathnames
	let navClicked = false; // Keeps track of weather we navigated using the back and forward buttons or navigated using a link or any other way in the app.

	// After every navigation:
	afterNavigate(({ from, to }) => {
		// If we navigated to our app from outside our app, we don't need to store a route in the back stack.
		if (!from) return;
		// If we navigated using the back and forward buttons, we don't need to re-store the routes again in the stack because we are just moving in the history we are not adding a new item to the stack.
		if (navClicked) {
			navClicked = false;
			return;
		}
		// Otherwise, store the previous route in the back stack and clear the forward stack.
		backStack = [...backStack, from.url.pathname];
		forwardStack = [];
	});
</script>

<IconButton
	on:mouseover={() => {
		// If we have items in the back stack, preload the page programmatically on hover using preloadData. This mimics hovering over links.
		if (backStack.length === 0) return;
		const prevPage = backStack[backStack.length - 1];
		preloadData(prevPage);
	}}
	on:click={async () => {
		if (backStack.length === 0) return;
		navClicked = true; // Set navClicked to true so that afterNavigate won't restore the route.
		const currPage = $page.url.pathname; // Get the current page pathname before navigating
		history.back(); // Navigate backwards
		forwardStack = [...forwardStack, currPage]; // Store the path that we navigated from in the forward stack.
		backStack = backStack.slice(0, -1); // Remove the last item in the back stack (the path that we navigated to when we clicked back)
	}}
	label="Go Back"
	disabled={backStack.length === 0}
	icon={ChevronLeft}
	class="nav-button"
/>

<IconButton
	on:mouseover={() => {
		// If we have items in the forward stack, preload the page programmatically on hover using preloadData. This mimics hovering over links.
		if (forwardStack.length === 0) return;
		const forwardPage = forwardStack[forwardStack.length - 1];
		preloadData(forwardPage);
	}}
	on:click={async () => {
		if (forwardStack.length === 0) return;
		navClicked = true; // Set navClicked to true so that afterNavigate won't restore the route.
		const currPage = $page.url.pathname; // Get the current page pathname before navigating
		history.forward(); // Navigate forwards
		backStack = [...backStack, currPage]; // Store the path that we navigated from in the back stack.
		forwardStack = forwardStack.slice(0, -1); // Remove the last item in the forward stack (the path that we navigated to when we clicked forward)
	}}
	label="Go Forward"
	disabled={forwardStack.length === 0}
	icon={ChevronRight}
	class="nav-button"
/>

<style lang="scss">
	:global(button.nav-button) {
		background-color: var(--menu-background-color);
		margin-right: 5px;
		border-radius: 100%;
		height: 34px;
		width: 34px;
		&:active {
			background-color: var(--accent-color);
		}
		:global(html.no-js) & {
			display: none;
		}
	}
</style>
