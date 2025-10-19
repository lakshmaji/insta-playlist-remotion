<script lang="ts">
	import type { Collection } from '$lib/types';
	import { bookmarkStore } from '$lib/store.svelte';

	interface Props {
		collection?: Collection;
		parentId?: string;
		collections: Collection[];
		onClose: () => void;
		onSave: () => void;
	}

	let { collection, parentId, collections, onClose, onSave }: Props = $props();

	let formData = $state({
		name: collection?.name || '',
		parentId: collection?.parentId || parentId || '',
		order: collection?.order || collections.length
	});

	function handleSubmit(e: Event) {
		e.preventDefault();

		if (collection) {
			bookmarkStore.updateCollection(collection.id, {
				name: formData.name,
				parentId: formData.parentId || undefined,
				order: formData.order
			});
		} else {
			bookmarkStore.addCollection({
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
				{collection ? '✏️ Edit' : '➕ Add'} Collection
			</h2>
			<button class="bg-none border-none text-3xl cursor-pointer text-neutral-500 p-0 w-10 h-10 flex items-center justify-center leading-none hover:text-white hover:bg-neutral-800 rounded-lg transition-all" onclick={onClose}>×</button>
		</div>

		<form onsubmit={handleSubmit} class="p-6">
			<div class="mb-5">
				<label for="name" class="block mb-2 font-semibold text-neutral-300">Collection Name *</label>
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
				<label for="parent" class="block mb-2 font-semibold text-neutral-300">Parent Collection</label>
				<select id="parent" bind:value={formData.parentId} class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-base text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all">
					<option value="">No parent (root collection)</option>
					{#each collections.filter((c) => !collection || c.id !== collection.id) as col}
						<option value={col.id}>{col.name}</option>
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