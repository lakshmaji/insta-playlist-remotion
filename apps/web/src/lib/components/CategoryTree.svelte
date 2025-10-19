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

<div class="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm p-4 h-full overflow-y-auto">
	<div class="flex justify-between items-center mb-4 pb-3 border-b-2 border-gradient-to-r from-blue-200 to-purple-200">
		<h3 class="m-0 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
			<span>📁</span>
			Categories
		</h3>
		<button onclick={() => onAdd()} class="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white border-none rounded-lg cursor-pointer text-sm font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-sm hover:shadow-md">
			+ New
		</button>
	</div>

	<div class="py-2 px-3 mb-2 rounded-lg cursor-pointer transition-all {!selectedCategoryId ? 'bg-gradient-to-r from-blue-100 to-purple-100 font-semibold shadow-sm' : 'hover:bg-gray-50'}" onclick={() => onSelect(undefined)} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && onSelect(undefined)}>
		<span class="text-base">📚 All Bookmarks</span>
	</div>

	{#each tree as category}
		{@render categoryNode(category, 0)}
	{/each}
</div>

{#snippet categoryNode(category: CategoryNode, level: number)}
	{@const expanded = isExpanded(category.id)}
	<div class="py-2 cursor-pointer rounded-lg mb-1 transition-all hover:bg-gray-50" style="padding-left: {level * 1.5 + 1}rem">
		<div
			class="flex items-center gap-2 py-1 px-2 rounded-lg transition-all {selectedCategoryId === category.id ? 'bg-gradient-to-r from-blue-100 to-purple-100 font-semibold shadow-sm' : ''}"
			onclick={() => onSelect(category.id)}
			role="button"
			tabindex="0"
			onkeydown={(e) => e.key === 'Enter' && onSelect(category.id)}
		>
			{#if category.children.length > 0}
				<button
					class="bg-none border-none cursor-pointer p-0 w-5 h-5 flex items-center justify-center text-xs hover:bg-gray-200 rounded transition-all"
					onclick={(e) => {
						e.stopPropagation();
						toggleExpanded(category.id);
					}}
				>
					{expanded ? '▼' : '▶'}
				</button>
			{:else}
				<span class="w-5 h-5 inline-block"></span>
			{/if}

			<span class="flex-1 text-sm">📁 {category.name}</span>

			<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
				<button
					onclick={(e) => {
						e.stopPropagation();
						onAdd(category.id);
					}}
					class="bg-none border-none cursor-pointer p-1 text-sm rounded hover:bg-blue-100 transition-all"
					title="Add subcategory"
				>
					➕
				</button>
				<button
					onclick={(e) => {
						e.stopPropagation();
						onEdit(category);
					}}
					class="bg-none border-none cursor-pointer p-1 text-sm rounded hover:bg-yellow-100 transition-all"
					title="Edit"
				>
					✏️
				</button>
				<button
					onclick={(e) => {
						e.stopPropagation();
						onDelete(category.id);
					}}
					class="bg-none border-none cursor-pointer p-1 text-sm rounded hover:bg-red-100 transition-all"
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
	/* Add hover effect for showing action buttons */
	:global(.category-tree) {
		container-type: inline-size;
	}
	
	div:hover > div > div {
		opacity: 1 !important;
	}
</style>
