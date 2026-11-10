"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { PREMIUM_PLANS, formatRupiah } from "@/config/pricing";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import {
  Crown,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  ArrowLeft,
  Calendar,
  Wallet,
} from "lucide-react";

export default function PremiumPage() {
  const { user, saveUserSession } = useAuth();
  const { freelancerBalance } = useOrders();

  const [selectedPlanId, setSelectedPlanId] = useState("level2");
  const [selectedDuration, setSelectedDuration] = useState(1); // 1 atau 3 bulan
  const [paymentMethod, setPaymentMethod] = useState("wallet"); // 'wallet' | 'qris' | 'bank'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successNotice, setSuccessNotice] = useState("");

  const currentPlan = PREMIUM_PLANS[selectedPlanId] || PREMIUM_PLANS.level1;
  const priceOption = currentPlan.pricing[selectedDuration];
  const finalPrice = priceOption?.price || 0;

  const userPremiumTier = user?.premiumTier || null;
  const isCurrentlyPremium = !!userPremiumTier;

  const handleOpenBuy = (planId, duration = 1) => {
    setSelectedPlanId(planId);
    setSelectedDuration(duration);
    setIsModalOpen(true);
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 600));

    // Hitung tanggal kedaluwarsa baru (misal 30 hari * selectedDuration)
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + selectedDuration * 30);

    const updatedUser = {
      ...user,
      premiumTier: selectedPlanId,
      premiumExpiresAt: expDate.toISOString(),
    };

    saveUserSession(updatedUser);
    setIsProcessing(false);
    setIsModalOpen(false);
    setSuccessNotice(
      `Selamat! Akun Anda kini aktif sebagai ${currentPlan.name} untuk durasi ${selectedDuration} bulan.`
    );
  };

  return (
    <ProtectedRoute requireFreelancer>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-ink-secondary mb-1">
            <Link href="/dasbor" className="hover:text-brand-blue flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dasbor Freelancer</span>
            </Link>
            <span>/</span>
            <span className="text-ink-main font-semibold">Paket Premium</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-main flex items-center gap-2">
            <Crown className="w-6 h-6 text-brand-orange" />
            <span>Tingkatkan Akun ke JasaKite Premium</span>
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
            Tingkatkan visibilitas jasa Anda di atas freelancer lain dan raih lebih banyak pesanan setiap hari.
          </p>
        </div>

        {/* Notifikasi Sukses */}
        {successNotice && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Status Premium Aktif Freelancer */}
        <div className="mb-8 p-5 bg-white rounded-lg border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                isCurrentlyPremium
                  ? userPremiumTier === "level2"
                    ? "bg-orange-50 text-brand-orange"
                    : "bg-blue-50 text-brand-blue"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-ink-main">
                  Status Langganan Anda:{" "}
                  {isCurrentlyPremium
                    ? userPremiumTier === "level2"
                      ? "Premium 2 (Prioritas Tertinggi)"
                      : "Premium 1"
                    : "Reguler (Non-Premium)"}
                </h3>
                {isCurrentlyPremium && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Aktif
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-secondary mt-0.5">
                {isCurrentlyPremium
                  ? "Jasa Anda diprioritaskan di hasil pencarian & katalog beranda."
                  : "Tingkatkan ke paket premium untuk menempatkan kartu jasa di urutan teratas."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isCurrentlyPremium ? (
              <Button
                variant="outline-orange"
                size="sm"
                onClick={() => handleOpenBuy("level2", 3)}
              >
                Perpanjang Langganan
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleOpenBuy("level1", 1)}
              >
                Pilih Paket Sekarang
              </Button>
            )}
          </div>
        </div>

        {/* Pilihan Paket Langganan (Level 1 & Level 2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Paket Level 1 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 bg-blue-50 text-brand-blue rounded text-xs font-bold border border-brand-blue/20">
                  {PREMIUM_PLANS.level1.badgeLabel}
                </span>
                <span className="text-xs text-ink-secondary">Standar Prioritas</span>
              </div>
              <h2 className="text-lg font-bold text-ink-main">Paket Premium 1</h2>
              <p className="text-xs text-ink-secondary mt-1">
                Cocok untuk freelancer mahasiswa yang ingin mulai aktif dan tampil di atas non-premium.
              </p>

              <div className="my-5 p-3.5 bg-surface-gray rounded-md border border-gray-200">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-brand-blue">
                    {formatRupiah(PREMIUM_PLANS.level1.pricing[1].price)}
                  </span>
                  <span className="text-xs text-ink-secondary">/ 1 bulan</span>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between text-xs">
                  <span className="text-ink-secondary">Pilihan 3 Bulan:</span>
                  <span className="font-bold text-ink-main">
                    {formatRupiah(PREMIUM_PLANS.level1.pricing[3].price)}{" "}
                    <span className="text-emerald-600 font-normal">
                      ({PREMIUM_PLANS.level1.pricing[3].savingsBadge})
                    </span>
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-ink-main">
                {PREMIUM_PLANS.level1.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100 flex gap-2">
              <Button
                variant="outline-blue"
                size="md"
                onClick={() => handleOpenBuy("level1", 1)}
                className="flex-1"
              >
                1 Bulan
              </Button>
              <Button
                variant="outline-blue"
                size="md"
                onClick={() => handleOpenBuy("level1", 3)}
                className="flex-1"
              >
                3 Bulan (Hemat)
              </Button>
            </div>
          </div>

          {/* Paket Level 2 */}
          <div className="bg-white rounded-lg border-2 border-brand-orange p-6 shadow-xs flex flex-col justify-between relative">
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 bg-brand-orange text-white text-[10px] font-bold rounded uppercase tracking-wider">
              Paling Direkomendasikan
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 bg-orange-50 text-brand-orange rounded text-xs font-bold border border-brand-orange/30">
                  {PREMIUM_PLANS.level2.badgeLabel}
                </span>
                <span className="text-xs text-brand-orange font-bold">Prioritas #1 Teratas</span>
              </div>
              <h2 className="text-lg font-bold text-ink-main">Paket Premium 2</h2>
              <p className="text-xs text-ink-secondary mt-1">
                Peringkat teratas katalog, slot rekomendasi di beranda, dan statistik performa lengkap.
              </p>

              <div className="my-5 p-3.5 bg-orange-50/50 rounded-md border border-orange-200">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-brand-orange">
                    {formatRupiah(PREMIUM_PLANS.level2.pricing[1].price)}
                  </span>
                  <span className="text-xs text-ink-secondary">/ 1 bulan</span>
                </div>
                <div className="mt-2 pt-2 border-t border-orange-200/80 flex items-center justify-between text-xs">
                  <span className="text-ink-secondary">Pilihan 3 Bulan:</span>
                  <span className="font-bold text-ink-main">
                    {formatRupiah(PREMIUM_PLANS.level2.pricing[3].price)}{" "}
                    <span className="text-emerald-600 font-normal">
                      ({PREMIUM_PLANS.level2.pricing[3].savingsBadge})
                    </span>
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-ink-main">
                {PREMIUM_PLANS.level2.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                    <span className="font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100 flex gap-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => handleOpenBuy("level2", 1)}
                className="flex-1"
              >
                1 Bulan
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => handleOpenBuy("level2", 3)}
                className="flex-1"
              >
                3 Bulan (Hemat)
              </Button>
            </div>
          </div>
        </div>

        {/* Tabel Perbandingan Manfaat */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-ink-main mb-4">
            Tabel Perbandingan Tingkatan Layanan
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-gray text-ink-secondary border-y border-gray-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Fitur & Manfaat</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Reguler</th>
                  <th className="py-2.5 px-3 font-semibold text-center text-brand-blue">
                    Premium 1
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-center text-brand-orange">
                    Premium 2
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3 px-3 font-medium">Posisi Urutan di Katalog</td>
                  <td className="py-3 px-3 text-center text-gray-500">Standar</td>
                  <td className="py-3 px-3 text-center font-semibold text-brand-blue">
                    Di atas reguler
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-brand-orange">
                    Prioritas teratas (#1)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-medium">Badge Khusus di Kartu Jasa</td>
                  <td className="py-3 px-3 text-center text-gray-400">-</td>
                  <td className="py-3 px-3 text-center font-semibold text-brand-blue">
                    Badge Premium 1
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-brand-orange">
                    Badge Eksklusif Premium 2
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-medium">Slot Rekomendasi di Beranda</td>
                  <td className="py-3 px-3 text-center text-gray-400">-</td>
                  <td className="py-3 px-3 text-center text-gray-400">-</td>
                  <td className="py-3 px-3 text-center font-bold text-emerald-600">Ya (Otomatis)</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-medium">Statistik Tayangan & Klik</td>
                  <td className="py-3 px-3 text-center text-gray-500">Dasar</td>
                  <td className="py-3 px-3 text-center font-medium">Jumlah Klik</td>
                  <td className="py-3 px-3 text-center font-bold text-brand-orange">
                    Lengkap + Konversi
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Checkout Pembelian Premium */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Aktivasi ${currentPlan.name}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs text-ink-main">
            <div>
              <label className="block font-semibold mb-1">Pilih Durasi Paket:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDuration(1)}
                  className={`p-2.5 rounded-md border text-left transition ${
                    selectedDuration === 1
                      ? "bg-blue-50 border-brand-blue text-brand-blue font-bold"
                      : "bg-surface-gray border-gray-200"
                  }`}
                >
                  <div>1 Bulan</div>
                  <div className="text-[11px] font-normal text-ink-secondary">
                    {formatRupiah(currentPlan.pricing[1].price)}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDuration(3)}
                  className={`p-2.5 rounded-md border text-left transition ${
                    selectedDuration === 3
                      ? "bg-blue-50 border-brand-blue text-brand-blue font-bold"
                      : "bg-surface-gray border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>3 Bulan</span>
                    <span className="text-[9px] px-1 bg-emerald-100 text-emerald-800 rounded">
                      Hemat
                    </span>
                  </div>
                  <div className="text-[11px] font-normal text-ink-secondary">
                    {formatRupiah(currentPlan.pricing[3].price)}
                  </div>
                </button>
              </div>
            </div>

            {/* Metode Pembayaran */}
            <div>
              <label className="block font-semibold mb-1">Metode Pembayaran:</label>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-2.5 rounded-md border border-gray-200 bg-surface-gray cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payMethod"
                      value="wallet"
                      checked={paymentMethod === "wallet"}
                      onChange={() => setPaymentMethod("wallet")}
                      className="text-brand-orange"
                    />
                    <span>Potong Saldo Dompet JasaKite</span>
                  </div>
                  <span className="font-semibold text-emerald-600">
                    Saldo: {formatRupiah(freelancerBalance)}
                  </span>
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-md border border-gray-200 bg-surface-gray cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payMethod"
                      value="qris"
                      checked={paymentMethod === "qris"}
                      onChange={() => setPaymentMethod("qris")}
                      className="text-brand-orange"
                    />
                    <span>QRIS Instan (Simulasi)</span>
                  </div>
                  <span className="text-[10px] text-ink-secondary">BCA, Mandiri, GoPay</span>
                </label>
              </div>
            </div>

            {/* Ringkasan Biaya */}
            <div className="p-3 bg-surface-gray rounded-md border border-gray-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-ink-secondary">Paket:</span>
                <span className="font-semibold">{currentPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-secondary">Durasi:</span>
                <span className="font-semibold">{selectedDuration} Bulan</span>
              </div>
              <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold text-sm">
                <span>Total Tagihan:</span>
                <span className="text-brand-orange">{formatRupiah(finalPrice)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={isProcessing}
                onClick={handleConfirmPayment}
              >
                Bayar & Aktifkan Premium
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}

