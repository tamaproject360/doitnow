import { create } from 'zustand';
import { database, Task, Category, UserStat } from '@/lib/database';

interface AppState {
  tasks: Task[];
  categories: Category[];
  userStats: UserStat[];
  isLoading: boolean;

  fetchTasks: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchUserStats: (days?: number) => Promise<void>;

  addTask: (title: string, categoryId?: string | null) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;

  addCategory: (name: string, icon?: string, color?: string) => Promise<void>;
  updateCategory: (categoryId: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  tasks: [],
  categories: [],
  userStats: [],
  isLoading: false,

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const tasks = await database.getTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      set({ isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await database.getCategories();
      set({ categories });
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  },

  fetchUserStats: async (days = 30) => {
    try {
      const userStats = await database.getStats(days);
      set({ userStats });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  },

  addTask: async (title, categoryId = null) => {
    try {
      const newTask = await database.addTask(title, categoryId);
      set({ tasks: [...get().tasks, newTask] });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  },

  toggleTask: async (taskId) => {
    try {
      await database.toggleTask(taskId);
      const tasks = get().tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              is_completed: !t.is_completed,
              completed_at: !t.is_completed ? new Date().toISOString() : null,
              updated_at: new Date().toISOString(),
            }
          : t
      );
      set({ tasks });
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  },

  deleteTask: async (taskId) => {
    try {
      await database.deleteTask(taskId);
      set({ tasks: get().tasks.filter((t) => t.id !== taskId) });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  },

  updateTask: async (taskId, updates) => {
    try {
      await database.updateTask(taskId, updates);
      const tasks = get().tasks.map((t) =>
        t.id === taskId
          ? { ...t, ...updates, updated_at: new Date().toISOString() }
          : t
      );
      set({ tasks });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  },

  addCategory: async (name, icon = 'folder-outline', color = '#FF6B00') => {
    try {
      const newCategory = await database.addCategory(name, icon, color);
      set({ categories: [...get().categories, newCategory] });
    } catch (error) {
      console.error('Error adding category:', error);
    }
  },

  updateCategory: async (categoryId, updates) => {
    try {
      await database.updateCategory(categoryId, updates);
      const categories = get().categories.map((c) =>
        c.id === categoryId ? { ...c, ...updates } : c
      );
      set({ categories });
    } catch (error) {
      console.error('Error updating category:', error);
    }
  },

  deleteCategory: async (categoryId) => {
    try {
      await database.deleteCategory(categoryId);
      set({ categories: get().categories.filter((c) => c.id !== categoryId) });
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  },
}));
