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

<div class="container">
	<div class="page-title-bar">
		<h1>Home</h1>
	</div>
</div>

<style>
</style>
