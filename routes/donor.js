const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db');

const router = express.Router();

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Upload endpoint
router.post('/upload', upload.single('medicineImage'), (req, res) => {
  const { category, price } = req.body;
  const image = req.file.filename;

  const query = 'INSERT INTO medicines (category, price, image) VALUES (?, ?, ?)';
  db.query(query, [category, price || 'Free', image], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(200).json({ message: 'Medicine uploaded successfully!' });
  });
});

// Fetch all medicines
router.get('/available', (req, res) => {
  db.query('SELECT * FROM medicines', (err, result) => {
    if (err) {
      console.error('Error fetching medicines:', err);
      return res.status(500).json({ error: 'Error fetching medicines' });
    }
    res.json(result);
  });
});


module.exports = router;
