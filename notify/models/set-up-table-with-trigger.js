const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/uploads';

let client = new pg.Client(connectionString);
client.connect();

// create the table
let query = client.query(
  "CREATE TABLE food (id serial primary key, name varchar);");
// // create the table
query = client.query(
    "CREATE FUNCTION notify_trigger2() RETURNS trigger AS $$\
    DECLARE\
    BEGIN\
      PERFORM pg_notify('watchers', TG_TABLE_NAME || ',id,' || NEW.id );\
      RETURN new;\
    END;\
    $$ LANGUAGE plpgsql;");
// // create the trigger
query = client.query(
    "CREATE TRIGGER watched_table_trigger AFTER INSERT ON food\
    FOR EACH ROW EXECUTE PROCEDURE notify_trigger2();");
query.on('end', () => { client.end(); });
