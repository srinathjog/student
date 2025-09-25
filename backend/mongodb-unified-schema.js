// =====================================================
// UNIFIED SCHOOL ERP DATABASE SCHEMA
// MongoDB Collections Structure
// Bridging Existing Data with Teacher Module
// =====================================================

// =====================================================
// EXISTING COLLECTIONS (Your Current Structure)
// =====================================================

// Collection: school-admin
{
  "_id": ObjectId,
  "username": String,
  "password": String, // hashed
  "email": String,
  "name": String,
  "role": "admin",
  "permissions": [String],
  "isActive": Boolean,
  "createdAt": Date,
  "updatedAt": Date
}

// Collection: parents
{
  "_id": ObjectId,
  "username": String,
  "password": String, // hashed
  "email": String,
  "name": String,
  "phone": String,
  "address": String,
  "children": [ObjectId], // References to students
  "isActive": Boolean,
  "createdAt": Date,
  "updatedAt": Date
}

// Collection: students
{
  "_id": ObjectId,
  "studentId": String, // Unique student identifier
  "name": String,
  "age": Number,
  "dateOfBirth": Date,
  "grade": String, // "Grade 10", "Grade 9"
  "section": String, // "A", "B", "C"
  "class": String, // Combined "Grade 10-A"
  "rollNumber": String,
  "parentId": ObjectId, // Reference to parent
  "admissionDate": Date,
  "profilePhoto": String,
  "isActive": Boolean,
  "createdAt": Date,
  "updatedAt": Date
}

// Collection: events
{
  "_id": ObjectId,
  "title": String,
  "description": String,
  "eventDate": Date,
  "eventType": String, // "academic", "sports", "cultural", "holiday"
  "targetAudience": String, // "all", "grade-specific", "class-specific"
  "targetGrades": [String], // If grade-specific
  "targetClasses": [String], // If class-specific
  "isActive": Boolean,
  "createdBy": ObjectId, // Admin/Teacher who created
  "createdAt": Date,
  "updatedAt": Date
}

// =====================================================
// NEW COLLECTIONS FOR TEACHER MODULE
// =====================================================

// Collection: teachers
{
  "_id": ObjectId,
  "teacherId": String, // Unique teacher identifier (TCH001)
  "username": String,
  "password": String, // hashed
  "email": String,
  "name": String,
  "phone": String,
  "department": String, // "Mathematics", "English", "Science"
  "designation": String, // "Senior Teacher", "Teacher", "Head Teacher"
  "subjects": [String], // ["Mathematics", "Physics"]
  "qualifications": [String],
  "experience": Number, // Years of experience
  "joinDate": Date,
  "profilePhoto": String,
  "isActive": Boolean,
  "createdAt": Date,
  "updatedAt": Date
}

// Collection: classes
{
  "_id": ObjectId,
  "className": String, // "Grade 10-A"
  "grade": String, // "Grade 10"
  "section": String, // "A"
  "classTeacher": ObjectId, // Reference to teacher
  "subjects": [{
    "subjectName": String,
    "teacherId": ObjectId,
    "periodsPerWeek": Number
  }],
  "maxStudents": Number,
  "currentStrength": Number,
  "academicYear": String, // "2024-25"
  "isActive": Boolean,
  "createdAt": Date,
  "updatedAt": Date
}

// Collection: subjects
{
  "_id": ObjectId,
  "subjectName": String,
  "subjectCode": String, // "MATH", "ENG", "SCI"
  "department": String,
  "isOptional": Boolean,
  "grades": [String], // Which grades this subject is taught
  "isActive": Boolean,
  "createdAt": Date
}

// Collection: teacher_class_assignments
{
  "_id": ObjectId,
  "teacherId": ObjectId,
  "classId": ObjectId,
  "subjectId": ObjectId,
  "isClassTeacher": Boolean,
  "academicYear": String,
  "assignedDate": Date,
  "isActive": Boolean,
  "createdAt": Date
}

