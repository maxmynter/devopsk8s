<script>
	let imageURL = 'http://localhost:3005/image';
	let newTodo = '';
	let todos = [
		// Hardcoded list of todos
		{ id: 1, text: 'Learn Svelte basics' },
		{ id: 2, text: 'Build a Svelte project' },
		{ id: 3, text: 'Explore SvelteKit for SSR' },
		{ id: 4, text: 'Learn K8s' }
	];

	function addTodo() {
		if (newTodo.trim() !== '' && newTodo.length <= 140) {
			const todo = {
				id: todos.length + 1,
				text: newTodo
			};
			todos = [...todos, todo];
			newTodo = '';
		}
	}
</script>

<h1>DevOps with K8s Project</h1>
{#if imageURL}
	<img src={imageURL} alt="Random image from Picsum, cached in container" />
{:else}
	<p>Loading Image...</p>
{/if}

<div class="todo-input">
	<input type="text" bind:value={newTodo} placeholder="Add new Todo" maxlength="140" />
	<button on:click={addTodo}>Send</button>
</div>

<ul class="todos-list">
	{#each todos as { id, text }}
		<li>{text}</li>
	{/each}
</ul>

<style>
	.todo-input {
		margin-top: 20px;
	}
	.todos-list {
		margin-top: 10px;
		list-style-type: none;
		padding: 0;
	}
	.todos-list li {
		padding: 8px;
		margin-bottom: 4px;
		background-color: #f3f3f3;
	}
</style>
