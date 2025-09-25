// =====================================================
// Teacher Authentication Routes
// Add this to your existing backend server
// File: routes/teacher.js or add to your main routes file
// =====================================================

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Teacher = require('./backend-teacher-model');
const router = express.Router();

// =====================================================
// POST /api/teacher-login
// Teacher authentication endpoint
// =====================================================
router.post('/teacher-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username and password are required' 
      });
    }
    
    // Find teacher by username or email
    const teacher = await Teacher.findOne({ 
      $or: [
        { username: username },
        { email: username }
      ],
      isActive: true 
    });
    
    // Check if teacher exists and password is correct
    if (!teacher || !bcrypt.compareSync(password, teacher.password)) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }
    
    // Generate JWT token (same pattern as your existing auth)
    const token = jwt.sign(
      { 
        id: teacher._id, 
        type: 'teacher', 
        teacherId: teacher.teacherId,
        name: teacher.name
      },
      process.env.JWT_SECRET || 'your-secret-key', // Use same secret as admin/parent
      { expiresIn: '24h' }
    );
    
    // Return successful response (similar to your parent-login response)
    res.json({
      message: 'Login successful',
      token,
      teacher: {
        id: teacher._id,
        teacherId: teacher.teacherId,
        name: teacher.name,
        email: teacher.email,
        department: teacher.department,
        subjects: teacher.subjects,
        assignedClasses: teacher.assignedClasses
      }
    });
    
  } catch (error) {
    console.error('Teacher login error:', error);
    res.status(500).json({ 
      message: 'Server error during login' 
    });
  }
});

// =====================================================
// GET /api/teachers/profile
// Get current teacher profile
// =====================================================
router.get('/teachers/profile', authenticateTeacher, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher.id).select('-password');
    
    if (!teacher) {
      return res.status(404).json({ 
        message: 'Teacher not found' 
      });
    }
    
    res.json({
      teacher: {
        id: teacher._id,
        teacherId: teacher.teacherId,
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        department: teacher.department,
        designation: teacher.designation,
        subjects: teacher.subjects,
        qualifications: teacher.qualifications,
        experience: teacher.experience,
        joinDate: teacher.joinDate,
        assignedClasses: teacher.assignedClasses,
        profilePhoto: teacher.profilePhoto
      }
    });
    
  } catch (error) {
    console.error('Get teacher profile error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// =====================================================
// GET /api/teachers/:teacherId/students
// Get students for teacher's assigned classes
// =====================================================
router.get('/teachers/:teacherId/students', authenticateTeacher, async (req, res) => {
  try {
    const { teacherId } = req.params;
    
    // Get teacher's assigned classes
    const teacher = await Teacher.findOne({ teacherId, isActive: true });
    if (!teacher) {
      return res.status(404).json({ 
        message: 'Teacher not found' 
      });
    }
    
    // Get students from existing students collection
    // Assuming your existing students have a 'class' field
    const { Student } = require('./backend-teacher-dashboard-models');
    
    const students = await Student.find({
      class: { $in: teacher.assignedClasses },
      // Add other conditions if needed
    }).select('name age grade class rollNumber studentId');
    
    res.json({
      students,
      totalStudents: students.length,
      assignedClasses: teacher.assignedClasses
    });
    
  } catch (error) {
    console.error('Get teacher students error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// =====================================================
// GET /api/teachers/:teacherId/dashboard
// Get teacher dashboard overview data
// =====================================================
router.get('/teachers/:teacherId/dashboard', authenticateTeacher, async (req, res) => {
  try {
    const { teacherId } = req.params;
    
    const teacher = await Teacher.findOne({ teacherId, isActive: true });
    if (!teacher) {
      return res.status(404).json({ 
        message: 'Teacher not found' 
      });
    }
    
    // Get basic stats from existing data
    const { Student } = require('./backend-teacher-dashboard-models');
    
    const totalStudents = await Student.countDocuments({
      class: { $in: teacher.assignedClasses }
    });
    
    // You can add more statistics here as you build other features
    const dashboardData = {
      teacher: {
        name: teacher.name,
        department: teacher.department,
        assignedClasses: teacher.assignedClasses
      },
      stats: {
        totalClasses: teacher.assignedClasses.length,
        totalStudents: totalStudents,
        // Add more stats as you implement features
        pendingHomework: 0, // Will implement later
        attendanceToday: 0   // Will implement later
      },
      recentActivity: [], // Will populate as you add features
      upcomingClasses: [] // Will implement with timetable
    };
    
    res.json(dashboardData);
    
  } catch (error) {
    console.error('Get teacher dashboard error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// =====================================================
// Authentication Middleware
// Use this to protect teacher routes
// =====================================================
function authenticateTeacher(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      message: 'Access denied. No token provided.' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    if (decoded.type !== 'teacher') {
      return res.status(403).json({ 
        message: 'Access denied. Teacher token required.' 
      });
    }
    
    req.teacher = decoded;
    next();
  } catch (error) {
    res.status(400).json({ 
      message: 'Invalid token' 
    });
  }
}

module.exports = router;