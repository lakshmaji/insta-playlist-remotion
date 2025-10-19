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
		unread: { bg: 'bg-blue-900/50', text: 'text-blue-300', icon: '🆕' },
		reading: { bg: 'bg-purple-900/50', text: 'text-purple-300', icon: '📖' },
		completed: { bg: 'bg-green-900/50', text: 'text-green-300', icon: '✅' },
		archived: { bg: 'bg-amber-900/50', text: 'text-amber-300', icon: '📦' }
	};
</script>

<div class="group bg-neutral-800 rounded-md border border-neutral-700 overflow-hidden transition-all hover:border-blue-500">
	<div class="relative w-full h-44 overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-800 flex items-center justify-center">
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
			<a href={bookmark.url} target="_blank" rel="noopener noreferrer" class="font-bold text-white text-lg hover:text-blue-400 transition-colors line-clamp-2 block">
				{bookmark.title}
			</a>
		</div>

		{#if bookmark.description}
			<p class="text-sm text-neutral-400 mb-3 line-clamp-2">
				{bookmark.description}
			</p>
		{/if}

		<div class="flex flex-wrap gap-2 mb-3">
			{#each bookmark.tags as tag}
				<span class="bg-neutral-700 text-neutral-300 px-2 py-1 rounded text-xs">
					#{tag}
				</span>
			{/each}
		</div>

		<div class="flex items-center justify-between mt-auto pt-2 border-t border-neutral-700">
			<div class="flex items-center text-neutral-400">
				<div class="w-5 h-5 mr-2 flex items-center justify-center overflow-hidden">
					{#if bookmark.favicon}
						<img src={bookmark.favicon} alt="" class="w-full h-full object-contain" />
					{:else}
						<span class="text-xs">🔖</span>
					{/if}
				</div>
				<span class="text-xs truncate max-w-[140px]">{new URL(bookmark.url).hostname}</span>
			</div>

			<div class="opacity-0 group-hover:opacity-100 transition-opacity">
				<div class="flex gap-1">
					<button
						class="p-1.5 rounded-full hover:bg-neutral-700 transition-colors text-neutral-400 hover:text-white"
						onclick={() => onEdit(bookmark)}
					>
						<span class="text-xs">✏️</span>
					</button>
					<button
						class="p-1.5 rounded-full hover:bg-neutral-700 transition-colors text-neutral-400 hover:text-white"
						onclick={() => onDelete(bookmark.id)}
					>
						<span class="text-xs">🗑️</span>
					</button>
					<div class="relative group/status">
						<button
							class="p-1.5 rounded-full hover:bg-neutral-700 transition-colors text-neutral-400 hover:text-white"
						>
							<span class="text-xs">⚙️</span>
						</button>
						<div class="absolute right-0 top-full mt-1 hidden group-hover/status:block bg-neutral-800 border border-neutral-700 rounded-md shadow-lg overflow-hidden z-10">
							<button
								class="w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 transition-colors text-neutral-300"
								onclick={() => onStatusChange(bookmark.id, 'unread')}
							>
								🆕 Mark as Unread
							</button>
							<button
								class="w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 transition-colors text-neutral-300"
								onclick={() => onStatusChange(bookmark.id, 'reading')}
							>
								📖 Mark as Reading
							</button>
							<button
								class="w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 transition-colors text-neutral-300"
								onclick={() => onStatusChange(bookmark.id, 'completed')}
							>
								✅ Mark as Completed
							</button>
							<button
								class="w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 transition-colors text-neutral-300"
								onclick={() => onStatusChange(bookmark.id, 'archived')}
							>
								📦 Archive
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