// =====================================================
// TEACHER FUNCTIONALITY COLLECTIONS
// =====================================================

// Collection: attendance
{
  "_id": ObjectId,
  "classId": ObjectId,
  "teacherId": ObjectId,
  "subjectId": ObjectId,
  "attendanceDate": Date,
  "period": Number, // 1, 2, 3, etc.
  "students": [{
    "studentId": ObjectId,
    "status": String, // "present", "absent", "late", "excused"
    "arrivalTime": Date,
    "remarks": String
  }],
  "totalStudents": Number,
  "presentCount": Number,
  "absentCount": Number,
  "status": String, // "draft", "finalized"
  "createdAt": Date,
  "updatedAt": Date
}

// Collection: homework
{
  "_id": ObjectId,
  "teacherId": ObjectId,
  "classId": ObjectId,
  "subjectId": ObjectId,
  "title": String,
  "description": String,
  "instructions": String,
  "assignedDate": Date,
  "dueDate": Date,
  "attachments": [String], // File URLs
  "maxMarks": Number,
  "difficultyLevel": String, // "easy", "medium", "hard"
  "status": String, // "active", "completed", "cancelled"
  "submissions": [{
    "studentId": ObjectId,
    "submissionDate": Date,
    "submissionText": String,
    "attachments": [String],
    "status": String, // "pending", "submitted", "late", "graded"
    "marksObtained": Number,
    "grade": String, // "A+", "A", "B+"
    "feedback": String,
    "gradedBy": ObjectId,
    "gradedAt": Date
  }],
  "createdAt": Date,
  "updatedAt": Date
}

// Collection: assessments
{
  "_id": ObjectId,
  "teacherId": ObjectId,
  "classId": ObjectId,
  "subjectId": ObjectId,
  "title": String,
  "description": String,
  "assessmentType": String, // "test", "quiz", "project", "assignment"
  "scheduledDate": Date,
  "duration": Number, // Minutes
  "maxMarks": Number,
  "passingMarks": Number,
  "status": String, // "scheduled", "ongoing", "completed", "cancelled"
  "results": [{
    "studentId": ObjectId,
    "marksObtained": Number,
    "grade": String,
    "percentage": Number,
    "rank": Number,
    "isAbsent": Boolean,
    "remarks": String
  }],
  "createdAt": Date,
  "updatedAt": Date
}

// Collection: grades
{
  "_id": ObjectId,
  "studentId": ObjectId,
  "classId": ObjectId,
  "subjectId": ObjectId,
  "academicYear": String,
  "term": String, // "Term 1", "Term 2", "Final"
  "assessments": [{
    "assessmentId": ObjectId,
    "marksObtained": Number,
    "maxMarks": Number,
    "weightage": Number
  }],
  "totalMarks": Number,
  "marksObtained": Number,
  "percentage": Number,
  "grade": String, // "A+", "A", "B+"
  "rank": Number,
  "remarks": String,
  "createdAt": Date,
  "updatedAt": Date
}

// Collection: messages
{
  "_id": ObjectId,
  "senderId": ObjectId,
  "senderType": String, // "teacher", "parent", "admin"
  "recipientId": ObjectId,
  "recipientType": String, // "teacher", "parent", "admin", "class"
  "subject": String,
  "messageBody": String,
  "messageType": String, // "general", "urgent", "announcement"
  "isRead": Boolean,
  "readAt": Date,
  "classId": ObjectId, // Optional: if message is class-specific
  "studentId": ObjectId, // Optional: if message is student-specific
  "createdAt": Date
}

// Collection: notifications
{
  "_id": ObjectId,
  "recipientId": ObjectId,
  "recipientType": String, // "teacher", "parent", "student"
  "title": String,
  "message": String,
  "notificationType": String, // "homework_due", "attendance_low", "grade_updated"
  "relatedId": ObjectId, // ID of related homework, attendance, etc.
  "relatedType": String, // "homework", "attendance", "grade"
  "priority": String, // "low", "normal", "high", "urgent"
  "isRead": Boolean,
  "readAt": Date,
  "scheduledAt": Date,
  "sentAt": Date,
  "createdAt": Date
}

