/**
 * Konfigurasi Tarif, Komisi, dan Finansial JasaKite.id
 * Seluruh konstanta keuangan disimpan di sini agar mudah diubah.
 */

// Persentase komisi platform saat pesanan selesai (8%)
export const PLATFORM_FEE_RATE = 0.08;

// Minimal penarikan dana freelancer (Rp25.000)
export const MIN_WITHDRAWAL_AMOUNT = 25000;

// Biaya penarikan dana (Rp0 untuk transparansi)
export const WITHDRAWAL_ADMIN_FEE = 0;

// Tarif iklan berbayar per hari per paket dasar
export const AD_PRICE_PER_DAY = 10000;

// Saluran Iklan yang tersedia
export const AD_CHANNELS = [
  {
    id: "web",
    name: "Slot 'Jasa Pilihan' di Beranda Web",
    description: "Tampil di section teratas beranda yang dilihat ribuan calon klien setiap hari.",
    priceMultiplier: 1.0,
  },
  {
    id: "social",
    name: "Media Sosial JasaKite (WhatsApp & Instagram)",
    description: "Dipromosikan lewat story Instagram @jasakite.id dan broadcast komunitas mahasiswa Pontianak.",
    priceMultiplier: 1.0,
  },
];

// Paket Langganan Premium Freelancer
export const PREMIUM_PLANS = {
  level1: {
    id: "level1",
    levelNumber: 1,
    name: "Premium 1",
    badgeLabel: "Premium 1",
    badgeColor: "bg-blue-50 text-brand-blue border-brand-blue/30",
    features: [
      "Jasa otomatis naik peringkat di atas non-premium pada katalog",
      "Badge 'Premium 1' terverifikasi di kartu jasa & profil",
      "Notifikasi instan pesanan masuk via WhatsApp",
      "Statistik jumlah klik kartu jasa",
    ],
    pricing: {
      1: {
        months: 1,
        price: 20000,
        normalPrice: 20000,
        discount: 0,
        label: "1 Bulan",
      },
      3: {
        months: 3,
        price: 45000,
        normalPrice: 60000,
        discount: 15000,
        label: "3 Bulan",
        savingsBadge: "Hemat Rp15.000",
      },
    },
  },
  level2: {
    id: "level2",
    levelNumber: 2,
    name: "Premium 2",
    badgeLabel: "Premium 2",
    badgeColor: "bg-orange-50 text-brand-orange border-brand-orange/30",
    features: [
      "Prioritas tertinggi (#1) di seluruh halaman katalog",
      "Masuk slot 'Rekomendasi Utama' di halaman beranda",
      "Badge eksklusif 'Premium 2' warna oranye",
      "Statistik performa lengkap (impresi, klik, & konversi pesanan)",
      "Bantuan prioritas customer care JasaKite 24/7",
    ],
    pricing: {
      1: {
        months: 1,
        price: 30000,
        normalPrice: 30000,
        discount: 0,
        label: "1 Bulan",
      },
      3: {
        months: 3,
        price: 75000,
        normalPrice: 90000,
        discount: 15000,
        label: "3 Bulan",
        savingsBadge: "Hemat Rp15.000",
      },
    },
  },
};

/**
 * Format angka ke mata uang Rupiah Indonesia (Rp)
 * @param {number} amount
 * @returns {string} Contoh: "Rp25.000"
 */
export function formatRupiah(amount) {
  const safeNum = Number(amount) || 0;
  return `Rp${safeNum.toLocaleString("id-ID")}`;
}

/**
 * Hitung rincian komisi platform dari harga jasa
 * @param {number} servicePrice
 * @returns {{ servicePrice: number, platformFee: number, freelancerReceives: number, feeRatePercent: number }}
 */
export function calculatePlatformEarnings(servicePrice) {
  const price = Number(servicePrice) || 0;
  const platformFee = Math.round(price * PLATFORM_FEE_RATE);
  const freelancerReceives = price - platformFee;

  return {
    servicePrice: price,
    platformFee,
    freelancerReceives,
    feeRatePercent: Math.round(PLATFORM_FEE_RATE * 100),
  };
}

