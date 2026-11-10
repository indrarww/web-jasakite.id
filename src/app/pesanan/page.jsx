"use client";

import React, { useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useOrders } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { formatRupiah } from "@/config/pricing";
import BrandDivider from "@/components/ui/BrandDivider";
import Button from "@/components/ui/Button";
import { CampusBadge } from "@/components/ui/Badge";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  ArrowRight,
  Calendar,
} from "lucide-react";

function PesananListPage() {
  const { user } = useAuth();
  const { orders } = useOrders();
  const [filterTab, setFilterTab] = useState("all"); // 'all' | 'active' | 'completed'

  const filteredOrders = orders.filter((order) => {
    if (filterTab === "active") return order.status !== "completed";
    if (filterTab === "completed") return order.status === "completed";
    return true;
  });

  return (
    <div className="min-h-screen bg-surface-gray py-8 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Pesanan Saya */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-brand-blue">
              Pesanan Saya
            </h1>
            <p className="text-xs text-ink-secondary mt-0.5">
              Pantau status transaksi, akses chat dalam aplikasi, dan rilis dana pekerjaan.
            </p>
            <BrandDivider width="w-12" height="h-1" className="mt-2" />
          </div>

          <div className="flex items-center gap-1.5 bg-surface-gray p-1 rounded-md border border-gray-200 text-xs self-start sm:self-center">
            <button
              type="button"
              onClick={() => setFilterTab("all")}
              className={`px-3 py-1.5 rounded font-medium transition ${
                filterTab === "all"
                  ? "bg-white text-brand-blue shadow-xs font-bold"
                  : "text-ink-secondary hover:text-ink-main"
              }`}
            >
              Semua ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("active")}
              className={`px-3 py-1.5 rounded font-medium transition ${
                filterTab === "active"
                  ? "bg-brand-orange text-white shadow-xs font-bold"
                  : "text-ink-secondary hover:text-ink-main"
              }`}
            >
              Berjalan ({orders.filter((o) => o.status !== "completed").length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("completed")}
              className={`px-3 py-1.5 rounded font-medium transition ${
                filterTab === "completed"
                  ? "bg-emerald-600 text-white shadow-xs font-bold"
                  : "text-ink-secondary hover:text-ink-main"
              }`}
            >
              Selesai ({orders.filter((o) => o.status === "completed").length})
            </button>
          </div>
        </div>

        {/* Order Cards List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-3">
            {filteredOrders.map((ord) => {
              const isCompleted = ord.status === "completed";
              const isDraftSent = ord.status === "draft_sent";

              return (
                <div
                  key={ord.id}
                  className="bg-white rounded-lg p-5 border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold bg-blue-50 text-brand-blue px-2 py-0.5 rounded border border-blue-200">
                        {ord.id}
                      </span>
                      <span className="text-[11px] text-ink-secondary flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(ord.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        WIB
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-[11px] text-brand-blue font-semibold">
                        {ord.packageName}
                      </span>
                    </div>

                    <Link href={`/pesanan/${ord.id}`}>
                      <h3 className="text-sm font-bold text-ink-main hover:text-brand-blue transition line-clamp-1">
                        {ord.serviceTitle}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 text-xs text-ink-secondary">
                      <span>
                        Freelancer: <strong className="text-ink-main">{ord.freelancer.name}</strong>
                      </span>
                      <CampusBadge campus={ord.freelancer.campus} size="sm" />
                    </div>
                  </div>

                  {/* Right Side: Status, Price, & Action Button */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-ink-secondary block">Total Escrow</span>
                      <span className="text-sm font-bold text-brand-orange">
                        {formatRupiah(ord.basePrice || ord.totalAmount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Selesai
                        </span>
                      ) : isDraftSent ? (
                        <span className="px-2 py-0.5 bg-orange-50 text-brand-orange border border-brand-orange/30 rounded text-[11px] font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Draf Terkirim
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-blue-50 text-brand-blue border border-brand-blue/20 rounded text-[11px] font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Dikerjakan
                        </span>
                      )}

                      <Link href={`/pesanan/${ord.id}`}>
                        <Button
                          variant="primary"
                          size="sm"
                          className="text-xs py-1"
                          rightIcon={<ArrowRight className="w-3 h-3" />}
                        >
                          Lacak Pesanan
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white rounded-lg border border-gray-200 shadow-xs">
            <ShoppingBag className="w-10 h-10 text-ink-muted mx-auto mb-2" />
            <h3 className="text-sm font-bold text-brand-blue mb-1">
              Belum Ada Pesanan {filterTab === "active" ? "Aktif" : filterTab === "completed" ? "Selesai" : ""}
            </h3>
            <p className="text-xs text-ink-secondary max-w-sm mx-auto mb-4">
              Jelajahi keahlian mahasiswa UNTAN & POLNEP untuk menyelesaikan tugas dengan aman via Escrow.
            </p>
            <Link href="/#katalog">
              <Button variant="primary" size="sm">
                Jelajahi Katalog Jasa
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PesananPage() {
  return (
    <ProtectedRoute>
      <PesananListPage />
    </ProtectedRoute>
  );
}
