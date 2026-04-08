"use client";

import { useEffect, useMemo, useState } from "react";
import { ChatSidebar } from "@/components/ui/message/ChatSidebar";
import getProfile from "@/utils/getProfile";
import { myFetch } from "../../../../../helpers/myFetch";
import { io } from "socket.io-client";

export default function MessageLayoutWrapper({ children }: { children: React.ReactNode }) {
    const [userId, setUser] = useState(null)
    const [chatRooms, setChatRooms] = useState<any[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const socket = useMemo(() => io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://68.178.164.48:5005"), []);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getProfile();
            setUser(user?._id);
        };

        fetchUser();
    }, []);

    useEffect(() => {
        socket.on(`chatList::${userId}`, (data) => {
            // console.log(data, 'chat room data');

            setChatRooms((prev) => [...prev, data]);
        });
        return () => { socket.off(`chatList::${userId}`); };
    }, [socket, userId]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profile = await getProfile();
                if (profile?._id) {
                    setCurrentUserId(profile._id);
                    const rooms = await myFetch("/chat", { method: "GET", tags: ["chat"] });
                    if (rooms?.success) setChatRooms(rooms.data);
                }
            } catch (error) {
                console.error("Failed to fetch chat data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center bg-[#0d0e14]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500" />
            </div>
        );
    }
    return (
        <div className="flex h-[calc(100vh-115px)] overflow-hidden bg-[#0a0a10] ">
            {/* Sidebar - Persistent */}
            <div className="w-full lg:w-1/3 xl:w-1/4 shrink-0 h-full">
                <ChatSidebar chatRooms={chatRooms} currentUserId={currentUserId} isCreator={true} />
            </div>

            {/* Main Content (Conversations) */}
            <div className="flex-1 h-full relative overflow-hidden bg-[#0d0e14]">
                {children}
            </div>
        </div>
    );
}
