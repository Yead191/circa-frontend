"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { myFetch } from "../../../../../../helpers/myFetch";
import { MessageSquare } from "lucide-react";

interface MessageButtonProps {
  creatorId: string;
  variant: "mobile" | "desktop";
}

const MessageButton = ({ creatorId, variant }: MessageButtonProps) => {
  const [isMessaging, setIsMessaging] = useState(false);
  const router = useRouter();

  const handleMessage = async () => {
    if (!creatorId) return;
    setIsMessaging(true);
    try {
      const res = await myFetch(`/chat/${creatorId}`, {
        method: "POST",
      });
      if (res?.success) {
        router.push('/message');
      } else {
        console.error("Failed to start chat:", res?.message);
      }
    } catch (error) {
      console.error("Message fetch error:", error);
    } finally {
      setIsMessaging(false);
    }
  };

  if (variant === "mobile") {
    return (
      <button
        onClick={handleMessage}
        disabled={isMessaging}
        className="md:hidden absolute top-4 right-4 flex items-center justify-center p-2 rounded-xl border border-[#B698F4] text-[#B698F4] hover:bg-[#B698F4]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MessageSquare size={18} />
      </button>
    );
  }

  return (
    <button
      onClick={handleMessage}
      disabled={isMessaging}
      className="hidden md:flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl border border-[#B698F4] text-[#B698F4] text-[15px] font-medium hover:bg-[#B698F4]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <MessageSquare size={18} />
      {isMessaging ? "Starting..." : "Message"}
    </button>
  );
};

export default MessageButton;
