<script lang="ts">
	import { getContext, SvelteComponent } from 'svelte';
	import { page } from '$app/state';
	import { FolderPlus, Plus } from '@lucide/svelte';
	import { getIcon } from '$lib/util/icons';

	// const projects = $state(page.data.projects);
	const toggleProjectModal: () => void = getContext('toggleProjectModal');
	const projects = getContext('projects');
</script>

{#snippet sidebarItemIcon(iconName: string)}
	{@const Icon = getIcon(iconName)}
	<Icon size={16} />
{/snippet}

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
						class="icon-reveal-button"
						aria-label="Create New Project"
					>
						<Plus />
					</button>
				</div>
				<menu>
					{#each projects as project}
						<li class="sidebar-item sidebar-child">
							<a href="/projects/{project.id}" class="sidebar-link">
								{@render sidebarItemIcon(project.icon)}
								{project.title}
							</a>
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
			.icon-reveal-button {
				opacity: 1;
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
