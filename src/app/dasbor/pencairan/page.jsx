"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { formatRupiah, MIN_WITHDRAWAL_AMOUNT, WITHDRAWAL_ADMIN_FEE } from "@/config/pricing";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import {
  Wallet,
  Clock,
  TrendingUp,
  CreditCard,
  ArrowDownCircle,
  Download,
  AlertCircle,
  CheckCircle2,
  Building,
  Smartphone,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

const BANK_OPTIONS = [
  "Bank BCA",
  "Bank Mandiri",
  "Bank BNI",
  "Bank BRI",
  "Bank Kalbar",
  "Bank Syariah Indonesia (BSI)",
];

const EWALLET_OPTIONS = ["GoPay", "OVO", "DANA", "ShopeePay"];

export default function PencairanPage() {
  const { user } = useAuth();
  const {
    freelancerBalance,
    escrowPendingBalance,
    totalNetEarnings,
    totalCommissionPaid,
    withdrawals,
    savedAccounts,
    requestWithdrawal,
  } = useOrders();

  const [amount, setAmount] = useState("");
  const [destinationType, setDestinationType] = useState("bank"); // 'bank' | 'ewallet'
  const [provider, setProvider] = useState(BANK_OPTIONS[0]);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState(user?.name || "");
  const [saveAccount, setSaveAccount] = useState(true);

  const [selectedSavedAccId, setSelectedSavedAccId] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter tanggal riwayat
  const [filterPeriod, setFilterPeriod] = useState("all");

  const maskNumber = (numStr) => {
    if (!numStr || numStr.length <= 4) return numStr;
    const last4 = numStr.slice(-4);
    return `•••• •••• ${last4}`;
  };

  const handleSelectSavedAccount = (accId) => {
    setSelectedSavedAccId(accId);
    if (!accId) return;

    const acc = savedAccounts.find((a) => a.id === accId);
    if (acc) {
      setDestinationType(acc.type);
      setProvider(acc.provider);
      setAccountNumber(acc.accountNumber);
      setAccountHolder(acc.accountHolder);
    }
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const numAmount = Number(amount);
    if (!numAmount || isNaN(numAmount)) {
      setErrorMessage("Masukkan nominal penarikan yang valid.");
      return;
    }
    if (numAmount < MIN_WITHDRAWAL_AMOUNT) {
      setErrorMessage(
        `Minimal penarikan dana adalah ${formatRupiah(MIN_WITHDRAWAL_AMOUNT)}.`
      );
      return;
    }
    if (numAmount > freelancerBalance) {
      setErrorMessage("Nominal penarikan melebihi saldo yang siap ditarik.");
      return;
    }
    if (!accountNumber.trim()) {
      setErrorMessage("Nomor rekening atau nomor HP e-wallet wajib diisi.");
      return;
    }
    if (!accountHolder.trim()) {
      setErrorMessage("Nama pemilik rekening/akun wajib diisi.");
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const handleConfirmWithdrawal = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const destination = {
      type: destinationType,
      provider,
      accountNumber,
      accountHolder,
    };

    const res = requestWithdrawal(amount, destination, saveAccount);
    setIsSubmitting(false);
    setIsConfirmModalOpen(false);

    if (res.success) {
      setSuccessMessage(
        `Pengajuan pencairan ${formatRupiah(
          Number(amount)
        )} berhasil diajukan dan sedang diproses (estimasi maks 1x24 jam kerja).`
      );
      setAmount("");
    } else {
      setErrorMessage(res.message || "Gagal mengajukan pencairan.");
    }
  };

  // Ekspor CSV Riwayat Pencairan
  const handleExportCSV = () => {
    const headers = [
      "ID Penarikan",
      "Tanggal (WIB)",
      "Nominal (Rp)",
      "Biaya Admin",
      "Penerima",
      "Tujuan",
      "Status",
    ];
    const rows = withdrawals.map((w) => [
      w.id,
      new Date(w.requestedAt).toLocaleDateString("id-ID") +
        " " +
        new Date(w.requestedAt).toLocaleTimeString("id-ID"),
      w.amount,
      w.fee || 0,
      `"${w.accountHolder}"`,
      `"${w.bankName} - ${w.accountNumber}"`,
      w.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Riwayat_Pencairan_JasaKite_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ProtectedRoute requireFreelancer>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-ink-secondary mb-1">
              <Link href="/dasbor" className="hover:text-brand-blue flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dasbor Freelancer</span>
              </Link>
              <span>/</span>
              <span className="text-ink-main font-semibold">Pencairan Dana</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-ink-main">
              Pencairan Dana Freelancer
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
              Tarik saldo hasil kerja ke rekening bank lokal atau dompet digital tanpa biaya admin.
            </p>
          </div>
        </div>

        {/* 4 Kartu Ringkasan Saldo & Komisi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* 1. Saldo Siap Ditarik */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-ink-secondary mb-1">
              <span>Saldo Siap Ditarik</span>
              <Wallet className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-emerald-600">
              {formatRupiah(freelancerBalance)}
            </div>
            <p className="text-[11px] text-ink-secondary mt-1">
              Dana pesanan selesai siap ditransfer
            </p>
          </div>

          {/* 2. Saldo Ditahan Escrow */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-ink-secondary mb-1">
              <span>Ditahan Escrow</span>
              <Clock className="w-4 h-4 text-brand-orange" />
            </div>
            <div className="text-xl font-bold text-brand-orange">
              {formatRupiah(escrowPendingBalance)}
            </div>
            <p className="text-[11px] text-ink-secondary mt-1">
              Pesanan berjalan belum disetujui pemesan
            </p>
          </div>

          {/* 3. Total Pendapatan Bersih */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-ink-secondary mb-1">
              <span>Total Pendapatan Bersih</span>
              <TrendingUp className="w-4 h-4 text-brand-blue" />
            </div>
            <div className="text-xl font-bold text-brand-blue">
              {formatRupiah(totalNetEarnings)}
            </div>
            <p className="text-[11px] text-ink-secondary mt-1">
              92% bagian freelancer dari pesanan tuntas
            </p>
          </div>

          {/* 4. Total Komisi yang Dibayarkan */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-ink-secondary mb-1">
              <span>Komisi JasaKite (8%)</span>
              <CreditCard className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-xl font-bold text-ink-main">
              {formatRupiah(totalCommissionPaid)}
            </div>
            <p className="text-[11px] text-ink-secondary mt-1">
              Biaya operasional & perlindungan Escrow
            </p>
          </div>
        </div>

        {/* Notifikasi Sukses / Error */}
        {successMessage && (
          <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-lg text-status-error text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Kolom Kiri: Form Tarik Dana */}
          <div className="lg:col-span-5 bg-white p-6 rounded-lg border border-gray-200 shadow-xs">
            <h2 className="text-sm font-bold text-ink-main mb-1 flex items-center gap-2">
              <ArrowDownCircle className="w-4 h-4 text-brand-orange" />
              <span>Formulir Penarikan Saldo</span>
            </h2>
            <p className="text-xs text-ink-secondary mb-5">
              Proses pencairan diproses oleh tim keuangan JasaKite dalam 1x24 jam kerja.
            </p>

            <form onSubmit={handlePreSubmit} className="space-y-4 text-xs">
              {/* Pilihan Rekening Tersimpan jika ada */}
              {savedAccounts.length > 0 && (
                <div>
                  <label className="block font-semibold text-ink-main mb-1">
                    Gunakan Rekening Tersimpan:
                  </label>
                  <select
                    value={selectedSavedAccId}
                    onChange={(e) => handleSelectSavedAccount(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                  >
                    <option value="">-- Rekening Baru / Input Manual --</option>
                    {savedAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.provider} - {maskNumber(acc.accountNumber)} ({acc.accountHolder})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Nominal Penarikan */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-ink-main">
                    Nominal Penarikan (Rp) *
                  </label>
                  <span className="text-[11px] text-ink-secondary">
                    Min. {formatRupiah(MIN_WITHDRAWAL_AMOUNT)}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary font-bold">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="mis. 50000"
                    min={MIN_WITHDRAWAL_AMOUNT}
                    max={freelancerBalance}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue font-bold"
                  />
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px]">
                  <span className="text-ink-secondary">Biaya Penarikan:</span>
                  <span className="font-semibold text-emerald-600">Rp0 (Gratis)</span>
                </div>
              </div>

              {/* Tipe Tujuan: Bank vs E-Wallet */}
              <div>
                <label className="block font-semibold text-ink-main mb-1.5">
                  Tipe Rekening Tujuan *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDestinationType("bank");
                      setProvider(BANK_OPTIONS[0]);
                      setSelectedSavedAccId("");
                    }}
                    className={`py-2 px-3 rounded-md border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      destinationType === "bank"
                        ? "bg-blue-50 border-brand-blue text-brand-blue"
                        : "bg-surface-gray border-gray-200 text-ink-secondary hover:text-ink-main"
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>Rekening Bank</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDestinationType("ewallet");
                      setProvider(EWALLET_OPTIONS[0]);
                      setSelectedSavedAccId("");
                    }}
                    className={`py-2 px-3 rounded-md border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      destinationType === "ewallet"
                        ? "bg-orange-50 border-brand-orange text-brand-orange"
                        : "bg-surface-gray border-gray-200 text-ink-secondary hover:text-ink-main"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>E-Wallet</span>
                  </button>
                </div>
              </div>

              {/* Nama Bank / E-Wallet */}
              <div>
                <label className="block font-semibold text-ink-main mb-1">
                  Pilih {destinationType === "bank" ? "Bank" : "E-Wallet"} *
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                >
                  {(destinationType === "bank" ? BANK_OPTIONS : EWALLET_OPTIONS).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nomor Rekening / Nomor HP E-Wallet */}
              <div>
                <label className="block font-semibold text-ink-main mb-1">
                  {destinationType === "bank"
                    ? "Nomor Rekening Bank *"
                    : "Nomor Handphone Terdaftar *"}{" "}
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder={
                    destinationType === "bank"
                      ? "mis. 8735123488"
                      : "mis. 085245123456"
                  }
                  className="w-full px-3 py-2 text-sm bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                />
              </div>

              {/* Nama Pemilik Rekening */}
              <div>
                <label className="block font-semibold text-ink-main mb-1">
                  Nama Pemilik Rekening / Akun *
                </label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="Nama sesuai buku tabungan / KTP"
                  className="w-full px-3 py-2 text-sm bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                />
              </div>

              {/* Checkbox Simpan Rekening */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="save-account"
                  checked={saveAccount}
                  onChange={(e) => setSaveAccount(e.target.checked)}
                  className="w-3.5 h-3.5 text-brand-orange border-gray-300 rounded focus:ring-brand-orange"
                />
                <label htmlFor="save-account" className="text-[11px] text-ink-secondary">
                  Simpan rekening ini untuk penarikan berikutnya
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={freelancerBalance < MIN_WITHDRAWAL_AMOUNT}
                className="w-full mt-3"
              >
                Ajukan Pencairan Saldo
              </Button>
            </form>
          </div>

          {/* Kolom Kanan: Riwayat Pencairan Dana */}
          <div className="lg:col-span-7 bg-white p-6 rounded-lg border border-gray-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-gray-100 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-ink-main">
                    Riwayat Pengajuan Pencairan
                  </h2>
                  <p className="text-xs text-ink-secondary mt-0.5">
                    Catatan seluruh transfer dana ke rekening tujuan
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-blue bg-blue-50 hover:bg-blue-100 rounded-md transition shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Ekspor CSV</span>
                </button>
              </div>

              {/* Tabel Riwayat */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-gray text-ink-secondary border-y border-gray-200">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">ID / Tanggal</th>
                      <th className="py-2.5 px-3 font-semibold">Tujuan Transfer</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Nominal</th>
                      <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {withdrawals.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-ink-secondary">
                          Belum ada riwayat pencairan saldo.
                        </td>
                      </tr>
                    ) : (
                      withdrawals.map((wd) => (
                        <tr key={wd.id} className="hover:bg-surface-gray/50 transition">
                          <td className="py-3 px-3">
                            <div className="font-semibold text-ink-main">{wd.id}</div>
                            <div className="text-[10px] text-ink-muted">
                              {new Date(wd.requestedAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}{" "}
                              WIB
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-medium text-ink-main">{wd.bankName}</div>
                            <div className="text-[11px] text-ink-secondary">
                              {maskNumber(wd.accountNumber)}
                            </div>
                            <div className="text-[10px] text-ink-muted">{wd.accountHolder}</div>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="font-bold text-ink-main">
                              {formatRupiah(wd.amount)}
                            </div>
                            <div className="text-[10px] text-emerald-600">Admin: Rp0</div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${
                                wd.status === "berhasil"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : wd.status === "diproses"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-red-50 text-red-700 border border-red-200"
                              }`}
                            >
                              {wd.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Catatan Transparansi Finansial */}
            <div className="mt-6 p-3.5 bg-surface-gray rounded-md border border-gray-200 text-[11px] text-ink-secondary space-y-1">
              <p className="font-semibold text-brand-blue flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-orange" />
                Ketentuan Pencairan JasaKite:
              </p>
              <ul className="list-disc pl-4 space-y-0.5 text-gray-600">
                <li>Minimal penarikan saldo adalah {formatRupiah(MIN_WITHDRAWAL_AMOUNT)}.</li>
                <li>Tidak ada potongan biaya transfer antar bank (Biaya admin: Rp0).</li>
                <li>Pencairan diverifikasi setiap hari kerja pukul 09.00 - 17.00 WIB.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Konfirmasi Penarikan */}
        <Modal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          title="Konfirmasi Pencairan Saldo"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs text-ink-main">
            <p className="text-ink-secondary">
              Pastikan rincian rekening tujuan Anda sudah sesuai sebelum melanjutkan:
            </p>

            <div className="bg-surface-gray p-3.5 rounded-md border border-gray-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-ink-secondary">Nominal Penarikan:</span>
                <span className="font-bold text-sm text-ink-main">
                  {formatRupiah(Number(amount))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-secondary">Biaya Admin:</span>
                <span className="font-bold text-emerald-600">Rp0 (Gratis)</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="text-ink-secondary">Tujuan Transfer:</span>
                <span className="font-semibold text-brand-blue">{provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-secondary">Nomor Rekening:</span>
                <span className="font-semibold">{maskNumber(accountNumber)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-secondary">Nama Pemilik:</span>
                <span className="font-semibold">{accountHolder}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
                onClick={handleConfirmWithdrawal}
              >
                Konfirmasi & Tarik
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
