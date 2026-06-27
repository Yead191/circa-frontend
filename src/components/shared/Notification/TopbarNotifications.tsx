"use client";

import * as React from "react";
import { Bell, Check, Sparkles, Inbox } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { io, type Socket } from "socket.io-client";
import {
  getNotificationsAction,
  readAllNotificationsAction,
  readNotificationAction,
  type NotificationItem,
} from "./actions";
import Cookies from "js-cookie";

interface TopbarNotificationsProps {
  userId?: string;
  className?: string;
}

export function TopbarNotifications({ userId, className }: TopbarNotificationsProps) {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [isFetching, setIsFetching] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const loadNotifications = React.useCallback(async () => {
    if (!userId) return;

    setIsFetching(true);
    const res = await getNotificationsAction();
    console.log(res)
    if (res.success && res.data) {
      setNotifications(res.data.data ?? []);
      setUnreadCount(res.data.unreadCount ?? 0);
    } else {
      toast.error(res.message || "Failed to load notifications.");
    }

    setIsFetching(false);
  }, [userId]);

  React.useEffect(() => {
    if (open) {
      void loadNotifications();
    }
  }, [loadNotifications, open]);

  // Initial load on mount
  React.useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  React.useEffect(() => {
    if (!userId) return;

    const socket: Socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL ?? process.env.SOCKET_URL ?? "https://api.circa.chat",
      {
        transports: ["websocket"],
        auth: {
          token: Cookies.get("accessToken")
        },
      }
    );

    const eventName = `get-notification::${userId}`;
    socket.on(eventName, () => {
      void loadNotifications();
    });

    return () => {
      socket.off(eventName);
      socket.disconnect();
    };
  }, [loadNotifications, open, userId]);

  const handleRead = async (notification: NotificationItem) => {
    if (notification.isRead) return;

    const previous = notifications;
    setNotifications((current) =>
      current.map((item) =>
        item._id === notification._id ? { ...item, isRead: true } : item
      )
    );
    setUnreadCount((current) => Math.max(0, current - 1));

    const res = await readNotificationAction(notification._id);
    if (!res.success) {
      setNotifications(previous);
      setUnreadCount((current) => current + 1);
      toast.error(res.message || "Failed to update notification.");
      return;
    }

    void loadNotifications();
  };

  const handleReadAll = async () => {
    if (!notifications.length) return;

    const previous = notifications;
    setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
    setUnreadCount(0);

    const res = await readAllNotificationsAction();
    if (!res.success) {
      setNotifications(previous);
      toast.error(res.message || "Failed to update notifications.");
      return;
    }

    void loadNotifications();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className={className ?? "hidden sm:flex cursor-pointer relative w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800/80 justify-center items-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 hover:border-zinc-700/80 transition-all duration-200 shadow-inner"}
        >
          <Bell className="w-4.75 h-4.75" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-72 sm:w-96 overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-950 p-0 shadow-2xl shadow-black/80 backdrop-blur-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-zinc-900/50">
          <div>
            <DropdownMenuLabel className="p-0 text-[14px] font-medium text-zinc-200 flex items-center gap-1.5">
              Notifications
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
                  {unreadCount} New
                </span>
              )}
            </DropdownMenuLabel>
          </div>

          {notifications.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReadAll}
              disabled={isFetching || unreadCount === 0}
              className="h-8 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded-lg gap-1 disabled:opacity-40"
            >
              <Check className="w-3.5 h-3.5" />
              Mark all as read
            </Button>
          )}
        </div>

        <DropdownMenuSeparator className="bg-zinc-800/60 m-0" />

        {/* Content Container */}
        <div className="max-h-105 overflow-y-auto chunk-scrollbar divide-y divide-zinc-900">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-600 mb-3 border border-zinc-800/40">
                <Inbox className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-zinc-400">All caught up</p>
              <p className="text-xs text-zinc-500 mt-1">You have no new notifications.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification._id}
                type="button"
                className={`block w-full px-4 py-3.5 text-left transition-all duration-150 hover:bg-zinc-900/60 group relative ${notification.isRead ? "bg-transparent" : "bg-indigo-500/2"
                  }`}
                onClick={async () => {
                  await handleRead(notification);
                }}
              >
                {/* Active Indicator Line */}
                {!notification.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.75 bg-indigo-500 rounded-r-md transition-all group-hover:bg-indigo-400" />
                )}

                <div className="flex items-start gap-3">
                  {/* Avatar / Notification Badge Icon */}
                  <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border transition-colors ${notification.isRead
                    ? "bg-zinc-900 border-zinc-800/80 text-zinc-500"
                    : "bg-indigo-950/40 border-indigo-900/50 text-indigo-400"
                    }`}>
                    <Sparkles className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-xs font-medium tracking-wide truncate ${notification.isRead ? "text-zinc-400" : "text-zinc-200 font-semibold"
                        }`}>
                        {notification.title}
                      </p>

                      {!notification.isRead && (
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-400 line-clamp-2 leading-relaxed group-hover:text-zinc-300 transition-colors">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}