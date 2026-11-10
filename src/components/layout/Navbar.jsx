"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Search,
  MessageSquare,
  LayoutDashboard,
  ShoppingBag,
  Wallet,
  Crown,
  Megaphone,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  Shield,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import Logo from "@/components/ui/Logo";

function DesktopSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get("q") || "");

  useEffect(() => {
    setQuery(searchParams?.get("q") || "");
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/jasa?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/jasa");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="hidden md:flex flex-1 max-w-md items-center relative">
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari edit video, poster, tutor..."
          className="w-full pl-9 pr-18 py-2 text-xs bg-[#F5F7FA] border border-[#E3E8EF] rounded-lg focus:bg-white focus:outline-none focus:border-brand-blue"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-brand-blue hover:bg-[#023985] text-white text-xs font-bold rounded-md transition"
        >
          Cari
        </button>
      </div>
    </form>
  );
}

function MobileSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get("q") || "");

  useEffect(() => {
    setQuery(searchParams?.get("q") || "");
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/jasa?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/jasa");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari edit video, tutor, desain..."
        className="w-full pl-9 pr-16 py-2 text-xs bg-[#F5F7FA] border border-[#E3E8EF] rounded-lg focus:bg-white focus:outline-none focus:border-brand-blue"
      />
      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <button
        type="submit"
        className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-brand-blue text-white text-[11px] font-bold rounded"
      >
        Cari
      </button>
    </form>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { user, isLoggedIn, isFreelancer, isAdmin, logout } = useAuth();
  const { getUnreadCount } = useChat();

  const isAuthPage = ["/login", "/daftar", "/lupa-password"].includes(pathname);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = getUnreadCount();

  // Deteksi scroll untuk border tipis
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Header Minimal untuk Halaman Auth
  if (isAuthPage) {
    return (
      <header className="sticky top-0 z-40 bg-white border-b border-[#E3E8EF]">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Logo variant="header" href="/" priority />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-orange transition py-1.5 px-3 rounded-lg hover:bg-[#F5F7FA]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`sticky top-0 z-40 bg-white transition-all duration-200 ${
        isScrolled ? "border-b border-[#E3E8EF] shadow-xs" : "border-b border-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo Brand Tunggal */}
        <div className="shrink-0">
          <Logo variant="header" href="/" priority />
        </div>

        {/* Search Ringkas (Desktop) */}
        <Suspense fallback={<div className="hidden md:flex flex-1 max-w-md h-9 bg-gray-50 rounded-lg" />}>
          <DesktopSearch />
        </Suspense>

        {/* Menu Kanan (Navigasi & Akun) */}
        <div className="flex items-center gap-3">
          <Link
            href="/jasa"
            className="hidden sm:inline-flex text-xs font-bold text-gray-700 hover:text-brand-blue transition px-2 py-1"
          >
            Katalog
          </Link>

          {/* Icon Chat & Badge Unread */}
          {isLoggedIn && (
            <Link
              href="/chat"
              className="relative p-2 text-gray-700 hover:text-brand-blue hover:bg-[#F5F7FA] rounded-lg transition"
              title="Obrolan / Chat"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-brand-orange text-white text-[10px] font-extrabold rounded-full leading-none">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}

          {/* Jika Sudah Login */}
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#F5F7FA] border border-[#E3E8EF] transition"
              >
                <div className="w-7 h-7 rounded-full bg-[#034BAE] text-white flex items-center justify-center font-bold text-xs">
                  {user?.name?.slice(0, 2).toUpperCase() || "U"}
                </div>
                <div className="text-left hidden sm:block leading-tight pr-1">
                  <span className="text-xs font-bold text-[#0B1F4D] block truncate max-w-[110px]">
                    {user?.name}
                  </span>
                  <span className="text-[10px] text-gray-500 font-semibold uppercase">
                    {user?.role}
                  </span>
                </div>
              </button>

              {/* Dropdown Menu Dinamis Sesuai Peran */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-dropdown border border-[#E3E8EF] py-1.5 z-50 text-xs">
                  <div className="px-3.5 py-2 border-b border-gray-100">
                    <p className="font-bold text-[#0B1F4D] truncate">{user?.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">
                      {user?.phone || user?.email}
                    </p>
                  </div>

                  {/* Menu Freelancer */}
                  {isFreelancer && (
                    <>
                      <Link
                        href="/dasbor"
                        onClick={() => setIsDropdownOpen(false)}
                        className="px-3.5 py-2 hover:bg-[#F5F7FA] flex items-center gap-2 text-gray-700 font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4 text-brand-blue" />
                        <span>Dasbor Penjualan</span>
                      </Link>
                      <Link
                        href="/pesanan"
                        onClick={() => setIsDropdownOpen(false)}
                        className="px-3.5 py-2 hover:bg-[#F5F7FA] flex items-center gap-2 text-gray-700 font-medium"
                      >
                        <ShoppingBag className="w-4 h-4 text-brand-blue" />
                        <span>Pesanan Masuk</span>
                      </Link>
                      <Link
                        href="/dasbor/pencairan"
                        onClick={() => setIsDropdownOpen(false)}
                        className="px-3.5 py-2 hover:bg-[#F5F7FA] flex items-center gap-2 text-gray-700 font-medium"
                      >
                        <Wallet className="w-4 h-4 text-brand-orange" />
                        <span>Pencairan Dana</span>
                      </Link>
                      <Link
                        href="/dasbor/premium"
                        onClick={() => setIsDropdownOpen(false)}
                        className="px-3.5 py-2 hover:bg-[#F5F7FA] flex items-center gap-2 text-gray-700 font-medium"
                      >
                        <Crown className="w-4 h-4 text-[#FFC93C]" />
                        <span>Akun Premium</span>
                      </Link>
                      <Link
                        href="/dasbor/iklan"
                        onClick={() => setIsDropdownOpen(false)}
                        className="px-3.5 py-2 hover:bg-[#F5F7FA] flex items-center gap-2 text-gray-700 font-medium"
                      >
                        <Megaphone className="w-4 h-4 text-brand-orange" />
                        <span>Pasang Iklan</span>
                      </Link>
                    </>
                  )}

                  {/* Menu Pemesan (Customer) */}
                  {!isFreelancer && !isAdmin && (
                    <>
                      <Link
                        href="/pesanan"
                        onClick={() => setIsDropdownOpen(false)}
                        className="px-3.5 py-2 hover:bg-[#F5F7FA] flex items-center gap-2 text-gray-700 font-medium"
                      >
                        <ShoppingBag className="w-4 h-4 text-brand-blue" />
                        <span>Pesanan Saya</span>
                      </Link>
                      <Link
                        href="/chat"
                        onClick={() => setIsDropdownOpen(false)}
                        className="px-3.5 py-2 hover:bg-[#F5F7FA] flex items-center gap-2 text-gray-700 font-medium"
                      >
                        <MessageSquare className="w-4 h-4 text-brand-blue" />
                        <span>Obrolan</span>
                      </Link>
                    </>
                  )}

                  {/* Menu Admin */}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsDropdownOpen(false)}
                      className="px-3.5 py-2 hover:bg-[#F5F7FA] flex items-center gap-2 text-gray-700 font-medium"
                    >
                      <Shield className="w-4 h-4 text-brand-blue" />
                      <span>Dasbor Operasional COO</span>
                    </Link>
                  )}

                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 font-bold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Tombol Masuk / Daftar jika Belum Login */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs font-bold text-brand-blue hover:text-[#023985] rounded-md transition"
              >
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="px-4 py-1.5 bg-brand-orange hover:bg-[#E56315] text-white text-xs font-extrabold rounded-md shadow-xs transition"
              >
                Daftar
              </Link>
            </div>
          )}

          {/* Hamburger Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-brand-blue rounded-md"
            aria-label="Buka menu navigasi"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#E3E8EF] bg-white px-6 py-4 space-y-3">
          <Suspense fallback={null}>
            <MobileSearch />
          </Suspense>

          <nav className="flex flex-col gap-2 pt-2 text-xs font-bold text-[#0B1F4D]">
            <Link
              href="/jasa"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 rounded-md hover:bg-[#F5F7FA]"
            >
              Katalog Semua Jasa
            </Link>
            <Link
              href="/integritas"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 rounded-md hover:bg-[#F5F7FA]"
            >
              Pedoman Integritas Akademik
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  href={isFreelancer ? "/dasbor" : "/pesanan"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 px-3 rounded-md hover:bg-[#F5F7FA]"
                >
                  {isFreelancer ? "Dasbor Penjualan" : "Pesanan Saya"}
                </Link>
                <Link
                  href="/chat"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 px-3 rounded-md hover:bg-[#F5F7FA] flex items-center justify-between"
                >
                  <span>Chat & Obrolan</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-brand-orange text-white text-[10px] font-bold rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-left py-2 px-3 text-red-600 rounded-md hover:bg-red-50"
                >
                  Keluar Akun
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-[#F5F7FA] text-brand-blue font-bold rounded-lg border border-[#E3E8EF]"
                >
                  Masuk
                </Link>
                <Link
                  href="/daftar"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-brand-orange text-white font-extrabold rounded-lg"
                >
                  Daftar Sekarang
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
