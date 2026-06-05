
import Link from "next/link";
import Breadcrumbs from "../../Breadcrumbs";
import { MdOutlineNotificationsNone } from "react-icons/md";
import { LuShoppingCart } from "react-icons/lu";
import Image from "next/image";
import { getImageUrl } from "@/utils/getImageUrl";

export default function Topbar({
  title = [],
  user
}: {
  title?: { label: string; href: string }[];
  onMenuClick?: () => void;
  user: any;
}) {
  // console.log(user?.image)
  return (
    <header className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#242424] h-20 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3 pl-5  lg:pl-0">
        <Breadcrumbs items={title} />
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <Link href="/creator-profile" className="flex items-center gap-4">
          <div className="w-10.50 h-10.50  rounded-full bg-gray-100 overflow-hidden border border-[#242424] cursor-pointer">
            <Image src={getImageUrl(user?.image)} width={100} height={100} alt="avatar" className="w-12.5 h-12.5 object-cover object-top" />
          </div>
          <div>
            <h1 className="text-md font-bold tracking-tight">{user?.name}</h1>
            <p className="text-primary/70 text-sm">{user?.role}</p>
          </div>
        </Link>
        <Link href="/notifications">  <button className="hidden sm:flex cursor-pointer relative w-11 h-11 rounded-full bg-[#15131A] border border-[#242424] justify-center items-center text-gray-400 hover:text-white transition-colors">
          <MdOutlineNotificationsNone size={25} />
          {/* Badge */}
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
            3
          </span>
        </button>
        </Link>
        <Link href="/add-to-card">
          <button className="hidden sm:flex cursor-pointer relative w-11 h-11 rounded-full bg-[#15131A] border border-[#242424] justify-center items-center text-gray-400 hover:text-white transition-colors">
            <LuShoppingCart size={21} />
            {/* Badge */}
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
              2
            </span>
          </button>
        </Link>

      </div>
    </header>
  );
}
