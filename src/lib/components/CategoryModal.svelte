<script lang="ts">
	import type { Category } from '$lib/types';
	import { bookmarkStore } from '$lib/store.svelte';

	interface Props {
		category?: Category;
		parentId?: string;
		categories: Category[];
		onClose: () => void;
		onSave: () => void;
	}

	let { category, parentId, categories, onClose, onSave }: Props = $props();

	let formData = $state({
		name: category?.name || '',
		parentId: category?.parentId || parentId || '',
		order: category?.order || categories.length
	});

	function handleSubmit(e: Event) {
		e.preventDefault();

		if (category) {
			bookmarkStore.updateCategory(category.id, {
				name: formData.name,
				parentId: formData.parentId || undefined,
				order: formData.order
			});
		} else {
			bookmarkStore.addCategory({
				name: formData.name,
				parentId: formData.parentId || undefined,
				order: formData.order
			});
		}

		onSave();
	}
</script>

<div class="modal-overlay" onclick={onClose}>
	<div class="modal-content" onclick={(e) => e.stopPropagation()}>
		<div class="modal-header">
			<h2>{category ? 'Edit' : 'Add'} Category</h2>
			<button class="close-btn" onclick={onClose}>×</button>
		</div>

		<form onsubmit={handleSubmit}>
			<div class="form-group">
				<label for="name">Category Name *</label>
				<input
					type="text"
					id="name"
					bind:value={formData.name}
					required
					placeholder="e.g., Frontend Development"
				/>
			</div>

			<div class="form-group">
				<label for="parent">Parent Category</label>
				<select id="parent" bind:value={formData.parentId}>
					<option value="">No parent (root category)</option>
					{#each categories.filter((c) => !category || c.id !== category.id) as cat}
						<option value={cat.id}>{cat.name}</option>
					{/each}
				</select>
			</div>

			<div class="modal-actions">
				<button type="button" onclick={onClose} class="btn-cancel">Cancel</button>
				<button type="submit" class="btn-save">Save</button>
			</div>
		</form>
	</div>
</div>

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
	}

	.modal-content {
		background: white;
		border-radius: 8px;
		width: 100%;
		max-width: 500px;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.modal-header h2 {
		margin: 0;
		font-size: 1.5rem;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 2rem;
		cursor: pointer;
		color: #6b7280;
		padding: 0;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
	}

	.close-btn:hover {
		color: #1f2937;
	}

	form {
		padding: 1.5rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: #374151;
	}

	input,
	select {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		font-size: 1rem;
		font-family: inherit;
	}

	input:focus,
	select:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.modal-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		padding-top: 1rem;
		border-top: 1px solid #e5e7eb;
	}

	.btn-cancel,
	.btn-save {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;
		transition: background-color 0.2s;
	}

	.btn-cancel {
		background-color: #f3f4f6;
		color: #374151;
	}

	.btn-cancel:hover {
		background-color: #e5e7eb;
	}

	.btn-save {
		background-color: #3b82f6;
		color: white;
	}

	.btn-save:hover {
		background-color: #2563eb;
	}
</style>
