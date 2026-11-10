"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2, ShieldAlert } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ProtectedRoute({ children, requireFreelancer = false }) {
  const { user, isLoggedIn, isLoading, switchRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isLoggedIn, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-8 h-8 text-brand-orange animate-spin mb-3" />
        <p className="text-sm font-medium text-ink-secondary">Memeriksa status autentikasi...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-12 h-12 text-brand-orange mb-3" />
        <h3 className="text-lg font-bold text-brand-blue mb-1">Akses Memerlukan Login</h3>
        <p className="text-sm text-ink-secondary max-w-md mb-4">
          Halaman ini dilindungi oleh sistem keamanan JasaKite. Silakan masuk terlebih dahulu untuk melanjutkan.
        </p>
        <Button
          variant="primary"
          onClick={() => router.push(`/login?redirect=${encodeURIComponent(pathname)}`)}
        >
          Masuk ke Akun
        </Button>
      </div>
    );
  }

  // Jika halaman butuh peran freelancer tapi user saat ini login sebagai pemesan
  if (requireFreelancer && user?.role !== "freelancer") {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white border border-gray-200 rounded-2xl shadow-card text-center">
        <div className="w-14 h-14 bg-orange-100 text-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-brand-blue mb-2">Halaman Khusus Freelancer Terdaftar</h2>
        <p className="text-sm text-ink-secondary leading-relaxed mb-6">
          Kamu saat ini masuk dengan akun <span className="font-semibold text-brand-blue">{user.name}</span> sebagai <span className="font-semibold text-brand-orange">Pemesan</span>. Untuk melihat dasbor pendapatan dan mengunggah draf tugas, silakan beralih ke mode Freelancer atau daftar verifikasi KTM.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            onClick={() => {
              switchRole();
            }}
          >
            Beralih ke Peran Freelancer (Demo)
          </Button>
          <Button variant="ghost" onClick={() => router.push("/")}>
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  return children;
}

