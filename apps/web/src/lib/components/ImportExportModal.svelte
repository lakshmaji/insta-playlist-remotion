<script lang="ts">
	import { bookmarkStore } from '$lib/store.svelte';
	import { parseBookmarkHTML, exportToBookmarkHTML, downloadFile } from '$lib/utils';

	interface Props {
		onClose: () => void;
	}

	let { onClose }: Props = $props();

	let activeTab = $state<'import' | 'export'>('import');
	let importType = $state<'html' | 'json'>('html');
	let fileInput: HTMLInputElement;

	function handleFileImport(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			const content = event.target?.result as string;

			if (importType === 'html') {
				const { bookmarks, categories } = parseBookmarkHTML(content);

				// Add categories first
				const categoryMap = new Map<string, string>();
				categories.forEach((cat) => {
					const newCat = bookmarkStore.addCategory(cat);
					if (cat.name) {
						categoryMap.set(cat.name, newCat.id);
					}
				});

				// Then add bookmarks with updated category IDs
				bookmarks.forEach((bookmark) => {
					const categoryId = bookmark.categoryId
						? categoryMap.get(bookmark.categoryId)
						: undefined;
					bookmarkStore.addBookmark({
						...bookmark,
						categoryId
					});
				});

				alert(`Imported ${bookmarks.length} bookmarks and ${categories.length} categories!`);
			} else if (importType === 'json') {
				try {
					const data = JSON.parse(content);
					bookmarkStore.importData(data);
					alert('Data imported successfully!');
				} catch (err) {
					alert('Failed to parse JSON file. Please check the file format.');
				}
			}

			onClose();
		};

		reader.readAsText(file);
	}

	function exportHTML() {
		const html = exportToBookmarkHTML(bookmarkStore.bookmarks, bookmarkStore.categories);
		downloadFile(html, 'bookmarks.html', 'text/html');
		alert('Bookmarks exported to HTML!');
	}

	function exportJSON() {
		const data = bookmarkStore.exportData();
		const json = JSON.stringify(data, null, 2);
		downloadFile(json, 'bookmarks.json', 'application/json');
		alert('Data exported to JSON!');
	}
</script>

<div class="modal-overlay" onclick={onClose}>
	<div class="modal-content" onclick={(e) => e.stopPropagation()}>
		<div class="modal-header">
			<h2>Import / Export Bookmarks</h2>
			<button class="close-btn" onclick={onClose}>×</button>
		</div>

		<div class="tabs">
			<button
				class="tab"
				class:active={activeTab === 'import'}
				onclick={() => (activeTab = 'import')}
			>
				Import
			</button>
			<button
				class="tab"
				class:active={activeTab === 'export'}
				onclick={() => (activeTab = 'export')}
			>
				Export
			</button>
		</div>

		<div class="modal-body">
			{#if activeTab === 'import'}
				<div class="import-section">
					<h3>Import Bookmarks</h3>
					<p class="description">
						Import bookmarks from your browser (HTML format) or from a previous export (JSON
						format).
					</p>

					<div class="format-selector">
						<label>
							<input type="radio" bind:group={importType} value="html" />
							HTML (Browser Export)
						</label>
						<label>
							<input type="radio" bind:group={importType} value="json" />
							JSON (Previous Export)
						</label>
					</div>

					<div class="file-upload">
						<input
							type="file"
							accept={importType === 'html' ? '.html,.htm' : '.json'}
							onchange={handleFileImport}
							bind:this={fileInput}
						/>
					</div>

					<div class="help-text">
						<h4>How to export bookmarks from your browser:</h4>
						<ul>
							<li><strong>Chrome/Edge:</strong> Menu → Bookmarks → Bookmark Manager → ⋮ → Export bookmarks</li>
							<li><strong>Firefox:</strong> Menu → Bookmarks → Manage Bookmarks → Import and Backup → Export Bookmarks to HTML</li>
							<li><strong>Safari:</strong> File → Export Bookmarks</li>
						</ul>
					</div>
				</div>
			{:else}
				<div class="export-section">
					<h3>Export Bookmarks</h3>
					<p class="description">Export your bookmarks to import them into a browser or to backup your data.</p>

					<div class="export-buttons">
						<button onclick={exportHTML} class="btn-export">
							<span class="icon">📄</span>
							<div>
								<div class="btn-title">Export as HTML</div>
								<div class="btn-desc">Compatible with all browsers</div>
							</div>
						</button>

						<button onclick={exportJSON} class="btn-export">
							<span class="icon">💾</span>
							<div>
								<div class="btn-title">Export as JSON</div>
								<div class="btn-desc">Includes all data (tags, todos, etc.)</div>
							</div>
						</button>
					</div>
				</div>
			{/if}
		</div>
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
		max-width: 700px;
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

	.tabs {
		display: flex;
		border-bottom: 1px solid #e5e7eb;
	}

	.tab {
		flex: 1;
		padding: 1rem;
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;
		color: #6b7280;
		border-bottom: 2px solid transparent;
		transition: all 0.2s;
	}

	.tab:hover {
		color: #374151;
	}

	.tab.active {
		color: #3b82f6;
		border-bottom-color: #3b82f6;
	}

	.modal-body {
		padding: 1.5rem;
	}

	.import-section,
	.export-section {
		max-width: 100%;
	}

	h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
	}

	.description {
		color: #6b7280;
		margin-bottom: 1.5rem;
	}

	.format-selector {
		display: flex;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.format-selector label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.file-upload {
		margin-bottom: 1.5rem;
	}

	.file-upload input[type='file'] {
		width: 100%;
		padding: 0.75rem;
		border: 2px dashed #d1d5db;
		border-radius: 4px;
		cursor: pointer;
	}

	.help-text {
		background: #f9fafb;
		padding: 1rem;
		border-radius: 4px;
		font-size: 0.875rem;
	}

	.help-text h4 {
		margin: 0 0 0.5rem 0;
	}

	.help-text ul {
		margin: 0;
		padding-left: 1.5rem;
	}

	.help-text li {
		margin-bottom: 0.5rem;
	}

	.export-buttons {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.btn-export {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.5rem;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		background: white;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s;
	}

	.btn-export:hover {
		border-color: #3b82f6;
		background-color: #f0f9ff;
	}

	.icon {
		font-size: 2rem;
	}

	.btn-title {
		font-weight: 600;
		font-size: 1.125rem;
		margin-bottom: 0.25rem;
	}

	.btn-desc {
		color: #6b7280;
		font-size: 0.875rem;
	}
</style>
