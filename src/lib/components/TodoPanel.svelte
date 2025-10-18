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

<div class="todo-panel">
	<div class="todo-header">
		<h3>📝 To-Do List</h3>
		<button onclick={() => (showAddForm = !showAddForm)} class="btn-add">
			{showAddForm ? '−' : '+'} Add
		</button>
	</div>

	{#if showAddForm}
		<div class="add-form">
			<input
				type="text"
				bind:value={newTodo.title}
				placeholder="Todo title"
				class="input-title"
			/>
			<input
				type="text"
				bind:value={newTodo.description}
				placeholder="Description (optional)"
				class="input-desc"
			/>
			<select bind:value={newTodo.categoryId} class="input-category">
				<option value="">No category</option>
				{#each categories as cat}
					<option value={cat.id}>{cat.name}</option>
				{/each}
			</select>
			<div class="form-actions">
				<button onclick={handleAddTodo} class="btn-save">Save</button>
				<button onclick={() => (showAddForm = false)} class="btn-cancel">Cancel</button>
			</div>
		</div>
	{/if}

	<div class="todo-list">
		{#if todos.length === 0}
			<p class="empty-state">No todos yet. Create one to get started!</p>
		{:else}
			{#each Array.from(todosByCategory()) as [categoryId, categoryTodos]}
				{@const category = categories.find((c) => c.id === categoryId)}
				<div class="todo-category">
					<h4 class="category-title">{category?.name || 'Uncategorized'}</h4>
					{#each categoryTodos as todo}
						<div class="todo-item" class:completed={todo.completed}>
							<input
								type="checkbox"
								checked={todo.completed}
								onchange={() => toggleTodo(todo.id, todo.completed)}
								class="todo-checkbox"
							/>
							<div class="todo-content">
								<div class="todo-title">{todo.title}</div>
								{#if todo.description}
									<div class="todo-description">{todo.description}</div>
								{/if}
							</div>
							<button onclick={() => deleteTodo(todo.id)} class="btn-delete-todo">×</button>
						</div>
					{/each}
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.todo-panel {
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		background: white;
		padding: 1rem;
		height: 100%;
		overflow-y: auto;
	}

	.todo-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid #e5e7eb;
	}

	.todo-header h3 {
		margin: 0;
		font-size: 1.25rem;
	}

	.btn-add {
		padding: 0.5rem 1rem;
		background-color: #10b981;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.875rem;
	}

	.btn-add:hover {
		background-color: #059669;
	}

	.add-form {
		background: #f9fafb;
		padding: 1rem;
		border-radius: 4px;
		margin-bottom: 1rem;
	}

	.input-title,
	.input-desc,
	.input-category {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
	}

	.form-actions {
		display: flex;
		gap: 0.5rem;
	}

	.btn-save,
	.btn-cancel {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.875rem;
	}

	.btn-save {
		background-color: #3b82f6;
		color: white;
	}

	.btn-save:hover {
		background-color: #2563eb;
	}

	.btn-cancel {
		background-color: #e5e7eb;
		color: #374151;
	}

	.btn-cancel:hover {
		background-color: #d1d5db;
	}

	.todo-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.empty-state {
		text-align: center;
		color: #9ca3af;
		padding: 2rem;
	}

	.todo-category {
		margin-bottom: 1rem;
	}

	.category-title {
		font-size: 0.875rem;
		color: #6b7280;
		margin: 0 0 0.5rem 0;
		text-transform: uppercase;
		font-weight: 600;
	}

	.todo-item {
		display: flex;
		align-items: start;
		gap: 0.75rem;
		padding: 0.75rem;
		border-radius: 4px;
		background: #f9fafb;
		margin-bottom: 0.5rem;
		transition: background-color 0.2s;
	}

	.todo-item:hover {
		background: #f3f4f6;
	}

	.todo-item.completed {
		opacity: 0.6;
	}

	.todo-item.completed .todo-title {
		text-decoration: line-through;
	}

	.todo-checkbox {
		margin-top: 0.25rem;
		cursor: pointer;
	}

	.todo-content {
		flex: 1;
	}

	.todo-title {
		font-weight: 500;
		color: #1f2937;
	}

	.todo-description {
		font-size: 0.875rem;
		color: #6b7280;
		margin-top: 0.25rem;
	}

	.btn-delete-todo {
		background: none;
		border: none;
		color: #9ca3af;
		cursor: pointer;
		font-size: 1.5rem;
		padding: 0;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
	}

	.btn-delete-todo:hover {
		color: #ef4444;
	}
</style>
