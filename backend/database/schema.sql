-- Table for users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    course_code VARCHAR(50) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE assignments (
    assign_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL,
    assign_name VARCHAR(255) NOT NULL,
    due_date TIMESTAMP,
    completed_date TIMESTAMPTZ,
    assign_type VARCHAR(255),
    assign_priority VARCHAR(255),
    assign_status VARCHAR(255),
    assign_weight DECIMAL(5,2),
    assign_grade DECIMAL(5,2),
    assign_notes TEXT,
    FOREIGN KEY (course_id)
    REFERENCES courses(course_id)
    ON DELETE CASCADE
);