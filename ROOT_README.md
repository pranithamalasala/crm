# NexusCRM — Full Stack CRM System

A full-stack Customer Relationship Management (CRM) web application built as a college project. Features a modern React dashboard with a Flask REST API backend and MySQL database.

---

## 👥 Contributors

| Name | GitHub | Role |
|------|--------|------|
| Pranitha | [@pranithamalasala](https://github.com/pranithamalasala) | Frontend & Integration |
| Sushant | [@sushantbhatt17](https://github.com/sushantbhatt17) | Backend & Database |

---

## 🧱 Tech Stack

### Frontend
- **React 18** + **Vite** — UI & build tool
- **Tailwind CSS** — Styling
- **React Router v6** — Client-side routing
- **Recharts** — Charts & graphs
- **Lucide React** — Icons

### Backend
- **Flask 3** — REST API
- **Flask-MySQLdb** — MySQL connector
- **Flask-CORS** — Cross-origin requests
- **python-dotenv** — Environment config

### Database
- **MySQL** (via XAMPP locally)

---

## 📁 Project Structure

```
crm/
├── backend/                  # Flask REST API
│   ├── app/
│   │   ├── __init__.py       # App factory, CORS, blueprints
│   │   ├── extensions.py     # MySQL instance
│   │   ├── routes/
│   │   │   ├── leads.py      # CRUD for leads
│   │   │   ├── customers.py  # Customer routes
│   │   │   ├── pipeline.py   # Pipeline routes
│   │   │   ├── activities.py # Activity log routes
│   │   │   └── analytics.py  # Analytics routes
│   │   └── utils/
│   │       ├── helpers.py    # success/error response helpers
│   │       └── validators.py
│   ├── config/
│   │   └── config.py         # App config from .env
│   ├── migrations/
│   │   └── schema.sql        # Database schema
│   ├── requirements.txt
│   ├── run.py                # Entry point
│   └── .env.example          # Environment variable template
│
└── frontend/                 # React + Vite app
    ├── src/
    │   ├── App.jsx            # Routes & auth guard
    │   ├── pages/             # Login, Dashboard, Leads, Pipeline, Profile
    │   ├── components/        # Layout, Sidebar, Navbar, Cards, Tables
    │   └── data/              # Mock data
    ├── package.json
    └── README.md              # Frontend-specific docs
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- XAMPP (MySQL running on port 3306)

---

### 1. Database Setup

1. Start **XAMPP** and make sure **MySQL** is running
2. Open **phpMyAdmin** → go to the **SQL** tab
3. Run the schema:

```sql
CREATE DATABASE IF NOT EXISTS crm;
USE crm;
```

Then import `backend/migrations/schema.sql` or paste its contents and run it.

---

### 2. Backend Setup

```bash
cd backend

# Copy environment file
copy .env.example .env        # Windows
cp .env.example .env          # Mac/Linux

# Edit .env — set your MySQL password and DB name
MYSQL_DB=crm
MYSQL_PASSWORD=your_password

# Install dependencies
pip install -r requirements.txt

# Start Flask server
python run.py
```

Backend runs at **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/leads` | Get all leads |
| POST | `/leads` | Create a new lead |
| PUT | `/leads/:id` | Update a lead |
| DELETE | `/leads/:id` | Delete a lead |
| GET | `/customers` | Get all customers |
| GET | `/pipeline` | Get pipeline stages |
| GET | `/activities` | Get activity log |
| GET | `/analytics` | Get analytics data |

---

## ✨ Features

- 🔐 Login screen with auth guard
- 📊 Dashboard with revenue charts and conversion funnel
- 👥 Leads management — search, filter, add new leads
- 🗂 Sales pipeline — Kanban board with deal stages
- 👤 Customer profiles with activity timeline
- 📱 Responsive layout with dark theme

---

## ⚙️ Environment Variables

Create `backend/.env` from `.env.example`:

```env
FLASK_DEBUG=True
SECRET_KEY=your-secret-key

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DB=crm
```

---

## 📸 Screenshots

> Dashboard, Leads page, and Pipeline board

*(Add screenshots here once the app is fully running)*
