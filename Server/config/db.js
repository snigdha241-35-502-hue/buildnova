const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "buildnova",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection()
  .then((connection) => {
    console.log("MySQL Connected Successfully!");
    connection.release();
  })
  .catch((error) => {
    console.error("MySQL Connection Error:", error.message);
  });

module.exports = db;