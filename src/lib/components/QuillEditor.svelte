<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { browser } from '$app/environment';
	import { setContext } from 'svelte';

	type Props = {
		value: string | null;
	};

	let { value = $bindable() }: Props = $props();

	let localValue = $state<string | null>(value ?? null);

	let editor: HTMLDivElement | null = null;
	let quill: Quill | null;
	const toolbar = [
		['bold', 'italic', 'underline', 'strike'],
		['link', 'blockquote', 'code-block'],
		[{ font: [] }],
		[{ header: [1, 2, 3, 4, 5, 6, false] }],
		[{ align: [] }],
		[{ color: [] }, { background: [] }],

		[{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
		[{ script: 'sub' }, { script: 'super' }],
		[{ indent: '-1' }, { indent: '+1' }],
		[{ direction: 'rtl' }],
		['clean']
	];

	function onTextChange() {
		const html = quill.getSemanticHTML();
		localValue = html;
		value = html;
	}

	$effect(() => {
		if (quill && value && value !== localValue) {
			quill.clipboard.dangerouslyPasteHTML(value || '', 'user');
		}
	});

	onMount(async () => {
		if (browser) {
			const Quill = (await import('quill')).default;
			if (editor) {
				quill = new Quill(editor, {
					theme: 'snow',
					modules: { toolbar }
				});

				quill.clipboard.dangerouslyPasteHTML(value || '', 'user');
				quill.on('text-change', onTextChange);

				return () => {
					quill.off('text-change', onTextChange);
				};
			}
		}
	});
</script>

<div bind:this={editor} class="editor"></div>

<style>
	.editor {
		height: 300px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	:global(.ql-toolbar) {
		border-bottom: none;
	}

	:global(.ql-container) {
		height: 100%;
	}

	:global(.ql-editor) {
		min-height: 200px; /* Set a minimum height for the editor */
	}
	:global(.ql-toolbar) {
		background-color: var(--surface-color-1); /* Set a background color for the toolbar */
	}
</style>
