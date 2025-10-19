<script lang="ts">
	import type { Bookmark, Collection, Kind } from '$lib/types';
	import { bookmarkStore } from '$lib/store.svelte';
	import { getFaviconUrl } from '$lib/utils';

	interface Props {
		bookmark?: Bookmark;
		collections: Collection[];
		kinds: Kind[];
		onClose: () => void;
		onSave: () => void;
	}

	let { bookmark, collections, kinds, onClose, onSave }: Props = $props();

	let formData = $state({
		title: bookmark?.title || '',
		url: bookmark?.url || '',
		description: bookmark?.description || '',
		collectionId: bookmark?.collectionId || '',
		kindId: bookmark?.kindId || '',
		tags: bookmark?.tags.join(', ') || '',
		status: bookmark?.status || 'unread'
	});

	function handleSubmit(e: Event) {
		e.preventDefault();

		const tags = formData.tags
			.split(',')
			.map((t) => t.trim())
			.filter((t) => t);

		if (bookmark) {
			bookmarkStore.updateBookmark(bookmark.id, {
				title: formData.title,
				url: formData.url,
				description: formData.description || undefined,
				collectionId: formData.collectionId || undefined,
				kindId: formData.kindId || undefined,
				tags,
				status: formData.status as Bookmark['status'],
				favicon: getFaviconUrl(formData.url)
			});
		} else {
			bookmarkStore.addBookmark({
				title: formData.title,
				url: formData.url,
				description: formData.description || undefined,
				collectionId: formData.collectionId || undefined,
				kindId: formData.kindId || undefined,
				tags,
				status: formData.status as Bookmark['status'],
				favicon: getFaviconUrl(formData.url)
			});
		}

		onSave();
	}
</script>

<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onclick={onClose} role="dialog" tabindex="-1">
	<div class="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onclick={(e) => e.stopPropagation()} role="document">
		<div class="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
			<h2 class="m-0 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
				{bookmark ? '✏️ Edit' : '➕ Add'} Bookmark
			</h2>
			<button class="bg-none border-none text-3xl cursor-pointer text-gray-400 p-0 w-10 h-10 flex items-center justify-center leading-none hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all" onclick={onClose}>
				×
			</button>
		</div>

		<form onsubmit={handleSubmit} class="p-6">
			<div class="mb-5">
				<label for="title" class="block mb-2 font-semibold text-gray-700">Title *</label>
				<input
					type="text"
					id="title"
					bind:value={formData.title}
					required
					placeholder="Bookmark title"
					class="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
				/>
			</div>

			<div class="mb-5">
				<label for="url" class="block mb-2 font-semibold text-gray-700">URL *</label>
				<input
					type="url"
					id="url"
					bind:value={formData.url}
					required
					placeholder="https://example.com"
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
				<label for="collection" class="block mb-2 font-semibold text-gray-700">Collection</label>
				<select id="collection" bind:value={formData.collectionId} class="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
					<option value="">No collection</option>
					{#each collections as col}
						<option value={col.id}>{col.name}</option>
					{/each}
				</select>
			</div>
			
			<div class="mb-5">
				<label for="kind" class="block mb-2 font-semibold text-gray-700">Kind</label>
				<select id="kind" bind:value={formData.kindId} class="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
					<option value="">No kind</option>
					{#each kinds as kind}
						<option value={kind.id}>{kind.icon || '📄'} {kind.name}</option>
					{/each}
				</select>
			</div>

			<div class="mb-5">
				<label for="tags" class="block mb-2 font-semibold text-gray-700">Tags (comma-separated)</label>
				<input
					type="text"
					id="tags"
					bind:value={formData.tags}
					placeholder="tag1, tag2, tag3"
					class="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
				/>
			</div>

			<div class="mb-5">
				<label for="status" class="block mb-2 font-semibold text-gray-700">Status</label>
				<select id="status" bind:value={formData.status} class="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
					<option value="unread">🆕 Unread</option>
					<option value="reading">📖 Reading</option>
					<option value="completed">✅ Completed</option>
					<option value="archived">📦 Archived</option>
				</select>
			</div>

			<div class="flex gap-3 justify-end pt-4 border-t border-gray-200">
				<button type="button" onclick={onClose} class="px-6 py-3 bg-gray-100 text-gray-700 border-none rounded-lg cursor-pointer text-base font-semibold hover:bg-gray-200 transition-all">
					Cancel
				</button>
				<button type="submit" class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none rounded-lg cursor-pointer text-base font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg">
					Save
				</button>
			</div>
		</form>
	</div>
</div>
