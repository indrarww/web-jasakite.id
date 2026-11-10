"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { PLATFORM_FEE_RATE, MIN_WITHDRAWAL_AMOUNT, calculatePlatformEarnings } from "@/config/pricing";

const INITIAL_ORDERS = [
  {
    id: "JK-2026-0042",
    serviceId: "jasa-1",
    serviceTitle: "Edit Video Reels Instagram & TikTok Kreatif dengan Subtitle Animasi",
    freelancer: {
      id: "fl-1",
      name: "Siti Rahmawati",
      avatar: "/assets/freelancer/avatar-1.jpg",
      campus: "POLNEP",
      major: "Teknik Informatika",
      phone: "085245123456",
    },
    customer: {
      id: "user-pemesan-1",
      name: "Budi Santoso",
      phone: "081234567890",
      email: "budi.santoso@gmail.com",
    },
    packageType: "regular",
    packageName: "Paket 1 Video (Durasi s.d 60 Detik)",
    basePrice: 35000,
    platformFeeRate: PLATFORM_FEE_RATE,
    platformFee: 2800, // 8% dari 35000
    freelancerReceives: 32200, // 92%
    totalAmount: 35000,
    createdAt: "2026-11-06T09:30:00Z",
    deadline: "2026-11-09T18:00:00Z",
    status: "draft_sent", // 'verified' | 'in_progress' | 'draft_sent' | 'completed'
    paymentMethod: "QRIS",
    taskInstructions: "Mohon edit video rekaman reels kafe kami, tambahkan hook subtitle teks warna oranye dan musik santai.",
    deliverables: [
      {
        id: "d1",
        fileName: "Reels_Promosi_Kafe_Budi_v1.mp4",
        fileSize: "14.2 MB",
        uploadedAt: "08 Nov 2026, 14:15 WIB",
        description: "Draf video pertama dengan subtitle animasi dan sound effect.",
      },
    ],
    chatMessages: [
      {
        id: "m1",
        sender: "system",
        text: "Dana sebesar Rp35.000 telah diamankan di Rekening Escrow JasaKite. Pengerjaan dimulai oleh freelancer.",
        time: "06 Nov, 09:32 WIB",
      },
      {
        id: "m2",
        sender: "freelancer",
        text: "Halo kak Budi! Video mentahnya sudah aku unduh ya, sedang proses cutting dan sync audio.",
        time: "06 Nov, 10:15 WIB",
      },
      {
        id: "m3",
        sender: "customer",
        text: "Siap kak Siti, tolong bagian menu kopinya di-zoom in sedikit ya.",
        time: "06 Nov, 10:45 WIB",
      },
      {
        id: "m4",
        sender: "freelancer",
        text: "Sudah aku sesuaikan kak! Draf videonya sudah aku serahkan di panel penyerahan di bawah ini, silakan dicek kak.",
        time: "Hari ini, 14:22 WIB",
      },
    ],
  },
  {
    id: "JK-2026-0043",
    serviceId: "jasa-3",
    serviceTitle: "Desain Feed Instagram, Pamflet Kegiatan & Poster BEM / HIMA Kampus",
    freelancer: {
      id: "fl-3",
      name: "Dinda Maharani",
      avatar: "/assets/freelancer/avatar-3.jpg",
      campus: "POLNEP",
      major: "Teknik Multimedia Digital",
      phone: "089612345678",
    },
    customer: {
      id: "user-pemesan-1",
      name: "Budi Santoso",
      phone: "081234567890",
    },
    packageType: "express",
    packageName: "Paket Kilat < 12 Jam",
    basePrice: 60000,
    platformFeeRate: PLATFORM_FEE_RATE,
    platformFee: 4800, // 8% dari 60000
    freelancerReceives: 55200, // 92%
    totalAmount: 60000,
    createdAt: "2026-11-08T08:00:00Z",
    deadline: "2026-11-08T20:00:00Z",
    status: "in_progress",
    paymentMethod: "GoPay",
    taskInstructions: "Poster open recruitment panitia seminar dengan palet warna biru dan oranye.",
    deliverables: [],
    chatMessages: [
      {
        id: "m1",
        sender: "system",
        text: "Pembayaran Escrow Rp60.000 diverifikasi. Freelancer sedang menyusun sketsa awal.",
        time: "Hari ini, 08:05 WIB",
      },
      {
        id: "m2",
        sender: "freelancer",
        text: "Halo kak Budi, aset logo sudah aku terima ya. Siang ini kukirimkan preview sketsa tata letaknya.",
        time: "Hari ini, 09:12 WIB",
      },
    ],
  },
  {
    id: "JK-2026-0039",
    serviceId: "jasa-4",
    serviceTitle: "Print, Jilid & Antar Langsung Dokumen ke Meja Fakultas / Jurusan",
    freelancer: {
      id: "fl-1",
      name: "Siti Rahmawati",
      avatar: "/assets/freelancer/avatar-1.jpg",
      campus: "POLNEP",
      major: "Teknik Informatika",
      phone: "085245123456",
    },
    customer: {
      id: "user-pemesan-1",
      name: "Budi Santoso",
      phone: "081234567890",
    },
    packageType: "regular",
    packageName: "Paket Print & Jilid Standar",
    basePrice: 15000,
    platformFeeRate: PLATFORM_FEE_RATE,
    platformFee: 1200,
    freelancerReceives: 13800,
    totalAmount: 15000,
    createdAt: "2026-11-01T10:00:00Z",
    completedAt: "2026-11-01T15:00:00Z",
    status: "completed",
    rating: 5,
    review: "Pengantaran cepat sekali dan jilidnya sangat rapi!",
    deliverables: [],
    chatMessages: [],
  },
];

