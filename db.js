// DATABASE LAYER: SQLite is a single-file database, so no installation is needed.
// We use the SQLite built into Node.js (node:sqlite), so there is nothing extra to compile.
const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('spendwise.db');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  monthly_budget REAL DEFAULT 10000
);
CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  amount REAL NOT NULL CHECK (amount > 0),
  category TEXT NOT NULL,
  date TEXT NOT NULL,           -- YYYY-MM-DD
  note TEXT DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_exp_user_date ON expenses(user_id, date);
`);

module.exports = db;
