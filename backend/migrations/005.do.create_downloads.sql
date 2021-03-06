CREATE TABLE IF NOT EXISTS downloads (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  name TEXT NOT NULL,
  link TEXT,
  description TEXT,
  thumbnail TEXT,
  date_created TIMESTAMP DEFAULT now() NOT NULL,
  date_modified TIMESTAMP DEFAULT now() NOT NULL
);
