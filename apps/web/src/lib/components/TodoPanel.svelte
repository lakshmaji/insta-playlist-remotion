<script lang="ts">
	import type { TodoItem, Category } from '$lib/types';
	import { bookmarkStore } from '$lib/store.svelte';

	interface Props {
		todos: TodoItem[];
		categories: Category[];
	}

	let { todos, categories }: Props = $props();

	let showAddForm = $state(false);
	let newTodo = $state({
		title: '',
		description: '',
		categoryId: ''
	});

	function handleAddTodo() {
		if (newTodo.title.trim()) {
			bookmarkStore.addTodo({
				title: newTodo.title,
				description: newTodo.description || undefined,
				categoryId: newTodo.categoryId || undefined,
				completed: false,
				bookmarkIds: []
			});

			newTodo = { title: '', description: '', categoryId: '' };
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

	const todosByCategory = $derived(() => {
		const grouped = new Map<string | undefined, TodoItem[]>();

		todos.forEach((todo) => {
			const key = todo.categoryId || undefined;
			if (!grouped.has(key)) {
				grouped.set(key, []);
			}
			grouped.get(key)!.push(todo);
		});

		return grouped;
	});
</script>

<div class="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm p-4 h-full overflow-y-auto">
	<div class="flex justify-between items-center mb-4 pb-3 border-b-2 border-gradient-to-r from-blue-200 to-purple-200">
		<h3 class="m-0 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
			<span>📝</span>
			To-Do List
		</h3>
		<button onclick={() => (showAddForm = !showAddForm)} class="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white border-none rounded-lg cursor-pointer text-sm font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-sm hover:shadow-md">
			{showAddForm ? '−' : '+'} Add
		</button>
	</div>

	{#if showAddForm}
		<div class="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg mb-4 border border-blue-200">
			<input
				type="text"
				bind:value={newTodo.title}
				placeholder="Todo title"
				class="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
			/>
			<input
				type="text"
				bind:value={newTodo.description}
				placeholder="Description (optional)"
				class="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
			/>
			<select bind:value={newTodo.categoryId} class="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
				<option value="">No category</option>
				{#each categories as cat}
					<option value={cat.id}>{cat.name}</option>
				{/each}
			</select>
			<div class="flex gap-2">
				<button onclick={handleAddTodo} class="px-4 py-2 bg-blue-500 text-white border-none rounded-lg cursor-pointer text-sm font-medium hover:bg-blue-600 transition-all">
					Save
				</button>
				<button onclick={() => (showAddForm = false)} class="px-4 py-2 bg-gray-200 text-gray-700 border-none rounded-lg cursor-pointer text-sm font-medium hover:bg-gray-300 transition-all">
					Cancel
				</button>
			</div>
		</div>
	{/if}

	<div class="flex flex-col gap-3">
		{#if todos.length === 0}
			<p class="text-center text-gray-400 py-8 text-sm">No todos yet. Create one to get started!</p>
		{:else}
			{#each Array.from(todosByCategory()) as [categoryId, categoryTodos]}
				{@const category = categories.find((c) => c.id === categoryId)}
				<div class="mb-3">
					<h4 class="text-xs text-gray-600 m-0 mb-2 uppercase font-semibold tracking-wide">
						{category?.name || 'Uncategorized'}
					</h4>
					{#each categoryTodos as todo}
						<div class="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 mb-2 transition-all hover:from-gray-100 hover:to-gray-150 {todo.completed ? 'opacity-60' : ''}">
							<input
								type="checkbox"
								checked={todo.completed}
								onchange={() => toggleTodo(todo.id, todo.completed)}
								class="mt-1 cursor-pointer w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
							/>
							<div class="flex-1">
								<div class="font-medium text-gray-900 text-sm {todo.completed ? 'line-through' : ''}">
									{todo.title}
								</div>
								{#if todo.description}
									<div class="text-xs text-gray-600 mt-1">{todo.description}</div>
								{/if}
							</div>
							<button onclick={() => deleteTodo(todo.id)} class="bg-none border-none text-gray-400 cursor-pointer text-xl p-0 w-6 h-6 flex items-center justify-center leading-none hover:text-red-500 transition-colors">
								×
							</button>
						</div>
					{/each}
				</div>
			{/each}
		{/if}
	</div>
</div>
