
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
  // console.log(user?.image)
  return (
    <header className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#242424] h-20 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3 pl-5  lg:pl-0">
        <Breadcrumbs items={title} />
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <TopbarNotifications userId={user?._id} />
        <Link href="/creator-profile" className="flex items-center gap-4">
          <div className="w-10.50 h-10.50  rounded-full bg-gray-100 overflow-hidden border border-[#242424] cursor-pointer">
            <Image src={getImageUrl(user?.image)} width={100} height={100} alt="avatar" className="w-12.5 h-12.5 object-cover object-top" />
          </div>
          <div>
            <h1 className="text-md font-bold tracking-tight">{user?.name}</h1>
            <p className="text-primary/70 text-sm">{user?.role}</p>
          </div>
        </Link>


      </div>
    </header>
  );
}
