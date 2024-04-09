<script>
	import { onMount } from 'svelte';
	let imagePath = '';

	onMount(async () => {
		const response = await fetch('http://localhost:3005/image'); // ATTENTION: REQUEST MUST GO TO PORT FORWARD OF LOADBALANCER OF K3D CLUSYER
		const data = await response.json();
		imagePath = data.filepath;
	});
</script>

<h1>DevOps with K8s Project</h1>
{#if imagePath}
	<img src={imagePath} alt="Random image from Picsum, cached in container" />
{:else}
	<p>Loading Image...</p>
{/if}
