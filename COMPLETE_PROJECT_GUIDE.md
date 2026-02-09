# 🎯 COMPLETE MERN STACK - COMPLAINT MANAGEMENT SYSTEM

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Features Implemented](#features-implemented)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Quick Start](#quick-start)
6. [Detailed Setup](#detailed-setup)
7. [API Reference](#api-reference)
8. [Frontend Components](#frontend-components)
9. [Security Features](#security-features)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [Screenshots](#screenshots)

---

## 🎯 Project Overview

A **production-grade, enterprise-ready** complaint management platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This system enables users to submit, track, and manage complaints with full transparency and accountability.

### Key Highlights
✅ Role-based access control (User, Staff, Admin)
✅ Real-time complaint tracking with timeline
✅ File upload support (images & documents)
✅ Advanced analytics dashboard
✅ Responsive mobile-first design
✅ Dark/Light mode support
✅ RESTful API architecture
✅ JWT authentication
✅ Input validation & sanitization

---

## ✨ Features Implemented

### 👤 User Features
- ✅ Secure registration and login
- ✅ Submit complaints with attachments
- ✅ Track complaint status in real-time
- ✅ View complaint timeline
- ✅ Filter and search own complaints
- ✅ Update profile
- ✅ Change password

### 👷 Staff Features  
- ✅ View assigned complaints
- ✅ Update complaint status
- ✅ Add resolution notes
- ✅ Track workload
- ✅ Filter by status/priority

### 🛡️ Admin Features
- ✅ Comprehensive analytics dashboard
- ✅ User management (CRUD)
- ✅ Role assignment
- ✅ Complaint assignment to staff
- ✅ Priority management
- ✅ Category-wise breakdown
- ✅ Performance metrics
- ✅ Staff performance tracking

---

## 🛠️ Technology Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Bcrypt | Password hashing |
| Multer | File uploads |
| Express Validator | Input validation |
| Helmet | Security headers |
| Morgan | Logging |
| CORS | Cross-origin requests |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI library |
| Vite | Build tool |
| React Router v6 | Routing |
| Tailwind CSS | Styling |
| Axios | HTTP client |
| React Hook Form | Form management |
| Zod | Schema validation |
| Recharts | Data visualization |
| React Hot Toast | Notifications |
| Lucide React | Icons |

---

## 📁 Project Structure

```
complaint-management-system/
├── server/                      # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   ├── complaintController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js             # JWT verification
│   │   ├── error.js            # Error handling
│   │   └── upload.js           # File upload (Multer)
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── Complaint.js        # Complaint schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   ├── jwt.js              # Token generation
│   │   └── seed.js             # Database seeder
│   ├── uploads/                # File storage
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Entry point
│
├── client/                      # Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── ui/            # Base UI components
│   │   │   ├── layout/        # Layout components
│   │   │   └── shared/        # Shared components
│   │   ├── pages/             # Page components
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   ├── staff/
│   │   │   └── admin/
│   │   ├── context/           # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── services/
│   │   │   └── api.js         # API service layer
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/
│   │   │   └── utils.js       # Utility functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
├── README.md
├── API_DOCUMENTATION.md
├── DEPLOYMENT.md
└── .gitignore
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git

### Installation

```bash
# 1. Clone repository
git clone <your-repo-url>
cd complaint-management-system

# 2. Backend setup
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run seed  # Optional: Create sample data
npm run dev

# 3. Frontend setup (new terminal)
cd client
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

### Access
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Health: http://localhost:5000/api/health

### Sample Credentials (after seeding)
```
Admin:  admin@example.com  / Admin@123
Staff:  staff@example.com  / Staff@123
User:   john@example.com   / User@123
```

---

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['user', 'staff', 'admin'],
  department: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Complaint Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String,
  category: Enum [...],
  description: String,
  attachments: [String],
  status: Enum ['pending', 'in-progress', 'resolved', 'rejected'],
  priority: Enum ['low', 'medium', 'high', 'critical'],
  assignedTo: ObjectId (ref: User),
  timeline: [{
    status: String,
    note: String,
    updatedBy: ObjectId,
    timestamp: Date
  }],
  resolutionNote: String,
  resolvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Security Implementation

### Authentication
- **JWT Tokens**: 30-day expiration
- **Bcrypt**: Password hashing (10 rounds)
- **Token Storage**: localStorage (client)
- **Auto-logout**: On token expiration

### Authorization
- **Role-based access control** (RBAC)
- **Route protection** middleware
- **Field-level permissions**

### Input Validation
- **Express Validator**: Server-side validation
- **Zod**: Client-side schema validation
- **Sanitization**: XSS prevention

### Security Headers
- **Helmet.js**: Security headers
- **CORS**: Restricted origins
- **Rate Limiting**: 100 req/15min

### File Upload Security
- **Type validation**: Images & PDFs only
- **Size limit**: 5MB max
- **File count limit**: 5 files max
- **Secure storage**: Server-side

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication**
- [ ] User registration
- [ ] User login
- [ ] Token persistence
- [ ] Auto-logout on expiration
- [ ] Password validation

**Complaints**
- [ ] Submit complaint
- [ ] File upload
- [ ] View own complaints
- [ ] Filter/search
- [ ] Timeline tracking

**Admin Functions**
- [ ] View analytics
- [ ] Assign complaints
- [ ] Update status
- [ ] Manage users
- [ ] Role assignment

**Responsive Design**
- [ ] Mobile (320px+)
- [ ] Tablet (768px+)
- [ ] Desktop (1024px+)

**Cross-browser**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

## 📦 Deployment

### Production Checklist

**Backend**
- [ ] Set strong JWT_SECRET
- [ ] Configure MongoDB Atlas
- [ ] Set NODE_ENV=production
- [ ] Configure CORS
- [ ] Enable logging
- [ ] Set up monitoring

**Frontend**
- [ ] Update VITE_API_URL
- [ ] Build for production
- [ ] Test production build
- [ ] Configure CDN (optional)

**Database**
- [ ] Create indexes
- [ ] Set up backups
- [ ] Configure monitoring
- [ ] Review security settings

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guide.

---

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Professional blue/gray
- **Typography**: Inter font family
- **Spacing**: 4px grid system
- **Shadows**: Layered elevation
- **Animations**: Subtle transitions

### Components
- **Status Badges**: Color-coded
- **Priority Indicators**: Visual hierarchy
- **Timeline**: Chronological events
- **Charts**: Interactive analytics
- **Forms**: Inline validation
- **Modals**: Smooth animations
- **Toast Notifications**: Non-intrusive

### Accessibility
- **ARIA labels**: Screen reader support
- **Keyboard navigation**: Tab support
- **Color contrast**: WCAG AA compliant
- **Focus indicators**: Visible states

---

## 📊 Analytics Dashboard

The admin dashboard provides:
- **Total Complaints**: Real-time count
- **Status Breakdown**: Pie/bar charts
- **Category Analysis**: Distribution
- **Priority Metrics**: Critical tracking
- **Resolution Time**: Average duration
- **Trend Analysis**: 30-day graph
- **Staff Performance**: Top performers
- **User Statistics**: Registration trends

---

## 🔄 API Rate Limiting

- **Window**: 15 minutes
- **Limit**: 100 requests per IP
- **Scope**: All /api/* routes
- **Response**: 429 status with retry info

---

## 🐛 Common Issues & Solutions

**Issue: MongoDB connection failed**
- Verify connection string
- Check network access in Atlas
- Ensure IP whitelist

**Issue: CORS errors**
- Match CLIENT_URL in backend
- Check VITE_API_URL in frontend
- Remove trailing slashes

**Issue: File upload fails**
- Check uploads directory exists
- Verify write permissions
- Check file size/type

**Issue: Token errors**
- Clear localStorage
- Re-login
- Check JWT_SECRET consistency

---

## 📈 Future Enhancements

- [ ] Real-time notifications (Socket.io)
- [ ] Email alerts (NodeMailer)
- [ ] SMS notifications (Twilio)
- [ ] PDF report generation
- [ ] Export to Excel
- [ ] AI-based categorization
- [ ] Multi-language support
- [ ] Advanced search filters
- [ ] SLA tracking
- [ ] Mobile app (React Native)

---

## 👥 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

---

## 📄 License

MIT License - See LICENSE file

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourname)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- React team for amazing framework
- Tailwind CSS for utility-first styling
- MongoDB team for excellent documentation
- Express.js community
- All open-source contributors

---

**Built with ❤️ using the MERN Stack**

Last Updated: February 2026
