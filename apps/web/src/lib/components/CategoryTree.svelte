<script lang="ts">
	import type { Category } from '$lib/types';

	interface Props {
		categories: Category[];
		selectedCategoryId?: string;
		onSelect: (categoryId: string | undefined) => void;
		onEdit: (category: Category) => void;
		onDelete: (categoryId: string) => void;
		onAdd: (parentId?: string) => void;
	}

	let { categories, selectedCategoryId, onSelect, onEdit, onDelete, onAdd }: Props = $props();

	type CategoryNode = Category & { children: CategoryNode[] };

	function buildTree(cats: Category[]): CategoryNode[] {
		const map = new Map<string, CategoryNode>();
		const roots: CategoryNode[] = [];

		cats.forEach((cat) => {
			map.set(cat.id, { ...cat, children: [] });
		});

		map.forEach((cat) => {
			if (cat.parentId) {
				const parent = map.get(cat.parentId);
				if (parent) {
					parent.children.push(cat);
				} else {
					roots.push(cat);
				}
			} else {
				roots.push(cat);
			}
		});

		return roots;
	}

	const tree = $derived(buildTree(categories));

	let expandedCategories = $state<Set<string>>(new Set());

	function toggleExpanded(categoryId: string) {
		if (expandedCategories.has(categoryId)) {
			expandedCategories.delete(categoryId);
		} else {
			expandedCategories.add(categoryId);
		}
		expandedCategories = new Set(expandedCategories);
	}

	function isExpanded(categoryId: string) {
		return expandedCategories.has(categoryId);
	}
</script>

<div class="category-tree">
	<div class="tree-header">
		<h3>Categories</h3>
		<button onclick={() => onAdd()} class="btn-add-category">+ New Category</button>
	</div>

	<div class="tree-item" class:selected={!selectedCategoryId} onclick={() => onSelect(undefined)}>
		<span>📚 All Bookmarks</span>
	</div>

	{#each tree as category}
		{@render categoryNode(category, 0)}
	{/each}
</div>

{#snippet categoryNode(category: CategoryNode, level: number)}
	{@const expanded = isExpanded(category.id)}
	<div class="tree-item" style="padding-left: {level * 1.5 + 1}rem">
		<div
			class="category-content"
			class:selected={selectedCategoryId === category.id}
			onclick={() => onSelect(category.id)}
		>
			{#if category.children.length > 0}
				<button
					class="expand-btn"
					onclick={(e) => {
						e.stopPropagation();
						toggleExpanded(category.id);
					}}
				>
					{expanded ? '▼' : '▶'}
				</button>
			{:else}
				<span class="expand-placeholder"></span>
			{/if}

			<span class="category-name">📁 {category.name}</span>

			<div class="category-actions">
				<button
					onclick={(e) => {
						e.stopPropagation();
						onAdd(category.id);
					}}
					class="btn-action"
					title="Add subcategory"
				>
					+
				</button>
				<button
					onclick={(e) => {
						e.stopPropagation();
						onEdit(category);
					}}
					class="btn-action"
					title="Edit"
				>
					✏️
				</button>
				<button
					onclick={(e) => {
						e.stopPropagation();
						onDelete(category.id);
					}}
					class="btn-action"
					title="Delete"
				>
					🗑️
				</button>
			</div>
		</div>
	</div>

	{#if expanded && category.children.length > 0}
		{#each category.children as child}
			{@render categoryNode(child, level + 1)}
		{/each}
	{/if}
{/snippet}

<style>
	.category-tree {
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		background: white;
		padding: 1rem;
		height: 100%;
		overflow-y: auto;
	}

	.tree-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid #e5e7eb;
	}

	.tree-header h3 {
		margin: 0;
		font-size: 1.25rem;
	}

	.btn-add-category {
		padding: 0.5rem 1rem;
		background-color: #10b981;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.875rem;
	}

	.btn-add-category:hover {
		background-color: #059669;
	}

	.tree-item {
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 4px;
		margin-bottom: 0.25rem;
		transition: background-color 0.2s;
	}

	.tree-item:hover {
		background-color: #f3f4f6;
	}

	.tree-item.selected {
		background-color: #dbeafe;
		font-weight: 600;
	}

	.category-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.25rem;
		border-radius: 4px;
	}

	.expand-btn {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
	}

	.expand-placeholder {
		width: 20px;
		height: 20px;
		display: inline-block;
	}

	.category-name {
		flex: 1;
	}

	.category-actions {
		display: flex;
		gap: 0.25rem;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.tree-item:hover .category-actions {
		opacity: 1;
	}

	.btn-action {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25rem;
		font-size: 0.875rem;
		border-radius: 3px;
	}

	.btn-action:hover {
		background-color: #e5e7eb;
	}
</style>
