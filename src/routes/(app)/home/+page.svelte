<script lang="ts">
	import type { Session, User } from '$lib/server/db/schema';

	type Props = {
		data: {
			user: User;
			session: Session;
		};
	};

	const { data } = $props();
</script>

<h1>Home</h1>

<style>
</style>
