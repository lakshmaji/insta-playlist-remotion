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
		bookmarks?: any[];
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
		onAddTag = () => {},
		bookmarks = []
	}: Props = $props();

	// Get root collections (no parentId)
	const rootCollections = $derived(collections.filter(c => !c.parentId));

	// Expandable states
	let kindsExpanded = $state(true);
	let collectionsExpanded = $state(true);
	let tagsExpanded = $state(true);

	// Count bookmarks for each category
	function countBookmarks(filterKey: string, value: string) {
		if (!bookmarks) return 0;
		if (filterKey === 'kind') {
			return bookmarks.filter(b => b.kindId === value).length;
		} else if (filterKey === 'collection') {
			return bookmarks.filter(b => b.collectionId === value).length;
		} else if (filterKey === 'tag') {
			return bookmarks.filter(b => b.tags && b.tags.includes(value)).length;
		}
		return 0;
	}
</script>

<div class="bg-[#1a1a1a] p-0 h-full overflow-y-auto flex flex-col text-gray-300 sidebar-content">
	<!-- Header Section with Title -->
	<div class="px-4 py-3 border-b border-gray-800/50">
		<div class="flex items-center justify-between">
			<h2 class="text-sm font-medium text-gray-400">Bookmarks Manager</h2>
			<button class="text-gray-500 hover:text-gray-300 transition-all" title="Settings">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
			</button>
		</div>
	</div>

	<!-- Action Buttons -->
	<div class="px-3 py-3 space-y-1.5">
		<button 
			onclick={onAddBookmark}
			class="flex items-center gap-2 px-3 py-2 w-full text-left text-sm rounded-md hover:bg-gray-800/50 transition-all">
			<span class="text-gray-400">+</span>
			<span>New Bookmark</span>
		</button>
		<button 
			onclick={onAddCollection}
			class="flex items-center gap-2 px-3 py-2 w-full text-left text-sm rounded-md hover:bg-gray-800/50 transition-all">
			<svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
				<path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
			</svg>
			<span>New Collection</span>
		</button>
	</div>

	<!-- Dashboard -->
	<div class="px-3 py-1">
		<button 
			class="w-full px-3 py-2 text-left text-sm rounded-md flex items-center gap-2 transition-all {selectedSection === 'dashboard' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-gray-800/50'}" 
			onclick={() => onSelectSection('dashboard')}>
			<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
				<path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
			</svg>
			<span>Dashboard</span>
		</button>
	</div>

	<!-- Navigation section -->
	<div class="mt-4 mb-4">
		<div class="px-4 mb-2">
			<h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Navigation</h3>
		</div>
		<div class="px-3 space-y-0.5">
			<button 
				class="w-full px-3 py-2 text-left text-sm rounded-md flex items-center gap-2 transition-all {selectedSection === 'inbox' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-gray-800/50'}" 
				onclick={() => onSelectSection('inbox')}>
				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
					<path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
					<path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path>
				</svg>
				<span>Inbox</span>
			</button>
			<button 
				class="w-full px-3 py-2 text-left text-sm rounded-md flex items-center gap-2 transition-all {selectedSection === 'all' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-gray-800/50'}" 
				onclick={() => onSelectSection('all')}>
				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
					<path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
				</svg>
				<span>All Bookmarks</span>
			</button>
			<button 
				class="w-full px-3 py-2 text-left text-sm rounded-md flex items-center gap-2 transition-all {selectedSection === 'favorites' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-gray-800/50'}" 
				onclick={() => onSelectSection('favorites')}>
				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
				</svg>
				<span>Favorites</span>
			</button>
			<button 
				class="w-full px-3 py-2 text-left text-sm rounded-md flex items-center gap-2 transition-all {selectedSection === 'reading' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-gray-800/50'}" 
				onclick={() => onSelectSection('reading')}>
				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
					<path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
				</svg>
				<span>Reading List</span>
			</button>
			<button 
				class="w-full px-3 py-2 text-left text-sm rounded-md flex items-center gap-2 transition-all {selectedSection === 'collections' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-gray-800/50'}" 
				onclick={() => onSelectSection('collections')}>
				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
					<path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
				</svg>
				<span>Collections</span>
			</button>
			<button 
				class="w-full px-3 py-2 text-left text-sm rounded-md flex items-center gap-2 transition-all {selectedSection === 'tags' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-gray-800/50'}" 
				onclick={() => onSelectSection('tags')}>
				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
				</svg>
				<span>Tags</span>
			</button>
			<button 
				class="w-full px-3 py-2 text-left text-sm rounded-md flex items-center gap-2 transition-all {selectedSection === 'archive' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-gray-800/50'}" 
				onclick={() => onSelectSection('archive')}>
				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
					<path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"></path>
					<path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd"></path>
				</svg>
				<span>Archive</span>
			</button>
		</div>
	</div>

	<!-- Kind section with expandable -->
	<div class="mb-4">
		<div class="px-4 mb-2">
			<button 
				class="w-full flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-300 transition-all"
				onclick={() => kindsExpanded = !kindsExpanded}>
				<span>Kind</span>
				<svg class="w-3 h-3 transition-transform {kindsExpanded ? 'rotate-90' : ''}" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
				</svg>
			</button>
		</div>
		{#if kindsExpanded}
			<div class="px-3 space-y-0.5">
				{#each kinds as kind}
					<button 
						class="w-full px-3 py-2 text-left text-sm rounded-md flex items-center justify-between transition-all {selectedKindId === kind.id ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-gray-800/50'}" 
						onclick={() => onSelectKind(kind.id)}>
						<div class="flex items-center gap-2">
							<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd"></path>
								<path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"></path>
							</svg>
							<span>{kind.name}</span>
						</div>
						{#if countBookmarks('kind', kind.id) > 0}
							<span class="text-xs text-gray-500">
								{countBookmarks('kind', kind.id)}
							</span>
						{/if}
					</button>
				{/each}
				<button 
					class="w-full px-3 py-2 text-left text-sm rounded-md flex items-center gap-2 text-gray-500 hover:bg-gray-800/50 hover:text-gray-300" 
					onclick={onAddKind}>
					<span class="text-xs">+</span>
					<span>New page</span>
				</button>
			</div>
		{/if}
	</div>

	<!-- Collections section with expandable (rename to Collections for consistency) -->
	<div class="mb-4">
		<div class="px-4 mb-2">
			<button 
				class="w-full flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-300 transition-all"
				onclick={() => collectionsExpanded = !collectionsExpanded}>
				<span>Collections</span>
				<svg class="w-3 h-3 transition-transform {collectionsExpanded ? 'rotate-90' : ''}" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
				</svg>
			</button>
		</div>
		{#if collectionsExpanded}
			<div class="px-3 space-y-0.5">
				{#each rootCollections as collection}
					<button 
						class="w-full px-3 py-2 text-left text-sm rounded-md flex items-center justify-between transition-all {selectedCollectionId === collection.id ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-gray-800/50'}" 
						onclick={() => onSelectCollection(collection.id)}>
						<div class="flex items-center gap-2">
							<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
							</svg>
							<span class="truncate">{collection.name}</span>
						</div>
						{#if countBookmarks('collection', collection.id) > 0}
							<span class="text-xs text-gray-500">
								{countBookmarks('collection', collection.id)}
							</span>
						{/if}
					</button>
				{/each}
				<button 
					class="w-full px-3 py-2 text-left text-sm rounded-md flex items-center gap-2 text-gray-500 hover:bg-gray-800/50 hover:text-gray-300" 
					onclick={onAddCollection}>
					<span class="text-xs">+</span>
					<span>New page</span>
				</button>
			</div>
		{/if}
	</div>

	<!-- Tags section with expandable -->
	<div class="mb-4">
		<div class="px-4 mb-2">
			<button 
				class="w-full flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-300 transition-all"
				onclick={() => tagsExpanded = !tagsExpanded}>
				<span>Tags</span>
				<svg class="w-3 h-3 transition-transform {tagsExpanded ? 'rotate-90' : ''}" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
				</svg>
			</button>
		</div>
		{#if tagsExpanded}
			<div class="px-3 space-y-0.5">
				{#each tags as tag}
					<button 
						class="w-full px-3 py-2 text-left text-sm rounded-md flex items-center justify-between transition-all {selectedTagId === tag.id ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-gray-800/50'}" 
						onclick={() => onSelectTag(tag.id)}>
						<div class="flex items-center gap-2">
							<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
							</svg>
							<span>{tag.name}</span>
						</div>
						{#if countBookmarks('tag', tag.name) > 0}
							<span class="text-xs text-gray-500">
								{countBookmarks('tag', tag.name)}
							</span>
						{/if}
					</button>
				{/each}
				<button 
					class="w-full px-3 py-2 text-left text-sm rounded-md flex items-center gap-2 text-gray-500 hover:bg-gray-800/50 hover:text-gray-300" 
					onclick={onAddTag}>
					<span class="text-xs">+</span>
					<span>New page</span>
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.sidebar-content::-webkit-scrollbar {
		width: 8px;
	}

	.sidebar-content::-webkit-scrollbar-track {
		background: transparent;
	}

	.sidebar-content::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.05);
		border-radius: 10px;
		border: 2px solid transparent;
		background-clip: content-box;
	}

	.sidebar-content::-webkit-scrollbar-thumb:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}
</style>