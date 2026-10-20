# 🛍️ TokoSaya

Aplikasi web *e-commerce* modern yang menggabungkan kecepatan **React 19 + Vite** di sisi antarmuka dan ketangguhan **Laravel RESTful API** di sisi *backend*. 

TokoSaya dibangun dengan identitas visual khas bertema **Neo-Minimalist Sharp Edges** — seluruh elemen antarmuka (kartu, tombol, formulir, hingga modal) mengusung sudut serba kotak tegas (`rounded-none`), aksen warna Indigo TokoSaya (`#4F46E5`), border slate minimalis, dan tipografi Canva Sans yang bersih.

---

## ✨ Fitur Utama

### 🛍️ Sisi Pembeli (Front Store)
* **Katalog Produk Dinamis**: Menampilkan barang dagangan langsung dari database server secara *real-time*.
* **Filter & Pencarian Cepat**: Cari barang berdasarkan nama dan saring produk berdasarkan kategori (Sepatu, Pakaian, Tas, Aksesori, dll).
* **Detail Produk & Galeri**: Halaman rincian barang lengkap dengan deskripsi, spesifikasi, dan pilihan varian.
* **Keranjang Belanja (*Cart*)**: Kelola jumlah belanjaan secara instan dengan penyimpanan sesi lokal (*local storage*).
* **Alur Checkout Praktis**: Ringkasan biaya otomatis, pilihan opsi pengiriman, dan simulasi proses pembayaran yang mulus.
* **BrandLoader Eksklusif**: Animasi *loading* bernuansa brand TokoSaya dengan efek denyut lembut (*soft breathing pulse*) tanpa *spinner* lingkaran biasa.

### 🛡️ Sisi Pengelola (Admin Dashboard)
* **Autentikasi Terproteksi**: Login admin berbasis *token* autentikasi Laravel Sanctum lengkap dengan proteksi rute (*Route Guarding*).
* **Ringkasan Inventaris**: Kartu metrik informatif untuk memantau total item barang, ragam kategori, dan estimasi stok.
* **Katalog Kartu Responsif**: Tampilan grid kartu produk modern yang rapi untuk menggantikan tabel kaku biasa.
* **CRUD Produk Komprehensif**:
  * **Tambah & Edit Produk**: Kelola nama barang, harga, stok, kategori ID, dan deskripsi.
  * **Dual Upload Gambar**: Bebas pilih unggah file foto langsung dari perangkat lokal (tersimpan aman di *storage* publik Laravel) atau cukup gunakan tautan URL gambar.
  * **Hapus Produk**: Fitur hapus data dengan dialog konfirmasi aman untuk mencegah salah klik.
  * **Sinkronisasi Otomatis & Tombol Segarkan**: Dilengkapi tombol *refresh* manual serta penanganan galat *404 Not Found* yang anggun jika data di server berubah.

---

## 🛠️ Teknologi yang Digunakan

| Bagian | Teknologi |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router v7 |
| **Backend** | Laravel (REST API), Laravel Sanctum |
| **Database** | MySQL |
| **Font Utama** | Canva Sans |

---

## 🚀 Panduan Menjalankan Proyek

Pastikan Anda sudah menyiapkan Node.js, PHP, dan Composer di komputer Anda (misal menggunakan Laragon atau XAMPP).

### 1. Menyalakan Backend (Laravel)
1. Buka terminal dan masuk ke folder proyek Laravel Anda:
   ```bash
   cd path/ke/belajar-laravel
   ```
2. Pastikan database MySQL sudah aktif dan file `.env` sudah terkonfigurasi dengan benar.
3. Hubungkan folder penyimpanan gambar ke publik (cukup sekali di awal):
   ```bash
   php artisan storage:link
   ```
4. Jalankan server API backend:
   ```bash
   php artisan serve
   ```
   *Backend lokal berjalan di: `http://localhost:8000` (atau gunakan live API: `https://api.sumestawsome.xyz`)*

### 2. Menyalakan Frontend (React + Vite)
1. Buka terminal baru dan masuk ke folder proyek frontend TokoSaya:
   ```bash
   cd path/ke/toko-saya
   ```
2. Pasang pustaka dependensi (jika baru pertama kali mengklona proyek):
   ```bash
   npm install
   ```
3. Nyalakan server pengembang:
   ```bash
   npm run dev
   ```
   *Frontend akan berjalan di: `http://localhost:5173`*

---

## 🔑 Kredensial Akun Demo Admin

Untuk mencoba fitur pengelolaan produk di halaman Admin Dashboard (`/admin/dashboard`):

* **Halaman Login**: `/login`
* **Email**: `admin@gmail.com`
* **Password**: `admin12345`

---

## 👨‍💻 Pembuat

Dikembangkan oleh **[sumestawsome](https://github.com/sumestawsome)**  
Kunjungi portofolio: [sumestawsome.pages.dev](https://sumestawsome.pages.dev)
