"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Normalisasi format nomor WhatsApp Indonesia ke format standar 62xxx
 * Mendukung input: 08xx, +62xx, 62xx
 */
export function normalizeWhatsApp(phone) {
  if (!phone) return "";
  let clean = phone.replace(/[^0-9+]/g, "").trim();
  if (clean.startsWith("+")) {
    clean = clean.substring(1);
  }
  if (clean.startsWith("0")) {
    clean = "62" + clean.substring(1);
  }
  return clean;
}

/**
 * Validasi apakah string adalah nomor WhatsApp Indonesia yang valid
 */
export function isValidIndonesianPhone(phone) {
  if (!phone) return false;
  const normalized = normalizeWhatsApp(phone);
  // Format Indonesia setelah normalisasi: 628xxxxxxxx (10 - 14 digit)
  return /^628[0-9]{8,12}$/.test(normalized);
}

export const DEMO_ACCOUNTS = {
  pemesan: {
    id: "user-pemesan-1",
    whatsapp: "081234567890",
    normalizedPhone: "6281234567890",
    phone: "081234567890",
    email: "budi.santoso@gmail.com",
    password: "password123",
    name: "Budi Santoso",
    role: "pemesan",
    campus: "Umum",
    campusFullName: "Pemesan Umum (Siapa Saja)",
    avatar: "/assets/freelancer/avatar-4.jpg",
    joinedDate: "Maret 2026",
    balance: 0,
  },
  freelancer: {
    id: "fl-1",
    email: "freelancer@polnep.ac.id",
    nim: "3202116045",
    whatsapp: "085245123456",
    normalizedPhone: "6285245123456",
    phone: "085245123456",
    password: "password123",
    name: "Siti Rahmawati",
    role: "freelancer",
    campus: "POLNEP",
    campusFullName: "Politeknik Negeri Pontianak",
    faculty: "Jurusan Teknik Elektro",
    major: "Teknik Informatika",
    avatar: "/assets/freelancer/avatar-1.jpg",
    joinedDate: "Januari 2026",
    ktmVerified: true,
    rating: 4.9,
    balance: 385000,
    escrowPending: 125000,
    completedOrders: 94,
    premiumTier: "level2",
  },
  admin: {
    id: "admin-1",
    identifier: "admin",
    email: "admin@jasakite.id",
    password: "admin123",
    name: "Admin JasaKite",
    role: "admin",
    campus: "JasaKite HQ",
    avatar: "/assets/freelancer/avatar-2.jpg",
    joinedDate: "2026",
  },
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("jasakite_auth_session");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Gagal membaca sesi auth:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUserSession = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem("jasakite_auth_session", JSON.stringify(userData));
    } catch (err) {
      console.error("Gagal menyimpan sesi:", err);
    }
  };

  /**
   * Login handler:
   * - Customer: WhatsApp number + password
   * - Freelancer: Email kampus / NIM + password
   * - Admin: 'admin' / email + password
   */
  const login = async (identifier, password, selectedRole = "pemesan") => {
    await new Promise((r) => setTimeout(r, 500));

    const cleanId = (identifier || "").trim();
    const cleanIdLower = cleanId.toLowerCase();
    const normalizedInputPhone = normalizeWhatsApp(cleanId);

    // 1. Cek Admin
    if (
      (cleanIdLower === "admin" || cleanIdLower === DEMO_ACCOUNTS.admin.email.toLowerCase()) &&
      password === DEMO_ACCOUNTS.admin.password
    ) {
      saveUserSession(DEMO_ACCOUNTS.admin);
      return { success: true, user: DEMO_ACCOUNTS.admin };
    }

    // 2. Cek Akun Demo Pemesan (Customer via WhatsApp atau Email)
    if (selectedRole === "pemesan") {
      const demoPemesan = DEMO_ACCOUNTS.pemesan;
      const isMatchPhone =
        normalizedInputPhone === demoPemesan.normalizedPhone ||
        cleanId === demoPemesan.whatsapp;
      const isMatchEmail = cleanIdLower === demoPemesan.email.toLowerCase();

      if ((isMatchPhone || isMatchEmail) && password === demoPemesan.password) {
        const activeUser = { ...demoPemesan, role: "pemesan" };
        saveUserSession(activeUser);
        return { success: true, user: activeUser };
      }
    }

    // 3. Cek Akun Demo Freelancer (via Email / NIM)
    if (selectedRole === "freelancer") {
      const demoFreelancer = DEMO_ACCOUNTS.freelancer;
      if (
        (cleanIdLower === demoFreelancer.email.toLowerCase() ||
          cleanIdLower === demoFreelancer.nim.toLowerCase()) &&
        password === demoFreelancer.password
      ) {
        const activeUser = { ...demoFreelancer, role: "freelancer" };
        saveUserSession(activeUser);
        return { success: true, user: activeUser };
      }
    }

    // 4. Cek Pengguna yang Terdaftar di LocalStorage
    try {
      const registeredUsers = JSON.parse(
        localStorage.getItem("jasakite_registered_users") || "[]"
      );

      const matched = registeredUsers.find((u) => {
        if (selectedRole === "pemesan") {
          const userPhone = normalizeWhatsApp(u.whatsapp || u.phone);
          return (
            (userPhone === normalizedInputPhone || u.email?.toLowerCase() === cleanIdLower) &&
            u.password === password
          );
        } else {
          return (
            (u.email?.toLowerCase() === cleanIdLower || u.nim?.toLowerCase() === cleanIdLower) &&
            u.password === password
          );
        }
      });

      if (matched) {
        const activeUser = { ...matched, role: selectedRole || matched.role };
        saveUserSession(activeUser);
        return { success: true, user: activeUser };
      }
    } catch (err) {
      console.error("Error cek registered users:", err);
    }

    if (selectedRole === "pemesan") {
      return {
        success: false,
        message: "Nomor WhatsApp atau password salah. Cek kotak Akun Demo untuk mencoba langsung.",
      };
    }

    return {
      success: false,
      message: "Email kampus / NIM atau password salah. Khusus mahasiswa UNTAN & POLNEP.",
    };
  };

  const demoLogin = (roleType = "pemesan") => {
    const demo = DEMO_ACCOUNTS[roleType] || DEMO_ACCOUNTS.pemesan;
    saveUserSession(demo);
    return demo;
  };

  const register = async (userData) => {
    await new Promise((r) => setTimeout(r, 600));
    try {
      const registeredUsers = JSON.parse(
        localStorage.getItem("jasakite_registered_users") || "[]"
      );

      let processedUser = {
        ...userData,
        id: `user-${Date.now()}`,
        joinedDate: "Hari ini",
        balance: 0,
        escrowPending: 0,
      };

      if (userData.role === "pemesan") {
        processedUser.normalizedPhone = normalizeWhatsApp(userData.whatsapp);
        processedUser.phone = userData.whatsapp;
        processedUser.campus = "Umum";
      }

      registeredUsers.push(processedUser);
      localStorage.setItem("jasakite_registered_users", JSON.stringify(registeredUsers));
      saveUserSession(processedUser);
      return { success: true, user: processedUser };
    } catch (err) {
      return { success: false, message: "Terjadi kesalahan saat pendaftaran akun." };
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("jasakite_auth_session");
    } catch (err) {
      console.error("Gagal menghapus sesi:", err);
    }
    router.push("/");
  };

  const switchRole = () => {
    if (!user) return;
    const newRole = user.role === "freelancer" ? "pemesan" : "freelancer";
    const updated = { ...user, role: newRole };
    saveUserSession(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn: !!user,
        isFreelancer: user?.role === "freelancer",
        isAdmin: user?.role === "admin",
        login,
        demoLogin,
        register,
        logout,
        switchRole,
        saveUserSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
}
