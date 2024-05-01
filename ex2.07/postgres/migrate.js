const { Pool } = require('pg');

async function ensureSchemaExists() {
	const pool = new Pool({
		user: process.env.POSTGRES_USER,
		host: 'localhost',
		database: process.env.POSTGRES_DB,
		password: process.env.POSTGRES_PASSWORD,
		port: 5432,
	});
	try {
		const client = await pool.connect();
		await client.query(`CREATE TABLE coun ( id SERIAL PRIMARY KEY, timestamp TIMESTAMP)`);
	} catch (error) {
		console.log("Error ensuring schema: ", error);
	}

	await pool.end();
};

ensureSchemaExists();
