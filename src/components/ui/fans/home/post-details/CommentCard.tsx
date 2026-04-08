'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import ReplyInput from './ReplyInput'
import { imageFormatter } from '../../../../../../helpers/imageFormatter'
import { getImageUrl } from '@/utils/getImageUrl'
import { myFetch } from '../../../../../../helpers/myFetch'
import { revalidateTags } from '../../../../../../helpers/revalidateTags'

interface CommentCardProps {
    comment: any;
    profileData: any;
}

const CommentCard = ({ comment, profileData }: CommentCardProps) => {
    const [showReply, setShowReply] = useState(false);
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
        // console.log("comment", commentId);
        const res = await myFetch(`/post/like/${commentId}`, {
            method: "POST",
            body: {
                type: "comment"
            }
        })
        if (res?.success) {
            revalidateTags(["single-post"])
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
                    <button onClick={() => hanndleCommentLike(comment?._id)} className="cursor-pointer text-gray-500 text-xs flex items-center gap-1.5 hover:text-pink-400 transition-colors">
                        <Heart size={14} className={` ${comment?.isLike ? "fill-current" : ""}`} /> {comment?.like_count}
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
                            const replyAuthor = reply?.user?.[0];
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