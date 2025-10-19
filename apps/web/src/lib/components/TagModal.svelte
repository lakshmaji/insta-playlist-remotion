<script lang="ts">
	import type { Tag } from '$lib/types';
	import { bookmarkStore } from '$lib/store.svelte';

	interface Props {
		tag?: Tag;
		tags: Tag[];
		onClose: () => void;
		onSave: () => void;
	}

	let { tag, tags, onClose, onSave }: Props = $props();

	let formData = $state({
		name: tag?.name || '',
		color: tag?.color || '#3B82F6' // Default blue color
	});

	// Predefined color options
	const colorOptions = [
		'#3B82F6', // Blue
		'#8B5CF6', // Purple
		'#EC4899', // Pink
		'#EF4444', // Red
		'#F97316', // Orange
		'#EAB308', // Yellow
		'#84CC16', // Lime
		'#22C55E', // Green
		'#14B8A6', // Teal
		'#06B6D4', // Cyan
		'#6B7280', // Gray
		'#A855F7', // Violet
		'#F59E0B', // Amber
		'#10B981', // Emerald
		'#F43F5E', // Rose
		'#6366F1', // Indigo
	];

	function handleSubmit(e: Event) {
		e.preventDefault();

		if (tag) {
			bookmarkStore.updateTag(tag.id, {
				name: formData.name,
				color: formData.color
			});
		} else {
			bookmarkStore.addTag({
				name: formData.name,
				color: formData.color
			});
		}

		onSave();
	}
</script>

<div class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onclick={onClose} role="dialog" tabindex="-1">
	<div class="bg-neutral-900 rounded-xl w-full max-w-lg shadow-2xl border border-neutral-800" onclick={(e) => e.stopPropagation()} role="document">
		<div class="flex justify-between items-center p-6 border-b border-neutral-800 bg-neutral-900">
			<h2 class="m-0 text-2xl font-bold text-blue-400">
				{tag ? '✏️ Edit' : '➕ Add'} Tag
			</h2>
			<button class="bg-none border-none text-3xl cursor-pointer text-neutral-500 p-0 w-10 h-10 flex items-center justify-center leading-none hover:text-white hover:bg-neutral-800 rounded-lg transition-all" onclick={onClose}>×</button>
		</div>

		<form onsubmit={handleSubmit} class="p-6">
			<div class="mb-5">
				<label for="name" class="block mb-2 font-semibold text-neutral-300">Tag Name *</label>
				<input
					type="text"
					id="name"
					bind:value={formData.name}
					required
					placeholder="e.g., Important, Work, Personal"
					class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-base text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-neutral-500"
				/>
			</div>

			<div class="mb-5">
				<label class="block mb-2 font-semibold text-neutral-300">Color</label>
				<div class="grid grid-cols-8 gap-2">
					{#each colorOptions as color}
						<button
							type="button"
							class="w-full aspect-square rounded-lg cursor-pointer transition-all border-2 {formData.color === color ? 'border-white scale-110' : 'border-transparent hover:border-neutral-600'}"
							style="background-color: {color}"
							onclick={() => formData.color = color}
							title={color}
						>
							{#if formData.color === color}
								<svg class="w-full h-full p-2" fill="white" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
							{/if}
						</button>
					{/each}
				</div>
				
				<!-- Custom color picker -->
				<div class="mt-3 flex items-center gap-3">
					<label for="custom-color" class="text-sm text-neutral-400">Custom color:</label>
					<div class="flex items-center gap-2">
						<input
							type="color"
							id="custom-color"
							bind:value={formData.color}
							class="w-12 h-12 bg-transparent border-0 rounded cursor-pointer"
						/>
						<input
							type="text"
							bind:value={formData.color}
							pattern="^#[0-9A-Fa-f]{6}$"
							placeholder="#000000"
							class="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-sm text-white w-28"
						/>
					</div>
				</div>
			</div>

			<div class="flex gap-3 justify-end pt-4 border-t border-neutral-800">
				<button type="button" onclick={onClose} class="px-6 py-3 bg-neutral-800 text-neutral-300 border-none rounded-lg cursor-pointer text-base font-semibold hover:bg-neutral-700 transition-all">Cancel</button>
				<button type="submit" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg cursor-pointer text-base font-semibold transition-all shadow-md hover:shadow-lg">Save</button>
			</div>
		</form>
	</div>
</div>