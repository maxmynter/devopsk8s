import * as http from 'http'
import { Pool } from 'pg'

const pool = new Pool({
	user: process.env.POSTGRES_USER,
	host: process.env.POSTGRES_HOST,
	database: process.env.POSTGRES_DB,
	password: process.env.POSTGRES_PASSWORD,
});

async function getNoOfTimestamps() {
	const nTimestamps = await pool.query('SELECT COUNT(timestamp) as count FROM coun');
	return nTimestamps.rows[0]['count'];
}

async function dbConnected() {
	try {
		await pool.query('SELECT 1');
		return true;
	} catch (error) {
		return false;
	}

}

const server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
	if (req.url === '/') {
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end('Alive')
	} else if (req.url === '/healthz') {
		if (await dbConnected()) {
			res.writeHead(200, { 'Content-Type': 'text/plain' });
			res.end('Ready');
		}
		else {
			res.writeHead(503, { 'Content-Type': 'text/plain' });
			res.end("Not Ready")
		}
	} else if (req.url === '/pingpong') {
		try {
			const count = await getNoOfTimestamps();
			res.writeHead(200, { 'Content-Type': 'text/plain' });
			res.end(`${count}`);
			await pool.query('INSERT INTO coun (timestamp) VALUES ($1)', [new Date()])

		} catch (error) {
			console.log('error: ', error);
			res.writeHead(500, { 'Content-Type': 'text/plain' });
			res.end('Internal Server Error');
		}
	}
})

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => { console.log(`Server running at http://localhost:${PORT}`) })
