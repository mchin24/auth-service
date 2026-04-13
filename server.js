const express = require('express');
const pg = require('pg');
const { Client } = pg;
const app = express();

app.get('/', async (req, res) => {
	const client = new Client({
		host: 'common-db',
		port: 5432,
		database: 'auth',
		user: 'authadmin',
		password: '80E9tktSlq4RfO'
	});
	
	try {
		await client.connect();
		const result = await client.query('SELECT 1 as ok');
		await client.end();
		
		res.json({
			status: 'connected',
			result: result.rows[0]
		})
	} catch (err) {
		res.status(500).json({
			status: 'error',
			message: err.message
		})
	}
});

app.listen(3000, () => console.log('Server started on port 3000'));