# Database Migration Scripts

## Setup Instructions

### 1. Prerequisites
- PostgreSQL 12+ (recommended PostgreSQL 14+)
- Database user with CREATE privileges
- UUID extension support

### 2. Create Database
```sql
-- Create database
CREATE DATABASE school_management;

-- Connect to the database
\c school_management;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### 3. Run Schema
```bash
# Execute the main schema file
psql -U username -d school_management -f database-schema.sql
```

## Migration Strategy

### Version Control
- Each schema change should be versioned
- Use sequential migration files: `001_initial_schema.sql`, `002_add_notifications.sql`, etc.
- Always include rollback scripts

### Example Migration File Structure
```
migrations/
├── 001_initial_schema.sql
├── 001_initial_schema_rollback.sql
├── 002_add_notifications.sql
├── 002_add_notifications_rollback.sql
└── migration_tracker.sql
```

### Migration Tracker Table
```sql
CREATE TABLE schema_migrations (
    version VARCHAR(50) PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    applied_by VARCHAR(100),
    description TEXT
);
```

## Environment-Specific Configurations

### Development Environment
```sql
-- Smaller constraints for testing
ALTER TABLE classes ALTER COLUMN max_students SET DEFAULT 10;

-- Enable query logging
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_duration_statement = 0;
```

### Production Environment
```sql
-- Production optimizations
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
```

## Data Seeding Scripts

### Basic Setup Data
```sql
-- Insert default assessment types
INSERT INTO assessment_types (school_id, name, description, weightage_percentage) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Quiz', 'Short assessments', 10.00),
('550e8400-e29b-41d4-a716-446655440000', 'Test', 'Unit tests', 25.00),
('550e8400-e29b-41d4-a716-446655440000', 'Project', 'Long-term projects', 20.00),
('550e8400-e29b-41d4-a716-446655440000', 'Final Exam', 'End of term exam', 45.00);

-- Insert default time slots
INSERT INTO time_slots (school_id, slot_name, start_time, end_time, slot_order) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Period 1', '09:00', '09:45', 1),
('550e8400-e29b-41d4-a716-446655440000', 'Period 2', '09:45', '10:30', 2),
('550e8400-e29b-41d4-a716-446655440000', 'Break', '10:30', '10:45', 3, true),
('550e8400-e29b-41d4-a716-446655440000', 'Period 3', '10:45', '11:30', 4),
('550e8400-e29b-41d4-a716-446655440000', 'Period 4', '11:30', '12:15', 5),
('550e8400-e29b-41d4-a716-446655440000', 'Lunch', '12:15', '13:00', 6, true),
('550e8400-e29b-41d4-a716-446655440000', 'Period 5', '13:00', '13:45', 7),
('550e8400-e29b-41d4-a716-446655440000', 'Period 6', '13:45', '14:30', 8);
```

### Sample Teacher Data
```sql
-- Insert sample teachers
INSERT INTO teachers (
    school_id, employee_id, email, password_hash, first_name, last_name,
    phone, department, designation, qualification, experience_years, join_date
) VALUES
(
    '550e8400-e29b-41d4-a716-446655440000',
    'TCH001',
    'rajesh.kumar@greenwood.edu',
    '$2a$10$example.hash.here', -- Hash of 'password123'
    'Rajesh',
    'Kumar',
    '+91-9876543210',
    'Mathematics',
    'Senior Teacher',
    'M.Sc Mathematics, B.Ed',
    8,
    '2020-06-15'
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    'TCH002',
    'priya.sharma@greenwood.edu',
    '$2a$10$example.hash.here',
    'Priya',
    'Sharma',
    '+91-9876543211',
    'English',
    'Teacher',
    'M.A English Literature, B.Ed',
    5,
    '2021-04-10'
);
```

## Performance Tuning

### Query Optimization
```sql
-- Analyze table statistics
ANALYZE;

-- Check slow queries
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;
```

### Index Monitoring
```sql
-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;

-- Find unused indexes
SELECT schemaname, tablename, indexname
FROM pg_stat_user_indexes
WHERE idx_scan = 0;
```

## Backup & Recovery

### Daily Backup Script
```bash
#!/bin/bash
# backup_school_db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/school_management"
DB_NAME="school_management"

# Create backup directory
mkdir -p $BACKUP_DIR

# Full database backup
pg_dump -U postgres -h localhost -F c -b -v -f "${BACKUP_DIR}/school_db_${DATE}.backup" $DB_NAME

# Compress backup
gzip "${BACKUP_DIR}/school_db_${DATE}.backup"

# Clean old backups (keep 30 days)
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete

echo "Backup completed: school_db_${DATE}.backup.gz"
```

### Recovery Script
```bash
#!/bin/bash
# restore_school_db.sh

BACKUP_FILE=$1
DB_NAME="school_management_restored"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

# Create new database
createdb -U postgres $DB_NAME

# Restore from backup
pg_restore -U postgres -d $DB_NAME -v $BACKUP_FILE

echo "Database restored to: $DB_NAME"
```

## Monitoring & Alerts

### Database Health Check
```sql
-- Check database size
SELECT 
    pg_database.datname,
    pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database
WHERE datname = 'school_management';

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY size_bytes DESC;

-- Active connections
SELECT count(*) FROM pg_stat_activity WHERE datname = 'school_management';
```

### Performance Alerts
```sql
-- Long running queries
SELECT 
    pid,
    now() - pg_stat_activity.query_start AS duration,
    query
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes'
AND state = 'active';
```

This migration and setup guide ensures proper database deployment and maintenance for the Teacher Dashboard system.