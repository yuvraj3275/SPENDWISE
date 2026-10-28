
## 1. The 30-second pitch
"SpendWise is a full stack expense tracker for students. The **frontend** is what you see in the browser. The **backend** is a Node/Express server that checks your login and handles requests. The **database** is SQLite, where all data is stored. They talk through a **REST API** using JSON."

## 2. How it works (draw this on the board)
```
Browser (HTML/CSS/JS)  --fetch(JSON)-->  Express server  --SQL-->  SQLite DB
        ^                                      |                       |
        +---------------- JSON response -------+<------ rows ---------+
```
Example: you click "Add expense"
1. app.js reads the form and calls `fetch('/api/expenses', POST)` with the JWT token.
2. server.js `auth` middleware verifies the token, then validates the data.
3. It runs `INSERT INTO expenses ...` in SQLite.
4. The server replies with JSON; app.js redraws the table and charts.

## 3. Key concepts in simple words
- **Frontend**: what the user sees and clicks (public/ folder).
- **Backend**: the server code that holds the rules (server.js).
- **Database**: permanent storage in tables (db.js). Two tables: `users` and `expenses`, linked by `user_id` (foreign key).
- **REST API**: URLs + HTTP methods. GET = read, POST = create, PUT = update, DELETE = remove.
- **JSON**: text format for sending data between frontend and backend.
- **Middleware**: a function that runs before the route (our `auth` checks the token).
- **bcrypt**: turns a password into an irreversible hash, so even the database owner cannot read it.
- **JWT**: a signed token given at login. The browser sends it with each request to prove who you are.
- **CRUD**: Create, Read, Update, Delete.
- **Prepared statements (`?`)**: stop SQL injection.
- **esc() function**: stops XSS by escaping HTML in user text.
- **GROUP BY + SUM**: how the charts get category and daily totals.

## 4. Likely viva questions
1. **Why SQLite?** No installation, one file, perfect for a demo; can be switched to MySQL/Postgres later.
2. **How is the password stored?** Hashed with bcrypt (10 salt rounds), never plain text.
3. **How does login persist?** JWT stored in localStorage, sent in the `Authorization` header.
4. **How do you stop user A seeing user B's data?** Every query has `WHERE user_id = ?` using the id from the token.
5. **What is SQL injection and how did you avoid it?** Attackers put SQL in inputs; we use `?` placeholders so input is treated as data only.
6. **Difference between PUT and POST?** POST creates a new record, PUT updates an existing one.
7. **What are the HTTP status codes used?** 200 OK, 201 Created, 400 bad input, 401 not logged in, 404 not found, 409 duplicate email.
8. **Why Express?** Minimal framework that makes routing and JSON handling easy.
9. **What would you improve?** Recurring expenses, receipt upload, PDF reports, deploy online, move to MongoDB/MySQL, add tests.
10. **Is the frontend a framework?** No, plain JavaScript, so we can explain every line. React is a possible upgrade.

## 5. Demo script (about 4 minutes)
1. Show the login page, register a new account (mention password hashing).
2. Log out, then log in as demo@spendwise.com / demo123 (full data loaded).
3. Show budget meter, donut chart, daily bars.
4. Add an expense, watch the charts update.
5. Edit it, then delete it.
6. Search and filter by category, change the month, download CSV.
7. Open the GitHub page and show commits from all 4 members.

## 6. Team split (4 people, each explains one part)
| Member | Explains | Files |
|---|---|---|
| 1 | Database + seed data | db.js, seed.js |
| 2 | Backend API + auth | server.js |
| 3 | Frontend UI + charts | index.html, style.css, app.js (charts) |
| 4 | Frontend logic, Git, poster | app.js (fetch, CRUD), GitHub |

## 7. Git steps (do together tonight, so every member has commits)
```bash
# Member 1 (once)
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin https://github.com/<user>/spendwise.git
git push -u origin main

# Every other member
git clone https://github.com/<user>/spendwise.git
cd spendwise && npm install
git checkout -b feature/<your-name>
# make a small change (e.g., improve README, fix a label, add a comment)
git add .
git commit -m "Describe what you changed"
git push origin feature/<your-name>
# open a Pull Request on GitHub, the leader merges it
```
Small real changes per member: add a category, change colours, improve the README, add comments.

## 8. A3 poster content (confirm the EL format with your faculty)
- **Title**: SpendWise – A Full Stack Expense Tracker; team names + USNs
- **Problem**: students lose track of spending; spreadsheets are tedious
- **Objectives**: track expenses, budget alerts, visual insights
- **Architecture**: the diagram from section 2
- **Tech stack**: HTML/CSS/JS, Node, Express, SQLite, JWT, bcrypt, Git
- **Features + 3 screenshots**: login, dashboard, add/edit
- **Database design**: users and expenses tables
- **Git workflow**: branches, pull requests, commit graph screenshot
- **Results/Learning, Future scope**
- **QR code** to the GitHub repo
