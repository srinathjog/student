// ...existing code...
const authenticateToken = require('./middleware/auth');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
// Import existing routes
const adminLoginRoutes = require('./backend-adminLoginRoutes');
const teacherRoutes = require('./backend-teacher-routes');
const teacherDashboardRoutes = require('./backend-teacher-dashboard-routes');

// Comment out non-existent routes for now
// const parentStudentsRoutes = require('./routes/parentStudentsRoutes');
// const studentRoutes = require('./routes/studentRoutes');
// const parentLoginRoutes = require('./routes/parentLoginRoutes');
// const uploadImageRoutes = require('./routes/uploadImageRoutes');
// const calendarEventsRoutes = require('./routes/calendarEventsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// Serve uploads folder as static
app.use('/uploads', express.static('uploads'));

// DB Connection
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/school_management';
mongoose.connect(mongoUri)
  .then(() => console.log(`MongoDB connected to: ${mongoUri}`))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Make sure MongoDB is running or update MONGO_URI in .env file');
  });

  app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working!' });
});



// Routes
app.use('/api/admin-login', adminLoginRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/teacher-dashboard', teacherDashboardRoutes);

// Comment out non-existent routes
// app.use('/api/students', studentRoutes);
// app.use('/api/parent-login', parentLoginRoutes);
// app.use('/api/upload-image', uploadImageRoutes);
// app.use('/api/calendar-events', calendarEventsRoutes);
// app.use('/api/parent-students', parentStudentsRoutes);

app.get('/ping', (req, res) => res.send('pong'));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// filepath: c:\Users\SS736LT\school\backend\server.js
// ...existing code...

// ...existing code...