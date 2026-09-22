const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite Database with proper error handling & connection check
const db = new sqlite3.Database('./travel.db', (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create Bookings Table
    db.run(`CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_city TEXT,
      to_city TEXT,
      departing_date TEXT,
      returning_date TEXT,
      cabin_class TEXT,
      adults TEXT,
      children TEXT,
      infants TEXT,
      name TEXT,
      email TEXT,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (createErr) => {
      if (createErr) console.error('Error creating bookings table:', createErr.message);
    });

    // Create Users Table for Login/Signup
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT
    )`, (createErr) => {
      if (!createErr) {
        // Insert default admin if not exists
        db.get(`SELECT * FROM users WHERE username = ?`, ['admin'], (err, row) => {
          if (!row) {
            db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`, ['admin', 'admin123', 'admin'], (insErr) => {
              if (!insErr) console.log('Default admin account created.');
            });
          }
        });
      }
    });
  }
});

// Signup Endpoint
app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const role = 'user';
  const query = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
  
  db.run(query, [username, password, role], function(err) {
    if (err) {
      return res.status(400).json({ error: 'Username already exists!' });
    }
    res.status(201).json({ message: 'Signup successful!', userId: this.lastID });
  });
});

// Login Endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Please provide username and password' });
  }

  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
  db.get(query, [username, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error occurred' });
    }
    if (!row) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    res.json({ message: 'Login successful', role: row.role, username: row.username });
  });
});

// Book Flight Endpoint (with Database storage only)
app.post('/api/book', (req, res) => {
  const { from_city, to_city, departing_date, returning_date, cabin_class, adults, children, infants, name, email, phone } = req.body;
  
  if (!from_city || !to_city || !departing_date || !name || !email) {
    return res.status(400).json({ error: 'Required booking fields are missing' });
  }

  const query = `INSERT INTO bookings (from_city, to_city, departing_date, returning_date, cabin_class, adults, children, infants, name, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(query, [from_city, to_city, departing_date, returning_date, cabin_class, adults || '0', children || '0', infants || '0', name, email, phone], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const bookingId = this.lastID;
    res.status(201).json({ message: 'Flight booked successfully', bookingId: bookingId });
  });
});

// Get All Bookings (Admin Only Route)
app.get('/api/bookings', (req, res) => {
  db.all(`SELECT * FROM bookings ORDER BY id DESC`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Admin Password Change Endpoint (Fixed)
app.post('/api/admin/change-password', (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both current and new passwords are required' });
  }

  db.get(`SELECT * FROM users WHERE username = ?`, ['admin'], (err, row) => {
    if (err || !row) {
      return res.status(500).json({ error: 'Admin user not found' });
    }

    if (row.password === currentPassword) {
      db.run(`UPDATE users SET password = ? WHERE username = ?`, [newPassword, 'admin'], (updateErr) => {
        if (updateErr) {
          return res.status(500).json({ error: updateErr.message });
        }
        res.json({ message: 'Password updated successfully!' });
      });
    } else {
      res.status(400).json({ error: 'Incorrect current password' });
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running smoothly on http://localhost:${PORT}`);
});