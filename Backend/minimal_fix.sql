-- Minimal fix - Add only essential columns to existing tables
-- Run this in Supabase SQL Editor

-- First, add the essential columns to lists table
ALTER TABLE lists ADD COLUMN IF NOT EXISTS name VARCHAR(255) DEFAULT 'Untitled List';
ALTER TABLE lists ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;
ALTER TABLE lists ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#5bc0de';

-- Add essential columns to items table  
ALTER TABLE items ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;
ALTER TABLE items ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE;

-- Insert a test list to verify everything works
INSERT INTO lists (name, position, color) VALUES ('Test List', 0, '#5bc0de');

-- Verify the data was inserted
SELECT * FROM lists;