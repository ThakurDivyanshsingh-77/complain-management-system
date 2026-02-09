# 🎯 Elite Complaint Management System

A **production-grade**, enterprise-ready complaint management platform built with the MERN stack.

![MERN Stack](https://img.shields.io/badge/MERN-Stack-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-production--ready-success)

## 🌟 Features

### 👤 User Features
- ✅ Secure registration and authentication
- 📝 Submit complaints with file attachments
- 📊 Real-time complaint tracking
- 🔔 Status update notifications
- 📱 Fully responsive mobile interface

### 🛡️ Admin Features
- 📈 Comprehensive analytics dashboard
- 🔍 Advanced search and filtering
- 👥 User management
- 📋 Category management
- 📊 Performance metrics and reports

### 👷 Staff Features
- 📬 View assigned complaints
- ✏️ Update complaint progress
- ✅ Resolve and close tickets
- 📝 Add resolution notes

## 🏗️ Architecture

```
complaint-management-system/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service layer
│   │   ├── context/       # React Context (Auth, Theme)
│   │   ├── lib/           # Utilities and helpers
│   │   └── App.jsx        # Main app component
│   └── package.json
│
├── server/                # Node.js Backend (Express)
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── server.js         # Entry point
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ and npm
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd complaint-management-system
```

2. **Backend Setup**
```bash
cd server
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/complaint-system
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
CLIENT_URL=http://localhost:5173
EOF

# Start the server
npm run dev
```

3. **Frontend Setup**
```bash
cd client
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
EOF

# Start the client
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🔑 Default Admin Credentials

After seeding the database (optional):
```
Email: admin@example.com
Password: Admin@123
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Complaint Endpoints

#### Create Complaint
```http
POST /api/complaints
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Network Issue",
  "category": "IT",
  "description": "Internet not working in lab",
  "priority": "high",
  "attachments": [file]
}
```

#### Get My Complaints
```http
GET /api/complaints/my
Authorization: Bearer <token>
```

#### Get All Complaints (Admin/Staff)
```http
GET /api/complaints/all?status=pending&category=IT&page=1&limit=10
Authorization: Bearer <token>
```

#### Update Complaint Status
```http
PUT /api/complaints/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in-progress",
  "note": "Working on it"
}
```

#### Assign Complaint (Admin)
```http
PUT /api/complaints/:id/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "assignedTo": "<staff_user_id>"
}
```

### Admin Endpoints

#### Get Analytics
```http
GET /api/admin/analytics
Authorization: Bearer <token>
```

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <token>
```

#### Update User Role
```http
PUT /api/admin/users/:id/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "staff"
}
```

## 🔐 Security Features

- 🔒 JWT-based authentication
- 🛡️ Role-based access control (RBAC)
- 🔐 Bcrypt password hashing
- ✅ Input validation & sanitization
- 🚫 XSS protection
- 🔑 HTTP-only cookies support
- 📝 Request rate limiting
- 🌐 CORS configuration

## 🎨 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **ShadCN UI** - Component library
- **React Router v6** - Routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Recharts** - Data visualization
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Express Validator** - Validation

## 📊 Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'staff', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```

### Complaint Model
```javascript
{
  userId: ObjectId (ref: 'User'),
  title: String (required),
  category: String (required),
  description: String (required),
  attachments: [String],
  status: String (enum: ['pending', 'in-progress', 'resolved', 'rejected']),
  priority: String (enum: ['low', 'medium', 'high']),
  assignedTo: ObjectId (ref: 'User'),
  timeline: [{
    status: String,
    note: String,
    updatedBy: ObjectId,
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Backend (Railway/Render/Heroku)

1. Set environment variables:
```env
PORT=5000
MONGODB_URI=<your_mongodb_atlas_uri>
JWT_SECRET=<strong_random_secret>
NODE_ENV=production
CLIENT_URL=<your_frontend_url>
```

2. Deploy using Git:
```bash
git push railway main
```

### Frontend (Vercel/Netlify)

1. Build the app:
```bash
cd client
npm run build
```

2. Set environment variables:
```env
VITE_API_URL=<your_backend_url>/api
```

3. Deploy:
```bash
vercel --prod
```

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## 📈 Future Enhancements

- [ ] Real-time notifications with Socket.io
- [ ] Email notifications (NodeMailer)
- [ ] SMS alerts (Twilio)
- [ ] PDF report generation
- [ ] Export to Excel
- [ ] AI-based complaint categorization
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] SLA tracking and escalation
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourname)
- Portfolio: [yourportfolio.com](https://yourportfolio.com)

## 🙏 Acknowledgments

- ShadCN UI for beautiful components
- Tailwind CSS for utility-first styling
- MongoDB team for excellent documentation
- React community for amazing tools

---

⭐ **Star this repository if you find it helpful!**

📧 **Questions?** Open an issue or reach out!

🚀 **Happy Coding!**
