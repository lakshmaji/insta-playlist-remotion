<script lang="ts">
	import type { Bookmark, Tag } from '$lib/types';

	interface Props {
		bookmarks: Bookmark[];
		allTags: string[];
		selectedTags?: string[];
		onSelectTag?: (tag: string) => void;
	}

	let { bookmarks, allTags, selectedTags = [], onSelectTag = () => {} }: Props = $props();

	// Count bookmarks for each tag
	const tagCounts = $derived(() => {
		const counts: Record<string, number> = {};
		allTags.forEach(tag => {
			counts[tag] = bookmarks.filter(b => b.tags.includes(tag)).length;
		});
		return counts;
	});

	// Color palette for tags
	const tagColors = [
		'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-red-500', 
		'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-teal-500'
	];

	function getTagColor(tag: string, index: number) {
		return tagColors[index % tagColors.length];
	}
</script>

<div class="bg-[#1a1a1a] h-full overflow-y-auto flex flex-col text-gray-300 border-l border-gray-800/50 tags-panel">
	<!-- Header -->
	<div class="px-5 py-4 border-b border-gray-800/50">
		<div class="flex items-center justify-between">
			<h2 class="text-base font-medium text-gray-300">Favorites</h2>
			<button class="text-gray-500 hover:text-gray-300 transition-all">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
				</svg>
			</button>
		</div>
	</div>

	<!-- Bookmarks Gallery -->
	<div class="px-5 py-4 border-b border-gray-800/50">
		<div class="flex items-center justify-between mb-3">
			<div class="flex items-center gap-2">
				<svg class="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
					<path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
				</svg>
				<button class="text-sm text-gray-400 hover:text-gray-300 transition-all flex items-center gap-1">
					<span>Bookmarks</span>
					<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
					</svg>
				</button>
			</div>
			<button class="text-gray-500 hover:text-gray-300 transition-all">
				<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
				</svg>
			</button>
		</div>
		
		<div class="grid grid-cols-2 gap-2">
			{#each bookmarks.slice(0, 4) as bookmark}
				<div class="bg-gray-800/30 rounded-md aspect-[4/3] overflow-hidden hover:ring-1 hover:ring-blue-500/50 transition-all cursor-pointer group">
					{#if bookmark.thumbnail}
						<img src={bookmark.thumbnail} alt={bookmark.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
					{:else}
						<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800/50 to-gray-900/50">
							<svg class="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
								<path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/>
							</svg>
						</div>
					{/if}
				</div>
			{/each}
		</div>
		
		<button class="w-full mt-3 py-2 px-3 bg-gray-800/30 hover:bg-gray-800/50 rounded-md text-xs transition-all flex items-center justify-center gap-1.5 text-gray-400 hover:text-gray-300">
			<span>+</span>
			<span>New page</span>
		</button>
	</div>

	<!-- Tags Section -->
	<div class="px-5 py-4">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-sm font-medium text-gray-300">Tags</h3>
			<div class="flex items-center gap-1">
				<button class="text-gray-500 hover:text-gray-300 transition-all p-1">
					<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
						<path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
					</svg>
				</button>
				<button class="text-gray-500 hover:text-gray-300 transition-all p-1">
					<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
					</svg>
				</button>
			</div>
		</div>

		<div class="space-y-1">
			{#each allTags.slice(0, 12) as tag, index}
				{@const color = getTagColor(tag, index)}
				<button 
					onclick={() => onSelectTag(tag)}
					class="w-full flex items-center gap-2.5 py-2 px-3 rounded-md hover:bg-gray-800/30 transition-all text-left group {selectedTags.includes(tag) ? 'bg-gray-800/30' : ''}">
					<div class="w-2 h-2 rounded-full {color} opacity-70 group-hover:opacity-100"></div>
					<span class="text-xs flex-1 text-gray-400 group-hover:text-gray-300">{tag}</span>
					<span class="text-[10px] text-gray-600 font-medium">
						{tagCounts()[tag] || 0} Bookmarks
					</span>
				</button>
			{/each}
			
			{#if allTags.length > 12}
				<button class="w-full py-2 text-xs text-gray-500 hover:text-gray-400 transition-all">
					Show all {allTags.length} tags...
				</button>
			{/if}
		</div>
		
		<button class="w-full mt-3 py-2 px-3 bg-gray-800/30 hover:bg-gray-800/50 rounded-md text-xs transition-all flex items-center justify-center gap-1.5 text-gray-400 hover:text-gray-300">
			<span>+</span>
			<span>New page</span>
		</button>
	</div>
</div>

<style>
	/* Custom scrollbar */
	.tags-panel::-webkit-scrollbar {
		width: 8px;
	}

	.tags-panel::-webkit-scrollbar-track {
		background: transparent;
	}

	.tags-panel::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.05);
		border-radius: 10px;
		border: 2px solid transparent;
		background-clip: content-box;
	}

	.tags-panel::-webkit-scrollbar-thumb:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}
</style>
