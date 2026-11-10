"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck, ArrowRight, Tag } from "lucide-react";
import Button from "@/components/ui/Button";

const BANNERS = [
  {
    id: 1,
    tag: "PROMO MAHASISWA BARU",
    title: "Voucher Diskon 15% Khusus Mahasiswa UNTAN & POLNEP",
    description:
      "Gunakan kode voucher KITEHEMAT15 saat checkout untuk perapian skripsi, olah data, atau desain kegiatan.",
    ctaText: "Klaim Voucher & Cari Jasa",
    ctaLink: "#katalog",
    bgColor: "from-brand-blue via-[#033c8c] to-brand-orange",
    accent: "KODE: KITEHEMAT15",
    badgeColor: "bg-amber-400 text-brand-blue",
  },
  {
    id: 2,
    tag: "PROTEKSI TRANSAKSI 100%",
    title: "Bebas Cemas dengan Rekening Penampung Escrow",
    description:
      "Dana pesananmu disimpan aman di JasaKite dan baru dicairkan ke freelancer setelah hasil pekerjaan kamu terima dan setujui.",
    ctaText: "Pelajari Sistem Escrow",
    ctaLink: "#cara-kerja",
    bgColor: "from-[#022b66] via-brand-blue to-[#0b63db]",
    accent: "AMAN & TERPERCAYA",
    badgeColor: "bg-emerald-400 text-slate-900",
  },
  {
    id: 3,
    tag: "TALENTA KAMPUS DI PONTIANAK",
    title: "Punya Keahlian Word, SPSS, Desain, atau Coding?",
    description:
      "Dapatkan penghasilan tambahan tanpa mengganggu jam kuliah. Verifikasi KTM kamu sekarang dan mulai terima order!",
    ctaText: "Daftar Jadi Freelancer",
    ctaLink: "/daftar",
    bgColor: "from-brand-orange via-[#ea580c] to-brand-blue",
    accent: "KHUSUS UNTAN & POLNEP",
    badgeColor: "bg-white text-brand-orange",
  },
];

export default function PromoBannerCarousel() {
  const [current, setCurrent] = useState(0);

  // Auto rotate every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % BANNERS.length);
  };

  const activeBanner = BANNERS[current];

  return (
    <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-card text-white select-none">
      <div
        className={`bg-gradient-to-r ${activeBanner.bgColor} p-6 sm:p-10 md:p-12 transition-all duration-500 min-h-[220px] sm:min-h-[260px] flex flex-col justify-between relative overflow-hidden`}
      >
        {/* Background decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-40 h-40 rounded-full bg-brand-orange/20 blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`text-[10px] sm:text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider ${activeBanner.badgeColor}`}
            >
              {activeBanner.tag}
            </span>
            <span className="text-[11px] text-white/90 bg-white/15 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Tag className="w-3 h-3 text-amber-300" />
              {activeBanner.accent}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-heading leading-tight mb-2 sm:mb-3">
            {activeBanner.title}
          </h2>

          <p className="text-xs sm:text-sm text-blue-100 sm:text-white/90 leading-relaxed mb-6 line-clamp-2 sm:line-clamp-none">
            {activeBanner.description}
          </p>

          <div className="flex items-center gap-3">
            <Link href={activeBanner.ctaLink}>
              <Button
                variant="primary"
                size="md"
                className="bg-brand-orange hover:bg-brand-orange-hover text-white shadow-floating font-semibold"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {activeBanner.ctaText}
              </Button>
            </Link>
          </div>
        </div>

        {/* Carousel Indicators & Controls */}
        <div className="relative z-10 flex items-center justify-between pt-4 mt-2 sm:mt-0 border-t border-white/15">
          <div className="flex items-center gap-1.5">
            {BANNERS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrent(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  current === idx ? "w-7 bg-brand-orange" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Slide Sebelumnya"
              className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/90 hover:text-white transition backdrop-blur-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Slide Selanjutnya"
              className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/90 hover:text-white transition backdrop-blur-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

