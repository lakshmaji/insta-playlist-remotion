<script lang="ts">
	import type { Kind } from '$lib/types';

	interface Props {
		selectedSection: string;
		onSelectSection: (section: string) => void;
		kinds: Kind[];
		selectedKindId?: string;
		onSelectKind: (kindId: string | undefined) => void;
		onAddKind: () => void;
		onAddBookmark: () => void;
		onAddCollection: () => void;
	}

	let { 
		selectedSection, 
		onSelectSection, 
		kinds, 
		selectedKindId, 
		onSelectKind, 
		onAddKind, 
		onAddBookmark = () => {}, 
		onAddCollection = () => {} 
	}: Props = $props();
</script>

<div class="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm p-0 h-full overflow-y-auto flex flex-col">
	<!-- Top buttons -->
	<div class="p-3 border-b border-gray-200 flex flex-col gap-2">
		<button 
			onclick={onAddBookmark}
			class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-lg w-full shadow-sm hover:shadow-md transition-all">
			<span class="text-lg">+</span>
			<span>New Bookmark</span>
		</button>
		<button 
			onclick={onAddCollection}
			class="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg w-full bg-white hover:bg-gray-50 transition-all">
			<span class="text-lg">+</span>
			<span>New Collection</span>
		</button>
	</div>

	<!-- Navigation section -->
	<div class="p-3 border-b border-gray-200">
		<h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">Navigation</h3>
		<div class="flex flex-col gap-1">
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'inbox' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}" 
				onclick={() => onSelectSection('inbox')} role="button" tabindex="0">
				<span class="text-lg">📥</span>
				<span>Inbox</span>
			</div>
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'all' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}" 
				onclick={() => onSelectSection('all')} role="button" tabindex="0">
				<span class="text-lg">📚</span>
				<span>All Bookmarks</span>
			</div>
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'favorites' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}" 
				onclick={() => onSelectSection('favorites')} role="button" tabindex="0">
				<span class="text-lg">⭐</span>
				<span>Favorites</span>
			</div>
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'reading' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}" 
				onclick={() => onSelectSection('reading')} role="button" tabindex="0">
				<span class="text-lg">📖</span>
				<span>Reading List</span>
			</div>
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'collections' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}" 
				onclick={() => onSelectSection('collections')} role="button" tabindex="0">
				<span class="text-lg">📁</span>
				<span>Collections</span>
			</div>
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'tags' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}" 
				onclick={() => onSelectSection('tags')} role="button" tabindex="0">
				<span class="text-lg">🏷️</span>
				<span>Tags</span>
			</div>
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'archive' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}" 
				onclick={() => onSelectSection('archive')} role="button" tabindex="0">
				<span class="text-lg">🗃️</span>
				<span>Archive</span>
			</div>
		</div>
	</div>

	<!-- Kind section -->
	<div class="p-3">
		<div class="flex justify-between items-center mb-2">
			<h3 class="text-sm font-semibold text-gray-500 uppercase">Kind</h3>
			<button onclick={onAddKind} class="text-gray-500 hover:text-gray-700 transition-all">
				+
			</button>
		</div>
		<div class="flex flex-col gap-1">
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {!selectedKindId ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}" 
				onclick={() => onSelectKind(undefined)} role="button" tabindex="0">
				<span class="text-lg">�</span>
				<span>All Types</span>
			</div>
			
			{#each kinds as kind}
				<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedKindId === kind.id ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}" 
					onclick={() => onSelectKind(kind.id)} role="button" tabindex="0">
					<span class="text-lg">{kind.icon || '�'}</span>
					<span>{kind.name}</span>
				</div>
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
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: 20px;
	}

	div::-webkit-scrollbar-thumb:hover {
		background-color: rgba(0, 0, 0, 0.2);
	}
</style>