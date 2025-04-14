<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	// Add your script logic here
	type CardProps = {
		title: string;
		children: Snippet;
		rest: SvelteHTMLElements['div'];
	};
	const { children, title, ...rest }: CardProps = $props();
</script>

<div class="card" {...rest}>
	<div class="card-header">
		<h2>{title}</h2>
	</div>
	<div class="card-body">
		{@render children()}
	</div>
</div>

<style>
	.card {
		background-color: var(--card-bg-color);
		border: 1px solid var(--card-border-color);
		border-radius: var(--card-radius);
		box-shadow: var(--card-shadow);
		transition:
			background-color 0.3s ease,
			border-color 0.3s ease,
			box-shadow 0.3s ease;
	}

	.card:hover {
		background-color: var(--card-bg-color-hover);
		border-color: var(--card-border-color-hover);
		box-shadow: var(--card-shadow-hover);
	}

	.card-header {
		padding-inline: 1rem;
	}

	.card-body {
		padding-inline: 1rem;
	}
</style>
