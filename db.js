// db.js
const mysql = require('mysql2');

// ✅ Create connection using Railway's default environment variable names
// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT
// });

const connection = mysql.createConnection({
  host: 'gondola.proxy.rlwy.net',
  user: 'root',
  password: 'gGzPaJumRGhOjrnNlKUsvEcChccWkvNl',
  database: 'railway',
  port: 25707
});

// ✅ Connect to Railway MySQL
connection.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to Railway MySQL:', err);
    return;
  }
  console.log('✅ Connected to Railway MySQL!');
});

module.exports = connection;
