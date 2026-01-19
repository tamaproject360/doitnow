# Migration dari Supabase ke SQLite

## Perubahan yang Dilakukan

Aplikasi Doitnow telah diubah dari menggunakan Supabase (cloud database) menjadi SQLite (local database) untuk mendukung penggunaan offline penuh.

### File yang Diubah

1. **lib/database.ts** (BARU)
   - Service baru untuk mengelola SQLite database
   - Implementasi semua operasi CRUD untuk tasks, categories, dan user_stats
   - Menggunakan expo-sqlite untuk akses database lokal

2. **store/useStore.ts** (DIPERBARUI)
   - Menghapus logika guest mode dan Supabase
   - Semua operasi sekarang menggunakan SQLite
   - State management tetap menggunakan Zustand

3. **app/_layout.tsx** (DIPERBARUI)
   - Menghapus auth listener Supabase
   - Menambahkan inisialisasi database SQLite
   - Load data saat aplikasi dimulai

4. **app/(tabs)/index.tsx** (DIPERBARUI)
   - Menghapus referensi ke isGuestMode

5. **app/(tabs)/profile.tsx** (DIPERBARUI)
   - Menghapus import supabase
   - Menghapus fungsi sign out
   - Update UI untuk menampilkan info local storage

6. **components/TaskCard.tsx** (DIPERBARUI)
   - Update import tipe Task dari database.ts

### File yang Dihapus

- `lib/supabase.ts` - Client Supabase tidak lagi diperlukan
- `lib/database.types.ts` - Tipe TypeScript dari Supabase
- `lib/guestStorage.ts` - Tidak perlu lagi karena semua data lokal
- `supabase/migrations/` - Schema database Supabase

### Dependencies yang Diubah

**Ditambahkan:**
- `expo-sqlite` - SQLite database untuk React Native

**Dihapus:**
- `@supabase/supabase-js` - Client Supabase
- `react-native-url-polyfill` - Dependency Supabase

## Struktur Database SQLite

### Tabel: tasks
```sql
CREATE TABLE tasks (
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
```

### Tabel: categories
```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'folder-outline',
  color TEXT NOT NULL DEFAULT '#FF6B00',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel: user_stats
```sql
CREATE TABLE user_stats (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,
  tasks_completed INTEGER DEFAULT 0,
  tasks_created INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## Keuntungan SQLite

1. **Offline-First**: Aplikasi bekerja 100% offline
2. **Privacy**: Data tidak pernah meninggalkan device
3. **Performance**: Akses data lebih cepat (no network latency)
4. **Simplicity**: Tidak perlu setup backend atau API keys
5. **Cost**: Gratis, tidak ada biaya cloud hosting

## Cara Menggunakan

1. Install dependencies:
   ```bash
   npm install
   ```

2. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

3. Database akan otomatis dibuat saat aplikasi pertama kali dijalankan
4. Semua data tersimpan di file `doitnow.db` di device

## Catatan

- Database file tersimpan di local storage device
- Data akan hilang jika aplikasi di-uninstall (kecuali ada backup)
- Tidak ada sinkronisasi antar device
- Cocok untuk aplikasi personal productivity yang fokus pada privacy dan offline usage
