# SpendWise – Expense Tracker (Full Stack)

A web app where students register, log in, record daily expenses, set a monthly budget and see charts of where their money goes.

## Tech stack
| Layer | Technology | Why |
|---|---|---|
| Frontend | HTML, CSS, JavaScript (fetch API, SVG charts) | Runs in any browser |
| Backend | Node.js + Express | REST API |
| Database | SQLite (built into Node.js) | Zero setup, single file |
| Security | bcrypt (password hashing) + JWT (login token) | Industry standard |
| Version control | Git + GitHub | Team collaboration |

## Run it
```bash
npm install
npm run seed     # optional: demo data (demo@spendwise.com / demo123)
npm start        # open http://localhost:3000
```
Needs Node.js 22.13 or newer (https://nodejs.org).

## Features
- Register / login with hashed passwords and JWT sessions
- Add, edit, delete expenses (full CRUD)
- Monthly budget meter (green, amber at 80%, red when over)
- Category donut chart and per-day bar chart
- Search, category filter, month picker, CSV download

## API
| Method | Route | Purpose |
|---|---|---|
| POST | /api/register | Create account |
| POST | /api/login | Log in, returns token |
| GET | /api/expenses?month=YYYY-MM | List expenses |
| POST | /api/expenses | Add expense |
| PUT | /api/expenses/:id | Edit expense |
| DELETE | /api/expenses/:id | Delete expense |
| GET | /api/summary?month=YYYY-MM | Totals by category and day |
| PUT | /api/budget | Set monthly budget |

## Folder structure
```
spendwise/
├── server.js      Express app: routes, auth, validation
├── db.js          SQLite connection + table creation
├── seed.js        Demo data
├── public/
│   ├── index.html Page structure
│   ├── style.css  Look and layout
│   └── app.js     Frontend logic, API calls, charts
└── package.json   Dependencies + scripts
```
