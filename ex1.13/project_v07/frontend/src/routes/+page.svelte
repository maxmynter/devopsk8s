<script>
	let imageURL = 'http://localhost:3005/image';
</script>

<h1>DevOps with K8s Project</h1>
{#if imageURL}
	<img src={imageURL} alt="Random image from Picsum, cached in container" />
{:else}
	<p>Loading Image...</p>
{/if}
