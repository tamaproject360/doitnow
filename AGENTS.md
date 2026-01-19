# Aturan 1: Selalu Akses Dokumentasi dan cari Informasi menggunakan MCP Context7 atau  Firecrawl Sebelum Menjalankan Kode

## Deskripsi
Sebelum melakukan eksekusi atau implementasi kode apa pun, selalu konsultasikan terlebih dahulu dengan server MCP Context7 atau MCP Firecrawl untuk mengakses dokumentasi dan contoh kode terbaru dari pustaka dan framework yang relevan. Hal ini memastikan bahwa implementasi didasarkan pada praktik terbaik terkini dan penggunaan API yang akurat.


# Aturan 2 : Manajemen Berkas & Sistem

- Hindari operasi destruktif seperti `rm -rf`; gunakan alternatif yang lebih aman seperti `trash`
- Jangan gunakan `sudo` kecuali benar-benar diperlukan. Jika perlu, minta pengguna untuk menjalankan `sudo` di jendela terminal terpisah
- Setelah melakukan operasi, simpan log perubahan atau ringkasan perubahan dalam berkas markdown di .claude/CHANGELOG.md
- Selalu simpan dokumentasi dalam berkas markdown di /docs, dilarang keras dan jangan pernah meletakan dokuemtasi di direktori utama (root)



# Aturan 3 : Membuat UI mengacu pada design-system
## Deskripsi
Untuk membuat UI harus selalu mengacu pada design-system.xml dan best practice dan standar industri, pastikan design konsisten di semua halaman termasuk dengan animasinya.

# Aturan 4: Manajemen Berkas & Sistem

- Hindari operasi destruktif seperti `rm -rf`; gunakan alternatif yang lebih aman seperti `trash`
- Jangan gunakan `sudo` kecuali benar-benar diperlukan. Jika perlu, minta pengguna untuk menjalankan `sudo` di jendela terminal terpisah
- Setelah melakukan operasi, simpan log perubahan atau ringkasan perubahan dalam berkas markdown di docs/CHANGELOG.md
- Selalu simpan dokumentasi dalam berkas markdown di /docs, jangan letakkan di direktori utama (root)

# Auran 4: Kualitas & Standar Kode

- Ikuti standar dan panduan pengodean yang telah ditetapkan untuk proyek tersebut
- Pecah fungsi monolitik yang besar menjadi fungsi-fungsi yang lebih kecil dan dapat digunakan kembali
- Hapus kode yang dikomentari dari versi final; jika kode tidak diperlukan, hapus saja
- Tangani peringatan linting dan pemformatan dengan segera

# Aturan 5: Dependensi & Pustaka

- Gunakan hanya pustaka yang stabil dan terpelihara dengan baik
- Hindari pustaka yang sudah usang (deprecated), kedaluwarsa, eksperimental, atau versi beta
- Jaga agar dependensi tetap mutakhir dengan versi stabil terbaru

# Aturan 6: Keamanan & Konfigurasi

- Jangan pernah menyertakan informasi sensitif (kunci API, kata sandi, data pribadi)
- Gunakan berkas konfigurasi atau variabel lingkungan alih-alih nilai yang ditulis langsung (hardcoded)

# Aturan 7 : Selalu Buat Checkpoint Setelah Menyelesaikan Tugas dan update progress serta Menyelesaikan Fitur atau perbaikan selalu akhiri dengan commit .git dan push ke github

## Deskripsi
Setelah menyelesaikan suatu tugas atau mencapai tonggak penting, selalu buat checkpoint dengan memperbarui daftar tugas (todo list). Hal ini memastikan pelacakan kemajuan dan memungkinkan rollback (kembali ke kondisi sebelumnya) jika diperlukan. Jangan membuat dokumentasi apapun setelah setiap menyelesaikan tugas, kamu hanya membuat dokumentasi apabila di minta oleh pengguna.

## Pedoman

- **Checkpoint Penyelesaian Tugas**: Saat tugas selesai, perbarui daftar tugas dengan status “selesai” dan sampaikan ringkasan ke pengguna mengenai apa yang telah dicapai dan juga mengupdate task.md
- **Dokumentasi Tonggak**: Untuk tugas kompleks dengan beberapa langkah, buat checkpoint pada titik-titik logis untuk melacak kemajuan.
- **Pelestarian Kondisi**: Pastikan semua perubahan tersimpan dengan benar dan proyek berada dalam kondisi berfungsi sebelum menandai tugas sebagai selesai.
- **Integrasi dengan Alur Kerja**: Jadikan pembuatan checkpoint sebagai bagian standar dari setiap penyelesaian tugas.
- **Commit dan Push ke GitHub**: Setelah menyelesaikan fitur atau perbaikan, selalu lakukan commit pada repository git lokal dan push perubahan tersebut ke GitHub untuk memastikan versi terbaru tersedia secara online.