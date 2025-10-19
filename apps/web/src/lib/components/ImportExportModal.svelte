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
				const { bookmarks, collections } = parseBookmarkHTML(content);

				// Add collections first
				const collectionMap = new Map<string, string>();
				collections.forEach((col) => {
					const newCol = bookmarkStore.addCollection(col);
					if (col.name) {
						collectionMap.set(col.name, newCol.id);
					}
				});

				// Then add bookmarks with updated collection IDs
				bookmarks.forEach((bookmark) => {
					const collectionId = bookmark.collectionId
						? collectionMap.get(bookmark.collectionId)
						: undefined;
					bookmarkStore.addBookmark({
						...bookmark,
						collectionId
					});
				});

				alert(`Imported ${bookmarks.length} bookmarks and ${collections.length} collections!`);
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
		const html = exportToBookmarkHTML(bookmarkStore.bookmarks, bookmarkStore.collections);
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

<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onclick={onClose} role="dialog" tabindex="-1">
	<div class="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl" onclick={(e) => e.stopPropagation()} role="document">
		<div class="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
			<h2 class="m-0 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">📦 Import / Export Bookmarks</h2>
			<button class="bg-none border-none text-3xl cursor-pointer text-gray-400 p-0 w-10 h-10 flex items-center justify-center leading-none hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all" onclick={onClose}>×</button>
		</div>

		<div class="flex border-b border-gray-200">
			<button
				class="flex-1 px-4 py-3 bg-none border-none cursor-pointer text-base font-semibold transition-all {activeTab === 'import' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 border-b-2 border-transparent hover:text-gray-900'}"
				onclick={() => (activeTab = 'import')}
			>
				📥 Import
			</button>
			<button
				class="flex-1 px-4 py-3 bg-none border-none cursor-pointer text-base font-semibold transition-all {activeTab === 'export' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 border-b-2 border-transparent hover:text-gray-900'}"
				onclick={() => (activeTab = 'export')}
			>
				📤 Export
			</button>
		</div>

		<div class="p-6">
			{#if activeTab === 'import'}
				<div class="max-w-full">
					<h3 class="m-0 mb-2 text-xl font-bold">Import Bookmarks</h3>
					<p class="text-gray-600 mb-6">
						Import bookmarks from your browser (HTML format) or from a previous export (JSON format).
					</p>

					<div class="flex gap-6 mb-6">
						<label class="flex items-center gap-2 cursor-pointer">
							<input type="radio" bind:group={importType} value="html" class="w-4 h-4 text-blue-600" />
							<span class="font-medium">HTML (Browser Export)</span>
						</label>
						<label class="flex items-center gap-2 cursor-pointer">
							<input type="radio" bind:group={importType} value="json" class="w-4 h-4 text-blue-600" />
							<span class="font-medium">JSON (Previous Export)</span>
						</label>
					</div>

					<div class="mb-6">
						<input
							type="file"
							accept={importType === 'html' ? '.html,.htm' : '.json'}
							onchange={handleFileImport}
							bind:this={fileInput}
							class="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-all"
						/>
					</div>

					<div class="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg text-sm border border-blue-200">
						<h4 class="m-0 mb-2 font-semibold">How to export bookmarks from your browser:</h4>
						<ul class="m-0 pl-6 space-y-1">
							<li><strong>Chrome/Edge:</strong> Menu → Bookmarks → Bookmark Manager → ⋮ → Export bookmarks</li>
							<li><strong>Firefox:</strong> Menu → Bookmarks → Manage Bookmarks → Import and Backup → Export Bookmarks to HTML</li>
							<li><strong>Safari:</strong> File → Export Bookmarks</li>
						</ul>
					</div>
				</div>
			{:else}
				<div class="max-w-full">
					<h3 class="m-0 mb-2 text-xl font-bold">Export Bookmarks</h3>
					<p class="text-gray-600 mb-6">Export your bookmarks to import them into a browser or to backup your data.</p>

					<div class="flex flex-col gap-4">
						<button onclick={exportHTML} class="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl bg-white cursor-pointer text-left transition-all hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md">
							<span class="text-4xl">📄</span>
							<div>
								<div class="font-semibold text-lg mb-1">Export as HTML</div>
								<div class="text-gray-600 text-sm">Compatible with all browsers</div>
							</div>
						</button>

						<button onclick={exportJSON} class="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl bg-white cursor-pointer text-left transition-all hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md">
							<span class="text-4xl">💾</span>
							<div>
								<div class="font-semibold text-lg mb-1">Export as JSON</div>
								<div class="text-gray-600 text-sm">Includes all data (tags, todos, etc.)</div>
							</div>
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