const INITIAL_WITHDRAWALS = [
  {
    id: "WD-2026-0012",
    amount: 150000,
    fee: 0,
    netAmount: 150000,
    destinationType: "bank",
    bankName: "Bank BCA",
    accountNumber: "8735123488",
    accountHolder: "Siti Rahmawati",
    status: "berhasil", // 'diproses' | 'berhasil' | 'ditolak'
    requestedAt: "2026-11-02T11:20:00Z",
    completedAt: "2026-11-02T14:30:00Z",
  },
  {
    id: "WD-2026-0015",
    amount: 100000,
    fee: 0,
    netAmount: 100000,
    destinationType: "ewallet",
    bankName: "GoPay",
    accountNumber: "085245123456",
    accountHolder: "Siti Rahmawati",
    status: "diproses",
    requestedAt: "2026-11-09T08:00:00Z",
    completedAt: null,
  },
];

const INITIAL_SAVED_ACCOUNTS = [
  {
    id: "acc-1",
    type: "bank",
    provider: "Bank BCA",
    accountNumber: "8735123488",
    accountHolder: "Siti Rahmawati",
    isDefault: true,
  },
  {
    id: "acc-2",
    type: "ewallet",
    provider: "GoPay",
    accountNumber: "085245123456",
    accountHolder: "Siti Rahmawati",
    isDefault: false,
  },
];

const INITIAL_ADS = [
  {
    id: "ad-101",
    serviceId: "jasa-1",
    serviceTitle: "Edit Video Reels Instagram & TikTok Kreatif dengan Subtitle Animasi",
    days: 7,
    startDate: "2026-11-05",
    endDate: "2026-11-12",
    channels: ["web"],
    pricePerDay: 10000,
    totalCost: 70000,
    status: "aktif", // 'menunggu_pembayaran' | 'menunggu_peninjauan' | 'aktif' | 'selesai' | 'ditolak'
    impressions: 1240,
    clicks: 86,
    createdAt: "2026-11-05T09:00:00Z",
  },
  {
    id: "ad-102",
    serviceId: "jasa-3",
    serviceTitle: "Desain Feed Instagram, Pamflet Kegiatan & Poster BEM / HIMA Kampus",
    days: 5,
    startDate: "2026-11-07",
    endDate: "2026-11-12",
    channels: ["web", "social"],
    pricePerDay: 20000,
    totalCost: 100000,
    status: "aktif",
    impressions: 980,
    clicks: 64,
    createdAt: "2026-11-07T11:00:00Z",
  },
];

