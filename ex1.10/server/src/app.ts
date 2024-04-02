import * as http from 'http';

function generateRandomString(length: number): string {
	const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let randomString = '';
	for (let i = 0; i < length; i++) {
		const randomPosition = Math.floor(Math.random() * charset.length);
		randomString += charset.substring(randomPosition, randomPosition + 1);
	}
	return randomString;
}

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
	if (req.url === '/') {
		const currentTimestamp = new Date().toISOString();
		const randomString = generateRandomString(36);
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(`<html><body><p> Timestamp: ${currentTimestamp}</p><p> Random String: ${randomString} </p></body></html>`);
	} else { res.writeHead(404); res.end(); }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => { console.log(`Server running at http://localhost:${PORT}`) })
