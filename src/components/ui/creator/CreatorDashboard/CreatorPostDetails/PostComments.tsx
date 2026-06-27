'use client'

import { Comment, User } from '@/types';
import { Heart, SendHorizontal, X } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { getImageUrl } from '@/utils/getImageUrl';
import { toast } from 'sonner';
import { myFetch } from '../../../../../../helpers/myFetch';
import { revalidateTags } from '../../../../../../helpers/revalidateTags';

/* ─────────────────────────────────────────
   Reply input (mirrors the fan-side ReplyInput)
───────────────────────────────────────── */
const ReplyInput = ({
  commentId,
  user,
  postId,
  onClose,
  // onReplied,
}: {
  commentId: string;
  user: User;
  postId: string;
  onClose: () => void;
  // onReplied: () => void;
}) => {
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const isEmpty = !reply.trim();

  const handleReply = async () => {
    if (isEmpty || loading) return;
    setLoading(true);
    try {
      const res = await myFetch(`/post/comment/${commentId}`, {
        method: 'POST',
        body: { type: 'comment', comment_text: reply },
      });

      if (res?.success) {
        setReply('');
        onClose();
        revalidateTags(['post-comments', `post-comments-${postId}`]);
        // onReplied();
      } else {
        toast.error(res?.message || 'Something went wrong!', { id: 'reply' });
      }
    } catch {
      toast.error('Something went wrong!', { id: 'reply' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-3">
      <img
        src={getImageUrl(user?.image) || 'https://i.ibb.co/z5YHLV9/profile.png'}
        alt={user?.name || 'User'}
        className="w-7 h-7 rounded-full object-cover shrink-0"
      />
      <div className="flex-1 bg-[#1A1A24] rounded-full border border-[#2a2a35] px-3 py-2 flex items-center gap-2">
        <input
          autoFocus
          type="text"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleReply();
            if (e.key === 'Escape') onClose();
          }}
          placeholder="Write a reply..."
          className="bg-transparent border-none outline-none text-xs w-full text-white placeholder-gray-500"
        />
        <button
          onClick={handleReply}
          disabled={isEmpty || loading}
          className={`shrink-0 p-1 rounded-full transition-all ${isEmpty || loading
            ? 'text-gray-600 cursor-not-allowed'
            : 'text-purple-500 hover:bg-purple-500/10 cursor-pointer'
            }`}
        >
          <SendHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-300 transition-colors shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────
   Single comment (optimistic like + reply)
───────────────────────────────────────── */
const CommentItem = ({
  comment,
  user,
  postId,
  // onReplied,
}: {
  comment: Comment;
  user: User;
  postId: string;
  // onReplied: () => void;
}) => {
  const author = Array.isArray(comment.user) ? comment.user[0] : comment.user;
  const userName = author?.name || 'Anonymous';
  const userAvatar = getImageUrl(author?.image);

  const [showReply, setShowReply] = useState(false);

  // Local "optimistic" like state seeded from the server props.
  const [liked, setLiked] = useState<boolean>(!!comment?.isLike);
  const [likeCount, setLikeCount] = useState<number>(comment?.like_count ?? 0);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    setLiked(!!comment?.isLike);
    setLikeCount(comment?.like_count ?? 0);
  }, [comment?.isLike, comment?.like_count]);

  const handleCommentLike = async () => {
    if (liking) return;

    const prevLiked = liked;
    const prevCount = likeCount;

    // 1) Optimistic update.
    setLiked(!prevLiked);
    setLikeCount(Math.max(0, prevCount + (prevLiked ? -1 : 1)));
    setLiking(true);

    try {
      const res = await myFetch(`/post/like/${comment._id}`, {
        method: 'POST',
        body: { type: 'comment' },
      });

      if (res?.success) {
        revalidateTags(['post-comments', `post-comments-${postId}`]);
      } else {
        // 2) Roll back on failure.
        setLiked(prevLiked);
        setLikeCount(prevCount);
        toast.error(res?.message || 'Something went wrong!', { id: 'comment-like' });
      }
    } catch {
      setLiked(prevLiked);
      setLikeCount(prevCount);
      toast.error('Something went wrong!', { id: 'comment-like' });
    } finally {
      setLiking(false);
    }
  };

  return (
    <div className="flex gap-4 group">
      <img
        src={userAvatar || 'https://i.ibb.co/z5YHLV9/profile.png'}
        alt={userName}
        className="w-10 h-10 rounded-full object-cover shrink-0 mt-1"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm text-white">{userName}</span>
          <span className="text-gray-500 text-[10px]">• {new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed mb-3">
          {comment.comment_text}
        </p>
        <div className="flex gap-6">
          <button
            onClick={handleCommentLike}
            aria-pressed={liked}
            className={`cursor-pointer text-xs flex items-center gap-1.5 transition-colors active:scale-95 ${liked ? 'text-pink-400' : 'text-gray-500 hover:text-pink-400'}`}
          >
            <Heart size={14} className={`transition ${liked ? 'fill-current scale-110' : ''}`} /> {likeCount}
          </button>
          <button
            onClick={() => setShowReply((prev) => !prev)}
            className={`text-xs font-semibold transition-colors ${showReply ? 'text-purple-400' : 'text-gray-500 hover:text-white'}`}
          >
            Reply
          </button>
        </div>

        {/* Reply input */}
        {showReply && (
          <ReplyInput
            commentId={comment._id}
            user={user}
            postId={postId}
            onClose={() => setShowReply(false)}
          // onReplied={onReplied}
          />
        )}

        {/* Existing replies */}
        {comment.reply?.length > 0 && (
          <div className="mt-4 space-y-4 pl-4 border-l border-[#2a2a35]">
            {comment.reply.map((reply) => {
              const replyAuthor = Array.isArray(reply.user) ? reply.user[0] : reply.user;
              return (
                <div key={reply._id} className="flex gap-3">
                  <img
                    src={getImageUrl(replyAuthor?.image) || 'https://i.ibb.co/z5YHLV9/profile.png'}
                    alt={replyAuthor?.name || 'User'}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-sm text-white">{replyAuthor?.name || 'Unknown User'}</span>
                    <p className="text-gray-400 text-sm leading-relaxed">{reply.comment_text}</p>
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

/* ─────────────────────────────────────────
   Comments section
───────────────────────────────────────── */
const PostComments = ({ comments, user, postId }: { comments: Comment[], user: User, postId: string }) => {
  const router = useRouter();
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [, startTransition] = useTransition();

  // Re-fetch the server data so a new comment/reply appears without a hard reload.
  const reconcile = () => startTransition(() => router.refresh());

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || submitting) return;
    setSubmitting(true);

    try {
      const res = await myFetch(`/post/comment/${postId}`, {
        method: "POST",
        body: { type: "post", comment_text: commentText },
      });

      if (res?.success) {
        setCommentText("");
        revalidateTags(["post-comments", `post-comments-${postId}`, "post", `single-post-${postId}`]);
        // reconcile();
      } else {
        toast.error(res?.message || "Something went wrong!", { id: "comment" });
      }
    } catch {
      toast.error("Something went wrong!", { id: "comment" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="comments-section" className="mt-16">
      <h2 className="text-xl font-medium mb-8 flex items-center gap-3">
        Comments <span className="text-gray-500 font-medium">({comments?.length || 0})</span>
      </h2>

      {/* Comment Input */}
      <div className="flex gap-4 items-center mb-12">
        <img
          src={getImageUrl(user?.image) || 'https://i.ibb.co/z5YHLV9/profile.png'}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/20"
          alt="Current User"
        />
        <div className="flex-1 relative group">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
            placeholder="Add a comment..."
            className="w-full bg-[#1a1a24] border border-[#2a2a35] rounded-full py-3.5 px-6 text-sm focus:outline-none focus:border-purple-500/60 transition-all placeholder:text-gray-600"
          />
          <button
            onClick={handleCommentSubmit}
            disabled={submitting}
            className={`cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-purple-500 p-1 rounded-full transition-all hover:bg-purple-500/10 ${commentText ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}
          >
            <SendHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Comment Thread */}
      <div className="space-y-10 pb-20">
        {comments && comments.length > 0 ? (
          comments?.map((item) => (
            <CommentItem
              key={item._id}
              comment={item}
              user={user}
              postId={postId}
            // onReplied={reconcile}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </section>
  )
}

export default PostComments
