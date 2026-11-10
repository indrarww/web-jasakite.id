"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { DUMMY_SERVICES } from "@/config/dummyData";
import { AD_PRICE_PER_DAY, AD_CHANNELS, formatRupiah } from "@/config/pricing";
import SafeImage from "@/components/ui/SafeImage";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import {
  Megaphone,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  MousePointerClick,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export default function IklanPage() {
  const { user } = useAuth();
  const { ads, createAd, freelancerBalance } = useOrders();

  // Layanan freelancer yang bisa diiklankan
  const myServices = DUMMY_SERVICES.filter(
    (s) => s.freelancer.id === user?.id || s.freelancer.campus === user?.campus
  );
  const defaultService = myServices[0] || DUMMY_SERVICES[0];

  const [selectedServiceId, setSelectedServiceId] = useState(defaultService.id);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [durationDays, setDurationDays] = useState(7);
  const [selectedChannels, setSelectedChannels] = useState(["web"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const targetService =
    DUMMY_SERVICES.find((s) => s.id === selectedServiceId) || defaultService;

  // Hitung biaya iklan: tarif per hari x hari x jumlah saluran
  const totalCost = AD_PRICE_PER_DAY * durationDays * selectedChannels.length;

  const handleToggleChannel = (channelId) => {
    if (selectedChannels.includes(channelId)) {
      if (selectedChannels.length === 1) return; // minimal 1 saluran
      setSelectedChannels(selectedChannels.filter((c) => c !== channelId));
    } else {
      setSelectedChannels([...selectedChannels, channelId]);
    }
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!selectedServiceId) {
      setErrorMessage("Harap pilih jasa yang ingin diiklankan.");
      return;
    }
    if (durationDays < 1 || durationDays > 30) {
      setErrorMessage("Durasi iklan antara 1 hingga 30 hari.");
      return;
    }
    if (selectedChannels.length === 0) {
      setErrorMessage("Pilih minimal satu saluran penayangan iklan.");
      return;
    }

    setIsModalOpen(true);
  };

  const handleConfirmAd = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    // Hitung tanggal selesai
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + Number(durationDays));

    const newAd = createAd({
      serviceId: targetService.id,
      serviceTitle: targetService.title,
      days: Number(durationDays),
      startDate: startDate,
      endDate: end.toISOString().split("T")[0],
      channels: selectedChannels,
      pricePerDay: AD_PRICE_PER_DAY * selectedChannels.length,
      totalCost,
    });

    setIsSubmitting(false);
    setIsModalOpen(false);
    setSuccessMessage(
      `Pengajuan iklan untuk jasa "${targetService.title}" berhasil dibuat! Status saat ini: Menunggu Peninjauan oleh admin.`
    );
  };

  return (
    <ProtectedRoute requireFreelancer>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-ink-secondary mb-1">
            <Link href="/dasbor" className="hover:text-brand-blue flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dasbor Freelancer</span>
            </Link>
            <span>/</span>
            <span className="text-ink-main font-semibold">Iklan Berbayar</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-main flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-brand-orange" />
            <span>Iklan Berbayar & Promosi Jasa</span>
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
            Iklankan jasa Anda di slot &quot;Jasa Pilihan&quot; beranda web dan siaran media sosial JasaKite Pontianak.
          </p>
        </div>

        {/* Notifikasi */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-status-error text-xs flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Kolom Kiri: Form Pasang Iklan */}
          <div className="lg:col-span-6 bg-white p-6 rounded-lg border border-gray-200 shadow-xs">
            <h2 className="text-sm font-bold text-ink-main mb-1">
              Formulir Pemasangan Iklan
            </h2>
            <p className="text-xs text-ink-secondary mb-5">
              Tarif transparan {formatRupiah(AD_PRICE_PER_DAY)} / hari per saluran penayangan.
            </p>

            <form onSubmit={handlePreSubmit} className="space-y-4 text-xs">
              {/* Pilih Jasa */}
              <div>
                <label className="block font-semibold text-ink-main mb-1">
                  Pilih Jasa yang Ingin Diiklankan *
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                >
                  {DUMMY_SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({formatRupiah(s.price)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Tanggal Mulai & Durasi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-ink-main mb-1">
                    Tanggal Mulai Tayang *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-ink-main">Jumlah Hari *</label>
                    <span className="text-[11px] text-ink-secondary">1 - 30 hari</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue font-bold"
                  />
                </div>
              </div>

              {/* Pilihan Saluran Iklan */}
              <div>
                <label className="block font-semibold text-ink-main mb-1.5">
                  Saluran Penayangan Iklan *
                </label>
                <div className="space-y-2">
                  {AD_CHANNELS.map((ch) => {
                    const isChecked = selectedChannels.includes(ch.id);
                    return (
                      <div
                        key={ch.id}
                        onClick={() => handleToggleChannel(ch.id)}
                        className={`p-3 rounded-md border cursor-pointer transition select-none flex items-start gap-2.5 ${
                          isChecked
                            ? "bg-blue-50/70 border-brand-blue text-brand-blue"
                            : "bg-surface-gray border-gray-200 text-ink-main hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 text-brand-blue rounded border-gray-300 mt-0.5 shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs">{ch.name}</span>
                            <span className="text-[11px] font-semibold text-brand-orange">
                              {formatRupiah(AD_PRICE_PER_DAY)}/hari
                            </span>
                          </div>
                          <p className="text-[11px] text-ink-secondary mt-0.5">
                            {ch.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Kalkulasi Ringkasan Biaya */}
              <div className="p-3.5 bg-surface-gray rounded-md border border-gray-200 space-y-1.5">
                <div className="flex justify-between text-ink-secondary">
                  <span>Durasi:</span>
                  <span className="font-semibold text-ink-main">{durationDays} Hari</span>
                </div>
                <div className="flex justify-between text-ink-secondary">
                  <span>Jumlah Saluran:</span>
                  <span className="font-semibold text-ink-main">
                    {selectedChannels.length} Saluran
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold text-sm">
                  <span>Total Biaya Iklan:</span>
                  <span className="text-brand-orange">{formatRupiah(totalCost)}</span>
                </div>
              </div>

              <Button type="submit" variant="primary" size="md" className="w-full">
                Lanjut ke Pratinjau & Pembayaran
              </Button>
            </form>
          </div>

          {/* Kolom Kanan: Pratinjau Tampilan Iklan */}
          <div className="lg:col-span-6 bg-white p-6 rounded-lg border border-gray-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                <h3 className="text-sm font-bold text-ink-main">
                  Pratinjau Tampilan Iklan di Beranda
                </h3>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase">
                  Label: Iklan
                </span>
              </div>

              {/* Kartu Pratinjau */}
              <div className="max-w-sm mx-auto bg-surface-gray rounded-lg border border-gray-200 overflow-hidden shadow-xs p-3">
                <div className="relative h-36 bg-gray-200 rounded overflow-hidden mb-3">
                  <SafeImage
                    src={targetService.portfolio?.[0]?.image || "/assets/portofolio/porto-1.jpg"}
                    alt={targetService.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-gray-900/80 text-white text-[10px] font-bold rounded">
                    Iklan Jasa Pilihan
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold text-brand-blue uppercase tracking-wider">
                    {targetService.freelancer.campus} • {targetService.freelancer.major}
                  </span>
                  <h4 className="text-xs font-bold text-ink-main line-clamp-2">
                    {targetService.title}
                  </h4>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-brand-orange">
                      Mulai {formatRupiah(targetService.price)}
                    </span>
                    <span className="text-[10px] text-ink-secondary">
                      ⭐ {targetService.freelancer.rating} ({targetService.freelancer.completedOrders} pesanan)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-blue-50/60 rounded-md border border-blue-100 text-[11px] text-ink-secondary space-y-1">
              <p className="font-semibold text-brand-blue">
                Alur Penayangan Iklan:
              </p>
              <p>
                1. Iklan web langsung aktif di slot &quot;Jasa Pilihan&quot; setelah pembayaran dikonfirmasi.
              </p>
              <p>
                2. Iklan media sosial akan dijadwalkan oleh tim admin JasaKite via WhatsApp & Instagram @jasakite.id.
              </p>
            </div>
          </div>
        </div>

        {/* Tabel Riwayat Iklan & Ringkasan Performa */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-ink-main mb-1">
            Riwayat Iklan & Metrik Performa
          </h3>
          <p className="text-xs text-ink-secondary mb-4">
            Pantau status tayang, jumlah impresi tampilan, dan klik dari calon klien.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-gray text-ink-secondary border-y border-gray-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Jasa yang Diiklankan</th>
                  <th className="py-2.5 px-3 font-semibold">Periode Tayang</th>
                  <th className="py-2.5 px-3 font-semibold">Saluran</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Biaya</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Performa</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ads.map((ad) => (
                  <tr key={ad.id} className="hover:bg-surface-gray/50 transition">
                    <td className="py-3 px-3 max-w-xs">
                      <div className="font-bold text-ink-main truncate">{ad.serviceTitle}</div>
                      <div className="text-[10px] text-ink-muted">ID: {ad.id}</div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="text-ink-main">{ad.days} Hari</div>
                      <div className="text-[10px] text-ink-muted">
                        {ad.startDate} s.d {ad.endDate}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {ad.channels?.map((ch) => (
                          <span
                            key={ch}
                            className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-medium"
                          >
                            {ch === "web" ? "Web Beranda" : "Sosmed"}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-ink-main">
                      {formatRupiah(ad.totalCost)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-3 text-[11px]">
                        <span className="flex items-center gap-1 text-ink-secondary" title="Tayangan">
                          <Eye className="w-3.5 h-3.5" />
                          {ad.impressions || 0}
                        </span>
                        <span className="flex items-center gap-1 text-brand-orange font-semibold" title="Klik">
                          <MousePointerClick className="w-3.5 h-3.5" />
                          {ad.clicks || 0}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${
                          ad.status === "aktif"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : ad.status === "menunggu_peninjauan"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {ad.status?.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Konfirmasi & Pembayaran Iklan */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Konfirmasi & Bayar Iklan"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs text-ink-main">
            <p className="text-ink-secondary">
              Periksa ringkasan kampanye promosi jasa Anda sebelum melanjutkan:
            </p>

            <div className="bg-surface-gray p-3.5 rounded-md border border-gray-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-ink-secondary">Jasa:</span>
                <span className="font-bold truncate max-w-[200px] text-right">
                  {targetService.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-secondary">Durasi:</span>
                <span className="font-semibold">{durationDays} Hari</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-secondary">Tanggal Mulai:</span>
                <span className="font-semibold">{startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-secondary">Saluran:</span>
                <span className="font-semibold">
                  {selectedChannels.map((c) => (c === "web" ? "Web" : "Sosmed")).join(" + ")}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-sm">
                <span>Total Biaya:</span>
                <span className="text-brand-orange">{formatRupiah(totalCost)}</span>
              </div>
            </div>

            <p className="text-[11px] text-ink-secondary">
              Metode: Pemotongan saldo dompet atau QRIS instan simulasi.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
                onClick={handleConfirmAd}
              >
                Bayar & Terbitkan Iklan
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}

