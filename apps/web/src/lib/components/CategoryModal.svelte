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

<div class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onclick={onClose} role="dialog" tabindex="-1">
	<div class="bg-neutral-900 rounded-xl w-full max-w-lg shadow-2xl border border-neutral-800" onclick={(e) => e.stopPropagation()} role="document">
		<div class="flex justify-between items-center p-6 border-b border-neutral-800 bg-neutral-900">
			<h2 class="m-0 text-2xl font-bold text-blue-400">
				{category ? '✏️ Edit' : '➕ Add'} Category
			</h2>
			<button class="bg-none border-none text-3xl cursor-pointer text-neutral-500 p-0 w-10 h-10 flex items-center justify-center leading-none hover:text-white hover:bg-neutral-800 rounded-lg transition-all" onclick={onClose}>×</button>
		</div>

		<form onsubmit={handleSubmit} class="p-6">
			<div class="mb-5">
				<label for="name" class="block mb-2 font-semibold text-neutral-300">Category Name *</label>
				<input
					type="text"
					id="name"
					bind:value={formData.name}
					required
					placeholder="e.g., Frontend Development"
					class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-base text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-neutral-500"
				/>
			</div>

			<div class="mb-5">
				<label for="parent" class="block mb-2 font-semibold text-neutral-300">Parent Category</label>
				<select id="parent" bind:value={formData.parentId} class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-base text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all">
					<option value="">No parent (root category)</option>
					{#each categories.filter((c) => !category || c.id !== category.id) as cat}
						<option value={cat.id}>{cat.name}</option>
					{/each}
				</select>
			</div>

			<div class="flex gap-3 justify-end pt-4 border-t border-neutral-800">
				<button type="button" onclick={onClose} class="px-6 py-3 bg-neutral-800 text-neutral-300 border-none rounded-lg cursor-pointer text-base font-semibold hover:bg-neutral-700 transition-all">Cancel</button>
				<button type="submit" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg cursor-pointer text-base font-semibold transition-all shadow-md hover:shadow-lg">Save</button>
			</div>
		</form>
	</div>
</div>
