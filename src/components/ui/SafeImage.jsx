"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  HelpCircle,
  Video,
  Palette,
  GraduationCap,
  Truck,
  Image as ImageIcon,
  User,
} from "lucide-react";
import { CATEGORIES } from "@/config/categories";

/**
 * SafeImage: Komponen gambar dengan fallback terisolasi dan anti-layout-shift.
 * Sesuai aturan desain JasaKite.id:
 * Jika file gambar belum ada atau gagal dimuat, menampilkan blok warna solid
 * sesuai warna kategori resmi + ikon kategori besar + inisial nama freelancer
 * (bukan kotak abu-abu kosong).
 */
export default function SafeImage({
  src,
  alt = "Gambar",
  width,
  height,
  fill = false,
  className = "",
  priority = false,
  categoryId,
  freelancerName,
  aspectRatio = "4/3",
  sizes,
  ...rest
}) {
  const [hasError, setHasError] = useState(false);

  // Ambil inisial nama freelancer jika ada
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Cocokkan warna kategori dan ikon resmi
  const matchedCategory = CATEGORIES.find(
    (c) =>
      c.id === categoryId ||
      (categoryId && categoryId.toLowerCase().includes(c.id.split("-")[0]))
  ) || CATEGORIES[0];

  const categoryIcons = {
    "jasa-lainnya": HelpCircle,
    "edit-video-foto": Video,
    "desain-organisasi": Palette,
    tutor: GraduationCap,
    "logistik-kampus": Truck,
  };

  const IconComponent = categoryIcons[matchedCategory.id] || HelpCircle;
  const initials = getInitials(freelancerName);

  if (!src || hasError) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center select-none overflow-hidden ${
          fill ? "absolute inset-0 w-full h-full" : ""
        } ${className}`}
        style={{
          backgroundColor: matchedCategory.colorHex,
          color: matchedCategory.textHex,
          width: fill ? "100%" : width ? `${width}px` : undefined,
          height: fill ? "100%" : height ? `${height}px` : undefined,
          aspectRatio: !fill ? aspectRatio : undefined,
        }}
        role="img"
        aria-label={`${alt} (${matchedCategory.name})`}
      >
        {/* Ikon Kategori Besar */}
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-black/10 backdrop-blur-xs mb-2">
            <IconComponent className="w-8 h-8" strokeWidth={2} />
          </div>
          <span className="text-xs font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-black/15 line-clamp-1">
            {matchedCategory.shortName || matchedCategory.name}
          </span>
        </div>

        {/* Inisial Freelancer di Sudut Kiri Bawah */}
        {initials && (
          <div
            className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-extrabold shadow-sm"
            style={{
              backgroundColor: matchedCategory.textHex === "#FFFFFF" ? "rgba(255,255,255,0.9)" : "#0B1F4D",
              color: matchedCategory.textHex === "#FFFFFF" ? "#0B1F4D" : "#FFFFFF",
            }}
          >
            <User className="w-3.5 h-3.5" />
            <span>{initials}</span>
          </div>
        )}
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        className={className}
        priority={priority}
        onError={() => setHasError(true)}
        {...rest}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 400}
      height={height || 300}
      className={className}
      priority={priority}
      onError={() => setHasError(true)}
      {...rest}
    />
  );
}
