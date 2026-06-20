'use client'
import { SendHorizonal } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { myFetch } from '../../../../../../helpers/myFetch'
import { revalidate } from '../../../../../../helpers/revalidateHelper'
import { imageFormatter } from '../../../../../../helpers/imageFormatter'

const CommentInput = ({ postId, profileData }: { postId: string, profileData: any }) => {
    // console.log("postId", postId);
    // console.log(profileData)

    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleComment = async () => {
        if (!comment.trim()) return;
        setLoading(true);
        try {
            const response = await myFetch(`/post/comment/${postId}`, {
                method: 'POST',
                body: { type: "post", comment_text: comment },
            });

            if (response?.success) {
                revalidate("comments");
                setComment('');
            } else {
                if (response?.error && Array.isArray(response.error)) {
                    response.error.forEach((err: { message: string }) => {
                        toast.error(err.message, { id: "Comment" });
                    });
                } else {
                    toast.error(response?.message || "Something went wrong!", {
                        id: "Comment",
                    });
                }
            }
        } catch (error) {
            console.error('Failed to post comment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleComment();
    };

    const isEmpty = !comment.trim();

    return (
        <div className="flex items-center gap-3 mb-8">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-700 relative">
                <Image
                    src={imageFormatter(profileData?.image)}
                    alt={profileData?.name || 'User'}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Input + Send Button */}
            <div className="flex-1 bg-[#1A1A24] rounded-full border border-gray-800 px-4 py-2.5 flex items-center gap-2">
                <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a comment..."
                    className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-500"
                />
                <button
                    onClick={handleComment}
                    disabled={isEmpty || loading}
                    className={`shrink-0 p-1.5 rounded-full transition-all duration-200
                        ${isEmpty || loading
                            ? 'text-gray-600 cursor-not-allowed'
                            : 'text-[#7971FF] hover:bg-[#7971FF]/10 cursor-pointer'
                        }`}
                >
                    <SendHorizonal className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default CommentInput;