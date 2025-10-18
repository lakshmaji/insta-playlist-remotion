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

<div class="app-container">
	<header class="app-header">
		<h1>📚 Bookmark Manager</h1>
		<div class="header-actions">
			<button onclick={openAddBookmark} class="btn-primary">+ Add Bookmark</button>
			<button onclick={() => (showImportExportModal = true)} class="btn-secondary">
				Import / Export
			</button>
		</div>
	</header>

	<div class="app-body">
		<aside class="sidebar">
			<CategoryTree
				{categories}
				{selectedCategoryId}
				onSelect={(id) => (selectedCategoryId = id)}
				onEdit={openEditCategory}
				onDelete={deleteCategory}
				onAdd={openAddCategory}
			/>

			<div class="sidebar-section">
				<TodoPanel {todos} {categories} />
			</div>
		</aside>

		<main class="main-content">
			<div class="filters">
				<div class="search-box">
					<input
						type="search"
						bind:value={searchQuery}
						placeholder="Search bookmarks..."
						class="search-input"
					/>
				</div>

				<div class="status-filter">
					<select bind:value={statusFilter} class="status-select">
						<option value="all">All Status</option>
						<option value="unread">Unread</option>
						<option value="reading">Reading</option>
						<option value="completed">Completed</option>
						<option value="archived">Archived</option>
					</select>
				</div>
			</div>

			{#if allTags().length > 0}
				<div class="tag-filter">
					<span class="filter-label">Filter by tags:</span>
					{#each allTags() as tag}
						<button
							class="tag-button"
							class:selected={selectedTags.includes(tag)}
							onclick={() => toggleTag(tag)}
						>
							{tag}
						</button>
					{/each}
				</div>
			{/if}

			<div class="bookmark-stats">
				Showing {filteredBookmarks().length} of {bookmarks.length} bookmarks
			</div>

			<div class="bookmark-grid">
				{#if filteredBookmarks().length === 0}
					<div class="empty-state">
						<div class="empty-icon">🔖</div>
						<h2>No bookmarks found</h2>
						<p>Start by adding your first bookmark or adjust your filters.</p>
						<button onclick={openAddBookmark} class="btn-primary">Add Bookmark</button>
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

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background-color: #f9fafb;
	}

	.app-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.app-header {
		background: white;
		border-bottom: 1px solid #e5e7eb;
		padding: 1.5rem 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.app-header h1 {
		margin: 0;
		font-size: 1.75rem;
		color: #1f2937;
	}

	.header-actions {
		display: flex;
		gap: 1rem;
	}

	.btn-primary,
	.btn-secondary {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 600;
		font-size: 0.875rem;
		transition: all 0.2s;
	}

	.btn-primary {
		background-color: #3b82f6;
		color: white;
	}

	.btn-primary:hover {
		background-color: #2563eb;
	}

	.btn-secondary {
		background-color: white;
		color: #374151;
		border: 1px solid #d1d5db;
	}

	.btn-secondary:hover {
		background-color: #f3f4f6;
	}

	.app-body {
		flex: 1;
		display: grid;
		grid-template-columns: 300px 1fr;
		gap: 1.5rem;
		padding: 1.5rem;
		max-width: 1800px;
		margin: 0 auto;
		width: 100%;
	}

	.sidebar {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		height: fit-content;
		position: sticky;
		top: 1.5rem;
	}

	.sidebar-section {
		max-height: 400px;
	}

	.main-content {
		min-width: 0;
	}

	.filters {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.search-box {
		flex: 1;
	}

	.search-input {
		width: 100%;
		padding: 0.75rem 1rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 1rem;
	}

	.search-input:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.status-select {
		padding: 0.75rem 1rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 1rem;
		background: white;
		cursor: pointer;
	}

	.tag-filter {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
		margin-bottom: 1rem;
		padding: 1rem;
		background: white;
		border-radius: 6px;
		border: 1px solid #e5e7eb;
	}

	.filter-label {
		font-weight: 600;
		color: #6b7280;
		font-size: 0.875rem;
	}

	.tag-button {
		padding: 0.5rem 1rem;
		background-color: #f3f4f6;
		border: 1px solid #d1d5db;
		border-radius: 20px;
		cursor: pointer;
		font-size: 0.875rem;
		transition: all 0.2s;
	}

	.tag-button:hover {
		background-color: #e5e7eb;
	}

	.tag-button.selected {
		background-color: #3b82f6;
		color: white;
		border-color: #3b82f6;
	}

	.bookmark-stats {
		color: #6b7280;
		margin-bottom: 1rem;
		font-size: 0.875rem;
	}

	.bookmark-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.empty-state {
		grid-column: 1 / -1;
		text-align: center;
		padding: 4rem 2rem;
		background: white;
		border-radius: 8px;
		border: 2px dashed #e5e7eb;
	}

	.empty-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	.empty-state h2 {
		margin: 0 0 0.5rem 0;
		color: #1f2937;
	}

	.empty-state p {
		color: #6b7280;
		margin-bottom: 1.5rem;
	}

	@media (max-width: 1024px) {
		.app-body {
			grid-template-columns: 1fr;
		}

		.sidebar {
			position: static;
		}

		.bookmark-grid {
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		}
	}
</style>
