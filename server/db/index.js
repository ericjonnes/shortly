


//prevents opening/closing a DB connection for every request
const { Pool } = require("pg");


//defines the env URL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function dbHealthCheck(){
    const result = await pool.query("SELECT 1 as ok");
    return result.rows[0];
}

module.exports = { pool, dbHealthCheck};