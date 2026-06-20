
import Image from "next/image";
import { getImageUrl } from "@/utils/getImageUrl";


const MyCreator = ({ creatorData }: any) => {
  return (
    <div className="w-full">
      {/* Creator Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-10">
        {creatorData?.map((creator: any) => (
          <div
            key={creator?._id}
            className="group relative rounded-2xl overflow-hidden border border-[#2A2A30] cursor-pointer bg-[#1c1c20]"
          >
            <Image
              src={getImageUrl(creator?.image)}
              alt={creator?.name}
              width={500}
              height={300}
              className="object-cover w-full h-[300px] group-hover:scale-105 transition-transform duration-500"
            />

            {/* Gradient Dark Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-5 pt-20">
              <h3 className="text-white text-[19px] font-medium mb-0.5">
                {creator?.name}
              </h3>
              <p className="text-[#D4D4D8] text-[14px]">
                {creator?.nickname}
              </p>
              <p className="text-[#A1A1AA] text-[13px] mt-0.5">
                {creator?.members ?? 0} members
              </p>
            </div>
          </div>
        ))}

        {creatorData?.length === 0 && (
          <div className="col-span-full py-16 text-center text-zinc-500 text-[15px]">
            No creators found in this timeline category.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCreator;