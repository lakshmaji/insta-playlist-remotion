<script lang="ts">
	import type { Kind } from '$lib/types';

	interface Props {
		kinds: Kind[];
		selectedKindId?: string;
		onSelect: (kindId: string | undefined) => void;
		onEdit: (kind: Kind) => void;
		onDelete: (kindId: string) => void;
		onAdd: () => void;
	}

	let { kinds, selectedKindId, onSelect, onEdit, onDelete, onAdd }: Props = $props();
</script>

<div class="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm p-4 h-full mb-5">
	<div class="flex justify-between items-center mb-4 pb-3 border-b-2 border-gradient-to-r from-blue-200 to-purple-200">
		<h3 class="m-0 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
			<span>🏷️</span>
			Kinds
		</h3>
		<button onclick={onAdd} class="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white border-none rounded-lg cursor-pointer text-sm font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-sm hover:shadow-md">
			+ New
		</button>
	</div>

	<div class="py-2 px-3 mb-2 rounded-lg cursor-pointer transition-all {!selectedKindId ? 'bg-gradient-to-r from-blue-100 to-purple-100 font-semibold shadow-sm' : 'hover:bg-gray-50'}" onclick={() => onSelect(undefined)} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && onSelect(undefined)}>
		<span class="text-base">📚 All Kinds</span>
	</div>

	<div class="flex flex-wrap gap-2 mt-3">
		{#each kinds as kind}
			<div 
				class="flex items-center gap-1.5 py-1.5 px-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 group {selectedKindId === kind.id ? 'bg-gradient-to-r from-blue-100 to-purple-100 font-semibold shadow-sm' : ''}"
				onclick={() => onSelect(kind.id)}
				role="button"
				tabindex="0"
				onkeydown={(e) => e.key === 'Enter' && onSelect(kind.id)}
			>
				<span class="text-lg">{kind.icon || '📄'}</span>
				<span class="flex-1">{kind.name}</span>
				
				<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
					<button
						onclick={(e) => {
							e.stopPropagation();
							onEdit(kind);
						}}
						class="bg-none border-none cursor-pointer p-1 text-sm rounded hover:bg-yellow-100 transition-all"
						title="Edit"
					>
						✏️
					</button>
					<button
						onclick={(e) => {
							e.stopPropagation();
							onDelete(kind.id);
						}}
						class="bg-none border-none cursor-pointer p-1 text-sm rounded hover:bg-red-100 transition-all"
						title="Delete"
					>
						🗑️
					</button>
				</div>
			</div>
		{/each}
	</div>

	{#if kinds.length === 0}
		<div class="text-center text-gray-400 py-4 text-sm">
			No kinds yet. Add your first kind to get started!
		</div>
	{/if}
</div>

<style>
	div:hover > div > div {
		opacity: 1 !important;
	}
</style>