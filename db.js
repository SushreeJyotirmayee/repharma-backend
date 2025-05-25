// db.js
const mysql = require('mysql2');

// Create connection using environment variables from Railway
// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,       // e.g. 'containers-us-west-XXX.railway.app'
//   user: process.env.DB_USER,       // your Railway DB username
//   password: process.env.DB_PASSWORD, // your Railway DB password
//   database: process.env.DB_NAME,   // the name of your Railway database
//   port: process.env.DB_PORT        // port provided by Railway, e.g., 3306 or custom
// });

const connection = mysql.createConnection({
  host: 'gondola.proxy.rlwy.net',
  user: 'root',
  password: 'gGzPaJumRGhOjrnNlKUsvEcChccWkvNl',
  database: 'railway',
  port: 25707
});

// Connect to Railway MySQL
connection.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to Railway MySQL:', err);
    return;
  }
  console.log('✅ Connected to Railway MySQL!');
});

module.exports = connection;
