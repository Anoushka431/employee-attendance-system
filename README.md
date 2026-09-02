# Employee Attendance Management System

A full-stack Employee Attendance Management System built using the MERN stack. The system allows employees to manage attendance, working hours, and leave requests, while HR can monitor attendance and manage leave requests.

## Live Demo

**Frontend:**  
https://employee-attendance-frontend-05vd.onrender.com

**Backend API:**  
https://employee-attendance-system-g70l.onrender.com

---

## Features

### Employee Features
- Employee Registration
- Employee Login
- JWT-based Authentication
- Attendance Check-In
- Attendance Check-Out
- Working Hours Calculation
- Attendance Status Tracking
- Attendance History
- Leave Request Submission
- Leave History
- Leave Balance Tracking
- Leave Deduction after Approval

### HR Features
- HR Login
- HR Dashboard
- View All Employee Attendance Records
- View All Leave Requests
- Approve Leave Requests
- Reject Leave Requests
- Track Pending, Approved and Rejected Leaves
- Monitor Attendance Status

---

## Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Vite
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS

### Deployment
- Render
- MongoDB Atlas

---

## Project Structure

```text
employee-attendance-system/
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── ProtectedRoute.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md
