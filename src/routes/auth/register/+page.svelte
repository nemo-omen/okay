<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Card from '$lib/components/Card.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<Card title="Register" class="form-card">
	<form
		method="post"
		autocomplete="off"
		use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === 'redirect') {
					goto(result.location);
				} else {
					await applyAction(result);
				}
			};
		}}
	>
		<div class="form-group">
			<label for="username">Username</label>
			<input type="text" name="username" id="username" placeholder="Type your username" required />
		</div>
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
		<div class="form-group">
			<label for="confirmPassword">Confirm Password</label>
			<input
				type="password"
				name="confirmPassword"
				id="confirmPassword"
				placeholder="Confirm your password"
				required
			/>
		</div>
		<button type="submit">Register</button>
		<p>Already have an account? <a href="/auth/login">Login</a></p>
	</form>
</Card>
