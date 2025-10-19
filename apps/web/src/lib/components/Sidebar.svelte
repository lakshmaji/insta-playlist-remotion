<script lang="ts">
	import type { Collection, Kind, Tag } from '$lib/types';

	interface Props {
		selectedSection: string;
		onSelectSection: (section: string) => void;
		kinds: Kind[];
		collections: Collection[];
		tags: Tag[];
		selectedKindId?: string;
		selectedCollectionId?: string;
		selectedTagId?: string;
		onSelectKind: (kindId: string | undefined) => void;
		onSelectCollection: (collectionId: string | undefined) => void;
		onSelectTag: (tagId: string | undefined) => void;
		onAddKind: () => void;
		onAddBookmark: () => void;
		onAddCollection: () => void;
		onAddTag: () => void;
	}

	let { 
		selectedSection, 
		onSelectSection, 
		kinds,
		collections = [],
		tags = [], 
		selectedKindId, 
		selectedCollectionId,
		selectedTagId,
		onSelectKind, 
		onSelectCollection = () => {},
		onSelectTag = () => {},
		onAddKind, 
		onAddBookmark = () => {}, 
		onAddCollection = () => {},
		onAddTag = () => {} 
	}: Props = $props();
	
	// Get root collections (no parentId)
	const rootCollections = $derived(collections.filter(c => !c.parentId));
</script>

<div class="bg-neutral-900 p-0 h-full overflow-y-auto flex flex-col text-white">
	<!-- Top buttons -->
	<div class="p-3 flex flex-col gap-2">
		<button 
			onclick={onAddBookmark}
			class="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md w-full hover:bg-neutral-800 transition-all">
			<span class="text-lg">+</span>
			<span>New ...</span>
		</button>
		<button 
			onclick={onAddCollection}
			class="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-md w-full hover:bg-neutral-700 transition-all">
			<span class="text-lg">📁</span>
			<span>New ...</span>
		</button>
	</div>
	
	<!-- Dashboard section -->
	<div class="p-3 mb-2">
		<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 hover:bg-neutral-800" 
			onclick={() => onSelectSection('dashboard')} role="button" tabindex="0">
			<span class="text-lg">🏠</span>
			<span>Dashboard</span>
		</div>
	</div>

	<!-- Navigation section -->
	<div class="p-3">
		<h3 class="text-sm font-semibold text-neutral-400 uppercase mb-2">Navigation</h3>
		<div class="flex flex-col gap-1">
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'inbox' ? 'bg-neutral-800 font-semibold' : 'hover:bg-neutral-800'}" 
				onclick={() => onSelectSection('inbox')} role="button" tabindex="0">
				<span class="text-lg">📥</span>
				<span>Inbox</span>
			</div>
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'all' ? 'bg-neutral-800 font-semibold' : 'hover:bg-neutral-800'}" 
				onclick={() => onSelectSection('all')} role="button" tabindex="0">
				<span class="text-lg">�</span>
				<span>All Bookmarks</span>
			</div>
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'favorites' ? 'bg-neutral-800 font-semibold' : 'hover:bg-neutral-800'}" 
				onclick={() => onSelectSection('favorites')} role="button" tabindex="0">
				<span class="text-lg">⭐</span>
				<span>Favorites</span>
			</div>
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'reading' ? 'bg-neutral-800 font-semibold' : 'hover:bg-neutral-800'}" 
				onclick={() => onSelectSection('reading')} role="button" tabindex="0">
				<span class="text-lg">📖</span>
				<span>Reading List</span>
			</div>
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'collections' ? 'bg-neutral-800 font-semibold' : 'hover:bg-neutral-800'}" 
				onclick={() => onSelectSection('collections')} role="button" tabindex="0">
				<span class="text-lg">📁</span>
				<span>Collections</span>
			</div>
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'tags' ? 'bg-neutral-800 font-semibold' : 'hover:bg-neutral-800'}" 
				onclick={() => onSelectSection('tags')} role="button" tabindex="0">
				<span class="text-lg">🏷️</span>
				<span>Tags</span>
			</div>
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'archive' ? 'bg-neutral-800 font-semibold' : 'hover:bg-neutral-800'}" 
				onclick={() => onSelectSection('archive')} role="button" tabindex="0">
				<span class="text-lg">🗃️</span>
				<span>Archive</span>
			</div>
		</div>
	</div>

	<!-- Collections section -->
	<div class="p-3">
		<div class="flex justify-between items-center mb-2">
			<h3 class="text-sm font-semibold text-neutral-400 uppercase">Collections</h3>
			<button onclick={onAddCollection} class="text-neutral-400 hover:text-white transition-all">
				<span class="text-lg">+</span>
			</button>
		</div>
		<div class="flex flex-col gap-1">
			{#each rootCollections as collection}
				<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedCollectionId === collection.id ? 'bg-neutral-800 font-semibold' : 'hover:bg-neutral-800'}" 
					onclick={() => onSelectCollection(collection.id)} role="button" tabindex="0">
					<span class="text-lg">📁</span>
					<span>{collection.name}</span>
				</div>
			{/each}
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 hover:bg-neutral-800 text-neutral-400" 
				onclick={onAddCollection} role="button" tabindex="0">
				<span>+ New page</span>
			</div>
		</div>
	</div>

	<!-- Kind section -->
	<div class="p-3">
		<div class="flex justify-between items-center mb-2">
			<h3 class="text-sm font-semibold text-neutral-400 uppercase">Kind</h3>
			<button onclick={onAddKind} class="text-neutral-400 hover:text-white transition-all">
				<span class="text-lg">+</span>
			</button>
		</div>
		<div class="flex flex-col gap-1">
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {!selectedKindId ? 'bg-neutral-800 font-semibold' : 'hover:bg-neutral-800'}" 
				onclick={() => onSelectKind(undefined)} role="button" tabindex="0">
				<span class="text-lg">📋</span>
				<span>Articles</span>
			</div>
			
			{#each kinds as kind}
				<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedKindId === kind.id ? 'bg-neutral-800 font-semibold' : 'hover:bg-neutral-800'}" 
					onclick={() => onSelectKind(kind.id)} role="button" tabindex="0">
					<span class="text-lg">{kind.icon || '📁'}</span>
					<span>{kind.name}</span>
				</div>
			{/each}
		</div>
	</div>
	
	<!-- Tags section -->
	<div class="p-3">
		<div class="flex justify-between items-center mb-2">
			<h3 class="text-sm font-semibold text-neutral-400 uppercase">Tags</h3>
			<button onclick={onAddTag} class="text-neutral-400 hover:text-white transition-all">
				<span class="text-lg">+</span>
			</button>
		</div>
		<div class="flex flex-col gap-1">
			{#each tags as tag}
				<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedTagId === tag.id ? 'bg-neutral-800 font-semibold' : 'hover:bg-neutral-800'}" 
					onclick={() => onSelectTag(tag.id)} role="button" tabindex="0">
					<span class="text-lg" style="color: {tag.color || 'currentColor'}">🏷️</span>
					<span>{tag.name}</span>
				</div>
			{/each}
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 hover:bg-neutral-800 text-neutral-400" 
				onclick={onAddTag} role="button" tabindex="0">
				<span>+ New page</span>
			</div>
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