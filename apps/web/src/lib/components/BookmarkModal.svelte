<script lang="ts">
	import type { Bookmark, Category } from '$lib/types';
	import { bookmarkStore } from '$lib/store.svelte';
	import { getFaviconUrl } from '$lib/utils';

	interface Props {
		bookmark?: Bookmark;
		categories: Category[];
		onClose: () => void;
		onSave: () => void;
	}

	let { bookmark, categories, onClose, onSave }: Props = $props();

	let formData = $state({
		title: bookmark?.title || '',
		url: bookmark?.url || '',
		description: bookmark?.description || '',
		categoryId: bookmark?.categoryId || '',
		tags: bookmark?.tags.join(', ') || '',
		status: bookmark?.status || 'unread'
	});

	function handleSubmit(e: Event) {
		e.preventDefault();

		const tags = formData.tags
			.split(',')
			.map((t) => t.trim())
			.filter((t) => t);

		if (bookmark) {
			bookmarkStore.updateBookmark(bookmark.id, {
				title: formData.title,
				url: formData.url,
				description: formData.description || undefined,
				categoryId: formData.categoryId || undefined,
				tags,
				status: formData.status as Bookmark['status'],
				favicon: getFaviconUrl(formData.url)
			});
		} else {
			bookmarkStore.addBookmark({
				title: formData.title,
				url: formData.url,
				description: formData.description || undefined,
				categoryId: formData.categoryId || undefined,
				tags,
				status: formData.status as Bookmark['status'],
				favicon: getFaviconUrl(formData.url)
			});
		}

		onSave();
	}
</script>

<div class="modal-overlay" onclick={onClose}>
	<div class="modal-content" onclick={(e) => e.stopPropagation()}>
		<div class="modal-header">
			<h2>{bookmark ? 'Edit' : 'Add'} Bookmark</h2>
			<button class="close-btn" onclick={onClose}>×</button>
		</div>

		<form onsubmit={handleSubmit}>
			<div class="form-group">
				<label for="title">Title *</label>
				<input
					type="text"
					id="title"
					bind:value={formData.title}
					required
					placeholder="Bookmark title"
				/>
			</div>

			<div class="form-group">
				<label for="url">URL *</label>
				<input
					type="url"
					id="url"
					bind:value={formData.url}
					required
					placeholder="https://example.com"
				/>
			</div>

			<div class="form-group">
				<label for="description">Description</label>
				<textarea
					id="description"
					bind:value={formData.description}
					placeholder="Optional description"
					rows="3"
				></textarea>
			</div>

			<div class="form-group">
				<label for="category">Category</label>
				<select id="category" bind:value={formData.categoryId}>
					<option value="">No category</option>
					{#each categories as cat}
						<option value={cat.id}>{cat.name}</option>
					{/each}
				</select>
			</div>

			<div class="form-group">
				<label for="tags">Tags (comma-separated)</label>
				<input
					type="text"
					id="tags"
					bind:value={formData.tags}
					placeholder="tag1, tag2, tag3"
				/>
			</div>

			<div class="form-group">
				<label for="status">Status</label>
				<select id="status" bind:value={formData.status}>
					<option value="unread">Unread</option>
					<option value="reading">Reading</option>
					<option value="completed">Completed</option>
					<option value="archived">Archived</option>
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
		max-width: 600px;
		max-height: 90vh;
		overflow-y: auto;
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
	textarea,
	select {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		font-size: 1rem;
		font-family: inherit;
	}

	input:focus,
	textarea:focus,
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
