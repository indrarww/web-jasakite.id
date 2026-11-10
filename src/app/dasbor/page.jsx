"use client";

import React, { useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { formatRupiah } from "@/config/pricing";
import { checkAcademicIntegrity } from "@/config/blocked-words";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { CampusBadge, KtmVerifiedBadge } from "@/components/ui/Badge";
import {
  Wallet,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  Send,
  Star,
  ShieldCheck,
  AlertCircle,
  Crown,
  Megaphone,
  PlusCircle,
  AlertTriangle,
  Eye,
  Percent,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function DasborPage() {
  const { user } = useAuth();
  const {
    orders,
    freelancerBalance,
    escrowPendingBalance,
    totalNetEarnings,
    submitDraft,
  } = useOrders();

  // State Modal Unggah Draf
  const [activeDraftOrder, setActiveDraftOrder] = useState(null);
  const [draftFileName, setDraftFileName] = useState("");
  const [draftNotes, setDraftNotes] = useState("");
  const [isSubmittingDraft, setIsSubmittingDraft] = useState(false);

  // State Modal Tambah Jasa Baru dengan Moderasi Integritas Akademik
  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);
  const [newServiceTitle, setNewServiceTitle] = useState("");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [newServicePrice, setNewServicePrice] = useState(35000);
  const [newServiceCategory, setNewServiceCategory] = useState("edit-video-foto");
  const [integrityError, setIntegrityError] = useState("");
  const [serviceSuccessMsg, setServiceSuccessMsg] = useState("");

  // Data Statistik Recharts dengan urutan warna resmi:
  // 1: Biru (#034BAE), 2: Oranye (#FF7420), 3: Tosca (#0FA3A3), 4: Ungu (#6D4AFF), 5: Pink (#FF5C7A)
  const statsChartData = [
    { name: "Minggu 1", value: 45, color: "#034BAE" },
    { name: "Minggu 2", value: 68, color: "#FF7420" },
    { name: "Minggu 3", value: 92, color: "#0FA3A3" },
    { name: "Minggu 4", value: 115, color: "#6D4AFF" },
    { name: "Bulan Ini", value: 140, color: "#FF5C7A" },
  ];

  const handleOpenDraftModal = (order) => {
    setActiveDraftOrder(order);
    setDraftFileName(`Hasil_Pekerjaan_${order.id}.docx`);
    setDraftNotes("Draf berkas pekerjaan siap ditinjau.");
  };

  const handleSubmitDraftForm = (e) => {
    e.preventDefault();
    if (!activeDraftOrder) return;

    setIsSubmittingDraft(true);
    setTimeout(() => {
      submitDraft(activeDraftOrder.id, {
        name: draftFileName,
        size: "2.1 MB",
        notes: draftNotes,
      });
      setIsSubmittingDraft(false);
      setActiveDraftOrder(null);
    }, 600);
  };

  const handleCreateService = (e) => {
    e.preventDefault();
    setIntegrityError("");

    // 1. Cek Integritas Akademik (Blocked Words)
    const checkTitle = checkAcademicIntegrity(newServiceTitle);
    const checkDesc = checkAcademicIntegrity(newServiceDesc);

    if (checkTitle.isBlocked || checkDesc.isBlocked) {
      setIntegrityError(
        "Jasa ini melanggar Pedoman Integritas Akademik JasaKite. Tidak diperkenankan menawarkan atau memfasilitasi perjokian skripsi, tugas, atau ujian."
      );
      return;
    }

    setServiceSuccessMsg("Jasa berhasil dibuat dan siap menerima pesanan klien!");
    setTimeout(() => {
      setIsNewServiceModalOpen(false);
      setServiceSuccessMsg("");
      setNewServiceTitle("");
      setNewServiceDesc("");
    }, 1500);
  };

  return (
    <ProtectedRoute requireFreelancer={true}>
      <div className="min-h-screen bg-[#F5F7FA] py-8 pb-16">
        <div className="max-w-[1200px] mx-auto px-6 space-y-6">
          {/* Header Profil Freelancer */}
          <div className="bg-white rounded-xl p-6 border border-[#E3E8EF] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-brand-orange text-white flex items-center justify-center font-extrabold text-xl shrink-0">
                {user?.name ? user.name.charAt(0) : "F"}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-lg sm:text-xl font-extrabold text-[#0B1F4D]">
                    Dasbor Freelancer: {user?.name || "Mahasiswa Freelancer"}
                  </h1>
                  <KtmVerifiedBadge size="sm" />
                  <CampusBadge campus={user?.campus || "POLNEP"} size="sm" />
                </div>
                <p className="text-xs text-gray-500">
                  {user?.major || "Teknik Informatika"} • NIM: {user?.nim || "3202116045"} • Terverifikasi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsNewServiceModalOpen(true)}
                leftIcon={<PlusCircle className="w-4 h-4 text-brand-orange" />}
                className="text-xs"
              >
                Tambah Jasa Baru
              </Button>
              <Link href="/dasbor/pencairan">
                <Button variant="primary" size="sm" leftIcon={<Wallet className="w-4 h-4" />} className="text-xs">
                  Pencairan Saldo
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Nav Shortcut Freelancer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <Link
              href="/dasbor/pencairan"
              className="p-3.5 bg-white rounded-lg border border-[#E3E8EF] hover:border-brand-blue flex items-center justify-between transition shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0B1F4D]">Pencairan Dana</h4>
                  <p className="text-[11px] text-gray-500">Tarik saldo ke rekening (Rp0 admin)</p>
                </div>
              </div>
              <span className="font-extrabold text-emerald-600">{formatRupiah(freelancerBalance)}</span>
            </Link>

            <Link
              href="/dasbor/premium"
              className="p-3.5 bg-white rounded-lg border border-[#E3E8EF] hover:border-brand-orange flex items-center justify-between transition shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#FFF6D6] text-[#0B1F4D] rounded">
                  <Crown className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0B1F4D]">JasaKite Premium</h4>
                  <p className="text-[11px] text-gray-500">Naikkan peringkat ke urutan teratas</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-[#FFF6D6] text-[#0B1F4D] text-[10px] font-bold rounded border border-amber-300">
                Level 1 / 2
              </span>
            </Link>

            <Link
              href="/dasbor/iklan"
              className="p-3.5 bg-white rounded-lg border border-[#E3E8EF] hover:border-[#6D4AFF] flex items-center justify-between transition shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#EEE9FF] text-[#6D4AFF] rounded">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0B1F4D]">Iklan Berbayar</h4>
                  <p className="text-[11px] text-gray-500">Promosi slot beranda & media sosial</p>
                </div>
              </div>
              <span className="text-[11px] text-[#6D4AFF] font-bold">Rp10.000/hari</span>
            </Link>
          </div>

          {/* Kartu Ringkasan Saldo & Escrow */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#E3E8EF] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500">Total Pendapatan Bersih</span>
                <TrendingUp className="w-4 h-4 text-brand-blue" />
              </div>
              <span className="text-2xl font-extrabold text-brand-blue block">
                {formatRupiah(totalNetEarnings)}
              </span>
              <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
                92% bagian freelancer dari pesanan tuntas
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500">Saldo Siap Ditarik</span>
                <Wallet className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-emerald-600">
                  {formatRupiah(freelancerBalance)}
                </span>
                <Link href="/dasbor/pencairan" className="text-xs text-brand-orange font-bold hover:underline">
                  Tarik →
                </Link>
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">
                Min. penarikan Rp25.000 (Biaya penarikan: Rp0)
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E3E8EF] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500">Saldo Escrow Tertahan</span>
                <Clock className="w-4 h-4 text-brand-orange" />
              </div>
              <span className="text-2xl font-extrabold text-brand-orange block">
                {formatRupiah(escrowPendingBalance)}
              </span>
              <span className="text-[11px] text-gray-500 mt-1 block">
                Cair otomatis setelah pemesan menyetujui hasil
              </span>
            </div>
          </div>

          {/* Kotak Transparansi Komisi 8% */}
          <div className="p-4 bg-[#E8F0FC] rounded-xl border border-brand-blue/20 text-xs text-[#0B1F4D] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-orange shrink-0" />
              <span className="font-bold">Skema Komisi Transparan:</span>
              <span>Harga Rp100.000, komisi 8% Rp8.000, kamu terima Rp92.000</span>
            </div>
            <span className="text-[11px] text-gray-500">Tanpa potongan tersembunyi</span>
          </div>

          {/* STATISTIK FREELANCER & GRAFIK RECHARTS (Biru, Oranye, Tosca, Ungu, Pink) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 3 Angka Metrik Utama */}
            <div className="lg:col-span-4 grid grid-cols-1 gap-3">
              <div className="bg-white p-4 rounded-xl border border-[#E3E8EF] shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500 font-semibold">Pengunjung Profil</span>
                  <Eye className="w-4 h-4 text-brand-blue" />
                </div>
                <span className="text-2xl font-extrabold text-[#0B1F4D]">284 Orang</span>
                <span className="text-[11px] text-emerald-600 block mt-0.5">+18% dari bulan lalu</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E3E8EF] shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500 font-semibold">% Tepat Waktu</span>
                  <Clock className="w-4 h-4 text-brand-orange" />
                </div>
                <span className="text-2xl font-extrabold text-[#0B1F4D]">98.2%</span>
                <span className="text-[11px] text-gray-500 block mt-0.5">Sesuai deadline brief</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E3E8EF] shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500 font-semibold">Skor Kepuasan Klien</span>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <span className="text-2xl font-extrabold text-amber-500">4.9 / 5.0</span>
                <span className="text-[11px] text-gray-500 block mt-0.5">Dari 42 ulasan masuk</span>
              </div>
            </div>

            {/* Grafik Performa Bulanan Recharts */}
            <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-[#E3E8EF] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xs font-bold text-[#0B1F4D] uppercase tracking-wider">
                    Aktivitas Penjualan & Kunjungan
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Warna palet resmi: Biru, Oranye, Tosca, Ungu, Pink
                  </p>
                </div>
                <span className="text-[11px] font-bold text-brand-blue bg-[#E8F0FC] px-2 py-0.5 rounded">
                  Tren Naik
                </span>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} />
                    <Tooltip
                      formatter={(val) => [`${val} Transaksi / Klik`, "Performa"]}
                      contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E3E8EF", fontSize: "11px" }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {statsChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Tabel Pesanan Berjalan */}
          <div className="bg-white rounded-xl border border-[#E3E8EF] shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-[#0B1F4D]">
                  Daftar Pesanan & Pekerjaan Aktif
                </h3>
                <p className="text-xs text-gray-500">
                  Kelola komunikasi, deadline, dan penyerahan draf hasil akhir
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 bg-[#E8F0FC] text-brand-blue rounded">
                {orders.length} Total Pesanan
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F7FA] border-b border-[#E3E8EF] text-gray-500 uppercase tracking-wider font-bold text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">ID Pesanan</th>
                    <th className="py-2.5 px-3">Pemesan</th>
                    <th className="py-2.5 px-3">Layanan</th>
                    <th className="py-2.5 px-3">Deadline</th>
                    <th className="py-2.5 px-3 text-right">Kamu Terima (92%)</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[#0B1F4D]">
                  {orders.map((ord) => {
                    const isCompleted = ord.status === "completed";
                    const isDraftSent = ord.status === "draft_sent";
                    const netEarn =
                      ord.freelancerReceives || Math.round((ord.basePrice || ord.totalAmount) * 0.92);

                    return (
                      <tr key={ord.id} className="hover:bg-[#F5F7FA] transition">
                        <td className="py-3 px-3 font-bold text-brand-blue">
                          <Link href={`/pesanan/${ord.id}`} className="hover:underline">
                            {ord.id}
                          </Link>
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-bold text-[#0B1F4D]">{ord.customer.name}</div>
                          <div className="text-[10px] text-gray-500">
                            {ord.customer.campus || "Pemesan"}
                          </div>
                        </td>

                        <td className="py-3 px-3 max-w-xs">
                          <div className="font-medium text-[#0B1F4D] truncate" title={ord.serviceTitle}>
                            {ord.serviceTitle}
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="w-3 h-3 text-brand-orange" />
                            <span>{ord.deadline || "Sesuai Jadwal"}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-right font-extrabold text-emerald-600">
                          {formatRupiah(netEarn)}
                        </td>

                        <td className="py-3 px-3 text-center">
                          {isCompleted ? (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                              Selesai
                            </span>
                          ) : isDraftSent ? (
                            <span className="px-2 py-0.5 bg-orange-50 text-brand-orange border border-brand-orange/30 rounded text-[10px] font-bold">
                              Draf Terkirim
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-blue-50 text-brand-blue border border-brand-blue/20 rounded text-[10px] font-bold">
                              Dikerjakan
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Link href={`/pesanan/${ord.id}`}>
                              <button
                                type="button"
                                className="px-2 py-1 text-[11px] font-bold text-brand-blue bg-[#E8F0FC] hover:bg-blue-100 rounded transition"
                              >
                                Detail
                              </button>
                            </Link>

                            {!isCompleted && (
                              <Button
                                variant="primary"
                                size="sm"
                                className="text-[11px] py-1 px-2 font-bold"
                                onClick={() => handleOpenDraftModal(ord)}
                              >
                                Kirim Draf
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* MODAL UNGGAH DRAF PEKERJAAN */}
        <Modal
          isOpen={!!activeDraftOrder}
          onClose={() => setActiveDraftOrder(null)}
          title={`Kirim Draf: ${activeDraftOrder?.id}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSubmitDraftForm} className="space-y-4 text-xs">
            <p className="text-gray-600">
              Kirimkan draf berkas untuk pesanan <strong>{activeDraftOrder?.serviceTitle}</strong>.
            </p>

            <div>
              <label className="block font-bold text-[#0B1F4D] mb-1">
                Nama Berkas Draf *
              </label>
              <input
                type="text"
                required
                value={draftFileName}
                onChange={(e) => setDraftFileName(e.target.value)}
                className="w-full px-3 py-2 bg-[#F5F7FA] border border-[#E3E8EF] rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0B1F4D] mb-1">
                Catatan Penyerahan *
              </label>
              <textarea
                rows={3}
                required
                value={draftNotes}
                onChange={(e) => setDraftNotes(e.target.value)}
                placeholder="Jelaskan hal-hal yang perlu diperiksa oleh pemesan..."
                className="w-full px-3 py-2 bg-[#F5F7FA] border border-[#E3E8EF] rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setActiveDraftOrder(null)}>
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmittingDraft}
                rightIcon={<Send className="w-3.5 h-3.5" />}
              >
                Kirim Draf
              </Button>
            </div>
          </form>
        </Modal>

        {/* MODAL TAMBAH JASA BARU DENGAN MODERASI INTEGRITAS AKADEMIK */}
        <Modal
          isOpen={isNewServiceModalOpen}
          onClose={() => setIsNewServiceModalOpen(false)}
          title="Tambah Jasa Freelancer Baru"
          maxWidth="max-w-lg"
        >
          {serviceSuccessMsg ? (
            <div className="py-6 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-[#0B1F4D]">{serviceSuccessMsg}</h4>
            </div>
          ) : (
            <form onSubmit={handleCreateService} className="space-y-4 text-xs">
              {integrityError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Pelanggaran Integritas Terdeteksi</p>
                    <p className="mt-0.5 text-[11px]">{integrityError}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-[#0B1F4D] mb-1">
                  Kategori Layanan *
                </label>
                <select
                  value={newServiceCategory}
                  onChange={(e) => setNewServiceCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5F7FA] border border-[#E3E8EF] rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                >
                  <option value="edit-video-foto">Edit Video & Foto</option>
                  <option value="desain-organisasi">Desain Organisasi</option>
                  <option value="tutor">Edukasi & Private Tutor</option>
                  <option value="logistik-kampus">Logistik Kampus</option>
                  <option value="jasa-lainnya">Jasa Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#0B1F4D] mb-1">
                  Judul Jasa (Hindari kata perjokian akademik) *
                </label>
                <input
                  type="text"
                  required
                  value={newServiceTitle}
                  onChange={(e) => setNewServiceTitle(e.target.value)}
                  placeholder="mis. Jasa Edit Reels Instagram & Video TikTok Kreatif"
                  className="w-full px-3 py-2 bg-[#F5F7FA] border border-[#E3E8EF] rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0B1F4D] mb-1">
                  Deskripsi Lengkap Jasa *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  placeholder="Jelaskan apa yang Anda kerjakan, benefit, dan batasan pekerjaan..."
                  className="w-full px-3 py-2 bg-[#F5F7FA] border border-[#E3E8EF] rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0B1F4D] mb-1">
                  Harga Dasar Paket (Rp) *
                </label>
                <input
                  type="number"
                  min="15000"
                  step="5000"
                  required
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#F5F7FA] border border-[#E3E8EF] rounded-md focus:bg-white focus:outline-none focus:border-brand-blue font-bold"
                />
              </div>

              <div className="p-2.5 bg-[#E8F0FC] text-brand-blue rounded-md border border-brand-blue/20 flex items-center justify-between text-[11px]">
                <span>Komisi platform 8%:</span>
                <span className="font-bold">
                  Kamu menerima {formatRupiah(Math.round(newServicePrice * 0.92))} per transaksi
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setIsNewServiceModalOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Publikasikan Jasa
                </Button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
