-- Migration number: 0003
-- Public gallery projects and media.

CREATE TABLE IF NOT EXISTS gallery_projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  quote_id INTEGER,

  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,

  category TEXT NOT NULL,
  location TEXT,

  description TEXT,

  status TEXT NOT NULL DEFAULT 'draft',

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_at TEXT,

  FOREIGN KEY (quote_id)
    REFERENCES quotes(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS gallery_media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  project_id INTEGER NOT NULL,

  r2_key TEXT NOT NULL UNIQUE,

  filename TEXT,
  content_type TEXT,

  alt_text TEXT,

  sort_order INTEGER NOT NULL DEFAULT 0,

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (project_id)
    REFERENCES gallery_projects(id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_gallery_projects_status
ON gallery_projects(status);

CREATE INDEX IF NOT EXISTS idx_gallery_projects_created_at
ON gallery_projects(created_at);

CREATE INDEX IF NOT EXISTS idx_gallery_media_project_id
ON gallery_media(project_id);

CREATE INDEX IF NOT EXISTS idx_gallery_media_sort_order
ON gallery_media(sort_order);
