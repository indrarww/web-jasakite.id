/**
 * Daftar Kata Terlarang (Integritas Akademik JasaKite.id)
 * Sesuai aturan: Tidak boleh ada kata atau jasa perjokian akademik.
 * Simpan di file ini agar mudah ditambah/dikelola sewaktu-waktu.
 */

export const BLOCKED_WORDS = [
  "joki",
  "jokian",
  "penjoki",
  "kerjakan skripsi",
  "kerjakan tugas",
  "kerjakan ujian",
  "kerjakan kuis",
  "kerjakan pr",
  "kerjakan makalah",
  "bikinin tugas",
  "bikinkan tugas",
  "bikin skripsi",
  "buatkan skripsi",
  "buat skripsi",
  "joki uas",
  "joki uts",
  "joki kuis",
  "joki praktikum",
  "joki coding",
  "joki tugas akhir",
  "tembus turnitin",
  "manipulasi turnitin",
  "palsu kuesioner",
  "rekayasa data fiktif",
  "rekayasa kuesioner",
];

/**
 * Memeriksa apakah teks mengandung kata terlarang
 * @param {string} text Teks yang diperiksa
 * @returns {{ isBlocked: boolean, matchedWord: string | null }}
 */
export function checkAcademicIntegrity(text) {
  if (!text || typeof text !== "string") {
    return { isBlocked: false, matchedWord: null };
  }

  const normalized = text.toLowerCase();
  for (const word of BLOCKED_WORDS) {
    if (normalized.includes(word.toLowerCase())) {
      return { isBlocked: true, matchedWord: word };
    }
  }

  return { isBlocked: false, matchedWord: null };
}

