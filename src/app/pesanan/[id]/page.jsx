"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useOrders } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { formatRupiah, PLATFORM_FEE_RATE } from "@/config/pricing";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  FileText,
  Download,
  Star,
  Check,
  AlertCircle,
  Phone,
  MessageSquare,
} from "lucide-react";

const TRACKER_STEPS = [
  { id: "verified", title: "Pembayaran Diverifikasi", desc: "Escrow mengamankan dana" },
  { id: "in_progress", title: "Sedang Dikerjakan", desc: "Freelancer memproses tugas" },
  { id: "draft_sent", title: "Draf Dikirim", desc: "Menunggu peninjauan pemesan" },
  { id: "completed", title: "Selesai", desc: "Dana dirilis ke freelancer" },
];

function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { getOrderById, sendChatMessage, completeOrder } = useOrders();

  const orderId = params.id;
  const order = getOrderById(orderId);

  const [messageInput, setMessageInput] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState("");

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-brand-orange mb-3" />
        <h2 className="text-xl font-bold text-brand-blue mb-2">Pesanan Tidak Ditemukan</h2>
        <p className="text-xs text-ink-secondary mb-4">
          Pesanan dengan ID <strong>{orderId}</strong> tidak ditemukan di sistem.
        </p>
        <Link href="/">
          <Button variant="primary">Kembali ke Beranda</Button>
        </Link>
      </div>
    );
  }

  const isFreelancer = user?.role === "freelancer";
  const isOrderPaid = order.status !== "unpaid";

  const getStepIndex = (status) => {
    switch (status) {
      case "verified":
        return 0;
      case "in_progress":
        return 1;
      case "draft_sent":
        return 2;
      case "completed":
        return 3;
      default:
        return 1;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  // Komisi 8% calculation
  const servicePrice = Number(order.basePrice || order.totalAmount) || 0;
  const platformFee = order.platformFee || Math.round(servicePrice * PLATFORM_FEE_RATE);
  const freelancerNet = order.freelancerReceives || servicePrice - platformFee;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    const senderRole = isFreelancer ? "freelancer" : "customer";
    sendChatMessage(order.id, messageInput.trim(), senderRole);
    setMessageInput("");
  };

  const handleOpenReleaseModal = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmRelease = () => {
    setIsConfirmModalOpen(false);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReviewAndComplete = () => {
    setIsCompleting(true);
    setTimeout(() => {
      completeOrder(order.id, { rating, comment: reviewComment });
      setIsCompleting(false);
      setIsReviewModalOpen(false);
    }, 600);
  };

  const handleDownloadFile = (fileName) => {
    setDownloadSuccessToast(`Mengunduh berkas: ${fileName}...`);
    setTimeout(() => setDownloadSuccessToast(""), 3000);
  };

  return (
    <div className="min-h-screen bg-surface-gray py-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Toast Notifikasi Unduh */}
        {downloadSuccessToast && (
          <div className="fixed top-20 right-4 z-50 p-3 bg-emerald-600 text-white text-xs font-semibold rounded-md shadow-md flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{downloadSuccessToast}</span>
          </div>
        )}

        {/* Header Pesanan */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold bg-blue-50 text-brand-blue px-2.5 py-0.5 rounded border border-blue-200">
                {order.id}
              </span>
              <span className="text-xs text-ink-secondary">
                Dipesan pada {new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} WIB
              </span>
            </div>
            <h1 className="text-lg font-bold text-ink-main line-clamp-1">
              {order.serviceTitle}
            </h1>
            <p className="text-xs text-ink-secondary mt-0.5">
              Freelancer: <strong className="text-ink-main">{order.freelancer.name}</strong> ({order.freelancer.campus} - {order.freelancer.major})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-ink-secondary block">Total Pembayaran Escrow</span>
              <span className="text-lg font-bold text-brand-orange">
                {formatRupiah(servicePrice)}
              </span>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Escrow Terlindungi</span>
            </span>
          </div>
        </div>

        {/* Rincian Komisi Transparan untuk Freelancer */}
        {isFreelancer && (
          <div className="p-3.5 bg-blue-50 rounded-lg border border-blue-200 text-xs text-brand-blue flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-orange shrink-0" />
              <span>
                <strong>Transparansi Finansial JasaKite:</strong> Harga jasa {formatRupiah(servicePrice)}, komisi JasaKite 8% {formatRupiah(platformFee)}, kamu menerima {formatRupiah(freelancerNet)}.
              </span>
            </div>
            <span className="font-bold text-ink-main shrink-0">
              Bersih: {formatRupiah(freelancerNet)}
            </span>
          </div>
        )}

        {/* Nomor Kontak WhatsApp (HANYA DITAMPILKAN SETELAH PESANAN DIBAYAR) */}
        <div className="p-3.5 bg-white rounded-lg border border-gray-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-ink-main">
                {isFreelancer
                  ? `Kontak WhatsApp Pemesan: ${order.customer?.name || "Pemesan"}`
                  : `Kontak WhatsApp Freelancer: ${order.freelancer?.name}`}
              </p>
              <p className="text-[11px] text-ink-secondary">
                {isOrderPaid ? (
                  <span>
                    Nomor WhatsApp aktif:{" "}
                    <strong className="text-emerald-700">
                      {isFreelancer
                        ? order.customer?.phone || "0812-3456-7890"
                        : order.freelancer?.phone || "0852-4512-3456"}
                    </strong>{" "}
                    (Terbuka resmi karena pembayaran telah diverifikasi)
                  </span>
                ) : (
                  <span>
                    Nomor WhatsApp disembunyikan sampai pembayaran escrow diverifikasi.
                  </span>
                )}
              </p>
            </div>
          </div>

          {isOrderPaid && (
            <a
              href={`https://wa.me/${(isFreelancer ? order.customer?.phone : order.freelancer?.phone)?.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Hubungi via WA</span>
            </a>
          )}
        </div>

        {/* Lini Masa Status Transaksi Escrow */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-xs">
          <h3 className="text-xs font-bold text-ink-secondary uppercase tracking-wider mb-5">
            Lini Masa Status Transaksi Escrow
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
            {TRACKER_STEPS.map((step, idx) => {
              const isFinished = idx < currentStepIdx;
              const isActive = idx === currentStepIdx;

              return (
                <div key={step.id} className="flex flex-col relative z-10">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                        isFinished
                          ? "bg-brand-blue text-white"
                          : isActive
                          ? "bg-brand-orange text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isFinished ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    <div className="min-w-0">
                      <span
                        className={`text-xs font-bold block truncate ${
                          isActive
                            ? "text-brand-orange"
                            : isFinished
                            ? "text-brand-blue"
                            : "text-ink-secondary"
                        }`}
                      >
                        {step.title}
                      </span>
                      <span className="text-[10px] text-ink-secondary block truncate">
                        {step.desc}
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isFinished
                          ? "w-full bg-brand-blue"
                          : isActive
                          ? "w-full bg-brand-orange"
                          : "w-0"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grid Chat & Berkas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Kolom Kiri: Chat Dalam Pesanan */}
          <div className="lg:col-span-7 bg-white rounded-lg border border-gray-200 shadow-xs flex flex-col h-[520px] overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200 bg-surface-gray flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xs">
                  {order.freelancer.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink-main leading-tight">
                    {order.freelancer.name}
                  </h4>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    Online • Chat Dalam Aplikasi
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-ink-secondary">
                Deadline: {order.deadline || "3 hari"}
              </span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-surface-gray/30">
              {order.chatMessages?.map((msg) => {
                const isCustomer = msg.sender === "customer";
                const isSystem = msg.sender === "system";

                if (isSystem) {
                  return (
                    <div key={msg.id} className="text-center my-2">
                      <span className="inline-block px-3 py-1 bg-blue-50 text-brand-blue rounded text-[11px] font-medium border border-blue-200 max-w-md">
                        {msg.text}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isCustomer ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-md p-3 text-xs leading-relaxed shadow-xs ${
                        isCustomer
                          ? "bg-brand-blue text-white rounded-br-none"
                          : "bg-white text-ink-main border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-ink-muted mt-0.5 px-1">{msg.time}</span>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white flex items-center gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Tulis pesan atau instruksi..."
                className="flex-1 px-3 py-2 text-xs bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
              />
              <Button type="submit" variant="primary" size="sm" className="px-3">
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>

          {/* Kolom Kanan: Penyerahan Berkas & Rilis Dana */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="text-xs font-bold text-brand-blue uppercase tracking-wider">
                  Berkas Penyerahan Akhir
                </h3>
                <span className="text-xs font-semibold text-brand-orange">
                  {order.deliverables?.length || 0} Berkas
                </span>
              </div>

              {order.deliverables && order.deliverables.length > 0 ? (
                <div className="space-y-2">
                  {order.deliverables.map((file) => (
                    <div
                      key={file.id}
                      className="p-3 bg-surface-gray rounded-md border border-gray-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 text-brand-blue shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-ink-main truncate max-w-[170px]">
                            {file.fileName}
                          </p>
                          <span className="text-[10px] text-ink-secondary">
                            {file.fileSize} • {file.uploadedAt}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownloadFile(file.fileName)}
                        className="p-1.5 rounded bg-white border border-gray-200 hover:bg-brand-blue hover:text-white text-brand-blue transition"
                        title="Unduh Berkas"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-surface-gray rounded-md text-center text-xs text-ink-secondary">
                  <Clock className="w-5 h-5 text-brand-orange mx-auto mb-1.5" />
                  <p className="font-semibold text-ink-main">Belum Ada Draf Berkas</p>
                  <p className="text-[11px] mt-0.5">
                    Freelancer sedang memproses pekerjaan Anda.
                  </p>
                </div>
              )}
            </div>

            {/* Kotak Tindakan Selesaikan Pesanan */}
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-brand-blue uppercase tracking-wider">
                Konfirmasi & Rilis Dana
              </h3>

              {order.status === "completed" ? (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-md text-center space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                  <h4 className="text-xs font-bold text-emerald-800">
                    Pesanan Telah Selesai
                  </h4>
                  <p className="text-[11px] text-emerald-700">
                    Dana Escrow telah dirilis ke freelancer. Terima kasih!
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    Setelah memeriksa hasil pekerjaan dan merasa puas, klik tombol di bawah untuk merilis dana Escrow ke freelancer.
                  </p>

                  {!isFreelancer && (
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={handleOpenReleaseModal}
                      rightIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Selesaikan Pesanan & Rilis Dana
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL KONFIRMASI RILIS DANA */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Selesaikan Pesanan"
        maxWidth="max-w-md"
      >
        <div className="space-y-3 text-xs">
          <p className="text-ink-secondary">
            Apakah Anda telah memeriksa seluruh hasil pekerjaan dan menyetujui penyelesaian pesanan ini?
          </p>
          <div className="p-3 bg-surface-gray rounded-md text-center">
            <span className="text-ink-secondary block">Dana yang Akan Dirilis ke Freelancer:</span>
            <span className="text-base font-bold text-brand-orange">
              {formatRupiah(servicePrice)}
            </span>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsConfirmModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" onClick={handleConfirmRelease}>
              Ya, Selesaikan & Beri Ulasan
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL ULASAN */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Beri Rating & Ulasan"
        maxWidth="max-w-md"
      >
        <div className="space-y-3 text-xs">
          <div className="text-center">
            <p className="text-ink-secondary mb-2">
              Berikan rating untuk {order.freelancer.name}:
            </p>
            <div className="flex items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-ink-main mb-1">
              Komentar / Ulasan
            </label>
            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Contoh: Pekerjaan rapi, komunikatif, dan selesai tepat waktu!"
              className="w-full px-3 py-2 text-xs bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isCompleting}
              onClick={handleSubmitReviewAndComplete}
            >
              Kirim Ulasan & Selesaikan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function PesananPage() {
  return (
    <ProtectedRoute>
      <OrderDetailPage />
    </ProtectedRoute>
  );
}
