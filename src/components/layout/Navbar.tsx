"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { LuShoppingCart } from "react-icons/lu";
import Breadcrumbs from "../ui/Breadcrumbs";
import { getImageUrl } from "@/utils/getImageUrl";
import { TopbarNotifications } from "../shared/Notification/TopbarNotifications";

export function Navbar({
  title = [],
  onMenuClick,
  profileData,
  cartCount = 0,
}: {
  title?: { label: string; href: string }[];
  onMenuClick?: () => void;
  profileData?: any;
  cartCount?: number;
}) {
  const userRole = profileData?.role || "FAN";
  const profileHref = userRole === "CREATOR" ? "/creator-home" : "/profile";

  const iconBtn =
    "flex cursor-pointer relative w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800/80 justify-center items-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 hover:border-zinc-700/80 active:scale-95 transition-all duration-200 shadow-inner";

  return (
    <header className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#242424] h-16 md:h-25 flex items-center justify-between gap-3 px-4 md:px-6">
      {/* LEFT */}
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className={`md:hidden ${iconBtn}`}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile logo */}
        <Link href="/" className="md:hidden flex items-center gap-2 shrink-0">
          <Image
            src="/logo.png"
            alt="Circa"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="text-lg font-semibold text-primary tracking-wide">
            Circa
          </span>
        </Link>

        {/* Desktop breadcrumbs */}
        <div className="hidden md:block min-w-0">
          {title.length > 0 && <Breadcrumbs items={title} />}
        </div>
      </div>

      {/* RIGHT — mobile/tablet actions (lg+ uses RightSidebarNav) */}
      <div className="flex lg:hidden items-center gap-2">
        <TopbarNotifications userId={profileData?._id} className={iconBtn} />

        <Link href="/add-to-card" aria-label="Cart">
          <button type="button" className={iconBtn}>
            <LuShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] min-w-5 h-5 px-1 flex items-center justify-center rounded-full font-semibold">
                {cartCount}
              </span>
            )}
          </button>
        </Link>

        <Link
          href={profileHref}
          aria-label="Profile"
          className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden border border-[#242424] shrink-0"
        >
          <Image
            src={getImageUrl(profileData?.image)}
            width={80}
            height={80}
            alt="avatar"
            className="w-10 h-10 object-cover"
          />
        </Link>
      </div>
    </header>
  );
}
