# NexusCRM — Frontend

Modern CRM dashboard built with React, Vite, and Tailwind CSS. Connects to the Flask backend API for live lead and pipeline management.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18.2 | UI framework |
| Vite | 5.1 | Build tool & dev server |
| Tailwind CSS | 3.4 | Styling |
| React Router DOM | 6.22 | Client-side routing |
| Recharts | 2.12 | Charts & data visualization |
| Lucide React | 0.344 | Icons |

---

## Project Structure

```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx              # App entry point
    ├── App.jsx               # Routes & auth guard
    ├── index.css             # Global styles & Tailwind layers
    ├── components/
    │   ├── Layout.jsx        # Page shell (sidebar + navbar + outlet)
    │   ├── Sidebar.jsx       # Navigation sidebar
    │   ├── Navbar.jsx        # Top navigation bar
    │   ├── CustomerCard.jsx  # Customer summary card
    │   ├── LeadTable.jsx     # Sortable leads table
    │   └── PipelineBoard.jsx # Kanban pipeline board
    ├── pages/
    │   ├── Login.jsx         # Login screen
    │   ├── Dashboard.jsx     # Overview with charts & stats
    │   ├── Leads.jsx         # Leads list + Add Lead modal
    │   ├── Pipeline.jsx      # Sales pipeline board
    │   └── CustomerProfile.jsx # Individual contact profile
    └── data/
        └── mockData.js       # Sample data (leads, customers, pipeline)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend Flask server running on `http://localhost:5000`

### Installation

```bash
# Navigate to the frontend folder
cd frontend

# Install dependencies
npm install
```

### Running the Dev Server

```bash
npm run dev
```

App will be available at **http://localhost:5173**

### Building for Production

```bash
npm run build
```

Output goes to `frontend/dist/`.

### Preview Production Build

```bash
npm run preview
```

---

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login | Authentication screen |
| `/dashboard` | Dashboard | Revenue charts, stats, key accounts |
| `/leads` | Leads | Full leads table with search, filter, Add Lead modal |
| `/pipeline` | Pipeline | Kanban board with deal stages |
| `/customer/:id` | Customer Profile | Contact detail with activity timeline |

---

## API Integration

The frontend talks to the Flask backend at `http://localhost:5000`.

| Action | Method | Endpoint |
|--------|--------|----------|
| Get all leads | GET | `/leads` |
| Create a lead | POST | `/leads` |
| Update a lead | PUT | `/leads/:id` |
| Delete a lead | DELETE | `/leads/:id` |

The **Add Lead** modal (`Leads.jsx`) sends:

```json
{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "phone": "+1 415 000 0000",
  "source": "LinkedIn",
  "status": "New Lead",
  "assigned_to": null
}
```

---

## Environment

No `.env` file is needed for the frontend. The API base URL is currently hardcoded as `http://localhost:5000` in `Leads.jsx`. To change it for production, update that value or add a Vite env variable:

```env
# .env (optional)
VITE_API_URL=http://your-backend-url.com
```

Then in code:
```js
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'
```

---

## Key Design Tokens (Tailwind)

| Token | Value | Usage |
|-------|-------|-------|
| `brand-600` | `#2563eb` | Primary buttons, active nav |
| `slate-950` | `#0a0f1e` | Page background |
| `glass-card` | custom class | All card components |
| Font: Sora | Google Fonts | Body text |
| Font: JetBrains Mono | Google Fonts | Numbers, badges |

---

## Scripts

```bash
npm run dev       # Start development server (port 5173)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```
