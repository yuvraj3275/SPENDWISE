// BACKEND: Express REST API + JWT authentication + serves the frontend.
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';
const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Education', 'Health', 'Fun', 'Other'];

app.use(express.json());                                   // parse JSON request bodies
app.use(express.static(path.join(__dirname, 'public')));   // serve the frontend files

// ---------- MIDDLEWARE: checks the token on protected routes ----------
function auth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, SECRET);                  // { id, name }
    next();
  } catch {
    res.status(401).json({ error: 'Please log in again' });
  }
}

const makeToken = u => jwt.sign({ id: u.id, name: u.name }, SECRET, { expiresIn: '7d' });

// ---------- AUTH ROUTES ----------
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6)
    return res.status(400).json({ error: 'Name, email and a password of 6+ characters are required' });
  if (db.prepare('SELECT id FROM users WHERE email=?').get(email))
    return res.status(409).json({ error: 'Email already registered' });
  const hash = bcrypt.hashSync(password, 10);              // never store plain passwords
  const info = db.prepare('INSERT INTO users (name,email,password_hash) VALUES (?,?,?)').run(name, email, hash);
  const user = { id: info.lastInsertRowid, name };
  res.status(201).json({ token: makeToken(user), name });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email=?').get(email || '');
  if (!user || !bcrypt.compareSync(password || '', user.password_hash))
    return res.status(401).json({ error: 'Wrong email or password' });
  res.json({ token: makeToken(user), name: user.name });
});

// ---------- EXPENSE ROUTES (CRUD) ----------
function validate(b) {
  if (!b.title || !b.title.trim()) return 'Title is required';
  if (!(Number(b.amount) > 0)) return 'Amount must be more than 0';
  if (!CATEGORIES.includes(b.category)) return 'Invalid category';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date || '')) return 'Date is required';
  return null;
}

// READ: list expenses, optional ?month=YYYY-MM
app.get('/api/expenses', auth, (req, res) => {
  const { month } = req.query;
  const rows = month
    ? db.prepare("SELECT * FROM expenses WHERE user_id=? AND substr(date,1,7)=? ORDER BY date DESC, id DESC").all(req.user.id, month)
    : db.prepare('SELECT * FROM expenses WHERE user_id=? ORDER BY date DESC, id DESC').all(req.user.id);
  res.json(rows);
});

// CREATE
app.post('/api/expenses', auth, (req, res) => {
  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });
  const { title, amount, category, date, note } = req.body;
  const info = db.prepare('INSERT INTO expenses (user_id,title,amount,category,date,note) VALUES (?,?,?,?,?,?)')
    .run(req.user.id, title.trim(), Number(amount), category, date, note || '');
  res.status(201).json(db.prepare('SELECT * FROM expenses WHERE id=?').get(info.lastInsertRowid));
});

// UPDATE (the user_id check stops one user editing another user's data)
app.put('/api/expenses/:id', auth, (req, res) => {
  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });
  const { title, amount, category, date, note } = req.body;
  const info = db.prepare('UPDATE expenses SET title=?,amount=?,category=?,date=?,note=? WHERE id=? AND user_id=?')
    .run(title.trim(), Number(amount), category, date, note || '', req.params.id, req.user.id);
  if (!info.changes) return res.status(404).json({ error: 'Expense not found' });
  res.json(db.prepare('SELECT * FROM expenses WHERE id=?').get(req.params.id));
});

// DELETE
app.delete('/api/expenses/:id', auth, (req, res) => {
  const info = db.prepare('DELETE FROM expenses WHERE id=? AND user_id=?').run(req.params.id, req.user.id);
  if (!info.changes) return res.status(404).json({ error: 'Expense not found' });
  res.json({ ok: true });
});

// ---------- SUMMARY (SQL aggregation: GROUP BY + SUM) ----------
app.get('/api/summary', auth, (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  const byCategory = db.prepare(
    "SELECT category, SUM(amount) AS total FROM expenses WHERE user_id=? AND substr(date,1,7)=? GROUP BY category ORDER BY total DESC"
  ).all(req.user.id, month);
  const daily = db.prepare(
    "SELECT date, SUM(amount) AS total FROM expenses WHERE user_id=? AND substr(date,1,7)=? GROUP BY date ORDER BY date"
  ).all(req.user.id, month);
  const total = byCategory.reduce((s, r) => s + r.total, 0);
  const { monthly_budget } = db.prepare('SELECT monthly_budget FROM users WHERE id=?').get(req.user.id);
  res.json({ month, total, budget: monthly_budget, byCategory, daily });
});

app.put('/api/budget', auth, (req, res) => {
  const b = Number(req.body.budget);
  if (!(b > 0)) return res.status(400).json({ error: 'Budget must be more than 0' });
  db.prepare('UPDATE users SET monthly_budget=? WHERE id=?').run(b, req.user.id);
  res.json({ budget: b });
});

app.get('/api/categories', (_req, res) => res.json(CATEGORIES));

if (require.main === module) app.listen(PORT, () => console.log(`SpendWise running at http://localhost:${PORT}`));
module.exports = app;
