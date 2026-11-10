"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ASSETS } from "@/config/assets";

/**
 * Komponen Logo JasaKite.id
 * Menggunakan wrapper relative berukuran tetap dengan object-contain
 * untuk mencegah logo menimpa teks di sekitarnya.
 * Pada latar biru/gelap, dapat dibungkus dalam kotak putih rounded (onDark={true}).
 */
export default function Logo({
  variant = "header", // 'header' (40px) | 'footer' (48px) | 'login' (48px) | 'sm' (32px)
  className = "",
  href = "/",
  priority = false,
  onDark = false,
}) {
  const [hasError, setHasError] = useState(false);

  const dimensions = {
    sm: { width: 130, height: 32, wrapperClass: "h-8 w-[130px]" },
    header: { width: 165, height: 40, wrapperClass: "h-10 w-[165px]" },
    footer: { width: 190, height: 48, wrapperClass: "h-12 w-[190px]" },
    login: { width: 200, height: 50, wrapperClass: "h-[50px] w-[200px]" },
  };

  const current = dimensions[variant] || dimensions.header;

  const content = (
    <div
      className={`relative inline-flex items-center shrink-0 ${
        onDark ? "bg-white p-2 rounded-xl shadow-sm border border-white/20" : ""
      } ${current.wrapperClass} ${className}`}
    >
      {!hasError ? (
        <Image
          src={ASSETS.logo.primary}
          alt="JasaKite.id - Marketplace Freelancer Mahasiswa Pontianak"
          width={current.width}
          height={current.height}
          priority={priority}
          className="h-full w-auto object-contain max-h-full select-none"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex items-center font-heading font-extrabold text-xl tracking-tight select-none">
          <span className="text-brand-orange">Jasa</span>
          <span className="text-brand-blue">Kite</span>
          <span className="text-xs font-semibold text-brand-orange ml-1">.id</span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center focus:outline-none focus:ring-2 focus:ring-brand-blue/20 rounded-lg shrink-0"
        aria-label="Kembali ke beranda JasaKite.id"
      >
        {content}
      </Link>
    );
  }

  return content;
}
