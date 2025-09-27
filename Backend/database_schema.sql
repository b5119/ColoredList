-- ColoredList Database Schema Updates
-- Run these SQL commands in your Supabase SQL Editor to add new features

-- Update the lists table to include new columns
ALTER TABLE lists 
ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#5bc0de',
ADD COLUMN IF NOT EXISTS category VARCHAR(50),
ADD COLUMN IF NOT EXISTS due_date DATE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update the items table to include new columns
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#5bc0de',
ADD COLUMN IF NOT EXISTS due_date DATE,
ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;

-- Add position column to lists if it doesn't exist
ALTER TABLE lists 
ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lists_user_id ON lists(user_id);
CREATE INDEX IF NOT EXISTS idx_lists_position ON lists(position);
CREATE INDEX IF NOT EXISTS idx_items_list_id ON items(list_id);
CREATE INDEX IF NOT EXISTS idx_items_position ON items(position);
CREATE INDEX IF NOT EXISTS idx_lists_due_date ON lists(due_date);
CREATE INDEX IF NOT EXISTS idx_items_due_date ON items(due_date);

-- Create a categories table for predefined categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  color VARCHAR(7) DEFAULT '#5bc0de',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some default categories
INSERT INTO categories (name, color) VALUES 
('Work', '#FF6B6B'),
('Personal', '#4ECDC4'),
('Shopping', '#45B7D1'),
('Health', '#96CEB4'),
('Study', '#FFEAA7'),
('Travel', '#DDA0DD'),
('Finance', '#98D8C8')
ON CONFLICT (name) DO NOTHING;

-- Enable Row Level Security (RLS) for user data protection
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for lists
CREATE POLICY "Users can view their own lists" ON lists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lists" ON lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lists" ON lists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lists" ON lists
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for items (items belong to lists, so we check through list ownership)
CREATE POLICY "Users can view items in their lists" ON items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lists 
      WHERE lists.list_id = items.list_id 
      AND lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create items in their lists" ON items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM lists 
      WHERE lists.list_id = items.list_id 
      AND lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update items in their lists" ON items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM lists 
      WHERE lists.list_id = items.list_id 
      AND lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete items in their lists" ON items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM lists 
      WHERE lists.list_id = items.list_id 
      AND lists.user_id = auth.uid()
    )
  );

-- Function to automatically set user_id when creating lists
CREATE OR REPLACE FUNCTION set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically set user_id for new lists
CREATE TRIGGER set_lists_user_id
  BEFORE INSERT ON lists
  FOR EACH ROW
  EXECUTE FUNCTION set_user_id();