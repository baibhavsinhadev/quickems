# QuickEMS

**QuickEMS** is a full-stack Employee Management System built for small businesses to efficiently manage employees, attendance, leaves, and payroll — all in one place.

It supports **role-based access (Admin & Employee)** and includes automation features like attendance tracking and email notifications.

---

## Features

### Admin

* Create, update, and delete employees
* View and manage employee attendance
* Approve or reject leave applications
* Manage payroll and salary records
* Access dashboard for system overview

### Employee

* Check-in / Check-out system
* Apply for leaves
* View payslips
* Update profile details

### System Features

* Auto check-out (cron-based)
* Email notifications:

  * Leave application reminders
  * Attendance reminders
  * Auto check-out alerts
* Role-based access control
* Secure backend using:

  * Helmet
  * Express Mongo Sanitize
  * XSS Clean
  * Morgan Logger
  * Rate Limiting

---

## Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

### Background Jobs

* Inngest (Cron + Event-based jobs)

### Email Service

* Nodemailer (Gmail SMTP)

### Frontend

* React (Vite)

---

## Project Structure

### Backend (`server/`)

```
server/
├── config/
├── constants/
├── controllers/
├── inngest/
├── middlewares/
├── models/
├── routes/
├── .env
├── package.json
└── server.js
```

### Frontend (`client/`)

```
client/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
```

---

## ⚙️ Environment Variables

### Backend (`.env`)

```
MONGODB_URI=
JWT_SECRET=
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
CLIENT_URL=

SMTP_USER=
SMTP_PASS=
SENDER_EMAIL=
ADMIN_EMAIL=
```

### Frontend (`.env`)

```
VITE_SERVER_URL=
```

---

## Getting Started

### 1. Clone the Repository

```
git clone https://github.com/baibhavsinhadev/quickems.git
cd quickems
```

---

### 2. Setup Backend

```
cd server
npm install
npm run server
```

Or using nodemon:

```
nodemon server.js
```

---

### 3. Setup Frontend

```
cd client
npm install
npm run dev
```

---

## API Structure

* Base URL:

```
/api
```

* REST-based architecture
* Protected routes using JWT
* Role-based middleware:

  * `protect` → for authenticated users
  * `protectAdmin` → for admin-only access

---

## Security

QuickEMS follows best practices to ensure backend security:

* HTTP headers secured using Helmet
* NoSQL injection protection via Mongo Sanitize
* XSS protection using xss-clean
* API rate limiting
* Request logging with Morgan

---

## Email System

Email notifications are powered by Nodemailer using Gmail SMTP.

> ⚠️ Make sure to use a **Gmail App Password** instead of your real password.

---

## Background Jobs

Background processing is handled using Inngest:

* Scheduled cron jobs (attendance reminders, auto check-out)
* Event-driven workflows (leave notifications, alerts)

---

## Important Notes

* Use **MongoDB Atlas** or local MongoDB instance
* Ensure `.env` is properly configured before running
* Gmail SMTP requires App Password
* Backend and frontend must run simultaneously

---

## Future Improvements (Optional)

* Mobile responsiveness enhancements
* Advanced analytics dashboard
* Multi-company support
* Role expansion (HR, Manager, etc.)

---

## Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

---

## License

This project is open-source and available under the MIT License.

---

## Author

Built with focus and clarity to solve real-world employee management problems.

## Inspiration

This project is inspired by the work and tutorials of GreatStack.

QuickEMS was built independently as a portfolio project, with additional features, architectural decisions, and enhancements tailored for real-world use cases such as role-based access, background job processing, and automated workflows.

The goal was not just to follow along, but to extend the concept into a more complete and production-oriented system.
