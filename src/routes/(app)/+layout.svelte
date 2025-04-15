<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import type { Snippet } from 'svelte';
	type Props = {
		children: Snippet;
	};
	const { children }: Props = $props();
</script>

<Sidebar />

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

	main {
		grid-area: main;
		padding: 1rem;
	}
</style>
