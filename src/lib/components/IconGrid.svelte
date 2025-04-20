<script lang="ts">
	import { getIconNames, getIcon, getIcons } from '$lib/util/icons';
	let searchTerm = $state('');
	let filteredIcons = $state(getIconNames());

	function setIcon(iconName: string) {
		//
	}
</script>

<input
	type="search"
	name="search"
	id="search"
	bind:value={searchTerm}
	placeholder="Search icons..."
	oninput={() =>
		(filteredIcons = getIconNames().filter((icon) =>
			icon.toLowerCase().includes(searchTerm.toLowerCase())
		))}
/>

<div class="icon-grid">
	{#each filteredIcons as iconName}
		<button class="icon-button" aria-label={iconName as string} title={iconName as string}>
			<svelte:component this={getIcon(iconName)}></svelte:component>
		</button>
	{/each}
</div>

<style>
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
