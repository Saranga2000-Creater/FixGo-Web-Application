# FixGo Web Application - Setup Guide

Welcome to the **FixGo** project! This guide will walk you through setting up and running the application locally on your machine.

---

## Prerequisites

Before starting, ensure you have the following installed:
* **PHP** (v8.0 or higher recommended)
* **Composer** (PHP Package Manager)
* **Node.js** & **npm** (v16 or higher recommended)
* **MySQL Server**

---

## 🛠️ Step-by-Step Local Setup

### 1. Configure the Environment (`.env`)
1. Go to the `backend/` directory.
2. Duplicate the `.env.example` file and rename it to `.env`.
3. Open your new `.env` file and update your database credentials:
   ```env
   DB_HOST=localhost
   DB_NAME=fixgo_web
   DB_USER=your_database_user
   DB_PASS=your_database_password
   ```
4. If you want to test email verification, update the SMTP credentials with your Google App Password details:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_gmail_address@gmail.com
   SMTP_PASS=your_16_character_app_password
   ```

### 2. Install Backend Dependencies & Run Migrations
Open your terminal, navigate to the `backend/` directory, and run:
```bash
# Install PHP libraries (including PHPMailer)
composer install

# Build the database tables and columns locally
php database/migrate.php
```

### 3. Install Frontend Dependencies
Open a separate terminal window, navigate to the `frontend/` directory, and run:
```bash
npm install
```

---

## 🚀 Running the Application

### Option A: Testing on Desktop only (Standard Dev)
If you only need to run and test the application on your computer's browser:

1. **Start the Backend** (in `backend/`):
   ```bash
   php -S localhost:8000
   ```
2. **Start the Frontend** (in `frontend/`):
   ```bash
   npm run dev
   ```
3. Open your browser and go to: `http://localhost:5173`

---

### Option B: Testing on a Mobile Phone (Local Network Sharing)
If you want to test the application on your mobile phone:

1. **Ensure both devices** (your computer and mobile phone) are connected to the **same Wi-Fi network**.
2. **Find your computer's local IP address** by opening Command Prompt (`cmd`) and typing `ipconfig` (look for the "IPv4 Address", e.g., `192.168.1.50`).
3. Update your `backend/.env` file:
   ```env
   # Replace with your actual computer IP address!
   APP_URL=http://192.168.1.50:8000
   FRONTEND_URL=http://192.168.1.50:5173
   ```
4. **Start the Backend** exposing it to your local network (in `backend/`):
   ```bash
   php -S 0.0.0.0:8000
   ```
5. **Start the Frontend** with local network exposure (in `frontend/`):
   ```bash
   npm run dev -- --host
   ```
6. Open the verification links sent to your email from your mobile phone!
