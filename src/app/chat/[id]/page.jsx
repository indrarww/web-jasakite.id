"use client";

import React from "react";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ChatRoom from "@/components/chat/ChatRoom";

export default function ChatDetailPage() {
  const params = useParams();
  const conversationId = params?.id;

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs h-[calc(100vh-160px)] min-h-[500px] flex flex-col">
          <ChatRoom conversationId={conversationId} isEmbedded={false} />
        </div>
      </div>
    </ProtectedRoute>
  );
}

