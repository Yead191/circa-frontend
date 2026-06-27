'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import PostCard from './PostCard'
import { getFeedPage, type FeedPagination } from './feedActions'

interface FeedListProps {
  initialPosts: any[]
  initialPagination: FeedPagination | null
}

const postHref = (post: any) =>
  `/home/post-details?id=${post._id}&type=${post?.isPrimium ? 'premium' : 'free'}`

export default function FeedList({ initialPosts, initialPagination }: FeedListProps) {
  const [posts, setPosts] = useState<any[]>(initialPosts ?? [])
  const [page, setPage] = useState<number>(initialPagination?.page ?? 1)
  const [totalPage, setTotalPage] = useState<number>(initialPagination?.totalPage ?? 1)
  const [loading, setLoading] = useState(false)

  // Limit stays fixed for the session; falls back to a sensible default.
  const limit = initialPagination?.limit ?? 10

  // Guards against firing a second request while one is already in flight.
  const inFlight = useRef(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const hasMore = page < totalPage

  const loadMore = useCallback(async () => {
    if (inFlight.current || page >= totalPage) return

    inFlight.current = true
    setLoading(true)
    const nextPage = page + 1

    try {
      const res = await getFeedPage(nextPage, limit)

      if (res?.data?.length) {
        // Dedupe by _id so a shifting feed can't render duplicate cards.
        setPosts((prev) => {
          const seen = new Set(prev.map((p) => p._id))
          const fresh = res.data.filter((p: any) => !seen.has(p._id))
          return fresh.length ? [...prev, ...fresh] : prev
        })
      }

      setPage(res?.pagination?.page ?? nextPage)
      if (res?.pagination?.totalPage) setTotalPage(res.pagination.totalPage)
    } finally {
      inFlight.current = false
      setLoading(false)
    }
  }, [page, totalPage, limit])

  // Observe a sentinel placed ahead of the bottom so the next page is fetched
  // *before* the user reaches the very end (no visible loading gap).
  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { rootMargin: '600px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMore, hasMore])

  return (
    <>
      <div className="grid grid-cols-1 gap-6">
        {posts.map((post) => (
          <Link href={postHref(post)} key={post._id}>
            <PostCard post={post} />
          </Link>
        ))}
      </div>

      {/* Sentinel + loading state */}
      {hasMore && (
        <div ref={sentinelRef} className="flex items-center justify-center py-8">
          {loading && (
            <span className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Loading more posts…
            </span>
          )}
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="py-8 text-center text-sm text-gray-500">You&apos;re all caught up 🎉</p>
      )}

      {posts.length === 0 && (
        <p className="py-12 text-center text-sm text-gray-500">No posts yet.</p>
      )}
    </>
  )
}
