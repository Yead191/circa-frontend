import CreditsModal from "@/components/modals/fans/CreditsModal";
import { Lock } from "lucide-react";
import Image from "next/image";
import PostComments from "./PostComments";
import LikeCommentButton from "./LikeCommentButton";
import { getImageUrl } from "@/utils/getImageUrl";
import PostCarousel from "./PostCarousel";

interface PostDetailsLayoutProps {
  post: any;
}

export default async function PostDetailsLayout({ post }: PostDetailsLayoutProps) {
  const isPremium = post?.isPrimium;
  const authorName = post?.user?.name;

  return (
    <div className="max-w-2xl mx-auto bg-[#0a0a0a] min-h-screen text-white pb-10">
      {/* Left Column - Main Post Content */}
      <div className="flex flex-col">
        {/* Post Card */}
        <div className="bg-[#1C1A24] rounded-2xl p-5 mb-6 border border-gray-800">

          {/* Header Row (Avatar, Name, Time) */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden relative">
                <Image
                  src={getImageUrl(post?.user?.image)}
                  alt={authorName || "Author"}
                  fill
                  className="object-cover w-10 h-10"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{authorName}</span>
                <span className="text-gray-400 text-xs">{post.timeAgo}</span>
              </div>
            </div>
          </div>

          {/* Main Content Carousel */}
          <PostCarousel images={post?.images || []} title={post?.title || ""} authorId={post.user._id} />

          {/* Actions */}
          <LikeCommentButton post={post} />

          {/* Content */}
          <div className="relative">
            <h2 className="text-xl font-bold mb-3">{post.title}</h2>

            <p className={`text-gray-300 leading-relaxed text-sm ${isPremium ? "blur-sm select-none opacity-90" : ""}`}>
              {post.description}
              {isPremium && (
                <>
                  <br /><br />
                  This part of the post is hidden. You need to upgrade your membership to view the full details of this exclusive content.
                  Enjoy the beautiful art and story behind it.
                </>
              )}
            </p>

            {/* Lock / Upgrade Box — Premium */}
            {isPremium && (
              <div className="mt-8 bg-[#2b3047] border border-primary rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-gray-300" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Exclusive Post</h4>
                    <p className="text-xs text-gray-400">Upgrade membership to view the post</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="bg-[#7971FF] hover:bg-[#6c64e6] text-white text-xs font-medium px-4 py-2 rounded-full transition-colors whitespace-nowrap">
                    Membership plan
                  </button>
                  <CreditsModal />
                </div>
              </div>
            )}

          </div>
        </div>

        <PostComments post={post} />
      </div>
    </div>
  );
}
