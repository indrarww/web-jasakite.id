import "./globals.css";
import React, { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CampusProvider } from "@/context/CampusContext";
import { OrderProvider } from "@/context/OrderContext";
import { ChatProvider } from "@/context/ChatContext";

export const metadata = {
  title: "JasaKite.id - Marketplace Jasa Freelancer Mahasiswa Pontianak",
  description:
    "Marketplace jasa mahasiswa terpercaya di Pontianak. Freelancer: mahasiswa UNTAN & POLNEP terverifikasi, Pemesan: siapa saja. Desain organisasi, edit video, logistik kampus, & tutor privat dengan garansi pembayaran Escrow aman.",
  icons: {
    icon: "/assets/logo/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-white text-ink-main selection:bg-brand-orange selection:text-white">
        <AuthProvider>
          <CampusProvider>
            <OrderProvider>
              <ChatProvider>
                <Suspense fallback={<div className="h-18 bg-white border-b border-gray-100" />}>
                  <Navbar />
                </Suspense>
                <main className="flex-1">{children}</main>
                <Footer />
              </ChatProvider>
            </OrderProvider>
          </CampusProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
