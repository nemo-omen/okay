<script lang="ts">
	import { browser } from '$app/environment';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import type { Project, Session, User } from '$lib/server/db/schema';
	import { setContext, type Snippet } from 'svelte';
	type Props = {
		children: Snippet;
		data: {
			user: User;
			session: Session;
			projects: Project[];
		};
	};
	const { children, data }: Props = $props();
	setContext('projects', data.projects);

	let projectModal: HTMLDialogElement | undefined = undefined;
	let projectModalContainer: HTMLDivElement | undefined = undefined;

	function toggleProjectModal() {
		if (browser) {
			if (projectModal) {
				if (projectModal.open) {
					projectModal.close();
				} else {
					projectModal.showModal();
				}
			}
		}
	}

	setContext('toggleProjectModal', toggleProjectModal);

	if (browser) {
		document.addEventListener('click', (event) => {
			const target = event.target as HTMLElement;
			if (projectModalContainer) {
				if (projectModalContainer.contains(target)) {
					return;
				}

				if (projectModal && projectModal.open && projectModal.contains(target)) {
					projectModal.close();
				}
			}
		});
	}
</script>

<Sidebar />

<main>
	{@render children()}
</main>

<dialog bind:this={projectModal} id="project-modal" popover>
	<div class="modal" bind:this={projectModalContainer}>
		<div class="modal-header">
			<h2>Create New Project</h2>
			<button class="close" onclick={toggleProjectModal} aria-label="Close modal"> &times; </button>
		</div>
		<form action="/projects/create">
			<div class="form-group">
				<label for="projectName">Project Name</label>
				<input type="text" name="projectName" placeholder="Project Name" required />
			</div>
			<button type="submit">Create Project</button>
		</form>
	</div>
</dialog>

<style>
	main {
		padding: 1rem;
		grid-column: span 1;
	}

	dialog {
		background-color: var(--surface-color-0);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-2);
		padding: 1rem;
		box-shadow: var(--shadow-2);
		color: var(--text-color);
		width: min(32rem, 100%);
		transition: display 0.5s ease-out;
		animation: close 0.5s forwards;

		&:open {
			animation: open 0.5s forwards;
		}

		form {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}

		&::backdrop {
			background-color: rgb(0 0 0 / 0.3);
			backdrop-filter: blur(4px);
			transition: opacity 0.3s ease;
			animation: fadeIn 0.3s forwards;

			&:exit {
				animation: fadeOut 0.3s forwards;
			}
		}
	}

	.modal {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;

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

	@keyframes open {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@keyframes close {
		from {
			opacity: 1;
			transform: translateY(0);
		}
		to {
			opacity: 0;
			transform: translateY(-10px);
		}
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes fadeOut {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
</style>
