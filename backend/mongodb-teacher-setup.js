// =====================================================
// MongoDB Setup Script for Teacher Authentication
// Run this script to add sample teacher data
// =====================================================

// Run this in MongoDB shell or create a setup script for your backend

// 1. Create teacher collection if it doesn't exist
db.createCollection("teachers");

// 2. Add indexes for performance
db.teachers.createIndex({ "teacherId": 1 }, { unique: true });
db.teachers.createIndex({ "email": 1 }, { unique: true });
db.teachers.createIndex({ "username": 1 }, { unique: true });
db.teachers.createIndex({ "isActive": 1 });

// 3. Insert sample teacher data
// Note: You'll need to hash the password using bcrypt in your backend
// For now, this is just the structure

// Sample Teacher 1 - Mathematics
db.teachers.insertOne({
  "teacherId": "TCH001",
  "username": "rajesh.kumar",
  "password": "$2a$10$N9qo8uLOickgx2ZMRZoMye.Uo4K8xGvb7i7vWq6LyZyoVjlNDbTWC", // "teacher123" hashed
  "email": "rajesh.kumar@greenwood.edu",
  "name": "Rajesh Kumar",
  "phone": "+91-9876543210",
  "department": "Mathematics",
  "designation": "Senior Teacher",
  "subjects": ["Mathematics", "Statistics"],
  "qualifications": ["M.Sc Mathematics", "B.Ed"],
  "experience": 8,
  "joinDate": new Date("2020-06-15"),
  "assignedClasses": ["Grade 10-A", "Grade 9-A"], // Using your existing class format
  "isActive": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
});

// Sample Teacher 2 - English
db.teachers.insertOne({
  "teacherId": "TCH002",
  "username": "priya.sharma",
  "password": "$2a$10$N9qo8uLOickgx2ZMRZoMye.Uo4K8xGvb7i7vWq6LyZyoVjlNDbTWC", // "teacher123" hashed
  "email": "priya.sharma@greenwood.edu",
  "name": "Priya Sharma",
  "phone": "+91-9876543211",
  "department": "English",
  "designation": "Teacher",
  "subjects": ["English Literature", "English Grammar"],
  "qualifications": ["M.A English Literature", "B.Ed"],
  "experience": 5,
  "joinDate": new Date("2021-04-10"),
  "assignedClasses": ["Grade 10-B", "Grade 9-B"],
  "isActive": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
});

// Sample Teacher 3 - Science
db.teachers.insertOne({
  "teacherId": "TCH003",
  "username": "amit.singh",
  "password": "$2a$10$N9qo8uLOickgx2ZMRZoMye.Uo4K8xGvb7i7vWq6LyZyoVjlNDbTWC", // "teacher123" hashed
  "email": "amit.singh@greenwood.edu",
  "name": "Amit Singh",
  "phone": "+91-9876543212",
  "department": "Science",
  "designation": "Head Teacher",
  "subjects": ["Physics", "Chemistry"],
  "qualifications": ["M.Sc Physics", "B.Ed", "Ph.D Physics"],
  "experience": 12,
  "joinDate": new Date("2018-03-20"),
  "assignedClasses": ["Grade 10-A", "Grade 10-B"],
  "isActive": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
});

// 4. Verify the data was inserted
print("Teachers inserted:");
db.teachers.find({}, {"name": 1, "teacherId": 1, "department": 1, "assignedClasses": 1});

// 5. Test login credentials:
// Username: rajesh.kumar or rajesh.kumar@greenwood.edu
// Password: teacher123

// 6. Update existing students collection to make sure class field matches
// This ensures teacher-student relationships work
print("Current student classes:");
db.students.distinct("class");

// If you need to update student class format to match teacher assignments:
// db.students.updateMany(
//   { "grade": "Grade 10", "section": "A" },
//   { $set: { "class": "Grade 10-A" } }
// );

print("Setup complete! You can now test teacher authentication.");