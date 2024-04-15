import * as http from 'http'

let counter = 0;
const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
	if (req.url === '/pingpong') {
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end(`${counter}`);
		counter++;
	}
})

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => { console.log(`Server running at http://localhost:${PORT}`) })
