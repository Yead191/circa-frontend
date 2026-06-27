"use server";

import { myFetch } from "../../../../../helpers/myFetch";

export interface FeedPagination {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}

export interface FeedPageResult {
  data: any[];
  pagination: FeedPagination | null;
}

/**
 * Server Action that fetches a single page of the home feed.
 * Called from the client by the infinite-scroll list as the user nears the end.
 */
export async function getFeedPage(page: number, limit: number): Promise<FeedPageResult> {
  const response = await myFetch(`/post/feed?page=${page}&limit=${limit}`, {
    cache: "no-store",
  });

  return {
    data: response?.data ?? [],
    pagination: (response?.pagination as FeedPagination) ?? null,
  };
}
