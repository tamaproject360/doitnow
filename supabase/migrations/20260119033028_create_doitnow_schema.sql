/*
  # Doitnow App Database Schema
  
  ## Overview
  Complete database schema for premium productivity and task management app.
  Includes tasks, categories, and user statistics tracking.
  
  ## New Tables
  
  ### `categories`
  - `id` (uuid, primary key) - Unique category identifier
  - `user_id` (uuid, foreign key) - Reference to auth.users
  - `name` (text) - Category name (e.g., "Work", "Personal")
  - `icon` (text) - Ionicon name for display
  - `color` (text) - Color hex code for category badge
  - `order_index` (integer) - For custom sorting
  - `created_at` (timestamptz) - Creation timestamp
  
  ### `tasks`
  - `id` (uuid, primary key) - Unique task identifier
  - `user_id` (uuid, foreign key) - Reference to auth.users
  - `category_id` (uuid, foreign key, nullable) - Optional category assignment
  - `title` (text) - Task title/description
  - `is_completed` (boolean) - Completion status
  - `completed_at` (timestamptz, nullable) - When task was completed
  - `due_date` (timestamptz, nullable) - Optional due date
  - `reminder_time` (timestamptz, nullable) - Optional reminder
  - `order_index` (integer) - For custom task ordering
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### `user_stats`
  - `id` (uuid, primary key) - Unique stats identifier
  - `user_id` (uuid, foreign key) - Reference to auth.users
  - `date` (date) - Date for the statistics
  - `tasks_completed` (integer) - Number of tasks completed on this date
  - `tasks_created` (integer) - Number of tasks created on this date
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Users can only access their own data
  - Separate policies for SELECT, INSERT, UPDATE, DELETE operations
  
  ## Indexes
  - Index on user_id for all tables for fast queries
  - Index on date for user_stats for heatmap queries
  - Index on is_completed and due_date for task filtering
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  icon text NOT NULL DEFAULT 'folder-outline',
  color text NOT NULL DEFAULT '#FF6B00',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  due_date timestamptz,
  reminder_time timestamptz,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  tasks_completed integer DEFAULT 0,
  tasks_created integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(user_id, order_index);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(user_id, is_completed);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_order ON tasks(user_id, order_index);

CREATE INDEX IF NOT EXISTS idx_user_stats_user_date ON user_stats(user_id, date DESC);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Users can view own categories"
  ON categories FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON categories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- User stats policies
CREATE POLICY "Users can view own stats"
  ON user_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON user_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON user_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update user stats when tasks are completed
CREATE OR REPLACE FUNCTION update_user_stats_on_task_complete()
RETURNS TRIGGER AS $$
BEGIN
  -- If task is being marked as completed
  IF NEW.is_completed = true AND OLD.is_completed = false THEN
    INSERT INTO user_stats (user_id, date, tasks_completed, tasks_created)
    VALUES (NEW.user_id, CURRENT_DATE, 1, 0)
    ON CONFLICT (user_id, date)
    DO UPDATE SET
      tasks_completed = user_stats.tasks_completed + 1,
      updated_at = now();
    
    -- Set completed_at timestamp
    NEW.completed_at = now();
  END IF;
  
  -- If task is being uncompleted
  IF NEW.is_completed = false AND OLD.is_completed = true THEN
    UPDATE user_stats
    SET
      tasks_completed = GREATEST(0, tasks_completed - 1),
      updated_at = now()
    WHERE user_id = NEW.user_id AND date = CURRENT_DATE;
    
    -- Clear completed_at timestamp
    NEW.completed_at = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for task completion stats
CREATE TRIGGER track_task_completion
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  WHEN (OLD.is_completed IS DISTINCT FROM NEW.is_completed)
  EXECUTE FUNCTION update_user_stats_on_task_complete();

-- Function to track task creation in stats
CREATE OR REPLACE FUNCTION update_user_stats_on_task_create()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (user_id, date, tasks_completed, tasks_created)
  VALUES (NEW.user_id, CURRENT_DATE, 0, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    tasks_created = user_stats.tasks_created + 1,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for task creation stats
CREATE TRIGGER track_task_creation
  AFTER INSERT ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats_on_task_create();