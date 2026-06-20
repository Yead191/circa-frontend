"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Package,
  ShoppingCart,
  Star,
  CheckCheck,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

// ─── Types ────────────────────────────────────────────────────────────────────

type NotificationType = "order" | "delivery" | "review" | "promo";

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ALL_NOTIFICATIONS: Notification[] = Array.from({ length: 23 }, (_, i) => {
  const types: NotificationType[] = ["order", "delivery", "review", "promo"];
  const type = types[i % 4];

  const content: Record<NotificationType, { title: string; description: string }> = {
    order: {
      title: "Your order is on the way",
      description: "Midnights (3am Edition) is now available",
    },
    delivery: {
      title: "Package delivered successfully",
      description: "Your item has been dropped at your doorstep",
    },
    review: {
      title: "Rate your recent purchase",
      description: "How was your experience with the product?",
    },
    promo: {
      title: "Exclusive deal just for you",
      description: "Up to 40% off on selected items this weekend",
    },
  };

  const times = ["2h ago", "5h ago", "Yesterday", "2 days ago", "3 days ago"];

  return {
    id: i + 1,
    type,
    title: content[type].title,
    description: content[type].description,
    time: times[i % 5],
    read: i > 10,
  };
});

// ─── Icon map ─────────────────────────────────────────────────────────────────

const iconMap: Record<NotificationType, React.ElementType> = {
  order: ShoppingCart,
  delivery: Truck,
  review: Star,
  promo: Package,
};

const iconColorMap: Record<NotificationType, string> = {
  order: "text-blue-400 bg-blue-400/10",
  delivery: "text-emerald-400 bg-emerald-400/10",
  review: "text-amber-400 bg-amber-400/10",
  promo: "text-purple-400 bg-purple-400/10",
};

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 8;

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(ALL_NOTIFICATIONS);
  const [currentPage, setCurrentPage] = useState(1);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE);

  const paginated = notifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleReadAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1);
    if (currentPage > 3) pages.push("ellipsis");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className=" bg-[#0f0f11] text-white font-sans">
      {/* ── Header ── */}

      <div className="flex items-center justify-between flex-wrap gap-3 mx-auto px-4 sm:px-6 pb-4 ">
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold ">
            Notifications
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Recent activity and updates
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleReadAll}
          disabled={unreadCount === 0}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <CheckCheck className="w-4 h-4" />
          Read all
        </Button>
      </div>


      {/* ── Section Label ── */}
      <div className=" mx-auto px-4 sm:px-6">

        {/* ── Notification List ── */}
        <div className="rounded-xl overflow-hidden border border-white/[0.07] bg-[#161618]">
          {paginated.map((notification, idx) => {
            const Icon = iconMap[notification.type];
            return (
              <div key={notification.id}>
                <button
                  onClick={() => handleMarkRead(notification.id)}
                  className={cn(
                    "w-full text-left px-5 py-4 flex items-start gap-4 transition-colors duration-150 group",
                    notification.read
                      ? "hover:bg-white/3"
                      : "bg-white/[0.035] hover:bg-white/6"
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "mt-0.5 shrink-0 w-9 h-9 rounded-full flex items-center justify-center",
                      iconColorMap[notification.type]
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <p
                        className={cn(
                          "text-sm leading-snug truncate",
                          notification.read
                            ? "font-normal text-white/60"
                            : "font-semibold text-white"
                        )}
                      >
                        {notification.title}
                      </p>
                      <span className="text-xs text-white/30 shrink-0 pt-0.5">
                        {notification.time}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-xs mt-0.5 truncate",
                        notification.read ? "text-white/30" : "text-white/50"
                      )}
                    >
                      {notification.description}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!notification.read && (
                    <span className="mt-2 shrink-0 w-2 h-2 rounded-full bg-blue-400" />
                  )}
                </button>

                {idx < paginated.length - 1 && (
                  <Separator className="bg-white/5 mx-5" />
                )}
              </div>
            );
          })}

          {paginated.length === 0 && (
            <div className="py-16 text-center text-white/30 text-sm">
              No notifications
            </div>
          )}
        </div>

        {/* ── Pagination ── */}
        {/* {totalPages > 1 && (
          <div className="mt-6 mb-10 flex justify-center">
            <Pagination>
              <PaginationContent className="gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage((p) => p - 1);
                    }}
                    className={cn(
                      "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors text-sm",
                      currentPage === 1 && "opacity-30 pointer-events-none"
                    )}
                  />
                </PaginationItem>

                {getPageNumbers().map((page, i) =>
                  page === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis className="text-white/30" />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === page}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        className={cn(
                          "border text-sm transition-colors",
                          currentPage === page
                            ? "border-white/20 bg-white text-black font-semibold hover:bg-white/90"
                            : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage((p) => p + 1);
                    }}
                    className={cn(
                      "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors text-sm",
                      currentPage === totalPages && "opacity-30 pointer-events-none"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )} */}
      </div>
    </div>
  );
}