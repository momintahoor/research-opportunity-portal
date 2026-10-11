# University Research Opportunity Portal

Faculty can create, view, update, close, and delete research opportunities. Data is stored in MySQL and managed through a REST API with a simple Bootstrap frontend.

**GitHub:** https://github.com/momintahoor/research-opportunity-portal

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MySQL
- **Frontend:** HTML, CSS, JavaScript, Bootstrap 5
- **API testing:** Postman

## Project Structure

```text
backend/     Express API (also serves frontend)
frontend/    HTML/CSS/JS pages
database/    schema.sql
postman/     Postman collection
```

## Prerequisites

- Node.js 18+ and npm
- MySQL 8+ (or MariaDB)
- Postman (optional, for API testing)

## Setup & Run

1. **Create the database**

```bash
mysql -u root -p < database/schema.sql
```

2. **Configure environment**

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your MySQL password (and other settings if needed). Do not commit this file.

3. **Install and start**

```bash
cd backend
npm install
npm start
```

Open http://localhost:3000 for the frontend and http://localhost:3000/api/opportunities for the API.

## API Endpoints

| Method | Endpoint | Success |
|--------|----------|---------|
| `POST` | `/api/opportunities` | 201 |
| `GET` | `/api/opportunities` | 200 |
| `GET` | `/api/opportunities/:id` | 200 |
| `PUT` | `/api/opportunities/:id` | 200 |
| `DELETE` | `/api/opportunities/:id` | 200 |

Also used: `400` (validation), `404` (not found), `500` (server error).

JSON fields (camelCase): `title`, `description`, `researchArea`, `facultyName`, `department`, `requiredSkills`, `availablePositions`, `applicationDeadline`, `status` (`Open` or `Closed`).

## Postman Testing

1. Start the backend.
2. Import `postman/Research_Opportunity_Portal.postman_collection.json`.
3. Set `baseUrl` to `http://localhost:3000`.
4. Run requests 1–10 in order (creates three opportunities, then get/update/close/delete, plus 404 and 400 demos).
