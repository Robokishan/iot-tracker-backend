var Pool = require('pg-pool')

var PGHOST = process.env.PG_HOST;
var PGUSER = process.env.PG_USER;
var PGDATABASE = process.env.PG_DATABASE;
var PGPASSWORD= process.env.PG_PASSWORD;
var config = {
  host: PGHOST,
  user: PGUSER, // name of the user account
  password:PGPASSWORD,
  database: PGDATABASE, // name of the database
  max: 2, // max number of clients in the pool
  idleTimeoutMillis: 30000 
}
const pool = new Pool(config)
module.exports = pool;