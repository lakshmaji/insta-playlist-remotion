<script lang="ts">
	import type { TodoItem, Collection } from '$lib/types';
	import { bookmarkStore } from '$lib/store.svelte';

	interface Props {
		todos: TodoItem[];
		collections: Collection[];
	}

	let { todos, collections }: Props = $props();

	let showAddForm = $state(false);
	let newTodo = $state({
		title: '',
		description: '',
		collectionId: ''
	});

	function handleAddTodo() {
		if (newTodo.title.trim()) {
			bookmarkStore.addTodo({
				title: newTodo.title,
				description: newTodo.description || undefined,
				collectionId: newTodo.collectionId || undefined,
				completed: false,
				bookmarkIds: []
			});

			newTodo = { title: '', description: '', collectionId: '' };
			showAddForm = false;
		}
	}

	function toggleTodo(id: string, completed: boolean) {
		bookmarkStore.updateTodo(id, { completed: !completed });
	}

	function deleteTodo(id: string) {
		if (confirm('Are you sure you want to delete this todo?')) {
			bookmarkStore.deleteTodo(id);
		}
	}

	const todosByCollection = $derived(() => {
		const grouped = new Map<string | undefined, TodoItem[]>();

		todos.forEach((todo) => {
			const key = todo.collectionId || undefined;
			if (!grouped.has(key)) {
				grouped.set(key, []);
			}
			grouped.get(key)!.push(todo);
		});

		return grouped;
	});
</script>

<div class="bg-neutral-800 rounded-md p-4 h-full overflow-y-auto">
	<div class="flex justify-between items-center mb-4 pb-3 border-b border-neutral-700">
		<h3 class="m-0 text-xl font-bold text-white flex items-center gap-2">
			<span>📝</span>
			To-Do List
		</h3>
		<button onclick={() => (showAddForm = !showAddForm)} class="px-4 py-2 bg-blue-600 text-white border-none rounded-md cursor-pointer text-sm font-semibold hover:bg-blue-700 transition-all">
			{showAddForm ? '−' : '+'} Add
		</button>
	</div>

	{#if showAddForm}
		<div class="bg-neutral-900 p-4 rounded-md mb-4 border border-neutral-700">
			<input
				type="text"
				bind:value={newTodo.title}
				placeholder="Todo title"
				class="w-full px-3 py-2 border border-neutral-700 rounded-md mb-2 text-sm bg-neutral-800 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
			/>
			<input
				type="text"
				bind:value={newTodo.description}
				placeholder="Description (optional)"
				class="w-full px-3 py-2 border border-neutral-700 rounded-md mb-2 text-sm bg-neutral-800 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
			/>
			<select bind:value={newTodo.collectionId} class="w-full px-3 py-2 border border-neutral-700 rounded-md mb-3 text-sm bg-neutral-800 text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
				<option value="">No collection</option>
				{#each collections as col}
					<option value={col.id}>{col.name}</option>
				{/each}
			</select>
			<div class="flex gap-2">
				<button onclick={handleAddTodo} class="px-4 py-2 bg-blue-600 text-white border-none rounded-md cursor-pointer text-sm font-medium hover:bg-blue-700 transition-all">
					Save
				</button>
				<button onclick={() => (showAddForm = false)} class="px-4 py-2 bg-neutral-700 text-white border-none rounded-md cursor-pointer text-sm font-medium hover:bg-neutral-600 transition-all">
					Cancel
				</button>
			</div>
		</div>
	{/if}

	<div class="flex flex-col gap-3">
		{#if todos.length === 0}
			<p class="text-center text-neutral-500 py-8 text-sm">No todos yet. Create one to get started!</p>
		{:else}
			{#each Array.from(todosByCollection()) as [collectionId, collectionTodos]}
				{@const collection = collections.find((c) => c.id === collectionId)}
				<div class="mb-3">
					<h4 class="text-xs text-neutral-400 m-0 mb-2 uppercase font-semibold tracking-wide">
						{collection?.name || 'Uncategorized'}
					</h4>
					{#each collectionTodos as todo}
						<div class="flex items-start gap-3 p-3 rounded-md bg-neutral-900/50 mb-2 transition-all hover:bg-neutral-900 {todo.completed ? 'opacity-60' : ''}">
							<input
								type="checkbox"
								checked={todo.completed}
								onchange={() => toggleTodo(todo.id, todo.completed)}
								class="mt-1 cursor-pointer w-4 h-4 text-blue-600 rounded focus:ring-1 focus:ring-blue-500"
							/>
							<div class="flex-1">
								<div class="font-medium text-white text-sm {todo.completed ? 'line-through text-neutral-400' : ''}">
									{todo.title}
								</div>
								{#if todo.description}
									<div class="text-xs text-neutral-400 mt-1">{todo.description}</div>
								{/if}
							</div>
							<button onclick={() => deleteTodo(todo.id)} class="bg-none border-none text-neutral-500 cursor-pointer text-xl p-0 w-6 h-6 flex items-center justify-center leading-none hover:text-red-500 transition-colors">
								×
							</button>
						</div>
					{/each}
				</div>
			{/each}
		{/if}
	</div>
</div>
