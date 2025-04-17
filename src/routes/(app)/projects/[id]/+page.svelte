<script lang="ts">
	import type { Project } from '$lib/server/db/schema';
	import { Pencil, Plus } from '@lucide/svelte';

	type Props = {
		data: {
			project: Project;
		};
	};

	const { data }: Props = $props();
	const { project } = data;
	let isEdit = $state(false);
	let editor: HTMLTextAreaElement | null = null;

	const toggleEdit = () => {
		isEdit = !isEdit;
		if (isEdit && editor) {
			editor.focus();
			editor.select();
		}
	};
</script>

<div class="container">
	{#if project}
		<div class="page-title-bar">
			<h1>{project.title}</h1>
			<button class="icon-button" onclick={() => alert('Button clicked!')}>
				<Plus />
				Add List
			</button>
		</div>
		<section class="project-description">
			{#if !isEdit}
				<button
					type="button"
					class="icon-reveal-button"
					aria-label="Edit Project Description"
					title="Edit Project Description"
					onclick={toggleEdit}
				>
					<Pencil />
				</button>
				<p>{project.description}</p>
			{:else}
				<div class="flex flex-column gap-2">
					<textarea
						bind:this={editor}
						bind:value={project.description}
						style="width: 100%;"
						contenteditable
					></textarea>
					<div class="flex justify-end">
						<button onclick={toggleEdit}>Save</button>
					</div>
				</div>
			{/if}
		</section>
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
	.project-description {
		position: relative;

		.icon-reveal-button {
			position: absolute;
			top: 0;
			right: 0;
		}
	}

	[contenteditable] {
		border: 1px solid var(--border-color);
		border-radius: var(--radius-2);
		padding: 0.5rem;
		background-color: var(--surface-color-1);
	}
</style>
