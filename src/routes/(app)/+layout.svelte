<script lang="ts">
	import { browser } from '$app/environment';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import type { Project, Session, User } from '$lib/server/db/schema';
	import { setContext, type SvelteComponent, type Snippet } from 'svelte';
	import IconGrid from '$lib/components/IconGrid.svelte';
	type Props = {
		children: Snippet;
		data: {
			user: User;
			session: Session;
			projects: Project[];
		};
	};
	const { children, data }: Props = $props();
	let projects = $state(data.projects);
	setContext('projects', projects);

	let modal: SvelteComponent | undefined = undefined;

	function toggleProjectModal() {
		if (browser) {
			if (modal) {
				modal.toggle();
			}
		}
	}

	setContext('toggleProjectModal', toggleProjectModal);

	function onModalClose() {
		console.log('Modal closed');
	}
</script>

<Sidebar />

<main>
	{@render children()}
</main>

{#snippet footer()}
	<button type="button" onclick={toggleProjectModal}> Cancel </button>
	<button type="submit" form="project-form">Save</button>
{/snippet}

<Modal title="Create a New Project" {footer} bind:this={modal} close={onModalClose}>
	<form
		action="/projects/create"
		id="project-form"
		onsubmit={(event) => {
			event.preventDefault();
			console.log('DOOOKIE');
			modal?.toggle();
		}}
	>
		<div class="form-group">
			<label for="projectName">Project Name</label>
			<input type="text" name="projectName" placeholder="Project Name" required />
		</div>
		<div class="form-group">
			<label for="">Project Icon</label>
			<IconGrid />
		</div>
	</form>
</Modal>

<style>
	main {
		padding: 1rem;
		grid-column: span 1;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
