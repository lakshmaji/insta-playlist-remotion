<script lang="ts">
	import type { Bookmark, Kind } from '$lib/types';
	import { getFaviconUrl } from '$lib/utils';

	interface Props {
		bookmark: Bookmark;
		kind?: Kind;
		onEdit: (bookmark: Bookmark) => void;
		onDelete: (id: string) => void;
		onStatusChange: (id: string, status: Bookmark['status']) => void;
	}

	let { bookmark, kind, onEdit, onDelete, onStatusChange }: Props = $props();

	const statusConfig = {
		unread: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: '🆕' },
		reading: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: '📖' },
		completed: { bg: 'bg-green-500/20', text: 'text-green-400', icon: '✅' },
		archived: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: '📦' }
	};

	// Get category badge color based on kind
	const kindColors: Record<string, string> = {
		'Tool': 'bg-orange-600',
		'Article': 'bg-amber-600',
		'Resource': 'bg-purple-600',
		'Shopping': 'bg-pink-600',
		'Videos': 'bg-red-600',
		'Websites': 'bg-blue-600'
	};
</script>

<div class="group bg-[#1a1a1a] rounded-lg overflow-hidden transition-all hover:bg-[#222] hover:shadow-xl border border-gray-800/50 hover:border-gray-700/50 cursor-pointer">
	<!-- Thumbnail Section -->
	<div class="relative w-full aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center">
		{#if bookmark.thumbnail}
			<img src={bookmark.thumbnail} alt={bookmark.title} class="w-full h-full object-cover" />
		{:else}
			<div class="flex flex-col items-center justify-center w-full h-full p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50">
				<img src={getFaviconUrl(bookmark.url)} alt="" class="w-12 h-12 object-contain mb-3" />
				<span class="text-gray-500 text-xs truncate max-w-full px-2">{new URL(bookmark.url).hostname}</span>
			</div>
		{/if}
		
		<!-- Overlay actions on hover -->
		<div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
			<button
				class="p-2.5 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition-colors text-white"
				onclick={(e) => { e.stopPropagation(); window.open(bookmark.url, '_blank'); }}
				title="Open"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
				</svg>
			</button>
			<button
				class="p-2.5 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition-colors text-white"
				onclick={(e) => { e.stopPropagation(); onEdit(bookmark); }}
				title="Edit"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
				</svg>
			</button>
			<button
				class="p-2.5 rounded-full bg-white/10 backdrop-blur hover:bg-red-600/50 transition-colors text-white"
				onclick={(e) => { e.stopPropagation(); onDelete(bookmark.id); }}
				title="Delete"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
				</svg>
			</button>
		</div>
		
		<!-- Category Badge in corner -->
		{#if kind}
			<div class="absolute top-2 left-2">
				<span class="{kindColors[kind.name] || 'bg-gray-700'} text-white px-2 py-0.5 rounded text-[10px] font-medium shadow-lg">
					{kind.name}
				</span>
			</div>
		{/if}
	</div>

	<!-- Content Section -->
	<div class="p-3">
		<!-- Favicon and URL -->
		<div class="flex items-center gap-2 mb-2">
			<img src={getFaviconUrl(bookmark.url)} alt="" class="w-4 h-4 rounded" />
			<span class="text-gray-500 text-xs truncate">{new URL(bookmark.url).hostname}</span>
		</div>
		
		<!-- Title -->
		<h3 class="font-medium text-gray-200 text-sm line-clamp-2 mb-1">
			{bookmark.title}
		</h3>
		
		<!-- Tags -->
		{#if bookmark.tags && bookmark.tags.length > 0}
			<div class="flex flex-wrap gap-1 mt-2">
				{#each bookmark.tags.slice(0, 3) as tag}
					<span class="bg-gray-800/50 text-gray-400 px-1.5 py-0.5 rounded text-[10px]">
						{tag}
					</span>
				{/each}
				{#if bookmark.tags.length > 3}
					<span class="text-gray-500 text-[10px]">+{bookmark.tags.length - 3}</span>
				{/if}
			</div>
		{/if}
	</div>
</div>
