<script lang="ts">
	import Card from '$lib/components/Card.svelte';
</script>

<main>
	<div class="card-grid">
		<Card title="Welcome to SvelteKit" id="welcome-card">
			<p>
				Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
			</p>
		</Card>
	</div>
</main>

<style>
	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
	}
</style>
