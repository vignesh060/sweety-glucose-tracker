# Sweety Glucose Tracker

A full-stack web application for tracking and managing daily blood glucose readings. Users can securely log in, record glucose measurements, manage their readings, and view reports.

## Technologies Used

**Frontend**
- React.js
- JavaScript
- Axios
- CSS

**Backend**
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt

## Features

- User registration and login
- Secure password hashing
- JWT-based authentication
- Add glucose readings
- View glucose readings
- Edit and delete readings
- Daily glucose reports
- Month-to-date reports
- Monthly reports
- Demo account with sample data

## Project Structure

```text
sweety-glucose-tracker/
├── client/                 # React frontend
├── server/                 # Node.js backend
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd sweety-glucose-tracker
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file using `.env.example` and configure your PostgreSQL database credentials and JWT secret.

### 3. Database Setup

Create a PostgreSQL database and configure the connection details in your `.env` file.

Run the seed script to create the demo account and sample readings:

```bash
node scripts/seed.js
```

### 4. Start Backend

```bash
npm start
```

Backend runs at:

`http://localhost:5000`

### 5. Frontend Setup

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the frontend URL displayed in your terminal.

## Demo Login

- Email: `demo@sweety.com`
- Password: `Demo@123`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | User login |
| GET | `/api/readings` | Get readings |
| POST | `/api/readings` | Add reading |
| PUT | `/api/readings/:id` | Update reading |
| DELETE | `/api/readings/:id` | Delete reading |
| GET | `/api/reports/daily` | Daily report |
| GET | `/api/reports/month-to-date` | Month-to-date report |
| GET | `/api/reports/monthly` | Monthly report |

Protected endpoints require JWT Bearer Token authentication.

## Security

- Passwords are hashed using bcrypt.
- Protected APIs use JWT authentication.
- Environment variables store sensitive configuration.
- Actual `.env` files must not be committed to GitHub.

## Author

Developed as a full-stack application using React, Node.js, Express, and PostgreSQL.


