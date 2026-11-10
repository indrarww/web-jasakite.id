"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getServiceById } from "@/config/dummyData";
import { getCategoryById } from "@/config/categories";
import SafeImage from "@/components/ui/SafeImage";
import { KtmVerifiedBadge, CampusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { useOrders } from "@/context/OrderContext";
import { formatRupiah } from "@/config/pricing";
import {
  Star,
  Clock,
  CheckCircle2,
  ShieldCheck,
  MessageSquare,
  Zap,
  ArrowRight,
  Maximize2,
  X,
  AlertCircle,
  Flag,
  User,
} from "lucide-react";

export default function DetailJasaPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const { openOrCreateConversation } = useChat();
  const { reportService } = useOrders();

  const service = getServiceById(params.id) || getServiceById("jasa-1");
  const [selectedPackage, setSelectedPackage] = useState("regular"); // 'regular' | 'express'
  const [lightboxImage, setLightboxImage] = useState(null);

  // State Ulasan
  const [showAllReviews, setShowAllReviews] = useState(false);

  // State Modal Laporan Jasa
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  if (!service) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-brand-orange mb-3" />
        <h2 className="text-xl font-bold text-brand-blue mb-2">Jasa Tidak Ditemukan</h2>
        <p className="text-xs text-gray-500 mb-4">
          Layanan yang Anda cari mungkin sudah tidak aktif.
        </p>
        <Link href="/jasa">
          <Button variant="primary">Kembali ke Katalog</Button>
        </Link>
      </div>
    );
  }

  const { freelancer, packages, portfolio, reviews, tags, description, title, price, category } = service;
  const categoryInfo = getCategoryById(category);
  const currentPkg = packages[selectedPackage] || packages.regular;

  // Ajak Diskusi -> Buka atau buat room di ChatContext
  const handleStartChat = () => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(`/jasa/${service.id}`)}`);
      return;
    }
    const convId = openOrCreateConversation(service, freelancer);
    if (convId) {
      router.push(`/chat/${convId}`);
    } else {
      router.push("/chat");
    }
  };

  const handleOrderClick = () => {
    const targetUrl = `/pesan/${service.id}?pkg=${selectedPackage}`;
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(targetUrl)}`);
    } else {
      router.push(targetUrl);
    }
  };

  const handleSendReport = (e) => {
    e.preventDefault();
    if (!reportReason.trim()) return;

    reportService(service.id, service.title, user?.name, reportReason.trim());
    setReportSubmitted(true);
    setTimeout(() => {
      setIsReportModalOpen(false);
      setReportSubmitted(false);
      setReportReason("");
    }, 1800);
  };

  // Menampilkan minimal 5 ulasan (atau semua jika showAllReviews aktif)
  const displayedReviews = showAllReviews ? reviews : reviews?.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-8 pb-28 md:pb-16">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-orange transition">
            Beranda
          </Link>
          <span>/</span>
          <Link
            href={`/jasa?kategori=${category}`}
            className="hover:text-brand-orange transition font-semibold"
          >
            {categoryInfo.name}
          </Link>
          <span>/</span>
          <span className="text-[#0B1F4D] font-bold truncate max-w-[200px] sm:max-w-md">
            {title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* KOLOM KIRI (KONTEN UTAMA & PORTOFOLIO) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Header Profil Freelancer */}
            <div className="bg-white rounded-xl p-6 border border-[#E3E8EF] shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200 shadow-xs">
                    <SafeImage
                      src={freelancer.avatar}
                      alt={freelancer.name}
                      fill
                      categoryId={category}
                      freelancerName={freelancer.name}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-lg font-bold text-[#0B1F4D]">{freelancer.name}</h3>
                      <KtmVerifiedBadge size="md" />
                      <CampusBadge campus={freelancer.campus} size="md" />
                    </div>
                    <p className="text-xs text-gray-600">
                      {freelancer.faculty} • {freelancer.major} (Semester {freelancer.semester || 7})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={handleStartChat}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-brand-blue bg-[#E8F0FC] hover:bg-blue-100 border border-brand-blue/20 transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-brand-orange" />
                    <span>Ajak Diskusi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(true)}
                    className="p-2 rounded-lg text-xs text-gray-400 hover:text-red-600 hover:bg-red-50 border border-gray-200 transition"
                    title="Laporkan Jasa"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Status Bar */}
              <div className="grid grid-cols-3 gap-2 pt-4 text-center text-xs">
                <div className="p-2.5 bg-[#F5F7FA] rounded-lg">
                  <span className="text-[10px] text-gray-500 block">Kecepatan Balas</span>
                  <span className="font-extrabold text-[#0B1F4D] flex items-center justify-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-brand-orange" />
                    {freelancer.responseRate}
                  </span>
                </div>
                <div className="p-2.5 bg-[#F5F7FA] rounded-lg">
                  <span className="text-[10px] text-gray-500 block">Pesanan Sukses</span>
                  <span className="font-extrabold text-[#0B1F4D] block mt-0.5">
                    {freelancer.completedOrders}+ Transaksi
                  </span>
                </div>
                <div className="p-2.5 bg-[#F5F7FA] rounded-lg">
                  <span className="text-[10px] text-gray-500 block">Rating Kepuasan</span>
                  <span className="font-extrabold text-amber-500 flex items-center justify-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {freelancer.rating} / 5.0
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Judul Jasa & Garis Aksen Kategori */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E3E8EF] shadow-xs space-y-4">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1F4D] leading-tight">
                {title}
              </h1>

              {/* Garis Aksen Sesuai Warna Kategori */}
              <div
                className="h-1.5 w-16 rounded-full"
                style={{ backgroundColor: categoryInfo.colorHex }}
              />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {tags?.map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-[#F5F7FA] text-gray-700 px-2.5 py-1 rounded-md border border-gray-200 font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Deskripsi Lengkap */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-extrabold text-[#0B1F4D] mb-2">Tentang Layanan Ini</h4>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line space-y-3">
                  {description}
                </div>
              </div>

              {/* Catatan Integritas Akademik */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600 bg-emerald-50/60 p-3 rounded-lg border border-emerald-200/60">
                <span className="flex items-center gap-2 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Layanan ini mematuhi Pedoman Integritas Akademik JasaKite.</span>
                </span>
                <Link href="/integritas" className="text-brand-blue hover:underline font-bold text-xs shrink-0">
                  Baca Aturan
                </Link>
              </div>
            </div>

            {/* 3. Galeri Portofolio Pekerjaan */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E3E8EF] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-extrabold text-[#0B1F4D]">
                    Sampel Karya & Hasil Pekerjaan
                  </h3>
                  <p className="text-xs text-gray-500">
                    Klik gambar untuk memperbesar pratinjau hasil karya sebelumnya.
                  </p>
                </div>
                <span className="text-xs font-bold text-brand-orange">
                  {portfolio?.length || 0} Portofolio
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {portfolio?.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setLightboxImage(item)}
                    className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer shadow-xs hover:border-brand-blue transition"
                  >
                    <SafeImage
                      src={item.image}
                      alt={item.title}
                      fill
                      categoryId={category}
                      freelancerName={freelancer.name}
                      className="object-cover group-hover:scale-105 transition duration-200"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Bagian Ulasan Pelanggan (Minimal 5 Ulasan) */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E3E8EF] shadow-xs">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 border border-amber-200 flex flex-col items-center justify-center">
                    <span className="text-base font-extrabold leading-none">{freelancer.rating}</span>
                    <div className="flex mt-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#0B1F4D]">
                      Ulasan Pelanggan ({reviews?.length || 0})
                    </h3>
                    <p className="text-xs text-gray-500">
                      Ulasan autentik dari mahasiswa UNTAN, POLNEP, & pelanggan umum.
                    </p>
                  </div>
                </div>
              </div>

              {/* Daftar Ulasan */}
              <div className="space-y-4">
                {displayedReviews?.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-lg bg-[#F5F7FA] border border-[#E3E8EF] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xs">
                          {rev.author[0]}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#0B1F4D] block">{rev.author}</span>
                          <span className="text-[10px] text-gray-500">
                            {rev.campus} · {rev.major}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{rev.rating}</span>
                        <span className="text-[10px] text-gray-400 ml-1 font-normal">{rev.date}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed italic">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>

              {/* Tombol Lihat Semua Ulasan jika ulasan > 5 */}
              {reviews && reviews.length > 5 && (
                <div className="mt-4 pt-3 text-center border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="text-xs font-bold text-brand-blue hover:text-brand-orange transition"
                  >
                    {showAllReviews ? "Tampilkan Lebih Sedikit" : `Lihat Semua (${reviews.length}) Ulasan`}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* KOLOM KANAN (PANEL PAKET & CHECKOUT DESKTOP) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-20 bg-white rounded-xl p-6 border border-[#E3E8EF] shadow-md space-y-5">
              {/* Tab Pilihan Paket */}
              <div className="grid grid-cols-2 gap-2 bg-[#F5F7FA] p-1 rounded-lg border border-[#E3E8EF]">
                <button
                  type="button"
                  onClick={() => setSelectedPackage("regular")}
                  className={`py-2 text-xs font-extrabold rounded-md transition ${
                    selectedPackage === "regular"
                      ? "bg-white text-brand-blue shadow-xs"
                      : "text-gray-600 hover:text-[#0B1F4D]"
                  }`}
                >
                  Reguler
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPackage("express")}
                  className={`py-2 text-xs font-extrabold rounded-md flex items-center justify-center gap-1 transition ${
                    selectedPackage === "express"
                      ? "bg-brand-orange text-white shadow-xs"
                      : "text-gray-600 hover:text-brand-orange"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Kilat &lt;24 Jam</span>
                </button>
              </div>

              {/* Detail Paket Aktif */}
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-2xl font-extrabold text-[#0B1F4D]">
                    {formatRupiah(currentPkg.price)}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">Harga Bersih</span>
                </div>
                <h4 className="text-sm font-bold text-[#0B1F4D] mb-1.5">
                  {currentPkg.name}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {currentPkg.description}
                </p>

                <div className="space-y-2 py-3 border-y border-gray-100 text-xs text-gray-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-orange shrink-0" />
                    <span>{currentPkg.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{currentPkg.revisions}</span>
                  </div>
                </div>

                {/* Fitur Paket */}
                <div className="pt-3 space-y-1.5">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    Termasuk Dalam Paket:
                  </span>
                  {currentPkg.features?.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tombol Aksi Utama */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleOrderClick}
                  className="w-full py-3.5 bg-brand-orange hover:bg-[#E56315] text-white text-sm font-extrabold rounded-lg shadow-sm transition flex items-center justify-center gap-2"
                >
                  <span>Pesan Jasa via Escrow</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleStartChat}
                  className="w-full py-2.5 bg-[#F5F7FA] hover:bg-gray-200 text-[#0B1F4D] text-xs font-bold rounded-lg border border-[#E3E8EF] transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-brand-orange" />
                  <span>Ajak Diskusi dengan Penjual</span>
                </button>
              </div>

              {/* Jaminan Escrow Box */}
              <div className="bg-[#E8F0FC] p-3 rounded-lg border border-brand-blue/20 text-xs text-brand-blue">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 text-brand-orange" />
                  <span>Garansi Escrow JasaKite</span>
                </div>
                <p className="text-[11px] text-gray-600 leading-normal">
                  Pembayaran Anda ditahan aman di rekening penampung. Dana baru dilepas ke freelancer setelah pekerjaan selesai dan Anda setujui.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM BAR KHUSUS MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E3E8EF] p-4 lg:hidden flex items-center justify-between gap-3 shadow-modal">
        <div>
          <span className="text-[10px] text-gray-500 block leading-tight">Mulai dari</span>
          <span className="text-base font-extrabold text-[#0B1F4D]">
            {formatRupiah(currentPkg.price)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleStartChat}
            className="p-2.5 rounded-lg border border-[#E3E8EF] text-gray-700 hover:bg-[#F5F7FA]"
            aria-label="Ajak Diskusi"
          >
            <MessageSquare className="w-5 h-5 text-brand-orange" />
          </button>
          <button
            type="button"
            onClick={handleOrderClick}
            className="px-5 py-2.5 bg-brand-orange text-white text-xs font-extrabold rounded-lg shadow-sm"
          >
            Pesan via Escrow
          </button>
        </div>
      </div>

      {/* Lightbox Modal Portofolio */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-white rounded-xl overflow-hidden">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="relative aspect-[4/3] w-full">
              <SafeImage
                src={lightboxImage.image}
                alt={lightboxImage.title}
                fill
                categoryId={category}
                freelancerName={freelancer.name}
                className="object-contain bg-black"
              />
            </div>
            <div className="p-4 bg-white">
              <h4 className="text-sm font-bold text-[#0B1F4D]">{lightboxImage.title}</h4>
            </div>
          </div>
        </div>
      )}

      {/* Modal Laporkan Jasa */}
      {isReportModalOpen && (
        <Modal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          title="Laporkan Layanan Ini"
        >
          {reportSubmitted ? (
            <div className="py-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#0B1F4D]">Laporan Diterima</h4>
              <p className="text-xs text-gray-600">
                Terima kasih telah membantu menjaga ekosistem dan integritas akademik JasaKite. Tim admin akan memeriksa laporan ini segera.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendReport} className="space-y-4">
              <p className="text-xs text-gray-600">
                Jika jasa ini melanggar Pedoman Integritas Akademik (seperti perjokian skripsi, tugas, atau ujian) atau melanggar ketentuan lain, beri tahu kami detailnya.
              </p>
              <div>
                <label className="text-xs font-bold text-[#0B1F4D] block mb-1">
                  Alasan Pelaporan
                </label>
                <textarea
                  rows={4}
                  required
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Contoh: Jasa ini terindikasi menawarkan pengerjaan tugas akademik secara langsung..."
                  className="w-full text-xs p-3 border border-[#E3E8EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-lg"
                >
                  Kirim Laporan
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
