import * as http from 'http';
import { createHash } from 'crypto';
import { promises as fs } from 'fs';

const PORT: number = process.env.PORT ? +process.env.PORT : 3000;

const server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
	if (req.url === '/' && req.method == 'GET') {
		try {
			const timestamp: string = await fs.readFile('/usr/src/app/files/timestamp.txt', 'utf-8');
			const hash: string = createHash('sha256').update(timestamp).digest('hex');
			res.writeHead(200, { "Content-Tye": "text/plain" });
			res.end(`${timestamp}, ${hash}`);
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
