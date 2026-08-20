# BuildNOVA Construction Ltd. — Full Stack

Standard-size academic/project starter for a Smart Building Design & Construction Management System.

## Stack
Frontend: React + Vite
Backend: Node.js + Express
Database: MySQL (XAMPP)
Authentication: JWT + bcrypt

## Folder Structure
Client/  -> React frontend
Server/  -> Express backend
Server/database.sql -> MySQL schema

## Run Backend
cd Server
npm install
copy .env.example .env
npm run dev

## Run Frontend
cd Client
npm install
npm run dev

Frontend: http://localhost:5173
Backend: http://localhost:5000

## Database
Start MySQL in XAMPP, open phpMyAdmin and import Server/database.sql.
Then configure Server/.env.

## Main Roles
Customer:
- Register/Login
- Submit building requirements
- Track projects
- View assigned engineer
- Track construction progress

Civil Engineer:
- View assigned projects
- Prepare cost estimate
- Update construction progress
- Update project status

Admin:
- Dashboard
- Manage users
- Manage projects
- Assign civil engineer

This is a clean starter architecture. Payment gateway, chat/WebSocket, file uploads, AI estimation and advanced admin CRUD can be added as next modules.
