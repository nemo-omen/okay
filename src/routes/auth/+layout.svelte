<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children }: Snippet = $props();
</script>

<main>
	{@render children()}
</main>

<style>
	main {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
