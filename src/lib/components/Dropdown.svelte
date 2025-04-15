<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		menuTitle: string;
		menuItems: Snippet;
	};

	const { navLabel, menuTitle, menuItems }: Props = $props();
</script>

<button>
	{menuTitle}
</button>
<menu>
	{@render menuItems()}
</menu>

<style></style>
