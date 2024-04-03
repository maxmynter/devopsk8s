import * as http from 'http'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const pongsFilePath = '/usr/src/app/files/pongs.txt'

const directory = dirname(pongsFilePath);
if (!existsSync(directory)) {
	mkdirSync(directory, { recursive: true })
}

let counter = 0;
if (existsSync(pongsFilePath)) {
	counter = parseInt(readFileSync(pongsFilePath, 'utf8'), 10);
}
const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
	if (req.url === '/pingpong') {
		writeFileSync(pongsFilePath, counter.toString(), 'utf8')
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end(`pong ${counter}`);
		counter++;
	}
})

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => { console.log(`Server running at http://localhost:${PORT}`) })
