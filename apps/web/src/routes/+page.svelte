<script lang="ts">
	import { bookmarkStore } from '$lib/store.svelte';
	import type { Bookmark, Collection, Kind, Tag } from '$lib/types';
	import BookmarkCard from '$lib/components/BookmarkCard.svelte';
	import CollectionTree from '$lib/components/CollectionTree.svelte';
	import BookmarkModal from '$lib/components/BookmarkModal.svelte';
	import CollectionModal from '$lib/components/CollectionModal.svelte';
	import KindModal from '$lib/components/KindModal.svelte';
	import TagModal from '$lib/components/TagModal.svelte';
	import KindSelector from '$lib/components/KindSelector.svelte';
	import ImportExportModal from '$lib/components/ImportExportModal.svelte';
	import TodoPanel from '$lib/components/TodoPanel.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import TagsPanel from '$lib/components/TagsPanel.svelte';

	let selectedCollectionId = $state<string | undefined>(undefined);
	let selectedKindId = $state<string | undefined>(undefined);
	let selectedTagId = $state<string | undefined>(undefined);
	let searchQuery = $state('');
	let selectedTags = $state<string[]>([]);
	let statusFilter = $state<Bookmark['status'] | 'all'>('all');
	let selectedSection = $state<string>('all');
	let viewMode = $state<'gallery' | 'list'>('gallery');
	let currentCollectionPath = $state<string[]>([]); // Array of collection IDs representing the current path

	let showBookmarkModal = $state(false);
	let showCollectionModal = $state(false);
	let showKindModal = $state(false);
	let showTagModal = $state(false);
	let showImportExportModal = $state(false);
	let editingBookmark = $state<Bookmark | undefined>(undefined);
	let editingCollection = $state<Collection | undefined>(undefined);
	let editingKind = $state<Kind | undefined>(undefined);
	let editingTag = $state<Tag | undefined>(undefined);
	let newCollectionParentId = $state<string | undefined>(undefined);

	const bookmarks = $derived(bookmarkStore.bookmarks);
	const collections = $derived(bookmarkStore.collections);
	const kinds = $derived(bookmarkStore.kinds);
	const tags = $derived(bookmarkStore.tags);
	const todos = $derived(bookmarkStore.todos);

	// Current parent collection (last in path, or undefined for root)
	const currentParentId = $derived(currentCollectionPath[currentCollectionPath.length - 1]);
	
	// Collections to display at current level
	const displayedCollections = $derived(() => {
		return collections.filter(c => c.parentId === currentParentId);
	});

	// Breadcrumb path for navigation
	const breadcrumbPath = $derived(() => {
		const path = [{ id: undefined, name: 'Collections' }]; // Root level
		for (const collectionId of currentCollectionPath) {
			const collection = collections.find(c => c.id === collectionId);
			if (collection) {
				path.push({ id: collectionId, name: collection.name });
			}
		}
		return path;
	});

	const filteredBookmarks = $derived(() => {
		let filtered = bookmarks;

		// Filter by collection
		if (selectedCollectionId) {
			filtered = filtered.filter((b) => b.collectionId === selectedCollectionId);
		}

		// Filter by kind
		if (selectedKindId) {
			filtered = filtered.filter((b) => b.kindId === selectedKindId);
		}

		// Filter by search query
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(b) =>
					b.title.toLowerCase().includes(query) ||
					b.url.toLowerCase().includes(query) ||
					b.description?.toLowerCase().includes(query)
			);
		}

		// Filter by tags
		if (selectedTags.length > 0) {
			filtered = filtered.filter((b) => selectedTags.every((tag) => b.tags.includes(tag)));
		}

		// Filter by status
		if (statusFilter !== 'all') {
			filtered = filtered.filter((b) => b.status === statusFilter);
		}

		return filtered;
	});

	const allTags = $derived(() => {
		const tagSet = new Set<string>();
		bookmarks.forEach((b) => b.tags.forEach((t) => tagSet.add(t)));
		return Array.from(tagSet).sort();
	});

	function openAddBookmark() {
		editingBookmark = undefined;
		showBookmarkModal = true;
	}

	function openEditBookmark(bookmark: Bookmark) {
		editingBookmark = bookmark;
		showBookmarkModal = true;
	}

	function closeBookmarkModal() {
		showBookmarkModal = false;
		editingBookmark = undefined;
	}

	function openAddCollection(parentId?: string) {
		editingCollection = undefined;
		newCollectionParentId = parentId;
		showCollectionModal = true;
	}

	function openEditCollection(collection: Collection) {
		editingCollection = collection;
		newCollectionParentId = undefined;
		showCollectionModal = true;
	}

	function closeCollectionModal() {
		showCollectionModal = false;
		editingCollection = undefined;
		newCollectionParentId = undefined;
	}
	
	function openAddKind() {
		editingKind = undefined;
		showKindModal = true;
	}

	function openEditKind(kind: Kind) {
		editingKind = kind;
		showKindModal = true;
	}

	function closeKindModal() {
		showKindModal = false;
		editingKind = undefined;
	}
	
	function openAddTag() {
		editingTag = undefined;
		showTagModal = true;
	}

	function openEditTag(tag: Tag) {
		editingTag = tag;
		showTagModal = true;
	}

	function closeTagModal() {
		showTagModal = false;
		editingTag = undefined;
	}

	function deleteBookmark(id: string) {
		if (confirm('Are you sure you want to delete this bookmark?')) {
			bookmarkStore.deleteBookmark(id);
		}
	}

	function deleteCollection(id: string) {
		const result = bookmarkStore.deleteCollection(id);
		if (!result.success) {
			alert(result.message);
		}
	}
	
	function deleteKind(id: string) {
		const result = bookmarkStore.deleteKind(id);
		if (!result.success) {
			alert(result.message);
		}
	}
	
	function deleteTag(id: string) {
		const result = bookmarkStore.deleteTag(id);
		if (!result.success) {
			alert(result.message);
		}
	}

	// Collection navigation functions
	function navigateToCollection(collectionId: string) {
		currentCollectionPath = [...currentCollectionPath, collectionId];
	}

	function navigateToBreadcrumb(targetId: string | undefined) {
		if (targetId === undefined) {
			// Navigate to root
			currentCollectionPath = [];
		} else {
			// Navigate to specific collection in path
			const index = currentCollectionPath.indexOf(targetId);
			if (index >= 0) {
				currentCollectionPath = currentCollectionPath.slice(0, index + 1);
			}
		}
	}

	function goBackToParent() {
		if (currentCollectionPath.length > 0) {
			currentCollectionPath = currentCollectionPath.slice(0, -1);
		}
	}

	function updateBookmarkStatus(id: string, status: Bookmark['status']) {
		bookmarkStore.updateBookmark(id, { status });
	}

	function toggleTag(tag: string) {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter((t) => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
	}
</script>

<div class="flex flex-col h-screen">
	<div class="flex-1 grid lg:grid-cols-[260px_1fr_300px] gap-0 w-full bg-[#111111]">
		<aside class="h-full lg:sticky lg:top-0 bg-[#1a1a1a] border-r border-gray-800/50">
			<Sidebar
				selectedSection={selectedSection}
				onSelectSection={(section) => {
					selectedSection = section;
					if (section === 'all') {
						selectedCollectionId = undefined;
					}
					if (section === 'inbox') {
						statusFilter = 'unread';
					} else if (section === 'reading') {
						statusFilter = 'reading';
					} else if (section === 'archive') {
						statusFilter = 'archived';
					} else {
						statusFilter = 'all';
					}
				}}
				kinds={kinds}
				collections={collections}
				tags={tags}
				bookmarks={bookmarks}
				selectedKindId={selectedKindId}
				selectedCollectionId={selectedCollectionId}
				selectedTagId={selectedTagId}
				onSelectKind={(id) => (selectedKindId = id)}
				onSelectCollection={(id) => (selectedCollectionId = id)}
				onSelectTag={(id) => (selectedTagId = id)}
				onAddKind={openAddKind}
				onEditKind={openEditKind}
				onDeleteKind={deleteKind}
				onEditCollection={openEditCollection}
				onDeleteCollection={deleteCollection}
				onAddTag={openAddTag}
				onEditTag={openEditTag}
				onDeleteTag={deleteTag}
				onAddBookmark={openAddBookmark}
				onAddCollection={openAddCollection}
			/>
		</aside>
		
		<div class="flex flex-col">
			{#if selectedSection === 'inbox'}
				<!-- Inbox (Todo) Section -->
				<header class="bg-neutral-800 text-white p-4 flex justify-between items-center">
					<h1 class="text-xl font-bold">Inbox</h1>
					<div class="flex gap-2">
						<button class="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 transition-all flex items-center gap-1">
							<span>New</span>
							<span class="text-xs">▼</span>
						</button>
					</div>
				</header>
				
				<main class="p-6 bg-neutral-950 text-white">
					{#if todos.length === 0}
						<div class="text-center py-16 px-8 bg-neutral-800/50 rounded-xl border border-neutral-700 mb-8">
							<div class="text-5xl mb-4">📝</div>
							<h2 class="text-2xl font-bold mb-3">No todos yet. Create one to get started!</h2>
							<button class="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 transition-all mt-4">
								+ Create todo
							</button>
						</div>
					{:else}
						<TodoPanel 
							{todos} 
							{bookmarks}
							onAddTodo={bookmarkStore.addTodo}
							onUpdateTodo={bookmarkStore.updateTodo}
							onDeleteTodo={bookmarkStore.deleteTodo}
							onToggleTodo={(id) => {
								const todo = todos.find(t => t.id === id);
								if (todo) {
									bookmarkStore.updateTodo(id, { completed: !todo.completed });
								}
							}}
						/>
					{/if}
				</main>
			{:else if selectedSection === 'collections'}
				<!-- Collections Section -->
				<header class="bg-neutral-800 text-white p-4 flex justify-between items-center">
					<div class="flex items-center gap-2">
						<!-- Back button (if not at root) -->
						{#if currentCollectionPath.length > 0}
							<button 
								onclick={goBackToParent}
								class="p-2 hover:bg-neutral-700 rounded-md transition-all"
								title="Go back"
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
								</svg>
							</button>
						{/if}
						
						<!-- Breadcrumb Navigation -->
						<div class="flex items-center gap-1">
							{#each breadcrumbPath as crumb, index}
								<button 
									onclick={() => navigateToBreadcrumb(crumb.id)}
									class="text-xl font-bold hover:text-blue-400 transition-all {index === breadcrumbPath.length - 1 ? 'text-white' : 'text-neutral-400'}"
								>
									{crumb.name}
								</button>
								{#if index < breadcrumbPath.length - 1}
									<span class="text-neutral-500 text-lg">/</span>
								{/if}
							{/each}
						</div>
					</div>
					
					<div class="flex gap-2">
						<button 
							onclick={() => openAddCollection(currentParentId)} 
							class="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 transition-all flex items-center gap-1"
						>
							<span>New Collection</span>
						</button>
					</div>
				</header>
				
				<main class="p-6 bg-neutral-950 text-white">
					{#if collections.length === 0}
						<div class="flex items-center justify-center min-h-[400px]">
							<button 
								onclick={() => openAddCollection(currentParentId)} 
								class="p-8 bg-neutral-800/50 rounded-xl border border-dashed border-neutral-600 hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all flex flex-col items-center gap-3"
							>
								<div class="text-6xl">📁</div>
								<span class="text-lg text-neutral-300">Add Collection</span>
							</button>
						</div>
					{:else if displayedCollections().length === 0}
						<div class="flex items-center justify-center min-h-[400px]">
							<button 
								onclick={() => openAddCollection(currentParentId)} 
								class="p-8 bg-neutral-800/50 rounded-xl border border-dashed border-neutral-600 hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all flex flex-col items-center gap-3"
							>
								<div class="text-6xl">+</div>
								<span class="text-lg text-neutral-300">Add Collection</span>
							</button>
						</div>
					{:else}
						<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{#each displayedCollections() as collection}
								{@const childCollections = collections.filter(c => c.parentId === collection.id)}
								{@const bookmarkCount = bookmarks.filter(b => b.collectionId === collection.id).length}
								{@const hasChildren = childCollections.length > 0}
								
								<div 
									role="button"
									tabindex="0"
									onclick={() => navigateToCollection(collection.id)}
									onkeydown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											navigateToCollection(collection.id);
										}
									}}
									class="p-6 bg-neutral-800 rounded-lg border border-neutral-700 hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer flex flex-col items-center group"
								>
									<div class="text-4xl mb-4">
										{hasChildren ? '📂' : '📁'}
									</div>
									<div class="text-lg font-medium text-center mb-2">{collection.name}</div>
									<div class="text-xs text-neutral-400 text-center">
										{#if hasChildren}
											{childCollections.length} collection{childCollections.length === 1 ? '' : 's'}
											{#if bookmarkCount > 0}
												• {bookmarkCount} bookmark{bookmarkCount === 1 ? '' : 's'}
											{/if}
										{:else}
											{bookmarkCount} bookmark{bookmarkCount === 1 ? '' : 's'}
										{/if}
									</div>
									
									<!-- Hover indicator for navigation -->
									{#if hasChildren}
										<div class="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
											<svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
											</svg>
										</div>
									{/if}
								</div>
							{/each}
							<div 
								role="button"
								tabindex="0"
								onclick={() => openAddCollection(currentParentId)} 
								onkeydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										openAddCollection(currentParentId);
									}
								}}
								class="p-6 bg-neutral-800/50 rounded-lg border border-dashed border-neutral-600 hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer flex flex-col items-center justify-center"
							>
								<div class="text-4xl mb-2">+</div>
								<div class="text-sm text-neutral-400">New Collection</div>
							</div>
						</div>
					{/if}
				</main>
			{:else}
				<!-- Bookmarks Section -->
				<header class="bg-[#1a1a1a] text-gray-300 px-6 py-3 border-b border-gray-800/50 flex justify-between items-center">
					<div class="flex items-center gap-4">
						<h1 class="text-lg font-medium">
							{#if selectedSection === 'all'}
								Inbox
							{:else if selectedSection === 'favorites'}
								Favorites
							{:else if selectedSection === 'reading'}
								Reading List
							{:else if selectedSection === 'tags'}
								Tags
							{:else if selectedSection === 'archive'}
								Archive
							{:else}
								Inbox
							{/if}
						</h1>
						<span class="text-sm text-gray-500">•</span>
						<span class="text-sm text-gray-500">{filteredBookmarks().length} items</span>
					</div>
					
					<div class="flex items-center gap-2">
						<!-- Settings Button Group -->
						<div class="flex items-center gap-1 px-2 py-1">
							<span class="text-xs text-gray-500 mr-2">Settings</span>
							
							<!-- View Mode -->
							<div class="flex items-center bg-gray-800/50 rounded-md p-0.5">
								<button class="{viewMode === 'gallery' ? 'bg-gray-700 text-blue-400' : 'text-gray-400'} p-1.5 rounded transition-all" 
									onclick={() => viewMode = 'gallery'} title="Gallery view">
									<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
										<path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
									</svg>
								</button>
								<button class="{viewMode === 'list' ? 'bg-gray-700 text-blue-400' : 'text-gray-400'} p-1.5 rounded transition-all" 
									onclick={() => viewMode = 'list'} title="List view">
									<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
									</svg>
								</button>
							</div>
							
							<!-- Sort -->
							<button class="p-1.5 rounded-md text-gray-400 hover:bg-gray-800/50 hover:text-gray-300 transition-all" title="Sort">
								<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9M3 12h5M3 16h7"/>
								</svg>
							</button>
							
							<!-- Today -->
							<button class="p-1.5 rounded-md text-gray-400 hover:bg-gray-800/50 hover:text-gray-300 transition-all" title="Today">
								<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
								</svg>
							</button>
							
							<!-- Week -->
							<button class="p-1.5 rounded-md text-gray-400 hover:bg-gray-800/50 hover:text-gray-300 transition-all" title="Week">
								<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd"/>
								</svg>
							</button>
						</div>
						
						<div class="h-4 w-px bg-gray-700"></div>
						
						<!-- Search -->
						<button class="p-1.5 rounded-md text-gray-400 hover:bg-gray-800/50 hover:text-gray-300 transition-all" title="Search">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
							</svg>
						</button>
						
						<!-- Full screen -->
						<button class="p-1.5 rounded-md text-gray-400 hover:bg-gray-800/50 hover:text-gray-300 transition-all" title="Full screen">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5h-4m4 0v-4"/>
							</svg>
						</button>
						
						<!-- Filter -->
						<button class="p-1.5 rounded-md text-gray-400 hover:bg-gray-800/50 hover:text-gray-300 transition-all" title="Filter">
							<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd"/>
							</svg>
						</button>
						
						<div class="h-4 w-px bg-gray-700"></div>
						
						<!-- New Bookmark -->
						<button onclick={openAddBookmark} class="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all flex items-center gap-1.5 text-sm font-medium">
							<span>New</span>
							<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
							</svg>
						</button>
					</div>
				</header>
				
				<main class="p-6 bg-[#111111]">
					<!-- Search bar (if needed) -->
					{#if searchQuery || selectedTags.length > 0}
					<div class="flex gap-4 mb-6">
						<div class="flex-1">
							<input
								type="text"
								placeholder="Search bookmarks..."
								class="w-full px-4 py-2 border border-neutral-700 rounded-lg bg-neutral-800 text-white focus:outline-none focus:border-blue-500 transition-all"
								bind:value={searchQuery}
							/>
						</div>
					</div>
					{/if}

					<!-- Bookmarks grid -->
					{#if filteredBookmarks().length === 0}
						<div class="text-center py-16 px-8 bg-gray-800/20 rounded-xl border border-gray-800/50">
							<svg class="w-16 h-16 mx-auto mb-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
								<path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/>
							</svg>
							<h2 class="text-xl font-semibold mb-2 text-gray-300">No bookmarks found</h2>
							<p class="text-gray-500 text-sm mb-6">Start by adding your first bookmark or adjust your filters.</p>
							<button
								onclick={openAddBookmark}
								class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-all"
							>
								+ Add Bookmark
							</button>
						</div>
					{:else}
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{#each filteredBookmarks() as bookmark (bookmark.id)}
								<BookmarkCard
									{bookmark}
									kind={kinds.find(k => k.id === bookmark.kindId)}
									onEdit={openEditBookmark}
									onDelete={deleteBookmark}
									onStatusChange={updateBookmarkStatus}
								/>
							{/each}
						</div>
					{/if}
				</main>
			{/if}
		</div>
		
		<!-- Right Sidebar - Tags Panel -->
		<aside class="h-full lg:sticky lg:top-0 bg-[#1a1a1a] border-r border-gray-800/50">
			<TagsPanel
				bookmarks={filteredBookmarks()}
				allTags={allTags()}
				selectedTags={selectedTags}
				onSelectTag={toggleTag}
			/>
		</aside>
	</div>
</div>

<!-- Modals -->
{#if showBookmarkModal}
	<BookmarkModal
		bookmark={editingBookmark}
		collections={collections}
		kinds={kinds}
		onSave={(data) => {
			if (editingBookmark) {
				bookmarkStore.updateBookmark(editingBookmark.id, data);
			} else {
				bookmarkStore.addBookmark(data);
			}
			closeBookmarkModal();
		}}
		onClose={closeBookmarkModal}
	/>
{/if}

{#if showCollectionModal}
	<CollectionModal
		collection={editingCollection}
		collections={collections}
		parentId={newCollectionParentId}
		onSave={(data) => {
			if (editingCollection) {
				bookmarkStore.updateCollection(editingCollection.id, data);
			} else {
				bookmarkStore.addCollection(data);
			}
			closeCollectionModal();
		}}
		onClose={closeCollectionModal}
	/>
{/if}

{#if showKindModal}
	<KindModal
		kind={editingKind}
		kinds={kinds}
		onSave={closeKindModal}
		onClose={closeKindModal}
	/>
{/if}

{#if showTagModal}
	<TagModal
		tag={editingTag}
		tags={tags}
		onSave={closeTagModal}
		onClose={closeTagModal}
	/>
{/if}

{#if showImportExportModal}
	<ImportExportModal
		{bookmarks}
		{collections}
		{kinds}
		{tags}
		{todos}
		onImport={(data) => {
			bookmarkStore.importData(data);
		}}
		onClose={() => (showImportExportModal = false)}
	/>
{/if}