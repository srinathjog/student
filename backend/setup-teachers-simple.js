const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected for teacher setup");
    setupTeachers();
  })
  .catch(err => console.error('Connection error:', err));

// Teacher Schema (same as your model)
const teacherSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  employeeId: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  subjects: [{ type: String }],
  classes: [{ className: String, section: String, subject: String }],
  phone: { type: String },
  address: { type: String },
  qualification: { type: String },
  experience: { type: Number, default: 0 },
  joiningDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { collection: 'teachers', timestamps: true });

const Teacher = mongoose.model('Teacher', teacherSchema);

async function setupTeachers() {
  try {
    // Clear existing teachers (optional)
    // await Teacher.deleteMany({});
    
    // Check if teachers already exist
    const existingCount = await Teacher.countDocuments();
    if (existingCount > 0) {
      console.log(`${existingCount} teachers already exist in database`);
      process.exit(0);
    }
    
    // Sample teacher data
    const sampleTeachers = [
      {
        username: 'teacher1',
        password: 'password123',
        fullName: 'Sarah Johnson',
        email: 'sarah.johnson@school.com',
        employeeId: 'EMP001',
        department: 'Mathematics',
        subjects: ['Mathematics', 'Algebra'],
        classes: [
          { className: 'Class 10', section: 'A', subject: 'Mathematics' },
          { className: 'Class 9', section: 'B', subject: 'Algebra' }
        ],
        phone: '9876543210',
        qualification: 'M.Sc Mathematics',
        experience: 5
      },
      {
        username: 'teacher2', 
        password: 'password123',
        fullName: 'Michael Brown',
        email: 'michael.brown@school.com',
        employeeId: 'EMP002',
        department: 'English',
        subjects: ['English Literature', 'Grammar'],
        classes: [
          { className: 'Class 8', section: 'A', subject: 'English' },
          { className: 'Class 7', section: 'C', subject: 'English Literature' }
        ],
        phone: '9876543211',
        qualification: 'M.A English',
        experience: 8
      },
      {
        username: 'demo',
        password: 'demo123',
        fullName: 'Demo Teacher',
        email: 'demo@school.com',
        employeeId: 'DEMO001',
        department: 'Computer Science',
        subjects: ['Computer Science', 'Programming'],
        classes: [
          { className: 'Class 12', section: 'A', subject: 'Computer Science' }
        ],
        phone: '9999999999',
        qualification: 'B.Tech Computer Science',
        experience: 3
      }
    ];
    
    // Insert sample teachers
    await Teacher.insertMany(sampleTeachers);
    console.log('✅ Sample teachers created successfully!');
    
    console.log('\n📚 Demo Login Credentials:');
    console.log('Username: demo');
    console.log('Password: demo123');
    console.log('\nOther teachers:');
    console.log('Username: teacher1, Password: password123');
    console.log('Username: teacher2, Password: password123');
    
  } catch (error) {
    console.error('❌ Error setting up teachers:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run if called directly
if (require.main === module) {
  setupTeachers();
}