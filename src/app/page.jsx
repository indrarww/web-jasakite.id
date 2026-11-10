"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SafeImage from "@/components/ui/SafeImage";
import ServiceCard from "@/components/home/ServiceCard";
import { DUMMY_SERVICES } from "@/config/dummyData";
import { CATEGORIES } from "@/config/categories";
import { SUPPORTED_CAMPUSES } from "@/config/campuses";
import { useOrders } from "@/context/OrderContext";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
  Users,
  Briefcase,
  GraduationCap,
  HelpCircle,
  Video,
  Palette,
  Truck,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { ads } = useOrders();

  // 1. Rotating words di Hero Kiri (tiap 2.5 detik)
  const rotatingWords = ["Edit video.", "Desain poster.", "Tutor privat.", "Titip beli."];
  const [wordIndex, setWordIndex] = useState(0);
  const [heroSearch, setHeroSearch] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [rotatingWords.length]);

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      router.push(`/jasa?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      router.push("/jasa");
    }
  };

  // 2. Data Iklan Berbayar Aktif untuk "Jasa Pilihan"
  const activeAdServices = React.useMemo(() => {
    const nowStr = new Date().toISOString().split("T")[0];
    const activeAdIds = ads
      .filter(
        (ad) =>
          ad.status === "aktif" &&
          ad.channels?.includes("web") &&
          (!ad.endDate || ad.endDate >= nowStr)
      )
      .map((ad) => ad.serviceId);

    const matched = DUMMY_SERVICES.filter(
      (s) => activeAdIds.includes(s.id) || s.isAdActive
    );
    return matched.length > 0 ? matched : DUMMY_SERVICES.slice(0, 4);
  }, [ads]);

  // Scroll handler untuk baris Jasa Pilihan
  const adScrollRef = useRef(null);
  const scrollAds = (direction) => {
    if (adScrollRef.current) {
      const offset = direction === "left" ? -340 : 340;
      adScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  // 3. Thematic Horizontal Rows untuk Katalog Beranda (3 tema berbeda)
  const videoFotoServices = DUMMY_SERVICES.filter((s) => s.category === "edit-video-foto");
  const desainServices = DUMMY_SERVICES.filter((s) => s.category === "desain-organisasi");
  const logistikServices = DUMMY_SERVICES.filter((s) => s.category === "logistik-kampus");

  // Ikon komponen untuk 5 kategori
  const categoryIconMap = {
    HelpCircle: HelpCircle,
    Video: Video,
    Palette: Palette,
    GraduationCap: GraduationCap,
    Truck: Truck,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* =========================================================
          2. HERO SECTION (Latar biru solid, bawah dipotong diagonal)
          ========================================================= */}
      <section className="relative bg-[#034BAE] text-white pt-12 pb-24 md:pt-16 md:pb-28 overflow-hidden">
        {/* Dekoratif potongan diagonal di sudut bawah */}
        <div
          className="absolute bottom-0 left-0 right-0 h-12 bg-[#FF7420] pointer-events-none"
          style={{ clipPath: "polygon(0 80%, 100% 0, 100% 100%, 0% 100%)" }}
        />

        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Kiri: H1 dengan kata berganti, search bar 56px, dan CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-xs rounded-full border border-white/20 text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#FFC93C]" />
                <span>Freelancer Mahasiswa UNTAN & POLNEP</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                <span className="block text-[#FFC93C] h-[1.2em] transition-all duration-300">
                  {rotatingWords[wordIndex]}
                </span>
                <span className="block text-white mt-1">
                  dari mahasiswa Pontianak.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-white/90 max-w-xl font-normal leading-relaxed">
                Pesan jasa kreatif, desain, tutor, dan logistik kampus dengan pembayaran aman via escrow.
              </p>

              {/* Search Bar Besar (Tinggi 56px) */}
              <form onSubmit={handleHeroSearchSubmit} className="relative max-w-xl">
                <div className="flex items-center h-14 bg-white rounded-lg border-2 border-white/40 shadow-md p-1.5 focus-within:border-[#FF7420] transition">
                  <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    placeholder="Cari edit video, poster BEM, jilid skripsi..."
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    className="w-full bg-transparent px-3 text-sm text-[#0B1F4D] placeholder-gray-500 focus:outline-none font-medium"
                  />
                  <button
                    type="submit"
                    className="h-11 px-5 bg-[#FF7420] hover:bg-[#E56315] text-white text-sm font-extrabold rounded-md shrink-0 flex items-center gap-1.5 transition"
                  >
                    <span>Cari</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Chip Pencarian Populer */}
                <div className="flex items-center gap-2 mt-3 flex-wrap text-xs text-white/80">
                  <span className="font-semibold text-white/60">Populer:</span>
                  {[
                    "Reels Instagram",
                    "Poster BEM",
                    "Print & Jilid",
                    "Tutor Python",
                    "Titip Beli",
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        setHeroSearch(chip);
                        router.push(`/jasa?q=${encodeURIComponent(chip)}`);
                      }}
                      className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-md text-white border border-white/20 transition"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </form>

              {/* Dua Tombol CTA Utama */}
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="/jasa"
                  className="px-6 py-3.5 bg-[#FF7420] hover:bg-[#E56315] text-white text-base font-extrabold rounded-lg shadow-sm transition inline-flex items-center gap-2"
                >
                  <span>Cari Jasa</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/daftar?role=freelancer"
                  className="px-6 py-3.5 bg-transparent hover:bg-white/10 text-white text-base font-extrabold rounded-lg border-2 border-white transition inline-flex items-center gap-2"
                >
                  <span>Jadi Freelancer</span>
                </Link>
              </div>
            </div>

            {/* Kanan: Kolase 3-4 foto bingkai miring (-4 s.d +4 derajat) + Chip Mengambang */}
            <div className="lg:col-span-5 relative hidden sm:flex items-center justify-center min-h-[380px]">
              {/* Foto 1 (Miring -4 derajat) */}
              <div
                className="absolute w-52 h-64 rounded-xl overflow-hidden border-4 border-white shadow-lg z-10 transition-transform duration-300 hover:scale-105"
                style={{ transform: "rotate(-4deg) translate(-50px, -20px)" }}
              >
                <SafeImage
                  src="/assets/hero/hero-1.jpg"
                  alt="Mahasiswa editing video"
                  fill
                  categoryId="edit-video-foto"
                  freelancerName="Siti Rahmawati"
                  className="object-cover"
                />
              </div>

              {/* Foto 2 (Miring +3 derajat) */}
              <div
                className="absolute w-56 h-68 rounded-xl overflow-hidden border-4 border-white shadow-xl z-20 transition-transform duration-300 hover:scale-105"
                style={{ transform: "rotate(3deg) translate(40px, 10px)" }}
              >
                <SafeImage
                  src="/assets/hero/hero-2.jpg"
                  alt="Desain poster mahasiswa"
                  fill
                  categoryId="desain-organisasi"
                  freelancerName="Rian Hidayat"
                  className="object-cover"
                />
              </div>

              {/* Foto 3 (Miring -2 derajat di belakang) */}
              <div
                className="absolute w-48 h-60 rounded-xl overflow-hidden border-4 border-white shadow-md z-5 opacity-90"
                style={{ transform: "rotate(-2deg) translate(10px, -70px)" }}
              >
                <SafeImage
                  src="/assets/hero/hero-3.jpg"
                  alt="Logistik kampus UNTAN POLNEP"
                  fill
                  categoryId="logistik-kampus"
                  freelancerName="Ahmad Maulana"
                  className="object-cover"
                />
              </div>

              {/* Floating Chip 1: Tosca (Tutor) */}
              <div
                className="absolute top-4 -left-6 z-30 px-3 py-1.5 bg-[#0FA3A3] text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 animate-float"
              >
                <GraduationCap className="w-4 h-4 text-white" />
                <span>Tutor 1-on-1 Privat</span>
              </div>

              {/* Floating Chip 2: Oranye (Logistik) */}
              <div
                className="absolute bottom-6 -right-4 z-30 px-3 py-1.5 bg-[#FF7420] text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 animate-float"
                style={{ animationDelay: "1.5s" }}
              >
                <Truck className="w-4 h-4 text-white" />
                <span>Antar Dokumen Kilat</span>
              </div>

              {/* Floating Chip 3: Pink Koral (Desain) */}
              <div
                className="absolute top-1/2 -right-8 z-30 px-3 py-1.5 bg-[#FF5C7A] text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 animate-float"
                style={{ animationDelay: "0.8s" }}
              >
                <Palette className="w-4 h-4 text-white" />
                <span>Desain Poster BEM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Diskon Pengguna Baru (Strip tipis di bawah hero) */}
      <div className="bg-[#FFF1E8] border-b border-[#FFD0B3] py-2.5 px-6">
        <div className="max-w-[1200px] mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-[#0B1F4D] text-center">
          <Sparkles className="w-4 h-4 text-brand-orange shrink-0" />
          <span>
            Diskon 15% untuk transaksi pertamamu. Gunakan kode voucher{" "}
            <span className="px-2 py-0.5 bg-white rounded border border-brand-orange/40 text-brand-orange">
              MAHASISWABARU
            </span>{" "}
            saat checkout!
          </span>
        </div>
      </div>

      {/* =========================================================
          3. STRIP ANGKA COUNT-UP (Latar Putih)
          ========================================================= */}
      <section className="bg-white border-b border-[#E3E8EF] py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* angka dummy statistik platform */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="pt-4 md:pt-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#034BAE] block">
                240+
              </span>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
                Freelancer Terverifikasi KTM
              </p>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#FF7420] block">
                1.420+
              </span>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
                Pesanan Selesai via Escrow
              </p>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0FA3A3] block">
                &lt; 15 Mnt
              </span>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
                Rata-rata Kecepatan Balas Chat
              </p>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0B1F4D] block">
                2 Kampus
              </span>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
                UNTAN & POLNEP Pontianak
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. KATEGORI UTAMA (5 Ubin Besar Berwarna, Latar Tint Biru)
          ========================================================= */}
      <section className="bg-[#E8F0FC] py-16 md:py-20 border-b border-[#E3E8EF]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-extrabold text-brand-blue uppercase tracking-wider block mb-1">
                Kategori Layanan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4D]">
                Skill kamu bisa jadi uang jajan.
              </h2>
            </div>
            <Link
              href="/jasa"
              className="text-xs sm:text-sm font-extrabold text-brand-blue hover:text-brand-orange inline-flex items-center gap-1 transition"
            >
              <span>Jelajah Semua Kategori</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 5 Ubin Besar Berwarna Sesuai Pemetaan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) => {
              const IconComp = categoryIconMap[cat.iconName] || HelpCircle;
              return (
                <Link
                  key={cat.id}
                  href={`/jasa?kategori=${cat.id}`}
                  className="rounded-xl p-5 border border-black/5 flex flex-col justify-between group transition-all duration-200 hover:-translate-y-1.5 shadow-xs relative overflow-hidden"
                  style={{
                    backgroundColor: cat.colorHex,
                    color: cat.textHex,
                  }}
                >
                  <div>
                    {/* Ikon 40px */}
                    <div className="w-12 h-12 rounded-lg bg-black/10 flex items-center justify-center mb-4 backdrop-blur-xs">
                      <IconComp className="w-7 h-7" strokeWidth={2} />
                    </div>
                    <h3
                      className="text-lg font-extrabold leading-snug mb-2"
                      style={{ color: cat.textHex }}
                    >
                      {cat.name}
                    </h3>
                    <p
                      className="text-xs opacity-85 leading-relaxed line-clamp-3 mb-4"
                      style={{ color: cat.textHex }}
                    >
                      {cat.description}
                    </p>
                  </div>

                  {/* Footer Ubin: Badge Tag & Panah Muncul saat Hover */}
                  <div className="pt-3 border-t border-black/10 flex items-center justify-between">
                    <span className="text-[11px] font-bold opacity-90">
                      {cat.popularCount}
                    </span>
                    <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          5. JASA PILIHAN (IKLAN BERBAYAR AKTIF, Latar Putih)
          ========================================================= */}
      <section className="bg-white py-16 md:py-20 border-b border-[#E3E8EF]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-[#0B1F4D] text-white text-xs font-extrabold rounded-sm tracking-wider uppercase">
                Iklan
              </span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4D]">
                  Jasa Pilihan Minggu Ini
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Dipromosikan langsung oleh freelancer mahasiswa aktif Pontianak.
                </p>
              </div>
            </div>

            {/* Tombol Panah Scroll */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollAds("left")}
                aria-label="Geser ke kiri"
                className="w-9 h-9 rounded-lg border border-[#E3E8EF] flex items-center justify-center text-gray-600 hover:bg-[#F5F7FA] transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollAds("right")}
                aria-label="Geser ke kanan"
                className="w-9 h-9 rounded-lg border border-[#E3E8EF] flex items-center justify-center text-gray-600 hover:bg-[#F5F7FA] transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Baris Horizontal Scroll-Snap */}
          <div
            ref={adScrollRef}
            className="flex items-stretch gap-5 overflow-x-auto pb-4 scroll-smooth snap-x scrollbar-none"
          >
            {activeAdServices.map((service, idx) => (
              <div
                key={service.id}
                className={`snap-start shrink-0 ${
                  idx === 0 ? "w-[340px] sm:w-[420px]" : "w-[260px] sm:w-[280px]"
                }`}
              >
                <ServiceCard service={service} isAd={true} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          6. KATALOG PER KATEGORI (3 Baris Bertema, Latar Tint Kuning)
          ========================================================= */}
      <section className="bg-[#FFF6D6] py-16 md:py-20 border-b border-[#E3E8EF]">
        <div className="max-w-[1200px] mx-auto px-6 space-y-14">
          {/* Baris 1: Edit Video & Foto */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-3 h-8 bg-[#6D4AFF] rounded-xs" />
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B1F4D]">
                  Edit Video & Konten Kreator
                </h3>
              </div>
              <Link
                href="/jasa?kategori=edit-video-foto"
                className="text-xs sm:text-sm font-bold text-[#0B1F4D] hover:text-[#6D4AFF] inline-flex items-center gap-1 transition"
              >
                <span>Lihat semua ({videoFotoServices.length})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {videoFotoServices.slice(0, 4).map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          </div>

          {/* Baris 2: Desain Organisasi & Kampus */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-3 h-8 bg-[#FF5C7A] rounded-xs" />
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B1F4D]">
                  Desain Publikasi & Poster BEM/HIMA
                </h3>
              </div>
              <Link
                href="/jasa?kategori=desain-organisasi"
                className="text-xs sm:text-sm font-bold text-[#0B1F4D] hover:text-[#FF5C7A] inline-flex items-center gap-1 transition"
              >
                <span>Lihat semua ({desainServices.length})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {desainServices.slice(0, 4).map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          </div>

          {/* Baris 3: Logistik Kampus & Antar Dokumen */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-3 h-8 bg-[#FF7420] rounded-xs" />
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B1F4D]">
                  Print, Jilid & Logistik Kampus
                </h3>
              </div>
              <Link
                href="/jasa?kategori=logistik-kampus"
                className="text-xs sm:text-sm font-bold text-[#0B1F4D] hover:text-[#FF7420] inline-flex items-center gap-1 transition"
              >
                <span>Lihat semua ({logistikServices.length})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {logistikServices.slice(0, 4).map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          7. CARA KERJA (Latar Biru Solid Penuh, Alur Horizontal 4 Titik)
          ========================================================= */}
      <section className="bg-[#034BAE] text-white py-16 md:py-20 border-b border-[#022B66]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-extrabold text-[#FFC93C] uppercase tracking-wider block mb-1">
              Alur Transaksi Escrow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Transaksi aman tanpa rasa cemas.
            </h2>
            <p className="text-sm text-white/80 mt-2">
              Dana kamu ditahan aman di rekening penampung JasaKite sampai hasil pekerjaan kamu setujui.
            </p>
          </div>

          {/* Garis Alur Horizontal 4 Titik (Bukan kartu bernomor) */}
          <div className="relative">
            {/* Garis penghubung horizontal */}
            <div className="hidden md:block absolute top-7 left-[12%] right-[12%] h-1 bg-white/20 z-0">
              <div className="h-full bg-[#FF7420] w-3/4 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {/* Titik 1: Pilih */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-white text-[#034BAE] flex items-center justify-center font-extrabold text-lg shadow-md mb-4 border-4 border-[#034BAE]">
                  <Search className="w-6 h-6 text-[#034BAE]" />
                </div>
                <h4 className="text-base font-extrabold text-white mb-1.5">1. Pilih Jasa</h4>
                <p className="text-xs text-white/80 leading-relaxed max-w-[220px]">
                  Cari keahlian yang kamu butuhkan atau ajak diskusi freelancer lewat chat dalam aplikasi.
                </p>
              </div>

              {/* Titik 2: Bayar via Escrow */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#FF7420] text-white flex items-center justify-center font-extrabold text-lg shadow-md mb-4 border-4 border-[#034BAE]">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-base font-extrabold text-white mb-1.5">2. Bayar via Escrow</h4>
                <p className="text-xs text-white/80 leading-relaxed max-w-[220px]">
                  Bayar melalui QRIS atau transfer. Uang aman disimpan oleh sistem JasaKite.
                </p>
              </div>

              {/* Titik 3: Dikerjakan */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#FFC93C] text-[#0B1F4D] flex items-center justify-center font-extrabold text-lg shadow-md mb-4 border-4 border-[#034BAE]">
                  <Clock className="w-6 h-6 text-[#0B1F4D]" />
                </div>
                <h4 className="text-base font-extrabold text-white mb-1.5">3. Dikerjakan</h4>
                <p className="text-xs text-white/80 leading-relaxed max-w-[220px]">
                  Freelancer menyelesaikan tugas sesuai brief dan mengirimkan draf hasil tepat waktu.
                </p>
              </div>

              {/* Titik 4: Selesai */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-extrabold text-lg shadow-md mb-4 border-4 border-[#034BAE]">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-base font-extrabold text-white mb-1.5">4. Selesai & Rilis</h4>
                <p className="text-xs text-white/80 leading-relaxed max-w-[220px]">
                  Cek berkas hasil. Setelah kamu setuju, dana baru diteruskan ke saldo dompet penjual.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          8. DUA KAMPUS (UNTAN & POLNEP, Latar Putih)
          ========================================================= */}
      <section className="bg-white py-16 md:py-20 border-b border-[#E3E8EF]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-extrabold text-brand-orange uppercase tracking-wider block mb-1">
              Dua Kampus Didukung
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4D]">
              Hanya mahasiswa terverifikasi.
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Seluruh freelancer wajib memiliki KTM aktif dari salah satu dari dua kampus ini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SUPPORTED_CAMPUSES.map((campus) => {
              const count = DUMMY_SERVICES.filter(
                (s) => s.freelancer.campus.toUpperCase() === campus.shortName.toUpperCase()
              ).length;
              return (
                <div
                  key={campus.id}
                  className="bg-[#F5F7FA] rounded-xl p-6 sm:p-8 border border-[#E3E8EF] flex flex-col justify-between hover:border-brand-blue/40 transition"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl bg-white border border-[#E3E8EF] p-2 flex items-center justify-center shrink-0 shadow-xs">
                      <SafeImage
                        src={campus.logo}
                        alt={`Logo ${campus.shortName}`}
                        width={48}
                        height={48}
                        categoryId="tutor"
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
                        {campus.shortName}
                      </span>
                      <h3 className="text-xl font-extrabold text-[#0B1F4D]">
                        {campus.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {campus.address}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E3E8EF] flex items-center justify-between">
                    <div className="text-xs text-gray-600 font-semibold">
                      <span className="text-sm font-extrabold text-[#0B1F4D] mr-1">
                        {count * 15}+
                      </span>
                      freelancer aktif
                    </div>
                    <Link
                      href={`/jasa?kampus=${campus.id}`}
                      className="px-4 py-2 bg-brand-blue text-white text-xs font-bold rounded-lg hover:bg-[#023985] transition inline-flex items-center gap-1.5"
                    >
                      <span>Lihat Jasa {campus.shortName}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          9. TESTIMONI & STRIP MARQUEE (Latar Navy #0B1F4D)
          ========================================================= */}
      <section className="bg-[#0B1F4D] text-white py-16 md:py-20 border-b border-black/20 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 mb-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-extrabold text-[#FFC93C] uppercase tracking-wider block mb-1">
              Suara Klien
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Cerita nyata dari kampus dan UMKM.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Kutipan Besar Kiri */}
            <div className="lg:col-span-6 bg-white/10 backdrop-blur-xs rounded-xl p-8 border border-white/15 flex flex-col justify-between">
              <div>
                <Quote className="w-10 h-10 text-[#FF7420] mb-4 opacity-80" />
                <p className="text-lg sm:text-xl font-bold text-white leading-relaxed mb-6">
                  &ldquo;Awalnya ragu pesan online karena takut hasil ga sesuai. Tapi lewat JasaKite uang saya baru diteruskan setelah draf video disetujui. Editing reels kafe kami jadi rapi dan viewers naik drastis!&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-[#FF7420] flex items-center justify-center font-bold text-white text-sm">
                  DK
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Dimas Kurniawan</h4>
                  <p className="text-xs text-white/70">Pemilik Kedai Kopi Sepakat, Pontianak</p>
                </div>
              </div>
            </div>

            {/* 2 Kutipan Kecil Kanan */}
            <div className="lg:col-span-6 flex flex-col gap-6 justify-between">
              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-6 border border-white/15">
                <div className="flex items-center gap-1 text-[#FFC93C] mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#FFC93C]" />
                  ))}
                </div>
                <p className="text-sm text-white/90 leading-relaxed mb-4">
                  &ldquo;Desain pamflet dies natalis selesai dalam 24 jam. Font dan warnanya pas sama karakter fakultas teknik.&rdquo;
                </p>
                <span className="text-xs font-semibold text-white/70 block">
                  Fajar Pratama · Ketua Panitia Event UNTAN
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-6 border border-white/15">
                <div className="flex items-center gap-1 text-[#FFC93C] mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#FFC93C]" />
                  ))}
                </div>
                <p className="text-sm text-white/90 leading-relaxed mb-4">
                  &ldquo;Sangat membantu pas printer kos rusak pas jam kumpul laporan. Diantar langsung ke meja kampus tepat waktu.&rdquo;
                </p>
                <span className="text-xs font-semibold text-white/70 block">
                  Nurul Aini · Mahasiswi Akuntansi POLNEP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Strip Marquee "Baru Saja Dipesan" */}
        <div className="border-t border-white/10 pt-4 overflow-hidden">
          <div className="animate-marquee flex items-center gap-6 text-xs font-bold text-white/80">
            {[
              "Pesanan #JK-8821: Edit Video TikTok 60 Detik (Siti - POLNEP)",
              "Pesanan #JK-8822: Print & Jilid 40 Halaman (Ahmad - POLNEP)",
              "Pesanan #JK-8823: Poster Kegiatan BEM (Rian - UNTAN)",
              "Pesanan #JK-8824: Tutor Privat Kalkulus 90 Menit (Fahmi - UNTAN)",
              "Pesanan #JK-8825: Titip Beli Bahan Praktikum (Dewi - UNTAN)",
              "Pesanan #JK-8826: Retouch Foto Wisuda (Rizka - UNTAN)",
            ].map((text, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full shrink-0"
              >
                <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          10. CTA FREELANCER (Blok Oranye, Potongan Diagonal)
          ========================================================= */}
      <section className="relative bg-[#FF7420] text-white py-16 md:py-20 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#0B1F4D] bg-white/30 px-2.5 py-1 rounded-sm inline-block mb-3">
              Bergabung Sekarang
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
              Jadikan keahlianmu sumber uang jajan mandiri.
            </h2>

            {/* 3 Poin Nyata */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2.5 text-sm sm:text-base font-bold text-white">
                <CheckCircle2 className="w-5 h-5 text-[#0B1F4D] shrink-0" />
                <span>Verifikasi KTM cepat dalam 1x24 jam kerja</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm sm:text-base font-bold text-white">
                <CheckCircle2 className="w-5 h-5 text-[#0B1F4D] shrink-0" />
                <span>Komisi platform hanya 8% (kamu terima bersih 92%)</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm sm:text-base font-bold text-white">
                <CheckCircle2 className="w-5 h-5 text-[#0B1F4D] shrink-0" />
                <span>Tarik dana kapan saja ke bank lokal & e-wallet tanpa biaya admin</span>
              </div>
            </div>

            <Link
              href="/daftar?role=freelancer"
              className="px-8 py-4 bg-[#0B1F4D] hover:bg-[#022B66] text-white text-base font-extrabold rounded-lg shadow-md transition inline-flex items-center gap-2"
            >
              <span>Daftar Jadi Freelancer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
