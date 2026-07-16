-- Table for users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    course_code VARCHAR(50) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id)
    REFERENCES users(id)
);

CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    due_date TIMESTAMP,
    completed_date TIMESTAMP,
    type VARCHAR(255),
    priority VARCHAR(255),
    status VARCHAR(255),
    weight DECIMAL(5,2),
    grade DECIMAL(5,2),
    notes TEXT,
    FOREIGN KEY (course_id)
    REFERENCES courses(course_id)
);