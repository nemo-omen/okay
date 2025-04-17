<script lang="ts">
	import { getContext } from 'svelte';
	import { Plus } from '@lucide/svelte';

	const toggleProjectModal: () => void = getContext('toggleProjectModal');
</script>

<div class="container">
	<div class="page-title-bar">
		<h1>Projects</h1>
		<!-- Add a button to create a new project -->
		<button class="icon-button" onclick={toggleProjectModal}>
			<Plus />
			Create Project
		</button>
	</div>
	<p>Manage your projects here.</p>
	<!-- Add your project list or components here -->
</div>
