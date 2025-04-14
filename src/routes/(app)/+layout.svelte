<script lang="ts">
	import type { Snippet } from 'svelte';
	type Props = {
		children: Snippet;
	};
	const { children }: Props = $props();
</script>

<aside class="sidebar">sidebar</aside>

<main>
	{@render children()}
</main>

<style>
	:global(body) {
		grid-template-columns: auto 1fr;
		grid-template-areas:
			'header header'
			'sidebar main'
			'footer footer' !important;
	}

	.sidebar {
		background-color: var(--surface-color-0);
		border-inline-end: 1px solid var(--border-color);
		z-index: 10;
		grid-area: sidebar;
	}

	main {
		grid-area: main;
		padding: 1rem;
	}
</style>
