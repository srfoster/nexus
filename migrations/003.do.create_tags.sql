CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  spell_id INTEGER,
  name TEXT NOT NULL,
  date_created TIMESTAMP DEFAULT now() NOT NULL,
  date_modified TIMESTAMP DEFAULT now() NOT NULL,
  CONSTRAINT fk_spell
    FOREIGN KEY(spell_id)
      REFERENCES spells(id)
);
