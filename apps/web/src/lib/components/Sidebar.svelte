<script lang="ts"><script lang="ts">

	import type { Collection, Kind, Tag } from '$lib/types';	import type { Collection, Kind, Tag } from '$lib/types';



	interface Props {	interface Props {

		selectedSection: string;		selectedSection: string;

		onSelectSection: (section: string) => void;		onSelectSection: (section: string) => void;

		kinds: Kind[];		kinds: Kind[];

		collections: Collection[];		collections: Collection[];

		tags: Tag[];		tags: Tag[];

		selectedKindId?: string;		selectedKindId?: string;

		selectedCollectionId?: string;		selectedCollectionId?: string;

		selectedTagId?: string;		selectedTagId?: string;

		onSelectKind: (kindId: string | undefined) => void;		onSelectKind: (kindId: string | undefined) => void;

		onSelectCollection: (collectionId: string | undefined) => void;		onSelectCollection: (collectionId: string | undefined) => void;

		onSelectTag: (tagId: string | undefined) => void;		onSelectTag: (tagId: string | undefined) => void;

		onAddKind: () => void;		onAddKind: () => void;

		onAddBookmark: () => void;		onAddBookmark: () => void;

		onAddCollection: () => void;		onAddCollection: () => void;

		onAddTag: () => void;		onAddTag: () => void;

	}	}



	let { 	let { 

		selectedSection, 		selectedSection, 

		onSelectSection, 		onSelectSection, 

		kinds,		kinds,

		collections = [],		collections = [],

		tags = [], 		tags = [], 

		selectedKindId, 		selectedKindId, 

		selectedCollectionId,		selectedCollectionId,

		selectedTagId,		selectedTagId,

		onSelectKind, 		onSelectKind, 

		onSelectCollection = () => {},		onSelectCollection = () => {},

		onSelectTag = () => {},		onSelectTag = () => {},

		onAddKind, 		onAddKind, 

		onAddBookmark = () => {}, 		onAddBookmark = () => {}, 

		onAddCollection = () => {},		onAddCollection = () => {},

		onAddTag = () => {} 		onAddTag = () => {} 

	}: Props = $props();	}: Props = $props();

		

	// Get root collections (no parentId)	// Get root collections (no parentId)

	const rootCollections = $derived(collections.filter(c => !c.parentId));	const rootCollections = $derived(collections.filter(c => !c.parentId));

</script></script>



