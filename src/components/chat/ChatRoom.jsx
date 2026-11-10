"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useChat, maskSensitiveContact } from "@/context/ChatContext";
import { formatRupiah } from "@/config/pricing";
import SafeImage from "@/components/ui/SafeImage";
import Button from "@/components/ui/Button";
import {
  ArrowLeft,
  Paperclip,
  Send,
  ShieldCheck,
  AlertTriangle,
  ShoppingBag,
  FileText,
  User,
  X,
  Lock,
} from "lucide-react";

export default function ChatRoom({ conversationId, isEmbedded = false }) {
  const router = useRouter();
  const { user } = useAuth();
  const { conversations, sendMessage, markAsRead } = useChat();

  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const messagesEndRef = useRef(null);

  const conversation = conversations.find((c) => c.id === conversationId);

  useEffect(() => {
    if (conversationId) {
      markAsRead(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-xs text-ink-secondary">
        <p className="font-semibold text-ink-main">Percakapan tidak ditemukan atau telah dihapus.</p>
        <Link href="/chat" className="mt-2 text-brand-blue font-bold hover:underline">
          Kembali ke Daftar Chat
        </Link>
      </div>
    );
  }

  const isFreelancer = user?.role === "freelancer";
  const otherParty = isFreelancer
    ? conversation.participants.customer
    : conversation.participants.freelancer;

  const isPaid = conversation.isOrderPaid;

  const handleFileChange = (e) => {
    setFileError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Batas 10 MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError("Ukuran file maksimal 10 MB.");
      return;
    }

    // Ekstensi yang diizinkan (jpg/png/pdf/docx)
    const validExtensions = [".jpg", ".jpeg", ".png", ".pdf", ".docx", ".doc"];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      setFileError("Format file harus berupa JPG, PNG, PDF, atau DOCX.");
      return;
    }

    setSelectedFile({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: file.type,
    });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedFile) return;

    sendMessage(conversationId, inputText.trim(), selectedFile);
    setInputText("");
    setSelectedFile(null);
    setFileError("");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      {/* Header Chat */}
      <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-3">
          {!isEmbedded && (
            <Link
              href="/chat"
              className="p-1.5 -ml-1 text-ink-secondary hover:text-ink-main hover:bg-surface-gray rounded-md"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}

          <div className="w-9 h-9 rounded-full bg-blue-100 text-brand-blue flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
            {otherParty?.avatar ? (
              <SafeImage
                src={otherParty.avatar}
                alt={otherParty.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-brand-blue" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-ink-main truncate max-w-[180px] sm:max-w-xs">
                {otherParty?.name || "Pengguna"}
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Aktif di JasaKite" />
            </div>
            <p className="text-[11px] text-ink-secondary">
              {otherParty?.campus ? `${otherParty.campus} • ${otherParty.major || ""}` : "Pemesan Terverifikasi"}
            </p>
          </div>
        </div>

        {/* Tombol Buat Pesanan (untuk Pemesan) */}
        {!isFreelancer && (
          <Link href={`/pesan/${conversation.serviceId}`}>
            <Button variant="primary" size="sm" className="text-xs">
              <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
              <span>Buat Pesanan</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Ringkasan Jasa Terkait */}
      <div className="p-2.5 px-4 bg-blue-50/50 border-b border-blue-100/60 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded bg-gray-200 overflow-hidden shrink-0">
            <SafeImage
              src={conversation.serviceImage}
              alt="Jasa"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-ink-main truncate">
              {conversation.serviceTitle}
            </p>
            <p className="text-[11px] font-bold text-brand-orange">
              {formatRupiah(conversation.servicePrice)}
            </p>
          </div>
        </div>

        <Link
          href={`/jasa/${conversation.serviceId}`}
          className="text-[11px] font-semibold text-brand-blue hover:text-brand-orange shrink-0 underline"
        >
          Detail Jasa
        </Link>
      </div>

      {/* Banner Peringatan Keamanan Escrow */}
      <div className="bg-amber-50/70 border-b border-amber-200/60 px-4 py-1.5 text-[11px] text-amber-900 flex items-center gap-2 shrink-0">
        <ShieldCheck className="w-3.5 h-3.5 text-brand-orange shrink-0" />
        <span>
          Demi keamanan, lakukan pembayaran lewat JasaKite agar dana ditampung escrow dan transaksi dilindungi.
        </span>
      </div>

      {/* Daftar Pesan Chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-gray/40">
        {conversation.messages.map((msg) => {
          if (msg.senderRole === "system") {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <div className="bg-gray-200/80 text-gray-700 text-[11px] px-3 py-1 rounded-md max-w-md text-center">
                  {msg.text}
                </div>
              </div>
            );
          }

          const isMe =
            (isFreelancer && msg.senderRole === "freelancer") ||
            (!isFreelancer && msg.senderRole === "customer");

          // Terapkan filter sensor kontak jika belum dibayar
          const { text: displayText, isMasked } = maskSensitiveContact(msg.text, isPaid);

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-md p-3 rounded-lg text-xs leading-relaxed shadow-xs ${
                  isMe
                    ? "bg-brand-blue text-white rounded-br-none"
                    : "bg-white text-ink-main border border-gray-200 rounded-bl-none"
                }`}
              >
                {!isMe && (
                  <p className="text-[10px] font-bold text-brand-blue mb-1">
                    {msg.senderName}
                  </p>
                )}

                {/* Teks Pesan */}
                <p className="whitespace-pre-wrap">{displayText}</p>

                {/* Notifikasi jika ada kontak yang disensor */}
                {isMasked && !isPaid && (
                  <div className="mt-1.5 p-1.5 bg-black/10 rounded text-[10px] flex items-center gap-1 opacity-90">
                    <Lock className="w-3 h-3 shrink-0" />
                    <span>Kontak disensor demi keamanan sebelum transaksi dibayar.</span>
                  </div>
                )}

                {/* Lampiran File */}
                {msg.attachment && (
                  <div
                    className={`mt-2 p-2 rounded flex items-center gap-2 ${
                      isMe ? "bg-white/10 text-white" : "bg-surface-gray text-ink-main border border-gray-200"
                    }`}
                  >
                    <FileText className="w-4 h-4 shrink-0 text-brand-orange" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold truncate">{msg.attachment.name}</p>
                      <p className="text-[9px] opacity-75">{msg.attachment.size}</p>
                    </div>
                  </div>
                )}

                <div
                  className={`text-[9px] mt-1 text-right ${
                    isMe ? "text-blue-200" : "text-ink-muted"
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Selected File Preview */}
      {selectedFile && (
        <div className="px-4 py-2 bg-blue-50 border-t border-blue-100 flex items-center justify-between text-xs text-brand-blue shrink-0">
          <div className="flex items-center gap-2 truncate">
            <FileText className="w-4 h-4 text-brand-orange" />
            <span className="font-semibold truncate">{selectedFile.name}</span>
            <span className="text-[10px] opacity-75">({selectedFile.size})</span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedFile(null)}
            className="p-1 hover:bg-blue-100 rounded text-brand-blue"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* File Error Notification */}
      {fileError && (
        <div className="px-4 py-1.5 bg-red-50 text-status-error text-[11px] border-t border-red-200 flex items-center gap-1.5 shrink-0">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{fileError}</span>
        </div>
      )}

      {/* Form Input Pesan */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-gray-200 bg-white flex items-center gap-2 shrink-0"
      >
        <label className="p-2 text-ink-muted hover:text-brand-blue hover:bg-surface-gray rounded-md cursor-pointer transition">
          <Paperclip className="w-4 h-4" />
          <input
            type="file"
            className="hidden"
            accept=".jpg,.jpeg,.png,.pdf,.docx,.doc"
            onChange={handleFileChange}
          />
        </label>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ketik pesan untuk didiskusikan..."
          className="flex-1 px-3 py-2 text-xs bg-surface-gray border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:border-brand-blue"
        />

        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!inputText.trim() && !selectedFile}
          className="px-3 py-2 text-xs"
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </form>
    </div>
  );
}

