<script lang="ts">
	import { browser } from '$app/environment';
	import { X } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		footer?: Snippet;
		title?: string;
		id?: string;
	};

	const { children, footer, title, id }: Props = $props();

	let dialog: HTMLDialogElement | null = null;
	let modal: HTMLDivElement | null = null;

	export function toggle() {
		if (browser) {
			if (dialog) {
				if (dialog.open) {
					dialog.close();
				} else {
					dialog.showModal();
					const dialogInputs = dialog.querySelectorAll('input, textarea, select');
					if (dialogInputs.length > 0) {
						dialogInputs[0].focus();
					}
				}
			}
		}
	}

	function modalAction(node: HTMLDivElement) {
		if (browser) {
			// Close the dialog when clicking outside of it
			function handleClick(event: Event) {
				const target = event.target as HTMLElement;
				if (node && node.contains(target)) {
					return;
				}

				if (dialog && dialog.open && dialog.contains(target)) {
					dialog.close();
				}
			}

			// Close the dialog when the Escape key is pressed
			function handleKeydown(event: KeyboardEvent) {
				if (event.key === 'Escape' && dialog && dialog.open) {
					dialog.close();
				}
			}

			document.addEventListener('click', handleClick);
			document.addEventListener('keydown', handleKeydown);

			return {
				destroy() {
					document.removeEventListener('click', handleClick);
					document.removeEventListener('keydown', handleKeydown);
				}
			};
		}
	}
</script>

<dialog bind:this={dialog} {id} popover>
	<div bind:this={modal} class="modal" use:modalAction>
		<div class="modal-header">
			{#if title}
				<h2>{title}</h2>
			{/if}
			<button class="text-button" onclick={toggle} aria-label="Close modal">
				<X size={'18px'} />
			</button>
		</div>
		<div class="modal-body">
			{@render children()}
		</div>
		<div class="modal-footer flex justify-end gap-2">
			{#if footer}
				{@render footer()}
			{/if}
		</div>
	</div>
</dialog>

<style>
	dialog {
		background-color: var(--surface-color-0);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-2);
		padding: 1rem;
		box-shadow: var(--shadow-2);
		color: var(--text-color);
		width: min(32rem, 100%);
		transition: display 0.5s ease-out;
		animation: close 0.5s forwards;

		&:open {
			animation: open 0.5s forwards;
		}

		&::backdrop {
			background-color: rgb(0 0 0 / 0.3);
			backdrop-filter: blur(4px);
			transition: opacity 0.3s ease;
			animation: fadeIn 0.3s forwards;

			&:exit {
				animation: fadeOut 0.3s forwards;
			}
		}
	}

	.modal {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;

		button {
			aspect-ratio: 1;
			width: 2rem;
			cursor: pointer;
			line-height: 1;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.modal-footer {
		width: 100%;
	}

	@keyframes open {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@keyframes close {
		from {
			opacity: 1;
			transform: translateY(0);
		}
		to {
			opacity: 0;
			transform: translateY(-10px);
		}
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes fadeOut {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
</style>
