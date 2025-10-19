<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import DevPanel from '$lib/components/DevPanel.svelte';
	import { dev } from '$app/environment';
	import { themeStore } from '$lib/theme.svelte';

	let { children } = $props();
	
	// Initialize theme store (this ensures the constructor runs)
	// The store will handle applying the theme class to the HTML element
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

{#if dev}
	<DevPanel />
{/if}
