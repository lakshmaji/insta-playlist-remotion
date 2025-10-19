<script lang="ts">
	import type { Bookmark } from '$lib/types';
	import { getFaviconUrl } from '$lib/utils';

	interface Props {
		bookmark: Bookmark;
		onEdit: (bookmark: Bookmark) => void;
		onDelete: (id: string) => void;
		onStatusChange: (id: string, status: Bookmark['status']) => void;
	}

	let { bookmark, onEdit, onDelete, onStatusChange }: Props = $props();

	const statusColors = {
		unread: 'bg-gray-200',
		reading: 'bg-blue-200',
		completed: 'bg-green-200',
		archived: 'bg-yellow-200'
	};
</script>

<div class="bookmark-card">
	<div class="bookmark-thumbnail">
		{#if bookmark.thumbnail}
			<img src={bookmark.thumbnail} alt={bookmark.title} />
		{:else}
			<div class="placeholder-thumbnail">
				<img src={getFaviconUrl(bookmark.url)} alt="" class="favicon" />
			</div>
		{/if}
	</div>

	<div class="bookmark-content">
		<div class="bookmark-header">
			<a href={bookmark.url} target="_blank" rel="noopener noreferrer" class="bookmark-title">
				{bookmark.title}
			</a>
			<span class="bookmark-status {statusColors[bookmark.status]}">
				{bookmark.status}
			</span>
		</div>

		{#if bookmark.description}
			<p class="bookmark-description">{bookmark.description}</p>
		{/if}

		{#if bookmark.tags.length > 0}
			<div class="bookmark-tags">
				{#each bookmark.tags as tag}
					<span class="tag">{tag}</span>
				{/each}
			</div>
		{/if}

		<div class="bookmark-actions">
			<select
				value={bookmark.status}
				onchange={(e) => onStatusChange(bookmark.id, e.currentTarget.value as Bookmark['status'])}
				class="status-select"
			>
				<option value="unread">Unread</option>
				<option value="reading">Reading</option>
				<option value="completed">Completed</option>
				<option value="archived">Archived</option>
			</select>

			<button onclick={() => onEdit(bookmark)} class="btn-edit">Edit</button>
			<button onclick={() => onDelete(bookmark.id)} class="btn-delete">Delete</button>
		</div>
	</div>
</div>

<style>
	.bookmark-card {
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		overflow: hidden;
		background: white;
		transition: box-shadow 0.2s;
	}

	.bookmark-card:hover {
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	}

	.bookmark-thumbnail {
		width: 100%;
		height: 150px;
		overflow: hidden;
		background: #f3f4f6;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.bookmark-thumbnail img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.placeholder-thumbnail {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.favicon {
		width: 48px !important;
		height: 48px !important;
		object-fit: contain !important;
	}

	.bookmark-content {
		padding: 1rem;
	}

	.bookmark-header {
		display: flex;
		justify-content: space-between;
		align-items: start;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.bookmark-title {
		font-weight: 600;
		color: #1f2937;
		text-decoration: none;
		flex: 1;
	}

	.bookmark-title:hover {
		color: #3b82f6;
	}

	.bookmark-status {
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		text-transform: capitalize;
		white-space: nowrap;
	}

	.bg-gray-200 {
		background-color: #e5e7eb;
	}

	.bg-blue-200 {
		background-color: #bfdbfe;
	}

	.bg-green-200 {
		background-color: #bbf7d0;
	}

	.bg-yellow-200 {
		background-color: #fef08a;
	}

	.bookmark-description {
		font-size: 0.875rem;
		color: #6b7280;
		margin-bottom: 0.5rem;
	}

	.bookmark-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.tag {
		background-color: #dbeafe;
		color: #1e40af;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
	}

	.bookmark-actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.status-select {
		flex: 1;
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		font-size: 0.875rem;
	}

	.btn-edit,
	.btn-delete {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.875rem;
		transition: background-color 0.2s;
	}

	.btn-edit {
		background-color: #3b82f6;
		color: white;
	}

	.btn-edit:hover {
		background-color: #2563eb;
	}

	.btn-delete {
		background-color: #ef4444;
		color: white;
	}

	.btn-delete:hover {
		background-color: #dc2626;
	}
</style>