// Collection: timetable
{
  "_id": ObjectId,
  "classId": ObjectId,
  "academicYear": String,
  "schedule": [{
    "day": String, // "Monday", "Tuesday", etc.
    "periods": [{
      "periodNumber": Number,
      "startTime": String, // "09:00"
      "endTime": String, // "09:45"
      "subjectId": ObjectId,
      "teacherId": ObjectId,
      "roomNumber": String,
      "isBreak": Boolean
    }]
  }],
  "effectiveFrom": Date,
  "effectiveTo": Date,
  "isActive": Boolean,
  "createdAt": Date,
  "updatedAt": Date
}

// =====================================================
// SYSTEM COLLECTIONS
// =====================================================

// Collection: sessions
{
  "_id": ObjectId,
  "userId": ObjectId,
  "userType": String, // "admin", "teacher", "parent"
  "sessionToken": String,
  "refreshToken": String,
  "ipAddress": String,
  "userAgent": String,
  "expiresAt": Date,
  "isActive": Boolean,
  "createdAt": Date,
  "lastActivity": Date
}

// Collection: activity_logs
{
  "_id": ObjectId,
  "userId": ObjectId,
  "userType": String,
  "action": String, // "login", "create_homework", "mark_attendance"
  "entityType": String, // "homework", "attendance", "student"
  "entityId": ObjectId,
  "ipAddress": String,
  "userAgent": String,
  "metadata": Object, // Additional action-specific data
  "createdAt": Date
}

// Collection: file_uploads
{
  "_id": ObjectId,
  "uploadedBy": ObjectId,
  "uploadedByType": String, // "teacher", "parent", "admin"
  "originalFilename": String,
  "storedFilename": String,
  "filePath": String,
  "fileSize": Number,
  "mimeType": String,
  "entityType": String, // "homework", "profile", "announcement"
  "entityId": ObjectId,
  "isActive": Boolean,
  "createdAt": Date
}

// =====================================================
// INDEXES FOR PERFORMANCE
// =====================================================

// Teachers
db.teachers.createIndex({ "teacherId": 1 }, { unique: true })
db.teachers.createIndex({ "email": 1 }, { unique: true })
db.teachers.createIndex({ "username": 1 }, { unique: true })
db.teachers.createIndex({ "isActive": 1 })

// Students (enhance existing)
db.students.createIndex({ "studentId": 1 }, { unique: true })
db.students.createIndex({ "parentId": 1 })
db.students.createIndex({ "class": 1 })
db.students.createIndex({ "grade": 1, "section": 1 })

// Classes
db.classes.createIndex({ "className": 1 }, { unique: true })
db.classes.createIndex({ "grade": 1, "section": 1 })
db.classes.createIndex({ "classTeacher": 1 })

// Attendance
db.attendance.createIndex({ "classId": 1, "attendanceDate": 1 })
db.attendance.createIndex({ "teacherId": 1, "attendanceDate": 1 })
db.attendance.createIndex({ "students.studentId": 1 })

// Homework
db.homework.createIndex({ "teacherId": 1, "dueDate": 1 })
db.homework.createIndex({ "classId": 1, "status": 1 })
db.homework.createIndex({ "submissions.studentId": 1 })

// Messages
db.messages.createIndex({ "recipientId": 1, "recipientType": 1, "isRead": 1 })
db.messages.createIndex({ "senderId": 1, "senderType": 1 })
db.messages.createIndex({ "createdAt": -1 })

// Notifications
db.notifications.createIndex({ "recipientId": 1, "recipientType": 1, "isRead": 1 })
db.notifications.createIndex({ "createdAt": -1 })