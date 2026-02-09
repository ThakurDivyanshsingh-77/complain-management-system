# ⚡ QUICK START GUIDE - 5 Minutes to Running System

## 🎯 Goal
Get the Complaint Management System running locally in under 5 minutes.

---

## ✅ Prerequisites Check

Before starting, ensure you have:
- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] MongoDB installed OR MongoDB Atlas account
- [ ] Terminal/Command Prompt access

---

## 🚀 Step-by-Step Setup

### 1️⃣ Get the Code (30 seconds)

```bash
cd complaint-management-system
```

---

### 2️⃣ Backend Setup (2 minutes)

```bash
# Navigate to server
cd server

# Install dependencies
npm install

# Create environment file
cat > .env << EOL
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/complaint-system
JWT_SECRET=my_super_secret_jwt_key_change_in_production_min_32_chars
CLIENT_URL=http://localhost:5173
EOL

# Seed database with sample data
npm run seed

# Start backend server
npm run dev
```

**Expected Output:**
```
✅ MongoDB Connected: localhost
📊 Database: complaint-system
🚀 Server running in development mode
📡 Listening on port 5000
```

**Leave this terminal running!**

---

### 3️⃣ Frontend Setup (2 minutes)

**Open a NEW terminal window:**

```bash
# Navigate to client
cd complaint-management-system/client

# Install dependencies
npm install

# Create environment file
cat > .env << EOL
VITE_API_URL=http://localhost:5000/api
EOL

# Start frontend
npm run dev
```

**Expected Output:**
```
VITE v5.0.8  ready in 1234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

### 4️⃣ Access the Application (10 seconds)

Open your browser and go to:
```
http://localhost:5173
```

---

## 🔑 Login Credentials

The `npm run seed` command created these sample users:

| Role  | Email | Password |
|-------|-------|----------|
| 👑 Admin | admin@example.com | Admin@123 |
| 👷 Staff | staff@example.com | Staff@123 |
| 👤 User | john@example.com | User@123 |

---

## 🎯 First Steps After Login

### As User (john@example.com)
1. Click "Submit Complaint"
2. Fill in details:
   - Title: "Test Issue"
   - Category: "IT"
   - Description: "Testing the system"
   - Priority: "Medium"
3. Optionally upload a file
4. Click "Submit"
5. View your complaint in "My Complaints"

### As Admin (admin@example.com)
1. View analytics dashboard
2. See all complaints
3. Assign complaint to staff
4. View user management
5. Check performance metrics

### As Staff (staff@example.com)
1. View assigned complaints
2. Update complaint status
3. Add resolution notes
4. Track workload

---

## 🔧 Troubleshooting

### MongoDB Connection Issues

**Error:** `MongoNetworkError: failed to connect`

**Solutions:**
1. **Option A - Install MongoDB Locally**
   ```bash
   # macOS (using Homebrew)
   brew install mongodb-community
   brew services start mongodb-community

   # Ubuntu/Debian
   sudo systemctl start mongod

   # Windows
   # Start MongoDB service from Services panel
   ```

2. **Option B - Use MongoDB Atlas (Cloud)**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free account
   - Create cluster
   - Get connection string
   - Update `.env` with:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
   ```

---

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
```bash
# Change PORT in server/.env
PORT=5001

# Or kill the process using port 5000
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

### Dependencies Installation Failed

**Error:** `npm install` errors

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

### Frontend Not Loading

**Checklist:**
- [ ] Backend is running on port 5000
- [ ] Frontend is running on port 5173
- [ ] `.env` file exists in client folder
- [ ] `VITE_API_URL` is set correctly
- [ ] No CORS errors in browser console

---

## 📱 Mobile Testing

To test on mobile device (same network):

1. Find your computer's IP address:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet "

   # Windows
   ipconfig
   ```

2. Update client/.env:
   ```
   VITE_API_URL=http://YOUR_IP:5000/api
   ```

3. Start frontend with:
   ```bash
   npm run dev -- --host
   ```

4. Access on mobile:
   ```
   http://YOUR_IP:5173
   ```

---

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Backend shows "MongoDB Connected"
- ✅ Frontend loads without errors
- ✅ You can login successfully
- ✅ Dashboard displays data
- ✅ You can submit a complaint
- ✅ Toast notifications appear

---

## 🔄 Stopping the Application

To stop the servers:
1. Go to each terminal
2. Press `Ctrl + C`

To restart:
```bash
# Backend
cd server && npm run dev

# Frontend
cd client && npm run dev
```

---

## 📚 Next Steps

Once running successfully:

1. **Explore Features**
   - Try all three user roles
   - Submit complaints
   - Upload files
   - Update statuses
   - View analytics

2. **Read Documentation**
   - README.md - Project overview
   - API_DOCUMENTATION.md - API reference
   - DEPLOYMENT.md - Production deployment
   - PROJECT_SHOWCASE.md - Technical details

3. **Customize**
   - Modify categories
   - Change color scheme
   - Add new features
   - Extend functionality

4. **Deploy**
   - Follow DEPLOYMENT.md guide
   - Deploy to Railway/Render
   - Host frontend on Vercel
   - Configure production database

---

## ⏱️ Time Breakdown

| Step | Time |
|------|------|
| Backend Install | 1 min |
| Backend Config | 30 sec |
| Frontend Install | 1 min |
| Frontend Config | 30 sec |
| Database Seed | 10 sec |
| First Login | 10 sec |
| **TOTAL** | **~3-4 min** |

---

## 💡 Pro Tips

1. **Use Two Monitors**: One for code, one for browser
2. **Keep Terminals Visible**: Monitor logs in real-time
3. **Use Browser DevTools**: Check Network tab for API calls
4. **Enable Auto-Reload**: Both servers watch for changes
5. **Test All Roles**: Switch between different accounts

---

## 🎯 Achievement Unlocked! 🏆

If you've successfully:
- ✅ Started both servers
- ✅ Logged in as different users
- ✅ Submitted a complaint
- ✅ Viewed the dashboard

**Congratulations!** You now have a fully functional, enterprise-grade complaint management system running locally! 🎉

---

## 📞 Need Help?

- Check TROUBLESHOOTING section above
- Review console logs for errors
- Ensure all prerequisites are met
- Verify environment variables
- Check MongoDB is running

---

**Happy Coding! 🚀**

*Last Updated: February 2026*
