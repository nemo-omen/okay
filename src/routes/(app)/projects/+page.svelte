<script lang="ts">
	import { getContext, onMount, setContext } from 'svelte';
	import { Plus } from '@lucide/svelte';
	import type { Project } from '$lib/server/db/schema';

	const toggleProjectModal: () => void = getContext('toggleProjectModal');
	let projects: Project[] = getContext('projects');
	setContext('projects', projects);
</script>

<div class="container">
	<div class="page-title-bar">
		<h1>Projects</h1>
		<!-- Add a button to create a new project -->
		<button class="icon-button text-button" onclick={toggleProjectModal}>
			<Plus />
			Create Project
		</button>
	</div>
	<p>Manage your projects here.</p>

	<!-- Add your project list or components here -->
</div>

<style>
</style>
