<script lang="ts">
	import type { Collection } from '$lib/types';

	interface Props {
		collections: Collection[];
		selectedCollectionId?: string;
		onSelect: (collectionId: string | undefined) => void;
		onEdit: (collection: Collection) => void;
		onDelete: (collectionId: string) => void;
		onAdd: (parentId?: string) => void;
	}

	let { collections, selectedCollectionId, onSelect, onEdit, onDelete, onAdd }: Props = $props();

	type CollectionNode = Collection & { children: CollectionNode[] };

	function buildTree(cols: Collection[]): CollectionNode[] {
		const map = new Map<string, CollectionNode>();
		const roots: CollectionNode[] = [];

		cols.forEach((col) => {
			map.set(col.id, { ...col, children: [] });
		});

		map.forEach((col) => {
			if (col.parentId) {
				const parent = map.get(col.parentId);
				if (parent) {
					parent.children.push(col);
				} else {
					roots.push(col);
				}
			} else {
				roots.push(col);
			}
		});

		return roots;
	}

	const tree = $derived(buildTree(collections));

	let expandedCollections = $state<Set<string>>(new Set());

	function toggleExpanded(collectionId: string) {
		if (expandedCollections.has(collectionId)) {
			expandedCollections.delete(collectionId);
		} else {
			expandedCollections.add(collectionId);
		}
		expandedCollections = new Set(expandedCollections);
	}

	function isExpanded(collectionId: string) {
		return expandedCollections.has(collectionId);
	}
</script>

<div class="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm p-4 h-full overflow-y-auto">
	<div class="flex justify-between items-center mb-4 pb-3 border-b-2 border-gradient-to-r from-blue-200 to-purple-200">
		<h3 class="m-0 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
			<span>📁</span>
			Collections
		</h3>
		<button onclick={() => onAdd()} class="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white border-none rounded-lg cursor-pointer text-sm font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-sm hover:shadow-md">
			+ New
		</button>
	</div>

	<div class="py-2 px-3 mb-2 rounded-lg cursor-pointer transition-all {!selectedCollectionId ? 'bg-gradient-to-r from-blue-100 to-purple-100 font-semibold shadow-sm' : 'hover:bg-gray-50'}" onclick={() => onSelect(undefined)} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && onSelect(undefined)}>
		<span class="text-base">📚 All Bookmarks</span>
	</div>

	{#each tree as collection}
		{@render collectionNode(collection, 0)}
	{/each}
</div>

{#snippet collectionNode(collection: CollectionNode, level: number)}
	{@const expanded = isExpanded(collection.id)}
	<div class="py-2 cursor-pointer rounded-lg mb-1 transition-all hover:bg-gray-50" style="padding-left: {level * 1.5 + 1}rem">
		<div
			class="flex items-center gap-2 py-1 px-2 rounded-lg transition-all {selectedCollectionId === collection.id ? 'bg-gradient-to-r from-blue-100 to-purple-100 font-semibold shadow-sm' : ''}"
			onclick={() => onSelect(collection.id)}
			role="button"
			tabindex="0"
			onkeydown={(e) => e.key === 'Enter' && onSelect(collection.id)}
		>
			{#if collection.children.length > 0}
				<button
					class="bg-none border-none cursor-pointer p-0 w-5 h-5 flex items-center justify-center text-xs hover:bg-gray-200 rounded transition-all"
					onclick={(e) => {
						e.stopPropagation();
						toggleExpanded(collection.id);
					}}
				>
					{expanded ? '▼' : '▶'}
				</button>
			{:else}
				<span class="w-5 h-5 inline-block"></span>
			{/if}

			<span class="flex-1 text-sm">📁 {collection.name}</span>

			<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
				<button
					onclick={(e) => {
						e.stopPropagation();
						onAdd(collection.id);
					}}
					class="bg-none border-none cursor-pointer p-1 text-sm rounded hover:bg-blue-100 transition-all"
					title="Add subcollection"
				>
					➕
				</button>
				<button
					onclick={(e) => {
						e.stopPropagation();
						onEdit(collection);
					}}
					class="bg-none border-none cursor-pointer p-1 text-sm rounded hover:bg-yellow-100 transition-all"
					title="Edit"
				>
					✏️
				</button>
				<button
					onclick={(e) => {
						e.stopPropagation();
						onDelete(collection.id);
					}}
					class="bg-none border-none cursor-pointer p-1 text-sm rounded hover:bg-red-100 transition-all"
					title="Delete"
				>
					🗑️
				</button>
			</div>
		</div>
	</div>

	{#if expanded && collection.children.length > 0}
		{#each collection.children as child}
			{@render collectionNode(child, level + 1)}
		{/each}
	{/if}
{/snippet}

<style>
	/* Add hover effect for showing action buttons */
	:global(.collection-tree) {
		container-type: inline-size;
	}
	
	div:hover > div > div {
		opacity: 1 !important;
	}
</style>