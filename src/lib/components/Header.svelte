<script lang="ts">
	import { page } from '$app/state';
	import { getContext } from 'svelte';

	const user = $derived(page.data.user);
	const session = $derived(page.data.session);
	let dropdownMenu: HTMLMenuElement;
	function showDropdown() {
		//
	}
</script>

<header>
	<a href="/" class="brand">OK</a>
	<nav>
		{#if user}
			<button
				popovertarget="dropdown-menu"
				aria-controls="dropdown-menu"
				id="dropdown-button"
				type="button"
				aria-haspopup="true"
				aria-expanded="false"
			>
				{user.username}
			</button>
			<menu id="dropdown-menu" bind:this={dropdownMenu} aria-labelledby="dropdown-button" popover>
				<li><a href="/profile">Profile</a></li>
				<li><a href="/settings">Settings</a></li>
				<li>
					<form method="POST" action="/auth/logout">
						<button type="submit" class="link-button">Logout</button>
					</form>
				</li>
			</menu>
		{:else}
			<a href="/auth/login">Login</a>
			<a href="/auth/register">Register</a>
		{/if}
	</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		z-index: 9;
	}

	.brand {
		font-size: 1.5rem;
		text-decoration: none;
		color: var(--primary);
		font-weight: 600;
		text-transform: uppercase;
		transition: color 0.3s ease;
	}

	.brand:hover {
		color: var(--secondary);
	}

	nav {
		gap: 1rem;
		display: flex;
	}

	#dropdown-button {
		anchor-name: --dropdown-anchor;
	}

	#dropdown-menu {
		position-anchor: --dropdown-anchor;
		top: anchor(--dropdown-anchor bottom);
		right: anchor(--dropdown-anchor right);
	}
</style>
