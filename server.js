const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./storage.db', (err) => {
  if (err) console.error("DB Error:", err.message);
  else console.log("Connected to storage.db");
});

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT,
  emailId TEXT,
  date TEXT,
  time TEXT
)`);

// Endpoint to receive user registration
app.post('/api/register', (req, res) => {
  const { userId, emailId } = req.body;
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0];

  const sql = `INSERT INTO users (userId, emailId, date, time) VALUES (?, ?, ?, ?)`;
  db.run(sql, [userId, emailId, date, time], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID });
  });
});

// Endpoint for admins to retrieve data
app.get('/api/users', (req, res) => {
  db.all(`SELECT * FROM users`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));