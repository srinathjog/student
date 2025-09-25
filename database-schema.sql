-- =====================================================
-- Teacher Dashboard Database Schema
-- School Management System - Teacher Module
-- =====================================================

-- =====================================================
-- CORE ENTITIES
-- =====================================================

-- Schools/Institutions
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(255),
    academic_year VARCHAR(10) NOT NULL, -- e.g., "2024-25"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Academic Years
CREATE TABLE academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id),
    year_name VARCHAR(10) NOT NULL, -- e.g., "2024-25"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grades/Standards
CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id),
    name VARCHAR(50) NOT NULL, -- e.g., "Grade 1", "Class X"
    level INTEGER NOT NULL, -- 1, 2, 3... for ordering
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- USER MANAGEMENT
-- =====================================================

-- Teachers
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id),
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    phone VARCHAR(20),
    alternate_phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    gender VARCHAR(10),
    
    -- Professional Information
    department VARCHAR(100),
    designation VARCHAR(100),
    qualification TEXT,
    experience_years INTEGER DEFAULT 0,
    join_date DATE NOT NULL,
    
    -- System Fields
    profile_photo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    email_verified BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teacher Subject Mapping
CREATE TABLE teacher_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    subject_id UUID NOT NULL REFERENCES subjects(id),
    is_primary BOOLEAN DEFAULT FALSE, -- Primary subject specialization
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(teacher_id, subject_id)
);

-- Students
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id),
    student_id VARCHAR(50) UNIQUE NOT NULL,
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    date_of_birth DATE,
    gender VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    
    -- Academic Information
    admission_date DATE NOT NULL,
    roll_number VARCHAR(50),
    
    -- Parent/Guardian Information
    parent_name VARCHAR(200),
    parent_phone VARCHAR(20),
    parent_email VARCHAR(100),
    guardian_name VARCHAR(200),
    guardian_phone VARCHAR(20),
    
    -- System Fields
    profile_photo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CLASS MANAGEMENT
-- =====================================================

-- Classes (Grade + Section combinations)
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id),
    academic_year_id UUID NOT NULL REFERENCES academic_years(id),
    grade_id UUID NOT NULL REFERENCES grades(id),
    
    section VARCHAR(10) NOT NULL, -- A, B, C, etc.
    class_name VARCHAR(100) GENERATED ALWAYS AS (
        (SELECT name FROM grades WHERE id = grade_id) || ' - ' || section
    ) STORED,
    
    max_students INTEGER DEFAULT 50,
    class_teacher_id UUID REFERENCES teachers(id),
    room_number VARCHAR(20),
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(school_id, academic_year_id, grade_id, section)
);

-- Student Class Enrollment
CREATE TABLE student_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id),
    class_id UUID NOT NULL REFERENCES classes(id),
    academic_year_id UUID NOT NULL REFERENCES academic_years(id),
    
    enrollment_date DATE NOT NULL,
    roll_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(student_id, academic_year_id) -- Student can be in only one class per academic year
);

-- Teacher Class Assignments
CREATE TABLE teacher_class_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    class_id UUID NOT NULL REFERENCES classes(id),
    subject_id UUID NOT NULL REFERENCES subjects(id),
    academic_year_id UUID NOT NULL REFERENCES academic_years(id),
    
    is_class_teacher BOOLEAN DEFAULT FALSE,
    assigned_date DATE NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(teacher_id, class_id, subject_id, academic_year_id)
);

-- =====================================================
-- ATTENDANCE MANAGEMENT
-- =====================================================

-- Attendance Records
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id),
    subject_id UUID NOT NULL REFERENCES subjects(id),
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    attendance_date DATE NOT NULL,
    
    period_number INTEGER, -- Which period of the day
    start_time TIME,
    end_time TIME,
    
    total_students INTEGER NOT NULL,
    present_count INTEGER NOT NULL DEFAULT 0,
    absent_count INTEGER NOT NULL DEFAULT 0,
    
    remarks TEXT,
    status VARCHAR(20) DEFAULT 'draft', -- draft, finalized
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(class_id, subject_id, attendance_date, period_number)
);

-- Individual Student Attendance
CREATE TABLE student_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attendance_record_id UUID NOT NULL REFERENCES attendance_records(id),
    student_id UUID NOT NULL REFERENCES students(id),
    
    status VARCHAR(10) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    arrival_time TIME,
    remarks TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(attendance_record_id, student_id)
);

-- =====================================================
-- HOMEWORK MANAGEMENT
-- =====================================================

