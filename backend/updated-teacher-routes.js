const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'teacher_secret_key';

// POST /api/teacher-login
router.post('/', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  
  try {
    // Find teacher by username or email
    const teacher = await Teacher.findOne({ 
      $or: [
        { username: username },
        { email: username }
      ]
    });
    
    if (!teacher) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // For demo purposes - in production, use bcrypt
    // Simple password check (should be bcrypt.compare in production)
    if (teacher.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: teacher._id, 
        username: teacher.username,
        role: 'teacher' 
      }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );
    
    // Return success response
    res.json({ 
      message: 'Login successful', 
      token,
      teacher: {
        id: teacher._id,
        username: teacher.username,
        fullName: teacher.fullName,
        email: teacher.email,
        employeeId: teacher.employeeId,
        department: teacher.department
      }
    });
    
  } catch (err) {
    console.error('Teacher login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/teacher-login/profile - Get teacher profile (protected route)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).select('-password');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Simple auth middleware (you can use your existing one)
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
}

module.exports = router;