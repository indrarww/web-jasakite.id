"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ChatRoom from "@/components/chat/ChatRoom";
import { MessageSquare, Search, ChevronRight, User } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";

function ChatListContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { conversations, isLoaded } = useChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState(conversations[0]?.id || null);

  const isFreelancer = user?.role === "freelancer";

  const filteredConversations = conversations.filter((c) => {
    const otherParty = isFreelancer ? c.participants.customer : c.participants.freelancer;
    const nameMatch = (otherParty?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const serviceMatch = (c.serviceTitle || "").toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || serviceMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs h-[calc(100vh-160px)] min-h-[500px] flex">
        {/* Panel Kiri: Daftar Percakapan */}
        <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col bg-white shrink-0">
          <div className="p-4 border-b border-gray-100">
            <h1 className="text-lg font-bold text-ink-main flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-orange" />
              <span>Obrolan</span>
            </h1>
            <p className="text-xs text-ink-secondary mt-0.5">
              Diskusi jasa dengan {isFreelancer ? "klien / pemesan" : "freelancer mahasiswa"}
            </p>

            <div className="mt-3 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari obrolan atau jasa..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
              />
              <Search className="w-3.5 h-3.5 text-ink-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-ink-secondary">
                Belum ada percakapan. Mulai diskusi dari halaman detail jasa.
              </div>
            ) : (
              filteredConversations.map((c) => {
                const otherParty = isFreelancer ? c.participants.customer : c.participants.freelancer;
                const unreadCount = isFreelancer ? c.unreadFreelancer : c.unreadCustomer;
                const lastMsg = c.messages?.[c.messages.length - 1];
                const isSelected = selectedId === c.id;

                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedId(c.id);
                      // Di mobile, navigasikan ke /chat/[id]
                      if (window.innerWidth < 768) {
                        router.push(`/chat/${c.id}`);
                      }
                    }}
                    className={`p-3 cursor-pointer transition flex items-start gap-3 hover:bg-surface-gray ${
                      isSelected ? "bg-blue-50/60 md:border-l-4 md:border-brand-blue" : ""
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-brand-blue flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                      {otherParty?.avatar ? (
                        <SafeImage
                          src={otherParty.avatar}
                          alt={otherParty.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-brand-blue" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-ink-main truncate">
                          {otherParty?.name || "Pengguna"}
                        </h4>
                        <span className="text-[10px] text-ink-muted shrink-0 ml-1">
                          {lastMsg?.time?.replace(" WIB", "") || ""}
                        </span>
                      </div>

                      {otherParty?.campus && (
                        <span className="text-[10px] font-semibold text-brand-blue">
                          {otherParty.campus} • {otherParty.major}
                        </span>
                      )}

                      <p className="text-[11px] text-ink-secondary truncate mt-0.5">
                        {lastMsg ? lastMsg.text : "Percakapan baru dibuat"}
                      </p>

                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 truncate max-w-[170px]">
                          {c.serviceTitle}
                        </span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.2 bg-brand-orange text-white text-[10px] font-bold rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Panel Kanan: Ruang Obrolan Terpilih (Desktop) */}
        <div className="hidden md:flex flex-1 flex-col bg-surface-gray/30">
          {selectedId ? (
            <ChatRoom conversationId={selectedId} isEmbedded={true} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-xs text-ink-secondary">
              <MessageSquare className="w-12 h-12 text-gray-300 mb-2" />
              <p className="font-semibold text-ink-main">Pilih percakapan untuk memulai chat</p>
              <p className="mt-1">
                Seluruh komunikasi aman dan terlindungi oleh sistem Escrow JasaKite.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatListContent />
    </ProtectedRoute>
  );
}

