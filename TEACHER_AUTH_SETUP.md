# Teacher Authentication Setup Guide

## 🚀 Quick Setup Instructions

### **Step 1: Add to Your Backend Server**

Add these files to your existing Node.js/Express backend server:

#### **1.1 Add Teacher Model**
```bash
# Copy the content from: backend-teacher-model.js
# Save as: models/Teacher.js in your backend
```

#### **1.2 Add Teacher Routes**
```bash
# Copy the content from: backend-teacher-routes.js
# Save as: routes/teacher.js in your backend
# OR add to your existing routes file
```

#### **1.3 Update Your Main Server File**
Add this to your main server file (usually `app.js` or `server.js`):

```javascript
// Add teacher routes
const teacherRoutes = require('./routes/teacher'); // Adjust path as needed
app.use('/api', teacherRoutes);
```

### **Step 2: Setup MongoDB Data**

#### **2.1 Run MongoDB Setup Script**
```bash
# In MongoDB shell or MongoDB Compass:
# Copy and run the content from: mongodb-teacher-setup.js
```

#### **2.2 Install Required Dependencies**
Make sure your backend has these npm packages:
```bash
npm install bcryptjs jsonwebtoken mongoose
```

### **Step 3: Test the Integration**

#### **3.1 Start Your Servers**
```bash
# Terminal 1: Start your backend server (port 5000)
cd your-backend-folder
npm start

# Terminal 2: Start Angular dev server (port 4200)
cd your-angular-folder
ng serve
```

#### **3.2 Test Teacher Login**
1. Go to `http://localhost:4200`
2. Click "Teacher Login"
3. Use credentials:
   - **Username:** `rajesh.kumar`
   - **Password:** `teacher123`

### **Step 4: Verify Success**

✅ **Login should work and redirect to teacher dashboard**  
✅ **Check browser localStorage for `teacherToken`**  
✅ **Check browser console for any errors**  

## 🔧 Backend Integration Details

### **Your Current Backend Structure**
Based on your existing code, your backend likely has:
```
your-backend/
├── models/
│   ├── Admin.js
│   ├── Parent.js
│   ├── Student.js
│   └── Event.js
├── routes/
│   └── (your existing routes)
└── app.js or server.js
```

### **Add These Files:**
```
your-backend/
├── models/
│   └── Teacher.js (NEW - from backend-teacher-model.js)
└── routes/
    └── teacher.js (NEW - from backend-teacher-routes.js)
```

### **Update Your Main Server File:**
```javascript
// your-backend/app.js or server.js
const express = require('express');
const mongoose = require('mongoose');
// ... your existing imports

// Your existing routes
const adminRoutes = require('./routes/admin'); // if you have this
const parentRoutes = require('./routes/parent'); // if you have this
const teacherRoutes = require('./routes/teacher'); // NEW

const app = express();

// ... your existing middleware

// Your existing routes
app.use('/api', adminRoutes); // if you have this
app.use('/api', parentRoutes); // if you have this
app.use('/api', teacherRoutes); // NEW

// ... rest of your server setup
```

## 🛠️ Troubleshooting

### **Common Issues:**

#### **Issue 1: "Teacher not found" or Login Fails**
- **Check:** MongoDB data was inserted correctly
- **Solution:** Run the setup script again or check collection name

#### **Issue 2: CORS Errors**
- **Check:** Your backend CORS settings
- **Solution:** Make sure your backend allows requests from `localhost:4200`

#### **Issue 3: 404 Error on `/api/teacher-login`**
- **Check:** Teacher routes are properly added to your server
- **Solution:** Verify the route import and app.use() statement

#### **Issue 4: JWT Errors**
- **Check:** JWT_SECRET environment variable
- **Solution:** Use the same JWT secret as your existing admin/parent auth

### **Debug Steps:**
1. **Check Backend Logs:** Look for console.log output when testing login
2. **Check MongoDB:** Verify teacher data exists with `db.teachers.find()`
3. **Test API Directly:** Use Postman to test `/api/teacher-login` endpoint
4. **Check Network Tab:** Verify API calls are reaching your backend

## 🎯 Next Steps After Setup

Once teacher authentication is working:

1. **Test the teacher dashboard** - Should load with real teacher name
2. **Add more teacher data** - Create more sample teachers
3. **Connect to student data** - Link teachers to existing students
4. **Add homework features** - Build on this foundation

## 📋 Sample API Test

Test with Postman or curl:

```bash
curl -X POST http://localhost:5000/api/teacher-login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "rajesh.kumar",
    "password": "teacher123"
  }'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "teacher": {
    "id": "...",
    "teacherId": "TCH001",
    "name": "Rajesh Kumar",
    "department": "Mathematics",
    "assignedClasses": ["Grade 10-A", "Grade 9-A"]
  }
}
```

**🎉 Once this works, your teacher authentication is complete!**