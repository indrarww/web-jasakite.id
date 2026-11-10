import React from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { ShieldCheck, MapPin, Mail, MessageSquare, BookOpen } from "lucide-react";
import { SUPPORTED_CAMPUSES } from "@/config/campuses";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E3E8EF] mt-16">
      {/* Top Banner: Garansi Escrow & Label Peserta Tampil Sekali Saja */}
      <div className="bg-[#F5F7FA] border-b border-[#E3E8EF] py-4 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#FFF1E8] flex items-center justify-center text-brand-orange shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0B1F4D]">
                Garansi Keamanan Rekening Escrow JasaKite
              </p>
              <p className="text-[11px] text-gray-500">
                Dana ditampung aman dan baru diteruskan ke freelancer setelah pekerjaan kamu setujui.
              </p>
            </div>
          </div>
          <div className="text-xs font-bold text-[#0B1F4D] bg-white px-3 py-1.5 rounded-md border border-[#E3E8EF] shrink-0">
            Freelancer: mahasiswa UNTAN & POLNEP · Pemesan: siapa saja
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Kolom 1: Brand & Lokasi */}
          <div className="space-y-3">
            <Logo variant="footer" href="/" />
            <p className="text-xs text-gray-600 leading-relaxed">
              Marketplace jasa mahasiswa di Pontianak. Transaksi aman, terjangkau, dan saling memberdayakan.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
              <MapPin className="w-4 h-4 text-brand-orange shrink-0" />
              <span>Pontianak, Kalimantan Barat (WIB)</span>
            </div>
          </div>

          {/* Kolom 2: Dua Kampus */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-[#0B1F4D] uppercase tracking-wider">
              Dua Kampus Didukung
            </h5>
            <ul className="space-y-2 text-xs">
              {SUPPORTED_CAMPUSES.map((c) => (
                <li
                  key={c.id}
                  className="p-2.5 rounded-lg bg-[#F5F7FA] border border-[#E3E8EF] flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-[#0B1F4D] block">{c.shortName}</span>
                    <span className="text-[11px] text-gray-500">{c.name}</span>
                  </div>
                  <span className="px-1.5 py-0.5 text-[10px] bg-emerald-50 text-emerald-800 rounded font-bold">
                    Terverifikasi KTM
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Tautan Layanan */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-[#0B1F4D] uppercase tracking-wider">
              Layanan & Kebijakan
            </h5>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <Link href="/jasa" className="hover:text-brand-orange transition">
                  Katalog Semua Jasa
                </Link>
              </li>
              <li>
                <Link href="/daftar" className="hover:text-brand-orange transition">
                  Daftar Akun Baru
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-brand-orange transition">
                  Obrolan & Diskusi Jasa
                </Link>
              </li>
              <li>
                <Link
                  href="/integritas"
                  className="hover:text-brand-orange transition font-bold text-brand-blue flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-brand-orange" />
                  <span>Pedoman Integritas Akademik</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Kontak */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-[#0B1F4D] uppercase tracking-wider">
              Kontak Kami
            </h5>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-blue shrink-0" />
                <span>support@jasakite.id</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand-orange shrink-0" />
                <span>WhatsApp: +62 812-3456-7890</span>
              </div>
            </div>
            <div className="pt-2">
              <span className="inline-block text-[11px] bg-[#E8F0FC] text-brand-blue px-2.5 py-1 rounded font-bold">
                Jam Layanan: 08:00 - 22:00 WIB
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-[#E3E8EF] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© 2026 JasaKite.id — Platform Jasa Mahasiswa Pontianak.</p>
          <p>UNTAN & POLNEP Terverifikasi</p>
        </div>
      </div>
    </footer>
  );
}
