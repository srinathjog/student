# School ERP Backend Restructuring Plan

## 🎯 Current State vs Target State

### **Current Backend (What You Have)**
- **Database**: MongoDB with collections: `events`, `parents`, `school-admin`, `students`
- **API Base**: `http://localhost:5000/api`
- **Endpoints**: `/admin-login`, `/parent-login`, `/students`
- **Authentication**: JWT tokens for admin and parent

### **Target State (What We Need)**
- **Enhanced MongoDB**: Add teacher collections and relationships
- **Unified API**: Extend existing endpoints + add teacher endpoints
- **Multi-role Auth**: Admin, Parent, Teacher authentication
- **Integrated Features**: All three modules working together

## 🚀 Migration Strategy

### **Phase 1: Extend Current Database (Week 1)**

#### **Step 1.1: Add Teacher Collections**
```javascript
// Add these new collections to your existing MongoDB
db.createCollection("teachers")
db.createCollection("classes") 
db.createCollection("subjects")
db.createCollection("teacher_class_assignments")

// Enhanced indexes
db.teachers.createIndex({ "teacherId": 1 }, { unique: true })
db.teachers.createIndex({ "email": 1 }, { unique: true })
db.students.createIndex({ "class": 1 }) // Add to existing students
```

#### **Step 1.2: Enhance Existing Collections**
```javascript
// Enhance existing students collection
db.students.updateMany(
  {},
  {
    $set: {
      "section": "A", // Default section
      "rollNumber": "", // Add roll numbers
      "profilePhoto": ""
    }
  }
)

// Add teacher reference to classes in students
// Update student records to reference class properly
```

### **Phase 2: Extend API Endpoints (Week 2)**

#### **Step 2.1: Add Teacher Authentication**
```javascript
// Add to your existing Express server
POST /api/teacher-login
GET /api/teachers/profile
PUT /api/teachers/profile
POST /api/auth/teacher/refresh-token
```

#### **Step 2.2: Add Core Teacher APIs**
```javascript
// Teacher Dashboard
GET /api/teachers/{teacherId}/dashboard
GET /api/teachers/{teacherId}/classes
GET /api/teachers/{teacherId}/students

// Basic CRUD that integrates with existing data
GET /api/classes
GET /api/classes/{classId}/students
```

### **Phase 3: Teacher Feature APIs (Week 3-4)**

#### **Step 3.1: Attendance Management**
```javascript
POST /api/attendance/mark
GET /api/attendance/class/{classId}/date/{date}
GET /api/attendance/reports/{classId}
PUT /api/attendance/{attendanceId}
```

#### **Step 3.2: Homework Management**
```javascript
POST /api/homework
GET /api/homework/teacher/{teacherId}
GET /api/homework/class/{classId}
PUT /api/homework/{homeworkId}
POST /api/homework/{homeworkId}/submissions
```

### **Phase 4: Integration & Testing (Week 5)**

#### **Step 4.1: Cross-Module Integration**
- Teachers can see parent contact information
- Parents can see homework assigned by teachers
- Admin can manage all three modules

#### **Step 4.2: Frontend Integration**
- Update your Angular services to use new APIs
- Test all three dashboards together

## 🔧 Backend Code Structure

### **Enhanced Express Server Structure**
```
server/
├── models/
│   ├── Admin.js (existing)
│   ├── Parent.js (existing)  
│   ├── Student.js (existing)
│   ├── Event.js (existing)
│   ├── Teacher.js (new)
│   ├── Class.js (new)
│   ├── Homework.js (new)
│   └── Attendance.js (new)
├── routes/
│   ├── admin.js (existing)
│   ├── parent.js (existing)
│   ├── student.js (existing)
│   ├── teacher.js (new)
│   ├── attendance.js (new)
│   └── homework.js (new)
├── middleware/
│   ├── auth.js (enhance for multi-role)
│   └── validation.js
└── controllers/
    ├── adminController.js
    ├── parentController.js
    ├── teacherController.js (new)
    └── sharedController.js (new)
```

## 📋 Immediate Next Steps

### **Option A: Quick Teacher Integration (Recommended)**
1. **Today**: Add basic teacher collection and auth endpoint
2. **Tomorrow**: Create teacher dashboard API that uses existing student data
3. **This Week**: Add attendance and homework basic functionality

### **Option B: Complete Restructure**
1. **This Week**: Migrate to PostgreSQL with full relational schema
2. **Next Week**: Rebuild all APIs with proper relationships
3. **Week 3**: Integrate all modules

## 🛠️ Sample Implementation

### **Step 1: Add Teacher Model (MongoDB)**
```javascript
// models/Teacher.js
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  teacherId: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  phone: String,
  department: String,
  subjects: [String],
  assignedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
```

### **Step 2: Add Teacher Auth Route**
```javascript
// routes/teacher.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');

router.post('/teacher-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const teacher = await Teacher.findOne({ 
      $or: [{ username }, { email: username }],
      isActive: true 
    });
    
    if (!teacher || !bcrypt.compareSync(password, teacher.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: teacher._id, type: 'teacher', teacherId: teacher.teacherId },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        teacherId: teacher.teacherId,
        department: teacher.department
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
```

### **Step 3: Integrate with Existing Students**
```javascript
// Get teacher's students from existing data structure
router.get('/teachers/:teacherId/students', async (req, res) => {
  try {
    const { teacherId } = req.params;
    
    // Get teacher's assigned classes
    const teacher = await Teacher.findOne({ teacherId });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    // Get students from existing collection based on class assignments
    const students = await Student.find({
      class: { $in: teacher.assignedClasses }
    });
    
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
```

## 🤔 My Recommendation

**Start with Option A - Quick Teacher Integration**

**Why?**
✅ **Minimal disruption** to your existing working system  
✅ **Quick wins** - Teacher dashboard working in days, not weeks  
✅ **Incremental** - Add features one by one  
✅ **Safe** - Keep your existing Parent/Admin modules intact  

**Would you like me to help you implement this step-by-step, starting with adding the Teacher authentication to your existing backend?**