<script lang="ts">
	import { getContext } from 'svelte';
	import { page } from '$app/state';
	import { FolderPlus, Plus } from '@lucide/svelte';

	const projects = $state(page.data.projects);
	const toggleProjectModal: () => void = getContext('toggleProjectModal');
</script>

<aside class="sidebar">
	<nav aria-label="Sidebar Navigation">
		<menu>
			<li class="sidebar-menu-item">
				<a href="/home" class="sidebar-link">Home</a>
			</li>
			<li class="sidebar-item">
				<div class="sidebar-menu-title">
					<a href="/projects" class="sidebar-link"> Projects </a>
					<button
						onclick={toggleProjectModal}
						class="sidebar-button"
						aria-label="Create New Project"
					>
						<Plus />
					</button>
				</div>
				<menu>
					{#each projects as project}
						<li class="sidebar-item sidebar-child">
							<a href="/projects/{project.id}" class="sidebar-link">{project.title}</a>
						</li>
					{/each}
				</menu>
			</li>
			<li class="sidebar-item">
				<a href="/settings" class="sidebar-link">Settings</a>
			</li>
		</menu>
	</nav>
</aside>

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
	}

	.sidebar-menu-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 600;
		color: var(--text-color);
		padding-inline: 1rem;
		border-radius: var(--radius-2);

		&:hover {
			background-color: var(--surface-color-1-hover);
			.sidebar-button {
				color: var(--text-color);
			}
		}

		a {
			padding-inline-start: 0;
			display: block;
			flex-grow: 1;

			&:hover {
				background-color: transparent;
			}
		}
	}

	.sidebar-button {
		background-color: transparent;
		border: none;
		font-family: inherit;
		padding: 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: transparent;
		font-size: 1rem;
		cursor: pointer;
		transition:
			color 0.3s ease,
			background-color 0.3s ease;
		aspect-ratio: 1 / 1;

		&:hover,
		&:focus-visible {
			color: var(--text-color);
			background-color: var(--surface-color-3-hover);
		}

		&:focus,
		&:focus-visible {
			outline-color: transparent;
		}
	}

	:global(.sidebar-button svg) {
		width: 1em;
		color: currentColor;
	}

	.sidebar-item {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.sidebar-child {
		padding-left: 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-color);
		&:hover {
			background-color: var(--surface-color-1-hover);
			border-radius: var(--radius-2);
		}
	}

	.sidebar-link {
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
</style>
