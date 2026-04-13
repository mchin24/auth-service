import express from 'express';
import pg from 'pg';


const { Client } = pg;
const app = express();

app.get('/', async (req, res) => {
	const client = new Client({
		host: process.env.AUTHDB_HOST,
		port: 5432,
		database: process.env.AUTHDB_DB,
		user: process.env.AUTHDB_USER,
		password: process.env.AUTHDB_PASSWORD
	});
	
	try {
		await client.connect();
		const result = await client.query('SELECT 1 as ok');
		await client.end();
		
		res.json({
			status: 'connected',
			result: result.rows[0]
		})
	} catch (err: any) {
		res.status(500).json({
			status: 'error',
			message: err.message
		})
	}
});

app.listen(3000, () => console.log('Server started on port 3000'));