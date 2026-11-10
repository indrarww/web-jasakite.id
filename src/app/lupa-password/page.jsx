"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";

export default function LupaPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSent(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 bg-surface-gray">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-card border border-gray-100 p-8 text-center">
        <div className="mb-6 flex justify-center">
          <Logo variant="login" href="/" priority />
        </div>

        {isSent ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-brand-blue">Tautan Reset Terkirim!</h2>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Kami telah mengirimkan instruksi pengaturan ulang kata sandi ke email kampus{" "}
              <strong className="text-ink-main">{email}</strong>. Silakan periksa folder kotak masuk atau spam Anda.
            </p>
            <div className="pt-2">
              <Link href="/login">
                <Button variant="primary" size="md" className="w-full">
                  Kembali ke Halaman Masuk
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-brand-blue font-heading">Lupa Password Akun?</h1>
            <p className="text-xs text-ink-secondary">
              Masukkan email kampus UNTAN atau POLNEP yang terdaftar, kami akan mengirimkan tautan reset kata sandi.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-left pt-2">
              <div>
                <label className="block text-xs font-semibold text-ink-main mb-1">
                  Email Kampus Mahasiswa
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nim@student.untan.ac.id atau @polnep.ac.id"
                  className="w-full px-3.5 py-2.5 text-sm bg-surface-gray border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue"
                />
              </div>

              <Button type="submit" variant="primary" size="md" className="w-full">
                Kirim Tautan Reset
              </Button>
            </form>

            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-ink-secondary hover:text-brand-blue transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Batal dan kembali ke halaman masuk</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

