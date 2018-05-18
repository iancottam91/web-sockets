const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/uploads';

const client = new pg.Client(connectionString);
client.connect();

const query = client.query(
    "INSERT INTO ITEMS(NAME) VALUES ('a');");
query.on('end', () => { client.end(); });
