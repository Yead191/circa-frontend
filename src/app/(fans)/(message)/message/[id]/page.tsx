"use client";

import { useEffect, useState, use } from "react";
import { ChatMessages } from "@/components/ui/message/ChatMessages";
import { ChatInput } from "@/components/ui/message/ChatInput";
import getProfile from "@/utils/getProfile";
import { myFetch } from "../../../../../../helpers/myFetch";


interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ChatDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [activeUser, setActiveUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await getProfile();
        if (profile?._id) {
          setCurrentUserId(profile._id);
          const room = await myFetch(`/chat/${id}`, { method: "GET", tags: ["chat"] });
          if (room?.success) setActiveUser(room.data);
        }
      } catch (error) {
        console.error("Failed to fetch chat details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0d0e14] h-full">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 bg-indigo-500/20 rounded-full animate-pulse" />
          </div>
        </div>
        <p className="mt-4 text-gray-500 text-sm font-medium animate-pulse">Loading conversation...</p>
      </div>
    );
  }

  if (!activeUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0d0e14] h-full p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-4 shadow-lg shadow-red-500/5">
          <span className="font-black text-2xl">!</span>
        </div>
        <h2 className="text-white font-bold text-lg mb-2">Conversation Not Found</h2>
        <p className="text-gray-500 text-sm max-w-xs mx-auto">
          We couldn't retrieve the details for this chat. It may have been deleted or moved.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0d0e14] border-l border-white/8">
      {/* ── Chat Messages (Scrolling Area) ── */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <ChatMessages
          chatId={id}
          currentUserId={currentUserId}
          activeUser={activeUser}
        />
      </div>

      {/* ── Chat Input (Fixed Bottom) ── */}
      <div className="shrink-0 bg-[#0d0e14]">
        <ChatInput
          chatId={id}
          onMessageSent={() => {
            // Logic to refresh or scroll if needed
          }}
        />
      </div>

      {/* Aesthetic Border Highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-indigo-500/10 pointer-events-none" />
    </div>
  );
}
