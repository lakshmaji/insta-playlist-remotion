<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import DevPanel from '$lib/components/DevPanel.svelte';
	import { dev } from '$app/environment';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

{#if dev}
	<DevPanel />
{/if}
