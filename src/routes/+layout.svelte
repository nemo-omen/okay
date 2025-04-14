<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import '$lib/style/main.css';
	import Header from '$lib/components/Header.svelte';
	import type { Snippet } from 'svelte';
	import type { Session, User } from '$lib/server/db/schema';

	type Props = {
		children: Snippet;
		data: {
			user: User;
			session: Session;
		};
	};

	const { children, data } = $props();
	const { user, session } = data;
	setContext('user', user);
	setContext('session', session);
</script>

<Header />

{@render children()}
