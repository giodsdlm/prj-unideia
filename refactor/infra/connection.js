const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  port: "56772",
  user: "root",
  password: "unidei4pw",
  database: "unideia-db",
});

module.exports = connection;
