"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, isValidIndonesianPhone, normalizeWhatsApp } from "@/context/AuthContext";
import { SUPPORTED_CAMPUSES, validateCampusEmail, getCampusById } from "@/config/campuses";
import { CATEGORIES } from "@/config/categories";
import Button from "@/components/ui/Button";
import BrandDivider from "@/components/ui/BrandDivider";
import {
  ShieldCheck,
  UploadCloud,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Clock,
  Phone,
} from "lucide-react";

export default function DaftarPage() {
  const router = useRouter();
  const { register } = useAuth();

  // Role selector: 'pemesan' (Customer siapa saja) | 'freelancer' (Mahasiswa UNTAN/POLNEP)
  const [role, setRole] = useState("pemesan");
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State Customer (Pemesan Umum)
  const [customerData, setCustomerData] = useState({
    name: "",
    whatsapp: "",
    password: "",
    confirmPassword: "",
    email: "", // opsional
  });

  // Form State Freelancer (Mahasiswa UNTAN / POLNEP)
  const [freelancerData, setFreelancerData] = useState({
    name: "",
    nim: "",
    campusId: "",
    major: "",
    email: "",
    whatsapp: "",
    password: "",
    confirmPassword: "",
    ktmFile: null,
    ktmPreview: null,
    selectedCategories: ["edit-video-foto"],
    portfolioLink: "",
    bio: "",
  });

  const selectedCampus = freelancerData.campusId
    ? getCampusById(freelancerData.campusId)
    : null;

  // Indikator Kekuatan Password
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", color: "bg-gray-200", textClass: "" };
    if (pwd.length < 8) {
      return { score: 1, label: "Minimal 8 Karakter", color: "bg-red-500", textClass: "text-red-600" };
    }
    const hasLetters = /[a-zA-Z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    const hasSpecialOrUpper = /[^a-zA-Z0-9]/.test(pwd) || (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd));

    if (hasLetters && hasNumbers && hasSpecialOrUpper && pwd.length >= 10) {
      return { score: 3, label: "Kuat", color: "bg-emerald-600", textClass: "text-emerald-600" };
    }
    if (hasLetters && hasNumbers) {
      return { score: 2, label: "Sedang", color: "bg-amber-500", textClass: "text-amber-600" };
    }
    return { score: 1, label: "Cukup", color: "bg-red-500", textClass: "text-red-600" };
  };

  const customerPwdStrength = getPasswordStrength(customerData.password);
  const freelancerPwdStrength = getPasswordStrength(freelancerData.password);

  // File Upload Handlers (Freelancer KTM)
  const handleFileUpload = (file) => {
    setErrorMsg("");
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Format file harus berupa gambar JPG atau PNG.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMsg("Ukuran file KTM maksimal 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFreelancerData((prev) => ({
        ...prev,
        ktmFile: file,
        ktmPreview: e.target?.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Submit Pendaftaran Customer
  const handleSubmitCustomer = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!customerData.name.trim()) {
      setErrorMsg("Nama lengkap wajib diisi.");
      return;
    }
    if (!customerData.whatsapp.trim()) {
      setErrorMsg("Nomor WhatsApp wajib diisi.");
      return;
    }
    if (!isValidIndonesianPhone(customerData.whatsapp)) {
      setErrorMsg("Format nomor WhatsApp tidak valid. Gunakan format Indonesia (misal: 08xx atau +628xx).");
      return;
    }
    if (!customerData.password || customerData.password.length < 8) {
      setErrorMsg("Password minimal 8 karakter.");
      return;
    }
    if (customerData.password !== customerData.confirmPassword) {
      setErrorMsg("Konfirmasi password tidak cocok.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name: customerData.name.trim(),
      whatsapp: customerData.whatsapp.trim(),
      phone: customerData.whatsapp.trim(),
      email: customerData.email.trim() || `${customerData.name.toLowerCase().replace(/\s+/g, "")}@jasakite.user`,
      password: customerData.password,
      role: "pemesan",
      campus: "Umum",
      campusFullName: "Pemesan Umum",
      verificationStatus: "active",
    };

    const res = await register(payload);
    setIsSubmitting(false);

    if (res.success) {
      setIsSubmitted(true);
    } else {
      setErrorMsg(res.message || "Gagal memproses pendaftaran akun pemesan.");
    }
  };

  // Validasi Step 1 Freelancer
  const validateFreelancerStep1 = () => {
    if (!freelancerData.name.trim()) return "Nama lengkap wajib diisi.";
    if (!freelancerData.campusId) return "Pilih kampus Anda (UNTAN atau POLNEP).";
    if (!freelancerData.nim.trim()) return "NIM mahasiswa wajib diisi.";
    if (!freelancerData.major) return "Pilih jurusan atau program studi Anda.";
    if (!freelancerData.email.trim()) return "Email kampus resmi wajib diisi.";

    const emailCheck = validateCampusEmail(freelancerData.email, freelancerData.campusId);
    if (!emailCheck.valid) return emailCheck.message;

    if (!freelancerData.whatsapp.trim()) return "Nomor WhatsApp wajib diisi.";
    if (!isValidIndonesianPhone(freelancerData.whatsapp)) {
      return "Format nomor WhatsApp tidak valid (harus 08xx atau +628xx).";
    }

    if (!freelancerData.password || freelancerData.password.length < 8) {
      return "Password minimal 8 karakter.";
    }
    if (freelancerData.password !== freelancerData.confirmPassword) {
      return "Konfirmasi password tidak cocok.";
    }
    return "";
  };

  const handleFreelancerNext = () => {
    setErrorMsg("");
    if (step === 1) {
      const err = validateFreelancerStep1();
      if (err) {
        setErrorMsg(err);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!freelancerData.ktmPreview) {
        setErrorMsg("Harap unggah foto KTM Anda untuk verifikasi identitas.");
        return;
      }
      setStep(3);
    }
  };

  const handleToggleCategory = (catId) => {
    setFreelancerData((prev) => {
      const current = prev.selectedCategories;
      if (current.includes(catId)) {
        if (current.length === 1) return prev;
        return { ...prev, selectedCategories: current.filter((c) => c !== catId) };
      }
      return { ...prev, selectedCategories: [...current, catId] };
    });
  };

  const handleSubmitFreelancerFinal = async () => {
    setErrorMsg("");
    setIsSubmitting(true);

    const payload = {
      name: freelancerData.name.trim(),
      nim: freelancerData.nim.trim(),
      campus: selectedCampus?.shortName || "POLNEP",
      campusFullName: selectedCampus?.name || "Politeknik Negeri Pontianak",
      major: freelancerData.major,
      email: freelancerData.email.trim(),
      whatsapp: freelancerData.whatsapp.trim(),
      phone: freelancerData.whatsapp.trim(),
      password: freelancerData.password,
      role: "freelancer",
      ktmVerified: false,
      verificationStatus: "pending_review",
      selectedCategories: freelancerData.selectedCategories,
      portfolioLink: freelancerData.portfolioLink,
      bio: freelancerData.bio || "Mahasiswa Pontianak aktif dan berprestasi.",
    };

    const res = await register(payload);
    setIsSubmitting(false);

    if (res.success) {
      setIsSubmitted(true);
    } else {
      setErrorMsg(res.message || "Gagal memproses pendaftaran freelancer.");
    }
  };

  // Layar Sukses Pendaftaran
  if (isSubmitted) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 bg-surface-gray">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
            {role === "freelancer" ? (
              <Clock className="w-8 h-8 text-brand-orange" />
            ) : (
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            )}
          </div>

          <h1 className="text-xl font-bold text-ink-main mb-2">
            {role === "freelancer"
              ? "Pendaftaran Berhasil Dikirim"
              : "Akun Pemesan Berhasil Dibuat!"}
          </h1>

          <BrandDivider className="justify-center mb-4" />

          {role === "freelancer" ? (
            <div className="text-xs text-ink-secondary space-y-3 mb-6 text-left bg-surface-gray p-4 rounded-md border border-gray-200">
              <p className="font-semibold text-brand-blue">
                Status: Menunggu Verifikasi KTM (Maks. 1x24 Jam)
              </p>
              <p>
                Tim admin JasaKite sedang memvalidasi data NIM dan foto KTM kamu dengan pangkalan data {selectedCampus?.shortName || "kampus"}.
              </p>
              <p>
                Setelah diverifikasi, kamu dapat langsung membuka jasa dan menerima pesanan dari pemesan.
              </p>
            </div>
          ) : (
            <p className="text-xs text-ink-secondary mb-6 leading-relaxed">
              Selamat datang di JasaKite.id! Akun Anda langsung aktif. Anda dapat langsung mencari jasa, berdiskusi dengan freelancer mahasiswa UNTAN & POLNEP, dan bertransaksi aman melalui Escrow.
            </p>
          )}

          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => router.push("/")}
              className="w-full"
            >
              Mulai Jelajahi Jasa
            </Button>
            {role === "freelancer" && (
              <Button
                variant="outline-blue"
                size="md"
                onClick={() => router.push("/dasbor")}
                className="w-full"
              >
                Buka Dasbor Freelancer
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] py-10 px-4 sm:px-6 lg:px-8 bg-surface-gray">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-brand-blue">
            Daftar Akun JasaKite.id
          </h1>
          <p className="text-xs text-ink-secondary mt-1">
            Freelancer: mahasiswa UNTAN & POLNEP terverifikasi • Pemesan: siapa saja
          </p>
          <BrandDivider className="justify-center mt-3" />
        </div>

        {/* Tab Pilihan Peran */}
        <div className="bg-white p-1 rounded-md border border-gray-200 mb-6 grid grid-cols-2 gap-1.5 shadow-xs">
          <button
            type="button"
            onClick={() => {
              setRole("pemesan");
              setStep(1);
              setErrorMsg("");
            }}
            className={`py-2.5 px-3 rounded text-xs font-semibold transition text-center ${
              role === "pemesan"
                ? "bg-brand-blue text-white shadow-xs"
                : "text-ink-secondary hover:text-ink-main hover:bg-gray-50"
            }`}
          >
            <div>Pemesan (Siapa Saja)</div>
            <div className="text-[10px] font-normal opacity-90 mt-0.5">
              Cari dan pesan jasa, tanpa syarat KTM
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              setRole("freelancer");
              setStep(1);
              setErrorMsg("");
            }}
            className={`py-2.5 px-3 rounded text-xs font-semibold transition text-center ${
              role === "freelancer"
                ? "bg-brand-orange text-white shadow-xs"
                : "text-ink-secondary hover:text-ink-main hover:bg-gray-50"
            }`}
          >
            <div>Freelancer (Mahasiswa)</div>
            <div className="text-[10px] font-normal opacity-90 mt-0.5">
              Khusus mahasiswa UNTAN & POLNEP (Wajib KTM)
            </div>
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-status-error text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* FORM PEMESAN (CUSTOMER SIAPA SAJA - BEBAS TANPA KTM/NIM) */}
        {role === "pemesan" ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-xs">
            <div className="border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-ink-main">
                Form Pendaftaran Pemesan
              </h3>
              <p className="text-xs text-ink-secondary">
                Terbuka untuk masyarakat umum, alumni, instansi, atau mahasiswa mana pun.
              </p>
            </div>

            <form onSubmit={handleSubmitCustomer} className="space-y-4">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-semibold text-ink-main mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                  placeholder="mis. Budi Santoso"
                  className="w-full px-3 py-2 text-sm bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                />
              </div>

              {/* Nomor WhatsApp */}
              <div>
                <label className="block text-xs font-semibold text-ink-main mb-1">
                  Nomor WhatsApp *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={customerData.whatsapp}
                    onChange={(e) => setCustomerData({ ...customerData, whatsapp: e.target.value })}
                    placeholder="mis. 081234567890 atau +6281234567890"
                    className="w-full px-3 py-2 text-sm bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <p className="text-[11px] text-ink-secondary mt-1">
                  Nomor WhatsApp digunakan untuk login dan komunikasi setelah pesanan dibayar.
                </p>
              </div>

              {/* Email (Opsional) */}
              <div>
                <label className="block text-xs font-semibold text-ink-main mb-1">
                  Email (Opsional)
                </label>
                <input
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                  placeholder="mis. budi@gmail.com (opsional)"
                  className="w-full px-3 py-2 text-sm bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-ink-main mb-1">
                  Password (Minimal 8 karakter) *
                </label>
                <input
                  type="password"
                  value={customerData.password}
                  onChange={(e) => setCustomerData({ ...customerData, password: e.target.value })}
                  placeholder="Masukkan password"
                  className="w-full px-3 py-2 text-sm bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                />
                {customerData.password && (
                  <div className="mt-1.5 flex items-center justify-between text-[11px]">
                    <span className="text-ink-secondary">Kekuatan:</span>
                    <span className={`font-semibold ${customerPwdStrength.textClass}`}>
                      {customerPwdStrength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Konfirmasi Password */}
              <div>
                <label className="block text-xs font-semibold text-ink-main mb-1">
                  Konfirmasi Password *
                </label>
                <input
                  type="password"
                  value={customerData.confirmPassword}
                  onChange={(e) => setCustomerData({ ...customerData, confirmPassword: e.target.value })}
                  placeholder="Ulangi password"
                  className="w-full px-3 py-2 text-sm bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  className="w-full"
                >
                  Daftar sebagai Pemesan
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* FORM FREELANCER (MAHASISWA UNTAN / POLNEP - TETAP WAJIB VERIFIKASI KTM) */
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-xs space-y-4">
            {/* Step Indicator */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 text-xs">
              <span className={`font-semibold ${step === 1 ? "text-brand-orange" : "text-ink-secondary"}`}>
                1. Identitas Kampus
              </span>
              <span>•</span>
              <span className={`font-semibold ${step === 2 ? "text-brand-orange" : "text-ink-secondary"}`}>
                2. Unggah KTM
              </span>
              <span>•</span>
              <span className={`font-semibold ${step === 3 ? "text-brand-orange" : "text-ink-secondary"}`}>
                3. Keahlian Jasa
              </span>
            </div>

            {/* Step 1: Data Diri Mahasiswa */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-main mb-1">
                    Nama Lengkap (sesuai KTM) *
                  </label>
                  <input
                    type="text"
                    value={freelancerData.name}
                    onChange={(e) => setFreelancerData({ ...freelancerData, name: e.target.value })}
                    placeholder="mis. Siti Rahmawati"
                    className="w-full px-3 py-2 text-sm bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-ink-main mb-1">
                      Perguruan Tinggi (UNTAN / POLNEP) *
                    </label>
                    <select
                      value={freelancerData.campusId}
                      onChange={(e) =>
                        setFreelancerData({
                          ...freelancerData,
                          campusId: e.target.value,
                          major: "",
                        })
                      }
                      className="w-full px-3 py-2 text-sm bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                    >
                      <option value="">-- Pilih Kampus --</option>
                      {SUPPORTED_CAMPUSES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.shortName} - {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-main mb-1">
                      Nomor Induk Mahasiswa (NIM) *
                    </label>
                    <input
                      type="text"
                      value={freelancerData.nim}
                      onChange={(e) => setFreelancerData({ ...freelancerData, nim: e.target.value })}
                      placeholder="mis. 3202116045"
                      className="w-full px-3 py-2 text-sm bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-main mb-1">
                    Jurusan / Program Studi *
                  </label>
                  <select
                    value={freelancerData.major}
                    onChange={(e) => setFreelancerData({ ...freelancerData, major: e.target.value })}
                    disabled={!freelancerData.campusId}
                    className="w-full px-3 py-2 text-sm bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue disabled:opacity-50"
                  >
                    <option value="">
                      {freelancerData.campusId ? "-- Pilih Jurusan --" : "-- Pilih kampus terlebih dahulu --"}
                    </option>
                    {selectedCampus?.majors.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-ink-main mb-1">
                      Email Kampus Resmi *
                    </label>
                    <input
                      type="email"
                      value={freelancerData.email}
                      onChange={(e) => setFreelancerData({ ...freelancerData, email: e.target.value })}
                      placeholder={selectedCampus ? `nama${selectedCampus.defaultEmailDomain}` : "Email kampus"}
                      className="w-full px-3 py-2 text-sm bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-main mb-1">
                      Nomor WhatsApp Aktif *
                    </label>
                    <input
                      type="tel"
                      value={freelancerData.whatsapp}
                      onChange={(e) => setFreelancerData({ ...freelancerData, whatsapp: e.target.value })}
                      placeholder="085245123456"
                      className="w-full px-3 py-2 text-sm bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-ink-main mb-1">
                      Password (Min. 8 karakter) *
                    </label>
                    <input
                      type="password"
                      value={freelancerData.password}
                      onChange={(e) => setFreelancerData({ ...freelancerData, password: e.target.value })}
                      placeholder="Minimal 8 karakter"
                      className="w-full px-3 py-2 text-sm bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-main mb-1">
                      Konfirmasi Password *
                    </label>
                    <input
                      type="password"
                      value={freelancerData.confirmPassword}
                      onChange={(e) => setFreelancerData({ ...freelancerData, confirmPassword: e.target.value })}
                      placeholder="Ulangi password"
                      className="w-full px-3 py-2 text-sm bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={handleFreelancerNext}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Lanjut ke Unggah KTM
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Upload KTM */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-md border border-blue-200 text-xs text-brand-blue">
                  <p className="font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-brand-orange" />
                    Wajib Kartu Mahasiswa Asli UNTAN / POLNEP
                  </p>
                  <p className="text-[11px] text-gray-700 mt-1">
                    Unggah foto KTM fisik atau screenshot KTM digital resmi. Nama dan NIM harus terlihat jelas.
                  </p>
                </div>

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("ktm-input")?.click()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                    freelancerData.ktmPreview
                      ? "border-emerald-500 bg-emerald-50/20"
                      : "border-gray-300 hover:border-brand-orange bg-surface-gray/50"
                  }`}
                >
                  <input
                    id="ktm-input"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files?.[0])}
                  />

                  {freelancerData.ktmPreview ? (
                    <div className="space-y-2">
                      <div className="max-w-xs mx-auto rounded border border-gray-200 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={freelancerData.ktmPreview}
                          alt="KTM Preview"
                          className="w-full h-auto max-h-40 object-cover"
                        />
                      </div>
                      <p className="text-xs font-semibold text-emerald-700 flex items-center justify-center gap-1">
                        <FileCheck className="w-4 h-4" />
                        {freelancerData.ktmFile?.name || "KTM_Mahasiswa.jpg"}
                      </p>
                      <p className="text-[10px] text-ink-secondary">
                        Klik untuk mengganti gambar.
                      </p>
                    </div>
                  ) : (
                    <div className="py-4 space-y-1">
                      <UploadCloud className="w-8 h-8 text-brand-orange mx-auto" />
                      <p className="text-xs font-bold text-ink-main">
                        Tarik file foto KTM ke sini atau klik untuk memilih
                      </p>
                      <p className="text-[11px] text-ink-secondary">
                        Format JPG atau PNG (Maksimal 5 MB)
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={() => setStep(1)}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Kembali
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={handleFreelancerNext}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Lanjut ke Keahlian
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Keahlian & Kategori */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-main mb-2">
                    Kategori Jasa yang Ingin Ditawarkan *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CATEGORIES.map((cat) => {
                      const isSelected = freelancerData.selectedCategories.includes(cat.id);
                      return (
                        <div
                          key={cat.id}
                          onClick={() => handleToggleCategory(cat.id)}
                          className={`p-2.5 rounded-md border text-xs cursor-pointer select-none transition ${
                            isSelected
                              ? "bg-orange-50 border-brand-orange text-brand-orange font-semibold"
                              : "bg-surface-gray border-gray-200 text-ink-main hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${
                                isSelected
                                  ? "bg-brand-orange border-brand-orange text-white"
                                  : "border-gray-400 bg-white"
                              }`}
                            >
                              {isSelected && <CheckCircle2 className="w-3 h-3" />}
                            </div>
                            <span>{cat.name}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-main mb-1">
                    Tautan Portofolio / Contoh Karya (Google Drive, Behance, GitHub, IG)
                  </label>
                  <input
                    type="url"
                    value={freelancerData.portfolioLink}
                    onChange={(e) =>
                      setFreelancerData({ ...freelancerData, portfolioLink: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-sm bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-main mb-1">
                    Bio Singkat
                  </label>
                  <textarea
                    rows={3}
                    value={freelancerData.bio}
                    onChange={(e) => setFreelancerData({ ...freelancerData, bio: e.target.value })}
                    placeholder="Ceritakan keahlian dan pengalamanmu secara singkat..."
                    className="w-full px-3 py-2 text-sm bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div className="pt-2 flex justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={() => setStep(2)}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Kembali
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    isLoading={isSubmitting}
                    onClick={handleSubmitFreelancerFinal}
                  >
                    Kirim Pendaftaran Mahasiswa
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-center text-xs text-ink-secondary">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-bold text-brand-blue hover:text-brand-orange transition underline underline-offset-2"
          >
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
