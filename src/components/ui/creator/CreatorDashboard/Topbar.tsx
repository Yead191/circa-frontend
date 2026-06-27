
import Link from "next/link";
import Breadcrumbs from "../../Breadcrumbs";
import Image from "next/image";
import { getImageUrl } from "@/utils/getImageUrl";
import { TopbarNotifications } from "@/components/shared/Notification/TopbarNotifications";

export default function Topbar({
  title = [],
  user
}: {
  title?: { label: string; href: string }[];
  onMenuClick?: () => void;
  user: any;
}) {
  const iconBtn =
    "flex cursor-pointer relative w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800/80 justify-center items-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 hover:border-zinc-700/80 active:scale-95 transition-all duration-200 shadow-inner";
  // console.log(user?.image)
  return (
    <header className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#242424] h-16 md:h-20 flex items-center justify-between px-4 md:px-6">
      {/* Left side */}
      <div className="flex items-center min-w-0 pl-12 lg:pl-0">
        {/* Mobile logo — the sidebar logo is off-canvas on mobile */}
        <Link href="/creator-home" className="flex items-center gap-2 lg:hidden">
          <Image
            src="/logo.png"
            alt="Circa Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="text-lg font-medium text-primary tracking-wide">
            Circa
          </span>
        </Link>

        {/* Desktop breadcrumbs */}
        <div className="hidden lg:flex items-center gap-3">
          <Breadcrumbs items={title} />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <TopbarNotifications userId={user?._id} className={iconBtn} />
        <Link href="/creator-profile" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-[#242424] cursor-pointer shrink-0">
            <Image
              src={getImageUrl(user?.image)}
              width={100}
              height={100}
              alt="avatar"
              className="w-full h-full object-cover object-top"
            />
          </div>
          {/* Name/role — desktop only */}
          <div className="hidden lg:block">
            <h1 className="text-md font-bold tracking-tight">{user?.name}</h1>
            <p className="text-primary/70 text-sm">{user?.role}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
