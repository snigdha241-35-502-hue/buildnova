# BuildNOVA Construction Ltd. - Backend

## Stack
Node.js + Express + MySQL + JWT

## Setup
1. Start Apache and MySQL from XAMPP.
2. Open phpMyAdmin and import `database.sql`.
3. Copy `.env.example` to `.env` and update DB settings.
4. Run:
   npm install
   npm run dev

Server:
http://localhost:5000

## API
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile

POST /api/projects
GET  /api/projects/my-projects
GET  /api/projects/:id
PUT  /api/projects/:id/status

GET  /api/engineers
GET  /api/engineers/project-requests
PUT  /api/engineers/assign/:id
GET  /api/engineers/my-projects

POST /api/estimates
GET  /api/estimates/project/:projectId

POST /api/progress
GET  /api/progress/project/:projectId

GET /api/admin/dashboard
GET /api/admin/users
GET /api/admin/projects
