import Image from "next/image";
import { ChevronRight, Users, Crown, Sparkles, LayoutGrid } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Posts from "./Posts";
import Shop from "./Shop";
import Link from "next/link";
import MessageButton from "./MessageButton";
import { getImageUrl } from "@/utils/getImageUrl";


const CreatorProfile = ({ creatorData, creatorId }: any) => {

  // console.log(creatorData)
  const freeMembers = creatorData?.freeMambers ?? 0;
  const paidMembers = creatorData?.paidMambers ?? 0;
  const totalMembers = freeMembers + paidMembers;
  const totalPosts = creatorData?.totalPosts ?? 0;

  return (
    <div className="w-full">
      {/* Main Header Card — overflow-visible so the avatar is never clipped */}
      <div className="relative overflow-visible rounded-3xl border border-white/10 bg-[#0c0c0e]/40 shadow-2xl shadow-black/40">

        {/* Banner — clips its own gradient/orbs to the rounded top */}
        <div className="relative h-28 w-full overflow-hidden rounded-t-3xl bg-linear-to-br from-[#9EA4F9] via-[#b085f5] to-[#F084A9] md:h-32">
          <div className="pointer-events-none absolute -top-10 left-1/4 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 right-10 h-36 w-36 rounded-full bg-[#7c66dc]/40 blur-3xl" />
          {/* Soft seam where the avatar overlaps */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-[#0c0c0e]/60 to-transparent" />

          {/* Message Buttons (mobile + desktop both anchor top-right of the cover) */}
          <div className="absolute top-4 right-4 z-10">
            <MessageButton creatorId={creatorData?._id} variant="mobile" />
            <MessageButton creatorId={creatorData?._id} variant="desktop" />
          </div>
        </div>

        {/* Body */}
        <div className="px-5 pb-7 md:px-8 md:pb-8">
          <div className="relative z-10 -mt-12 flex flex-col items-center gap-4 md:flex-row md:items-end md:gap-5">

            {/* Avatar */}
            <div className="shrink-0">
              <div className="w-fit rounded-full bg-[#0c0c0e] p-1.5 ring-1 ring-white/10 shadow-xl">
                <Image
                  src={getImageUrl(creatorData?.image)}
                  alt={creatorData?.name}
                  width={160}
                  height={160}
                  className="h-24 w-24 rounded-full object-cover md:h-28 md:w-28 lg:h-32 lg:w-32"
                />
              </div>
            </div>

            {/* Name + quick info */}
            <div className="flex-1 text-center md:pb-1.5 md:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2.5 md:justify-start">
                <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                  {creatorData?.name}
                </h1>
                {creatorData?.nickname && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#181624] px-3 py-1 text-[11px] font-medium text-[#8e95f5] ring-1 ring-[#8e95f5]/20 md:text-xs">
                    <Sparkles size={11} /> {creatorData?.nickname}
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 md:justify-start">
                <span className="flex items-center gap-1.5 text-sm text-[#FF9A85]">
                  <Users size={15} /> {totalMembers} members
                </span>
                <Link
                  href={`/explore/creator-profile/about?id=${creatorId}`}
                  className="flex items-center text-sm text-[#B698F4] transition-colors hover:text-[#CBB5F8] hover:underline focus:outline-none"
                >
                  About <ChevronRight size={16} className="ml-0.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Stat chips */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/3 p-3 text-center">
              <p className="flex items-center justify-center gap-1 text-lg font-semibold text-white">
                <LayoutGrid size={15} className="text-[#9EA4F9]" /> {totalPosts}
              </p>
              <p className="mt-0.5 text-xs text-gray-400">Posts</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/3 p-3 text-center">
              <p className="text-lg font-semibold text-white">{totalMembers}</p>
              <p className="mt-0.5 text-xs text-gray-400">Members</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/3 p-3 text-center">
              <p className="text-lg font-semibold text-white">{freeMembers}</p>
              <p className="mt-0.5 text-xs text-gray-400">Free</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/3 p-3 text-center">
              <p className="flex items-center justify-center gap-1 text-lg font-semibold text-[#fcc419]">
                <Crown size={15} /> {paidMembers}
              </p>
              <p className="mt-0.5 text-xs text-gray-400">Paid</p>
            </div>
          </div>

          {/* Bio Text */}
          {creatorData?.short_bio && (
            <p className="mt-5 text-[15px] font-light leading-relaxed tracking-wide text-gray-300">
              {creatorData?.short_bio}
            </p>
          )}

          {/* Primary Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button className="group relative w-full overflow-hidden rounded-xl bg-linear-to-r from-[#9EA4F9] to-[#b085f5] px-6 py-3.5 text-[15px] font-medium text-white shadow-lg shadow-[#9EA4F9]/25 transition-all hover:brightness-110 active:scale-[0.99] sm:w-auto">
              <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              Join for free
            </button>
            <Link href={`/explore/creator-profile/membership?creatorId=${creatorData?._id}`} className="w-full sm:w-auto">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-[15px] font-medium text-[#D8D8E0] transition-colors hover:bg-white/10 hover:text-white sm:w-auto">
                <Crown size={16} className="text-[#fcc419]" />
                Membership option
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="post" className="w-full mt-4">
          <TabsList className="grid grid-cols-4 w-full md:w-150 mb-6">
            <TabsTrigger value="post">Post</TabsTrigger>
            <TabsTrigger value="shop">Shop</TabsTrigger>
          </TabsList>

          <TabsContent value="post">
            <Posts creatorId={creatorId} />
          </TabsContent>

          <TabsContent value="shop">
            <Shop creatorId={creatorId} />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default CreatorProfile;