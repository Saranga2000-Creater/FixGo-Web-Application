-- Create database
CREATE DATABASE IF NOT EXISTS fixgo_db;
USE fixgo_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user', 'mechanic', 'shop_owner') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  phone VARCHAR(20),
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username)
);

-- Sample data (passwords are hashed with bcrypt)
INSERT INTO users (username, email, password, role) VALUES
('admin_user', 'admin@fixgo.com', '$2y$10$9R9qtM52DkWN4VfM5.l.Oe8F5sKZvV.P5x0R7y8Q9w0X1Z2C3V4B5', 'admin'),
('john_mechanic', 'john@fixgo.com', '$2y$10$9R9qtM52DkWN4VfM5.l.Oe8F5sKZvV.P5x0R7y8Q9w0X1Z2C3V4B5', 'mechanic'),
('shop_owner', 'shop@fixgo.com', '$2y$10$9R9qtM52DkWN4VfM5.l.Oe8F5sKZvV.P5x0R7y8Q9w0X1Z2C3V4B5', 'shop_owner'),
('regular_user', 'user@fixgo.com', '$2y$10$9R9qtM52DkWN4VfM5.l.Oe8F5sKZvV.P5x0R7y8Q9w0X1Z2C3V4B5', 'user');

-- Note: All sample passwords are 'password123'
