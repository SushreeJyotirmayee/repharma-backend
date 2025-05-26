console.log('Starting server...');

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session); // ✅ NEW: MySQL session store
const path = require('path');

const app = express();

// ✅ Import donor routes
const donorRoutes = require('./routes/donor');

// ✅ Import DB from db.js (Railway connection)
const db = require('./db');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS setup - allow your Railway frontend URL here
app.use(cors({
  origin: 'https://repharma-frontend-production.up.railway.app',
  credentials: true
}));

// Prevent caching sensitive data
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// ✅ Setup MySQL session store
const sessionStore = new MySQLStore({}, db); // ✅ Use your MySQL DB for sessions

// ✅ Session setup using MySQLStore
app.use(session({
  key: 'repharma_session',
  secret: 'repharma-secret-key',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 15 * 60 * 1000 // 15 minutes
  }
}));

// ✅ Auth middleware
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    res.redirect('/index.html?redirected=true');
  }
}

// ✅ Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/check-session', (req, res) => {
  res.json({ loggedIn: !!req.session.userId });
});

// ✅ Login Route
app.post('/login', (req, res) => {
  const { email, phone, password } = req.body;
  const query = `SELECT * FROM users WHERE email = ? AND phone = ? AND password = ?`;
  db.query(query, [email, phone, password], (err, result) => {
    if (err) {
      console.error('Login DB error:', err);
      return res.status(500).send('Database error during login');
    }

    if (result.length > 0) {
      req.session.userId = result[0].id;
      res.send('Login successful!');
    } else {
      res.status(401).send('Invalid email, phone, or password.');
    }
  });
});

// ✅ Register Route
app.post('/register', (req, res) => {
  const { name, email, phone, password, role } = req.body;
  const query = `INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)`;
  db.query(query, [name, email, phone, password, role], (err) => {
    if (err) {
      console.error('Registration DB error:', err);
      return res.status(500).send('Database error during registration');
    }
    res.send('Registration successful!');
  });
});

// ✅ Protected Pages Middleware
const protectedPages = ['donor', 'receiver', 'career', 'availablemedicines', 'categories'];
protectedPages.forEach(page => {
  app.get(`/${page}.html`, ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', `${page}.html`));
  });
});

// ✅ Donor API Routes
app.use('/api/donor', donorRoutes);

// ✅ Serve Uploaded Images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Start the Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
