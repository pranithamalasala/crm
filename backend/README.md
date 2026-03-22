# CRM Backend — Flask + MySQL

A clean, structured CRM REST API for a college project.

---

## Project Structure

```
crm_backend/
├── run.py                      # Application entry point
├── requirements.txt
├── .env.example                # Copy to .env and fill in values
│
├── config/
│   └── config.py               # All environment/config variables
│
├── migrations/
│   └── schema.sql              # Full MySQL schema (run this first)
│
└── app/
    ├── __init__.py             # App factory + blueprint registration
    ├── extensions.py           # MySQL extension instance
    │
    ├── utils/
    │   └── helpers.py          # success/error helpers, pipeline stages
    │
    └── routes/
        ├── leads.py            # Lead CRUD
        ├── pipeline.py         # Pipeline stage management
        ├── customers.py        # Customer management
        ├── activities.py       # Activity tracking
        └── analytics.py        # Dashboard analytics
```

---

## Quick Start

### 1. Clone & install dependencies
```bash
pip install -r requirements.txt
```

### 2. Setup environment variables
```bash
cp .env.example .env
# Edit .env with your MySQL credentials
```

### 3. Create the database
```bash
mysql -u root -p < migrations/schema.sql
```

### 4. Run the server
```bash
python run.py
# Server starts at http://localhost:5000
```

---

## API Reference

### Leads
| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | /leads            | Get all leads            |
| GET    | /leads?status=Won | Filter leads by status   |
| GET    | /leads/{id}       | Get single lead          |
| POST   | /leads            | Create new lead          |
| PUT    | /leads/{id}       | Update lead              |
| DELETE | /leads/{id}       | Delete lead              |

### Pipeline
| Method | Endpoint          | Description                        |
|--------|-------------------|------------------------------------|
| POST   | /pipeline/move    | Move lead to a stage (or advance)  |
| GET    | /pipeline/stages  | List all pipeline stages           |
| GET    | /pipeline/board   | Kanban board (leads by stage)      |

### Customers
| Method | Endpoint            | Description           |
|--------|---------------------|-----------------------|
| GET    | /customers          | Get all customers     |
| GET    | /customers/{id}     | Get single customer   |
| PUT    | /customers/{id}     | Update customer       |
| DELETE | /customers/{id}     | Delete customer       |

### Activities
| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| GET    | /activities           | Get all activities                 |
| GET    | /activities?lead_id=1 | Get activities for a specific lead |
| POST   | /activities           | Log new activity                   |
| DELETE | /activities/{id}      | Delete activity                    |

### Analytics
| Method | Endpoint    | Description                |
|--------|-------------|----------------------------|
| GET    | /analytics  | Dashboard summary stats    |

---

## Example Requests

### Create a lead
```bash
curl -X POST http://localhost:5000/leads \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Johnson", "email": "alice@example.com", "phone": "9876543210"}'
```

### Move lead through pipeline
```bash
# Auto-advance to next stage
curl -X POST http://localhost:5000/pipeline/move \
  -H "Content-Type: application/json" \
  -d '{"lead_id": 1}'

# Move to a specific stage (e.g., mark as Won → auto-creates customer)
curl -X POST http://localhost:5000/pipeline/move \
  -H "Content-Type: application/json" \
  -d '{"lead_id": 1, "stage": "Won"}'
```

### Log an activity
```bash
curl -X POST http://localhost:5000/activities \
  -H "Content-Type: application/json" \
  -d '{"lead_id": 1, "user_id": 1, "type": "call", "notes": "Discussed pricing"}'
```

### Get dashboard analytics
```bash
curl http://localhost:5000/analytics
```

---

## Pipeline Stages (in order)
```
New Lead → Contacted → Demo → Negotiation → Won → Lost
```
- When a lead reaches **Won**, it is **automatically converted to a Customer**.
- **Won** and **Lost** are terminal stages — they cannot be advanced further.

---

## Database Schema Overview

```
users         → id, name, email, password, role
leads         → id, name, email, phone, status, assigned_to (FK→users), created_at
customers     → customer_id, lead_id (FK→leads), name, email, phone, company, notes
deals         → id, lead_id (FK→leads), title, value, stage, owner_id (FK→users)
activities    → activity_id, lead_id (FK→leads), user_id (FK→users), type, notes, date
```
