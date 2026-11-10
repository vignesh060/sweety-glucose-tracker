# Sweety Glucose Tracker

A full-stack web application that helps users track, manage, and monitor their daily blood glucose readings through a simple and user-friendly dashboard.

## Technologies Used

**Frontend**
- React.js
- JavaScript
- Axios
- CSS
- Vite

**Backend**
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt

## Features

- User registration and login
- Secure password hashing using bcrypt
- JWT-based authentication
- User-specific glucose readings
- Add, view, edit, and delete glucose readings
- Four daily reading slots:
  - Morning
  - After breakfast
  - After lunch
  - After dinner
- Input validation for glucose readings
- Daily glucose reports
- Month-to-date reports
- Monthly reports
- Demo account with sample readings

## Project Structure

```text
sweety-glucose-tracker/
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── scripts/
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/vignesh060/sweety-glucose-tracker.git
cd sweety-glucose-tracker
```

### 2. Database Setup

- Install PostgreSQL.
- Create a database named `sweety_db`.
- Configure your database credentials in the backend environment file.

### 3. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file using `.env.example`.

Configure the following environment variables:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sweety_db
DB_USER=your_db_username
DB_PASSWORD=your_db_password
JWT_SECRET=your_own_secret
```

Use your own database credentials and a secure JWT secret.

### 4. Initialize Demo Data

Run the seed script:

```bash
node scripts/seed.js
```

This creates the demo account and inserts sample glucose readings if they do not already exist.

### 5. Start the Backend

```bash
npm start
```

Backend URL:

`http://localhost:5000`

### 6. Frontend Setup

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the local frontend URL displayed in your terminal.

## Demo Account

**Email:** demo@sweety.com

**Password:** Demo@123

The demo account is created by the backend seed script.

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
- JWT authentication protects private API endpoints.
- Users can access only their own glucose readings.
- Environment variables are used for sensitive configuration.
- Actual `.env` files are excluded from Git.

## Author

**Vignesh Jagadeesan**

GitHub: https://github.com/vignesh060

Project Repository: https://github.com/vignesh060/sweety-glucose-tracker