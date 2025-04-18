<script lang="ts">
	import 'quill/dist/quill.snow.css';
	import QuillEditor from '$lib/components/QuillEditor.svelte';
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
	const toggleEdit = () => {
		isEdit = !isEdit;
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
				<p>{@html project.description}</p>
			{:else}
				<div class="flex flex-column gap-2">
					<QuillEditor bind:value={project.description} />
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
</style>
