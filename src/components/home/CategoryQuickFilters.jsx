"use client";

import React from "react";
import { CATEGORIES } from "@/config/categories";
import { HelpCircle, Video, Palette, GraduationCap, Truck, FileText } from "lucide-react";

const ICON_MAP = {
  HelpCircle: HelpCircle,
  Video: Video,
  Palette: Palette,
  GraduationCap: GraduationCap,
  Truck: Truck,
};

export default function CategoryQuickFilters({ activeCategory, onSelectCategory }) {
  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-ink-main flex items-center gap-2">
            <span>Kategori Layanan Mahasiswa</span>
            <span className="text-xs font-normal text-ink-secondary hidden sm:inline">
              (Terpopuler di Pontianak)
            </span>
          </h3>
          <p className="text-xs text-ink-secondary mt-0.5">
            Pilih kategori untuk memfilter freelancer UNTAN & POLNEP yang sesuai kebutuhan
          </p>
        </div>

        {activeCategory !== "all" && (
          <button
            type="button"
            onClick={() => onSelectCategory("all")}
            className="text-xs font-semibold text-brand-orange hover:underline transition"
          >
            Tampilkan Semua Kategori
          </button>
        )}
      </div>

      {/* Grid 5 Kategori Baru */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.iconName] || FileText;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(isActive ? "all" : cat.id)}
              className={`p-3 rounded-lg border text-left transition-all duration-150 flex flex-col justify-between group relative overflow-hidden ${
                isActive
                  ? "bg-brand-blue text-white border-brand-blue shadow-xs"
                  : "bg-white text-ink-main border-gray-200 hover:border-brand-blue/40 hover:shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center transition ${
                    isActive
                      ? "bg-brand-orange text-white"
                      : "bg-blue-50 text-brand-blue group-hover:bg-brand-orange group-hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    isActive ? "bg-white/20 text-white" : "bg-gray-100 text-ink-secondary"
                  }`}
                >
                  {cat.popularCount}
                </span>
              </div>

              <div>
                <h4
                  className={`text-xs font-bold line-clamp-1 mb-0.5 ${
                    isActive ? "text-white" : "text-ink-main group-hover:text-brand-blue transition"
                  }`}
                >
                  {cat.name}
                </h4>
                <p
                  className={`text-[11px] line-clamp-2 leading-snug ${
                    isActive ? "text-blue-100" : "text-ink-secondary"
                  }`}
                >
                  {cat.tags.slice(0, 2).join(", ")}
                </p>
              </div>

              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-orange" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
