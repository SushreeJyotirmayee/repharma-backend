const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '03112001',
  database: 'repharma'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL in db.js:', err);
  } else {
    console.log('Connected to MySQL from db.js');
  }
});

module.exports = db;
