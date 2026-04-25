CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    password    TEXT NOT NULL,
    role        TEXT DEFAULT 'sales' CHECK(role IN ('admin','sales','manager')),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    phone       TEXT,
    company     TEXT,
    source      TEXT,
    status      TEXT DEFAULT 'New Lead' CHECK(status IN ('New Lead','Contacted','Demo','Negotiation','Won','Lost')),
    score       INTEGER DEFAULT 0,
    value       REAL DEFAULT 0,
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id     INTEGER UNIQUE REFERENCES leads(id) ON DELETE SET NULL,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    phone       TEXT,
    company     TEXT,
    notes       TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS deals (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id     INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    value       REAL DEFAULT 0,
    stage       TEXT DEFAULT 'New Lead',
    owner_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
    closed_at   DATETIME,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activities (
    activity_id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id     INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        TEXT NOT NULL CHECK(type IN ('call','email','meeting')),
    notes       TEXT,
    date        DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed admin user (password: admin123)
INSERT OR IGNORE INTO users (id, name, email, password, role)
VALUES (1, 'Admin User', 'admin@crm.com', '$2b$12$GOewKTlR0D/BknVpWU2rYOLANd6nbzsfSP76MuXzScd2aWOyrvVpm', 'admin');

-- Seed some demo leads
INSERT OR IGNORE INTO leads (id, name, email, phone, company, source, status, score, value, assigned_to)
VALUES
  (1, 'Aria Mendez',   'aria@veritascloud.io',   '+1 415 209 3344', 'Veritas Cloud',   'LinkedIn',   'Contacted',   92, 48000, 1),
  (2, 'Marcus Lin',    'mlin@novaspark.ai',       '+1 332 881 0012', 'NovaSpark AI',    'Referral',   'Demo',        74, 22500, 1),
  (3, 'Chloe Reeves',  'creeves@datum.io',        '+1 628 774 5501', 'Datum Systems',   'Website',    'New Lead',    41,  9800, 1),
  (4, 'Omar Hassan',   'omar@peakflow.com',        '+1 212 993 6623', 'PeakFlow SaaS',   'Conference', 'Negotiation', 88, 71000, 1),
  (5, 'Sofia Yuen',    'syuen@brightwave.io',      '+1 510 445 2278', 'Brightwave Labs', 'Email',      'Demo',        65, 31200, 1),
  (6, 'Diego Navarro', 'dnavarro@terravault.co',   '+1 305 667 4490', 'TerraVault',      'LinkedIn',   'Won',         95, 89000, 1),
  (7, 'Priya Kapoor',  'pkapoor@heliosfin.com',    '+1 408 312 7780', 'Helios Fintech',  'Website',    'New Lead',    33,  7500, 1),
  (8, 'Noah Brennan',  'nbrennan@crux.ai',         '+1 617 554 9981', 'Crux Analytics',  'Referral',   'Contacted',   70, 28000, 1);

-- Seed customer from won lead
INSERT OR IGNORE INTO customers (lead_id, name, email, phone, company, notes)
VALUES (6, 'Diego Navarro', 'dnavarro@terravault.co', '+1 305 667 4490', 'TerraVault', 'Highly engaged. Interested in additional seats next quarter.');

-- Seed activities
INSERT OR IGNORE INTO activities (lead_id, user_id, type, notes)
VALUES
  (1, 1, 'call',    'Discovery call completed'),
  (1, 1, 'email',   'Proposal sent'),
  (2, 1, 'meeting', 'Demo scheduled'),
  (4, 1, 'call',    'Pricing discussion'),
  (4, 1, 'email',   'Updated MSA sent'),
  (6, 1, 'meeting', 'Kickoff scheduled');
