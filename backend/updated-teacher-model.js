const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  subjects: [{
    type: String
  }],
  classes: [{
    className: String,
    section: String,
    subject: String
  }],
  phone: {
    type: String
  },
  address: {
    type: String
  },
  qualification: {
    type: String
  },
  experience: {
    type: Number,
    default: 0
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  collection: 'teachers',
  timestamps: true 
});

// Create indexes for better performance
teacherSchema.index({ username: 1 });
teacherSchema.index({ email: 1 });
teacherSchema.index({ employeeId: 1 });

module.exports = mongoose.model('Teacher', teacherSchema);