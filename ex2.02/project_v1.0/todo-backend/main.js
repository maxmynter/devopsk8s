const http = require('http');

const hostname = '0.0.0.0';
const port = process.env.port || 4001;
let todos = []

const server = http.createServer(async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	if (req.method === 'OPTIONS') {
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
		res.end();
		return;
	}

	if (req.method === 'GET' && req.url === '/todos') {
		res.setHeader('Content-Type', "application/json");
		res.end(JSON.stringify(todos));
	} else if (req.method === 'POST' && req.url === '/todos') {
		let body = '';
		req.on('data', chunk => {
			body += chunk.toString();
		});
		req.on('end', () => {
			const todo = JSON.parse(body);
			todo.id = todos.length + 1;
			todos.push(todo);
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(todo));
		})
	} else {
		res.statusCode = 404;
		res.end(`Not found, ${req.url}`)
	}
});

server.listen(port, hostname, () => console.log(`Server running at http://${hostname}:${port}`));
