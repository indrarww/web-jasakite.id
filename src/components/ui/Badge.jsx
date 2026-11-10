import React from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export function KtmVerifiedBadge({ className = "", size = "sm" }) {
  const isSm = size === "sm";
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${
        isSm ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1"
      } ${className}`}
      title="Identitas & KTM mahasiswa telah diverifikasi oleh tim JasaKite"
    >
      <ShieldCheck className={isSm ? "w-3 h-3 text-emerald-600" : "w-3.5 h-3.5 text-emerald-600"} />
      <span>KTM Terverifikasi</span>
    </span>
  );
}

export function CampusBadge({ campus, className = "", size = "sm" }) {
  const isSm = size === "sm";
  const isUntan = (campus || "").toUpperCase() === "UNTAN";

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-md ${
        isUntan
          ? "bg-amber-50 text-amber-800 border border-amber-200"
          : "bg-blue-50 text-brand-blue border border-blue-200"
      } ${isSm ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1"} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isUntan ? "bg-amber-500" : "bg-brand-blue"}`}
      />
      <span>{isUntan ? "UNTAN" : "POLNEP"}</span>
    </span>
  );
}

export function EscrowBadge({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold text-brand-blue bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 ${className}`}
    >
      <CheckCircle2 className="w-3 h-3 text-brand-orange" />
      <span>Escrow Terlindungi</span>
    </span>
  );
}

