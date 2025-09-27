-- Complete ColoredList Database Schema
-- Run this in your Supabase SQL Editor if tables don't exist

-- Create lists table from scratch
CREATE TABLE IF NOT EXISTS lists (
  list_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL DEFAULT 'Untitled List',
  position INTEGER DEFAULT 0,
  color VARCHAR(7) DEFAULT '#5bc0de',
  category VARCHAR(50),
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create items table from scratch
CREATE TABLE IF NOT EXISTS items (
  item_id SERIAL PRIMARY KEY,
  list_id INTEGER REFERENCES lists(list_id) ON DELETE CASCADE,
  item_name VARCHAR(255) NOT NULL,
  position INTEGER DEFAULT 0,
  color VARCHAR(7) DEFAULT '#5bc0de',
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lists_position ON lists(position);
CREATE INDEX IF NOT EXISTS idx_lists_user_id ON lists(user_id);
CREATE INDEX IF NOT EXISTS idx_items_list_id ON items(list_id);
CREATE INDEX IF NOT EXISTS idx_items_position ON items(position);

-- Create categories table for predefined categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  color VARCHAR(7) DEFAULT '#5bc0de',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, color) VALUES 
('Work', '#FF6B6B'),
('Personal', '#4ECDC4'),
('Shopping', '#45B7D1'),
('Health', '#96CEB4'),
('Study', '#FFEAA7'),
('Travel', '#DDA0DD'),
('Finance', '#98D8C8')
ON CONFLICT (name) DO NOTHING;

-- Insert sample data for testing (optional)
INSERT INTO lists (name, color, category, position) VALUES 
('My First List', '#5bc0de', 'Personal', 0),
('Work Tasks', '#FF6B6B', 'Work', 1),
('Shopping List', '#45B7D1', 'Shopping', 2)
ON CONFLICT DO NOTHING;

-- Insert sample items for the first list (optional)
INSERT INTO items (list_id, item_name, position) VALUES 
(1, 'Welcome to ColoredLists!', 0),
(1, 'Create your first task', 1),
(1, 'Organize with colors', 2)
ON CONFLICT DO NOTHING;