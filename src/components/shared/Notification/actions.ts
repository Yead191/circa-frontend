"use server";

import { myFetch } from "../../../../helpers/myFetch";

export interface NotificationItem {
  _id: string;
  title: string;
  receiver: string[];
  message: string;
  filePath?: string;
  isRead: boolean;
  readers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  message: string;
  pagination?: {
    total: number;
    limit: number;
    page: number;
    totalPage: number;
  };
  data?: {
    unreadCount: number;
    data: NotificationItem[];
  };
}

export async function getNotificationsAction() {
  return myFetch<NotificationsResponse["data"]>("/notification", {
    method: "GET",
    cache: "no-store",
    tags: ["notification"],
  });
}

export async function readNotificationAction(id: string) {
  return myFetch(`/notification/${id}`, {
    method: "PATCH",
  });
}

export async function readAllNotificationsAction() {
  return myFetch("/notification", {
    method: "PATCH",
  });
}
