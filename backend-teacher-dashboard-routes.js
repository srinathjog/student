// =====================================================
// Teacher Dashboard API Routes
// File: backend-teacher-dashboard-routes.js
// =====================================================

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Simple auth middleware for teacher routes
const authenticateTeacher = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  try {
    // For now, just pass through - you can add proper JWT verification later
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// =====================================================
// GET /api/teacher-dashboard/classes
// Get teacher's classes
// =====================================================
router.get('/classes', authenticateTeacher, async (req, res) => {
  try {
    // Mock data for teacher's classes
    const mockClasses = [
      {
        id: '1',
        class: 'Grade 10-A',
        subject: 'Mathematics',
        students: 35,
        schedule: 'Mon, Wed, Fri - 9:00 AM'
      },
      {
        id: '2', 
        class: 'Grade 10-B',
        subject: 'Mathematics',
        students: 32,
        schedule: 'Tue, Thu - 10:00 AM'
      },
      {
        id: '3',
        class: 'Grade 9-A',
        subject: 'Physics',
        students: 28,
        schedule: 'Mon, Wed - 2:00 PM'
      }
    ];

    res.status(200).json({
      success: true,
      message: 'Classes fetched successfully',
      classes: mockClasses
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch classes',
      error: error.message
    });
  }
});

// =====================================================
// GET /api/teacher-dashboard/attendance
// Get attendance data
// =====================================================
router.get('/attendance', authenticateTeacher, async (req, res) => {
  try {
    const mockAttendanceData = {
      stats: {
        overallAttendance: 87,
        todayPresent: 156,
        classesToday: 4,
        averageClassSize: 32
      },
      records: [
        {
          id: '1',
          date: '2025-09-24',
          class: 'Grade 10-A',
          section: 'A',
          subject: 'Mathematics',
          totalStudents: 35,
          presentCount: 32,
          absentCount: 2,
          lateCount: 1
        },
        {
          id: '2',
          date: '2025-09-24',
          class: 'Grade 10-B',
          section: 'B', 
          subject: 'Mathematics',
          totalStudents: 32,
          presentCount: 29,
          absentCount: 3,
          lateCount: 0
        }
      ]
    };

    res.status(200).json({
      success: true,
      message: 'Attendance data fetched successfully',
      data: mockAttendanceData
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance data',
      error: error.message
    });
  }
});

// =====================================================
// POST /api/teacher-dashboard/attendance
// Mark attendance for students
// =====================================================
router.post('/attendance', authenticateTeacher, async (req, res) => {
  try {
    const { class: className, section, date, students } = req.body;
    
    // Mock save attendance
    console.log('Saving attendance:', { className, section, date, students });
    
    res.status(200).json({
      success: true,
      message: 'Attendance marked successfully',
      data: {
        class: className,
        section: section,
        date: date,
        studentsMarked: students?.length || 0
      }
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark attendance',
      error: error.message
    });
  }
});

// =====================================================
// GET /api/teacher-dashboard/homework
// Get homework assignments
// =====================================================
router.get('/homework', authenticateTeacher, async (req, res) => {
  try {
    const mockHomework = [
      {
        id: '1',
        title: 'Algebra Practice Set 1',
        subject: 'Mathematics',
        class: 'Grade 10-A',
        section: 'A',
        assignedDate: '2025-09-20',
        dueDate: '2025-09-27',
        status: 'active',
        totalStudents: 35,
        submissionCount: 28,
        submissionRate: 80
      },
      {
        id: '2',
        title: 'Physics Numericals Chapter 3',
        subject: 'Physics',
        class: 'Grade 9-A',
        section: 'A',
        assignedDate: '2025-09-22',
        dueDate: '2025-09-29',
        status: 'active',
        totalStudents: 28,
        submissionCount: 15,
        submissionRate: 54
      }
    ];

    res.status(200).json({
      success: true,
      message: 'Homework fetched successfully',
      homework: mockHomework
    });
  } catch (error) {
    console.error('Error fetching homework:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch homework',
      error: error.message
    });
  }
});

// =====================================================
// GET /api/teacher-dashboard/students/:class
// Get students for a specific class
// =====================================================
router.get('/students/:class', authenticateTeacher, async (req, res) => {
  try {
    const className = req.params.class;
    
    // Mock students data
    const mockStudents = [
      {
        id: '1',
        name: 'John Smith',
        rollNumber: 'STD001',
        status: null
      },
      {
        id: '2', 
        name: 'Emily Johnson',
        rollNumber: 'STD002',
        status: null
      },
      {
        id: '3',
        name: 'Michael Brown',
        rollNumber: 'STD003', 
        status: null
      },
      {
        id: '4',
        name: 'Sarah Davis',
        rollNumber: 'STD004',
        status: null
      },
      {
        id: '5',
        name: 'David Wilson',
        rollNumber: 'STD005',
        status: null
      }
    ];

    res.status(200).json({
      success: true,
      message: 'Students fetched successfully',
      students: mockStudents,
      class: className
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
});

// =====================================================
// GET /api/teacher-dashboard/progress
// Get student progress data
// =====================================================
router.get('/progress', authenticateTeacher, async (req, res) => {
  try {
    const mockProgress = [
      {
        id: '1',
        name: 'John Smith',
        rollNumber: 'STD001',
        class: 'Grade 10-A',
        section: 'A',
        gpa: 3.8,
        percentage: 85,
        grade: 'A',
        attendance: 92,
        recentGrade: 'A-',
        totalMarks: 500,
        obtainedMarks: 425
      },
      {
        id: '2',
        name: 'Emily Johnson', 
        rollNumber: 'STD002',
        class: 'Grade 10-A',
        section: 'A',
        gpa: 3.6,
        percentage: 78,
        grade: 'B+',
        attendance: 88,
        recentGrade: 'B+',
        totalMarks: 500,
        obtainedMarks: 390
      }
    ];

    res.status(200).json({
      success: true,
      message: 'Student progress fetched successfully',
      students: mockProgress
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student progress',
      error: error.message
    });
  }
});

module.exports = router;