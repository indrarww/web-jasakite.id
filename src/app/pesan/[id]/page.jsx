"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getServiceById } from "@/config/dummyData";
import { ASSETS } from "@/config/assets";
import { formatRupiah } from "@/config/pricing";
import SafeImage from "@/components/ui/SafeImage";
import Button from "@/components/ui/Button";
import BrandDivider from "@/components/ui/BrandDivider";
import { CampusBadge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { useChat } from "@/context/ChatContext";
import {
  ShieldCheck,
  Calendar,
  UploadCloud,
  FileCheck,
  Tag,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Lock,
} from "lucide-react";

const PAYMENT_METHODS = [
  {
    id: "qris",
    name: "QRIS Standar Nasional",
    description: "Scan instan lewat BCA Mobile, GoPay, OVO, Dana, ShopeePay",
    image: ASSETS.pembayaran.qris,
    badge: "Instan",
  },
  {
    id: "gopay",
    name: "GoPay / GoPay Coins",
    description: "Bayar otomatis terhubung akun Gojek",
    image: ASSETS.pembayaran.gopay,
  },
  {
    id: "shopeepay",
    name: "ShopeePay",
    description: "Pembayaran dompet digital Shopee",
    image: ASSETS.pembayaran.shopeepay,
  },
  {
    id: "dana",
    name: "DANA",
    description: "Dompet digital praktis tanpa kartu",
    image: ASSETS.pembayaran.dana,
  },
  {
    id: "bank",
    name: "Transfer Bank / Virtual Account",
    description: "Bank Kalbar, Mandiri, BRI, BNI, BCA",
    image: ASSETS.pembayaran.bank,
  },
];

function OrderForm() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const { sendSystemNotice } = useChat();

  const service = getServiceById(params.id) || getServiceById("jasa-1");
  const initialPkg = searchParams?.get("pkg") === "express" ? "express" : "regular";

  const [packageType, setPackageType] = useState(initialPkg);
  const [taskInstructions, setTaskInstructions] = useState("");
  const [campusGuideline, setCampusGuideline] = useState("Sesuai instruksi dan kesepakatan chat");
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [draftFile, setDraftFile] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("qris");

  // Voucher
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!service) return null;

  const currentPackage = service.packages[packageType] || service.packages.regular;
  const basePrice = currentPackage.price;
  const platformFee = 0; // Transparan: tidak ada biaya ganda ke customer

  // Diskon 15% jika voucher KITEHEMAT15
  const discountAmount = appliedVoucher ? Math.round(basePrice * 0.15) : 0;
  const totalAmount = basePrice + platformFee - discountAmount;

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    setVoucherError("");
    const clean = voucherCode.trim().toUpperCase();
    if (!clean) return;

    if (["KITEHEMAT15", "MAHASISWABARU", "KITEUNTAN", "KITEPOLNEP"].includes(clean)) {
      setAppliedVoucher({
        code: clean,
        discountPercent: 15,
        discountAmount: Math.round(basePrice * 0.15),
      });
    } else {
      setVoucherError("Kode voucher tidak valid. Coba: MAHASISWABARU atau KITEHEMAT15");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = [".docx", ".doc", ".pdf", ".zip", ".rar", ".xlsx", ".png", ".jpg"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setErrorMessage("Format file harus .docx, .pdf, .zip, .png, atau .jpg.");
      return;
    }
    setDraftFile(file);
    setErrorMessage("");
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!taskInstructions.trim()) {
      setErrorMessage("Harap tuliskan instruksi pengerjaan untuk freelancer.");
      return;
    }
    if (!deadline) {
      setErrorMessage("Harap tentukan batas waktu pengerjaan (deadline).");
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      serviceId: service.id,
      serviceTitle: service.title,
      freelancer: {
        id: service.freelancer.id,
        name: service.freelancer.name,
        avatar: service.freelancer.avatar,
        campus: service.freelancer.campus,
        major: service.freelancer.major,
        phone: service.freelancer.phone || "085245123456",
      },
      customer: {
        id: user?.id || "user-1",
        name: user?.name || "Pemesan",
        campus: user?.campus || "Umum",
        phone: user?.phone || user?.whatsapp || "081234567890",
        email: user?.email || "pemesan@jasakite.id",
      },
      packageType,
      packageName: currentPackage.name,
      basePrice,
      platformFee: 0,
      discount: discountAmount,
      totalAmount,
      deadline,
      campusGuideline,
      taskInstructions,
      initialDraftFile: draftFile?.name || "Brief_Pesanan.docx",
      paymentMethod,
    };

    setTimeout(() => {
      const created = createOrder(orderPayload);
      sendSystemNotice(
        service.id,
        user?.id,
        `Pesanan #${created.id} telah dibuat dan pembayaran Escrow sebesar ${formatRupiah(totalAmount)} diverifikasi.`
      );
      setIsSubmitting(false);
      router.push(`/pesanan/${created.id}`);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-surface-gray py-8 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb */}
        <div className="mb-6">
          <Link
            href={`/jasa/${service.id}`}
            className="text-xs text-ink-secondary hover:text-brand-orange transition"
          >
            ← Kembali ke Detail Jasa
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-blue mt-2">
            Formulir Pemesanan & Pembayaran Escrow
          </h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            Lengkapi detail instruksi. Dana aman ditampung di JasaKite hingga pesanan selesai.
          </p>
          <BrandDivider width="w-12" height="h-1" className="mt-2" />
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-status-error text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* KOLOM KIRI: BRIEF TUGAS & BERKAS */}
            <div className="lg:col-span-7 space-y-5">
              {/* Ringkasan Jasa Terpilih */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-xs flex items-start gap-3.5">
                <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                  <SafeImage
                    src={service.portfolio?.[0]?.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    fallbackLabel="Porto"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider block">
                    Jasa Mahasiswa Terverifikasi
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-ink-main line-clamp-2">
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-ink-secondary">
                    <span className="font-semibold text-brand-blue">{service.freelancer.name}</span>
                    <span>•</span>
                    <CampusBadge campus={service.freelancer.campus} size="sm" />
                  </div>
                </div>
              </div>

              {/* Pilih Paket Layanan */}
              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-brand-blue uppercase tracking-wider">
                  1. Pilih Paket Layanan
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPackageType("regular")}
                    className={`p-3.5 rounded-md border text-xs cursor-pointer select-none transition flex flex-col justify-between ${
                      packageType === "regular"
                        ? "bg-blue-50/80 border-brand-blue text-brand-blue font-semibold"
                        : "bg-surface-gray border-gray-200 text-ink-main hover:border-gray-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs">Paket Reguler</span>
                        {packageType === "regular" && <CheckCircle2 className="w-4 h-4 text-brand-blue" />}
                      </div>
                      <p className="text-[11px] text-ink-secondary leading-snug">
                        {service.packages.regular.deliveryTime}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-200/60 font-bold text-brand-orange">
                      {formatRupiah(service.packages.regular.price)}
                    </div>
                  </div>

                  <div
                    onClick={() => setPackageType("express")}
                    className={`p-3.5 rounded-md border text-xs cursor-pointer select-none transition flex flex-col justify-between ${
                      packageType === "express"
                        ? "bg-orange-50/80 border-brand-orange text-brand-orange font-semibold"
                        : "bg-surface-gray border-gray-200 text-ink-main hover:border-gray-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs">Paket Kilat (Express)</span>
                        {packageType === "express" && <CheckCircle2 className="w-4 h-4 text-brand-orange" />}
                      </div>
                      <p className="text-[11px] text-ink-secondary leading-snug">
                        {service.packages.express?.deliveryTime || "< 24 Jam"}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-200/60 font-bold text-brand-orange">
                      {formatRupiah(service.packages.express?.price || service.packages.regular.price * 1.5)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Instruksi & Deadline */}
              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-brand-blue uppercase tracking-wider">
                  2. Instruksi & Berkas Pendukung
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-ink-main mb-1">
                    Instruksi Pengerjaan / Brief Pekerjaan *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={taskInstructions}
                    onChange={(e) => setTaskInstructions(e.target.value)}
                    placeholder="Jelaskan kebutuhan secara detail: materi yang diinginkan, style warna, format berkas akhir, dll."
                    className="w-full px-3 py-2 text-xs bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-ink-main mb-1">
                      Batas Waktu (Deadline) *
                    </label>
                    <input
                      type="date"
                      required
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-main mb-1">
                      Unggah File Pendukung (Opsional)
                    </label>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="w-full text-xs text-ink-secondary file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-brand-blue hover:file:bg-blue-100"
                    />
                    {draftFile && (
                      <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                        File terpilih: {draftFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* KOLOM KANAN: RINGKASAN PEMBAYARAN ESCROW */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-brand-blue uppercase tracking-wider">
                  3. Metode Pembayaran
                </h3>

                <div className="space-y-2">
                  {PAYMENT_METHODS.map((pm) => (
                    <label
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`flex items-center justify-between p-3 rounded-md border text-xs cursor-pointer transition select-none ${
                        paymentMethod === pm.id
                          ? "bg-blue-50/70 border-brand-blue text-brand-blue"
                          : "bg-surface-gray border-gray-200 text-ink-main hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === pm.id}
                          onChange={() => setPaymentMethod(pm.id)}
                          className="text-brand-blue"
                        />
                        <div>
                          <span className="font-semibold block">{pm.name}</span>
                          <span className="text-[10px] text-ink-secondary">{pm.description}</span>
                        </div>
                      </div>
                      {pm.badge && (
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                          {pm.badge}
                        </span>
                      )}
                    </label>
                  ))}
                </div>

                {/* Kode Voucher */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="Kode promo (mis. KITEHEMAT15)"
                      className="flex-1 px-3 py-1.5 text-xs bg-surface-gray border border-gray-200 rounded-md uppercase"
                    />
                    <Button variant="outline-blue" size="sm" onClick={handleApplyVoucher}>
                      Terapkan
                    </Button>
                  </div>
                  {appliedVoucher && (
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                      Voucher {appliedVoucher.code} aktif! Diskon 15% diterapkan.
                    </p>
                  )}
                  {voucherError && (
                    <p className="text-[11px] text-status-error mt-1">{voucherError}</p>
                  )}
                </div>

                {/* Rincian Harga */}
                <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
                  <div className="flex justify-between text-ink-secondary">
                    <span>Harga Paket:</span>
                    <span className="font-semibold text-ink-main">{formatRupiah(basePrice)}</span>
                  </div>
                  <div className="flex justify-between text-ink-secondary">
                    <span>Biaya Layanan JasaKite:</span>
                    <span className="font-semibold text-emerald-600">Rp0 (Gratis)</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Diskon Voucher:</span>
                      <span>-{formatRupiah(discountAmount)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-sm">
                    <span>Total Pembayaran Escrow:</span>
                    <span className="text-brand-orange">{formatRupiah(totalAmount)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full text-xs"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Bayar & Amankan Dana di Escrow
                  </Button>
                </div>

                <p className="text-[10px] text-center text-ink-secondary leading-snug">
                  Dengan mengklik tombol di atas, dana Anda akan diamankan di rekening Escrow JasaKite. Dana baru dirilis ke freelancer setelah pekerjaan disetujui.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <OrderForm />
      </Suspense>
    </ProtectedRoute>
  );
}
