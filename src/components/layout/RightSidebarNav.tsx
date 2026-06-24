import Image from "next/image";
import Link from "next/link";
import { LuShoppingCart } from "react-icons/lu";
import { getImageUrl } from "@/utils/getImageUrl";
import { TopbarNotifications } from "../shared/Notification/TopbarNotifications";

export function RightSidebarNav({ profileData, cartCount }: { profileData: any, cartCount: number }) {

  const userRole = profileData?.role || "FAN";

  return (
    <header className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-md h-25 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-end justify-end w-full">
        <div className="flex items-center gap-2 md:gap-3">
          <TopbarNotifications userId={profileData?._id} />

          <Link href="/add-to-card">
            <button className="hidden sm:flex cursor-pointer relative w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800/80 justify-center items-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 hover:border-zinc-700/80 transition-all duration-200 shadow-inner">
              <LuShoppingCart size={21} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </Link>

          <Link href={`${userRole === "CREATOR" ? "/creator-home" : "/profile"}`} className="w-10.5 h-10.5 rounded-xl bg-gray-100 overflow-hidden border border-[#242424] cursor-pointer">
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
