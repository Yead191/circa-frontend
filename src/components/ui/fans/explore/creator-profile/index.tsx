import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Posts from "./Posts";
import Shop from "./Shop";
import Link from "next/link";
import MessageButton from "./MessageButton";
import { getImageUrl } from "@/utils/getImageUrl";


const CreatorProfile = ({ creatorData, creatorId }: any) => {

  console.log(creatorData)
  return (
    <div className="w-full ">
      {/* Main Header Card */}
      <div className="flex flex-col md:flex-row gap-6 lg:gap-8  bg-[#0c0c0e]/40  relative">
        <MessageButton creatorId={creatorData?._id} variant="mobile" />

        {/* Avatar */}
        <div className="shrink-0 flex justify-center md:justify-start">
          <Image
            src={getImageUrl(creatorData?.image)}
            alt={creatorData?.name}
            width={180}
            height={180}
            className="rounded-full object-cover w-30 h-30 md:w-40 md:h-40 lg:w-44 lg:h-44"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">

            {/* Name, Role, Stats */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1.5">
                <h1 className="text-[26px] md:text-3xl lg:text-[32px] font-medium text-white tracking-wide">
                  {creatorData?.name}
                </h1>
                <span className="px-3.5 py-2 rounded-full bg-[#181624] text-[#8e95f5] text-[11px] md:text-xs font-medium">
                  {creatorData?.nickname}
                </span>
              </div>

              {/* Members Count */}
              <p className="text-[#FF9A85] text-[15px] md:text-base mb-1.5">
                {creatorData?.freeMambers + creatorData?.paidMambers} members
              </p>

              {/* About Link */}
              <Link href={`/explore/creator-profile/about?id=${creatorId}`} className="flex items-center text-[#B698F4] text-[15px] hover:text-[#CBB5F8] transition-colors focus:outline-none cursor-pointer hover:underline">
                About <ChevronRight size={16} className="ml-0.5" />
              </Link>
            </div>

            {/* Desktop Message Button */}
            <MessageButton creatorId={creatorData?._id} variant="desktop" />
          </div>

          {/* Bio Text */}
          <p className="text-gray-300 text-[15px] leading-relaxed max-w-[85%] mb-6 md:mb-5 font-light tracking-wide">
            {creatorData?.short_bio}
          </p>

          {/* Primary Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mt-auto">
            <button className="px-6 py-4 rounded-xl bg-[#9EA4F9] text-white font-normal text-[15px] hover:bg-[#8e95f5] transition-colors w-full sm:w-auto">
              Join for free
            </button>
            <Link href={`/explore/creator-profile/membership?creatorId=${creatorData?._id}`}>
              <button className="px-6 py-4 rounded-xl bg-[#232332] text-[#D8D8E0] font-normal text-[15px] hover:bg-[#2b2b3d] border border-[#2A2A3A] transition-colors w-full sm:w-auto">
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