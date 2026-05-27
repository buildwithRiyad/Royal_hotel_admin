const { Client } = require('pg');

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'hotel_db',
};

(async () => {
  const client = new Client(config);
  try {
    await client.connect();
    console.log(`Connected to database: ${config.database} at ${config.host}:${config.port}`);

    const tablesRes = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY table_name");
    if (!tablesRes.rows.length) {
      console.log('No tables found in public schema.');
      return;
    }

    for (const r of tablesRes.rows) {
      const table = r.table_name;
      try {
        const countRes = await client.query(`SELECT count(*)::int AS cnt FROM "${table}"`);
        const cnt = countRes.rows[0].cnt;
        console.log(`\nTable: ${table} — rows: ${cnt}`);
        const sampleRes = await client.query(`SELECT * FROM "${table}" LIMIT 3`);
        if (sampleRes.rows.length) console.table(sampleRes.rows);
        else console.log('  (no sample rows)');
      } catch (e) {
        console.warn(`  Could not query table ${table}: ${e.message}`);
      }
    }
  } catch (err) {
    console.error('Error connecting or querying database:', err.message || err);
  } finally {
    await client.end();
  }
})();
