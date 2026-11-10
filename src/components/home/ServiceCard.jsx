import React from "react";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import { KtmVerifiedBadge, CampusBadge } from "@/components/ui/Badge";
import { Star, Crown } from "lucide-react";
import { formatRupiah } from "@/config/pricing";
import { getCategoryById } from "@/config/categories";

/**
 * ServiceCard: Kartu Jasa terstandarisasi.
 * - Rasio gambar 4:3 dengan zoom 1.05 saat hover
 * - Hover card naik 4px (-translate-y-1)
 * - Maksimal SATU penanda per kartu (Iklan ATAU Premium 2 ATAU Premium 1)
 * - Lencana KTM dan kampus seragam tidak merusak tinggi kartu
 * - Harga tebal "mulai Rp..."
 */
export default function ServiceCard({ service, isAd = false, className = "" }) {
  const {
    id,
    title,
    price,
    freelancer,
    portfolio,
    rating = 4.9,
    reviewCount = 50,
    premiumTier,
    category,
  } = service;

  const mainPortfolio = portfolio?.[0]?.image;
  const categoryInfo = getCategoryById(category);

  return (
    <div
      className={`bg-white rounded-lg border border-[#E3E8EF] overflow-hidden flex flex-col group transition-transform duration-200 hover:-translate-y-1 ${className}`}
    >
      {/* Portfolio Thumbnail with Link */}
      <Link
        href={`/jasa/${id}`}
        className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 block shrink-0"
        aria-label={`Detail jasa: ${title}`}
      >
        <SafeImage
          src={mainPortfolio}
          alt={title}
          fill
          categoryId={category}
          freelancerName={freelancer.name}
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />

        {/* Ribbon Kategori di sudut kiri bawah gambar */}
        <div className="absolute bottom-2 left-2 z-10">
          <span
            className={`px-2 py-0.5 text-[10px] font-bold rounded-sm shadow-xs ${categoryInfo.ribbonClass}`}
          >
            {categoryInfo.shortName}
          </span>
        </div>

        {/* Maksimal SATU penanda per kartu di pojok kiri atas */}
        <div className="absolute top-2 left-2 z-10">
          {isAd ? (
            <span className="px-2 py-0.5 bg-[#0B1F4D] text-white text-[10px] font-bold rounded-sm tracking-wider uppercase shadow-xs">
              Iklan
            </span>
          ) : premiumTier === "level2" ? (
            <span className="px-2 py-0.5 bg-[#FFC93C] text-[#0B1F4D] text-[10px] font-extrabold rounded-sm flex items-center gap-1 shadow-xs border border-[#F5BA20]">
              <Crown className="w-3 h-3 text-[#0B1F4D]" />
              <span>Premium 2</span>
            </span>
          ) : premiumTier === "level1" ? (
            <span className="px-2 py-0.5 bg-[#0FA3A3] text-white text-[10px] font-bold rounded-sm flex items-center gap-1 shadow-xs">
              <Crown className="w-3 h-3 text-white" />
              <span>Premium 1</span>
            </span>
          ) : null}
        </div>

        {/* Campus badge di pojok kanan atas */}
        <div className="absolute top-2 right-2 z-10">
          <CampusBadge campus={freelancer.campus} size="sm" />
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Freelancer Header */}
          <div className="flex items-start gap-2.5 mb-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200 mt-0.5">
              <SafeImage
                src={freelancer.avatar}
                alt={freelancer.name}
                fill
                categoryId={category}
                freelancerName={freelancer.name}
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <span
                className="text-xs font-bold text-[#0B1F4D] block truncate leading-tight"
                title={freelancer.name}
              >
                {freelancer.name}
              </span>
              <div className="mt-0.5">
                <KtmVerifiedBadge size="sm" />
              </div>
              <p className="text-[10px] text-gray-500 truncate mt-0.5">
                {freelancer.major}
              </p>
            </div>
          </div>

          {/* Service Title - Fixed 2 lines */}
          <Link href={`/jasa/${id}`}>
            <h4 className="text-xs sm:text-sm font-semibold text-[#0B1F4D] group-hover:text-brand-blue line-clamp-2 leading-snug transition mb-2 min-h-[2.5rem]">
              {title}
            </h4>
          </Link>
        </div>

        {/* Footer: Rating and Price */}
        <div className="pt-2.5 border-t border-[#E3E8EF] flex items-center justify-between mt-1">
          {/* Rating */}
          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{freelancer.rating || rating}</span>
            <span className="text-[10px] text-gray-500 font-normal">
              ({freelancer.reviewCount || reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="text-right">
            <span className="text-[10px] text-gray-500 block leading-none">
              Mulai
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-brand-orange">
              {formatRupiah(price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
