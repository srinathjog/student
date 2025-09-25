// =====================================================
// Teacher Model for MongoDB (Mongoose)
// Add this to your existing backend server
// File: models/Teacher.js
// =====================================================

const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  teacherId: { 
    type: String, 
    unique: true, 
    required: true 
  },
  username: { 
    type: String, 
    unique: true, 
    required: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    unique: true, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  phone: String,
  department: String,
  designation: String,
  subjects: [String],
  qualifications: [String],
  experience: { 
    type: Number, 
    default: 0 
  },
  joinDate: Date,
  profilePhoto: String,
  
  // Class assignments (we'll populate this later)
  assignedClasses: [String], // For now, store class names like ["Grade 10-A", "Grade 9-B"]
  
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

// Indexes for performance
teacherSchema.index({ teacherId: 1 });
teacherSchema.index({ email: 1 });
teacherSchema.index({ username: 1 });
teacherSchema.index({ isActive: 1 });

module.exports = mongoose.model('Teacher', teacherSchema);