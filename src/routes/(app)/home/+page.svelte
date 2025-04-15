<script lang="ts">
	import type { Project, Session, User } from '$lib/server/db/schema';
	import { setContext } from 'svelte';

	type Props = {
		data: {
			user: User;
			session: Session;
			projects: Project[]; // Add projects to Props
		};
	};

	const { data } = $props();

	setContext('projects', data.projects);
</script>

<h1>Home</h1>

<style>
</style>
