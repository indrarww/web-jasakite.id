# Panduan dan Spesifikasi Aset Gambar JasaKite.id

Dokumen ini memuat daftar seluruh aset gambar yang digunakan pada website prototipe **JasaKite.id**. Seluruh gambar dimasukkan langsung oleh pemilik proyek atau pengguna di folder `/public/assets/`. 

Semua path gambar dirujuk secara terpusat melalui satu file konfigurasi:
`src/config/assets.js`

Komponen `<SafeImage />` digunakan di seluruh aplikasi. Jika file gambar belum dimasukkan atau gagal dimuat, sistem menampilkan blok warna solid sesuai warna resmi kategori layanan + ikon kategori besar + inisial nama freelancer, tanpa gambar rusak dan tanpa pergeseran tata letak (*Cumulative Layout Shift*).

---

## Tabel Pemetaan Aset

| Kategori | Nama File | Lokasi Simpan | Digunakan di Halaman | Rasio / Ukuran Rekomendasi | Catatan & Keterangan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Logo** | `logo-jasakite.png` | `/public/assets/logo/` | Header, Footer, Auth (/login, /daftar) | ~4:1 (~300 x 75 px, PNG transparan) | Monogram JK + wordmark JasaKite. **Wajib di-crop rapat tanpa padding putih berlebih** di sekitarnya agar tampil tajam, jelas, dan proporsional. Logo ditampilkan menggunakan `object-contain` dengan tinggi minimal 40px di header dan 48–56px di dalam kotak putih panel login serta footer. |
| **Logo** | `favicon.png` | `/public/assets/logo/` | Tab browser & metadata | 1:1 (64 x 64 px / 128 x 128 px) | Ikon monogram JK geometris |
| **Hero** | `hero-1.jpg` s.d `hero-4.jpg` | `/public/assets/hero/` | Beranda (Kolase Hero Kanan) | 4:3 (~600 x 450 px, JPG/WebP) | Foto mahasiswa Pontianak sedang berkarya, editing video, diskusi poster, dan logistik |
| **Kategori** | `jasa-lainnya.png` | `/public/assets/kategori/` | Beranda & Katalog (/jasa) | 1:1 (~160 x 160 px, PNG) | Ikon/ilustrasi Kategori Jasa Lainnya (kuning) |
| **Kategori** | `edit-video-foto.png` | `/public/assets/kategori/` | Beranda & Katalog (/jasa) | 1:1 (~160 x 160 px, PNG) | Ikon/ilustrasi Kategori Edit Video & Foto (ungu) |
| **Kategori** | `desain-organisasi.png` | `/public/assets/kategori/` | Beranda & Katalog (/jasa) | 1:1 (~160 x 160 px, PNG) | Ikon/ilustrasi Kategori Desain Organisasi (pink koral) |
| **Kategori** | `tutor.png` | `/public/assets/kategori/` | Beranda & Katalog (/jasa) | 1:1 (~160 x 160 px, PNG) | Ikon/ilustrasi Kategori Edukasi & Private Tutor (tosca) |
| **Kategori** | `logistik-kampus.png` | `/public/assets/kategori/` | Beranda & Katalog (/jasa) | 1:1 (~160 x 160 px, PNG) | Ikon/ilustrasi Kategori Logistik Kampus (oranye) |
| **Freelancer**| `avatar-1.jpg` s.d `avatar-10.jpg` | `/public/assets/freelancer/` | Kartu Jasa, Detail Jasa, Ulasan, Dasbor | 1:1 (~320 x 320 px, JPG/WebP) | Foto profil mahasiswa UNTAN & POLNEP |
| **Portofolio**| `porto-1.jpg` s.d `porto-16.jpg` | `/public/assets/portofolio/` | Kartu Jasa, Galeri Lightbox, Chat | 4:3 (~800 x 600 px, JPG/WebP) | Bukti karya nyata (desain feed, reels, dokumen jilid, dsb.) |
| **Kampus** | `logo-untan.png` | `/public/assets/kampus/` | Ubin Kampus, Badge Terverifikasi, Form Daftar | 1:1 (~240 x 240 px, PNG transparan) | Lambang Universitas Tanjungpura |
| **Kampus** | `logo-polnep.png` | `/public/assets/kampus/` | Ubin Kampus, Badge Terverifikasi, Form Daftar | 1:1 (~240 x 240 px, PNG transparan) | Lambang Politeknik Negeri Pontianak |
| **Kampus** | `foto-untan.jpg` | `/public/assets/kampus/` | Ubin Kampus Beranda | 16:9 (~800 x 450 px, JPG/WebP) | Foto gedung rektorat / ikon kampus UNTAN |
| **Kampus** | `foto-polnep.jpg` | `/public/assets/kampus/` | Ubin Kampus Beranda | 16:9 (~800 x 450 px, JPG/WebP) | Foto gedung gerbang / ikon kampus POLNEP |
| **Pembayaran**| `qris.png` | `/public/assets/pembayaran/` | Form Checkout Escrow (/pesan/[id]) | 3:1 (~240 x 80 px, PNG) | Standar QRIS Nasional Indonesia |
| **Pembayaran**| `shopeepay.png` | `/public/assets/pembayaran/` | Form Checkout Escrow (/pesan/[id]) | 3:1 (~240 x 80 px, PNG) | Logo ShopeePay |
| **Pembayaran**| `gopay.png` | `/public/assets/pembayaran/` | Form Checkout Escrow (/pesan/[id]) | 3:1 (~240 x 80 px, PNG) | Logo GoPay |
| **Pembayaran**| `ovo.png` | `/public/assets/pembayaran/` | Form Checkout Escrow (/pesan/[id]) | 3:1 (~240 x 80 px, PNG) | Logo OVO |
| **Pembayaran**| `dana.png` | `/public/assets/pembayaran/` | Form Checkout Escrow (/pesan/[id]) | 3:1 (~240 x 80 px, PNG) | Logo DANA |
| **Pembayaran**| `bank.png` | `/public/assets/pembayaran/` | Form Checkout Escrow & Pencairan Dana | 3:1 (~240 x 80 px, PNG) | Logo Jaringan Bank (Bank Kalbar, BCA, Mandiri, BRI, BNI) |

---

## Cara Kerja Komponen `<SafeImage />`

Komponen `<SafeImage />` terletak di [`src/components/ui/SafeImage.jsx`](file:///d:/project/web_project_manor/src/components/ui/SafeImage.jsx). 

Ketika file gambar di `/public/assets/` belum dimasukkan oleh pengguna atau mengalami kegagalan render:
1. Menampilkan latar belakang solid dengan kode warna resmi kategori jasa (Kuning, Ungu, Pink Koral, Tosca, atau Oranye).
2. Menampilkan ikon kategori berukuran besar di bagian tengah.
3. Menampilkan lencana inisial nama mahasiswa freelancer di pojok kiri bawah.
4. Mencegah tampilan broken image bawaan peramban (*broken image icon*).
5. Mempertahankan rasio aspek (`4:3` atau `1:1`) untuk memastikan kestabilan Cumulative Layout Shift (CLS).
