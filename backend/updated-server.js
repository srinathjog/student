const authenticateToken = require('./middleware/auth');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Route imports
const parentStudentsRoutes = require('./routes/parentStudentsRoutes');
const studentRoutes = require('./routes/studentRoutes');
const adminLoginRoutes = require('./routes/adminLoginRoutes');
const parentLoginRoutes = require('./routes/parentLoginRoutes');
const teacherLoginRoutes = require('./routes/teacherLoginRoutes');  // Teacher authentication routes
const teacherDashboardRoutes = require('./routes/teacherDashboardRoutes');  // Teacher dashboard APIs
const uploadImageRoutes = require('./routes/uploadImageRoutes');
const calendarEventsRoutes = require('./routes/calendarEventsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// Serve uploads folder as static
app.use('/uploads', express.static('uploads'));

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/admin-login', adminLoginRoutes);
app.use('/api/parent-login', parentLoginRoutes);
app.use('/api/teacher-login', teacherLoginRoutes);  // Teacher authentication routes
app.use('/api/teacher-dashboard', teacherDashboardRoutes);  // Teacher dashboard APIs
app.use('/api/upload-image', uploadImageRoutes);
app.use('/api/calendar-events', calendarEventsRoutes);
app.use('/api/parent-students', parentStudentsRoutes);

app.get('/ping', (req, res) => res.send('pong'));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));