<script lang="ts">
	import { bookmarkStore } from '$lib/store.svelte';
	import type { Bookmark, Category } from '$lib/types';
	import BookmarkCard from '$lib/components/BookmarkCard.svelte';
	import CategoryTree from '$lib/components/CategoryTree.svelte';
	import BookmarkModal from '$lib/components/BookmarkModal.svelte';
	import CategoryModal from '$lib/components/CategoryModal.svelte';
	import ImportExportModal from '$lib/components/ImportExportModal.svelte';
	import TodoPanel from '$lib/components/TodoPanel.svelte';

	let selectedCategoryId = $state<string | undefined>(undefined);
	let searchQuery = $state('');
	let selectedTags = $state<string[]>([]);
	let statusFilter = $state<Bookmark['status'] | 'all'>('all');

	let showBookmarkModal = $state(false);
	let showCategoryModal = $state(false);
	let showImportExportModal = $state(false);
	let editingBookmark = $state<Bookmark | undefined>(undefined);
	let editingCategory = $state<Category | undefined>(undefined);
	let newCategoryParentId = $state<string | undefined>(undefined);

	const bookmarks = $derived(bookmarkStore.bookmarks);
	const categories = $derived(bookmarkStore.categories);
	const tags = $derived(bookmarkStore.tags);
	const todos = $derived(bookmarkStore.todos);

	const filteredBookmarks = $derived(() => {
		let filtered = bookmarks;

		// Filter by category
		if (selectedCategoryId) {
			filtered = filtered.filter((b) => b.categoryId === selectedCategoryId);
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

	function openAddCategory(parentId?: string) {
		editingCategory = undefined;
		newCategoryParentId = parentId;
		showCategoryModal = true;
	}

	function openEditCategory(category: Category) {
		editingCategory = category;
		newCategoryParentId = undefined;
		showCategoryModal = true;
	}

	function closeCategoryModal() {
		showCategoryModal = false;
		editingCategory = undefined;
		newCategoryParentId = undefined;
	}

	function deleteBookmark(id: string) {
		if (confirm('Are you sure you want to delete this bookmark?')) {
			bookmarkStore.deleteBookmark(id);
		}
	}

	function deleteCategory(id: string) {
		if (confirm('Are you sure you want to delete this category and all its subcategories?')) {
			bookmarkStore.deleteCategory(id);
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

<div class="min-h-screen flex flex-col">
	<header class="bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
		<h1 class="text-3xl font-bold text-gray-800">📚 Bookmark Manager</h1>
		<div class="flex gap-4">
			<button
				onclick={openAddBookmark}
				class="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold text-sm hover:bg-blue-600 transition-all"
			>
				+ Add Bookmark
			</button>
			<button
				onclick={() => (showImportExportModal = true)}
				class="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-all"
			>
				Import / Export
			</button>
		</div>
	</header>

	<div class="flex-1 grid lg:grid-cols-[300px_1fr] gap-6 p-6 max-w-screen-2xl mx-auto w-full">
		<aside class="flex flex-col gap-6 h-fit lg:sticky lg:top-6">
			<CategoryTree
				{categories}
				{selectedCategoryId}
				onSelect={(id) => (selectedCategoryId = id)}
				onEdit={openEditCategory}
				onDelete={deleteCategory}
				onAdd={openAddCategory}
			/>

			<div class="max-h-96">
				<TodoPanel {todos} {categories} />
			</div>
		</aside>

		<main class="min-w-0">
			<div class="flex gap-4 mb-6 flex-wrap">
				<div class="flex-1 min-w-[200px]">
					<input
						type="search"
						bind:value={searchQuery}
						placeholder="Search bookmarks..."
						class="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>

				<div>
					<select
						bind:value={statusFilter}
						class="px-4 py-3 border border-gray-300 rounded-lg text-base bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="all">All Status</option>
						<option value="unread">Unread</option>
						<option value="reading">Reading</option>
						<option value="completed">Completed</option>
						<option value="archived">Archived</option>
					</select>
				</div>
			</div>

			{#if allTags().length > 0}
				<div class="flex flex-wrap gap-2 items-center mb-4 p-4 bg-white rounded-lg border border-gray-200">
					<span class="font-semibold text-gray-600 text-sm">Filter by tags:</span>
					{#each allTags() as tag}
						<button
							class="px-4 py-2 rounded-full text-sm transition-all {selectedTags.includes(tag)
								? 'bg-blue-500 text-white border-blue-500'
								: 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'} border"
							onclick={() => toggleTag(tag)}
						>
							{tag}
						</button>
					{/each}
				</div>
			{/if}

			<div class="text-gray-600 mb-4 text-sm">
				Showing {filteredBookmarks().length} of {bookmarks.length} bookmarks
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
				{#if filteredBookmarks().length === 0}
					<div class="col-span-full text-center py-16 px-8 bg-white rounded-lg border-2 border-dashed border-gray-200">
						<div class="text-6xl mb-4">🔖</div>
						<h2 class="text-xl font-semibold text-gray-800 mb-2">No bookmarks found</h2>
						<p class="text-gray-600 mb-6">Start by adding your first bookmark or adjust your filters.</p>
						<button
							onclick={openAddBookmark}
							class="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all inline-block"
						>
							Add Bookmark
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
		{categories}
		onClose={closeBookmarkModal}
		onSave={closeBookmarkModal}
	/>
{/if}

{#if showCategoryModal}
	<CategoryModal
		category={editingCategory}
		parentId={newCategoryParentId}
		{categories}
		onClose={closeCategoryModal}
		onSave={closeCategoryModal}
	/>
{/if}

{#if showImportExportModal}
	<ImportExportModal onClose={() => (showImportExportModal = false)} />
{/if}
