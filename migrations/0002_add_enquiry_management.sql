-- Migration number: 0002
-- Add enquiry management fields and internal notes.

ALTER TABLE quotes
ADD COLUMN quoted_amount_pence INTEGER;

ALTER TABLE quotes
ADD COLUMN appointment_at TEXT;

CREATE TABLE IF NOT EXISTS quote_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  quote_id INTEGER NOT NULL,

  note TEXT NOT NULL,

  author_email TEXT,

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (quote_id)
    REFERENCES quotes(id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_quote_notes_quote_id
ON quote_notes(quote_id);

CREATE INDEX IF NOT EXISTS idx_quote_notes_created_at
ON quote_notes(created_at);
