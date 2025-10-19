<script lang="ts">
	import type { Kind } from '$lib/types';
	import { bookmarkStore } from '$lib/store.svelte';

	interface Props {
		kind?: Kind;
		kinds: Kind[];
		onClose: () => void;
		onSave: () => void;
	}

	let { kind, kinds, onClose, onSave }: Props = $props();

	let formData = $state({
		name: kind?.name || '',
		description: kind?.description || '',
		icon: kind?.icon || '📄', // Default icon
		order: kind?.order || kinds.length
	});

	// Array of common icons to select from
	const iconOptions = [
		'📄', // Generic document (default)
		'📰', // Article
		'🛍️', // Shopping
		'🧰', // Tools
		'🎥', // Video
		'🎧', // Audio
		'📚', // Book
		'🎮', // Game
		'🖥️', // Software
		'📊', // Data
		'🔬', // Research
		'💼', // Business
		'🎨', // Art
		'🍔', // Food
		'✈️', // Travel
		'💡', // Idea
		'🧠', // Knowledge
	];

	function handleSubmit(e: Event) {
		e.preventDefault();

		if (kind) {
			bookmarkStore.updateKind(kind.id, {
				name: formData.name,
				description: formData.description || undefined,
				icon: formData.icon,
				order: formData.order
			});
		} else {
			bookmarkStore.addKind({
				name: formData.name,
				description: formData.description || undefined,
				icon: formData.icon,
				order: formData.order
			});
		}

		onSave();
	}
</script>

<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onclick={onClose} role="dialog" tabindex="-1">
	<div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl" onclick={(e) => e.stopPropagation()} role="document">
		<div class="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
			<h2 class="m-0 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
				{kind ? '✏️ Edit' : '➕ Add'} Kind
			</h2>
			<button class="bg-none border-none text-3xl cursor-pointer text-gray-400 p-0 w-10 h-10 flex items-center justify-center leading-none hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all" onclick={onClose}>×</button>
		</div>

		<form onsubmit={handleSubmit} class="p-6">
			<div class="mb-5">
				<label for="name" class="block mb-2 font-semibold text-gray-700">Kind Name *</label>
				<input
					type="text"
					id="name"
					bind:value={formData.name}
					required
					placeholder="e.g., Articles, Videos, Shopping"
					class="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
				/>
			</div>

			<div class="mb-5">
				<label for="description" class="block mb-2 font-semibold text-gray-700">Description</label>
				<textarea
					id="description"
					bind:value={formData.description}
					placeholder="Optional description"
					rows="3"
					class="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
				></textarea>
			</div>

			<div class="mb-5">
				<label class="block mb-2 font-semibold text-gray-700">Icon</label>
				<div class="grid grid-cols-6 sm:grid-cols-8 gap-2">
					{#each iconOptions as icon}
						<button
							type="button"
							class="p-2 text-2xl flex items-center justify-center border rounded-lg cursor-pointer transition-all {formData.icon === icon ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}"
							onclick={() => formData.icon = icon}
						>
							{icon}
						</button>
					{/each}
				</div>
			</div>

			<div class="flex gap-3 justify-end pt-4 border-t border-gray-200">
				<button type="button" onclick={onClose} class="px-6 py-3 bg-gray-100 text-gray-700 border-none rounded-lg cursor-pointer text-base font-semibold hover:bg-gray-200 transition-all">Cancel</button>
				<button type="submit" class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none rounded-lg cursor-pointer text-base font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg">Save</button>
			</div>
		</form>
	</div>
</div>