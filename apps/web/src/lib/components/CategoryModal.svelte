<script lang="ts">
	import type { Category } from '$lib/types';
	import { bookmarkStore } from '$lib/store.svelte';

	interface Props {
		category?: Category;
		parentId?: string;
		categories: Category[];
		onClose: () => void;
		onSave: () => void;
	}

	let { category, parentId, categories, onClose, onSave }: Props = $props();

	let formData = $state({
		name: category?.name || '',
		parentId: category?.parentId || parentId || '',
		order: category?.order || categories.length
	});

	function handleSubmit(e: Event) {
		e.preventDefault();

		if (category) {
			bookmarkStore.updateCategory(category.id, {
				name: formData.name,
				parentId: formData.parentId || undefined,
				order: formData.order
			});
		} else {
			bookmarkStore.addCategory({
				name: formData.name,
				parentId: formData.parentId || undefined,
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
				{category ? '✏️ Edit' : '➕ Add'} Category
			</h2>
			<button class="bg-none border-none text-3xl cursor-pointer text-gray-400 p-0 w-10 h-10 flex items-center justify-center leading-none hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all" onclick={onClose}>×</button>
		</div>

		<form onsubmit={handleSubmit} class="p-6">
			<div class="mb-5">
				<label for="name" class="block mb-2 font-semibold text-gray-700">Category Name *</label>
				<input
					type="text"
					id="name"
					bind:value={formData.name}
					required
					placeholder="e.g., Frontend Development"
					class="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
				/>
			</div>

			<div class="mb-5">
				<label for="parent" class="block mb-2 font-semibold text-gray-700">Parent Category</label>
				<select id="parent" bind:value={formData.parentId} class="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
					<option value="">No parent (root category)</option>
					{#each categories.filter((c) => !category || c.id !== category.id) as cat}
						<option value={cat.id}>{cat.name}</option>
					{/each}
				</select>
			</div>

			<div class="flex gap-3 justify-end pt-4 border-t border-gray-200">
				<button type="button" onclick={onClose} class="px-6 py-3 bg-gray-100 text-gray-700 border-none rounded-lg cursor-pointer text-base font-semibold hover:bg-gray-200 transition-all">Cancel</button>
				<button type="submit" class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none rounded-lg cursor-pointer text-base font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg">Save</button>
			</div>
		</form>
	</div>
</div>
