-- Temporary fix - Disable RLS for testing
-- Run this in Supabase SQL Editor

-- Disable Row Level Security temporarily for testing
ALTER TABLE lists DISABLE ROW LEVEL SECURITY;
ALTER TABLE items DISABLE ROW LEVEL SECURITY;

-- Add the essential columns
ALTER TABLE lists ADD COLUMN IF NOT EXISTS name VARCHAR(255) DEFAULT 'Untitled List';
ALTER TABLE lists ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;
ALTER TABLE lists ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#5bc0de';
ALTER TABLE lists ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE lists ADD COLUMN IF NOT EXISTS due_date DATE;

ALTER TABLE items ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;
ALTER TABLE items ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE;
ALTER TABLE items ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#5bc0de';
ALTER TABLE items ADD COLUMN IF NOT EXISTS due_date DATE;

-- Insert test data
INSERT INTO lists (name, position, color, category) VALUES 
('My First List', 0, '#5bc0de', 'Personal'),
('Work Tasks', 1, '#FF6B6B', 'Work'),
('Shopping List', 2, '#45B7D1', 'Shopping');

-- Verify data
SELECT * FROM lists;