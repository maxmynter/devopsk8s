import * as http from 'http';
import { createHash } from 'crypto';
import { readFile } from 'fs';

const PORT: number = process.env.PORT ? +process.env.PORT : 3000;
const pingpongBase = process.env.PINGPONG_URL || 'http://pingpong.pingpong.svc.cluster.local';
const pingpongEndpoint = `${pingpongBase}/pingpong`;
const infoTxtPath = "/etc/config/information.txt"


const getPongReady = () => new Promise((resolve, reject) => {
	http.get(pingpongBase, (res) => {
		if (res.statusCode === 200) {
			resolve(true);
		} else {
			resolve(false);
		}
	}).on('error', (err) => {
		console.log(`Error probing Pong Readiness: ${err}`)
		reject(new Error(`Error probing readiness: ${err}`));
	})
})

const getPongCount = () => new Promise((resolve, reject) => {
	console.log("getPongCount");
	console.log("About to send request to ", pingpongEndpoint)
	http.get(pingpongEndpoint, (res) => {
		console.log("Sending request to", pingpongEndpoint);
		let data = '';
		res.on('data', (chunk) => {
			data += chunk;
		});
		res.on('end', () => {
			resolve(data)
		})

	}).on('error', (err) => {
		console.log(`Error getting pongs: ${err}`);
		reject(new Error(`Error probing readiness: ${err}`));
	})
})
async function getMessageFromTxt(filepath: string) {
	console.log("getMessageFromTxt");
	return new Promise((resolve, reject) => {
		readFile(filepath, 'utf-8', (err, data) => {
			if (err) {
				console.log(`Error reading from ${filepath}, error: ${err}`)
				reject(new Error(`Failed to read textfile ${filepath}, error: ${err}`));
			} else {
				resolve(data);
			}
		});
	});
}
const server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
	if (req.url === '/' && req.method == 'GET') {
		console.log("in root request");
		try {
			const timestamp = Math.floor(Date.now() / 1000) // In seconds
			const hash: string = createHash('sha256').update(String(timestamp)).digest('hex');
			let pongcount = await getPongCount();
			console.log('got Pong count', pongcount);
			let infoContent = await getMessageFromTxt(infoTxtPath)
			console.log("got infoContent", infoContent);
			res.writeHead(200, { "Content-Type": "text/html" });
			res.end(`<html><body><p> Timestamp: ${timestamp}</p><p> Random String: ${hash} </p><p>Pong: ${pongcount}</p><br/><span>${infoContent}</span><br/><span> Message:${process.env.MESSAGE || 'Did not get MESSAGE!'}</body></html>`);
		} catch (error) {
			console.log(`Error: ${error}`)
			res.writeHead(500, { "Content-Type": "text/plain" });
			res.end("Internal Server error");
		}
	} else if (req.url === '/ready' && req.method == 'GET') {
		if (await getPongReady()) {
			res.writeHead(200, { 'Content-Type': 'text/plain' });
			res.end('Ready')
		} else {
			res.writeHead(503, { 'Content-Type': 'text/plain' });
			res.end('Not Ready');
		}
	}
	else {
		res.writeHead(404, { 'Content-Type': 'text/plain' });
		res.end('Not found')
	}
})

server.listen(PORT, () => { console.log(`Server running at http://localhost:${PORT}`) })
