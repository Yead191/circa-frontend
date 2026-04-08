import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LuShoppingCart } from "react-icons/lu";
import { MdOutlineNotificationsNone } from "react-icons/md";
import getProfile from "../../../helpers/getProfile";
import { io } from "socket.io-client";
import { myFetch } from "../../../helpers/myFetch";
import { getImageUrl } from "@/utils/getImageUrl";

export function RightSidebarNav() {
  const [profileData, setProfileData] = useState<any>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [cartCount, setCartCount] = useState(0); 
  const userRole = profileData?.role || "FAN";

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await myFetch('/cart', { tags: ['cart'] });
        if (res?.success && res?.data?.cart) {
          setCartCount(res?.data?.cart?.length);
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    const getProfileData = async () => {
      const response = await getProfile();
      if (response) setProfileData(response);
    };
    getProfileData();
  }, []);

  useEffect(() => {
    if (!profileData?._id) return;

    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://68.178.164.48:5005",
      {
        query: { userId: profileData._id },
      }
    );

    const eventName = `get-notification::${profileData._id}`;

    socket.on(eventName, () => {
      setNotificationCount((prev) => prev + 1);
    });

    return () => {
      socket.off(eventName);
      socket.disconnect();
    };
  }, [profileData?._id]);

  return (
    <header className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-md h-25 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-end justify-end w-full">
        <div className="flex items-center gap-2 md:gap-3">
          <Link href="/notifications">
            <button className="hidden sm:flex cursor-pointer relative w-11 h-11 rounded-full bg-[#15131A] border border-[#242424] justify-center items-center text-gray-400 hover:text-white transition-colors">
              <MdOutlineNotificationsNone size={25} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                  {notificationCount}
                </span>
              )}
            </button>
          </Link>

          <Link href="/add-to-card">
            <button className="hidden sm:flex cursor-pointer relative w-11 h-11 rounded-full bg-[#15131A] border border-[#242424] justify-center items-center text-gray-400 hover:text-white transition-colors">
              <LuShoppingCart size={21} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </Link>

          <Link href={`${userRole=== "CREATOR" ? "/creator-home" : "/profile"}`} className="w-10.5 h-10.5 rounded-full bg-gray-100 overflow-hidden border border-[#242424] cursor-pointer">
            <Image
              src={getImageUrl(profileData?.image)}
              width={100}
              height={100}
              alt="avatar"
              className="w-10.5 h-10.5 object-cover"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}