# Complaint Management System (MERN)

A full-stack **Complaint Management System** built with the **MERN stack** to help organizations collect, track, assign, and resolve complaints efficiently.

This project supports:
- **Users** who can register, log in, and submit complaints with attachments.
- **Staff/Admin** who can review complaints, update status/priority, assign ownership, and monitor analytics.

---

## Features

- User registration and login with JWT authentication
- Role-based access control (`user`, `staff`, `admin`)
- Submit complaints with category, priority, description, and file attachments
- Track complaint lifecycle (`pending`, `in-progress`, `resolved`, `rejected`)
- Staff/admin complaint assignment and status updates
- Admin dashboard analytics and user management
- Filtering, search, and pagination for complaints/users
- Secure API setup with Helmet, CORS, rate limiting, and validation

---

## Tech Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- React Hook Form + Zod
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (`jsonwebtoken`)
- `bcryptjs`
- `multer` (file uploads)
- `express-validator`
- `helmet`, `cors`, `express-rate-limit`, `morgan`

---

## Installation and Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm
- MongoDB (local instance or MongoDB Atlas)

### 1) Clone the repository

```bash
git clone <your-repo-url>
cd complain-management-system
```

### 2) Backend setup (`/server`)

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/complaint-system
JWT_SECRET=your_super_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Run backend in development:

```bash
npm run dev
```

Optional: seed sample data

```bash
npm run seed
```

### 3) Frontend setup (`/client`)

Open a new terminal:

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend in development:

```bash
npm run dev
```

### 4) Access the app
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

---

## API Documentation

> Base URL (dev): `http://localhost:5000/api`

### Auth

- `POST /auth/register` — register user
- `POST /auth/login` — login user
- `GET /auth/me` — get current user profile (protected)
- `PUT /auth/profile` — update profile (protected)
- `PUT /auth/change-password` — change password (protected)

### Complaints

- `POST /complaints` — create complaint with attachments (protected)
- `GET /complaints/my` — current user complaints (protected)
- `GET /complaints/all` — all complaints for admin/staff (protected)
- `GET /complaints/:id` — complaint details (protected)
- `PUT /complaints/:id/status` — update status (admin/staff)
- `PUT /complaints/:id/assign` — assign complaint (admin)
- `PUT /complaints/:id/priority` — update priority (admin)
- `DELETE /complaints/:id` — delete complaint (admin)

### Admin

- `GET /admin/analytics` — dashboard analytics
- `GET /admin/staff` — list staff/admin for assignment
- `GET /admin/users` — list users with filters
- `GET /admin/users/:id` — get user details
- `PUT /admin/users/:id/role` — update role
- `PUT /admin/users/:id/toggle-status` — activate/deactivate user
- `DELETE /admin/users/:id` — delete user

### Common request notes

- Protected routes require:

```http
Authorization: Bearer <JWT_TOKEN>
```

- Complaint creation uses `multipart/form-data` with field name `attachments` (up to 5 files).

For full request/response examples, see: [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md)

---

## Usage (with Screenshot Placeholders)

1. Register a new account or log in.
2. Create a complaint from the user panel.
3. Track status updates in “My Complaints”.
4. Log in as admin to assign staff and manage users.
5. Monitor metrics from the analytics dashboard.

### Screenshots

> Replace these placeholders with actual image paths once screenshots are available.

```md
![Login Page](./docs/screenshots/login.png)
![User Dashboard](./docs/screenshots/user-dashboard.png)
![Submit Complaint](./docs/screenshots/submit-complaint.png)
![Admin Analytics](./docs/screenshots/admin-analytics.png)
![Complaint Details](./docs/screenshots/complaint-details.png)
```

---

## How to Run

### Development mode

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

### Production mode

Backend (Node server):

```bash
cd server
npm install
npm start
```

Frontend (build + preview):

```bash
cd client
npm install
npm run build
npm run preview
```

---

## Future Scope

- Real-time notifications (WebSockets/Socket.IO)
- Email/SMS notifications for complaint lifecycle updates
- SLA tracking and automated escalation rules
- Department-wise workflow automation
- Advanced reporting with export (PDF/CSV/Excel)
- AI-assisted complaint categorization and sentiment analysis
- Mobile app support (React Native)
- Multi-language support and accessibility enhancements

---

## License

This project is licensed under the MIT License.
