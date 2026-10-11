# University Research Opportunity Portal

A full-stack web application for managing university research opportunities. Faculty can create, view, update, close, and delete openings. Data is stored in MySQL and accessed through a REST API. A simple Bootstrap frontend talks to that API (no hard-coded opportunity data).

**GitHub Repository:** https://github.com/momintahoor/research-opportunity-portal

## Technologies Used

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express.js |
| Database | MySQL |
| Frontend | HTML, CSS, JavaScript, Bootstrap 5 |
| API testing | Postman |

## Project Structure

```text
research-opportunity-portal/
├── backend/          # Express REST API (also serves frontend)
├── frontend/         # HTML/CSS/JS pages
├── database/         # schema.sql
├── postman/          # Postman collection
├── .env.example
├── .gitignore
└── README.md
```

## Prerequisites

Install these before starting:

1. **Node.js 18+** and **npm** — https://nodejs.org/
2. **MySQL Server 8+** (or MariaDB) — running and accessible
3. **Postman** — for API testing (optional for running the UI)
4. A modern web browser

---

## Step-by-Step Guide: Run the System

### Step 1 — Open the project

```bash
cd research-opportunity-portal
```

(Use your actual folder path if different.)

### Step 2 — Create the MySQL database

Make sure MySQL is running, then create the database and table:

```bash
mysql -u root -p < database/schema.sql
```

Enter your MySQL root password when prompted.

To verify:

```bash
mysql -u root -p -e "USE research_portal; SHOW TABLES; DESCRIBE opportunities;"
```

You should see the `opportunities` table.

### Step 3 — Configure environment variables

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and set your MySQL password (and other values if needed):

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=research_portal
```

Replace `your_mysql_password` with your real MySQL password.  
Do **not** commit `backend/.env` (it is already in `.gitignore`).

### Step 4 — Install backend dependencies

```bash
cd backend
npm install
```

### Step 5 — Start the server

Still inside the `backend` folder:

```bash
npm start
```

You should see messages like:

```text
Connected to MySQL database
Server running on http://localhost:3000
Frontend available at http://localhost:3000
```

Keep this terminal open while using the app.

### Step 6 — Open the frontend

In your browser, go to:

**http://localhost:3000/**

You can:

- View all opportunities
- Open details
- Create a new opportunity
- Edit / close / delete opportunities

### Step 7 — (Optional) Test the API with Postman

1. Keep the server running (`npm start`).
2. Open Postman → **Import**.
3. Select: `postman/Research_Opportunity_Portal.postman_collection.json`
4. Confirm collection variable `baseUrl` = `http://localhost:3000`
5. Run requests **1 through 10 in order**.

This covers create (×3), get all, get one, update, close, delete, 404 after delete, and 400 validation.

---

## API Endpoints

Base URL: `http://localhost:3000/api/opportunities`

| Method | Endpoint | Description | Success codes |
|--------|----------|-------------|---------------|
| `POST` | `/api/opportunities` | Create opportunity | `201` |
| `GET` | `/api/opportunities` | List all | `200` |
| `GET` | `/api/opportunities/:id` | Get one | `200` |
| `PUT` | `/api/opportunities/:id` | Update (incl. status) | `200` |
| `DELETE` | `/api/opportunities/:id` | Delete | `200` |

Error codes: `400` Bad Request, `404` Not Found, `500` Internal Server Error.

### Example JSON body (create / update)

```json
{
  "title": "Deep Learning for Medical Imaging",
  "description": "Develop CNN models for medical image analysis.",
  "researchArea": "Artificial Intelligence",
  "facultyName": "Dr. Ayesha Khan",
  "department": "Computer Science",
  "requiredSkills": "Python, PyTorch, Machine Learning",
  "availablePositions": 2,
  "applicationDeadline": "2026-12-15",
  "status": "Open"
}
```

`status` must be `Open` or `Closed`. Update requires all fields above, including `status`.

## Database Schema (`opportunities`)

| Column | Type | Notes |
|--------|------|-------|
| `id` | INT, PK, AUTO_INCREMENT | Unique ID |
| `title` | VARCHAR(255) | Research title |
| `description` | TEXT | Description |
| `research_area` | VARCHAR(150) | Area |
| `faculty_name` | VARCHAR(150) | Faculty |
| `department` | VARCHAR(150) | Department |
| `required_skills` | VARCHAR(500) | Skills |
| `available_positions` | INT | Must be > 0 |
| `application_deadline` | DATE | `YYYY-MM-DD` |
| `status` | ENUM('Open','Closed') | Default `Open` |

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Failed to connect to MySQL` | Start MySQL; check `backend/.env`; confirm DB `research_portal` exists |
| Frontend opens but data fails | Use http://localhost:3000 (not opening HTML as a local file) |
| `Validation failed` (400) | Send all required fields; `availablePositions` must be a positive integer |
| Port 3000 in use | Change `PORT` in `backend/.env` |

## Security

- Never upload passwords, API keys, or `backend/.env` to GitHub.
- Use `backend/.env.example` as a template only.
