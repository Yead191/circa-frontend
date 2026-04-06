"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import {
  Phone, MoreVertical, ChevronLeft, CheckCheck,
  MessageSquare,
} from "lucide-react";
import { io } from "socket.io-client";
import { getImageUrl } from "@/utils/getImageUrl";

import { useRouter } from "next/navigation";
import { myFetch } from "../../../../helpers/myFetch";

// Sub-components for better organization
function Avatar({ src, size = 10, online }: { src: string; size?: number; online?: boolean }) {
  return (
    <div className={`relative shrink-0 w-${size} h-${size}`}>
      <div className={`w-${size} h-${size} rounded-full overflow-hidden bg-[#1e1f2e] border border-white/10`}>
        <Image src={src} alt="Avatar" width={size * 4} height={size * 4} className="w-full h-full object-cover" />
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#0d0e14]" />
      )}
    </div>
  );
}

export function ChatMessages({ chatId, currentUserId, activeUser }: { chatId: string; currentUserId: string; activeUser: any }) {
  const [messages, setMessages] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const socket = useMemo(() => io('http://10.10.7.9:5005'), []);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    socket.on(`getMessage::${chatId}`, (data) => {
      console.log(data, 'message data');

      setMessages((prev) => [...prev, data]);
    });
    return () => { socket.off(`getMessage::${chatId}`); };
  }, [socket, chatId]);

  const fetchMessages = async () => {
    try {
      console.log(chatId)
      const res = await myFetch(`/message/${chatId}`, {
        method: "GET",
        cache: "no-store"
        // headers: {
        //   "Content-Type": "application/json",
        //   "Authorization": `Bearer ${token}`,
        // }
      });
      console.log(res, 'message res')
      if (res?.success) setMessages(res?.data?.reverse());
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const otherParticipant = Array.isArray(activeUser?.participants)
    ? activeUser?.participants?.find((p: any) => p._id !== currentUserId)
    : activeUser?.participants;

  return (
    <div className="flex flex-col h-full bg-[#0d0e14] relative overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 bg-[#0d0e14]/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/message')}
            className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <Avatar src={getImageUrl(otherParticipant?.image) || "/user.png"} online={true} />
          <div>
            <p className="text-white text-[15px] font-semibold">{otherParticipant?.name || "Loading..."}</p>
            <p className="text-green-500 text-[11px] font-medium uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
            <Phone size={16} />
          </button>
          <button className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 custom-scrollbar" ref={containerRef}>
        {messages?.map((msg, idx) => {
          const isMe = msg.sender === currentUserId;
          const showAvatar = !isMe && (idx === 0 || messages[idx - 1]?.sender !== msg.sender);

          return (
            <div key={msg._id || idx} className={`flex items-end gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
              {!isMe && (
                <div className="w-8 h-8 shrink-0">
                  {showAvatar ? (
                    <Image src={getImageUrl(otherParticipant?.image) || "/user.png"} alt="" width={32} height={32} className="w-full h-full rounded-full object-cover" />
                  ) : <div className="w-full" />}
                </div>
              )}

              <div className={`max-w-[75%] space-y-1 ${isMe ? "items-end" : "items-start"}`}>
                <div className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm
                  ${isMe
                    ? "bg-indigo-600 text-white rounded-br-sm"
                    : "bg-[#1a1b26] text-gray-200 border border-white/8 rounded-bl-sm"}`}>
                  {/* Gift rendering */}
                  {msg.type === "gift" && msg.gift && (
                    <div className="mb-2 p-3 rounded-2xl bg-linear-to-br from-amber-500/20 to-orange-500/5 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)] group">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-amber-500/20 bg-black/40 rotate-1 group-hover:rotate-0 transition-transform duration-500">
                          <Image
                            src={getImageUrl(msg.gift.image) || ""}
                            alt={msg.gift.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] text-amber-500/80 font-bold uppercase tracking-wider mb-0.5">Sent a gift</p>
                          <h4 className="text-white font-bold text-[14px] leading-tight">{msg.gift.name}</h4>
                          <div className="flex items-center gap-1 mt-1.5 font-bold text-amber-400 text-[12px]">
                            <span className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                              <span className="text-[10px]">💎</span>
                            </span>
                            {msg.gift.credit} Credits
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Render multiple docs/images */}
                  {msg.docs && msg.docs.length > 0 && (
                    <div className={`mb-2 grid gap-2 ${msg.docs.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                      {msg.docs.map((doc: string, dIdx: number) => (
                        <div key={dIdx} className="rounded-lg overflow-hidden border border-white/10 bg-black/20">
                          <Image
                            src={getImageUrl(doc) || ""}
                            alt=""
                            width={400}
                            height={300}
                            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Single image fallback */}
                  {msg.image && (!msg.docs || msg.docs.length === 0) && (
                    <div className="mb-2 rounded-lg overflow-hidden border border-white/10">
                      <Image src={getImageUrl(msg.image) || ""} alt="" width={300} height={200} className="w-full h-auto" />
                    </div>
                  )}
                  {msg.text && <p>{msg.text}</p>}
                </div>

                <div className={`flex items-center gap-1.5 px-1 ${isMe ? "justify-end" : "justify-start"}`}>
                  <span className="text-gray-600 text-[10px] font-medium tracking-tight">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && (
                    <CheckCheck size={12} className="text-indigo-400" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {messages?.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#1a1b26] border border-white/8 flex items-center justify-center">
              <MessageSquare size={28} className="text-white/20" />
            </div>
            <div>
              <p className="text-white font-semibold">Start the conversation</p>
              <p className="text-gray-600 text-sm">Send a message to start chatting with {otherParticipant?.name}</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e1e2a; border-radius: 10px; }
      `}</style>
    </div>
  );
}
