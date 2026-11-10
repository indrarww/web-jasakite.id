"use client";

import React, { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, Check } from "lucide-react";
import { DEMO_ACCOUNTS } from "@/context/AuthContext";

/**
 * Komponen Akun Demo Siap Pakai
 * - Accordion tertutup secara default
 * - Daftar vertikal 3 baris: Pemesan, Freelancer, Admin
 * - Identitas penuh tanpa terpotong (tanpa truncate)
 * - Tombol "Pakai" untuk mengisi form otomatis tanpa submit langsung
 * - Menyorot kartu yang sedang terpilih
 */
export default function DemoAccountsBox({ onSelectDemo, selectedDemo }) {
  const [isOpen, setIsOpen] = useState(false);

  const demoItems = [
    {
      key: "pemesan",
      roleLabel: "Pemesan",
      badgeColor: "bg-blue-100 text-brand-blue",
      identity: `WhatsApp: ${DEMO_ACCOUNTS.pemesan.whatsapp} · Sandi: ${DEMO_ACCOUNTS.pemesan.password}`,
      activeStyle: "border-brand-blue ring-1 ring-brand-blue bg-blue-50/70",
    },
    {
      key: "freelancer",
      roleLabel: "Freelancer",
      badgeColor: "bg-orange-100 text-brand-orange",
      identity: `Email: ${DEMO_ACCOUNTS.freelancer.email} · Sandi: ${DEMO_ACCOUNTS.freelancer.password}`,
      activeStyle: "border-brand-orange ring-1 ring-brand-orange bg-orange-50/70",
    },
    {
      key: "admin",
      roleLabel: "Admin",
      badgeColor: "bg-gray-200 text-gray-800",
      identity: `Email: ${DEMO_ACCOUNTS.admin.email} · Sandi: ${DEMO_ACCOUNTS.admin.password}`,
      activeStyle: "border-gray-700 ring-1 ring-gray-700 bg-gray-100/70",
    },
  ];

  return (
    <div className="bg-blue-50/60 border border-brand-blue/20 rounded-lg p-3 text-xs transition">
      {/* Tombol Header Accordion */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left select-none text-brand-blue hover:text-brand-orange transition"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-orange shrink-0" />
          <span className="font-bold text-xs">Coba akun demo siap pakai</span>
        </div>
        <div className="p-0.5 text-brand-blue">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Konten Terbuka (Daftar Vertikal 3 Baris) */}
      {isOpen && (
        <div className="mt-3 space-y-2 pt-2.5 border-t border-brand-blue/15">
          <p className="text-[11px] text-ink-secondary">
            Pilih salah satu untuk mengisi form login secara otomatis:
          </p>

          <div className="space-y-2">
            {demoItems.map((item) => {
              const isSelected = selectedDemo === item.key;
              return (
                <div
                  key={item.key}
                  onClick={() => onSelectDemo && onSelectDemo(item.key)}
                  className={`p-2.5 rounded-md border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    isSelected
                      ? item.activeStyle
                      : "bg-white border-gray-200 hover:border-brand-blue/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold shrink-0 ${item.badgeColor}`}
                    >
                      {item.roleLabel}
                    </span>
                    <span className="text-gray-700 text-xs break-all sm:break-normal font-medium leading-relaxed">
                      {item.identity}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-orange">
                        <Check className="w-3.5 h-3.5" />
                        Terpilih
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDemo && onSelectDemo(item.key);
                      }}
                      className={`px-3 py-1 rounded text-xs font-bold transition ${
                        isSelected
                          ? "bg-brand-blue text-white shadow-xs"
                          : "bg-gray-100 hover:bg-brand-blue hover:text-white text-gray-700"
                      }`}
                    >
                      Pakai
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
