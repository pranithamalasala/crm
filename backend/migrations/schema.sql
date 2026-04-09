-- ============================================
-- CRM System - MySQL Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS crm_db;
USE crm_db;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)        NOT NULL,
    email       VARCHAR(150)        NOT NULL UNIQUE,
    password    VARCHAR(255)        NOT NULL,
    role        ENUM('admin','sales','manager') DEFAULT 'sales',
    created_at  DATETIME            DEFAULT CURRENT_TIMESTAMP
);

-- Table: leads
CREATE TABLE IF NOT EXISTS leads (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)        NOT NULL,
    email       VARCHAR(150)        NOT NULL UNIQUE,
    phone       VARCHAR(20),
    source      VARCHAR(100),
    status      ENUM('New Lead','Contacted','Demo','Negotiation','Won','Lost') DEFAULT 'New Lead',
    assigned_to INT,
    created_at  DATETIME            DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- Table: customers (auto-created when lead is Won)
CREATE TABLE IF NOT EXISTS customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    lead_id     INT UNIQUE,
    name        VARCHAR(100)        NOT NULL,
    email       VARCHAR(150)        NOT NULL UNIQUE,
    phone       VARCHAR(20),
    company     VARCHAR(150),
    notes       TEXT,
    created_at  DATETIME            DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
);

-- Table: deals
CREATE TABLE IF NOT EXISTS deals (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    lead_id     INT                 NOT NULL,
    title       VARCHAR(200)        NOT NULL,
    value       DECIMAL(12, 2)      DEFAULT 0.00,
    stage       ENUM('New Lead','Contacted','Demo','Negotiation','Won','Lost') DEFAULT 'New Lead',
    owner_id    INT,
    closed_at   DATETIME,
    created_at  DATETIME            DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id)   REFERENCES leads(id)  ON DELETE CASCADE,
    FOREIGN KEY (owner_id)  REFERENCES users(id)  ON DELETE SET NULL
);

-- Table: activities
CREATE TABLE IF NOT EXISTS activities (
    activity_id INT AUTO_INCREMENT PRIMARY KEY,
    lead_id     INT                 NOT NULL,
    user_id     INT                 NOT NULL,
    type        ENUM('call','email','meeting') NOT NULL,
    notes       TEXT,
    date        DATETIME            DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id)   REFERENCES leads(id)  ON DELETE CASCADE,
    FOREIGN KEY (user_id)   REFERENCES users(id)  ON DELETE CASCADE
);

-- Seed: demo admin user (password should be hashed in production)
INSERT IGNORE INTO users (name, email, password, role)
VALUES ('Admin User', 'admin@crm.com', 'hashed_password_here', 'admin');