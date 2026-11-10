# Sweety Glucose Tracker – Frontend

The frontend application for Sweety Glucose Tracker, built using React.js and Vite. It provides a user-friendly interface for managing daily blood glucose readings and viewing reports.

## Technologies Used

- React.js
- JavaScript
- Axios
- React Router DOM
- CSS
- Vite
- Lucide React

## Features

- User registration
- User login
- Dashboard overview
- View glucose readings
- Add new glucose readings
- Edit existing readings
- Delete readings
- Daily glucose reports
- Month-to-date reports
- Monthly reports
- API integration using Axios
- JWT token-based authentication

## Installation

### 1. Navigate to the frontend folder

```bash
cd client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal.

## Production Build

To create a production build:

```bash
npm run build
```

## Backend Integration

The frontend communicates with the Node.js and Express backend through REST APIs.

Backend API base URL:

`http://localhost:5000/api`

Axios is configured to attach the JWT authentication token to protected API requests.

## Related Project

Backend and complete project documentation:

https://github.com/vignesh060/sweety-glucose-tracker

## Author

**Vignesh Jagadeesan**

GitHub: https://github.com/vignesh060