-- Homework Assignments
CREATE TABLE homework_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    class_id UUID NOT NULL REFERENCES classes(id),
    subject_id UUID NOT NULL REFERENCES subjects(id),
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    
    assigned_date DATE NOT NULL,
    due_date DATE NOT NULL,
    due_time TIME,
    
    max_marks INTEGER DEFAULT 0,
    difficulty_level VARCHAR(20) DEFAULT 'medium', -- easy, medium, hard
    
    status VARCHAR(20) DEFAULT 'active', -- active, completed, cancelled
    
    -- File attachments
    attachment_urls TEXT[], -- Array of file URLs
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Homework Submissions
CREATE TABLE homework_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    homework_assignment_id UUID NOT NULL REFERENCES homework_assignments(id),
    student_id UUID NOT NULL REFERENCES students(id),
    
    submission_date TIMESTAMP,
    submission_text TEXT,
    attachment_urls TEXT[], -- Array of submitted file URLs
    
    status VARCHAR(20) DEFAULT 'pending', -- pending, submitted, late, graded
    
    -- Grading
    marks_obtained INTEGER,
    grade VARCHAR(5), -- A+, A, B+, etc.
    feedback TEXT,
    graded_by UUID REFERENCES teachers(id),
    graded_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(homework_assignment_id, student_id)
);

-- =====================================================
-- ASSESSMENT & GRADING
-- =====================================================

-- Assessment Types (Test, Quiz, Project, etc.)
CREATE TABLE assessment_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    weightage_percentage DECIMAL(5,2) DEFAULT 0, -- For final grade calculation
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assessments/Exams
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    class_id UUID NOT NULL REFERENCES classes(id),
    subject_id UUID NOT NULL REFERENCES subjects(id),
    assessment_type_id UUID NOT NULL REFERENCES assessment_types(id),
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    scheduled_date DATE,
    start_time TIME,
    duration_minutes INTEGER,
    
    max_marks INTEGER NOT NULL,
    passing_marks INTEGER,
    
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, ongoing, completed, cancelled
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assessment Results
CREATE TABLE assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES assessments(id),
    student_id UUID NOT NULL REFERENCES students(id),
    
    marks_obtained DECIMAL(8,2),
    grade VARCHAR(5),
    percentage DECIMAL(5,2),
    rank INTEGER,
    
    remarks TEXT,
    is_absent BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(assessment_id, student_id)
);

-- Overall Student Grades
CREATE TABLE student_grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id),
    class_id UUID NOT NULL REFERENCES classes(id),
    subject_id UUID NOT NULL REFERENCES subjects(id),
    academic_year_id UUID NOT NULL REFERENCES academic_years(id),
    term VARCHAR(20) NOT NULL, -- Term 1, Term 2, Final, etc.
    
    total_marks DECIMAL(8,2),
    marks_obtained DECIMAL(8,2),
    percentage DECIMAL(5,2),
    grade VARCHAR(5),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(student_id, subject_id, academic_year_id, term)
);

-- =====================================================
-- COMMUNICATION
-- =====================================================

-- Messages between teachers, parents, students
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL, -- Can be teacher, parent, or admin
    sender_type VARCHAR(20) NOT NULL, -- 'teacher', 'parent', 'admin'
    
    recipient_id UUID NOT NULL,
    recipient_type VARCHAR(20) NOT NULL,
    
    subject VARCHAR(255),
    message_body TEXT NOT NULL,
    
    message_type VARCHAR(20) DEFAULT 'general', -- general, urgent, announcement
    
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- Optional: related to specific class/student
    class_id UUID REFERENCES classes(id),
    student_id UUID REFERENCES students(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Announcements
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    
    -- Target audience
    target_type VARCHAR(20) NOT NULL, -- 'class', 'grade', 'all'
    target_class_id UUID REFERENCES classes(id),
    target_grade_id UUID REFERENCES grades(id),
    
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    
    publish_date DATE NOT NULL,
    expiry_date DATE,
    
    is_published BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SCHEDULING & TIMETABLE
-- =====================================================

-- Time Slots
CREATE TABLE time_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id),
    slot_name VARCHAR(50) NOT NULL, -- Period 1, Period 2, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_order INTEGER NOT NULL,
    is_break BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Timetable
CREATE TABLE timetable (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id),
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    subject_id UUID NOT NULL REFERENCES subjects(id),
    time_slot_id UUID NOT NULL REFERENCES time_slots(id),
    
    day_of_week INTEGER NOT NULL, -- 1=Monday, 7=Sunday
    room_number VARCHAR(20),
    
    academic_year_id UUID NOT NULL REFERENCES academic_years(id),
    effective_from DATE NOT NULL,
    effective_to DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(class_id, day_of_week, time_slot_id, effective_from)
);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL,
    recipient_type VARCHAR(20) NOT NULL, -- 'teacher', 'parent', 'student'
    
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL, -- 'homework_due', 'attendance_low', 'grade_updated', etc.
    
    -- Related entities
    related_id UUID, -- ID of related homework, attendance, etc.
    related_type VARCHAR(50), -- 'homework', 'attendance', 'grade', etc.
    
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    scheduled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SYSTEM TABLES
-- =====================================================

