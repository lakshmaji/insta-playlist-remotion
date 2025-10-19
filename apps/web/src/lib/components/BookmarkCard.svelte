<script lang="ts">
	import type { Bookmark } from '$lib/types';
	import { getFaviconUrl } from '$lib/utils';

	interface Props {
		bookmark: Bookmark;
		onEdit: (bookmark: Bookmark) => void;
		onDelete: (id: string) => void;
		onStatusChange: (id: string, status: Bookmark['status']) => void;
	}

	let { bookmark, onEdit, onDelete, onStatusChange }: Props = $props();

	const statusConfig = {
		unread: { bg: 'bg-gray-100', text: 'text-gray-700', icon: '🆕' },
		reading: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '📖' },
		completed: { bg: 'bg-green-100', text: 'text-green-700', icon: '✅' },
		archived: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '📦' }
	};
</script>

<div class="group bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300">
	<div class="relative w-full h-44 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
		{#if bookmark.thumbnail}
			<img src={bookmark.thumbnail} alt={bookmark.title} class="w-full h-full object-cover" />
		{:else}
			<div class="flex items-center justify-center w-full h-full">
				<img src={getFaviconUrl(bookmark.url)} alt="" class="w-16 h-16 object-contain opacity-80" />
			</div>
		{/if}
		<div class="absolute top-2 right-2">
			<span class="{statusConfig[bookmark.status].bg} {statusConfig[bookmark.status].text} px-3 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm bg-opacity-90">
				{statusConfig[bookmark.status].icon} {bookmark.status}
			</span>
		</div>
	</div>

	<div class="p-4">
		<div class="mb-3">
			<a href={bookmark.url} target="_blank" rel="noopener noreferrer" class="font-bold text-gray-900 text-lg hover:text-blue-600 transition-colors line-clamp-2 block">
				{bookmark.title}
			</a>
		</div>

		{#if bookmark.description}
			<p class="text-sm text-gray-600 mb-3 line-clamp-2">
				{bookmark.description}
			</p>
		{/if}

		{#if bookmark.tags.length > 0}
			<div class="flex flex-wrap gap-2 mb-4">
				{#each bookmark.tags as tag}
					<span class="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-medium border border-blue-200">
						#{tag}
					</span>
				{/each}
			</div>
		{/if}

		<div class="flex gap-2 pt-3 border-t border-gray-100">
			<select
				value={bookmark.status}
				onchange={(e) => onStatusChange(bookmark.id, e.currentTarget.value as Bookmark['status'])}
				class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
			>
				<option value="unread">🆕 Unread</option>
				<option value="reading">📖 Reading</option>
				<option value="completed">✅ Completed</option>
				<option value="archived">📦 Archived</option>
			</select>

			<button onclick={() => onEdit(bookmark)} class="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium text-sm hover:bg-blue-600 transition-all shadow-sm hover:shadow-md">
				Edit
			</button>
			<button onclick={() => onDelete(bookmark.id)} class="px-4 py-2 bg-red-500 text-white rounded-lg font-medium text-sm hover:bg-red-600 transition-all shadow-sm hover:shadow-md">
				Delete
			</button>
		</div>
	</div>
</div>
