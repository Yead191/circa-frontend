'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { myFetch } from '../../../../../helpers/myFetch'
import { imageFormatter } from '../../../../../helpers/imageFormatter'
import Link from 'next/link'

const FriendsFlirting = () => {
  const [friendsFlirting, setFriendsFlirting] = useState([]);

  useEffect(() => {
    const getCreators = async () => {
      try {
        const res = await myFetch('/user/friend-flirty');
        // console.log(res?.data);
        setFriendsFlirting(res?.data?.slice(0, 2) ?? []);
      } catch (err) {
        console.error('Failed to fetch friends flirty:', err);
      }
    };

    getCreators();
  }, []); // ← empty array = runs once only

  // console.log(friendsFlirting);
  return (
    <div className="bg-[#15131A] border border-gray-800/80 rounded-2xl p-5">
      <div className="mb-5 border-b border-[#2D2D2D] pb-4">
        <h3 className="flex items-center gap-2 text-base font-normal text-white">
          <span className="relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#18C964]">
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
          </span>
          Friends & Flirting
        </h3>
      </div>

      <div className="flex flex-col gap-4 mb-5">
        {friendsFlirting?.map((user: any) => (
          <div key={user._id} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full relative overflow-hidden shrink-0">
              <Image
                src={imageFormatter(user?.image)}
                alt={user?.name}
                fill
                className="object-cover"
              />
            </div>
            <h4 className="text-sm font-medium text-white">{user?.name}</h4>
          </div>
        ))}
      </div>

      <Link href="/explore?tab=friends"><button className="w-full bg-[#252330] hover:bg-[#2F2C3D] text-gray-300 font-semibold py-2.5 rounded-xl text-xs transition-colors">
        View All
      </button></Link>
    </div>
  )
}

export default FriendsFlirting