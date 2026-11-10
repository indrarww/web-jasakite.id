/**
 * Kategori Layanan Resmi JasaKite.id
 * Pemetaan tunggal kategori & warna sesuai Brand Guidelines:
 * - Jasa Lainnya = Kuning (#FFC93C, text: navy)
 * - Edit Video & Foto = Ungu (#6D4AFF, text: white)
 * - Desain Organisasi = Pink Koral (#FF5C7A, text: white)
 * - Edukasi & Private Tutor = Tosca (#0FA3A3, text: white)
 * - Logistik Kampus = Oranye (#FF7420, text: white)
 *
 * Dipakai konsisten pada:
 * - Ubin kategori beranda
 * - Ribbon kartu katalog
 * - Chip filter
 * - Breadcrumb
 * - Placeholder SafeImage
 * - Garis aksen judul detail jasa
 */

import { ASSETS } from "./assets.js";

export const CATEGORIES = [
  {
    id: "jasa-lainnya",
    name: "Jasa Lainnya",
    shortName: "Serba-serbi",
    description: "Titip beli, survei lokasi, riset jadwal buka/tutup, promosi jualan, admin medsos, & input data ringan.",
    iconName: "HelpCircle",
    image: ASSETS.kategori.jasaLainnya,
    tags: ["Titip Beli", "Survei Lokasi", "Promosi Jualan", "Admin Medsos"],
    popularCount: "380+ selesai",
    // Color mapping
    colorKey: "kuning",
    colorHex: "#FFC93C",
    tintHex: "#FFF6D6",
    textHex: "#0B1F4D", // Contrast AA compliant: Navy on Yellow
    borderHex: "#F5BA20",
    bgClass: "bg-[#FFC93C]",
    tintClass: "bg-[#FFF6D6]",
    textClass: "text-[#0B1F4D]",
    borderClass: "border-[#F5BA20]",
    ribbonClass: "bg-[#FFC93C] text-[#0B1F4D]",
    badgeClass: "bg-[#FFF6D6] text-[#0B1F4D] border border-[#F5BA20]",
  },
  {
    id: "edit-video-foto",
    name: "Edit Video & Foto",
    shortName: "Video & Foto",
    description: "Reels Instagram, TikTok, retouch foto estetik, color grading, thumbnail YouTube, & dokumentasi acara.",
    iconName: "Video",
    image: ASSETS.kategori.editVideoFoto,
    tags: ["Reels & TikTok", "Retouch Foto", "Color Grading", "Thumbnail"],
    popularCount: "420+ selesai",
    // Color mapping
    colorKey: "ungu",
    colorHex: "#6D4AFF",
    tintHex: "#EEE9FF",
    textHex: "#FFFFFF",
    borderHex: "#5A38E8",
    bgClass: "bg-[#6D4AFF]",
    tintClass: "bg-[#EEE9FF]",
    textClass: "text-[#6D4AFF]",
    borderClass: "border-[#6D4AFF]",
    ribbonClass: "bg-[#6D4AFF] text-white",
    badgeClass: "bg-[#EEE9FF] text-[#6D4AFF] border border-[#D4C7FF]",
  },
  {
    id: "desain-organisasi",
    name: "Desain Organisasi",
    shortName: "Desain",
    description: "Poster kegiatan BEM/HIMA, feeds Instagram kepanitiaan, pamflet event, banner, & ID card seminar.",
    iconName: "Palette",
    image: ASSETS.kategori.desainOrganisasi,
    tags: ["Poster BEM / HIMA", "Feed Instagram", "Banner Spanduk", "ID Card"],
    popularCount: "510+ selesai",
    // Color mapping
    colorKey: "coral",
    colorHex: "#FF5C7A",
    tintHex: "#FFE6EB",
    textHex: "#FFFFFF",
    borderHex: "#E84464",
    bgClass: "bg-[#FF5C7A]",
    tintClass: "bg-[#FFE6EB]",
    textClass: "text-[#FF5C7A]",
    borderClass: "border-[#FF5C7A]",
    ribbonClass: "bg-[#FF5C7A] text-white",
    badgeClass: "bg-[#FFE6EB] text-[#FF5C7A] border border-[#FFC2CD]",
  },
  {
    id: "tutor",
    name: "Edukasi & Private Tutor",
    shortName: "Tutor Privat",
    description: "Tutor 1-on-1 privat matematika dasar/kalkulus, dasar pemrograman (Python/C++), & persiapan TOEFL.",
    iconName: "GraduationCap",
    image: ASSETS.kategori.tutor,
    tags: ["Matematika Dasar", "Pemrograman", "TOEFL Prep", "Logika Coding"],
    popularCount: "230+ sesi",
    // Color mapping
    colorKey: "tosca",
    colorHex: "#0FA3A3",
    tintHex: "#DDF5F3",
    textHex: "#FFFFFF",
    borderHex: "#0C8A8A",
    bgClass: "bg-[#0FA3A3]",
    tintClass: "bg-[#DDF5F3]",
    textClass: "text-[#0FA3A3]",
    borderClass: "border-[#0FA3A3]",
    ribbonClass: "bg-[#0FA3A3] text-white",
    badgeClass: "bg-[#DDF5F3] text-[#0FA3A3] border border-[#B7ECE7]",
  },
  {
    id: "logistik-kampus",
    name: "Logistik Kampus",
    shortName: "Logistik",
    description: "Print, jilid dan antar ke kampus UNTAN/POLNEP, serta fotografi wisuda di spot Pontianak.",
    iconName: "Truck",
    image: ASSETS.kategori.logistikKampus,
    tags: ["Print, Jilid & Antar", "Antar Kampus", "Foto Wisuda"],
    popularCount: "640+ pesanan",
    // Color mapping
    colorKey: "oranye",
    colorHex: "#FF7420",
    tintHex: "#FFF1E8",
    textHex: "#FFFFFF",
    borderHex: "#E05E10",
    bgClass: "bg-[#FF7420]",
    tintClass: "bg-[#FFF1E8]",
    textClass: "text-[#FF7420]",
    borderClass: "border-[#FF7420]",
    ribbonClass: "bg-[#FF7420] text-white",
    badgeClass: "bg-[#FFF1E8] text-[#FF7420] border border-[#FFD0B3]",
  },
];

export const getCategoryById = (id) => {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
};

export const getCategoryColor = (categoryId) => {
  const cat = getCategoryById(categoryId);
  return {
    hex: cat.colorHex,
    tint: cat.tintHex,
    text: cat.textHex,
    ribbonClass: cat.ribbonClass,
    badgeClass: cat.badgeClass,
  };
};
