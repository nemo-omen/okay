<script lang="ts">
	import 'quill/dist/quill.snow.css';
	import type { Project } from '$lib/server/db/schema';
	import { Pencil, Plus } from '@lucide/svelte';
	import TipTapEditor from '$lib/components/TipTapEditor.svelte';
	import { enhance } from '$app/forms';

	type Props = {
		data: {
			project: Project;
		};
	};
	const { data }: Props = $props();
	const { project } = data;

	let projectForm: HTMLFormElement;

	let isEdit = $state(false);
	let isTitleEdit = $state(false);

	function saveProject() {
		projectForm.submit();
	}
</script>

<div class="container">
	<form
		method="post"
		action={`?/projects/${project.id}/update`}
		id="project-form"
		bind:this={projectForm}
		use:enhance
	>
		<input type="hidden" name="id" bind:value={project.id} />
		<input type="hidden" name="userId" bind:value={project.userId} />
		<input type="hidden" name="createdAt" bind:value={project.createdAt} />
		<input type="hidden" name="updatedAt" bind:value={project.updatedAt} />
	</form>
	{#if project}
		<div class="page-title-bar">
			<div class="flex gap-2 project-title-group">
				{#if !isTitleEdit}
					<h1>{project.title}</h1>
					<button
						class="icon-reveal-button"
						onclick={() => {
							isTitleEdit = !isTitleEdit;
						}}
						aria-label="Edit project"
						title="Edit project"
					>
						<Pencil />
					</button>
				{:else}
					<input
						type="text"
						bind:value={project.title}
						form="project-form"
						onblur={() => {
							isTitleEdit = false;
							saveProject();
						}}
						onchange={() => {
							isTitleEdit = false;
							saveProject();
						}}
					/>
				{/if}
			</div>
			<button class="icon-button" onclick={() => alert('Button clicked!')}>
				<Plus />
				Add List
			</button>
		</div>
		<section class="project-description">
			<input
				type="hidden"
				name="description"
				bind:value={project.description}
				form="project-form"
			/>
			<div class="flex flex-column gap-2">
				<TipTapEditor
					bind:value={project.description}
					placeholder="Project description..."
					blur={() => saveProject()}
				/>
			</div>
			<!-- {/if} -->
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
		min-height: 100px;

		.icon-reveal-button {
			position: absolute;
			top: 0;
			right: 0;
		}

		&:hover {
			.icon-reveal-button {
				opacity: 1;
			}
		}
	}

	.project-title-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;

		h1 {
			margin: 0;
			font-size: 2rem;
			font-weight: bold;
		}

		&:hover .icon-reveal-button {
			opacity: 1;
		}

		input {
			font-size: 2rem;
			font-weight: bold;
			border: 1px solid var(--border-color);
			background-color: transparent;
			padding: 0.5rem 0.5rem 0.5rem 0;
			outline: 2px solid transparent;
			outline-offset: -1px;
			flex-grow: 1;
			transition: outline 0.3s ease;
			&:focus {
				outline-color: var(--border-color);
			}
		}
	}
</style>
