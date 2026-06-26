"use client";
import { creatorsData } from "@/constants/explore-data";
import { useRouter } from "next/navigation";
import CreatorFilter from "./CreatorFilter";
import { getImageUrl } from "@/utils/getImageUrl";


const BrowseCreators = ({ creatorData, categories }: {
  creatorData: any, categories?: {
    _id: string;
    name: string;
    image: string;
  }[]
}) => {
  const router = useRouter()
  return (
    <div className="w-full">

      <CreatorFilter categories={categories} />

      {/* Creator Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-5 pb-10">
        {creatorData?.map((creator: any) => (
          <div
            key={creator._id}
            onClick={() => router.push(`/explore/creator-profile?creatorId=${creator._id}`)}
            className="group relative rounded-2xl overflow-hidden border border-[#2A2A30] cursor-pointer bg-[#1c1c20]"
          >
            <img
              src={getImageUrl(creator?.image)}
              alt={creator?.name}
              className="object-cover w-full h-48 md:md:h-75 group-hover:scale-105 transition-transform duration-500"
            />

            {/* Gradient Dark Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-5 pt-20">
              <h3 className="text-white text-[19px] font-medium mb-0.5">
                {creator?.name}
              </h3>
              <p className="text-[#D4D4D8] text-[14px]">
                {creator?.nickname}
              </p>
              <p className="text-[#A1A1AA] text-[13px] mt-0.5">
                {creator?.members}
              </p>
            </div>
          </div>
        ))}

        {creatorsData?.length === 0 && (
          <div className="col-span-full py-16 text-center text-zinc-500 text-[15px]">
            No creators found in this timeline category.
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseCreators;