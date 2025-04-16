<script lang="ts">
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
</script>

<Sidebar />

<main>
	{@render children()}
</main>

<style>
	:global(body) {
		grid-template-columns: auto 1fr;
		grid-template-areas:
			'header header'
			'sidebar main'
			'footer footer' !important;
	}

	main {
		grid-area: main;
		padding: 1rem;
	}
</style>
