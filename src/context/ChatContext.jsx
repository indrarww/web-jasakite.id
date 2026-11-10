"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

/**
 * Filter untuk menyembunyikan / memblur nomor telepon atau tautan kontak
 * sebelum ada pesanan yang terverifikasi/dibayar.
 */
export function maskSensitiveContact(text, isOrderPaid = false) {
  if (!text || isOrderPaid) return { text, isMasked: false };

  const phoneRegex = /(\+?62|08)[0-9\-\s]{8,14}/gi;
  const linkRegex = /(wa\.me|whatsapp\.com|instagram\.com|t\.me)\/[^\s]+/gi;

  let hasMask = false;
  let filtered = text.replace(phoneRegex, (match) => {
    hasMask = true;
    return "[NOMOR DISAMARKAN - Lakukan pembayaran di JasaKite untuk melihat kontak]";
  });

  filtered = filtered.replace(linkRegex, (match) => {
    hasMask = true;
    return "[TAUTAN DISAMARKAN - Gunakan fitur chat resmi JasaKite]";
  });

  return { text: filtered, isMasked: hasMask };
}

const INITIAL_CONVERSATIONS = [
  {
    id: "conv-1",
    serviceId: "jasa-1",
    serviceTitle: "Edit Video Reels Instagram & TikTok Kreatif dengan Subtitle Animasi",
    servicePrice: 35000,
    serviceImage: "/assets/portofolio/porto-1.jpg",
    participants: {
      customer: {
        id: "user-pemesan-1",
        name: "Budi Santoso",
        phone: "081234567890",
        avatar: "/assets/freelancer/avatar-4.jpg",
      },
      freelancer: {
        id: "fl-1",
        name: "Siti Rahmawati",
        campus: "POLNEP",
        major: "Teknik Informatika",
        phone: "085245123456",
        avatar: "/assets/freelancer/avatar-1.jpg",
      },
    },
    isOrderPaid: false,
    orderId: null,
    unreadCustomer: 0,
    unreadFreelancer: 1,
    lastUpdated: "2026-11-09T09:30:00Z",
    messages: [
      {
        id: "msg-101",
        senderRole: "customer",
        senderId: "user-pemesan-1",
        senderName: "Budi Santoso",
        text: "Halo kak Siti, mau tanya apakah bisa edit video reels untuk promosi kafe durasi 45 detik?",
        createdAt: "2026-11-09T09:15:00Z",
        time: "09:15 WIB",
        attachment: null,
      },
      {
        id: "msg-102",
        senderRole: "freelancer",
        senderId: "fl-1",
        senderName: "Siti Rahmawati",
        text: "Halo kak Budi! Bisa banget kak. Kirimkan saja video mentahnya lewat tombol lampiran, nanti aku buatkan preview subtitlenya.",
        createdAt: "2026-11-09T09:20:00Z",
        time: "09:20 WIB",
        attachment: null,
      },
    ],
  },
  {
    id: "conv-2",
    serviceId: "jasa-3",
    serviceTitle: "Desain Feed Instagram, Pamflet Kegiatan & Poster BEM / HIMA Kampus",
    servicePrice: 35000,
    serviceImage: "/assets/portofolio/porto-6.jpg",
    participants: {
      customer: {
        id: "user-pemesan-1",
        name: "Budi Santoso",
        phone: "081234567890",
        avatar: "/assets/freelancer/avatar-4.jpg",
      },
      freelancer: {
        id: "fl-3",
        name: "Dinda Maharani",
        campus: "POLNEP",
        major: "Teknik Multimedia Digital",
        phone: "089612345678",
        avatar: "/assets/freelancer/avatar-3.jpg",
      },
    },
    isOrderPaid: true,
    orderId: "JK-2026-0043",
    unreadCustomer: 0,
    unreadFreelancer: 0,
    lastUpdated: "2026-11-08T14:30:00Z",
    messages: [
      {
        id: "msg-201",
        senderRole: "system",
        senderId: "system",
        senderName: "Sistem JasaKite",
        text: "Pesanan #JK-2026-0043 telah dibuat dan pembayaran Escrow telah diverifikasi. Kontak WhatsApp resmi kini terbuka.",
        createdAt: "2026-11-08T08:05:00Z",
        time: "08:05 WIB",
      },
      {
        id: "msg-202",
        senderRole: "customer",
        senderId: "user-pemesan-1",
        senderName: "Budi Santoso",
        text: "Aset logo panitia sudah dikirim ya kak Dinda.",
        createdAt: "2026-11-08T08:15:00Z",
        time: "08:15 WIB",
      },
      {
        id: "msg-203",
        senderRole: "freelancer",
        senderId: "fl-3",
        senderName: "Dinda Maharani",
        text: "Siap kak Budi, sudah aku terima. Ini lagi aku susun layout posternya ya!",
        createdAt: "2026-11-08T08:20:00Z",
        time: "08:20 WIB",
      },
    ],
  },
];

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("jasakite_chats");
      if (stored) {
        setConversations(JSON.parse(stored));
      } else {
        setConversations(INITIAL_CONVERSATIONS);
        localStorage.setItem("jasakite_chats", JSON.stringify(INITIAL_CONVERSATIONS));
      }
    } catch (err) {
      setConversations(INITIAL_CONVERSATIONS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveConversations = (updated) => {
    setConversations(updated);
    try {
      localStorage.setItem("jasakite_chats", JSON.stringify(updated));
    } catch (err) {
      console.error("Gagal menyimpan percakapan:", err);
    }
  };

  /**
   * Mengambil jumlah pesan belum dibaca untuk pengguna yang sedang login
   */
  const getUnreadCount = () => {
    if (!user) return 0;
    const isFreelancer = user.role === "freelancer";
    return conversations.reduce((total, conv) => {
      if (isFreelancer) {
        return total + (conv.unreadFreelancer || 0);
      }
      return total + (conv.unreadCustomer || 0);
    }, 0);
  };

  /**
   * Buka atau buat percakapan baru dari tombol "Ajak Diskusi"
   */
  const openOrCreateConversation = (service, freelancer) => {
    if (!user) return null;

    // Cari apakah sudah ada obrolan untuk service dan customer ini
    const existing = conversations.find(
      (c) =>
        c.serviceId === service.id &&
        c.participants.customer.id === user.id &&
        c.participants.freelancer.id === freelancer.id
    );

    if (existing) {
      return existing.id;
    }

    const newConvId = `conv-${Date.now()}`;
    const newConv = {
      id: newConvId,
      serviceId: service.id,
      serviceTitle: service.title,
      servicePrice: service.price,
      serviceImage: service.portfolio?.[0]?.image || "/assets/portofolio/porto-1.jpg",
      participants: {
        customer: {
          id: user.id,
          name: user.name || "Pemesan",
          phone: user.phone || user.whatsapp || "081234567890",
          avatar: user.avatar || "/assets/freelancer/avatar-4.jpg",
        },
        freelancer: {
          id: freelancer.id,
          name: freelancer.name,
          campus: freelancer.campus,
          major: freelancer.major,
          phone: freelancer.phone || "085245123456",
          avatar: freelancer.avatar,
        },
      },
      isOrderPaid: false,
      orderId: null,
      unreadCustomer: 0,
      unreadFreelancer: 1,
      lastUpdated: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderRole: "system",
          senderId: "system",
          senderName: "Sistem JasaKite",
          text: `Percakapan dimulai untuk jasa "${service.title}". Demi keamanan transaksi dan perlindungan Escrow, lakukan pemesanan dan pembayaran di dalam platform JasaKite.`,
          createdAt: new Date().toISOString(),
          time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
        },
      ],
    };

    const updated = [newConv, ...conversations];
    saveConversations(updated);
    return newConvId;
  };

  /**
   * Kirim pesan baru
   */
  const sendMessage = (conversationId, messageText, attachment = null) => {
    if (!user) return;

    const timeStr =
      new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";

    const updated = conversations.map((conv) => {
      if (conv.id === conversationId) {
        const isFreelancer = user.role === "freelancer";
        const newMsg = {
          id: `msg-${Date.now()}`,
          senderRole: isFreelancer ? "freelancer" : "customer",
          senderId: user.id,
          senderName: user.name,
          text: messageText,
          attachment,
          createdAt: new Date().toISOString(),
          time: timeStr,
        };

        return {
          ...conv,
          lastUpdated: new Date().toISOString(),
          unreadCustomer: isFreelancer ? (conv.unreadCustomer || 0) + 1 : 0,
          unreadFreelancer: !isFreelancer ? (conv.unreadFreelancer || 0) + 1 : 0,
          messages: [...conv.messages, newMsg],
        };
      }
      return conv;
    });

    saveConversations(updated);
  };

  /**
   * Tandai percakapan sudah dibaca
   */
  const markAsRead = (conversationId) => {
    if (!user) return;
    const isFreelancer = user.role === "freelancer";

    const updated = conversations.map((conv) => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          unreadCustomer: isFreelancer ? conv.unreadCustomer : 0,
          unreadFreelancer: !isFreelancer ? conv.unreadFreelancer : 0,
        };
      }
      return conv;
    });

    saveConversations(updated);
  };

  /**
   * Kirim pesan sistem otomatis (misal saat pesanan dibuat / pembayaran terverifikasi)
   */
  const sendSystemNotice = (serviceId, customerId, text) => {
    const updated = conversations.map((conv) => {
      if (conv.serviceId === serviceId && conv.participants.customer.id === customerId) {
        const sysMsg = {
          id: `msg-${Date.now()}`,
          senderRole: "system",
          senderId: "system",
          senderName: "Sistem JasaKite",
          text,
          createdAt: new Date().toISOString(),
          time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
        };
        return {
          ...conv,
          isOrderPaid: true,
          lastUpdated: new Date().toISOString(),
          messages: [...conv.messages, sysMsg],
        };
      }
      return conv;
    });
    saveConversations(updated);
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        isLoaded,
        getUnreadCount,
        openOrCreateConversation,
        sendMessage,
        markAsRead,
        sendSystemNotice,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat harus digunakan di dalam ChatProvider");
  }
  return context;
}

