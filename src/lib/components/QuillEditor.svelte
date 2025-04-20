<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { browser } from '$app/environment';
	import { setContext } from 'svelte';
	import type { Action } from 'svelte/action';

	type Props = {
		value: string | null;
		blur: () => void;
	};

	let { value = $bindable(), blur }: Props = $props();

	let localValue = $state<string | null>(value ?? null);
	let editorElement: HTMLDivElement | null = null;

	// let editor: HTMLDivElement | null = null;
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

	const initQuill: Action<HTMLDivElement, any> = (element) => {
		if (browser) {
			const enterBinding = {
				key: ['S', 's'],
				shortKey: true,
				altKey: false,
				ctrlKey: true,
				metaKey: true,
				handler: function () {
					console.log('Tab pressed');
					this.quill.blur();
					blur();
				}
			};

			import('quill').then(({ default: Quill }) => {
				quill = new Quill(element, {
					theme: 'snow',
					modules: {
						toolbar,
						keyboard: {
							bindings: {
								tab: enterBinding
							}
						}
					}
				});
				quill.clipboard.dangerouslyPasteHTML(value || '', 'user');
				quill.on('text-change', onTextChange);
				quill.on('selection-change', (range) => {
					if (range) {
						console.log('Selection changed:', range);
					} else {
						console.log('Selection lost');
					}
				});
			});

			const qlEditor = editorElement?.querySelector('.ql-editor');

			qlEditor?.addEventListener('focus', () => {
				console.log('Editor focused');
			});

			qlEditor?.addEventListener('blur', () => {
				console.log('Editor blurred');
				blur();
			});

			qlEditor?.addEventListener('input', () => {
				console.log('Editor input detected');
			});
		}

		return {
			destroy() {
				if (quill) {
					quill.off('text-change', onTextChange);
					quill = null;
				}
			}
		};
	};
</script>

<div use:initQuill class="editor" id="editor" bind:this={editorElement}></div>

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
