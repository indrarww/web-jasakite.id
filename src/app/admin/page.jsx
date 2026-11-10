"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { formatRupiah } from "@/config/pricing";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Logo from "@/components/ui/Logo";
import {
  DollarSign,
  TrendingUp,
  Crown,
  Megaphone,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Users,
  AlertTriangle,
  FileCheck,
  Building,
} from "lucide-react";

const INITIAL_KTM_QUEUE = [
  {
    id: "ktm-1",
    name: "Rizky Firmansyah",
    campus: "UNTAN",
    major: "Teknik Sipil",
    nim: "D1011221045",
    email: "rizky.f@student.untan.ac.id",
    ktmImage: "/assets/portofolio/porto-8.jpg",
    registeredAt: "09 Nov 2026, 09:15 WIB",
    status: "menunggu",
  },
  {
    id: "ktm-2",
    name: "Aulia Nurfadillah",
    campus: "POLNEP",
    major: "Administrasi Bisnis Terapan",
    nim: "3202102049",
    email: "aulia.n@polnep.ac.id",
    ktmImage: "/assets/portofolio/porto-2.jpg",
    registeredAt: "09 Nov 2026, 11:30 WIB",
    status: "menunggu",
  },
];

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoggedIn, isAdmin } = useAuth();
  const {
    orders,
    withdrawals,
    ads,
    reports,
    saveWithdrawals,
    saveAds,
    saveReports,
  } = useOrders();

  const [ktmQueue, setKtmQueue] = useState(INITIAL_KTM_QUEUE);
  const [activeTab, setActiveTab] = useState("pendapatan"); // 'pendapatan' | 'ktm' | 'pencairan' | 'iklan' | 'laporan'
  const [period, setPeriod] = useState("all");
  const [notice, setNotice] = useState("");

  // Perhitungan Pendapatan
  const commissionRevenue = orders.reduce((sum, o) => {
    return sum + (o.platformFee || Math.round(o.basePrice * 0.08));
  }, 0);

  const premiumRevenue = 155000; // Akumulasi penjualan premium dari demo & transaksi
  const adRevenue = ads.reduce((sum, a) => sum + (a.totalCost || 0), 0);
  const totalRevenue = commissionRevenue + premiumRevenue + adRevenue;

  // Aksi Verifikasi KTM
  const handleVerifyKTM = (id, isApproved) => {
    setKtmQueue((prev) =>
      prev.map((k) =>
        k.id === id ? { ...k, status: isApproved ? "disetujui" : "ditolak" } : k
      )
    );
    setNotice(
      isApproved
        ? "KTM berhasil diverifikasi. Akun freelancer aktif."
        : "KTM ditolak karena data tidak cocok."
    );
  };

  // Aksi Persetujuan Pencairan
  const handleApproveWithdrawal = (id, isApproved) => {
    const updated = withdrawals.map((w) =>
      w.id === id
        ? {
            ...w,
            status: isApproved ? "berhasil" : "ditolak",
            completedAt: new Date().toISOString(),
          }
        : w
    );
    saveWithdrawals(updated);
    setNotice(
      isApproved
        ? "Transfer pencairan dana disetujui & status diubah menjadi Berhasil."
        : "Pencairan dana ditolak & saldo dikembalikan ke freelancer."
    );
  };

  // Aksi Peninjauan Iklan
  const handleReviewAd = (id, isApproved) => {
    const updated = ads.map((a) =>
      a.id === id ? { ...a, status: isApproved ? "aktif" : "ditolak" } : a
    );
    saveAds(updated);
    setNotice(
      isApproved
        ? "Iklan disetujui & langsung tayang di saluran yang dipilih."
        : "Iklan ditolak oleh admin."
    );
  };

  // Aksi Penanganan Laporan Jasa
  const handleResolveReport = (id, isBanned) => {
    const updated = reports.map((r) =>
      r.id === id ? { ...r, status: isBanned ? "dibekukan" : "diabaikan" } : r
    );
    saveReports(updated);
    setNotice(
      isBanned
        ? "Jasa telah dibekukan karena melanggar Pedoman Integritas Akademik."
        : "Laporan dinyatakan tidak melanggar dan ditutup."
    );
  };

  return (
    <div className="min-h-screen bg-surface-gray py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Admin */}
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <Logo variant="header" href="/" />
            <div className="border-l border-gray-200 pl-3">
              <span className="px-2 py-0.5 bg-gray-900 text-white text-[10px] font-bold rounded uppercase tracking-wider">
                Admin COO Panel
              </span>
              <h1 className="text-base sm:text-lg font-bold text-ink-main mt-0.5">
                Dasbor Manajemen & Pendapatan Platform
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-xs">
                Lihat Situs Utama
              </Button>
            </Link>
          </div>
        </div>

        {/* Notifikasi Tindakan */}
        {notice && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800 flex items-center justify-between">
            <span>{notice}</span>
            <button
              onClick={() => setNotice("")}
              className="text-emerald-600 hover:underline font-bold"
            >
              Tutup
            </button>
          </div>
        )}

        {/* 4 Kartu Ringkasan Pendapatan Platform */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-ink-secondary mb-1">
              <span>Total Pendapatan JasaKite</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-ink-main">
              {formatRupiah(totalRevenue)}
            </div>
            <p className="text-[10px] text-ink-secondary mt-1">
              Akumulasi komisi, premium & iklan
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-ink-secondary mb-1">
              <span>Komisi Platform (8%)</span>
              <TrendingUp className="w-4 h-4 text-brand-blue" />
            </div>
            <div className="text-xl font-bold text-brand-blue">
              {formatRupiah(commissionRevenue)}
            </div>
            <p className="text-[10px] text-ink-secondary mt-1">
              Dari pesanan escrow yang tuntas
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-ink-secondary mb-1">
              <span>Penjualan Premium</span>
              <Crown className="w-4 h-4 text-brand-orange" />
            </div>
            <div className="text-xl font-bold text-brand-orange">
              {formatRupiah(premiumRevenue)}
            </div>
            <p className="text-[10px] text-ink-secondary mt-1">
              Langganan Level 1 & Level 2
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-ink-secondary mb-1">
              <span>Penjualan Iklan</span>
              <Megaphone className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-xl font-bold text-purple-600">
              {formatRupiah(adRevenue)}
            </div>
            <p className="text-[10px] text-ink-secondary mt-1">
              Slot beranda & broadcast media sosial
            </p>
          </div>
        </div>

        {/* Tab Navigasi Antrian & Pendapatan */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab("pendapatan")}
              className={`py-3 px-4 border-b-2 whitespace-nowrap transition ${
                activeTab === "pendapatan"
                  ? "border-brand-blue text-brand-blue bg-blue-50/50"
                  : "border-transparent text-ink-secondary hover:text-ink-main"
              }`}
            >
              Rincian Finansial & Grafik
            </button>

            <button
              onClick={() => setActiveTab("ktm")}
              className={`py-3 px-4 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === "ktm"
                  ? "border-brand-blue text-brand-blue bg-blue-50/50"
                  : "border-transparent text-ink-secondary hover:text-ink-main"
              }`}
            >
              <span>Verifikasi KTM</span>
              {ktmQueue.filter((k) => k.status === "menunggu").length > 0 && (
                <span className="px-1.5 py-0.2 bg-brand-orange text-white text-[10px] rounded-full">
                  {ktmQueue.filter((k) => k.status === "menunggu").length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("pencairan")}
              className={`py-3 px-4 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === "pencairan"
                  ? "border-brand-blue text-brand-blue bg-blue-50/50"
                  : "border-transparent text-ink-secondary hover:text-ink-main"
              }`}
            >
              <span>Pengajuan Pencairan</span>
              {withdrawals.filter((w) => w.status === "diproses").length > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-500 text-white text-[10px] rounded-full">
                  {withdrawals.filter((w) => w.status === "diproses").length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("iklan")}
              className={`py-3 px-4 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === "iklan"
                  ? "border-brand-blue text-brand-blue bg-blue-50/50"
                  : "border-transparent text-ink-secondary hover:text-ink-main"
              }`}
            >
              <span>Peninjauan Iklan</span>
              {ads.filter((a) => a.status === "menunggu_peninjauan").length > 0 && (
                <span className="px-1.5 py-0.2 bg-purple-600 text-white text-[10px] rounded-full">
                  {ads.filter((a) => a.status === "menunggu_peninjauan").length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("laporan")}
              className={`py-3 px-4 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === "laporan"
                  ? "border-brand-blue text-brand-blue bg-blue-50/50"
                  : "border-transparent text-ink-secondary hover:text-ink-main"
              }`}
            >
              <span>Laporan Jasa</span>
              {reports.filter((r) => r.status === "menunggu_tindakan").length > 0 && (
                <span className="px-1.5 py-0.2 bg-red-600 text-white text-[10px] rounded-full">
                  {reports.filter((r) => r.status === "menunggu_tindakan").length}
                </span>
              )}
            </button>
          </div>

          <div className="p-6">
            {/* TAB 1: RINCIAN PENDAPATAN & GRAFIK */}
            {activeTab === "pendapatan" && (
              <div className="space-y-6 text-xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-ink-main">
                      Komposisi Pendapatan JasaKite
                    </h3>
                    <p className="text-ink-secondary text-[11px]">
                      Sumber pemasukan platform per kuartal berjalan
                    </p>
                  </div>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="px-2.5 py-1 text-xs border border-gray-200 rounded bg-surface-gray"
                  >
                    <option value="all">Semua Waktu</option>
                    <option value="month">Bulan Ini</option>
                    <option value="week">7 Hari Terakhir</option>
                  </select>
                </div>

                {/* Bar Chart Sederhana */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Komisi Transaksi 8% ({formatRupiah(commissionRevenue)})</span>
                      <span>{Math.round((commissionRevenue / totalRevenue) * 100)}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded overflow-hidden">
                      <div
                        className="h-full bg-brand-blue"
                        style={{
                          width: `${(commissionRevenue / totalRevenue) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Langganan Premium Freelancer ({formatRupiah(premiumRevenue)})</span>
                      <span>{Math.round((premiumRevenue / totalRevenue) * 100)}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded overflow-hidden">
                      <div
                        className="h-full bg-brand-orange"
                        style={{
                          width: `${(premiumRevenue / totalRevenue) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Penjualan Iklan Berbayar ({formatRupiah(adRevenue)})</span>
                      <span>{Math.round((adRevenue / totalRevenue) * 100)}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded overflow-hidden">
                      <div
                        className="h-full bg-purple-600"
                        style={{
                          width: `${(adRevenue / totalRevenue) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-surface-gray rounded-md border border-gray-200 text-[11px] text-ink-secondary space-y-1">
                  <p className="font-bold text-ink-main">Catatan Finansial COO:</p>
                  <p>
                    • Komisi 8% dipotong secara otomatis saat pesanan diselesaikan oleh customer.
                  </p>
                  <p>
                    • Seluruh pendapatan ditampung pada rekening penampung operasional JasaKite Pontianak.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: VERIFIKASI KTM */}
            {activeTab === "ktm" && (
              <div className="space-y-4 text-xs">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="font-bold text-sm text-ink-main">
                    Antrean Verifikasi KTM Mahasiswa UNTAN & POLNEP
                  </h3>
                  <p className="text-ink-secondary text-[11px]">
                    Pastikan nama, NIM, dan logo kampus sesuai dengan data pendaftaran.
                  </p>
                </div>

                <div className="divide-y divide-gray-100">
                  {ktmQueue.map((item) => (
                    <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-ink-main">{item.name}</h4>
                          <span className="px-1.5 py-0.5 bg-blue-50 text-brand-blue font-bold rounded text-[10px]">
                            {item.campus}
                          </span>
                        </div>
                        <p className="text-ink-secondary text-[11px] mt-0.5">
                          {item.major} • NIM: {item.nim} • {item.email}
                        </p>
                        <p className="text-ink-muted text-[10px] mt-0.5">
                          Daftar: {item.registeredAt}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.status === "menunggu" ? (
                          <>
                            <Button
                              variant="outline-blue"
                              size="sm"
                              onClick={() => handleVerifyKTM(item.id, false)}
                              className="text-status-error hover:bg-red-50 border-red-200"
                            >
                              Tolak
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleVerifyKTM(item.id, true)}
                            >
                              Setujui KTM
                            </Button>
                          </>
                        ) : (
                          <span
                            className={`px-2.5 py-1 rounded text-[11px] font-bold capitalize ${
                              item.status === "disetujui"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: PENGAJUAN PENCAIRAN */}
            {activeTab === "pencairan" && (
              <div className="space-y-4 text-xs">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="font-bold text-sm text-ink-main">
                    Antrean Permintaan Pencairan Saldo Freelancer
                  </h3>
                  <p className="text-ink-secondary text-[11px]">
                    Validasi nomor rekening penerima dan lakukan transfer sesuai nominal.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-gray text-ink-secondary border-y border-gray-200">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">ID & Tanggal</th>
                        <th className="py-2.5 px-3 font-semibold">Penerima & Rekening</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Nominal</th>
                        <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {withdrawals.map((w) => (
                        <tr key={w.id} className="hover:bg-surface-gray/50 transition">
                          <td className="py-3 px-3">
                            <div className="font-semibold text-ink-main">{w.id}</div>
                            <div className="text-[10px] text-ink-muted">
                              {new Date(w.requestedAt).toLocaleDateString("id-ID")} WIB
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-ink-main">{w.accountHolder}</div>
                            <div className="text-[11px] text-ink-secondary">
                              {w.bankName} - {w.accountNumber}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-ink-main">
                            {formatRupiah(w.amount)}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                                w.status === "berhasil"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : w.status === "diproses"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-red-50 text-red-700"
                              }`}
                            >
                              {w.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            {w.status === "diproses" ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleApproveWithdrawal(w.id, false)}
                                  className="px-2 py-1 text-[11px] text-status-error hover:bg-red-50 rounded"
                                >
                                  Tolak
                                </button>
                                <button
                                  onClick={() => handleApproveWithdrawal(w.id, true)}
                                  className="px-2.5 py-1 text-[11px] bg-brand-blue text-white rounded hover:bg-brand-blue-hover font-semibold"
                                >
                                  Selesai Transfer
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-[11px]">Tuntas</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: PENINJAUAN IKLAN */}
            {activeTab === "iklan" && (
              <div className="space-y-4 text-xs">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="font-bold text-sm text-ink-main">
                    Antrean Peninjauan Iklan Berbayar
                  </h3>
                  <p className="text-ink-secondary text-[11px]">
                    Periksa kesesuaian materi iklan sebelum diaktifkan di platform atau medsos.
                  </p>
                </div>

                <div className="divide-y divide-gray-100">
                  {ads.map((ad) => (
                    <div key={ad.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-ink-main">{ad.serviceTitle}</h4>
                          <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded">
                            {ad.days} Hari
                          </span>
                        </div>
                        <p className="text-[11px] text-ink-secondary mt-0.5">
                          Saluran: {ad.channels?.join(", ")} • Total: {formatRupiah(ad.totalCost)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {ad.status === "menunggu_peninjauan" ? (
                          <>
                            <Button
                              variant="outline-blue"
                              size="sm"
                              onClick={() => handleReviewAd(ad.id, false)}
                              className="text-status-error hover:bg-red-50 border-red-200"
                            >
                              Tolak
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleReviewAd(ad.id, true)}
                            >
                              Setujui & Tayangkan
                            </Button>
                          </>
                        ) : (
                          <span
                            className={`px-2.5 py-1 rounded text-[11px] font-bold capitalize ${
                              ad.status === "aktif"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {ad.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: LAPORAN JASA */}
            {activeTab === "laporan" && (
              <div className="space-y-4 text-xs">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="font-bold text-sm text-ink-main">
                    Laporan Pelanggaran Integritas Akademik
                  </h3>
                  <p className="text-ink-secondary text-[11px]">
                    Laporan dari pengguna terkait dugaan perjokian tugas, skripsi, atau ujian.
                  </p>
                </div>

                <div className="divide-y divide-gray-100">
                  {reports.map((rep) => (
                    <div key={rep.id} className="py-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold rounded">
                              Laporan # {rep.id}
                            </span>
                            <h4 className="font-bold text-sm text-ink-main">{rep.serviceTitle}</h4>
                          </div>
                          <p className="text-xs text-ink-secondary mt-1">
                            Pelapor: <strong>{rep.reporterName}</strong> • Alasan: {rep.reason}
                          </p>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          {rep.status === "menunggu_tindakan" ? (
                            <>
                              <Button
                                variant="outline-blue"
                                size="sm"
                                onClick={() => handleResolveReport(rep.id, false)}
                              >
                                Abaikan
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleResolveReport(rep.id, true)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Bekukan Jasa
                              </Button>
                            </>
                          ) : (
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                                rep.status === "dibekukan"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {rep.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

