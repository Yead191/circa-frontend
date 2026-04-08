import { Comment, User } from '@/types';
import { Heart, SendHorizontal } from 'lucide-react';
import { useState } from 'react'
import { getImageUrl } from '@/utils/getImageUrl';
import { myFetch } from '../../../../../../helpers/myFetch';
import { revalidateTags } from '../../../../../../helpers/revalidateTags';

const CommentItem = ({ comment }: { comment: Comment }) => {
  const user = Array.isArray(comment.user) ? comment.user[0] : comment.user;
  const userName = user?.name || "Anonymous";
  const userAvatar = getImageUrl(user?.image);

  const hanndleCommentLike = async (commentId: string) => {
    // console.log("comment", commentId);
    const res = await myFetch(`/post/like/${commentId}`, {
      method: "POST",
      body: {
        type: "comment"
      }
    })
    if (res?.success) {
      revalidateTags(["post-comments"])
    }
  }


  return (
    <div className="flex gap-4 group">
      <img
        src={userAvatar || 'https://i.ibb.co/z5YHLV9/profile.png'}
        alt={userName || "User"}
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
          <button onClick={() => hanndleCommentLike(comment?._id)} className="cursor-pointer text-gray-500 text-xs flex items-center gap-1.5 hover:text-pink-400 transition-colors">
            <Heart size={14} className={` ${comment?.isLike ? "fill-current" : ""}`} /> {comment?.like_count}
          </button>
          <button className="text-gray-500 text-xs font-semibold hover:text-white transition-colors">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};

const PostComments = ({ comments, user, postId }: { comments: Comment[], user: User, postId: string }) => {
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    const res = await myFetch(`/post/comment/${postId}`, {
      method: "POST",
      body: {
        type: "post",
        comment_text: commentText
      }
    })
    if (res?.success) {
      revalidateTags(["post-comments"])
      setCommentText("");

    }
    // console.log("Submitting comment:", commentText);
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
            <CommentItem key={item._id} comment={item} />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </section>
  )
}

export default PostComments