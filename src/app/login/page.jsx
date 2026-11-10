"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, DEMO_ACCOUNTS } from "@/context/AuthContext";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import DemoAccountsBox from "@/components/ui/DemoAccountsBox";
import { Eye, EyeOff, ShieldCheck, Lock, CheckCircle2, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get("redirect") || "/";

  const { login } = useAuth();

  const [role, setRole] = useState("pemesan"); // 'pemesan' | 'freelancer' | 'admin'
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState(null);

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!identifier.trim()) {
      setErrorMessage(
        role === "pemesan"
          ? "Harap masukkan nomor WhatsApp kamu."
          : "Harap masukkan email kampus atau NIM kamu."
      );
      return;
    }
    if (!password) {
      setErrorMessage("Harap masukkan password akun kamu.");
      return;
    }

    setIsLoading(true);
    const res = await login(identifier, password, role);
    setIsLoading(false);

    if (res.success) {
      if (res.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push(redirectUrl);
      }
    } else {
      setErrorMessage(res.message || "Identitas atau password salah.");
    }
  };

  /**
   * Memilih akun demo:
   * Mengganti toggle "Masuk sebagai", mengubah label kolom,
   * mengisi data secara otomatis, dan menyorot kartu yang terpilih tanpa auto-submit.
   */
  const handleSelectDemo = (type) => {
    setSelectedDemo(type);
    setErrorMessage("");

    if (type === "pemesan") {
      setRole("pemesan");
      setIdentifier(DEMO_ACCOUNTS.pemesan.whatsapp);
      setPassword(DEMO_ACCOUNTS.pemesan.password);
    } else if (type === "freelancer") {
      setRole("freelancer");
      setIdentifier(DEMO_ACCOUNTS.freelancer.email);
      setPassword(DEMO_ACCOUNTS.freelancer.password);
    } else if (type === "admin") {
      setRole("admin");
      setIdentifier(DEMO_ACCOUNTS.admin.email);
      setPassword(DEMO_ACCOUNTS.admin.password);
    }
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setIdentifier("");
    setPassword("");
    setSelectedDemo(null);
    setErrorMessage("");
  };

  // Label kolom input sesuai peran: WhatsApp untuk pemesan, Email kampus / NIM untuk freelancer dan admin
  const inputLabel = role === "pemesan" ? "Nomor WhatsApp" : "Email Kampus atau NIM";

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-4 sm:py-6 px-4 sm:px-6 lg:px-8 bg-surface-gray">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Kolom Kiri: Brand Panel (Desktop) - Solid bg-brand-blue, tanpa gradasi */}
        <div className="hidden lg:flex lg:col-span-5 bg-brand-blue p-8 text-white flex-col justify-between relative overflow-hidden">
          {/* Konten Utama Panel Kiri */}
          <div className="relative z-10">
            {/* Logo dalam kotak putih rounded dengan tinggi 48-56px */}
            <div className="inline-flex items-center bg-white px-3.5 py-2.5 rounded-xl shadow-xs mb-6 border border-white/20">
              <Logo variant="login" href="/" priority />
            </div>

            {/* Tagline Pendek & Natural */}
            <h2 className="text-xl font-bold leading-snug mb-2 text-white">
              Butuh bantuan? Cari mahasiswa Pontianak.
            </h2>
            <p className="text-xs text-blue-100 leading-relaxed mb-6">
              Pesan jasa terpercaya dari mahasiswa UNTAN & POLNEP untuk berbagai kebutuhan kamu.
            </p>

            {/* 3 Baris Singkat Poin Keunggulan */}
            <div className="space-y-3 pt-4 border-t border-white/20">
              <div className="flex items-center gap-2.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-[#FFC93C] shrink-0" />
                <span className="text-white font-medium">Freelancer mahasiswa UNTAN & POLNEP terverifikasi KTM</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span className="text-white font-medium">Pemesan terbuka untuk siapa saja via nomor WhatsApp</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs">
                <Lock className="w-4 h-4 text-brand-orange shrink-0" />
                <span className="text-white font-medium">Pembayaran aman dengan sistem escrow terpercaya</span>
              </div>
            </div>
          </div>

          {/* Footer Panel Kiri */}
          <div className="relative z-10 text-[11px] text-white/90 font-medium pt-8">
            © 2026 JasaKite.id • Pontianak
          </div>

          {/* Elemen Dekoratif Solid Geometris Logo (Oranye & Kuning) - Tanpa Gradasi */}
          <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none overflow-hidden select-none">
            <svg
              viewBox="0 0 360 110"
              preserveAspectRatio="none"
              className="w-full h-full block"
            >
              {/* Potongan diagonal kuning solid */}
              <polygon points="120,110 360,15 360,110" fill="#FFC93C" />
              {/* Potongan diagonal oranye solid */}
              <polygon points="0,55 240,110 0,110" fill="#FF7420" />
              {/* Bentuk geometris panah oranye solid dari logo JasaKite */}
              <polygon points="200,110 290,45 340,110" fill="#FF7420" />
            </svg>
          </div>
        </div>

        {/* Kolom Kanan: Form Login (Terlihat di Layar Pertama / Above the Fold pada 1366x768) */}
        <div className="lg:col-span-7 p-6 sm:p-7 flex flex-col justify-center">
          {/* Logo di Mobile (375px) - Hanya logo di dalam kotak putih, tanpa panel biru */}
          <div className="lg:hidden mb-4 flex flex-col items-center text-center">
            <div className="inline-flex items-center bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-xs mb-2">
              <Logo variant="login" href="/" priority />
            </div>
            <p className="text-xs text-ink-secondary">
              Freelancer: Mahasiswa UNTAN & POLNEP • Pemesan: Siapa saja
            </p>
          </div>

          {/* Judul & Sapaan */}
          <div className="mb-4">
            <h1 className="text-xl font-bold text-ink-main">
              Masuk ke Akun
            </h1>
            <p className="text-xs text-ink-secondary mt-0.5">
              Gunakan akun pemesan atau akun freelancer mahasiswa kamu.
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-3.5 p-2.5 bg-red-50 border border-red-200 rounded-md text-status-error text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Login Utama */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Toggle Masuk Sebagai (Pemesan / Freelancer / Admin) */}
            <div>
              <label className="block text-xs font-semibold text-ink-main mb-1">
                Masuk Sebagai:
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-surface-gray p-1 rounded-md border border-gray-200">
                <button
                  type="button"
                  onClick={() => handleRoleChange("pemesan")}
                  className={`py-1.5 px-2 text-xs font-semibold rounded transition text-center ${
                    role === "pemesan"
                      ? "bg-white text-brand-blue shadow-xs border border-gray-200"
                      : "text-ink-secondary hover:text-ink-main"
                  }`}
                >
                  Pemesan
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange("freelancer")}
                  className={`py-1.5 px-2 text-xs font-semibold rounded transition text-center ${
                    role === "freelancer"
                      ? "bg-brand-orange text-white shadow-xs"
                      : "text-ink-secondary hover:text-ink-main"
                  }`}
                >
                  Freelancer
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange("admin")}
                  className={`py-1.5 px-2 text-xs font-semibold rounded transition text-center ${
                    role === "admin"
                      ? "bg-gray-800 text-white shadow-xs"
                      : "text-ink-secondary hover:text-ink-main"
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Input WhatsApp untuk Pemesan, Email/NIM untuk Freelancer dan Admin */}
            <div>
              <label className="block text-xs font-semibold text-ink-main mb-1">
                {inputLabel}
              </label>
              <input
                type={role === "pemesan" ? "tel" : "text"}
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setSelectedDemo(null);
                }}
                placeholder={
                  role === "pemesan"
                    ? "mis. 081234567890 atau +62812..."
                    : role === "freelancer"
                    ? "mis. nama@student.untan.ac.id atau NIM"
                    : "mis. admin@jasakite.id"
                }
                className="w-full px-3.5 py-2 text-sm bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition"
              />
              {role === "pemesan" && (
                <p className="text-[11px] text-ink-secondary mt-1">
                  Nomor WhatsApp digunakan untuk komunikasi setelah pesanan disetujui.
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-ink-main">Password</label>
                <Link
                  href="/lupa-password"
                  className="text-xs text-brand-blue hover:text-brand-orange transition font-medium"
                >
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setSelectedDemo(null);
                  }}
                  placeholder="Masukkan password akun kamu"
                  className="w-full pl-3.5 pr-10 py-2 text-sm bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-main transition"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox Ingat Saya */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-brand-orange border-gray-300 rounded focus:ring-brand-orange cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-ink-secondary cursor-pointer">
                Ingat saya di perangkat ini
              </label>
            </div>

            {/* Tombol Masuk */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="w-full font-bold shadow-xs mt-1"
            >
              Masuk
            </Button>
          </form>

          {/* Link ke Pendaftaran */}
          <div className="mt-4 text-center text-xs text-ink-secondary">
            Belum punya akun?{" "}
            <Link
              href="/daftar"
              className="font-bold text-brand-blue hover:text-brand-orange transition underline underline-offset-2"
            >
              Daftar akun sekarang
            </Link>
          </div>

          {/* Kotak Akun Demo (Di Bawah Form, Accordion Tertutup Secara Default, Hanya Jika NEXT_PUBLIC_DEMO_MODE=true) */}
          {isDemoMode && (
            <div className="mt-4 pt-3.5 border-t border-gray-150">
              <DemoAccountsBox
                onSelectDemo={handleSelectDemo}
                selectedDemo={selectedDemo}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
