BEGIN;

TRUNCATE
  users,
  spells
  RESTART IDENTITY CASCADE;

INSERT INTO users (username, password)
VALUES
  ('dunder', '$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne'),
  ('testUser1', 'password'),
  ('testUser2', 'password'),
  ('testUser3', 'password');

-- Create ship_parts that references tier, frame, engine, power core, etc.
INSERT INTO spells (user_id, name, description, text, is_public, is_deleted, locked)
VALUES
  (1, 'Apple Storm', 'Swirling storm of apples', '(displayln "Hello")', true, false, false),
  (1, 'Cozy Cabin', 'Summons a log cabin', '(displayln "Hello")', true, false, false),
  (1, 'Deleted & Public', 'Test', '(displayln "Hello")', true, true, false),
  (1, 'Deleted, not public', 'Test', '(displayln "Hello")', false, true, false),
  (1, 'Neither deleted nor public', 'Test', '(displayln "Hello")', false, false, false),
  (1, 'Safely Locked!', 'This spell is set as locked by default', '(displayln "Go Away")', true, false, true);

COMMIT;
