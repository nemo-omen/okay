<script lang="ts">
	import type { Snippet, SvelteComponent } from 'svelte';
	import { fade } from 'svelte/transition';

	type Props = {
		navLabel?: string;
		menuTitle?: string;
		buttonContent?: Snippet;
		menuItems: Snippet;
	};

	const { navLabel, menuTitle, buttonContent, menuItems }: Props = $props();

	let isOpen = $state(false);

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function lightDismiss(node: HTMLElement) {
		if (node) {
			document.addEventListener('click', (event) => {
				if (!node.contains(event.target as Node)) {
					isOpen = false;
				}
			});
		}
	}
</script>

<div class="menu-container" use:lightDismiss>
	<button class="text-button" onclick={toggleMenu}>
		{#if buttonContent}
			{@render buttonContent()}
		{:else if menuTitle}
			<span>{menuTitle}</span>
		{:else}
			<span>Menu</span>
		{/if}
	</button>

	{#if isOpen}
		<menu aria-label={navLabel} transition:fade={{ duration: 200 }}>
			{@render menuItems()}
		</menu>
	{/if}
</div>

<style>
	.menu-container {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	menu {
		position: absolute;
		top: 100%;
		left: 0;
		background-color: var(--surface-color-1);
		border-radius: var(--radius-2);
		box-shadow: var(--shadow-1);
		padding: 1rem;
		z-index: 10;
	}
</style>
