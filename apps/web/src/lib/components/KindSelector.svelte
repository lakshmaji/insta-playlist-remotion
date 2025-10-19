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
	<div class="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
		<h3 class="m-0 text-lg font-bold text-gray-800 flex items-center gap-2">
			<span>🏷️</span>
			Content Types
		</h3>
		<button onclick={onAdd} class="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all text-gray-600">
			+
		</button>
	</div>

	<div class="py-2 px-3 mb-2 rounded-lg cursor-pointer transition-all flex items-center gap-2 {!selectedKindId ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}" onclick={() => onSelect(undefined)} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && onSelect(undefined)}>
		<span class="text-lg">📚</span>
		<span>All Types</span>
	</div>

	<div class="flex flex-col gap-1 mt-3">
		{#each kinds as kind}
			<div 
				class="flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 group {selectedKindId === kind.id ? 'bg-gray-100 font-semibold' : ''}"
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
						class="bg-none border-none cursor-pointer p-1 text-xs rounded hover:bg-yellow-100 transition-all"
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