"use client";
import { useState, useEffect } from "react";
import { X, Heart, Star, } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

import WowModal from "@/components/modals/fans/WowModal";
import FilterDropdown from "./FilterDropdown";
import { useRouter } from "next/navigation";
import { myFetch } from "../../../../../../helpers/myFetch";
import { toast } from "sonner";
import { getImageUrl } from "@/utils/getImageUrl";
import Image from "next/image";

const FriendsFlirting = ({ friendsData }: any) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const router = useRouter();

  const [selectFriend, setSelectFriend] = useState(null);

  useEffect(() => {
    router.refresh()
  }, [])
  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);



  const handleMakeFavorite = async (friend: any) => {
    try {
      const response = await myFetch(`/favorite/${friend?._id}`, { method: "POST" });
      if (response?.success) {
        toast?.success(response?.message);
      } else {
        if (response?.error && Array.isArray(response.error)) {
          response.error.forEach((err: { message: string }) => {
            toast.error(err.message, { id: "friends" });
          });
        } else {
          toast.error(response?.message || "Something went wrong!", {
            id: "friends",
          });
        }
      }

    } catch (error) {
      console.log("error", error);
    }
  }

  // console.log(friendsData)
  return (
    <div className="w-full relative pb-10">
      {/* Top Filter Button */}
      <div className="flex justify-end mb-4">
        <FilterDropdown />
      </div>

      {friendsData?.length ? <div className="flex flex-col items-center">
        {/* Main Carousel Area */}
        <Carousel
          setApi={setApi}
          className="w-full max-w-120"
        >
          <CarouselContent>
            {friendsData?.map((friend: any) => (
              <CarouselItem key={friend._id}>
                <div className="bg-[#20232c] rounded-3xl overflow-hidden border border-[#2E2E36] shadow-xl">
                  {/* Card Image */}
                  <div className="relative w-full h-102.5">
                    <Image
                      src={getImageUrl(friend?.image)}
                      alt={friend?.name}
                      height={600}
                      width={600}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Card Info */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h2 className="text-[22px] font-medium text-white">
                        {friend?.name}, {friend?.age}
                      </h2>
                    </div>

                    <div className="flex items-center gap-1.5 mb-3.5">
                      <span className="text-[#EAB308] text-sm">✨</span>
                      <span className="text-[#06B6D4] font-medium text-[15px]">
                        {friend?.nickname}
                      </span>
                    </div>

                    <p className="text-[#9AA0A6] text-[15px] leading-relaxed">
                      {friend?.short_bio}
                    </p>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-6 mt-7">
                  {/* Cross Button */}
                  <button
                    onClick={() => api?.scrollNext()}
                    className="w-[52px] h-[52px] rounded-full bg-[#f45c5c] hover:bg-[#e05454] flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95 shadow-lg cursor-pointer"
                  >
                    <X className="w-[24px] h-[24px]" strokeWidth={2.5} />
                  </button>

                  {/* Wow Center Button */}
                  <WowModal friend={selectFriend}>
                    <div className="relative group cursor-pointer transition-transform hover:scale-105 active:scale-95">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-[#1c1c20] text-[#EFC341] text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center justify-center shadow-md whitespace-nowrap">
                        <span className="text-[10px] mr-1">🪙</span> 10
                      </div>
                      <button onClick={() => setSelectFriend(friend)} className="w-[76px] h-[76px] rounded-full bg-gradient-to-b from-[#FAC94A] to-[#F18D0E] flex flex-col items-center justify-center text-white shadow-[0_4px_20px_rgba(241,141,14,0.3)] cursor-pointer">
                        <Star fill="currentColor" className="w-[30px] h-[30px] mb-0.5" stroke="none" />
                        <span className="text-[13px] font-bold tracking-wide">Wow</span>
                      </button>
                    </div>
                  </WowModal>

                  {/* Love Button */}
                  <button
                    onClick={() => handleMakeFavorite(friend)}
                    className="w-[52px] h-[52px] rounded-full bg-[#fba1c7] hover:bg-[#e390b3] flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95 shadow-lg cursor-pointer"
                  >
                    <Heart fill="currentColor" stroke="none" className="w-[24px] h-[24px]" />
                  </button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Nav Chevrons (Outside Card) */}
          <CarouselPrevious className="hidden lg:flex -left-[120px] bg-[#222228] border-none text-white w-[80px] h-[80px] shadow-lg hover:bg-[#34343a] hover:text-white [&_svg]:!w-8 [&_svg]:!h-8" />
          <CarouselNext className="hidden lg:flex -right-[120px] bg-[#222228] border-none text-white w-[80px] h-[80px] shadow-lg hover:bg-[#34343a] hover:text-white [&_svg]:!w-8 [&_svg]:!h-8" />
        </Carousel>

        {/* Setup dots navigation mapped statically to match indicator styles */}
        <div className="flex justify-center items-center gap-1.5 mt-5">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${i + 1 === current
                ? "w-1.5 h-1.5 bg-[#9EA4F9]"
                : "w-1 h-1 bg-[#4C4C55]"
                }`}
            />
          ))}
        </div>


      </div> : <div className="col-span-full py-16 text-center text-zinc-500 text-[15px]">
        No friend found.
      </div>}

    </div>
  );
};

export default FriendsFlirting;