const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/uploads';

let client = new pg.Client(connectionString);
client.connect();

// create the table
let query = client.query(
  "CREATE TABLE items (id serial primary key, name varchar);");
// // create the table
query = client.query(
    "CREATE FUNCTION item_upload_trigger() RETURNS trigger AS $$\
    DECLARE\
    BEGIN\
      PERFORM pg_notify('watch_item_upload', TG_TABLE_NAME || ',id,' || NEW.id || ',name,' || NEW.name  );\
      RETURN new;\
    END;\
    $$ LANGUAGE plpgsql;");
// // create the trigger
query = client.query(
    "CREATE TRIGGER watch_item_trigger AFTER INSERT ON items\
    FOR EACH ROW EXECUTE PROCEDURE item_upload_trigger();");
query.on('end', () => { client.end(); });
