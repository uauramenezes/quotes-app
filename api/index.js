const {Pool} = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  user: process.env.DB_USER,
  database: process.env.DB,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD
});

pool.on('error', (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
})

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
}
