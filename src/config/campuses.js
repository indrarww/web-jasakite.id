/**
 * Konfigurasi Kampus yang Didukung JasaKite.id
 * Sesuai aturan lingkup proyek: HANYA UNTAN & POLNEP.
 * Mudah ditambah kampus lain di masa depan melalui file konfigurasi ini.
 */

export const SUPPORTED_CAMPUSES = [
  {
    id: "untan",
    name: "Universitas Tanjungpura",
    shortName: "UNTAN",
    emailDomains: ["@student.untan.ac.id", "@untan.ac.id"],
    defaultEmailDomain: "@student.untan.ac.id",
    logo: "/assets/kampus/logo-untan.png",
    address: "Jl. Prof. Dr. H. Hadari Nawawi, Pontianak",
    faculties: [
      "Fakultas Teknik",
      "Fakultas MIPA",
      "Fakultas Ekonomi dan Bisnis",
      "Fakultas Keguruan dan Ilmu Pendidikan",
      "Fakultas Hukum",
      "Fakultas Ilmu Sosial dan Ilmu Politik",
      "Fakultas Pertanian",
      "Fakultas Kehutanan",
      "Fakultas Kedokteran",
    ],
    majors: [
      "Teknik Informatika",
      "Sistem Informasi",
      "Teknik Sipil",
      "Teknik Elektro",
      "Manajemen",
      "Akuntansi",
      "Statistika",
      "Matematika",
      "Pendidikan Bahasa Inggris",
      "Farmasi",
      "Ilmu Komunikasi",
    ],
  },
  {
    id: "polnep",
    name: "Politeknik Negeri Pontianak",
    shortName: "POLNEP",
    emailDomains: ["@polnep.ac.id", "@student.polnep.ac.id"],
    defaultEmailDomain: "@polnep.ac.id",
    logo: "/assets/kampus/logo-polnep.png",
    address: "Jl. Jenderal Ahmad Yani, Pontianak",
    faculties: [
      "Jurusan Teknik Elektro",
      "Jurusan Teknik Sipil dan Perencanaan",
      "Jurusan Teknik Mesin",
      "Jurusan Akuntansi",
      "Jurusan Administrasi Bisnis",
      "Jurusan Teknologi Pertanian",
      "Jurusan Ilmu Kelautan dan Perikanan",
    ],
    majors: [
      "Teknik Informatika",
      "Teknologi Rekayasa Perangkat Lunak",
      "Teknik Multimedia Digital",
      "Akuntansi Sektor Publik",
      "Administrasi Bisnis Terapan",
      "Teknik Perancangan Perumahan",
      "Teknik Listrik",
      "Teknologi Pengolahan Hasil Perkebunan",
    ],
  },
];

export const getCampusById = (id) => {
  if (!id) return null;
  return SUPPORTED_CAMPUSES.find((c) => c.id.toLowerCase() === id.toLowerCase()) || null;
};

export const getCampusByShortName = (shortName) => {
  if (!shortName) return null;
  return SUPPORTED_CAMPUSES.find((c) => c.shortName.toUpperCase() === shortName.toUpperCase()) || null;
};

export const validateCampusEmail = (email, campusId) => {
  if (!email || !campusId) return { valid: false, message: "Email dan kampus harus diisi" };
  const campus = getCampusById(campusId);
  if (!campus) return { valid: false, message: "Kampus tidak terdaftar di sistem" };

  const lowerEmail = email.trim().toLowerCase();
  const matched = campus.emailDomains.some((domain) => lowerEmail.endsWith(domain.toLowerCase()));
  if (!matched) {
    return {
      valid: false,
      message: `Email kampus ${campus.shortName} harus berakhiran ${campus.emailDomains.join(" atau ")}`,
    };
  }
  return { valid: true, message: "Email kampus valid" };
};

