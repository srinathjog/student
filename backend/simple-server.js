const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
ap  res.json(responseData);
});

// Mark attendance endpoint
app.post('/api/teacher-dashboard/attendance/mark', (req, res) => {
  console.log('API call received: POST /api/teacher-dashboard/attendance/mark');
  console.log('Attendance data:', JSON.stringify(req.body, null, 2));
  
  const attendanceData = req.body;
  
  // Validate required fields
  if (!attendanceData.class || !attendanceData.section || !attendanceData.date || !attendanceData.attendanceData) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: class, section, date, or attendanceData'
    });
  }
  
  // Process attendance data
  const { class: className, section, subject, date, period, attendanceData: students } = attendanceData;
  
  // Calculate statistics
  const presentCount = students.filter(s => s.status === 'present').length;
  const absentCount = students.filter(s => s.status === 'absent').length;
  const lateCount = students.filter(s => s.status === 'late').length;
  const totalStudents = students.length;
  
  // In a real application, this data would be saved to the database
  // For now, we'll just simulate a successful save
  const attendanceRecord = {
    id: 'ATT_' + Date.now(),
    date: date,
    class: className,
    section: section,
    subject: subject || 'General',
    period: period || 1,
    totalStudents: totalStudents,
    presentCount: presentCount,
    absentCount: absentCount,
    lateCount: lateCount,
    attendanceData: students,
    createdAt: new Date().toISOString(),
    teacherId: 'teacher_001' // This would come from auth token
  };
  
  console.log('Processed attendance record:', attendanceRecord);
  
  // Simulate successful save
  const response = {
    success: true,
    message: 'Attendance marked successfully',
    recordId: attendanceRecord.id,
    statistics: {
      totalStudents: totalStudents,
      presentCount: presentCount,
      absentCount: absentCount,
      lateCount: lateCount,
      attendancePercentage: Math.round((presentCount + lateCount) / totalStudents * 100)
    }
  };
  
  console.log('Mark attendance response:', JSON.stringify(response, null, 2));
  res.json(response);
});

