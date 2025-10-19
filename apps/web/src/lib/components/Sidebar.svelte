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

<div class="bg-neutral-900 p-0 h-full overflow-y-auto flex flex-col text-white sidebar-content">
	<!-- Top buttons -->
	<div class="p-4 flex flex-col gap-2 border-b border-neutral-800">
		<button 
			onclick={onAddBookmark}
			class="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg w-full hover:bg-blue-700 transition-all font-medium">
			<span class="text-base">+</span>
			<span>New Bookmark</span>
		</button>
		<button 
			onclick={onAddCollection}
			class="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 rounded-lg w-full hover:bg-neutral-700 transition-all">
			<span class="text-base">📁</span>
			<span>New Collection</span>
		</button>
	</div>

	<!-- Dashboard section -->
	<div class="px-4 py-3 border-b border-neutral-800">
		<button 
			class="w-full py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 hover:bg-neutral-800 {selectedSection === 'dashboard' ? 'bg-neutral-800' : ''}" 
			onclick={() => onSelectSection('dashboard')}>
			<span class="text-base">🏠</span>
			<span class="text-sm font-medium">Dashboard</span>
		</button>
	</div>

	<!-- Navigation section -->
	<div class="px-4 py-3 border-b border-neutral-800">
		<h3 class="text-xs font-semibold text-neutral-500 uppercase mb-3 px-3">Navigation</h3>
		<div class="flex flex-col gap-0.5">
			<button 
				class="w-full py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 {selectedSection === 'inbox' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}" 
				onclick={() => onSelectSection('inbox')}>
				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
					<path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
					<path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path>
				</svg>
				<span class="text-sm">Inbox</span>
			</button>
			<button 
				class="w-full py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 {selectedSection === 'all' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}" 
				onclick={() => onSelectSection('all')}>
				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
					<path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
				</svg>
				<span class="text-sm">All Bookmarks</span>
			</button>
			<button 
				class="w-full py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 {selectedSection === 'favorites' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}" 
				onclick={() => onSelectSection('favorites')}>
				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
				</svg>
				<span class="text-sm">Favorites</span>
			</button>
			<button 
				class="w-full py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 {selectedSection === 'reading' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}" 
				onclick={() => onSelectSection('reading')}>
				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
					<path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
				</svg>
				<span class="text-sm">Reading List</span>
			</button>
			<button 
				class="w-full py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 {selectedSection === 'collections' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}" 
				onclick={() => onSelectSection('collections')}>
				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
					<path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
				</svg>
				<span class="text-sm">Collections</span>
			</button>
			<button 
				class="w-full py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 {selectedSection === 'tags' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}" 
				onclick={() => onSelectSection('tags')}>
				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
				</svg>
				<span class="text-sm">Tags</span>
			</button>
			<button 
				class="w-full py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 {selectedSection === 'archive' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}" 
				onclick={() => onSelectSection('archive')}>
				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
					<path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"></path>
					<path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd"></path>
				</svg>
				<span class="text-sm">Archive</span>
			</button>
		</div>
	</div>

	<!-- Collections section -->
	<div class="px-4 py-3 border-b border-neutral-800">
		<div class="flex justify-between items-center mb-3 px-3">
			<h3 class="text-xs font-semibold text-neutral-500 uppercase">Collections</h3>
			<button onclick={onAddCollection} class="text-neutral-500 hover:text-white transition-all">
				<span class="text-sm">+</span>
			</button>
		</div>
		<div class="flex flex-col gap-0.5">
			{#each rootCollections.slice(0, 3) as collection}
				<button 
					class="w-full py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 text-neutral-400 hover:bg-neutral-800 hover:text-white {selectedCollectionId === collection.id ? 'bg-neutral-800 text-white' : ''}" 
					onclick={() => onSelectCollection(collection.id)}>
					<span class="text-base">📁</span>
					<span class="text-sm truncate">{collection.name}</span>
				</button>
			{/each}
			<button 
				class="w-full py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 hover:bg-neutral-800 text-neutral-500 hover:text-white" 
				onclick={onAddCollection}>
				<span class="text-xs">+ New Collection</span>
			</button>
		</div>
	</div>

	<!-- Kind section -->
	<div class="px-4 py-3">
		<div class="flex justify-between items-center mb-3 px-3">
			<h3 class="text-xs font-semibold text-neutral-500 uppercase">Kind</h3>
			<button onclick={onAddKind} class="text-neutral-500 hover:text-white transition-all">
				<span class="text-sm">+</span>
			</button>
		</div>
		<div class="flex flex-col gap-0.5">
			{#each kinds as kind}
				<button 
					class="w-full py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 text-neutral-400 hover:bg-neutral-800 hover:text-white {selectedKindId === kind.id ? 'bg-neutral-800 text-white' : ''}" 
					onclick={() => onSelectKind(kind.id)}>
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd"></path>
						<path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"></path>
					</svg>
					<span class="text-sm">{kind.name}</span>
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
	.sidebar-content::-webkit-scrollbar {
		width: 6px;
	}

	.sidebar-content::-webkit-scrollbar-track {
		background: transparent;
	}

	.sidebar-content::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 20px;
	}

	.sidebar-content::-webkit-scrollbar-thumb:hover {
		background-color: rgba(255, 255, 255, 0.2);
	}
</style>