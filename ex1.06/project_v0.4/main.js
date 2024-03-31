const http = require('node:http');
const fs = require('fs')

const hostname = '0.0.0.0';
const port = process.env.PORT;

const server = http.createServer((req, res) => {
	if (req.method == 'GET' && req.url == '/') {
		fs.readFile('index.html', (err, data) => {
			if (err) {
				res.statusCode = 500;
				res.setHeader('Content-Type', 'text/plain');
				res.end('Error reading file.')
			} else {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'text/html');
				res.end(data);
			}
		});
	} else {
		res.statusCode = 404;
		res.setHeader('Content-Type', 'text/error');
		res.end('Not Found\n');
	}
});

server.listen(port, hostname, () => { console.log(`Server running at http://${hostname}:${port}/`); });
