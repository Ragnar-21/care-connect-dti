# CareConnect – College Health Center Web Application

CareConnect is a full-stack web application designed for college health centers, enabling students, doctors, and administrators to manage appointments, health records, and communication efficiently. The project features a modern React frontend (Material-UI), a secure Node.js/Express backend, and a MongoDB Atlas database. It is deployed with Netlify (frontend) and Render (backend).

---

## Features


- **User Authentication**: Secure JWT-based login/signup for students, doctors, and admins
- **Role-Based Access**: Admin, doctor, and patient dashboards with tailored features
- **Appointment Management**: Book, view, and manage appointments
- **Doctor & Patient Profiles**: View and edit personal and professional information
- **Chat & Notifications**: Real-time chat and notification system
- **Activity Logs & Analytics**: Admin tools for monitoring and reporting
- **Responsive UI**: Modern, accessible design using Material-UI with dark/light mode

---

## Tech Stack

- **Frontend**: React, Material-UI (MUI), Axios
- **Backend**: Node.js, Express, JWT, Mongoose
- **Database**: MongoDB Atlas
- **Deployment**: Netlify (frontend), Render (backend)

---

## Project Structure

```
CareConnect/
  backend/    # Express API, controllers, models, routes, middleware
  frontend/   # React app, components, pages, contexts, services
```

---

## Getting Started (Development)

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB Atlas account (or local MongoDB for dev)

### 1. Clone the Repository
```sh
git clone https://github.com/yourusername/CareConnect.git
cd CareConnect
```

### 2. Backend Setup
```sh
cd backend
npm install
# Create .env file (see .env.example)
# Example .env:
# MONGODB_URI=your_mongodb_atlas_uri
# JWT_SECRET=your_jwt_secret
# FRONTEND_URL=http://localhost:3000
npm run dev
```

### 3. Frontend Setup
```sh
cd ../frontend
npm install
# Create .env (see .env.production for example)
# REACT_APP_API_URL=http://localhost:5001/api
npm start
```

---

## Deployment

- **Frontend**: Deploy `/frontend` to Netlify. Set `REACT_APP_API_URL` to your Render backend URL.
- **Backend**: Deploy `/backend` to Render. Set environment variables for MongoDB, JWT, and allowed origins.



## API Overview
- `/api/auth/login` – User login
- `/api/auth/signup` – User registration
- `/api/appointments` – Appointment management
- `/api/profile` – User profile endpoints
- `/api/chat` – Real-time chat
- `/api/analytics` – Admin analytics

---

## License
MIT

---

## Contributors
- [Kumar Prateek](https://github.com/prateek2105)
- [Aaryan Kuntal](https://github.com/schroder0)

---

## Acknowledgements
- Material-UI
- Netlify
- Render
- MongoDB Atlas
