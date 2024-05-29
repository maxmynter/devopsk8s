const { Pool } = require('pg');

async function ensureSchema() {
	const pool = new Pool({
		user: process.env.POSTGRES_USER,
		host: 'localhost',
		database: process.env.POSTGRES_DB,
		password: process.env.POSTGRES_PASSWORD,
		port: 5432,

	});

	try {
		const client = await pool.connect();
		await client.query('CREATE TABLE todos ( id SERIAL PRIMARY KEY, timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, text TEXT NOT NULL, completed BOOLEAN NOT NULL DEFAULT FALSE )')
	} catch (error) {
		console.log(error);
	}
	await pool.end();
}
ensureSchema()
