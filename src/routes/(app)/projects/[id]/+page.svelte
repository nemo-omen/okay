<script lang="ts">
	import type { Project } from '$lib/server/db/schema';
	import { Plus } from '@lucide/svelte';

	type Props = {
		data: {
			project: Project;
		};
	};

	const { data }: Props = $props();
	const { project } = data;
	console.log({ project });
</script>

<div class="container">
	{#if project}
		<div class="page-title-bar">
			<h1>{project.title}</h1>
			<button class="icon-button" on:click={() => alert('Button clicked!')}>
				<Plus />
				Add List
			</button>
		</div>
		{#each project.lists as list}
			<div>
				<h2>{list.title}</h2>
				<ul>
					{#each list.cards as card}
						<li>{card.title}</li>
					{/each}
				</ul>
			</div>
		{/each}
	{:else}
		<p>Project not found.</p>
	{/if}
</div>

<style>
</style>
