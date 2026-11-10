# JasaKite.id - Marketplace Jasa Freelancer Mahasiswa Pontianak

> **"Jasa dari Mahasiswa, untuk Mahasiswa"**  
> Prototipe MVP Frontend Marketplace Jasa Mahasiswa di Pontianak.  
> **Freelancer**: Mahasiswa Universitas Tanjungpura (UNTAN) & Politeknik Negeri Pontianak (POLNEP) terverifikasi KTM.  
> **Pemesan**: Siapa saja (masyarakat umum, alumni, instansi, mahasiswa mana pun) bebas tanpa syarat KTM/NIM.  
> Transaksi aman terlindungi dengan sistem penampungan dana Escrow.

---

## 📌 Ruang Lingkup & Kebijakan Platform

- **Perguruan Tinggi Freelancer (UNTAN & POLNEP)**:
  1. **Universitas Tanjungpura (UNTAN)**
  2. **Politeknik Negeri Pontianak (POLNEP)**
  Seluruh konfigurasi kampus tersimpan modular di `src/config/campuses.js`.
- **Akun Pemesan Terbuka Bebas**: Siapa saja dapat mendaftar menggunakan nama, nomor WhatsApp (format Indonesia 08xx / +62), dan password tanpa perlu KTM/NIM.
- **Pedoman Integritas Akademik**: Platform melarang keras seluruh jasa perjokian karya ilmiah (skripsi, tugas, atau ujian). Tersedia filter kata terlarang otomatis di `src/config/blocked-words.js` dan halaman kebijakan di `/integritas`.
- **Komisi Platform 8%**: Komisi JasaKite sebesar 8% dipotong secara transparan dari harga pesanan yang selesai; freelancer menerima 92%. Konstanta tersimpan di `src/config/pricing.js`.
- **Privasi Nomor Kontak**: Nomor WhatsApp pembeli dan penjual disembunyikan sebelum transaksi dibayar. Sebelum pembayaran, seluruh komunikasi dilakukan lewat fitur chat dalam aplikasi (`/chat`).

---

## 🚀 Rute & Halaman Aplikasi

| Rute Halaman | Deskripsi & Fitur Utama | Aksesibilitas |
| :--- | :--- | :--- |
| `/` | Beranda, Banner Promo, Kategori, Slot "Jasa Pilihan" (Iklan), dan Katalog Jasa dengan prioritas tier Premium. | Publik |
| `/login` | Login Pemesan (WhatsApp + password), Freelancer (Email kampus/NIM + password), dan Admin demo. | Publik |
| `/daftar` | Pendaftaran Pemesan (tanpa KTM) & Pendaftaran Freelancer (multi-langkah verifikasi KTM UNTAN/POLNEP). | Publik |
| `/lupa-password` | Layanan pemulihan kata sandi akun. | Publik |
| `/jasa/[id]` | Detail jasa, paket reguler/kilat, sampel karya portofolio, ulasan mahasiswa, tombol "Ajak Diskusi", dan "Laporkan Jasa". | Publik |
| `/pesan/[id]` | Formulir pemesanan, unggah brief tugas, pilihan metode pembayaran, dan proteksi Escrow. | Wajib Login |
| `/pesanan` | Daftar riwayat transaksi pesanan (Semua, Sedang Berjalan, Selesai). | Wajib Login |
| `/pesanan/[id]` | Pelacakan status 4 langkah, penyerahan berkas draf akhir, rilis dana Escrow, dan rincian komisi 8%. | Wajib Login |
| `/chat` & `/chat/[id]` | Ruang obrolan dua panel (desktop) / layar penuh (mobile), kartu jasa tertaut, sensor kontak otomatis, kirim lampiran maks 10 MB, dan tombol "Buat Pesanan". | Wajib Login |
| `/dasbor` | Dasbor freelancer, metrik performa, daftar pesanan aktif, kirim draf, dan formulir tambah jasa bermoderasi integritas. | Freelancer |
| `/dasbor/pencairan` | Pencairan saldo (min. Rp25.000, biaya admin Rp0), rekening tersimpan dengan nomor tersamar, konfirmasi modal, dan ekspor CSV. | Freelancer |
| `/dasbor/premium` | Tingkatan Premium 1 & Premium 2 (1 bulan & 3 bulan hemat), perbandingan manfaat, dan simulasi pembayaran. | Freelancer |
| `/dasbor/iklan` | Pemasangan iklan berbayar Rp10.000/hari, pilihan saluran (Web Beranda & Medsos), status peninjauan, dan metrik performa. | Freelancer |
| `/integritas` | Halaman statis Pedoman Integritas Akademik JasaKite. | Publik |
| `/admin` | Dasbor COO Admin JasaKite: Ringkasan pendapatan platform (komisi 8%, premium, iklan), antrean verifikasi KTM, pencairan dana, review iklan, dan laporan jasa. | Akun Admin |

