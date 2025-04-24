<script lang="ts">
	import { getIconNames, getIcon, getIcons } from '$lib/util/icons';
	import { onMount } from 'svelte';

	type Props = {
		setIcon: (iconName: string) => void;
	};

	const { setIcon }: Props = $props();

	let searchTerm = $state('');
	let filteredIcons = $state(getIconNames());

	function applyFilter() {
		if (searchTerm === '') {
			filteredIcons = getInitialIcons();
			return;
		}
		filteredIcons = getIconNames().filter((icon) =>
			icon.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}

	function clearFilter() {
		searchTerm = '';
		filteredIcons = getInitialIcons();
	}

	function getInitialIcons() {
		return getIconNames().slice(0, 20);
	}

	onMount(() => {
		filteredIcons = getInitialIcons();
	});
</script>

<div class="grid-container">
	<input
		type="search"
		name="search"
		id="search"
		bind:value={searchTerm}
		placeholder="Search icons..."
		oninput={applyFilter}
		autocomplete="off"
	/>

	<div class="icon-grid">
		{#each filteredIcons as iconName}
			<button
				class="icon-button"
				aria-label={iconName as string}
				title={iconName as string}
				onclick={() => setIcon(iconName)}
			>
				<svelte:component this={getIcon(iconName)}></svelte:component>
			</button>
		{/each}
	</div>
</div>

<style>
	.grid-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.icon-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(2.5rem, 1fr));
		gap: 1rem;

		button {
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
