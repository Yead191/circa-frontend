'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { toast } from 'sonner'
import ReplyInput from './ReplyInput'
import { getImageUrl } from '@/utils/getImageUrl'
import { myFetch } from '../../../../../../helpers/myFetch'
import { revalidateTags } from '../../../../../../helpers/revalidateTags'

interface CommentCardProps {
    comment: any;
    profileData: any;
    postId: string
}

const CommentCard = ({ comment, profileData, postId }: CommentCardProps) => {
    const [showReply, setShowReply] = useState(false);

    // Local "optimistic" state seeded from the server props.
    const [liked, setLiked] = useState<boolean>(!!comment?.isLike);
    const [likeCount, setLikeCount] = useState<number>(comment?.like_count ?? 0);
    const [submitting, setSubmitting] = useState(false);

    // Re-sync with the server whenever fresh props arrive (e.g. after revalidation).
    useEffect(() => {
        setLiked(!!comment?.isLike);
        setLikeCount(comment?.like_count ?? 0);
    }, [comment?.isLike, comment?.like_count]);

    // Format time
    const createdAt = new Date(comment.createdAt);
    const diffMs = Date.now() - createdAt.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const timeAgo =
        diffMins < 60
            ? `${diffMins}min`
            : diffMins < 1440
                ? `${Math.floor(diffMins / 60)}h`
                : `${Math.floor(diffMins / 1440)}d`;

    const hanndleCommentLike = async (commentId: string) => {
        if (submitting) return;

        // Snapshot for rollback.
        const prevLiked = liked;
        const prevCount = likeCount;

        // 1) Optimistically update the UI immediately.
        setLiked(!prevLiked);
        setLikeCount(Math.max(0, prevCount + (prevLiked ? -1 : 1)));
        setSubmitting(true);

        try {
            const res = await myFetch(`/post/like/${commentId}`, {
                method: "POST",
                body: { type: "comment" },
            });

            if (res?.success) {
                // 2) Invalidate the cached server data. NOTE: the comments list is
                // cached under the "comments" tag — that one must be revalidated or
                // the stale like state survives even a hard reload.
                revalidateTags(["comments", "single-post", `single-post-${postId}`, "feed-posts"]);
            } else {
                // 3) Roll back on failure.
                setLiked(prevLiked);
                setLikeCount(prevCount);
                toast.error(res?.message || "Something went wrong!", { id: "comment-like" });
            }
        } catch {
            setLiked(prevLiked);
            setLikeCount(prevCount);
            toast.error("Something went wrong!", { id: "comment-like" });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 relative">
                <Image
                    src={getImageUrl(comment?.user?.image)}
                    alt={comment?.user?.name || 'User'}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-200">
                        {comment?.user?.name || 'Unknown User'}
                    </span>
                    <span className="text-xs text-gray-500">• {timeAgo}</span>
                </div>
                <p className="text-sm text-gray-300 mb-2">{comment?.comment_text}</p>
                <div className="flex flex-row items-center gap-3 text-xs text-gray-400 font-medium">
                    <button
                        onClick={() => hanndleCommentLike(comment?._id)}
                        aria-pressed={liked}
                        className={`cursor-pointer text-xs flex items-center gap-1.5 transition-colors active:scale-95 ${liked ? "text-pink-400" : "text-gray-500 hover:text-pink-400"}`}
                    >
                        <Heart size={14} className={`transition ${liked ? "fill-current scale-110" : ""}`} /> {likeCount}
                    </button>
                    <button
                        onClick={() => setShowReply((prev) => !prev)}
                        className={`hover:text-white transition-colors ${showReply ? 'text-[#7971FF]' : ''}`}
                    >
                        Reply
                    </button>
                </div>

                {/* Reply Input */}
                {showReply && (
                    <ReplyInput
                        commentId={comment._id}
                        profileData={profileData}
                        onClose={() => setShowReply(false)}
                    />
                )}

                {/* Existing Replies */}
                {comment.reply?.length > 0 && (
                    <div className="mt-4 space-y-4 pl-4 border-l border-gray-700">
                        {comment.reply.map((reply: any) => {
                            const replyAuthor = reply?.user
                            return (
                                <div key={reply._id} className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 relative">
                                        <Image
                                            src={getImageUrl(replyAuthor?.image)}
                                            alt={replyAuthor?.name || 'User'}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="font-semibold text-sm text-gray-200">
                                                {replyAuthor?.name || 'Unknown User'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-300">{reply?.comment_text}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentCard;