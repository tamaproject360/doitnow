import * as SQLite from 'expo-sqlite';

export interface Task {
  id: string;
  title: string;
  is_completed: boolean;
  completed_at: string | null;
  due_date: string | null;
  reminder_time: string | null;
  category_id: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  order_index: number;
  created_at: string;
}

export interface UserStat {
  id: string;
  date: string;
  tasks_completed: number;
  tasks_created: number;
  created_at: string;
  updated_at: string;
}

class Database {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    if (this.db) return;
    
    this.db = await SQLite.openDatabaseAsync('doitnow.db');
    await this.createTables();
  }

  private async createTables() {
    if (!this.db) return;

    await this.db.execAsync(`
      PRAGMA journal_mode = WAL;
      
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT NOT NULL DEFAULT 'folder-outline',
        color TEXT NOT NULL DEFAULT '#FF6B00',
        order_index INTEGER NOT NULL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        category_id TEXT,
        title TEXT NOT NULL,
        is_completed INTEGER DEFAULT 0,
        completed_at TEXT,
        due_date TEXT,
        reminder_time TEXT,
        order_index INTEGER NOT NULL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS user_stats (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL UNIQUE,
        tasks_completed INTEGER DEFAULT 0,
        tasks_created INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(is_completed);
      CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
      CREATE INDEX IF NOT EXISTS idx_user_stats_date ON user_stats(date DESC);
    `);
  }

  generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    if (!this.db) await this.init();
    const result = await this.db!.getAllAsync<Task>(
      'SELECT * FROM tasks ORDER BY order_index ASC, created_at DESC'
    );
    return result.map(task => ({
      ...task,
      is_completed: Boolean(task.is_completed)
    }));
  }

  async addTask(title: string, categoryId: string | null = null): Promise<Task> {
    if (!this.db) await this.init();
    
    const tasks = await this.getTasks();
    const id = this.generateId();
    const now = new Date().toISOString();
    
    await this.db!.runAsync(
      'INSERT INTO tasks (id, title, category_id, order_index, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      [id, title, categoryId, tasks.length, now, now]
    );

    // Update stats
    const today = new Date().toISOString().split('T')[0];
    await this.db!.runAsync(
      `INSERT INTO user_stats (id, date, tasks_created, tasks_completed) 
       VALUES (?, ?, 1, 0)
       ON CONFLICT(date) DO UPDATE SET 
       tasks_created = tasks_created + 1,
       updated_at = ?`,
      [this.generateId(), today, now]
    );

    return {
      id,
      title,
      category_id: categoryId,
      is_completed: false,
      completed_at: null,
      due_date: null,
      reminder_time: null,
      order_index: tasks.length,
      created_at: now,
      updated_at: now,
    };
  }

  async toggleTask(taskId: string): Promise<void> {
    if (!this.db) await this.init();
    
    const task = await this.db!.getFirstAsync<Task>(
      'SELECT * FROM tasks WHERE id = ?',
      [taskId]
    );
    
    if (!task) return;

    const isCompleted = !task.is_completed;
    const now = new Date().toISOString();
    const completedAt = isCompleted ? now : null;

    await this.db!.runAsync(
      'UPDATE tasks SET is_completed = ?, completed_at = ?, updated_at = ? WHERE id = ?',
      [isCompleted ? 1 : 0, completedAt, now, taskId]
    );

    // Update stats
    const today = new Date().toISOString().split('T')[0];
    if (isCompleted) {
      await this.db!.runAsync(
        `INSERT INTO user_stats (id, date, tasks_completed, tasks_created) 
         VALUES (?, ?, 1, 0)
         ON CONFLICT(date) DO UPDATE SET 
         tasks_completed = tasks_completed + 1,
         updated_at = ?`,
        [this.generateId(), today, now]
      );
    } else {
      await this.db!.runAsync(
        `UPDATE user_stats SET 
         tasks_completed = MAX(0, tasks_completed - 1),
         updated_at = ?
         WHERE date = ?`,
        [now, today]
      );
    }
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    if (!this.db) await this.init();
    
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return;

    fields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(taskId);

    await this.db!.runAsync(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  async deleteTask(taskId: string): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.runAsync('DELETE FROM tasks WHERE id = ?', [taskId]);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    if (!this.db) await this.init();
    return await this.db!.getAllAsync<Category>(
      'SELECT * FROM categories ORDER BY order_index ASC'
    );
  }

  async addCategory(name: string, icon: string = 'folder-outline', color: string = '#FF6B00'): Promise<Category> {
    if (!this.db) await this.init();
    
    const categories = await this.getCategories();
    const id = this.generateId();
    const now = new Date().toISOString();
    
    await this.db!.runAsync(
      'INSERT INTO categories (id, name, icon, color, order_index, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, icon, color, categories.length, now]
    );

    return {
      id,
      name,
      icon,
      color,
      order_index: categories.length,
      created_at: now,
    };
  }

  async updateCategory(categoryId: string, updates: Partial<Category>): Promise<void> {
    if (!this.db) await this.init();
    
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return;
    values.push(categoryId);

    await this.db!.runAsync(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  async deleteCategory(categoryId: string): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.runAsync('DELETE FROM categories WHERE id = ?', [categoryId]);
  }

  // User Stats
  async getStats(days: number = 30): Promise<UserStat[]> {
    if (!this.db) await this.init();
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    return await this.db!.getAllAsync<UserStat>(
      'SELECT * FROM user_stats WHERE date >= ? ORDER BY date DESC',
      [startDateStr]
    );
  }
}

export const database = new Database();
