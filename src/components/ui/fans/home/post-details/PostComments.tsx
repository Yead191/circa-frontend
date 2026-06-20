import React from 'react'
import { myFetch } from '../../../../../../helpers/myFetch'
import CommentInput from './CommentInput'
import getProfile from '../../../../../../helpers/getProfile'
import CommentCard from './CommentCard'

const PostComments = async ({ post }: any) => {
    const response = await myFetch(`/post/comment/${post?._id}?limit=5`, { tags: ['comments'] });
    const comments = response?.data || [];
    const profileData = await getProfile();
    // console.log(comments)

    return (
        <div className="px-1">
            <h3 className="font-semibold text-lg mb-4">Comments ({post?.comment_count})</h3>
            <CommentInput postId={post?._id} profileData={profileData} />

            <div className="space-y-6">
                {comments.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                        No comments yet. Be the first!
                    </p>
                )}
                {comments.map((comment: any) => (
                    <CommentCard
                        key={comment._id}
                        comment={comment}
                        profileData={profileData}
                    />
                ))}
            </div>
        </div>
    );
};

export default PostComments;