-- User Sessions (for JWT token management)
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    user_type VARCHAR(20) NOT NULL, -- 'teacher', 'parent', 'admin'
    
    session_token VARCHAR(500) NOT NULL,
    refresh_token VARCHAR(500),
    
    ip_address INET,
    user_agent TEXT,
    
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Logs
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    user_type VARCHAR(20) NOT NULL,
    
    action VARCHAR(100) NOT NULL, -- 'login', 'create_homework', 'mark_attendance', etc.
    entity_type VARCHAR(50), -- 'homework', 'attendance', 'student', etc.
    entity_id UUID,
    
    ip_address INET,
    user_agent TEXT,
    
    metadata JSONB, -- Additional action-specific data
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- File Uploads
CREATE TABLE file_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uploaded_by_id UUID NOT NULL,
    uploaded_by_type VARCHAR(20) NOT NULL,
    
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100),
    
    -- Related to which entity
    entity_type VARCHAR(50), -- 'homework', 'profile', 'announcement', etc.
    entity_id UUID,
    
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Teachers
CREATE INDEX idx_teachers_school_id ON teachers(school_id);
CREATE INDEX idx_teachers_email ON teachers(email);
CREATE INDEX idx_teachers_employee_id ON teachers(employee_id);
CREATE INDEX idx_teachers_is_active ON teachers(is_active);

-- Students
CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_is_active ON students(is_active);

-- Classes
CREATE INDEX idx_classes_school_id ON classes(school_id);
CREATE INDEX idx_classes_academic_year_id ON classes(academic_year_id);
CREATE INDEX idx_classes_grade_id ON classes(grade_id);
CREATE INDEX idx_classes_class_teacher_id ON classes(class_teacher_id);

-- Attendance
CREATE INDEX idx_attendance_records_class_id ON attendance_records(class_id);
CREATE INDEX idx_attendance_records_teacher_id ON attendance_records(teacher_id);
CREATE INDEX idx_attendance_records_date ON attendance_records(attendance_date);
CREATE INDEX idx_student_attendance_student_id ON student_attendance(student_id);
CREATE INDEX idx_student_attendance_record_id ON student_attendance(attendance_record_id);

-- Homework
CREATE INDEX idx_homework_teacher_id ON homework_assignments(teacher_id);
CREATE INDEX idx_homework_class_id ON homework_assignments(class_id);
CREATE INDEX idx_homework_due_date ON homework_assignments(due_date);
CREATE INDEX idx_homework_status ON homework_assignments(status);
CREATE INDEX idx_homework_submissions_homework_id ON homework_submissions(homework_assignment_id);
CREATE INDEX idx_homework_submissions_student_id ON homework_submissions(student_id);

-- Messages & Notifications
CREATE INDEX idx_messages_sender ON messages(sender_id, sender_type);
CREATE INDEX idx_messages_recipient ON messages(recipient_id, recipient_type);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, recipient_type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Timetable
CREATE INDEX idx_timetable_class_id ON timetable(class_id);
CREATE INDEX idx_timetable_teacher_id ON timetable(teacher_id);
CREATE INDEX idx_timetable_day_of_week ON timetable(day_of_week);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample school
INSERT INTO schools (id, name, address, phone, email, academic_year) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Greenwood High School', '123 Main Street, City', '+1-234-567-8900', 'admin@greenwood.edu', '2024-25');

-- Insert sample academic year
INSERT INTO academic_years (school_id, year_name, start_date, end_date, is_current) VALUES 
('550e8400-e29b-41d4-a716-446655440000', '2024-25', '2024-04-01', '2025-03-31', true);

-- Insert sample grades
INSERT INTO grades (school_id, name, level) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Grade 1', 1),
('550e8400-e29b-41d4-a716-446655440000', 'Grade 2', 2),
('550e8400-e29b-41d4-a716-446655440000', 'Grade 10', 10);

-- Insert sample subjects
INSERT INTO subjects (school_id, name, code) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Mathematics', 'MATH'),
('550e8400-e29b-41d4-a716-446655440000', 'English', 'ENG'),
('550e8400-e29b-41d4-a716-446655440000', 'Science', 'SCI');