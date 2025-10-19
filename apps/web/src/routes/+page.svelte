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
	<div class="flex-1 grid lg:grid-cols-[280px_1fr] gap-0 max-w-screen-2xl mx-auto w-full bg-neutral-950">
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
				<header class="bg-neutral-800 text-white p-4 flex justify-between items-center">
					<h1 class="text-xl font-bold">
						{#if selectedSection === 'all'}
							All Bookmarks
						{:else if selectedSection === 'favorites'}
							Favorites
						{:else if selectedSection === 'reading'}
							Reading List
						{:else if selectedSection === 'tags'}
							Tags
						{:else if selectedSection === 'archive'}
							Archive
						{:else}
							Bookmarks
						{/if}
					</h1>
					
					<div class="flex items-center gap-3">
						<div class="flex items-center space-x-2">
							<button class="p-2 rounded-md hover:bg-neutral-700 transition-all">
								<span class="text-lg">🔍</span>
							</button>
							<button class="p-2 rounded-md hover:bg-neutral-700 transition-all">
								<span class="text-lg">↓</span>
							</button>
							<button class="p-2 rounded-md hover:bg-neutral-700 transition-all">
								<span class="text-lg">↑</span>
							</button>
							<button class="p-2 rounded-md hover:bg-neutral-700 transition-all">
								<span class="text-lg">⊞</span>
							</button>
						</div>
						
						<div>
							<button onclick={openAddBookmark} class="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 transition-all flex items-center gap-1">
								<span>New</span>
								<span class="text-xs">▼</span>
							</button>
						</div>
					</div>
				</header>
				
				<main class="p-6 bg-neutral-950">
					<!-- Filtering options -->
					<div class="flex gap-4 mb-6">
						<div class="flex bg-neutral-800 rounded-md overflow-hidden">
							<button class="px-4 py-2 {viewMode === 'gallery' ? 'bg-blue-500 text-white' : 'text-white/80 hover:bg-neutral-700'} transition-all"
								onclick={() => viewMode = 'gallery'}>
								Gallery
							</button>
							<button class="px-4 py-2 {viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-white/80 hover:bg-neutral-700'} transition-all"
								onclick={() => viewMode = 'list'}>
								List
							</button>
						</div>
						
						<div class="flex-1 min-w-[200px]">
							<input
								type="text"
								placeholder="Search..."
								class="w-full px-4 py-2 border border-neutral-700 rounded-md bg-neutral-800 text-white focus:outline-none focus:border-blue-500 transition-all"
								bind:value={searchQuery}
							/>
						</div>
					</div>

					<!-- Bookmarks grid -->
					{#if filteredBookmarks().length === 0}
						<div class="text-center py-16 px-8 bg-neutral-800/50 rounded-xl border border-neutral-700">
							<div class="text-5xl mb-4">🔖</div>
							<h2 class="text-2xl font-bold mb-3 text-white">No bookmarks found</h2>
							<p class="text-neutral-400 mb-6">Start by adding your first bookmark or adjust your filters.</p>
							<button
								onclick={openAddBookmark}
								class="px-6 py-3 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-all"
							>
								+ Add Bookmark
							</button>
						</div>
					{:else if viewMode === 'gallery'}
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
							{#each filteredBookmarks() as bookmark (bookmark.id)}
								<BookmarkCard
									{bookmark}
									onEdit={openEditBookmark}
									onDelete={deleteBookmark}
									onStatusChange={updateBookmarkStatus}
								/>
							{/each}
						</div>
					{:else}
						<div class="bg-neutral-800 rounded-md overflow-hidden">
							{#each filteredBookmarks() as bookmark (bookmark.id)}
								<div class="border-b border-neutral-700 last:border-0 p-4 hover:bg-neutral-700 transition-all flex items-center gap-3">
									<div class="w-8 h-8 flex-shrink-0 bg-neutral-700 rounded-md flex items-center justify-center overflow-hidden">
										{#if bookmark.favicon}
											<img src={bookmark.favicon} alt="" class="w-6 h-6 object-contain" />
										{:else}
											<span class="text-sm">🔖</span>
										{/if}
									</div>
									<div class="flex-1 min-w-0">
										<div class="font-medium text-white truncate">{bookmark.title}</div>
										<div class="text-sm text-neutral-400 truncate">{bookmark.url}</div>
									</div>
									<div class="flex items-center gap-2">
										<button class="p-2 text-neutral-400 hover:text-white transition-all" onclick={() => openEditBookmark(bookmark)}>
											<span class="text-sm">✏️</span>
										</button>
										<button class="p-2 text-neutral-400 hover:text-white transition-all" onclick={() => deleteBookmark(bookmark.id)}>
											<span class="text-sm">🗑️</span>
										</button>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</main>
			{/if}
		</div>
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