-- Migration number: 0001
-- Create quotes table for EcoSurfaceCare enquiries.

CREATE TABLE IF NOT EXISTS quotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  reference TEXT NOT NULL UNIQUE,

  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  postcode TEXT NOT NULL,

  property_type TEXT NOT NULL,
  service TEXT NOT NULL,

  description TEXT NOT NULL,

  photo_count INTEGER NOT NULL DEFAULT 0,

  status TEXT NOT NULL DEFAULT 'new'
    CHECK (
      status IN (
        'new',
        'contacted',
        'quoted',
        'booked',
        'completed',
        'cancelled'
      )
    ),

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quotes_status
ON quotes(status);

CREATE INDEX IF NOT EXISTS idx_quotes_created_at
ON quotes(created_at);

CREATE INDEX IF NOT EXISTS idx_quotes_email
ON quotes(email);

CREATE INDEX IF NOT EXISTS idx_quotes_postcode
ON quotes(postcode);-- Migration number: 0001 	 2026-08-11T02:45:49.345Z
