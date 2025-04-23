<script lang="ts">
	import 'quill/dist/quill.snow.css';
	import type { Project } from '$lib/server/db/schema';
	import { Pencil, Plus, Smile } from '@lucide/svelte';
	import TipTapEditor from '$lib/components/TipTapEditor.svelte';
	import { applyAction, deserialize, enhance } from '$app/forms';
	import type { PageProps } from '../$types';
	import type { ActionResult } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';

	type Props = {
		data: {
			project: Project;
		};
		form: PageProps;
	};
	const { data, form }: Props = $props();
	const { project } = data;

	let projectForm: HTMLFormElement;
	let submitButton: HTMLButtonElement;

	let isEdit = $state(false);
	let isTitleEdit = $state(false);
	let description = $state(project.description);

	function saveProject() {
		if (!submitButton) return;
		submitButton.click();
		// projectForm.submit();
	}

	function toggleTitleEdit() {
		isTitleEdit = !isTitleEdit;
	}

	function inputFocusAction(node: HTMLInputElement) {
		node.focus();
	}

	async function handleSubmit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);

		const response = await fetch(event.currentTarget.action, {
			method: 'POST',
			body: formData,
			headers: {
				'x-sveltekit-action': 'true'
			}
		});

		const result: ActionResult = deserialize(await response.text());
		if (result.type === 'success') {
			// Handle success
			await invalidateAll();
			console.log('Project updated successfully:', result.data);
		} else if (result.type === 'error') {
			// Handle error
			console.error('Error updating project:', result.error);
		}

		applyAction(result);
	}
</script>

<div class="container">
	<form
		method="POST"
		id="project-form"
		action="/projects/{project.id}?/update"
		bind:this={projectForm}
		use:enhance={({ formElement, formData, action, cancel, submitter }) => {
			return async ({ result, update }) => {
				if (result.type === 'success') {
					// Handle success
					await invalidateAll();
					console.log('Project updated successfully:', result.data);
				} else if (result.type === 'error') {
					// Handle error
					console.error('Error updating project:', result.error);
				}
				return update();
			};
		}}
	>
		<input type="hidden" name="id" bind:value={project.id} />
		<input type="hidden" name="userId" bind:value={project.userId} />
		<input type="hidden" name="createdAt" bind:value={project.createdAt} />
		<input type="hidden" name="updatedAt" bind:value={project.updatedAt} />
	</form>
	{#if project}
		<div class="page-title-bar">
			<button class="icon-button">
				<Smile size="24px" />
			</button>
			<div class="flex gap-2 project-title-group">
				{#if !isTitleEdit}
					<button type="button" class="title-button" onclick={toggleTitleEdit}>
						<h1>{project.title}</h1>
					</button>
				{:else}
					<input
						name="title"
						type="text"
						bind:value={project.title}
						use:inputFocusAction
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
				<!-- <div class="button-group">
					<button
						class="icon-reveal-button"
						onclick={toggleTitleEdit}
						aria-label="Edit project"
						title="Edit project"
					>
						<Pencil />
					</button>
				</div> -->
			</div>
			<!-- <button class="icon-button" onclick={() => alert('Button clicked!')}>
				<Plus />
				Add List
			</button> -->
		</div>
		<section class="project-description">
			<div class="flex flex-column gap-2">
				<input type="hidden" name="description" bind:value={description} form="project-form" />
				<TipTapEditor
					bind:value={project.description}
					placeholder="Project description..."
					blur={() => saveProject()}
					input={(content) => {
						description = content;
					}}
				/>
			</div>
			<button type="submit" form="project-form" class="hidden-submit" bind:this={submitButton}
				>Save</button
			>
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
	}

	.project-title-group {
		display: flex;
		/* align-items: center; */
		justify-content: stretch;
		gap: 0.5rem;
		flex-grow: 1;

		.title-button {
			flex-grow: 1;
			text-align: left;
			background-color: transparent;
			border: 1px solid transparent;
			padding: 0.5rem;
		}
		input {
			flex-grow: 1;
			background-color: transparent;
			border: 1px solid transparent;
			padding-block: 0;
			font-size: 1.75rem;
			font-weight: bold;
			padding: 0.5rem;
			outline: 1px solid transparent;
			outline-offset: -1px;
			flex-grow: 1;
			transition: outline 0.3s ease;

			&:focus {
				outline-color: var(--border-color);
			}
		}
		h1 {
			margin: 0;
		}

		&:hover button {
			background-color: var(--button-bg-color-hover);
		}

		.title-button:hover {
			background-color: var(--button-bg-color-hover);
		}
	}

	.hidden-submit {
		display: none;
	}

	.page-title-bar {
		display: flex;
		gap: 1rem;
	}

	.page-title-bar > .icon-button {
		aspect-ratio: 1 / 1;
		font-size: 2rem;
		width: 1.5em;
		border-color: transparent;

		:global(svg) {
			stroke: currentColor;
			opacity: 0.6;
		}
	}
</style>
