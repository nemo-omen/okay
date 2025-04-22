<script lang="ts">
	import type { Action } from 'svelte/action';
	import { browser } from '$app/environment';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import toggleUnderline from '@tiptap/extension-underline';

	import {
		Bold,
		Italic,
		Strikethrough,
		Heading1,
		Heading2,
		Heading3,
		Heading4,
		AlignLeft,
		AlignCenter,
		AlignRight,
		AlignJustify,
		Underline
	} from '@lucide/svelte';
	import { fade, fly } from 'svelte/transition';

	type Props = {
		value: string | null;
		placeholder?: string;
		blur: () => void;
		input: (content: string) => void;
	};

	let { value = $bindable(), placeholder = $bindable(), blur, input }: Props = $props();

	let editor: Editor | null = $state(null);
	let editorContainer: HTMLDivElement | null = $state(null);
	let hasFocus = $state(false);

	function handleFocus(ed: Editor, event: Event) {
		hasFocus = true;
		if (editor?.getText() === placeholder) {
			editor.commands.clearContent();
		}
	}

	function handleBlur(ed: Editor, event: Event) {
		console.log(document.activeElement);
		if (editorContainer?.contains(document.activeElement)) {
			hasFocus = true;
			return;
		}

		if (editor?.getText() === '') {
			editor.commands.setContent(placeholder);
			hasFocus = false;
			return;
		}

		hasFocus = false;
		blur();
	}

	const initTipTap: Action<HTMLDivElement, any> = (node) => {
		if (browser) {
			editor = new Editor({
				element: node,
				extensions: [StarterKit],
				content: value ?? placeholder ?? '',
				onFocus({ editor, event }) {
					handleFocus(editor, event);
				},
				onBlur({ editor, event }) {
					handleBlur(editor, event);
				},
				onUpdate({ editor }) {
					value = editor.getHTML();
					input(value);
				}
			});
		}

		return {
			destroy() {
				if (editor) {
					editor.destroy();
				}
			}
		};
	};

	function focusAction(node: HTMLDivElement) {
		node.addEventListener('focusin', () => {
			hasFocus = true;
		});

		node.addEventListener('focusout', (event) => {
			hasFocus = false;
		});
		return {
			destroy() {
				node.removeEventListener('focusin', () => {});
				node.removeEventListener('focusout', () => {});
			}
		};
	}
</script>

<div class="editor-container" bind:this={editorContainer} use:focusAction>
	{#if value === placeholder}
		<div class="placeholder">{placeholder}</div>
	{/if}
	<div class="tiptap-editor" use:initTipTap></div>
	<!-- {#if hasFocus} -->
	<div class="editor-toolbar">
		<div class="flex button-group">
			<button onclick={() => editor.chain().focus().toggleBold().run()} tabindex="-1">
				<Bold size="16px" />
			</button>
			<button onclick={() => editor.chain().focus().toggleItalic().run()} tabindex="-1">
				<Italic size="16px" />
			</button>
			<button onclick={() => editor.chain().focus().toggleUnderline().run()} tabindex="-1">
				<Underline size="16px" />
			</button>
			<button onclick={() => editor.chain().focus().toggleStrike().run()} tabindex="-1">
				<Strikethrough size="16px" />
			</button>
			<button
				onclick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
				tabindex="-1"
			>
				<Heading1 size="16px" />
			</button>
			<button
				onclick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
				tabindex="-1"
			>
				<Heading2 size="16px" />
			</button>
			<button
				onclick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
				tabindex="-1"
			>
				<Heading3 size="16px" />
			</button>
			<button
				onclick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
				tabindex="-1"
			>
				<Heading4 size="16px" />
			</button>
		</div>
		<div class="button-group">
			<button onclick={() => editor.chain().focus().setTextAlign('left').run()} tabindex="-1">
				<AlignLeft size="16px" />
			</button>
			<button onclick={() => editor.chain().focus().setTextAlign('center').run()} tabindex="-1">
				<AlignCenter size="16px" />
			</button>
			<button onclick={() => editor.chain().focus().setTextAlign('right').run()} tabindex="-1">
				<AlignRight size="16px" />
			</button>
			<button onclick={() => editor.chain().focus().setTextAlign('justify').run()} tabindex="-1">
				<AlignJustify size="16px" />
			</button>
		</div>
		<div class="button-group">
			<button tabindex="-1"></button>
			<button tabindex="-1"></button>
			<button tabindex="-1"></button>
		</div>
	</div>
	<!-- {/if} -->
</div>

<style>
	:focus {
		outline: 2px solid tomato;
	}
	.editor-container:focus-within {
		border: 1px solid var(--border-color);
	}

	.tiptap-editor {
		min-height: 4rem;
		max-height: 16rem;
		overflow-y: auto;
		padding-inline: 1rem;
		padding-block-end: 1rem;

		:global(.ProseMirror) {
			margin-top: 0;
			min-height: 4rem;
			max-height: 16rem;

			&:focus {
				outline-color: transparent;
			}
		}
	}

	:global(.tiptap-editor:has(.ProseMirror:focus)) {
		outline: 2px solid var(--focus-color);
		outline-offset: -2px;
	}

	.editor-toolbar {
		min-height: 2rem;
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		opacity: 0;
		transform: translateY(-20px);
		transition:
			opacity 0.2s ease-in-out,
			transform 0.2s ease-in-out;
		pointer-events: none;
	}

	.button-group {
		display: flex;
		gap: 0;

		button {
			aspect-ratio: 1;
		}
	}

	.button-group button:first-child {
		border-radius: 0.5rem 0 0 0.5rem;
	}

	.button-group button:last-child {
		border-radius: 0 0.5rem 0.5rem 0;
	}

	.button-group button:not(:first-child, :last-child) {
		border-radius: 0;
		border-inline: 0.5px solid var(--border-color);
	}

	.editor-container:focus-within .editor-toolbar {
		opacity: 1;
		transform: translateY(0);
		pointer-events: all;
	}
</style>
