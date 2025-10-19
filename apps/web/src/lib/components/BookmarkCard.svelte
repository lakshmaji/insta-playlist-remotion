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

<div class="group bg-neutral-800/50 rounded-xl overflow-hidden transition-all hover:bg-neutral-800 hover:shadow-xl border border-neutral-700/50 hover:border-neutral-600">
	<!-- Thumbnail Section -->
	<div class="relative w-full h-48 overflow-hidden bg-gradient-to-br from-neutral-800 via-neutral-900 to-black flex items-center justify-center">
		{#if bookmark.thumbnail}
			<img src={bookmark.thumbnail} alt={bookmark.title} class="w-full h-full object-cover" />
		{:else}
			<div class="flex items-center justify-center w-full h-full p-6">
				<img src={getFaviconUrl(bookmark.url)} alt="" class="w-20 h-20 object-contain opacity-60" />
			</div>
		{/if}
		
		<!-- Edit/Delete buttons overlay -->
		<div class="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
			<button
				class="p-2 rounded-lg bg-black/60 backdrop-blur-sm hover:bg-black/80 transition-colors text-white"
				onclick={() => onEdit(bookmark)}
				title="Edit"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
				</svg>
			</button>
			<button
				class="p-2 rounded-lg bg-black/60 backdrop-blur-sm hover:bg-red-600/80 transition-colors text-white"
				onclick={() => onDelete(bookmark.id)}
				title="Delete"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
				</svg>
			</button>
		</div>
	</div>

	<!-- Content Section -->
	<div class="p-4">
		<!-- Title -->
		<div class="mb-2">
			<a href={bookmark.url} target="_blank" rel="noopener noreferrer" class="font-semibold text-white text-base hover:text-blue-400 transition-colors line-clamp-2 block">
				{bookmark.title}
			</a>
		</div>

		<!-- Category Badge -->
		{#if kind}
			<div class="mb-3">
				<span class="{kindColors[kind.name] || 'bg-neutral-600'} text-white px-2 py-1 rounded text-xs font-medium">
					{kind.name}
				</span>
			</div>
		{/if}

		<!-- URL -->
		<div class="flex items-center text-neutral-400 text-xs mb-3">
			<span class="truncate">{new URL(bookmark.url).hostname}</span>
		</div>
	</div>
</div>
