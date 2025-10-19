<script lang="ts">
    import { bookmarkStore } from '$lib/store.svelte';
</script>

<div class="fixed bottom-0 right-0 p-4 z-50">
    <button 
        onclick={() => bookmarkStore.resetToSeedData()}
        class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow-lg transition-all"
        title="Reset app to initial seed data (for development)"
    >
        Reset Data
    </button>
</div>

<style>
    div {
        opacity: 0.5;
        transition: opacity 0.2s;
    }
    
    div:hover {
        opacity: 1;
    }
</style>