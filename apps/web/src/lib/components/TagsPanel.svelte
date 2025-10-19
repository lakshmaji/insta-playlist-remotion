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

<div class="bg-neutral-900 h-full overflow-y-auto flex flex-col text-white border-l border-neutral-800">
	<!-- Header -->
	<div class="px-4 py-4 border-b border-neutral-800">
		<div class="flex items-center justify-between mb-2">
			<h2 class="text-lg font-semibold">Favorites</h2>
		</div>
		<div class="flex items-center gap-2 mt-3">
			<svg class="w-4 h-4 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
				<path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
			</svg>
			<button class="text-sm text-neutral-400 hover:text-white transition-all flex items-center gap-1">
				<span>Bookmarks</span>
				<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
				</svg>
			</button>
			<button class="ml-auto text-neutral-400 hover:text-white transition-all">
				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path>
				</svg>
			</button>
		</div>
	</div>

	<!-- Bookmark cards preview -->
	<div class="px-4 py-4 border-b border-neutral-800">
		<div class="grid grid-cols-2 gap-2">
			{#each bookmarks.slice(0, 4) as bookmark}
				<div class="bg-neutral-800 rounded-lg aspect-square overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer">
					{#if bookmark.thumbnail}
						<img src={bookmark.thumbnail} alt={bookmark.title} class="w-full h-full object-cover" />
					{:else}
						<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-700 to-neutral-800">
							<span class="text-2xl opacity-50">🔖</span>
						</div>
					{/if}
				</div>
			{/each}
		</div>
		<button class="w-full mt-3 py-2 px-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm transition-all flex items-center justify-center gap-2">
			<span>+ New page</span>
		</button>
	</div>

	<!-- Tags Section -->
	<div class="px-4 py-4">
		<div class="flex items-center justify-between mb-3">
			<h3 class="text-base font-semibold">Tags</h3>
			<button class="text-neutral-400 hover:text-white transition-all">
				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
					<path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
				</svg>
			</button>
		</div>

		<div class="flex flex-col gap-2">
			{#each allTags.slice(0, 10) as tag, index}
				<button 
					onclick={() => onSelectTag(tag)}
					class="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-neutral-800 transition-all text-left {selectedTags.includes(tag) ? 'bg-neutral-800' : ''}">
					<div class="w-3 h-3 rounded-full {getTagColor(tag, index)}"></div>
					<span class="text-sm flex-1 text-neutral-300">{tag}</span>
					<span class="text-xs text-neutral-500 font-medium">
						{tagCounts()[tag] || 0}
					</span>
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
	/* Custom scrollbar */
	div::-webkit-scrollbar {
		width: 6px;
	}

	div::-webkit-scrollbar-track {
		background: transparent;
	}

	div::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 20px;
	}

	div::-webkit-scrollbar-thumb:hover {
		background-color: rgba(255, 255, 255, 0.2);
	}
</style>
