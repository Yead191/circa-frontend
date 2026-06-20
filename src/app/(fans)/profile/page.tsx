
import ProfileMenu from "@/components/ui/fans/profile/ProfileMenu";
import getProfile from "@/utils/getProfile";
import Link from "next/link";
import { getImageUrl } from "@/utils/getImageUrl";
import Image from "next/image";


export default async function ProfilePage() {
  const user = await getProfile();
  // console.log(user);
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row gap-3 justify-between mb-7">

        {/* Left */}
        <div className="flex flex-col items-center md:flex-row gap-3">
          <Image
            src={getImageUrl(user?.image)}
            alt="profile img"
            height={80}
            width={80}
            className="w-14.5 h-14.5 rounded-full object-cover border-[2.5px] border-[#8b7cf8] bg-[#1a1b2e]"
          />

          <div className="text-center md:text-left">
            <div className="text-white font-bold">
              {user?.name}
            </div>
            <div className="text-gray-400 text-sm">
              {user?.email}
            </div>
          </div>
        </div>

        {/* Right */}
        <Link href="/become-creator">
          <button className="w-full sm:w-auto bg-[#8b7cf8] text-white rounded-xl px-5 py-2.5 font-medium hover:opacity-90 transition">
            Be Creator
          </button>
        </Link>

      </div>

      <ProfileMenu />
    </div>
  );
}
