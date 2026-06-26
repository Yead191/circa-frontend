'use client'

import { Heart, MessageCircle } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { myFetch } from '../../../../../../helpers/myFetch';
import { toast } from 'sonner';
import { FaHeart } from 'react-icons/fa';

const formatCount = (count: number) =>
    count >= 1000 ? `${(count / 1000).toFixed(1)}k` : `${count}`;

const LikeCommentButton = ({ post }: any) => {
    const router = useRouter();
    const commentCount = post?.comment_count ?? 0;

    // Local "optimistic" state seeded from the server props.
    const [liked, setLiked] = useState<boolean>(!!post?.isLike);
    const [likeCount, setLikeCount] = useState<number>(post?.likeCount ?? post?.like_count ?? 0);
    const [submitting, setSubmitting] = useState(false);
    const [, startTransition] = useTransition();

    // Re-sync with the server whenever fresh props arrive (e.g. after router.refresh()).
    useEffect(() => {
        setLiked(!!post?.isLike);
        setLikeCount(post?.likeCount ?? post?.like_count ?? 0);
    }, [post?.isLike, post?.likeCount, post?.like_count]);

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
                // 2) Reconcile with the server in the background.
                startTransition(() => router.refresh());
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
        <div className="flex gap-4 mb-5 pb-5 text-primary border-b border-[#2D2D2D]">
            <button
                onClick={() => handleToggleLike()}
                aria-pressed={liked}
                className="cursor-pointer flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-700 hover:text-white hover:bg-white/5 transition-colors text-sm active:scale-95"
            >
                {liked
                    ? <FaHeart color={`var(--color-primary)`} className="w-4 h-4 scale-110 transition" />
                    : <Heart className="w-4 h-4 transition" />}
                <span>{formatCount(likeCount)}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-700 hover:text-white hover:bg-white/5 transition-colors text-sm">
                <MessageCircle className="w-4 h-4" />
                <span>{formatCount(commentCount)}</span>
            </button>
        </div>
    )
}

export default LikeCommentButton
