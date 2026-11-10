"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, AlertTriangle, BookOpen, CheckCircle, ArrowLeft } from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function IntegritasPage() {
  return (
    <div className="min-h-screen bg-surface-gray py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-blue hover:text-brand-orange transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <Logo variant="header" href="/" />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-ink-main">
                Pedoman Integritas Akademik JasaKite
              </h1>
              <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
                Komitmen kami menjaga etika dan kejujuran akademik di lingkungan kampus Pontianak
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-6 text-sm text-ink-main leading-relaxed">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-900 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Larangan Keras Perjokian Akademik</p>
                <p className="mt-1">
                  JasaKite.id secara tegas melarang seluruh bentuk layanan yang mengambil alih tanggung jawab akademik mahasiswa, termasuk pengerjaan skripsi, tesis, tugas kuliah, ujian, kuis, atau pemalsuan data penelitian.
                </p>
              </div>
            </div>

            <section>
              <h2 className="text-base font-bold text-brand-blue flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4" />
                1. Layanan yang DILARANG di JasaKite
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-ink-secondary">
                <li>
                  <strong className="text-ink-main">Joki Tugas / Skripsi:</strong> Menuliskan isi materi karya ilmiah, bab skripsi, makalah, atau laporan atas nama orang lain.
                </li>
                <li>
                  <strong className="text-ink-main">Joki Ujian / Kuis:</strong> Mengerjakan ujian tengah semester (UTS), ujian akhir semester (UAS), responsi, atau kuis daring.
                </li>
                <li>
                  <strong className="text-ink-main">Rekayasa Data Fiktif:</strong> Mengarang data kuesioner, memanipulasi instrumen penelitian, atau memasukkan data palsu.
                </li>
                <li>
                  <strong className="text-ink-main">Kecurangan Turnitin / Plagiarisme:</strong> Menggunakan teknik manipulasi teks atau karakter tak terlihat untuk mengelabui deteksi kesamaan.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-brand-blue flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4" />
                2. Layanan yang DIIZINKAN & Didukung
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-ink-secondary">
                <li>
                  <strong className="text-ink-main">Bimbingan & Tutor Privat:</strong> Pendampingan pemahaman konsep matematika, kalkulus, logika pemrograman, dan persiapan TOEFL mandiri.
                </li>
                <li>
                  <strong className="text-ink-main">Logistik & Percetakan:</strong> Cetak dokumen, jilid lakban/hardcover, dan pengantaran ke meja kampus.
                </li>
                <li>
                  <strong className="text-ink-main">Kreatif & Desain Organisasi:</strong> Pembuatan poster kegiatan BEM/HIMA, feeds Instagram kepanitiaan, banner, spanduk, dan dokumentasi acara.
                </li>
                <li>
                  <strong className="text-ink-main">Video & Fotografi:</strong> Editing video promosi, retouch foto, aftermovie kegiatan, dan sesi foto wisuda.
                </li>
                <li>
                  <strong className="text-ink-main">Jasa Serba-Serbi:</strong> Survei lokasi kosan mahasiswa baru, titip beli perlengkapan praktikum, input data transaksi toko online, dan admin media sosial.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-brand-blue mb-2">
                3. Sistem Moderasi Otomatis & Sanksi
              </h2>
              <p className="text-xs text-ink-secondary">
                Setiap judul dan deskripsi jasa yang dibuat atau diperbarui akan melalui filter moderasi kata terlarang secara otomatis. Jasa yang terindikasi melanggar akan langsung diblokir.
              </p>
              <p className="text-xs text-ink-secondary mt-2">
                Freelancer yang terbukti menawarkan jasa joki akan mendapatkan pembekuan akun permanen dan pencabutan verifikasi KTM mahasiswa UNTAN / POLNEP.
              </p>
            </section>

            <section className="pt-4 border-t border-gray-100">
              <h2 className="text-base font-bold text-brand-blue mb-1">
                4. Pelaporan Pelanggaran
              </h2>
              <p className="text-xs text-ink-secondary">
                Jika kamu menemukan jasa di platform JasaKite yang melanggar pedoman ini, silakan gunakan tombol <strong>"Laporkan Jasa"</strong> di halaman detail jasa terkait, atau hubungi tim pengawas kami di <strong>integritas@jasakite.id</strong>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

