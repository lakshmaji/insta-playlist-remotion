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
	let searchQuery = $state('');
	let selectedTags = $state<string[]>([]);
	let statusFilter = $state<Bookmark['status'] | 'all'>('all');
	let selectedSection = $state<string>('all');

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

<div class="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
	<header class="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm px-6 md:px-8 py-5 flex flex-wrap justify-between items-center sticky top-0 z-10">
		<h1 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
			<span class="text-3xl md:text-4xl">📚</span>
			Bookmark Manager
		</h1>
		<div class="flex gap-3 mt-3 md:mt-0">
			<button
				onclick={openAddBookmark}
				class="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-sm hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
			>
				<span class="hidden sm:inline">+ Add Bookmark</span>
				<span class="sm:hidden">+ Add</span>
			</button>
			<button
				onclick={() => (showImportExportModal = true)}
				class="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
			>
				<span class="hidden sm:inline">Import / Export</span>
				<span class="sm:hidden">I/E</span>
			</button>
		</div>
	</header>

	<div class="flex-1 grid lg:grid-cols-[320px_1fr] gap-5 p-4 md:p-6 max-w-screen-2xl mx-auto w-full">
		<aside class="flex flex-col gap-5 h-fit lg:sticky lg:top-24">
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
				selectedKindId={selectedKindId}
				onSelectKind={(id) => (selectedKindId = id)}
				onAddKind={openAddKind}
				onAddBookmark={openAddBookmark}
				onAddCollection={openAddCollection}
			/>
			
			{#if selectedSection === 'collections'}
				<CollectionTree
					collections={collections}
					selectedCollectionId={selectedCollectionId}
					onSelect={(id) => (selectedCollectionId = id)}
					onEdit={openEditCollection}
					onDelete={deleteCollection}
					onAdd={openAddCollection}
				/>
			{/if}

			<div class="max-h-96">
				<TodoPanel todos={todos} collections={collections} />
			</div>
		</aside>

		<main class="min-w-0">
			<div class="flex gap-3 mb-5 flex-wrap bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-200">
				<div class="flex-1 min-w-[200px]">
					<input
						type="search"
						bind:value={searchQuery}
						placeholder="🔍 Search bookmarks..."
						class="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
					/>
				</div>

				<div>
					<select
						bind:value={statusFilter}
						class="px-4 py-3 border border-gray-300 rounded-lg text-base bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="all">📊 All Status</option>
						<option value="unread">🆕 Unread</option>
						<option value="reading">📖 Reading</option>
						<option value="completed">✅ Completed</option>
						<option value="archived">📦 Archived</option>
					</select>
				</div>
			</div>

			{#if allTags().length > 0}
				<div class="flex flex-wrap gap-2 items-center mb-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
					<span class="font-semibold text-gray-700 text-sm flex items-center gap-2">
						<span>🏷️</span>
						Filter by tags:
					</span>
					{#each allTags() as tag}
						<button
							class="px-4 py-2 rounded-full text-sm transition-all font-medium {selectedTags.includes(tag)
								? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md transform scale-105'
								: 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 hover:shadow-sm'}"
							onclick={() => toggleTag(tag)}
						>
							{tag}
						</button>
					{/each}
				</div>
			{/if}

			<div class="text-gray-600 mb-4 text-sm font-medium px-1">
				Showing <span class="text-blue-600 font-bold">{filteredBookmarks().length}</span> of <span class="font-bold">{bookmarks.length}</span> bookmarks
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
				{#if filteredBookmarks().length === 0}
					<div class="col-span-full text-center py-16 px-8 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300 shadow-sm">
						<div class="text-7xl mb-4 animate-pulse">🔖</div>
						<h2 class="text-2xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">No bookmarks found</h2>
						<p class="text-gray-600 mb-6 text-base">Start by adding your first bookmark or adjust your filters.</p>
						<button
							onclick={openAddBookmark}
							class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all inline-block shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
						>
							+ Add Bookmark
						</button>
					</div>
				{:else}
					{#each filteredBookmarks() as bookmark (bookmark.id)}
						<BookmarkCard
							{bookmark}
							onEdit={openEditBookmark}
							onDelete={deleteBookmark}
							onStatusChange={updateBookmarkStatus}
						/>
					{/each}
				{/if}
			</div>
		</main>
	</div>
</div>

{#if showBookmarkModal}
	<BookmarkModal
		bookmark={editingBookmark}
		collections={collections}
		kinds={kinds}
		onClose={closeBookmarkModal}
		onSave={closeBookmarkModal}
	/>
{/if}

{#if showCollectionModal}
	<CollectionModal
		collection={editingCollection}
		parentId={newCollectionParentId}
		collections={collections}
		onClose={closeCollectionModal}
		onSave={closeCollectionModal}
	/>
{/if}

{#if showKindModal}
	<KindModal
		kind={editingKind}
		kinds={kinds}
		onClose={closeKindModal}
		onSave={closeKindModal}
	/>
{/if}

{#if showImportExportModal}
	<ImportExportModal onClose={() => (showImportExportModal = false)} />
{/if}
