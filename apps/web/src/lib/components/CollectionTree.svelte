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
		<div class="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
		<h3 class="m-0 text-lg font-semibold text-gray-800 flex items-center gap-2">
			<span>📁</span>
			Collections
		</h3>
		<button onclick={() => onAdd()} class="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all text-gray-600">
			+
		</button>
	</div>

	<div class="py-2 px-3 mb-2 rounded-lg cursor-pointer transition-all flex items-center gap-2 {!selectedCollectionId ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}" 
		onclick={() => onSelect(undefined)} 
		role="button" 
		tabindex="0" 
		onkeydown={(e) => e.key === 'Enter' && onSelect(undefined)}>
		<span class="text-lg">📚</span>
		<span>All Collections</span>
	</div>

	{#each tree as collection}
		{@render collectionNode(collection, 0)}
	{/each}

	<!-- Navigation section -->
	<div class="p-3 border-b border-gray-200">
		<h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">Navigation</h3>
		<div class="flex flex-col gap-1">
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'inbox' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}" 
				onclick={() => onSelectSection('inbox')} role="button" tabindex="0">
				<span class="text-lg">�</span>
				<span>Inbox</span>
			</div>
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'all' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}" 
				onclick={() => {
					onSelectSection('all');
					onSelect(undefined);
				}} role="button" tabindex="0">
				<span class="text-lg">📚</span>
				<span>All Bookmarks</span>
			</div>
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'favorites' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}" 
				onclick={() => onSelectSection('favorites')} role="button" tabindex="0">
				<span class="text-lg">⭐</span>
				<span>Favorites</span>
			</div>
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'reading' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}" 
				onclick={() => onSelectSection('reading')} role="button" tabindex="0">
				<span class="text-lg">📖</span>
				<span>Reading List</span>
			</div>
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'collections' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}" 
				onclick={() => onSelectSection('collections')} role="button" tabindex="0">
				<span class="text-lg">📁</span>
				<span>Collections</span>
			</div>
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'tags' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}" 
				onclick={() => onSelectSection('tags')} role="button" tabindex="0">
				<span class="text-lg">🏷️</span>
				<span>Tags</span>
			</div>
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'archive' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}" 
				onclick={() => onSelectSection('archive')} role="button" tabindex="0">
				<span class="text-lg">🗃️</span>
				<span>Archive</span>
			</div>
		</div>
	</div>

	<!-- Kind section -->
	<div class="p-3 border-b border-gray-200">
		<div class="flex justify-between items-center mb-2">
			<h3 class="text-sm font-semibold text-gray-500 uppercase">Kind</h3>
			<button onclick={() => onAdd()} class="text-gray-500 hover:text-gray-700 transition-all">
				+
			</button>
		</div>
		<div class="flex flex-col gap-1">
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 hover:bg-gray-50">
				<span class="text-lg">📄</span>
				<span>Articles</span>
			</div>
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 hover:bg-gray-50">
				<span class="text-lg">🛒</span>
				<span>Shopping</span>
			</div>
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 hover:bg-gray-50">
				<span class="text-lg">🔧</span>
				<span>Tools</span>
			</div>
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 hover:bg-gray-50">
				<span class="text-lg">🎬</span>
				<span>Videos</span>
			</div>
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 hover:bg-gray-50">
				<span class="text-lg">🌐</span>
				<span>Websites</span>
			</div>
			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 hover:bg-gray-50">
				<span class="text-lg">📚</span>
				<span>Resources</span>
			</div>
		</div>
	</div>

	<!-- Collections section -->
	<div class="p-3 flex-grow">
		<div class="flex justify-between items-center mb-2">
			<h3 class="text-sm font-semibold text-gray-500 uppercase">Collections</h3>
			<button onclick={() => onAdd()} class="text-gray-500 hover:text-gray-700 transition-all">
				+
			</button>
		</div>
		
		{#each tree as collection}
			{@render collectionNode(collection, 0)}
		{/each}
	</div>
</div>

{#snippet collectionNode(collection: CollectionNode, level: number)}
	{@const expanded = isExpanded(collection.id)}
	<div class="py-1 cursor-pointer rounded-lg mb-1 transition-all hover:bg-gray-50" style="padding-left: {level * 1 + 0.5}rem">
		<div
			class="flex items-center gap-2 py-2 px-3 rounded-lg transition-all {selectedCollectionId === collection.id ? 'bg-gray-100 font-semibold' : ''}"
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

			<span class="flex-1 text-sm">{collection.name}</span>

			<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
				<button
					onclick={(e) => {
						e.stopPropagation();
						onAdd(collection.id);
					}}
					class="bg-none border-none cursor-pointer p-1 text-xs rounded hover:bg-blue-100 transition-all"
					title="Add subcollection"
				>
					+
				</button>
				<button
					onclick={(e) => {
						e.stopPropagation();
						onEdit(collection);
					}}
					class="bg-none border-none cursor-pointer p-1 text-xs rounded hover:bg-yellow-100 transition-all"
					title="Edit"
				>
					⋯
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

	/* Custom scrollbar */
	div::-webkit-scrollbar {
		width: 6px;
	}

	div::-webkit-scrollbar-track {
		background: transparent;
	}

	div::-webkit-scrollbar-thumb {
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: 20px;
	}

	div::-webkit-scrollbar-thumb:hover {
		background-color: rgba(0, 0, 0, 0.2);
	}
</style>