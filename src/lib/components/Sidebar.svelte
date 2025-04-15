<script lang="ts">
	import { page } from '$app/state';

	const projects = $derived(page.data.projects);

	let modal: HTMLDialogElement | undefined = undefined;
	let modalContainer: HTMLDivElement | undefined = undefined;

	function toggleModal() {
		if (modal) {
			if (modal.open) {
				modal.close();
			} else {
				modal.showModal();
			}
		}
	}

	document.addEventListener('click', (event) => {
		const target = event.target as HTMLElement;
		if (modalContainer) {
			if (modalContainer.contains(target)) {
				return;
			}

			if (modal && modal.open && modal.contains(target)) {
				modal.close();
			}
		}
	});
</script>

<aside class="sidebar">
	<nav>
		<ul>
			<li>
				<a href="/home">Home</a>
			</li>
			<li>
				<a href="/projects">Projects</a>
			</li>
			<li>
				<a href="/settings">Settings</a>
			</li>
			<li>
				<a href="/logout">Logout</a>
			</li>
		</ul>
	</nav>

	<div class="project-list">
		<h2>Projects</h2>
		<ul>
			{#each projects as project}
				<li><a href={`/projects/${project.id}`}>{project.name}</a></li>
			{/each}
			<li>
				<button onclick={toggleModal}>New Project</button>
			</li>
		</ul>
	</div>
</aside>

<dialog bind:this={modal} id="project-modal" popover>
	<div class="modal" bind:this={modalContainer}>
		<div class="modal-header">
			<button class="close" onclick={toggleModal} aria-label="Close modal"> &times; </button>
		</div>
		<form action="/projects/create">
			<h2>Create New Project</h2>
			<div class="form-group">
				<label for="projectName">Project Name</label>
				<input type="text" name="projectName" placeholder="Project Name" required />
			</div>
			<button type="submit">Create Project</button>
		</form>
	</div>
</dialog>

<style>
	.sidebar {
		background-color: var(--surface-color-0);
		border-inline-end: 1px solid var(--border-color);
		z-index: 10;
		grid-area: sidebar;
	}

	dialog {
		background-color: var(--surface-color-0);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-2);
		padding: 1rem;
		box-shadow: var(--shadow-2);
		color: var(--text-color);
		width: min(32rem, 100%);

		form {
			padding-inline: 1rem;
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}

		&::backdrop {
			background-color: rgb(0 0 0 / 0.3);
			backdrop-filter: blur(4px);
		}
	}

	.modal-header {
		display: flex;
		justify-content: flex-end;

		button {
			aspect-ratio: 1;
			width: 2rem;
			background-color: transparent;
			cursor: pointer;
			font-size: 1.75rem;
			line-height: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			color: var(--border-color);
			transition:
				color 0.3s ease,
				border-color 0.3s ease,
				outline-color 0.3s ease;

			&:hover {
				color: var(--primary);
				border-color: var(--primary);
				outline-color: var(--primary);
			}
		}
	}
</style>
