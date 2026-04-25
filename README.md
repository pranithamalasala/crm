# 🚀 NexusCRM — Full Stack CRM System (Enhanced)

A modern, full-stack **Customer Relationship Management (CRM)** application built with a **React frontend and Flask backend**, designed for seamless lead tracking, customer management, and sales pipeline visualization.

⚡ **Zero-setup backend** — uses SQLite (auto-created on first run), eliminating the need for MySQL or XAMPP.

---

## 👥 Contributors

| Name              | GitHub            | Role                   |
| ----------------- | ----------------- | ---------------------- |
| **Pranitha**      | @pranithamalasala | Frontend & Integration |
| **Sushant Bhatt** | @sushantbhatt17   | Backend & Database     |

---

## 🚀 Quick Start

### 🔹 Backend (Terminal 1)

```bash
cd backend
pip install -r requirements.txt
python run.py
```

Runs at: **http://localhost:5000**
📌 Database (`crm.db`) is created automatically with seed data.

---

### 🔹 Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Runs at: **http://localhost:5173**

---

### 🔐 Demo Login

| Email                                 | Password |
| ------------------------------------- | -------- |
| [admin@crm.com](mailto:admin@crm.com) | admin123 |

---

## ✨ Key Features

* 🔐 Authentication system with persistent session
* 📊 Live analytics dashboard (charts + KPIs)
* 👥 Lead management (CRUD, filtering, sorting, CSV export)
* 🗂 Sales pipeline with Kanban board & stage transitions
* 👤 Customer profiles with activity timeline
* 📝 Activity logging system
* 📱 Fully responsive modern UI (dark theme)

---

## 🔌 API Overview

| Method | Endpoint          | Description             |
| ------ | ----------------- | ----------------------- |
| POST   | `/users/login`    | User login              |
| GET    | `/leads`          | Fetch leads             |
| POST   | `/leads`          | Create lead             |
| PUT    | `/leads/:id`      | Update lead             |
| DELETE | `/leads/:id`      | Delete lead             |
| GET    | `/pipeline/board` | Pipeline board          |
| POST   | `/pipeline/move`  | Move lead across stages |
| GET    | `/customers`      | Fetch customers         |
| PUT    | `/customers/:id`  | Update customer         |
| DELETE | `/customers/:id`  | Delete customer         |
| GET    | `/activities`     | Activity logs           |
| POST   | `/activities`     | Create activity         |
| GET    | `/analytics`      | Dashboard analytics     |

---

## 🧱 Tech Stack

**Frontend**

* React 18 + Vite
* Tailwind CSS
* React Router v6
* Recharts
* Lucide React

**Backend**

* Flask 3
* flask-cors
* python-dotenv
* bcrypt

**Database**

* SQLite (auto-managed, no external setup)

---

## 🛠 Improvements & Fixes

### 🔹 Backend Enhancements

* Replaced MySQL + XAMPP with **SQLite (zero setup)**
* Removed Flask-MySQLdb dependency
* Implemented `/users/login` authentication endpoint
* Refactored SQL schema for SQLite compatibility
* Added analytics metrics (revenue, pipeline value, trends)
* Fixed missing dependencies (bcrypt)

### 🔹 Frontend Enhancements

* Converted static UI into **fully dynamic data-driven app**
* Implemented real API integration across all pages
* Added Analytics & Customers modules
* Enabled full CRUD (Create, Edit, Delete) functionality
* Implemented pipeline stage transitions
* Added CSV export for leads
* Fixed authentication persistence using sessionStorage
* Added activity logging system

---

## 📸 Screenshots

> Add:

* Dashboard
* Leads page
* Pipeline board
* Analytics

---

## 🎯 What This Project Demonstrates

* End-to-end full-stack development
* REST API design with Flask
* Dynamic UI with React
* State management & routing
* Data visualization with charts
* Clean modular architecture

---

## 🚧 Future Improvements

* JWT-based authentication
* Role-based access control
* Cloud deployment (AWS / Vercel / Docker)
* Real-time notifications

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!
