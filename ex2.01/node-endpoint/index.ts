import * as http from 'http';
import { createHash } from 'crypto';

const PORT: number = process.env.PORT ? +process.env.PORT : 3000;
const pingpongPort = 3001;
const pingpongEndpoint = `http://localhost:${pingpongPort}`;


const getPongCount = () => new Promise((resolve, reject) => {
	http.get(pingpongEndpoint, (res) => {
		let data = '';
		res.on('data', (chunk) => {
			data += chunk;
		});
		res.on('end', () => {
			resolve(data)
		})

	}).on('error', (err) => {
		console.log(`Error getting pongs: ${err}`);
		reject(err);
	})
})
const server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
	if (req.url === '/' && req.method == 'GET') {
		try {
			const timestamp = Math.floor(Date.now() / 1000) // In seconds
			const hash: string = createHash('sha256').update(String(timestamp)).digest('hex');
			let pongcount = await getPongCount();
			res.writeHead(200, { "Content-Type": "text/html" });
			res.end(`<html><body><p> Timestamp: ${timestamp}</p><p> Random String: ${hash} </p><p>Pong: ${pongcount}</p></body></html>`);
		} catch (error) {
			console.log(`Error: ${error}`)
			res.writeHead(500, { "Content-Type": "text/plain" });
			res.end("Internal Server error");
		}
	} else {
		res.writeHead(404, { 'Content-Type': 'text/plain' });
		res.end('Not found')
	}
})

server.listen(PORT, () => { console.log(`Server running at http://localhost:${PORT}`) })
