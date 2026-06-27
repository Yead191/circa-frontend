import Image from "next/image";
import { Heart, Play, FileText, Lock } from "lucide-react";
import Link from "next/link";
import { imageFormatter } from "../../../../../../helpers/imageFormatter";
import { myFetch } from "../../../../../../helpers/myFetch";

interface Post {
  _id: string;
  isLocked: boolean;
  images: string[];
  video?: string;
  like_count: number;
  title: string;
  timeAgo: string;
}

const Posts = async ({ creatorId }: { creatorId: string }) => {
  const data = await myFetch(`/post/user/${creatorId}`);
  const postData: Post[] = data?.data || [];
  // console.log("PostsData", postData);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mt-4 pb-12">
      {postData?.map((post) => {
        const coverImage = post?.images?.[0];
        const hasImage = Boolean(coverImage);
        const hasVideo = !hasImage && Boolean(post?.video);

        return (
          <Link
            href={`/explore/creator-profile/post-details?type=${post.isLocked ? "premium" : "free"}&id=${post._id}`}
            key={post._id}
            className="flex flex-col gap-3 group cursor-pointer"
          >
            <div className="relative h-75 w-full rounded-[22px] overflow-hidden bg-[#1c1c20] ring-1 ring-white/5 transition-shadow duration-300 group-hover:ring-white/15 group-hover:shadow-2xl group-hover:shadow-black/40">

              {/* Media */}
              {hasImage ? (
                <Image
                  src={imageFormatter(coverImage)}
                  width={500}
                  height={300}
                  className={`h-75 w-full object-cover transition-transform duration-500 group-hover:scale-105 ${post.isLocked ? "brightness-75" : ""}`}
                  alt={post?.title}
                />
              ) : hasVideo ? (
                /* Video-only post — premium gradient placeholder with a play affordance */
                <div className={`relative flex h-full w-full items-center justify-center bg-linear-to-br from-[#241f33] via-[#1c1c20] to-[#120f18] ${post.isLocked ? "brightness-75" : ""}`}>
                  <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_50%_40%,rgba(153,160,253,0.25),transparent_60%)]" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-110">
                    <Play size={26} className="ml-0.5 text-white" fill="currentColor" />
                  </div>
                  <span className="absolute bottom-4 left-4 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white/90 backdrop-blur-md">
                    Video
                  </span>
                </div>
              ) : (
                /* No media — elegant text-forward placeholder */
                <div className={`relative flex h-full w-full flex-col items-center justify-center gap-4 bg-linear-to-br from-[#23222a] via-[#1c1c20] to-[#161418] p-6 text-center ${post.isLocked ? "brightness-75" : ""}`}>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                    <FileText size={24} className="text-[#99a0fd]" />
                  </div>
                  <p className="line-clamp-3 text-sm font-medium leading-relaxed text-white/80">
                    {post?.title}
                  </p>
                </div>
              )}

              {/* Top gradient scrim for badge legibility */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-black/40 to-transparent" />

              {/* Likes Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-md">
                <Heart size={14} className="text-[#D4D4D8]" />
                <span className="text-[13px] font-medium tracking-wide text-white">
                  {post?.like_count}
                </span>
              </div>

              {/* Premium / Locked Badge */}
              {post.isLocked && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-[#7c66dc]/80 px-3 py-1.5 backdrop-blur-md">
                  <Lock size={13} className="text-white" />
                  <span className="text-[12px] font-medium tracking-wide text-white">
                    Premium
                  </span>
                </div>
              )}
            </div>

            <div className="px-1">
              <h3 className="truncate text-[15px] font-medium text-white transition-colors group-hover:text-[#c4b5fd]">
                {post?.title}
              </h3>
              <p className="mt-0.5 text-sm font-light tracking-wide text-[#A1A1AA]">
                {post?.timeAgo}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Posts;