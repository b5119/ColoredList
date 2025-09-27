-- Essential database schema fixes for ColoredList app
-- Run these commands in your Supabase SQL Editor

-- Add missing columns to lists table
ALTER TABLE lists 
ADD COLUMN IF NOT EXISTS name VARCHAR(100) NOT NULL DEFAULT 'Untitled List',
ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#5bc0de',
ADD COLUMN IF NOT EXISTS category VARCHAR(50),
ADD COLUMN IF NOT EXISTS due_date DATE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add missing columns to items table
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#5bc0de',
ADD COLUMN IF NOT EXISTS due_date DATE,
ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lists_position ON lists(position);
CREATE INDEX IF NOT EXISTS idx_items_list_id ON items(list_id);
CREATE INDEX IF NOT EXISTS idx_items_position ON items(position);

-- Update existing lists with default names if they don't have names
UPDATE lists SET name = 'List ' || list_id WHERE name IS NULL OR name = '';