<div class="bg-neutral-900 p-0 h-full overflow-y-auto flex flex-col text-white"><div class="bg-neutral-900 p-0 h-full overflow-y-auto flex flex-col text-white">

	<!-- Top buttons -->	<!-- Top buttons -->

	<div class="p-4 flex flex-col gap-2 border-b border-neutral-800">	<div class="p-3 flex flex-col gap-2">

		<button 		<button 

			onclick={onAddBookmark}			onclick={onAddBookmark}

			class="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg w-full hover:bg-blue-700 transition-all font-medium">			class="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md w-full hover:bg-neutral-800 transition-all">

			<span class="text-base">+</span>			<span class="text-lg">+</span>

			<span>New ...</span>			<span>New ...</span>

		</button>		</button>

		<button 		<button 

			onclick={onAddCollection}			onclick={onAddCollection}

			class="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 rounded-lg w-full hover:bg-neutral-700 transition-all">			class="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-md w-full hover:bg-neutral-700 transition-all">

			<span class="text-base">📁</span>			<span class="text-lg">📁</span>

			<span>New ...</span>			<span>New ...</span>

		</button>		</button>

	</div>	</div>

		

	<!-- Dashboard section -->	<!-- Dashboard section -->

	<div class="px-4 py-3 border-b border-neutral-800">	<div class="p-3 mb-2">

		<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 hover:bg-neutral-800 {selectedSection === 'dashboard' ? 'bg-neutral-800' : ''}" 		<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 hover:bg-neutral-800" 

			onclick={() => onSelectSection('dashboard')} role="button" tabindex="0">			onclick={() => onSelectSection('dashboard')} role="button" tabindex="0">

			<span class="text-base">🏠</span>			<span class="text-lg">🏠</span>

			<span class="text-sm font-medium">Dashboard</span>			<span>Dashboard</span>

		</div>		</div>

	</div>	</div>



	<!-- Navigation section -->	<!-- Navigation section -->

	<div class="px-4 py-3 border-b border-neutral-800">	<div class="p-3">

		<h3 class="text-xs font-semibold text-neutral-500 uppercase mb-3 px-3">Navigation</h3>		<h3 class="text-sm font-semibold text-neutral-400 uppercase mb-2">Navigation</h3>

		<div class="flex flex-col gap-0.5">		<div class="flex flex-col gap-1">

			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 {selectedSection === 'inbox' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}" 			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'inbox' ? 'bg-neutral-800 font-semibold' : 'hover:bg-neutral-800'}" 

				onclick={() => onSelectSection('inbox')} role="button" tabindex="0">				onclick={() => onSelectSection('inbox')} role="button" tabindex="0">

				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">				<span class="text-lg">📥</span>

					<path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>				<span>Inbox</span>

					<path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path>			</div>

				</svg>			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'all' ? 'bg-neutral-800 font-semibold' : 'hover:bg-neutral-800'}" 

				<span class="text-sm">Inbox</span>				onclick={() => onSelectSection('all')} role="button" tabindex="0">

			</div>				<span class="text-lg">�</span>

			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 {selectedSection === 'all' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}" 				<span>All Bookmarks</span>

				onclick={() => onSelectSection('all')} role="button" tabindex="0">			</div>

				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'favorites' ? 'bg-neutral-800 font-semibold' : 'hover:bg-neutral-800'}" 

					<path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>				onclick={() => onSelectSection('favorites')} role="button" tabindex="0">

				</svg>				<span class="text-lg">⭐</span>

				<span class="text-sm">All Bookmarks</span>				<span>Favorites</span>

			</div>			</div>

			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 {selectedSection === 'favorites' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}" 			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'reading' ? 'bg-neutral-800 font-semibold' : 'hover:bg-neutral-800'}" 

				onclick={() => onSelectSection('favorites')} role="button" tabindex="0">				onclick={() => onSelectSection('reading')} role="button" tabindex="0">

				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">				<span class="text-lg">📖</span>

					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>				<span>Reading List</span>

				</svg>			</div>

				<span class="text-sm">Favorites</span>			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'collections' ? 'bg-neutral-800 font-semibold' : 'hover:bg-neutral-800'}" 

			</div>				onclick={() => onSelectSection('collections')} role="button" tabindex="0">

			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 {selectedSection === 'reading' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}" 				<span class="text-lg">📁</span>

				onclick={() => onSelectSection('reading')} role="button" tabindex="0">				<span>Collections</span>

				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">			</div>

					<path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'tags' ? 'bg-neutral-800 font-semibold' : 'hover:bg-neutral-800'}" 

				</svg>				onclick={() => onSelectSection('tags')} role="button" tabindex="0">

				<span class="text-sm">Reading List</span>				<span class="text-lg">🏷️</span>

			</div>				<span>Tags</span>

			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 {selectedSection === 'collections' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}" 			</div>

				onclick={() => onSelectSection('collections')} role="button" tabindex="0">			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedSection === 'archive' ? 'bg-neutral-800 font-semibold' : 'hover:bg-neutral-800'}" 

				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">				onclick={() => onSelectSection('archive')} role="button" tabindex="0">

					<path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>				<span class="text-lg">🗃️</span>

				</svg>				<span>Archive</span>

				<span class="text-sm">Collections</span>			</div>

			</div>		</div>

			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 {selectedSection === 'tags' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}" 	</div>

				onclick={() => onSelectSection('tags')} role="button" tabindex="0">

				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">	<!-- Collections section -->

					<path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>	<div class="p-3">

				</svg>		<div class="flex justify-between items-center mb-2">

				<span class="text-sm">Tags</span>			<h3 class="text-sm font-semibold text-neutral-400 uppercase">Collections</h3>

			</div>			<button onclick={onAddCollection} class="text-neutral-400 hover:text-white transition-all">

			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 {selectedSection === 'archive' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}" 				<span class="text-lg">+</span>

				onclick={() => onSelectSection('archive')} role="button" tabindex="0">			</button>

				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">		</div>

					<path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"></path>		<div class="flex flex-col gap-1">

					<path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd"></path>			{#each rootCollections as collection}

				</svg>				<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedCollectionId === collection.id ? 'bg-neutral-800 font-semibold' : 'hover:bg-neutral-800'}" 

				<span class="text-sm">Archive</span>					onclick={() => onSelectCollection(collection.id)} role="button" tabindex="0">

			</div>					<span class="text-lg">📁</span>

		</div>					<span>{collection.name}</span>

	</div>				</div>

			{/each}

	<!-- Collections section -->			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 hover:bg-neutral-800 text-neutral-400" 

	<div class="px-4 py-3 border-b border-neutral-800">				onclick={onAddCollection} role="button" tabindex="0">

		<div class="flex justify-between items-center mb-3 px-3">				<span>+ New page</span>

			<h3 class="text-xs font-semibold text-neutral-500 uppercase">Collections</h3>			</div>

			<button onclick={onAddCollection} class="text-neutral-500 hover:text-white transition-all">		</div>

				<span class="text-sm">+</span>	</div>

			</button>

		</div>	<!-- Kind section -->

		<div class="flex flex-col gap-0.5">	<div class="p-3">

			{#each rootCollections.slice(0, 3) as collection}		<div class="flex justify-between items-center mb-2">

				<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 text-neutral-400 hover:bg-neutral-800 hover:text-white {selectedCollectionId === collection.id ? 'bg-neutral-800 text-white' : ''}" 			<h3 class="text-sm font-semibold text-neutral-400 uppercase">Kind</h3>

					onclick={() => onSelectCollection(collection.id)} role="button" tabindex="0">			<button onclick={onAddKind} class="text-neutral-400 hover:text-white transition-all">

					<span class="text-base">📁</span>				<span class="text-lg">+</span>

					<span class="text-sm truncate">{collection.name}</span>			</button>

				</div>		</div>

			{/each}		<div class="flex flex-col gap-1">

			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 hover:bg-neutral-800 text-neutral-500 hover:text-white" 			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {!selectedKindId ? 'bg-neutral-800 font-semibold' : 'hover:bg-neutral-800'}" 

				onclick={onAddCollection} role="button" tabindex="0">				onclick={() => onSelectKind(undefined)} role="button" tabindex="0">

				<span class="text-xs">+ New page</span>				<span class="text-lg">📋</span>

			</div>				<span>Articles</span>

		</div>			</div>

	</div>			

			{#each kinds as kind}

	<!-- Kind section -->				<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedKindId === kind.id ? 'bg-neutral-800 font-semibold' : 'hover:bg-neutral-800'}" 

	<div class="px-4 py-3">					onclick={() => onSelectKind(kind.id)} role="button" tabindex="0">

		<div class="flex justify-between items-center mb-3 px-3">					<span class="text-lg">{kind.icon || '📁'}</span>

			<h3 class="text-xs font-semibold text-neutral-500 uppercase">Kind</h3>					<span>{kind.name}</span>

			<button onclick={onAddKind} class="text-neutral-500 hover:text-white transition-all">				</div>

				<span class="text-sm">+</span>			{/each}

			</button>		</div>

		</div>	</div>

		<div class="flex flex-col gap-0.5">	

			{#each kinds as kind}	<!-- Tags section -->

				<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 text-neutral-400 hover:bg-neutral-800 hover:text-white {selectedKindId === kind.id ? 'bg-neutral-800 text-white' : ''}" 	<div class="p-3">

					onclick={() => onSelectKind(kind.id)} role="button" tabindex="0">		<div class="flex justify-between items-center mb-2">

					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">			<h3 class="text-sm font-semibold text-neutral-400 uppercase">Tags</h3>

						<path fill-rule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd"></path>			<button onclick={onAddTag} class="text-neutral-400 hover:text-white transition-all">

						<path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"></path>				<span class="text-lg">+</span>

					</svg>			</button>

					<span class="text-sm">{kind.name}</span>		</div>

				</div>		<div class="flex flex-col gap-1">

			{/each}			{#each tags as tag}

		</div>				<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 {selectedTagId === tag.id ? 'bg-neutral-800 font-semibold' : 'hover:bg-neutral-800'}" 

	</div>					onclick={() => onSelectTag(tag.id)} role="button" tabindex="0">

</div>					<span class="text-lg" style="color: {tag.color || 'currentColor'}">🏷️</span>

					<span>{tag.name}</span>

<style>				</div>

	/* Custom scrollbar */			{/each}

	div::-webkit-scrollbar {			<div class="py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center gap-2 hover:bg-neutral-800 text-neutral-400" 

		width: 6px;				onclick={onAddTag} role="button" tabindex="0">

	}				<span>+ New page</span>

			</div>

	div::-webkit-scrollbar-track {		</div>

		background: transparent;	</div>

	}</div>



	div::-webkit-scrollbar-thumb {<style>

		background-color: rgba(255, 255, 255, 0.1);	/* Custom scrollbar */

		border-radius: 20px;	div::-webkit-scrollbar {

	}		width: 6px;

	}

	div::-webkit-scrollbar-thumb:hover {

		background-color: rgba(255, 255, 255, 0.2);	div::-webkit-scrollbar-track {

	}		background: transparent;

</style>	}


	div::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 20px;
	}

	div::-webkit-scrollbar-thumb:hover {
		background-color: rgba(255, 255, 255, 0.2);
	}
</style>