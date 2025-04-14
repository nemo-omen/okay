<script lang="ts">
	import type { PageProps } from './$types';
	import Card from '$lib/components/Card.svelte';
	import { enhance } from '$app/forms';

	const { form }: PageProps = $props();
</script>

<Card title="Log In" class="form-card">
	<form method="post" autocomplete="off" use:enhance>
		<div class="form-group">
			<label for="email">Email</label>
			<input type="email" name="email" id="email" placeholder="Type your email" required />
		</div>
		<div class="form-group">
			<label for="password">Password</label>
			<input
				type="password"
				name="password"
				id="password"
				placeholder="Type your password"
				required
			/>
		</div>
		<button type="submit">Log In</button>
		<p>Don't have an account? <a href="/auth/register">Register</a></p>
	</form>
</Card>
