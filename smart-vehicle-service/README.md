# Smart Vehicle Service Platform

## Overview
This project is a vehicle service and maintenance platform for customers, service centers, and admins.

## Features
- Customer registration and authentication
- Vehicle management
- Service booking and tracking
- Service center management
- Invoice generation and payment simulation
- Maintenance reminders
- Review and rating functionality
- Real-time booking status updates

## Tech Stack
- Next.js
- React
- TypeScript
- Tailwind CSS
- NestJS
- PostgreSQL
- TypeORM
- Socket.IO

## Folder Structure
```text
smart-vehicle-service/
├── app/
│   ├── frontend/
│   └── backend/
├── database/
├── docker-compose.yml
├── .gitignore
├── README.md
└── package.json
```

## Requirements
- Node.js 20+
- npm
- Docker Desktop

## Environment variables
Copy the example env files and adjust values as needed.

## Docker PostgreSQL
```bash
docker compose up -d
```

## Backend
```bash
npm run backend:dev
```

## Frontend
```bash
npm run frontend:dev
```

Run both commands from the `smart-vehicle-service` project root. The root `.env`
file contains the local PostgreSQL and backend connection settings.

## Default local URLs
- Backend: http://localhost:4000
- Frontend: http://localhost:3000
- PostgreSQL: localhost:5432
- Database: smart_vehicle_service
