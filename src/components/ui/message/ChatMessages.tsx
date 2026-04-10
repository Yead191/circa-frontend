"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import {
  Phone, MoreVertical, ChevronLeft, CheckCheck,
  MessageSquare, Flag, Ban
} from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { getImageUrl } from "@/utils/getImageUrl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReportModal } from "@/components/ui/ReportModal";

import { useRouter } from "next/navigation";
import { myFetch } from "../../../../helpers/myFetch";
import { CgUnblock } from "react-icons/cg";
import { revalidate } from "../../../../helpers/revalidateHelper";
import { revalidateTags } from "../../../../helpers/revalidateTags";

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

export function ChatMessages({
  chatId,
  currentUserId,
  activeUser,
  initialMessages = []
}: {
  chatId: string;
  currentUserId: string;
  activeUser: any;
  initialMessages?: any[];
}) {
  const router = useRouter();
  console.log(activeUser)
  const [messages, setMessages] = useState<any[]>(() => {
    return [...initialMessages].reverse();
  });
  // console.log(messages)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const updateSourceRef = useRef<"initial" | "pagination" | "new-message">("initial");

  const socket = useMemo(() => io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://68.178.164.48:5005"), []);

  // Sync state when initialMessages prop changes (after router.refresh())
  useEffect(() => {
    if (initialMessages) {
      setMessages((prev) => {
        const reversedInitial = [...initialMessages].reverse();

        // Merge strategy: Use server's truth + local messages not yet in server's truth
        const merged = [...reversedInitial];
        prev.forEach(localMsg => {
          if (localMsg && localMsg._id && !merged.find(m => m._id === localMsg._id)) {
            merged.push(localMsg);
          }
        });

        // Ensure everything is sorted by creation date
        return merged.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      });
      setIsInitialLoad(false);
    }
  }, [initialMessages]);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  // const [messageGet, setMessageGet] = useState<boolean>(false)

  useEffect(() => {
    socket.on(`getMessage::${chatId}`, (data) => {
      // console.log("New message received via socket:", data);
      if (data) {
        updateSourceRef.current = "new-message";
        setMessages((prev) => {
          const isDuplicate = prev.some(msg => msg._id === data._id);
          if (isDuplicate) return prev;
          return [...prev, data];
        });

        // Use a slight delay to allow the DB to catch up before revalidating server state
        setTimeout(() => {
          router.refresh();
        }, 100);
      }
    });

    return () => {
      socket.off(`getMessage::${chatId}`);
    };
  }, [socket, chatId, router]);

  const fetchMessages = async (pageNumber: number, isMore: boolean = false) => {
    if (isMore) setIsLoadingMore(true);
    try {
      const res = await myFetch(`/message/${chatId}?page=${pageNumber}`, {
        method: "GET",
        cache: "no-store",
      });

      if (res?.success) {
        const newMessages = res?.data || [];
        if (newMessages.length === 0) {
          setHasMore(false);
        } else {
          const reversedMessages = [...newMessages].reverse();
          if (isMore) {
            updateSourceRef.current = "pagination";
            // Capture scroll height before update
            if (containerRef.current) {
              prevScrollHeightRef.current = containerRef.current.scrollHeight;
            }
            setMessages((prev) => [...reversedMessages, ...prev]);
            setPage(pageNumber);
          } else {
            updateSourceRef.current = "initial";
            setMessages(reversedMessages);
            setIsInitialLoad(false);
          }
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setIsInitialLoad(true);
    fetchMessages(1);
  }, [chatId]);

  const handleScroll = () => {
    if (containerRef.current && containerRef.current.scrollTop === 0 && hasMore && !isLoadingMore) {
      fetchMessages(page + 1, true);
    }
  };

  useEffect(() => {
    if (!containerRef.current || messages.length === 0) return;

    const source = updateSourceRef.current;

    if (source === "initial") {
      scrollToBottom();
    } else if (source === "pagination") {
      // Maintaining scroll position after loading more
      if (prevScrollHeightRef.current > 0) {
        const scrollDiff = containerRef.current.scrollHeight - prevScrollHeightRef.current;
        containerRef.current.scrollTop = scrollDiff;
        prevScrollHeightRef.current = 0;
      }
    } else if (source === "new-message") {
      // For now, always scroll to bottom for new messages as requested
      scrollToBottom();
    }
  }, [messages]);

  const handleReport = () => {
    setIsReportModalOpen(true);
  };

  const handleBlock = () => {
    toast.promise(myFetch(`/user/block`, {
      method: "POST",
      body: {
        user: otherParticipant?._id,
      }
    }), {
      loading: `Blocking ${otherParticipant?.name || 'user'}...`,
      success: (res) => {
        setTimeout(() => {
          window.location.reload()
        }, 500)
        return res?.message || `Blocked ${otherParticipant?.name || 'user'}`
      },
      error: (err) => {
        return err?.message || `Failed to block ${otherParticipant?.name || 'user'}`
      },
    })
  };

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all outline-none">
                <MoreVertical size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#1a1b26] border-white/10 text-white">
              <DropdownMenuItem
                onClick={handleReport}
                className="gap-3 cursor-pointer focus:bg-white/5 focus:text-white text-gray-300"
              >
                <Flag size={16} className="text-amber-500" />
                <span>Report User</span>
              </DropdownMenuItem>
              {!(activeUser?.status === "block" && !activeUser?.blockByMe) && (
                <DropdownMenuItem
                  onClick={handleBlock}
                  className="gap-3 cursor-pointer focus:bg-red-500/10 focus:text-red-400 text-red-400"
                >
                  {activeUser?.status === "block" && activeUser?.blockByMe ? (
                    <CgUnblock size={16} />
                  ) : (
                    <Ban size={16} />
                  )}
                  <span>
                    {activeUser?.status === "block" && activeUser?.blockByMe
                      ? "Unblock User"
                      : "Block User"}
                  </span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages List */}
      <div
        className="flex-1 overflow-y-auto px-5 py-6 space-y-6 custom-scrollbar"
        ref={containerRef}
        onScroll={handleScroll}
      >
        {/* Load more indicator */}
        {isLoadingMore && (
          <div className="flex justify-center py-2 animate-pulse">
            <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        )}

        {!hasMore && messages.length > 0 && (
          <div className="flex justify-center py-4">
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-700 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
              Beginning of your history
            </span>
          </div>
        )}
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

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        userId={otherParticipant?._id}
        userName={otherParticipant?.name || "User"}
      />
    </div>
  );
}
