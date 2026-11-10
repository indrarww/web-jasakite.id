"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowUpDown, X, Filter } from "lucide-react";
import ServiceCard from "@/components/home/ServiceCard";
import ServiceCardSkeleton from "@/components/home/ServiceCardSkeleton";
import { DUMMY_SERVICES } from "@/config/dummyData";
import { CATEGORIES, getCategoryById } from "@/config/categories";
import { SUPPORTED_CAMPUSES } from "@/config/campuses";
import Button from "@/components/ui/Button";

function JasaCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("kategori") || "all";
  const initialCampus = searchParams.get("kampus") || "all";
  const initialQuery = searchParams.get("q") || "";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [selectedCampus, setSelectedCampus] = useState(initialCampus);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState("priority"); // priority | price_low | price_high | rating
  const [isLoading, setIsLoading] = useState(false);

  // Ubah kategori dengan efek transisi cepat
  const handleCategorySelect = (catId) => {
    setIsLoading(true);
    setActiveCategory(catId);
    setTimeout(() => setIsLoading(false), 150);
  };

  const handleCampusSelect = (campusId) => {
    setIsLoading(true);
    setSelectedCampus(campusId);
    setTimeout(() => setIsLoading(false), 150);
  };

  // Filter & Pengurutan Katalog
  const filteredServices = useMemo(() => {
    return DUMMY_SERVICES.filter((service) => {
      // 1. Filter Kampus (Hanya UNTAN & POLNEP)
      if (selectedCampus !== "all") {
        if (service.freelancer.campus.toLowerCase() !== selectedCampus.toLowerCase()) {
          return false;
        }
      }

      // 2. Filter Kategori
      if (activeCategory !== "all" && service.category !== activeCategory) {
        return false;
      }

      // 3. Filter Pencarian
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = service.title.toLowerCase().includes(q);
        const matchName = service.freelancer.name.toLowerCase().includes(q);
        const matchMajor = service.freelancer.major.toLowerCase().includes(q);
        const matchTags = service.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchName && !matchMajor && !matchTags) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price_low") return a.price - b.price;
      if (sortBy === "price_high") return b.price - a.price;
      if (sortBy === "rating") return (b.freelancer.rating || 0) - (a.freelancer.rating || 0);

      // Prioritas resmi: Level 2 > Level 1 > Reguler, baru rating & pesanan
      const getScore = (s) => {
        if (s.premiumTier === "level2") return 3;
        if (s.premiumTier === "level1") return 2;
        return 1;
      };

      const scoreA = getScore(a);
      const scoreB = getScore(b);
      if (scoreA !== scoreB) return scoreB - scoreA;

      return (b.freelancer.completedOrders || 0) - (a.freelancer.completedOrders || 0);
    });
  }, [selectedCampus, activeCategory, searchQuery, sortBy]);

  const resetFilters = () => {
    setActiveCategory("all");
    setSelectedCampus("all");
    setSearchQuery("");
    setSortBy("priority");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Page Header */}
      <div className="bg-white border-b border-[#E3E8EF] py-8">
        <div className="max-w-[1200px] mx-auto px-6">
          <nav className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
            <Link href="/" className="hover:text-brand-blue">Beranda</Link>
            <span>/</span>
            <span className="text-[#0B1F4D] font-semibold">Katalog Jasa</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F4D] tracking-tight">
            Katalog Jasa Mahasiswa Pontianak
          </h1>
          <p className="text-gray-600 mt-1.5 text-base">
            Temukan jasa terpercaya dari mahasiswa UNTAN dan POLNEP terverifikasi. Transaksi aman via escrow.
          </p>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-[#E3E8EF] shadow-xs">
        <div className="max-w-[1200px] mx-auto px-6 py-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari jasa, skill, nama freelancer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#F5F7FA] border border-[#E3E8EF] rounded-lg text-sm text-[#0B1F4D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Kampus & Sort */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Kampus Pill Filter */}
              <div className="flex items-center bg-[#F5F7FA] p-1 rounded-lg border border-[#E3E8EF] text-xs font-bold">
                <button
                  onClick={() => handleCampusSelect("all")}
                  className={`px-3 py-1.5 rounded-md transition ${
                    selectedCampus === "all"
                      ? "bg-brand-blue text-white shadow-xs"
                      : "text-gray-600 hover:text-[#0B1F4D]"
                  }`}
                >
                  Semua Kampus
                </button>
                {SUPPORTED_CAMPUSES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleCampusSelect(c.id)}
                    className={`px-3 py-1.5 rounded-md transition ${
                      selectedCampus === c.id
                        ? "bg-brand-blue text-white shadow-xs"
                        : "text-gray-600 hover:text-[#0B1F4D]"
                    }`}
                  >
                    {c.shortName}
                  </button>
                ))}
              </div>

              {/* Sort Selector */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#F5F7FA] border border-[#E3E8EF] rounded-lg px-3 py-2 text-xs font-bold text-[#0B1F4D] focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                >
                  <option value="priority">Urutan Rekomendasi</option>
                  <option value="rating">Rating Tertinggi</option>
                  <option value="price_low">Harga Terendah</option>
                  <option value="price_high">Harga Tertinggi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => handleCategorySelect("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition border ${
                activeCategory === "all"
                  ? "bg-[#0B1F4D] text-white border-[#0B1F4D]"
                  : "bg-white text-gray-600 border-[#E3E8EF] hover:border-gray-400"
              }`}
            >
              Semua Kategori ({DUMMY_SERVICES.length})
            </button>
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count = DUMMY_SERVICES.filter((s) => s.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition border flex items-center gap-1.5 ${
                    isActive
                      ? `${cat.ribbonClass} border-transparent shadow-xs`
                      : "bg-white text-gray-700 border-[#E3E8EF] hover:border-gray-400"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Results Count & Reset */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            Menampilkan <strong className="text-[#0B1F4D]">{filteredServices.length}</strong> jasa tersedia
          </p>
          {(activeCategory !== "all" || selectedCampus !== "all" || searchQuery) && (
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Semua Filter</span>
            </button>
          )}
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl border border-[#E3E8EF] p-12 text-center max-w-lg mx-auto my-12">
            <div className="w-16 h-16 bg-[#FFF1E8] rounded-full flex items-center justify-center mx-auto mb-4 text-brand-orange">
              <Filter className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-[#0B1F4D] mb-1.5">
              Tidak ada jasa yang sesuai
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Coba ganti kata kunci pencarian atau ubah filter kampus dan kategori yang dipilih.
            </p>
            <Button variant="primary" onClick={resetFilters}>
              Tampilkan Semua Jasa
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function JasaCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F7FA] py-12 px-6">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <JasaCatalogContent />
    </Suspense>
  );
}

