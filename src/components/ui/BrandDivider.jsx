import React from "react";

/**
 * Garis bawah aksen dua warna khas JasaKite (oranye di kiri, biru di kanan)
 * Merefleksikan garis bawah pada wordmark logo.
 */
export default function BrandDivider({ className = "", width = "w-20", height = "h-1" }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className={`${width} ${height} rounded-full bg-brand-orange`} />
      <span className={`${width} ${height} rounded-full bg-brand-blue`} />
    </div>
  );
}

