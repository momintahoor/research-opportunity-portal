# University Research Opportunity Portal

A full-stack web application that lets faculty members create, view, update, close, and delete research opportunities in one place. Opportunities are stored in MySQL and exposed through a REST API. A simple Bootstrap frontend uses that API for all data operations.

## GitHub Repository

https://github.com/momintahoor/research-opportunity-portal

If the repository URL changes, update this section before submission.

## Technologies Used

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express.js |
| Database | MySQL |
| Frontend | HTML, CSS, JavaScript, Bootstrap 5 |
| API testing | Postman |
| Configuration | dotenv |

## Project Structure

```text
research-opportunity-portal/
├── backend/
│   ├── config/db.js                 # MySQL connection pool
│   ├── controllers/opportunityController.js
│   ├── middleware/validateOpportunity.js
│   ├── routes/opportunities.js
│   ├── server.js                    # Express app (also serves frontend)
│   ├── package.json
│   └── .env.example                 # Safe env template (copy to .env)
├── frontend/
│   ├── index.html                   # List opportunities
│   ├── create.html                  # Create form
│   ├── details.html                 # Opportunity details
│   ├── edit.html                    # Update / close
│   ├── css/styles.css
│   └── js/                          # API helpers and page scripts
├── database/
│   └── schema.sql                   # Database and table setup
├── postman/
│   └── Research_Opportunity_Portal.postman_collection.json
├── .env.example
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 18+ and npm
- MySQL Server 8+ (or MariaDB)
- Postman (for API collection testing)
- A modern web browser

## Database Setup

1. Start MySQL and log in as a user that can create databases (often `root`).

2. Run the schema file:

```bash
mysql -u root -p < database/schema.sql
```

Or from the MySQL client:

```sql
SOURCE /absolute/path/to/database/schema.sql;
```

3. Confirm the table exists:

```sql
USE research_portal;
SHOW TABLES;
DESCRIBE opportunities;
```

### Schema overview (`opportunities`)

| Column | Type | Notes |
|--------|------|-------|
| `id` | INT, PK, AUTO_INCREMENT | Unique ID |
| `title` | VARCHAR(255) | Research title |
| `description` | TEXT | Full description |
| `research_area` | VARCHAR(150) | Research area |
| `faculty_name` | VARCHAR(150) | Faculty member |
| `department` | VARCHAR(150) | Department |
| `required_skills` | VARCHAR(500) | Required skills |
| `available_positions` | INT | Must be > 0 |
| `application_deadline` | DATE | Deadline (`YYYY-MM-DD`) |
| `status` | ENUM('Open','Closed') | Default `Open` |
| `created_at` / `updated_at` | TIMESTAMP | Managed by MySQL |

## Environment Configuration

Never commit real passwords or secrets.

1. Copy the example file:

```bash
cp backend/.env.example backend/.env
```

2. Edit `backend/.env` with your local MySQL credentials:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=research_portal
```

`backend/.env` is ignored by Git (see `.gitignore`).

## Backend Setup

```bash
cd backend
npm install
```

## Frontend Setup

No separate frontend install is required. Static HTML/CSS/JS files in `frontend/` are served by the Express backend.

## How to Run the Application

From the `backend` folder:

```bash
cd backend
npm start
```

Then open:

- Frontend: http://localhost:3000/
- API health: http://localhost:3000/api/health
- Opportunities API: http://localhost:3000/api/opportunities

Leave the terminal running while you use the app or Postman.

## API Endpoints

Base URL: `http://localhost:3000/api/opportunities`

| Method | Endpoint | Description | Success | Common errors |
|--------|----------|-------------|---------|---------------|
| `POST` | `/api/opportunities` | Create opportunity | `201 Created` | `400`, `500` |
| `GET` | `/api/opportunities` | List all opportunities | `200 OK` | `500` |
| `GET` | `/api/opportunities/:id` | Get one by ID | `200 OK` | `400`, `404`, `500` |
| `PUT` | `/api/opportunities/:id` | Update (including status) | `200 OK` | `400`, `404`, `500` |
| `DELETE` | `/api/opportunities/:id` | Delete opportunity | `200 OK` | `400`, `404`, `500` |

### Example create body (JSON)

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

Field names in the API use camelCase. Values are stored in MySQL using snake_case column names.

Required fields for create/update: `title`, `description`, `researchArea`, `facultyName`, `department`, `requiredSkills`, `availablePositions`, `applicationDeadline`.  
Update also requires `status` (`Open` or `Closed`).

## Frontend Features

- Display all research opportunities
- View full details of one opportunity
- Create a new opportunity
- Update an existing opportunity
- Close an opportunity (Open → Closed)
- Delete an opportunity
- Success and error messages
- Basic client-side validation of required fields

All list/create/update/delete actions call the REST API. Opportunity data is not hard-coded in the frontend.

## Postman Testing

1. Start the backend (`npm start` in `backend/`).
2. Open Postman → **Import** → select:

   `postman/Research_Opportunity_Portal.postman_collection.json`

3. Confirm collection variables:
   - `baseUrl` = `http://localhost:3000`
   - `opportunityId` (set automatically by request 1)
4. Run requests **1 through 10 in order**.

The collection covers:

1. Create at least three research opportunities  
2. Retrieve all opportunities  
3. Retrieve one opportunity by ID  
4. Update an opportunity  
5. Change status from Open to Closed  
6. Delete an opportunity  
7. Request the deleted opportunity again → **404**  
8. Send invalid/missing data → **400**

## One-Minute Demo Checklist

Use this when recording the demonstration video:

- [ ] Backend server running in the terminal  
- [ ] Frontend open in the browser  
- [ ] Create an opportunity from the UI  
- [ ] Show the opportunity in the list  
- [ ] Update an opportunity  
- [ ] Close an opportunity  
- [ ] Delete an opportunity  
- [ ] Show a validation error or 404 (UI or Postman)  
- [ ] Show API requests/responses in Postman  

## Troubleshooting

| Problem | What to try |
|---------|-------------|
| `Failed to connect to MySQL` | Check MySQL is running; verify `backend/.env`; confirm database `research_portal` exists |
| `ECONNREFUSED` on port 3306 | Start MySQL service; confirm `DB_HOST` / `DB_PORT` |
| Frontend loads but API fails | Confirm you opened http://localhost:3000 (same origin as the API), not a raw file:// page |
| `Validation failed` (400) | Ensure all required JSON fields are present and `availablePositions` is a positive integer |
| Opportunity not found (404) | Use a valid ID from `GET /api/opportunities` |
| Port 3000 already in use | Change `PORT` in `backend/.env` |

## Security Notes

- Do not commit `backend/.env`, passwords, API keys, or tokens.
- Use `.env.example` files as templates only.
- `.gitignore` already excludes `.env` and `node_modules/`.

## ZIP Submission Contents

When packaging the assignment ZIP, include:

- Backend source (`backend/`, without `node_modules` if preferred — document `npm install`)
- Frontend source (`frontend/`)
- Database schema (`database/schema.sql`)
- Postman collection (`postman/`)
- `README.md` (this file, with GitHub link)
- Demonstration video or video link (recorded separately)

Suggested ZIP name format from the assignment: `P24_0000_NAME_CLASS.zip` (replace with your registration details).
