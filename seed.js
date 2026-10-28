// Adds a demo user with sample expenses so your demo never looks empty.
// Run:  npm run seed      Login: demo@spendwise.com / demo123
const bcrypt = require('bcryptjs');
const db = require('./db');
db.prepare('DELETE FROM expenses WHERE user_id IN (SELECT id FROM users WHERE email=?)').run('demo@spendwise.com');
db.prepare('DELETE FROM users WHERE email=?').run('demo@spendwise.com');
const u = db.prepare('INSERT INTO users (name,email,password_hash,monthly_budget) VALUES (?,?,?,?)')
  .run('Demo Student', 'demo@spendwise.com', bcrypt.hashSync('demo123', 10), 8000);
const month = new Date().toISOString().slice(0, 7);
const items = [
  ['Mess fees', 2500, 'Food', 1], ['Canteen lunch', 120, 'Food', 3], ['Bus pass', 600, 'Travel', 2],
  ['Metro ride', 60, 'Travel', 6], ['Data structures book', 850, 'Education', 4], ['Mobile recharge', 299, 'Bills', 5],
  ['Movie night', 400, 'Fun', 8], ['Headphones', 1299, 'Shopping', 10], ['Pharmacy', 220, 'Health', 12],
  ['Pizza with friends', 480, 'Food', 14], ['Cab to airport', 750, 'Travel', 17], ['Online course', 699, 'Education', 19]
];
const ins = db.prepare('INSERT INTO expenses (user_id,title,amount,category,date) VALUES (?,?,?,?,?)');
items.forEach(([t, a, c, d]) => ins.run(u.lastInsertRowid, t, a, c, `${month}-${String(d).padStart(2, '0')}`));
console.log('Demo data ready. Login: demo@spendwise.com / demo123');