---

## ⚙️ File Konfigurasi yang Mudah Diubah

Seluruh nilai operasional dan aturan finansial disimpan dalam file konfigurasi terpusat:

1. **`src/config/pricing.js`**:
   - `PLATFORM_FEE_RATE = 0.08` (Komisi platform 8%)
   - `MIN_WITHDRAWAL_AMOUNT = 25000` (Minimal penarikan dana Rp25.000)
   - `AD_PRICE_PER_DAY = 10000` (Tarif iklan dasar per hari)
   - `PREMIUM_PLANS`: Tarif langganan Level 1 & Level 2 (1 bulan & 3 bulan)
2. **`src/config/blocked-words.js`**:
   - `BLOCKED_WORDS`: Daftar kata terlarang moderasi integritas akademik (joki, kerjakan skripsi, ujian, dll.)
   - `checkAcademicIntegrity(text)`: Fungsi validator otomatis
3. **`src/config/campuses.js`**:
   - Daftar perguruan tinggi resmi: UNTAN & POLNEP beserta jurusan dan domain email resmi
4. **`src/config/categories.js`**:
   - 5 kategori resmi: *Jasa Lainnya*, *Edit Video & Foto*, *Desain Organisasi*, *Edukasi & Private Tutor*, *Logistik Kampus*
5. **`src/config/assets.js`**:
   - Pemetaan seluruh berkas gambar lokal

---

## 👥 Akun Demo Siap Pakai

Tersedia tombol satu klik pada kotak demo di halaman `/login`:

1. **Akun Pemesan (Customer Siapa Saja)**:
   - **WhatsApp**: `081234567890`
   - **Password**: `password123`
   - **Peran**: Pemesan (Dapat memesan jasa, chat, dan merilis dana Escrow)
2. **Akun Freelancer Mahasiswa**:
   - **Email / NIM**: `freelancer@polnep.ac.id` atau `3202116045`
   - **Password**: `password123`
   - **Kampus**: Politeknik Negeri Pontianak (POLNEP) - Terverifikasi KTM
   - **Peran**: Freelancer (Akses penuh ke Dasbor, Pencairan, Premium, dan Iklan)
3. **Akun Admin COO Platform**:
   - **Username / Email**: `admin` atau `admin@jasakite.id`
   - **Password**: `admin123`
   - **Peran**: Admin (Akses ke `/admin` untuk melihat omzet pendapatan dan memproses antrean verifikasi)

---

## 🛠️ Cara Menjalankan Proyek Secara Lokal

1. **Pastikan Node.js 18+ terpasang**:
   ```bash
   node -v
   ```

2. **Pasang dependensi proyek**:
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan**:
   ```bash
   npm run dev
   ```
   Buka browser di `http://localhost:3000`.

4. **Kompilasi build produksi**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📝 Asumsi yang Diambil

1. **Penyimpanan State**: Seluruh data simulasi (pesanan, riwayat penarikan, percakapan chat, dan pendaftaran baru) disimpan secara persisten di browser klien via `localStorage` sehingga data tetap ada saat halaman dimuat ulang.
2. **Normalisasi Nomor WhatsApp**: Nomor kontak yang diinput pengguna diawali `08xx` atau `+628xx` secara otomatis dinormalisasi menjadi format numerik standar `628xxxxxxxx`.
3. **Sensor Kontak Sebelum Pembayaran**: Sistem menyamarkan nomor telepon dan tautan media sosial di ruang chat menggunakan regex sederhana sampai pesanan mencapai status `verified` atau lebih tinggi.
4. **Desain Visual Konsisten**: Menggunakan pendekatan flat, radius kecil (`rounded-md` / `rounded-lg`), tipografi Plus Jakarta Sans terpadu, dan format mata uang Rupiah Indonesia (`Rp...`).
