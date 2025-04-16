<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { FolderPlus, Plus } from '@lucide/svelte';

	const projects = $state(page.data.projects);

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

	if (browser) {
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
	}
</script>

<aside class="sidebar">
	<nav aria-label="Sidebar Navigation">
		<menu>
			<li>
				<div class="sidebar-menu-title">
					Projects
					<button onclick={toggleModal} class="sidebar-button">
						<Plus />
					</button>
				</div>
				<menu>
					{#each projects as project}
						<li><a href="/projects/{project.id}">{project.title}</a></li>
					{/each}
				</menu>
			</li>
			<li>
				<a href="/settings">Settings</a>
			</li>
		</menu>
	</nav>
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

	nav menu {
		list-style: none;
		padding: 0;
		margin: 0;

		li {
			padding: 0;
			margin: 0;

			a {
				text-decoration: none;
				color: var(--text-color);
				font-size: 1.125rem;
				font-weight: 600;
				padding: 0.5rem 1rem;
				display: block;
				transition: color 0.3s ease;
				&:hover {
					background-color: var(--surface-color-1-hover);
					border-radius: var(--radius-2);
				}
			}
		}
	}
	li menu {
		/* padding-inline-start: 1rem; */
		padding: 0;
		margin: 0;

		li a {
			margin-inline-start: 1rem;
		}
	}

	.sidebar-menu-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-color);
		padding: 0.5rem 1rem;
		border-radius: var(--radius-2);

		&:hover {
			background-color: var(--surface-color-1-hover);

			button {
				color: var(--text-color);
			}
		}

		button {
			padding: 0.25rem;
			background-color: transparent;
			color: transparent;
			aspect-ratio: 1;
			transition:
				color 0.3s ease,
				background-color 0.3s ease;
			cursor: pointer;
			border-radius: var(--radius-1);

			&:hover,
			&:focus,
			&:focus-visible {
				border-color: transparent;
				outline-color: transparent;
				background-color: var(--surface-color-4-hover);
			}
		}

		:global(button > svg) {
			font-size: 1rem;
			width: 1rem;
		}
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
			padding-inline: 1rem;
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

	.sidebar-button {
		background-color: transparent;
		border: none;
		font-family: inherit;
		padding: 0.5rem 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--link-color);
		font-size: 1.125rem;
		cursor: pointer;
		font-weight: 600;
		transition: color 0.3s ease;

		&:hover {
			color: var(--primary);
		}
	}

	:global(.sidebar-button svg) {
		width: 1.5rem;
		height: 1.5rem;
		color: currentColor;
		/* transition: color 0.3s ease; */
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
