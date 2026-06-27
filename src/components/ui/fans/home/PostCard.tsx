import Image from "next/image";
import { imageFormatter } from "../../../../../helpers/imageFormatter";
import PostCardButton from "./PostCardButton";
import PostCardVideo from "./PostCardVideo";
import { getImageUrl } from "@/utils/getImageUrl";

interface PostUser {
  _id: string;
  name: string;
  email: string;
  image: string;
}

interface Post {
  _id: string;
  user: PostUser;
  title: string;
  description: string;
  images: string[];
  video: string;
  who_can_see: string;
  post_visibility: string[];
  like_count: number;
  comment_count: number;
  is_18_plus: boolean;
  status: string;
  schedule_post: boolean;
  scdule_date: string | null;
  schedule_time: string | null;
  createdAt: string;
  updatedAt: string;
  timeAgo: string;
  isLiked: boolean;
  likeCount: number;
  isPrimium: boolean;
}

interface PostCardProps {
  post: Post;

}

export default function PostCard({ post }: PostCardProps) {
  const isPremium = post.isPrimium;
  const coverImage = post.images?.[0] ?? null;

  const formatCount = (count: number) => {
    if (count >= 1000) return (count / 1000).toFixed(1) + "k";
    return count.toString();
  };

  return (
    <div
      className="bg-[#15131A] rounded-xl p-5 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={getImageUrl(post.user.image)}
              alt={post.user.name}
              fill
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">
              {post?.user?.name}
            </h3>
            <p className="text-gray-400 text-xs">{post?.timeAgo}</p>
          </div>
        </div>
        <div>
          {isPremium ? (
            <span className="bg-[#351F26] text-[#FF8B94] text-xs px-3 py-1 rounded-full font-medium">
              Premium
            </span>
          ) : (
            <span className="bg-[#2D1F35] text-[#D08BFF] text-xs px-3 py-1 rounded-full font-medium">
              Free
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      {post.title && (
        <h2 className="text-white font-semibold text-base mb-1">
          {post.title}
        </h2>
      )}

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4">{post.description}</p>

      {/* Image */}
      {coverImage ? (
        <div className="relative w-full h-72 lg:h-96 overflow-hidden mb-5 bg-black/40 rounded-lg">
          <Image
            src={imageFormatter(coverImage)}
            alt={post.title || "Post Cover"}
            fill
            className="object-cover w-full h-full"
          />
          {isPremium && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20" />
          )}
        </div>
      ) : (
        /* Video-only post — show the video player */
        post.video && <PostCardVideo src={post.video} />
      )}

      {/* Footer Actions */}
      <PostCardButton post={post} />
    </div>
  );
}