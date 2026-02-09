# 🚀 Deployment Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB installed or MongoDB Atlas account
- Git installed

## Local Development Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd complaint-management-system

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Configuration

**Backend (.env in server/)**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/complaint-management-system
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
CLIENT_URL=http://localhost:5173
```

**Frontend (.env in client/)**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Database (Optional)

```bash
cd server
npm run seed
```

This creates sample users:
- **Admin**: admin@example.com / Admin@123
- **Staff**: staff@example.com / Staff@123  
- **User**: john@example.com / User@123

### 4. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Access the application at: http://localhost:5173

---

## Production Deployment

### Option 1: Deploy to Railway (Backend)

1. Create account at [railway.app](https://railway.app)

2. Install Railway CLI:
```bash
npm install -g @railway/cli
```

3. Deploy backend:
```bash
cd server
railway login
railway init
railway add
```

4. Set environment variables in Railway dashboard:
```
NODE_ENV=production
MONGODB_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<strong-random-secret>
CLIENT_URL=<your-frontend-url>
```

5. Deploy:
```bash
railway up
```

### Option 2: Deploy to Render (Backend)

1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
5. Add environment variables in dashboard

### Frontend Deployment - Vercel

1. Create account at [vercel.com](https://vercel.com)

2. Install Vercel CLI:
```bash
npm install -g vercel
```

3. Deploy:
```bash
cd client
vercel
```

4. Set environment variable:
```
VITE_API_URL=<your-backend-url>/api
```

5. Deploy to production:
```bash
vercel --prod
```

### Frontend Deployment - Netlify

1. Build the app:
```bash
cd client
npm run build
```

2. Deploy via Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

3. Set environment variable in Netlify dashboard:
```
VITE_API_URL=<your-backend-url>/api
```

---

## MongoDB Atlas Setup

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create new cluster (Free tier available)
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for development)
5. Get connection string
6. Replace `<password>` and `<dbname>` in connection string
7. Use in MONGODB_URI environment variable

---

## Environment Variables Reference

### Backend
| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | production |
| MONGODB_URI | MongoDB connection string | mongodb+srv://... |
| JWT_SECRET | JWT signing secret (min 32 chars) | random_string_here |
| CLIENT_URL | Frontend URL for CORS | https://your-app.vercel.app |

### Frontend
| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | https://your-api.railway.app/api |

---

## Post-Deployment Checklist

- [ ] Test user registration
- [ ] Test user login
- [ ] Test complaint submission
- [ ] Test file upload
- [ ] Test admin dashboard
- [ ] Test role-based access
- [ ] Verify email notifications (if implemented)
- [ ] Check responsive design on mobile
- [ ] Test dark mode
- [ ] Verify all API endpoints
- [ ] Check error handling
- [ ] Test with different user roles

---

## Troubleshooting

**MongoDB Connection Failed**
- Check connection string format
- Verify network access in Atlas
- Ensure database user credentials are correct

**CORS Errors**
- Verify CLIENT_URL in backend .env
- Check VITE_API_URL in frontend .env
- Ensure URLs don't have trailing slashes

**File Upload Not Working**
- Check uploads directory exists and has write permissions
- Verify Multer configuration
- Check file size limits

**JWT Token Errors**
- Ensure JWT_SECRET is set and same across restarts
- Check token expiration settings
- Verify Authorization header format

---

## Monitoring & Maintenance

### Logs
- Backend: Check Railway/Render logs
- Frontend: Check Vercel/Netlify logs
- MongoDB: Check Atlas monitoring

### Backups
- Set up automated MongoDB backups in Atlas
- Export database regularly:
```bash
mongodump --uri="<connection-string>" --out=./backup
```

### Updates
```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit
npm audit fix
```

---

## Support

For issues, please:
1. Check the troubleshooting section
2. Review application logs
3. Open an issue on GitHub
4. Contact support

---

**Last Updated:** February 2026
