"use client";

import * as React from "react";
import { Bell } from "lucide-react";
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
}

export function TopbarNotifications({ userId }: TopbarNotificationsProps) {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [isFetching, setIsFetching] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const loadNotifications = React.useCallback(async () => {
    if (!userId) return;

    setIsFetching(true);
    const res = await getNotificationsAction();

    if (res.success && res.data) {
      setNotifications(res.data.data ?? []);
      setUnreadCount(res.data.unreadCount ?? 0);
    } else {
      toast.error(res.message || "Failed to load notifications.");
    }

    setIsFetching(false);
  }, [userId]);

  React.useEffect(() => {
    if (!open) return;
    void loadNotifications();
  }, [loadNotifications, open]);

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
      if (open) {
        void loadNotifications();
      } else {
        void loadNotifications();
      }
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
          className="hidden sm:flex cursor-pointer relative w-11 h-11 rounded-full bg-[#15131A] border border-[#242424] justify-center items-center text-gray-400 hover:text-white transition-colors"
        >
          <Bell />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="w-88 overflow-hidden rounded-2xl border border-white/10 bg-background p-0 shadow-xl"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <DropdownMenuLabel className="p-0 text-sm font-semibold text-foreground">
              Notifications
            </DropdownMenuLabel>
            <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReadAll}
            disabled={!notifications.length || isFetching}
          >
            Read all
          </Button>
        </div>

        <DropdownMenuSeparator className="mx-0 my-0" />

        <div className="max-h-112 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification._id}
                type="button"
                className={`block w-full border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-muted/50 ${notification.isRead ? "bg-background" : "bg-primary/5"}`}
                onClick={async () => {
                  await handleRead(notification);
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
