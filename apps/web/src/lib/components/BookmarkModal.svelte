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

<div class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onclick={onClose} role="dialog" tabindex="-1">
	<div class="bg-neutral-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-800" onclick={(e) => e.stopPropagation()} role="document">
		<div class="flex justify-between items-center p-6 border-b border-neutral-800 bg-neutral-900">
			<h2 class="m-0 text-2xl font-bold text-blue-400">
				{bookmark ? '✏️ Edit' : '➕ Add'} Bookmark
			</h2>
			<button class="bg-none border-none text-3xl cursor-pointer text-neutral-500 p-0 w-10 h-10 flex items-center justify-center leading-none hover:text-white hover:bg-neutral-800 rounded-lg transition-all" onclick={onClose}>
				×
			</button>
		</div>

		<form onsubmit={handleSubmit} class="p-6">
			<div class="mb-5">
				<label for="title" class="block mb-2 font-semibold text-neutral-300">Title *</label>
				<input
					type="text"
					id="title"
					bind:value={formData.title}
					required
					placeholder="Bookmark title"
					class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-base text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-neutral-500"
				/>
			</div>

			<div class="mb-5">
				<label for="url" class="block mb-2 font-semibold text-neutral-300">URL *</label>
				<input
					type="url"
					id="url"
					bind:value={formData.url}
					required
					placeholder="https://example.com"
					class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-base text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-neutral-500"
				/>
			</div>

			<div class="mb-5">
				<label for="description" class="block mb-2 font-semibold text-neutral-300">Description</label>
				<textarea
					id="description"
					bind:value={formData.description}
					placeholder="Optional description"
					rows="3"
					class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-base text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none placeholder-neutral-500"
				></textarea>
			</div>

			<div class="mb-5">
				<label for="collection" class="block mb-2 font-semibold text-neutral-300">Collection</label>
				<select id="collection" bind:value={formData.collectionId} class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-base text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all">
					<option value="">No collection</option>
					{#each collections as col}
						<option value={col.id}>{col.name}</option>
					{/each}
				</select>
			</div>
			
			<div class="mb-5">
				<label for="kind" class="block mb-2 font-semibold text-neutral-300">Kind</label>
				<select id="kind" bind:value={formData.kindId} class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-base text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all">
					<option value="">No kind</option>
					{#each kinds as kind}
						<option value={kind.id}>{kind.icon || '📄'} {kind.name}</option>
					{/each}
				</select>
			</div>

			<div class="mb-5">
				<label for="tags" class="block mb-2 font-semibold text-neutral-300">Tags (comma-separated)</label>
				<input
					type="text"
					id="tags"
					bind:value={formData.tags}
					placeholder="tag1, tag2, tag3"
					class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-base text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-neutral-500"
				/>
			</div>

			<div class="mb-5">
				<label for="status" class="block mb-2 font-semibold text-neutral-300">Status</label>
				<select id="status" bind:value={formData.status} class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-base text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all">
					<option value="unread">🆕 Unread</option>
					<option value="reading">📖 Reading</option>
					<option value="completed">✅ Completed</option>
					<option value="archived">📦 Archived</option>
				</select>
			</div>

			<div class="flex gap-3 justify-end pt-4 border-t border-neutral-800">
				<button type="button" onclick={onClose} class="px-6 py-3 bg-neutral-800 text-neutral-300 border-none rounded-lg cursor-pointer text-base font-semibold hover:bg-neutral-700 transition-all">
					Cancel
				</button>
				<button type="submit" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg cursor-pointer text-base font-semibold transition-all shadow-md hover:shadow-lg">
					Save
				</button>
			</div>
		</form>
	</div>
</div>
