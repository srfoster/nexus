BEGIN;

TRUNCATE
  users,
  spells
  RESTART IDENTITY CASCADE;

INSERT INTO users (username, password)
VALUES
  ('testUser1', 'password'),
  ('testUser2', 'password'),
  ('testUser3', 'password');

-- Create ship_parts that references tier, frame, engine, power core, etc.
INSERT INTO spells (user_id, name, description)
VALUES
  (1, 'Apple Storm', 'Swirling storm of apples'),
  (1, 'Cozy Cabin', 'Summons a log cabin');

COMMIT;