const INITIAL_REPORTS = [
  {
    id: "rep-1",
    serviceId: "jasa-x",
    serviceTitle: "Jasa Pembuatan Skripsi Kilat Jurusan Teknik (Contoh Kasus)",
    reporterName: "Mahasiswa Peduli Integritas",
    reason: "Menawarkan pengerjaan karya ilmiah dan melanggar Pedoman Integritas Akademik.",
    status: "menunggu_tindakan", // 'menunggu_tindakan' | 'dibekukan' | 'diabaikan'
    reportedAt: "2026-11-09T10:00:00Z",
  },
];

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [savedAccounts, setSavedAccounts] = useState([]);
  const [ads, setAds] = useState([]);
  const [reports, setReports] = useState([]);
  const [freelancerBalance, setFreelancerBalance] = useState(385000);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedOrders = localStorage.getItem("jasakite_orders");
      if (storedOrders) setOrders(JSON.parse(storedOrders));
      else {
        setOrders(INITIAL_ORDERS);
        localStorage.setItem("jasakite_orders", JSON.stringify(INITIAL_ORDERS));
      }

      const storedWd = localStorage.getItem("jasakite_withdrawals");
      if (storedWd) setWithdrawals(JSON.parse(storedWd));
      else {
        setWithdrawals(INITIAL_WITHDRAWALS);
        localStorage.setItem("jasakite_withdrawals", JSON.stringify(INITIAL_WITHDRAWALS));
      }

      const storedAcc = localStorage.getItem("jasakite_saved_accounts");
      if (storedAcc) setSavedAccounts(JSON.parse(storedAcc));
      else {
        setSavedAccounts(INITIAL_SAVED_ACCOUNTS);
        localStorage.setItem("jasakite_saved_accounts", JSON.stringify(INITIAL_SAVED_ACCOUNTS));
      }

      const storedAds = localStorage.getItem("jasakite_ads");
      if (storedAds) setAds(JSON.parse(storedAds));
      else {
        setAds(INITIAL_ADS);
        localStorage.setItem("jasakite_ads", JSON.stringify(INITIAL_ADS));
      }

      const storedReports = localStorage.getItem("jasakite_reports");
      if (storedReports) setReports(JSON.parse(storedReports));
      else {
        setReports(INITIAL_REPORTS);
        localStorage.setItem("jasakite_reports", JSON.stringify(INITIAL_REPORTS));
      }

      const storedBal = localStorage.getItem("jasakite_freelancer_balance");
      if (storedBal) setFreelancerBalance(Number(storedBal));
    } catch (err) {
      console.error("Gagal load order data:", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveOrders = (updatedOrders) => {
    setOrders(updatedOrders);
    try {
      localStorage.setItem("jasakite_orders", JSON.stringify(updatedOrders));
    } catch (err) {
      console.error("Gagal simpan pesanan:", err);
    }
  };

  const saveWithdrawals = (updatedWd) => {
    setWithdrawals(updatedWd);
    try {
      localStorage.setItem("jasakite_withdrawals", JSON.stringify(updatedWd));
    } catch (err) {
      console.error("Gagal simpan withdrawals:", err);
    }
  };

  const saveSavedAccounts = (updatedAcc) => {
    setSavedAccounts(updatedAcc);
    try {
      localStorage.setItem("jasakite_saved_accounts", JSON.stringify(updatedAcc));
    } catch (err) {
      console.error("Gagal simpan rekening:", err);
    }
  };

  const saveAds = (updatedAds) => {
    setAds(updatedAds);
    try {
      localStorage.setItem("jasakite_ads", JSON.stringify(updatedAds));
    } catch (err) {
      console.error("Gagal simpan ads:", err);
    }
  };

  const saveReports = (updatedRep) => {
    setReports(updatedRep);
    try {
      localStorage.setItem("jasakite_reports", JSON.stringify(updatedRep));
    } catch (err) {
      console.error("Gagal simpan laporan:", err);
    }
  };

  const updateBalance = (newBalance) => {
    setFreelancerBalance(newBalance);
    try {
      localStorage.setItem("jasakite_freelancer_balance", String(newBalance));
    } catch (err) {
      console.error("Gagal simpan balance:", err);
    }
  };

  const getOrderById = (id) => {
    return orders.find((o) => o.id === id) || null;
  };

  /**
   * Pembuatan pesanan baru dengan komisi 8% transparan
   */
  const createOrder = (orderData) => {
    const newId = `JK-${new Date().getFullYear()}-${String(
      Math.floor(Math.random() * 9000) + 1000
    )}`;

    const price = Number(orderData.basePrice || orderData.totalAmount) || 0;
    const { platformFee, freelancerReceives } = calculatePlatformEarnings(price);

    const newOrder = {
      ...orderData,
      id: newId,
      basePrice: price,
      platformFeeRate: PLATFORM_FEE_RATE,
      platformFee,
      freelancerReceives,
      totalAmount: price,
      createdAt: new Date().toISOString(),
      status: "verified",
      deliverables: [],
      chatMessages: [
        {
          id: `msg-${Date.now()}`,
          sender: "system",
          text: `Dana sebesar Rp${price.toLocaleString(
            "id-ID"
          )} berhasil diamankan di Escrow JasaKite. Komisi platform 8% (Rp${platformFee.toLocaleString(
            "id-ID"
          )}) akan dipotong saat pesanan selesai.`,
          time: "Baru saja",
        },
      ],
    };

    const updated = [newOrder, ...orders];
    saveOrders(updated);
    return newOrder;
  };

  const sendChatMessage = (orderId, messageText, senderRole = "customer") => {
    const updated = orders.map((order) => {
      if (order.id === orderId) {
        const newMsg = {
          id: `msg-${Date.now()}`,
          sender: senderRole,
          text: messageText,
          time:
            new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) +
            " WIB",
        };
        return {
          ...order,
          chatMessages: [...order.chatMessages, newMsg],
        };
      }
      return order;
    });
    saveOrders(updated);
  };

  const submitDraft = (orderId, fileDetails) => {
    const updated = orders.map((order) => {
      if (order.id === orderId) {
        const newDeliverable = {
          id: `deliv-${Date.now()}`,
          fileName: fileDetails.name || "Hasil_Pekerjaan_JasaKite.docx",
          fileSize: fileDetails.size || "1.5 MB",
          uploadedAt:
            new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }) +
            ", " +
            new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) +
            " WIB",
          description: fileDetails.notes || "Draf pekerjaan diserahkan oleh freelancer.",
        };
        const systemMsg = {
          id: `msg-${Date.now()}`,
          sender: "system",
          text: `Freelancer telah mengunggah draf penyerahan berkas: ${newDeliverable.fileName}. Silakan periksa hasilnya!`,
          time: "Baru saja",
        };
        return {
          ...order,
          status: "draft_sent",
          deliverables: [...(order.deliverables || []), newDeliverable],
          chatMessages: [...order.chatMessages, systemMsg],
        };
      }
      return order;
    });
    saveOrders(updated);
  };

  const completeOrder = (orderId, reviewData) => {
    let earnedAmount = 0;
    const updated = orders.map((order) => {
      if (order.id === orderId) {
        const netReceives = order.freelancerReceives || Math.round(order.basePrice * 0.92);
        earnedAmount = netReceives;

        const systemMsg = {
          id: `msg-${Date.now()}`,
          sender: "system",
          text: `Pesanan selesai! Dana bersih Rp${netReceives.toLocaleString(
            "id-ID"
          )} (setelah potongan komisi 8% Rp${(order.platformFee || 0).toLocaleString(
            "id-ID"
          )}) telah dirilis ke saldo freelancer.`,
          time: "Baru saja",
        };
        return {
          ...order,
          status: "completed",
          rating: reviewData?.rating || 5,
          review: reviewData?.comment || "Pekerjaan sangat rapi dan tepat waktu!",
          completedAt: new Date().toISOString(),
          chatMessages: [...order.chatMessages, systemMsg],
        };
      }
      return order;
    });
    saveOrders(updated);
    if (earnedAmount > 0) {
      updateBalance(freelancerBalance + earnedAmount);
    }
  };

  /**
   * Pengajuan Pencairan Dana Freelancer
   */
  const requestWithdrawal = (amount, destination, shouldSaveAccount = false) => {
    const numAmount = Number(amount);
    if (numAmount < MIN_WITHDRAWAL_AMOUNT) {
      return {
        success: false,
        message: `Minimal penarikan dana adalah Rp${MIN_WITHDRAWAL_AMOUNT.toLocaleString("id-ID")}.`,
      };
    }
    if (numAmount > freelancerBalance) {
      return {
        success: false,
        message: "Nominal penarikan melebihi saldo yang siap ditarik.",
      };
    }

    const newWd = {
      id: `WD-${new Date().getFullYear()}-${String(
        Math.floor(Math.random() * 9000) + 1000
      )}`,
      amount: numAmount,
      fee: 0,
      netAmount: numAmount,
      destinationType: destination.type || "bank",
      bankName: destination.provider || destination.bankName || "Bank BCA",
      accountNumber: destination.accountNumber,
      accountHolder: destination.accountHolder,
      status: "diproses",
      requestedAt: new Date().toISOString(),
      completedAt: null,
    };

    const updatedWd = [newWd, ...withdrawals];
    saveWithdrawals(updatedWd);
    updateBalance(freelancerBalance - numAmount);

    if (shouldSaveAccount) {
      const exists = savedAccounts.some(
        (a) => a.accountNumber === destination.accountNumber
      );
      if (!exists) {
        const newAcc = {
          id: `acc-${Date.now()}`,
          type: destination.type || "bank",
          provider: destination.provider || destination.bankName,
          accountNumber: destination.accountNumber,
          accountHolder: destination.accountHolder,
          isDefault: savedAccounts.length === 0,
        };
        saveSavedAccounts([...savedAccounts, newAcc]);
      }
    }

    return { success: true, withdrawal: newWd };
  };

  /**
   * Buat Iklan Berbayar Baru
   */
  const createAd = (adData) => {
    const newAd = {
      id: `ad-${Date.now()}`,
      ...adData,
      status: "menunggu_peninjauan",
      impressions: 0,
      clicks: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [newAd, ...ads];
    saveAds(updated);
    return newAd;
  };

  /**
   * Laporkan Jasa
   */
  const reportService = (serviceId, serviceTitle, reporterName, reason) => {
    const newRep = {
      id: `rep-${Date.now()}`,
      serviceId,
      serviceTitle,
      reporterName: reporterName || "Pengguna JasaKite",
      reason,
      status: "menunggu_tindakan",
      reportedAt: new Date().toISOString(),
    };
    const updated = [newRep, ...reports];
    saveReports(updated);
    return newRep;
  };

  // Ringkasan Keuangan Freelancer
  const completedOrders = orders.filter((o) => o.status === "completed");
  const totalNetEarnings = completedOrders.reduce(
    (sum, o) => sum + (o.freelancerReceives || Math.round(o.basePrice * 0.92)),
    0
  );
  const totalCommissionPaid = completedOrders.reduce(
    (sum, o) => sum + (o.platformFee || Math.round(o.basePrice * 0.08)),
    0
  );
  const escrowPendingBalance = orders
    .filter((o) => o.status !== "completed")
    .reduce((sum, o) => sum + (o.freelancerReceives || Math.round(o.basePrice * 0.92)), 0);

  return (
    <OrderContext.Provider
      value={{
        orders,
        withdrawals,
        savedAccounts,
        ads,
        reports,
        freelancerBalance,
        totalNetEarnings,
        totalCommissionPaid,
        escrowPendingBalance,
        isLoaded,
        getOrderById,
        createOrder,
        sendChatMessage,
        submitDraft,
        completeOrder,
        requestWithdrawal,
        createAd,
        reportService,
        saveWithdrawals,
        saveAds,
        saveReports,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders harus digunakan di dalam OrderProvider");
  }
  return context;
}
