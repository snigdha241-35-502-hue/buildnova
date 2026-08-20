CREATE DATABASE IF NOT EXISTS buildnova;
USE buildnova;

-- =========================
-- USERS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    role ENUM('customer', 'engineer', 'admin') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- PROJECTS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    engineer_id INT NULL,
    project_name VARCHAR(150) NOT NULL,
    building_type VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    land_size VARCHAR(100),
    number_of_floors INT NOT NULL DEFAULT 1,
    number_of_rooms INT NOT NULL DEFAULT 0,
    budget DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    requirements TEXT,
    status ENUM(
        'Pending',
        'Engineer Assigned',
        'Designing',
        'Estimate Ready',
        'Approved',
        'Construction',
        'Completed',
        'Rejected'
    ) NOT NULL DEFAULT 'Pending',
    progress INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_projects_customer
        FOREIGN KEY (customer_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_projects_engineer
        FOREIGN KEY (engineer_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- =========================
-- ESTIMATES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS estimates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    engineer_id INT NOT NULL,
    material_cost DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    labor_cost DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    design_cost DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    other_cost DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    total_cost DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_estimates_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_estimates_engineer
        FOREIGN KEY (engineer_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================
-- PROGRESS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    engineer_id INT NOT NULL,
    progress_percentage INT NOT NULL DEFAULT 0,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_progress_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_progress_engineer
        FOREIGN KEY (engineer_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================
-- PAYMENTS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    customer_id INT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(150),
    payment_status ENUM(
        'Pending',
        'Paid',
        'Failed'
    ) NOT NULL DEFAULT 'Pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payments_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_payments_customer
        FOREIGN KEY (customer_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================
-- MESSAGES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    project_id INT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_messages_sender
        FOREIGN KEY (sender_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_messages_receiver
        FOREIGN KEY (receiver_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_messages_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
);