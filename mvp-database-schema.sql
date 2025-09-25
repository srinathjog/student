-- =====================================================
-- MINIMAL TEACHER DASHBOARD SCHEMA (MVP)
-- Start with core tables only
-- =====================================================

-- Schools (Multi-tenancy)
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teachers (Authentication & Profile)
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id),
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grades
CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id),
    name VARCHAR(50) NOT NULL,
    level INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Classes
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id),
    grade_id UUID NOT NULL REFERENCES grades(id),
    section VARCHAR(10) NOT NULL,
    max_students INTEGER DEFAULT 50,
    class_teacher_id UUID REFERENCES teachers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students (Basic info)
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id),
    student_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    class_id UUID REFERENCES classes(id),
    roll_number VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teacher Class Assignments
CREATE TABLE teacher_class_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    class_id UUID NOT NULL REFERENCES classes(id),
    subject_id UUID NOT NULL REFERENCES subjects(id),
    is_class_teacher BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(teacher_id, class_id, subject_id)
);

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample school
INSERT INTO schools (id, name) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Greenwood High School');

-- Insert sample grades
INSERT INTO grades (school_id, name, level) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Grade 10', 10),
('550e8400-e29b-41d4-a716-446655440000', 'Grade 9', 9);

-- Insert sample subjects
INSERT INTO subjects (school_id, name, code) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Mathematics', 'MATH'),
('550e8400-e29b-41d4-a716-446655440000', 'English', 'ENG');

-- Insert sample teacher (password: 'teacher123')
INSERT INTO teachers (
    school_id, employee_id, email, password_hash, 
    first_name, last_name, phone, department
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'TCH001',
    'rajesh.kumar@greenwood.edu',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye.Uo4K8xGvb7i7vWq6LyZyoVjlNDbTWC', -- bcrypt hash
    'Rajesh',
    'Kumar', 
    '+91-9876543210',
    'Mathematics'
);

-- Insert sample class
INSERT INTO classes (school_id, grade_id, section, class_teacher_id) 
SELECT 
    '550e8400-e29b-41d4-a716-446655440000',
    g.id,
    'A',
    t.id
FROM grades g, teachers t 
WHERE g.name = 'Grade 10' AND t.employee_id = 'TCH001'
LIMIT 1;

-- Insert sample students
INSERT INTO students (school_id, student_id, first_name, last_name, class_id, roll_number)
SELECT 
    '550e8400-e29b-41d4-a716-446655440000',
    'STU' || LPAD(generate_series::text, 3, '0'),
    'Student' || generate_series,
    'Name' || generate_series,
    c.id,
    LPAD(generate_series::text, 2, '0')
FROM generate_series(1, 25), classes c
WHERE c.section = 'A'
LIMIT 25;

-- Assign teacher to class
INSERT INTO teacher_class_assignments (teacher_id, class_id, subject_id, is_class_teacher)
SELECT 
    t.id,
    c.id,
    s.id,
    true
FROM teachers t, classes c, subjects s
WHERE t.employee_id = 'TCH001' 
  AND c.section = 'A'
  AND s.code = 'MATH';

-- =====================================================
-- BASIC INDEXES
-- =====================================================

CREATE INDEX idx_teachers_school_id ON teachers(school_id);
CREATE INDEX idx_teachers_email ON teachers(email);
CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_classes_school_id ON classes(school_id);
CREATE INDEX idx_teacher_assignments_teacher ON teacher_class_assignments(teacher_id);