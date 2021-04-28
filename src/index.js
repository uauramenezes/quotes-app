const {Pool} = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: 'localhost',
  database: process.env.DB,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 5432
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
