'use client'
import { Heart, MessageCircle } from 'lucide-react'
import { useEffect, useState, } from 'react'
import { useRouter } from 'next/navigation'
import { myFetch } from '../../../../../helpers/myFetch';
import { toast } from 'sonner';
import { revalidateTags } from '../../../../../helpers/revalidateTags';

const formatCount = (count: number) =>
  count >= 1000 ? `${(count / 1000).toFixed(1)}k` : `${count}`;

const PostCardButton = ({ post }: { post: any }) => {
  const router = useRouter();

  // Local "optimistic" state seeded from the server props.
  const [liked, setLiked] = useState<boolean>(!!post?.isLiked);
  const [likeCount, setLikeCount] = useState<number>(post?.likeCount ?? 0);
  const [submitting, setSubmitting] = useState(false);

  // Re-sync with the server whenever fresh props arrive (e.g. after router.refresh()).
  useEffect(() => {
    setLiked(!!post?.isLiked);
    setLikeCount(post?.likeCount ?? 0);
  }, [post?.isLiked, post?.likeCount]);

  const handleToggleLike = async () => {
    if (submitting) return;

    // Snapshot for rollback.
    const prevLiked = liked;
    const prevCount = likeCount;

    // 1) Optimistically update the UI immediately.
    setLiked(!prevLiked);
    setLikeCount(Math.max(0, prevCount + (prevLiked ? -1 : 1)));
    setSubmitting(true);

    try {
      const response = await myFetch(`/post/like/${post?._id}`, {
        method: "POST",
        body: { type: 'post' },
      });

      if (response?.success) {
        // 2) Reconcile with the server in the background (counts from other users, etc.).
        revalidateTags([`single-post-${post?._id}`,]);
        // startTransition(() => router.refresh());
        // setLiked(!!response.data.isLiked);
        // setLikeCount(response.data.likeCount ?? 0);
      } else {
        // 3) Roll back on failure.
        setLiked(prevLiked);
        setLikeCount(prevCount);

        if (response?.error && Array.isArray(response.error)) {
          response.error.forEach((err: { message: string }) => {
            toast.error(err.message, { id: "post-like" });
          });
        } else {
          toast.error(response?.message || "Something went wrong!", { id: "post-like" });
        }
      }
    } catch {
      setLiked(prevLiked);
      setLikeCount(prevCount);
      toast.error("Something went wrong!", { id: "post-like" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleToggleLike();
        }}
        aria-pressed={liked}
        className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-700 text-primary text-sm hover:bg-gray-800 transition active:scale-95"
      >
        <Heart
          className={`w-4 h-4 transition ${liked ? "fill-primary text-primary scale-110" : "text-gray-400"}`}
        />
        <span>{formatCount(likeCount)}</span>
      </button>
      <button className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-700 text-primary text-sm">
        <MessageCircle className="w-4 h-4" />
        <span>{formatCount(post?.comment_count ?? 0)}</span>
      </button>
    </div>
  )
}

export default PostCardButton
