<script lang="ts">
	import { page } from '$app/state';

	const user = $derived(page.data.user);
	const session = $derived(page.data.session);
	function showDropdown() {
		//
	}
</script>

<header>
	<a href="/" class="brand">OK</a>
	<nav aria-label="Main Navigation">
		<ul>
			{#if !user}
				<li><a href="/auth/login">Login</a></li>
				<li><a href="/auth/register">Register</a></li>
			{:else}
				<li class="dropdown">
					<button
						id="dropdown-button"
						type="button"
						aria-expanded="false"
						aria-controls="dropdown-menu"
					>
						{user.username}
					</button>
					<ul class="dropdown-menu" id="user-dropdown" bind:this={dropdownMenu}>
						<li><a href="/profile">Profile</a></li>
						<li><a href="/settings">Settings</a></li>
						<li>
							<form method="POST" action="/auth/logout" id="logout-form">
								<button type="submit" class="link-button">Logout</button>
							</form>
						</li>
					</ul>
				</li>
			{/if}
		</ul>
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
		padding: 0 1rem;
		display: grid;
		place-items: center;

		ul,
		ul li ul {
			list-style: none;
			margin: 0;
			padding: 0;
			display: grid;
			gap: 0.5rem;

			li {
				padding: 0;
			}
		}

		> ul {
			grid-auto-flow: column;

			> li {
				margin: 0 0.5rem;
				a {
					text-decoration: none;
					text-align: center;
					display: inline-block;
					color: var(--link-color);
					transition: color 0.3s ease;
					font-size: 1.125rem;
				}

				> a {
					padding: 1rem 0.5rem;
				}
			}
		}
	}

	#dropdown-button {
		background-color: transparent;
		border: none;
		font-family: inherit;
		padding-block-end: 0.5rem;
	}

	#logout-form,
	button,
	#dropdown-button {
		text-decoration: none;
		text-align: center;
		display: inline-block;
		color: var(--link-color);
		font-weight: 500;
		transition: color 0.3s ease;
		font-size: 1.125rem;
	}

	#logout-form,
	button {
		padding: 0;
	}

	.dropdown {
		position: relative;

		&:hover,
		&:focus-within {
			.dropdown-menu {
				transform: rotateX(0deg) translateX(-50%);
				opacity: 1;
				visibility: visible;
			}
		}

		.dropdown-menu {
			background-color: var(--surface-color-1);
			border-radius: var(--radius-1);
			box-shadow: var(--shadow-1);
			padding: 0.5em 0;
			min-width: 15ch;
			position: absolute;
			top: calc(100% - 0.25rem);
			left: 50%;
			transform: rotateX(-90deg) translateX(-50%);
			transform-origin: top center;
			opacity: 0.3;
			transition: 280ms all 120ms ease-out;

			a {
				display: block;
				padding: 0.5em;
			}

			a:hover,
			button:hover {
				background-color: var(--surface-color-0);
			}

			@media (prefers-color-scheme: dark) {
				a:hover,
				button:hover {
					background-color: var(--surface-color-3);
				}
			}

			form {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0;
				margin: 0;
				width: 100%;
			}

			form button {
				padding: 0.5em;
				display: flex;
				justify-content: center;
				width: 100%;
				border-radius: 0;
			}
		}
	}

	nav ul li a,
	nav ul li button {
		font-weight: 500 !important;
	}
</style>