// Teacher login endpoint
app.post('/api/teacher/teacher-login', (req, res) => {(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// The specific route that's failing
app.get('/api/teacher-dashboard/attendance/classes', (req, res) => {
  console.log('API call received: GET /api/teacher-dashboard/attendance/classes');
  
  const responseData = {
    success: true,
    classes: [
      { 
        id: '1', 
        class: 'Grade 10-A', 
        subject: 'Mathematics', 
        students: 35,
        section: 'A',
        grade: 'Grade 10',
        schedule: 'Mon, Wed, Fri - 9:00 AM'
      },
      { 
        id: '2', 
        class: 'Grade 10-B', 
        subject: 'Mathematics', 
        students: 32,
        section: 'B', 
        grade: 'Grade 10',
        schedule: 'Tue, Thu - 10:00 AM'
      },
      { 
        id: '3', 
        class: 'Grade 9-A', 
        subject: 'Physics', 
        students: 30,
        section: 'A',
        grade: 'Grade 9', 
        schedule: 'Mon, Wed, Fri - 11:00 AM'
      }
    ],
    message: 'Classes retrieved successfully'
  };
  
  console.log('Sending response:', JSON.stringify(responseData, null, 2));
  res.json(responseData);
});

// Get students for a specific class
app.get('/api/teacher-dashboard/students/:class', (req, res) => {
  const classParam = req.params.class;
  console.log('API call received: GET /api/teacher-dashboard/students/' + classParam);
  
  const mockStudents = [
    { id: 1, name: 'Aarav Singh', rollNumber: '10A01', status: 'present' },
    { id: 2, name: 'Vivaan Sharma', rollNumber: '10A02', status: 'present' },
    { id: 3, name: 'Aditya Patel', rollNumber: '10A03', status: 'absent' },
    { id: 4, name: 'Vihaan Kumar', rollNumber: '10A04', status: 'present' },
    { id: 5, name: 'Arjun Reddy', rollNumber: '10A05', status: 'late' }
  ];
  
  const responseData = {
    success: true,
    students: mockStudents,
    class: classParam,
    message: 'Students retrieved successfully'
  };
  
  console.log('Students response:', JSON.stringify(responseData, null, 2));
  res.json(responseData);
});

// Get students for attendance (with class and section)
app.get('/api/teacher-dashboard/attendance/students/:className/:section', (req, res) => {
  const className = req.params.className;
  const section = req.params.section;
  console.log(`API call received: GET /api/teacher-dashboard/attendance/students/${className}/${section}`);
  
  // Mock students data based on class and section
  const mockStudentsByClass = {
    'Grade 10-A': [
      { id: 'STU001', name: 'Aarav Singh', rollNumber: '001', status: null },
      { id: 'STU002', name: 'Vivaan Sharma', rollNumber: '002', status: null },
      { id: 'STU003', name: 'Aditya Patel', rollNumber: '003', status: null },
      { id: 'STU004', name: 'Vihaan Kumar', rollNumber: '004', status: null },
      { id: 'STU005', name: 'Arjun Reddy', rollNumber: '005', status: null },
      { id: 'STU006', name: 'Sai Prasad', rollNumber: '006', status: null },
      { id: 'STU007', name: 'Rohan Gupta', rollNumber: '007', status: null },
      { id: 'STU008', name: 'Krishna Iyer', rollNumber: '008', status: null }
    ],
    'Grade 10-B': [
      { id: 'STU021', name: 'Ananya Mehta', rollNumber: '001', status: null },
      { id: 'STU022', name: 'Diya Joshi', rollNumber: '002', status: null },
      { id: 'STU023', name: 'Ishaan Nair', rollNumber: '003', status: null },
      { id: 'STU024', name: 'Kavya Rao', rollNumber: '004', status: null },
      { id: 'STU025', name: 'Aryan Shah', rollNumber: '005', status: null },
      { id: 'STU026', name: 'Priya Desai', rollNumber: '006', status: null }
    ],
    'Grade 9-A': [
      { id: 'STU041', name: 'Advik Agarwal', rollNumber: '001', status: null },
      { id: 'STU042', name: 'Saanvi Kapoor', rollNumber: '002', status: null },
      { id: 'STU043', name: 'Reyansh Jain', rollNumber: '003', status: null },
      { id: 'STU044', name: 'Myra Sinha', rollNumber: '004', status: null },
      { id: 'STU045', name: 'Kiaan Malhotra', rollNumber: '005', status: null }
    ]
  };
  
  const students = mockStudentsByClass[className] || [];
  
  const responseData = {
    success: true,
    students: students,
    class: className,
    section: section,
    message: 'Students retrieved successfully for attendance'
  };
  
  console.log('Attendance Students response:', JSON.stringify(responseData, null, 2));
  res.json(responseData);
});

// Get attendance statistics
app.get('/api/teacher-dashboard/attendance/stats', (req, res) => {
  console.log('API call received: GET /api/teacher-dashboard/attendance/stats');
  
  const statsData = {
    success: true,
    stats: {
      overallAttendance: 92,
      todayPresent: 28,
      totalClasses: 3,
      averageClassSize: 32,
      weeklyAttendance: [
        { day: 'Mon', attendance: 95 },
        { day: 'Tue', attendance: 90 },
        { day: 'Wed', attendance: 88 },
        { day: 'Thu', attendance: 92 },
        { day: 'Fri', attendance: 94 }
      ]
    },
    message: 'Attendance statistics retrieved successfully'
  };
  
  console.log('Stats response:', JSON.stringify(statsData, null, 2));
  res.json(statsData);
});

// Teacher login endpoint
app.post('/api/teacher/teacher-login', (req, res) => {
  console.log('Teacher login attempt:', req.body);
  
  const { username, password } = req.body;
  
  // Mock teacher data - in real app this would check database
  const mockTeacher = {
    id: 'teacher_001',
    username: 'teacher1',
    name: 'John Smith',
    email: 'john.smith@school.com',
    subjects: ['Mathematics', 'Physics'],
    classes: ['Grade 10-A', 'Grade 10-B', 'Grade 9-A']
  };
  
  // Simple validation - in real app this would validate against database
  if (username && password) {
    const response = {
      success: true,
      message: 'Login successful',
      token: 'mock-jwt-token-' + Date.now(),
      teacher: mockTeacher
    };
    
    console.log('Teacher login successful:', response);
    res.json(response);
  } else {
    console.log('Teacher login failed: Invalid credentials');
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Attendance records endpoint
app.get('/api/teacher-dashboard/attendance/records', (req, res) => {
  console.log('API call received: GET /api/teacher-dashboard/attendance/records');
  console.log('Query params:', req.query);
  
  const limit = parseInt(req.query.limit) || 10;
  const classFilter = req.query.class;
  const subject = req.query.subject;
  
  // Mock aggregated attendance records (class-level, not individual student records)
  const mockAttendanceRecords = [
    {
      id: 'ATT001',
      date: '2025-09-25',
      class: 'Grade 10-A',
      section: 'A',
      subject: 'Mathematics',
      totalStudents: 35,
      presentCount: 32,
      absentCount: 2,
      lateCount: 1
    },
    {
      id: 'ATT002',
      date: '2025-09-24',
      class: 'Grade 10-A',
      section: 'A',
      subject: 'Mathematics',
      totalStudents: 35,
      presentCount: 33,
      absentCount: 1,
      lateCount: 1
    },
    {
      id: 'ATT003',
      date: '2025-09-25',
      class: 'Grade 10-B',
      section: 'B',
      subject: 'Mathematics',
      totalStudents: 32,
      presentCount: 30,
      absentCount: 2,
      lateCount: 0
    },
    {
      id: 'ATT004',
      date: '2025-09-24',
      class: 'Grade 10-B',
      section: 'B',
      subject: 'Mathematics',
      totalStudents: 32,
      presentCount: 31,
      absentCount: 1,
      lateCount: 0
    },
    {
      id: 'ATT005',
      date: '2025-09-25',
      class: 'Grade 9-A',
      section: 'A',
      subject: 'Physics',
      totalStudents: 30,
      presentCount: 28,
      absentCount: 1,
      lateCount: 1
    },
    {
      id: 'ATT006',
      date: '2025-09-23',
      class: 'Grade 10-A',
      section: 'A',
      subject: 'Mathematics',
      totalStudents: 35,
      presentCount: 34,
      absentCount: 1,
      lateCount: 0
    },
    {
      id: 'ATT007',
      date: '2025-09-23',
      class: 'Grade 10-B',
      section: 'B',
      subject: 'Mathematics',
      totalStudents: 32,
      presentCount: 29,
      absentCount: 3,
      lateCount: 0
    },
    {
      id: 'ATT008',
      date: '2025-09-22',
      class: 'Grade 9-A',
      section: 'A',
      subject: 'Physics',
      totalStudents: 30,
      presentCount: 27,
      absentCount: 2,
      lateCount: 1
    }
  ];
  
  // Filter records based on query parameters
  let filteredRecords = mockAttendanceRecords;
  
  if (classFilter) {
    filteredRecords = filteredRecords.filter(record => 
      record.class.toLowerCase().includes(classFilter.toLowerCase())
    );
  }
  
  if (subject) {
    filteredRecords = filteredRecords.filter(record => 
      record.subject.toLowerCase().includes(subject.toLowerCase())
    );
  }
  
  // Sort by date (most recent first)
  filteredRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Apply limit
  const limitedRecords = filteredRecords.slice(0, limit);
  
  const responseData = {
    success: true,
    records: limitedRecords,
    total: filteredRecords.length,
    limit: limit,
    message: 'Attendance records retrieved successfully'
  };
  
  console.log('Records response:', JSON.stringify(responseData, null, 2));
  res.json(responseData);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Simple server running on port ${PORT}`);
});