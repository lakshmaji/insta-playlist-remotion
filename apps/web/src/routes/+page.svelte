<script lang="ts">
	import { bookmarkStore } from '$lib/store.svelte';
	import type { Bookmark, Collection, Kind } from '$lib/types';
	import BookmarkCard from '$lib/components/BookmarkCard.svelte';
	import CollectionTree from '$lib/components/CollectionTree.svelte';
	import BookmarkModal from '$lib/components/BookmarkModal.svelte';
	import CollectionModal from '$lib/components/CollectionModal.svelte';
	import KindModal from '$lib/components/KindModal.svelte';
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

	let showBookmarkModal = $state(false);
	let showCollectionModal = $state(false);
	let showKindModal = $state(false);
	let showImportExportModal = $state(false);
	let editingBookmark = $state<Bookmark | undefined>(undefined);
	let editingCollection = $state<Collection | undefined>(undefined);
	let editingKind = $state<Kind | undefined>(undefined);
	let newCollectionParentId = $state<string | undefined>(undefined);

	const bookmarks = $derived(bookmarkStore.bookmarks);
	const collections = $derived(bookmarkStore.collections);
	const kinds = $derived(bookmarkStore.kinds);
	const tags = $derived(bookmarkStore.tags);
	const todos = $derived(bookmarkStore.todos);

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

	function deleteBookmark(id: string) {
		if (confirm('Are you sure you want to delete this bookmark?')) {
			bookmarkStore.deleteBookmark(id);
		}
	}

	function deleteCollection(id: string) {
		if (confirm('Are you sure you want to delete this collection and all its subcollections?')) {
			bookmarkStore.deleteCollection(id);
		}
	}
	
	function deleteKind(id: string) {
		if (confirm('Are you sure you want to delete this kind?')) {
			bookmarkStore.deleteKind(id);
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
	<div class="flex-1 grid lg:grid-cols-[240px_1fr_280px] gap-0 max-w-screen-2xl mx-auto w-full bg-neutral-950">
		<aside class="h-full lg:sticky lg:top-0 bg-neutral-900">
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
				selectedKindId={selectedKindId}
				selectedCollectionId={selectedCollectionId}
				selectedTagId={selectedTagId}
				onSelectKind={(id) => (selectedKindId = id)}
				onSelectCollection={(id) => (selectedCollectionId = id)}
				onSelectTag={(id) => (selectedTagId = id)}
				onAddKind={openAddKind}
				onAddBookmark={openAddBookmark}
				onAddCollection={openAddCollection}
				onAddTag={() => {}}
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
					<h1 class="text-xl font-bold">Collections</h1>
					<div class="flex gap-2">
						<button onclick={openAddCollection} class="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 transition-all flex items-center gap-1">
							<span>New Collection</span>
						</button>
					</div>
				</header>
				
				<main class="p-6 bg-neutral-950 text-white">
					{#if collections.length === 0}
						<div class="text-center py-16 px-8 bg-neutral-800/50 rounded-xl border border-neutral-700 mb-8">
							<div class="text-5xl mb-4">📁</div>
							<h2 class="text-2xl font-bold mb-3">No collections yet. Create one to get started!</h2>
							<button onclick={openAddCollection} class="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 transition-all mt-4">
								+ Create collection
							</button>
						</div>
					{:else}
						<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{#each collections as collection}
								<div class="p-6 bg-neutral-800 rounded-lg border border-neutral-700 hover:border-blue-500 transition-all cursor-pointer flex flex-col items-center">
									<div class="text-4xl mb-4">📁</div>
									<div class="text-lg font-medium text-center">{collection.name}</div>
									<div class="mt-2 text-xs text-neutral-400">
										{filteredBookmarks().filter(b => b.collectionId === collection.id).length} bookmarks
									</div>
								</div>
							{/each}
							<div onclick={openAddCollection} class="p-6 bg-neutral-800/50 rounded-lg border border-dashed border-neutral-600 hover:border-blue-500 transition-all cursor-pointer flex flex-col items-center justify-center">
								<div class="text-4xl mb-2">+</div>
								<div class="text-sm text-neutral-400">New Collection</div>
							</div>
						</div>
					{/if}
				</main>
			{:else}
				<!-- Bookmarks Section -->
				<header class="bg-neutral-900 text-white p-4 border-b border-neutral-800 flex justify-between items-center">
					<h1 class="text-2xl font-bold">
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
					
					<div class="flex items-center gap-3">
						<div class="flex items-center gap-2 bg-neutral-800 rounded-lg p-1">
							<button class="{viewMode === 'gallery' ? 'bg-neutral-700' : ''} p-2 rounded-md hover:bg-neutral-700 transition-all" 
								onclick={() => viewMode = 'gallery'} title="Gallery view">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
								</svg>
							</button>
							<button class="{viewMode === 'list' ? 'bg-neutral-700' : ''} p-2 rounded-md hover:bg-neutral-700 transition-all" 
								onclick={() => viewMode = 'list'} title="List view">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
								</svg>
							</button>
						</div>
						
						<button class="p-2 rounded-md hover:bg-neutral-800 transition-all" title="Today">
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
							</svg>
						</button>
						
						<button class="p-2 rounded-md hover:bg-neutral-800 transition-all" title="More options">
							<span class="text-base">...</span>
						</button>
						
						<div class="flex items-center gap-2">
							<button class="p-2 rounded-md hover:bg-neutral-800 transition-all" title="Search">
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
								</svg>
							</button>
							<button class="p-2 rounded-md hover:bg-neutral-800 transition-all" title="Expand">
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" clip-rule="evenodd"></path>
								</svg>
							</button>
							<button class="p-2 rounded-md hover:bg-neutral-800 transition-all" title="Filter">
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd"></path>
								</svg>
							</button>
						</div>
						
						<button onclick={openAddBookmark} class="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 font-medium">
							<span>New</span>
							<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
							</svg>
						</button>
					</div>
				</header>
				
				<main class="p-6 bg-neutral-950">
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
						<div class="text-center py-16 px-8 bg-neutral-800/50 rounded-xl border border-neutral-700">
							<div class="text-5xl mb-4">🔖</div>
							<h2 class="text-2xl font-bold mb-3 text-white">No bookmarks found</h2>
							<p class="text-neutral-400 mb-6">Start by adding your first bookmark or adjust your filters.</p>
							<button
								onclick={openAddBookmark}
								class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
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
		<aside class="h-full lg:sticky lg:top-0 bg-neutral-900">
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
		onSave={(data) => {
			if (editingKind) {
				bookmarkStore.updateKind(editingKind.id, data);
			} else {
				bookmarkStore.addKind(data);
			}
			closeKindModal();
		}}
		onClose={closeKindModal}
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