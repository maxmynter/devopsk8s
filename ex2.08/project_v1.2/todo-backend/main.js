const { Pool } = require('pg');
const http = require('http');

const hostname = '0.0.0.0';
const port = process.env.port || 4001;


const pool = new Pool({
	user: process.env.POSTGRES_USER,
	host: process.env.POSTGRES_HOST,
	database: process.env.POSTGRES_DB,
	password: process.env.POSTGRES_PASSWORD,
});

async function postTodo(todo) {
	try {
		await pool.query('INSERT INTO todos (text) VALUES ($1)', [todo.text])
	} catch (error) {
		console.log("Could not post todo", todo, error);
	}

}


const server = http.createServer(async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	if (req.method === 'OPTIONS') {
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
		res.end();
		return;
	}

	if (req.method === 'GET' && req.url === '/todos') {
		try {
			const todos = await pool.query('SELECT * FROM todos');
			res.setHeader('Content-Type', "application/json");
			res.end(JSON.stringify(todos.rows));
		} catch (error) {
			console.log("Could not get todos", error);
		}

	} else if (req.method === 'POST' && req.url === '/todos') {
		let body = '';
		req.on('data', chunk => {
			body += chunk.toString();
		});
		req.on('end', () => {
			const todo = JSON.parse(body);
			postTodo({ text: todo.text });
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(todo));
		})

	} else {
		res.statusCode = 404;
		res.end(`Not found, ${req.url}`)
	}
});

server.listen(port, hostname, () => console.log(`Server running at http://${hostname}:${port}`));
