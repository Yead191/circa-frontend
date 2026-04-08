"use client";

import { Post } from "@/types/post";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { myFetch } from "../../../../../../../helpers/myFetch";
import { useEffect, useState } from "react";
import { imageFormatter } from "../../../../../../../helpers/imageFormatter";

const MembershipRightSide = () => {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("creatorId");

  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMessaging, setIsMessaging] = useState(false);

  const handleMessage = async () => {
    if (!creator?._id) return;
    setIsMessaging(true);
    try {
      const res = await myFetch(`/chat/${creator._id}`, {
        method: "POST",
      });
      if (res?.success) {
        router.push('/message');
      } else {
        console.error("Failed to start chat:", res?.message);
      }
    } catch (error) {
      console.error("Message fetch error:", error);
    } finally {
      setIsMessaging(false);
    }
  };


  useEffect(() => {
    if (!id) return;

    const fetchCreator = async () => {
      try {
        const res = await myFetch(`/user/creator/${id}`);
        // console.log("creator", res);
        setCreator(res?.data);
      } catch (error) {
        console.error("Failed to fetch creator:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [id]);

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div>
      <div className="flex flex-col gap-4">
        {/* Profile Card */}
        <div className="bg-[#1C1A24] rounded-2xl p-6 border border-gray-800 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
            <Image
              src={imageFormatter(creator?.image)}
              alt={creator?.name}
              width={80}
              height={80}
            />
          </div>

          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            {creator?.role}
          </p>

          <h3 className="font-bold text-xl mb-3">
            {creator?.name}
          </h3>

          <p className="text-sm text-gray-400 mb-6 px-2 leading-relaxed">
            {creator?.short_bio}
          </p>

          <button
            onClick={handleMessage}
            disabled={isMessaging}
            className="w-full bg-[#D08BFF] cursor-pointer hover:bg-[#b070de] text-black font-medium py-3 rounded-xl text-white text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMessaging ? "Starting chat..." : "Message"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipRightSide;